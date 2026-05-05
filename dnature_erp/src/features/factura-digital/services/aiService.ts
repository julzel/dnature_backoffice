import type { AIExtractionResult } from '../types/invoice'
import { mapResponseToExtractionResult } from './aiMapper'

const AI_ENDPOINT = import.meta.env.VITE_AI_SERVICE_URL
const AI_API_KEY = import.meta.env.VITE_AI_SERVICE_API_KEY
const AI_TIMEOUT = Number(import.meta.env.VITE_AI_SERVICE_TIMEOUT ?? 30000)

function getServiceUrl() {
  if (!AI_ENDPOINT) {
    throw new Error('No se configuro VITE_AI_SERVICE_URL para el servicio de IA.')
  }

  if (AI_API_KEY) {
    const url = new URL(AI_ENDPOINT)
    url.searchParams.set('key', AI_API_KEY)
    return url.toString()
  }

  return AI_ENDPOINT.endsWith('/extract') ? AI_ENDPOINT : `${AI_ENDPOINT.replace(/\/$/, '')}/extract`
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }

    reader.onerror = () => reject(new Error('No se pudo leer el archivo de factura.'))
    reader.readAsDataURL(file)
  })
}

async function buildRequest(file: File): Promise<RequestInit> {
  if (!AI_API_KEY) {
    const formData = new FormData()
    formData.append('invoice', file)

    return {
      method: 'POST',
      body: formData,
    }
  }

  const base64File = await readFileAsBase64(file)

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text:
                'Extrae los datos de esta factura y responde solo JSON valido con esta forma: ' +
                '{"provider":{"value":"","confidence":0},"invoiceNumber":{"value":"","confidence":0},' +
                '"date":{"value":"YYYY-MM-DD","confidence":0},"currency":{"value":"","confidence":0},' +
                '"subtotal":{"value":0,"confidence":0},"tax":{"value":0,"confidence":0},' +
                '"total":{"value":0,"confidence":0}}.',
            },
            {
              inlineData: {
                mimeType: file.type || 'application/octet-stream',
                data: base64File,
              },
            },
          ],
        },
      ],
    }),
  }
}

export async function extractInvoiceData(file: File): Promise<AIExtractionResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), AI_TIMEOUT)

  try {
    const request = await buildRequest(file)
    const response = await fetch(getServiceUrl(), {
      ...request,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Error del servicio de IA: ${response.status}`)
    }

    return mapResponseToExtractionResult(await response.json())
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('El servicio de IA tardo demasiado en responder.')
    }

    if (error instanceof Error) {
      throw error
    }

    throw new Error('No se pudo procesar la factura con IA.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}
