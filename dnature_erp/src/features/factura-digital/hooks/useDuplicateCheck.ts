import { useCallback, useState } from 'react'
import { checkDuplicate, InvoiceValidationError } from '../services/invoiceService'
import type { DuplicateCheckResult } from '../types/invoice'

interface UseDuplicateCheckReturn {
  isChecking: boolean
  result: DuplicateCheckResult | null
  error: string | null
  checkDuplicate: (invoiceNumber: string, provider: string) => Promise<void>
  reset: () => void
}

/**
 * Hook para manejar la verificación de duplicados de facturas
 * @returns Objeto con estado y funciones de control
 */
export function useDuplicateCheck(): UseDuplicateCheckReturn {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<DuplicateCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const check = useCallback(async (invoiceNumber: string, provider: string) => {
    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      const checkResult = await checkDuplicate(invoiceNumber, provider)
      setResult(checkResult)

      if (checkResult.error) {
        setError(checkResult.error)
      }
    } catch (err) {
      const errorMessage =
        err instanceof InvoiceValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Error desconocido al verificar duplicados.'

      setError(errorMessage)
      setResult({
        isDuplicate: false,
        error: errorMessage,
      })
    } finally {
      setIsChecking(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsChecking(false)
    setResult(null)
    setError(null)
  }, [])

  return {
    isChecking,
    result,
    error,
    checkDuplicate: check,
    reset,
  }
}
