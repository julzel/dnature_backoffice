import { useCallback, useState } from 'react'
import { extractInvoiceData } from '../services/aiService'
import type { AIExtractionResult } from '../types/invoice'

interface UseAIProcessingReturn {
  isProcessing: boolean
  error: string | null
  result: AIExtractionResult | null
  processInvoice: (file: File) => Promise<AIExtractionResult | null>
  retry: () => Promise<AIExtractionResult | null>
  reset: () => void
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'No fue posible extraer los datos. Intente con una imagen mas clara.'
}

export function useAIProcessing(): UseAIProcessingReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIExtractionResult | null>(null)
  const [lastFile, setLastFile] = useState<File | null>(null)

  const processInvoice = useCallback(async (file: File) => {
    setLastFile(file)
    setIsProcessing(true)
    setError(null)

    try {
      const response = await extractInvoiceData(file)
      setResult(response)
      return response
    } catch (processingError) {
      setResult(null)
      setError(getErrorMessage(processingError))
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const retry = useCallback(async () => {
    if (!lastFile) {
      return null
    }

    return processInvoice(lastFile)
  }, [lastFile, processInvoice])

  const reset = useCallback(() => {
    setIsProcessing(false)
    setError(null)
    setResult(null)
    setLastFile(null)
  }, [])

  return {
    isProcessing,
    error,
    result,
    processInvoice,
    retry,
    reset,
  }
}
