import { mapResponseToExtractionResult } from './aiMapper'
import type { AIExtractionResult } from '../types/invoice'
import type { RawAIExtractionResponse } from './aiMapper'

const DEFAULT_AI_TIMEOUT = 30_000
const extractPath = '/extract'

function getAIEndpoint() {
  const endpoint = import.meta.env.VITE_AI_SERVICE_URL

  if (!endpoint) {
    throw new Error('La URL del servicio de IA no esta configurada.')
  }

  return endpoint.replace(/\/+$/, '')
}

function getAITimeout() {
  const rawTimeout = import.meta.env.VITE_AI_TIMEOUT_MS
  const parsedTimeout = Number(rawTimeout)

  if (!rawTimeout || !Number.isFinite(parsedTimeout) || parsedTimeout <= 0) {
    return DEFAULT_AI_TIMEOUT
  }

  return parsedTimeout
}

function buildAIUrl() {
  return `${getAIEndpoint()}${extractPath}`
}

function getErrorMessage(response: Response) {
  if (response.status >= 500) {
    return `Error del servicio de IA: ${response.status}`
  }

  if (response.status >= 400) {
    return `Solicitud invalida al servicio de IA: ${response.status}`
  }

  return `No fue posible procesar la respuesta del servicio de IA: ${response.status}`
}

export async function extractInvoiceData(file: File): Promise<AIExtractionResult> {
  const formData = new FormData()
  formData.append('invoice', file)

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), getAITimeout())

  try {
    const response = await fetch(buildAIUrl(), {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(getErrorMessage(response))
    }

    const payload = (await response.json()) as RawAIExtractionResponse
    return mapResponseToExtractionResult(payload)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('La solicitud al servicio de IA excedio el tiempo de espera.')
    }

    if (error instanceof TypeError) {
      throw new Error('No fue posible conectar con el servicio de IA.')
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export const aiServiceConfig = {
  DEFAULT_AI_TIMEOUT,
}
