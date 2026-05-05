import { useCallback, useState } from 'react'
import { extractInvoiceData } from '../services/aiService'
import type { AIExtractionResult } from '../types/invoice'

interface UseAIProcessingReturn {
  isProcessing: boolean
  error: string | null
  result: AIExtractionResult | null
  processInvoice: (file: File) => Promise<void>
  retry: () => Promise<void>
  reset: () => void
}

export function useAIProcessing(): UseAIProcessingReturn {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AIExtractionResult | null>(null)

  const processInvoice = useCallback(async (nextFile: File) => {
    setFile(nextFile)
    setIsProcessing(true)
    setError(null)

    try {
      setResult(await extractInvoiceData(nextFile))
    } catch (nextError) {
      setResult(null)
      setError(nextError instanceof Error ? nextError.message : 'No se pudo procesar la factura.')
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const retry = useCallback(async () => {
    if (file) {
      await processInvoice(file)
    }
  }, [file, processInvoice])

  const reset = useCallback(() => {
    setFile(null)
    setIsProcessing(false)
    setError(null)
    setResult(null)
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
