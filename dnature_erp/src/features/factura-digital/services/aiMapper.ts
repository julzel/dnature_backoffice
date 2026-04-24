import type { AIExtractionResult, ExtractedField } from '../types/invoice'

type RawAIField = {
  value?: unknown
  confidence?: unknown
}

export interface RawAIExtractionResponse {
  provider?: RawAIField
  invoiceNumber?: RawAIField
  date?: RawAIField
  currency?: RawAIField
  subtotal?: RawAIField
  tax?: RawAIField
  total?: RawAIField
}

function normalizeConfidence(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0
  }

  if (value < 0) {
    return 0
  }

  if (value > 1) {
    return 1
  }

  return value
}

function toStringField(field?: RawAIField): ExtractedField<string> {
  if (typeof field?.value === 'string') {
    return {
      value: field.value,
      confidence: normalizeConfidence(field.confidence),
    }
  }

  return {
    value: '',
    confidence: 0,
  }
}

function toNumberField(field?: RawAIField): ExtractedField<number> {
  if (typeof field?.value === 'number' && Number.isFinite(field.value)) {
    return {
      value: field.value,
      confidence: normalizeConfidence(field.confidence),
    }
  }

  if (typeof field?.value === 'string') {
    const normalized = Number(field.value)

    if (Number.isFinite(normalized)) {
      return {
        value: normalized,
        confidence: normalizeConfidence(field.confidence),
      }
    }
  }

  return {
    value: 0,
    confidence: 0,
  }
}

export function mapResponseToExtractionResult(
  response: RawAIExtractionResponse,
): AIExtractionResult {
  return {
    provider: toStringField(response.provider),
    invoiceNumber: toStringField(response.invoiceNumber),
    date: toStringField(response.date),
    currency: toStringField(response.currency),
    subtotal: toNumberField(response.subtotal),
    tax: toNumberField(response.tax),
    total: toNumberField(response.total),
  }
}
