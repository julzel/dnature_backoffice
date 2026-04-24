import { useEffect } from 'react'
import { useAIProcessing } from '../hooks/useAIProcessing'
import type { AIExtractionResult } from '../types/invoice'
import { ConfirmationDialog } from './ConfirmationDialog'

interface ConfirmAIStepProps {
  file: File
  onCancel: () => void
  onSuccess: (result: AIExtractionResult) => void
}

export function ConfirmAIStep({ file, onCancel, onSuccess }: ConfirmAIStepProps) {
  const { error, isProcessing, processInvoice, reset, retry, result } = useAIProcessing()

  useEffect(() => {
    if (result) {
      onSuccess(result)
    }
  }, [onSuccess, result])

  useEffect(() => reset, [reset])

  const handleConfirm = async () => {
    await processInvoice(file)
  }

  const handleRetry = async () => {
    await retry()
  }

  return (
    <ConfirmationDialog
      error={error}
      file={file}
      isProcessing={isProcessing}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      onRetry={handleRetry}
      open
    />
  )
}
