import type { AIExtractionResult, ExtractedField, InvoiceData } from '../types/invoice'

type RawRecord = Record<string, unknown>

const invoiceFields: Array<keyof InvoiceData> = [
  'provider',
  'invoiceNumber',
  'date',
  'currency',
  'subtotal',
  'tax',
  'total',
]

const aliases: Record<keyof InvoiceData, string[]> = {
  provider: ['provider', 'proveedor', 'supplier', 'vendor'],
  invoiceNumber: ['invoiceNumber', 'invoice_number', 'numeroFactura', 'numero_factura', 'number'],
  date: ['date', 'fecha', 'invoiceDate', 'invoice_date'],
  currency: ['currency', 'moneda'],
  subtotal: ['subtotal', 'subTotal', 'base_imponible'],
  tax: ['tax', 'impuesto', 'iva', 'igv'],
  total: ['total', 'importe_total', 'monto_total'],
}

const defaultValues: InvoiceData = {
  provider: '',
  invoiceNumber: '',
  date: '',
  currency: '',
  subtotal: Number.NaN,
  tax: Number.NaN,
  total: Number.NaN,
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function stripJsonFence(value: string) {
  return value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
}

function parseJsonText(value: string): unknown {
  const cleaned = stripJsonFence(value)
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1) {
    return {}
  }

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
}

function unwrapGeminiResponse(raw: unknown): unknown {
  if (!isRecord(raw)) {
    return raw
  }

  const candidates = raw.candidates
  if (!Array.isArray(candidates) || !isRecord(candidates[0])) {
    return raw
  }

  const content = candidates[0].content
  if (!isRecord(content) || !Array.isArray(content.parts)) {
    return raw
  }

  const textPart = content.parts.find((part) => isRecord(part) && typeof part.text === 'string')
  if (!isRecord(textPart) || typeof textPart.text !== 'string') {
    return raw
  }

  return parseJsonText(textPart.text)
}

function getNestedData(raw: unknown): RawRecord {
  const unwrapped = unwrapGeminiResponse(raw)

  if (!isRecord(unwrapped)) {
    return {}
  }

  for (const key of ['data', 'invoice', 'factura', 'result', 'extraction']) {
    if (isRecord(unwrapped[key])) {
      return unwrapped[key]
    }
  }

  return unwrapped
}

function findRawField(data: RawRecord, field: keyof InvoiceData): unknown {
  for (const alias of aliases[field]) {
    if (alias in data) {
      return data[alias]
    }
  }

  return undefined
}

function findConfidence(rawField: unknown, data: RawRecord, field: keyof InvoiceData) {
  if (isRecord(rawField) && typeof rawField.confidence === 'number') {
    return rawField.confidence
  }

  const confidenceKey = `${field}Confidence`
  if (typeof data[confidenceKey] === 'number') {
    return data[confidenceKey]
  }

  if (isRecord(data.confidence) && typeof data.confidence[field] === 'number') {
    return data.confidence[field]
  }

  return 0
}

function getFieldValue(rawField: unknown): unknown {
  if (isRecord(rawField) && 'value' in rawField) {
    return rawField.value
  }

  return rawField
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value !== 'string') {
    return Number.NaN
  }

  const normalized = value.replace(/[^\d,.-]/g, '').replace(',', '.')
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? Number.NaN : parsed
}

function normalizeValue(field: keyof InvoiceData, value: unknown) {
  if (['subtotal', 'tax', 'total'].includes(field)) {
    return normalizeNumber(value)
  }

  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

function toExtractedField(field: keyof InvoiceData, data: RawRecord): ExtractedField<string | number> {
  const rawField = findRawField(data, field)
  const value = normalizeValue(field, getFieldValue(rawField))
  const confidence = findConfidence(rawField, data, field)

  return {
    value,
    confidence: Math.min(Math.max(confidence, 0), 1),
  }
}

export function mapResponseToExtractionResult(raw: unknown): AIExtractionResult {
  const data = getNestedData(raw)

  return invoiceFields.reduce((result, field) => {
    return {
      ...result,
      [field]: toExtractedField(field, data),
    }
  }, {} as AIExtractionResult)
}

export { defaultValues }
