import { useMemo, useState } from 'react'
import type { AIExtractionResult, InvoiceData } from '../types/invoice'
import { validateRequiredFields, validateTotalConsistency } from '../validators/invoiceValidator'

type InvoiceErrors = Partial<Record<keyof InvoiceData, string>>
type ConfidenceLevels = Partial<Record<keyof InvoiceData, number>>

interface UseInvoiceFormReturn {
  values: InvoiceData
  errors: InvoiceErrors
  confidenceLevels: ConfidenceLevels
  handleChange: (field: keyof InvoiceData, value: string | number) => void
  validate: () => boolean
  isValid: boolean
}

function mapExtractionToInvoiceData(extraction: AIExtractionResult): InvoiceData {
  return {
    provider: extraction.provider.value,
    invoiceNumber: extraction.invoiceNumber.value,
    date: extraction.date.value,
    currency: extraction.currency.value,
    subtotal: extraction.subtotal.value,
    tax: extraction.tax.value,
    total: extraction.total.value,
  }
}

function mapConfidenceLevels(extraction: AIExtractionResult): ConfidenceLevels {
  return {
    provider: extraction.provider.confidence,
    invoiceNumber: extraction.invoiceNumber.confidence,
    date: extraction.date.confidence,
    currency: extraction.currency.confidence,
    subtotal: extraction.subtotal.confidence,
    tax: extraction.tax.confidence,
    total: extraction.total.confidence,
  }
}

function buildErrors(values: InvoiceData): InvoiceErrors {
  const errors = validateRequiredFields(values)
  const totalError = validateTotalConsistency(values.subtotal, values.tax, values.total)

  if (totalError) {
    errors.total = totalError
  }

  return errors
}

export function useInvoiceForm(extraction: AIExtractionResult): UseInvoiceFormReturn {
  const [values, setValues] = useState<InvoiceData>(() => mapExtractionToInvoiceData(extraction))
  const [errors, setErrors] = useState<InvoiceErrors>({})

  const confidenceLevels = useMemo(() => mapConfidenceLevels(extraction), [extraction])
  const isValid = useMemo(() => Object.keys(buildErrors(values)).length === 0, [values])

  const handleChange = (field: keyof InvoiceData, value: string | number) => {
    setValues((currentValues) => {
      const nextValue =
        typeof currentValues[field] === 'number'
          ? typeof value === 'number'
            ? value
            : value === ''
              ? Number.NaN
              : Number(value)
          : String(value)

      const nextValues = {
        ...currentValues,
        [field]: nextValue,
      } as InvoiceData

      setErrors(buildErrors(nextValues))
      return nextValues
    })
  }

  const validate = () => {
    const nextErrors = buildErrors(values)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  return {
    values,
    errors,
    confidenceLevels,
    handleChange,
    validate,
    isValid,
  }
}
