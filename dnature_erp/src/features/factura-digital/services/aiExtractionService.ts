import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIExtractionResult } from '../types/invoice'
import { INVOICE_EXTRACTION_PROMPT } from './invoicePrompt'

// ─── Errores tipados ──────────────────────────────────────────────────────────

export class ExtractionError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'ExtractionError'
    this.cause = cause
  }
}

export class MissingApiKeyError extends ExtractionError {
  constructor() {
    super(
      'La API key de Gemini no está configurada. Agrega VITE_GEMINI_API_KEY en tu archivo .env',
    )
    this.name = 'MissingApiKeyError'
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key || typeof key !== 'string' || key.trim() === '') {
    throw new MissingApiKeyError()
  }
  return key.trim()
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // El resultado tiene el formato "data:<mimeType>;base64,<datos>"
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new ExtractionError('No se pudo convertir el archivo a base64.'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(new ExtractionError('Error al leer el archivo.', reader.error))
    reader.readAsDataURL(file)
  })
}

function parseGeminiResponse(raw: string): AIExtractionResult {
  // Gemini a veces envuelve el JSON en bloques de código markdown aunque se le pida que no
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new ExtractionError(
      'La respuesta de Gemini no es un JSON válido. Intenta nuevamente.',
    )
  }

  // Validación mínima de la forma del objeto
  const required = ['provider', 'invoiceNumber', 'date', 'currency', 'subtotal', 'tax', 'total']
  for (const key of required) {
    if (!(key in (parsed as Record<string, unknown>))) {
      throw new ExtractionError(`La respuesta de Gemini no contiene el campo esperado: "${key}".`)
    }
  }

  return parsed as AIExtractionResult
}

// ─── Servicio principal ───────────────────────────────────────────────────────

/**
 * Envía un archivo de factura a Gemini 2.0 Flash y devuelve los datos
 * extraídos como un `AIExtractionResult` con niveles de confianza por campo.
 *
 * @throws {MissingApiKeyError} si VITE_GEMINI_API_KEY no está configurada.
 * @throws {ExtractionError} si ocurre cualquier otro error durante la extracción.
 */
export async function extractInvoiceData(file: File): Promise<AIExtractionResult> {
  const apiKey = getApiKey()

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  let base64Data: string
  try {
    base64Data = await fileToBase64(file)
  } catch (error) {
    if (error instanceof ExtractionError) throw error
    throw new ExtractionError('No se pudo preparar el archivo para su envío.', error)
  }

  let rawText: string
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      },
      INVOICE_EXTRACTION_PROMPT,
    ])
    rawText = result.response.text()
  } catch (error) {
    throw new ExtractionError(
      'Error al comunicarse con la API de Gemini. Verifica tu API key y tu conexión a internet.',
      error,
    )
  }

  return parseGeminiResponse(rawText)
}
