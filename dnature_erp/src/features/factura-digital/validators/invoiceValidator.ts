import type { InvoiceData } from '../types/invoice'

export type InvoiceErrors = Partial<Record<keyof InvoiceData, string>>

function isBlank(value: string) {
  return value.trim().length === 0
}

function isMissingNumber(value: number) {
  return Number.isNaN(value)
}

export function validateRequiredFields(data: InvoiceData): InvoiceErrors {
  const errors: InvoiceErrors = {}

  if (isBlank(data.provider)) {
    errors.provider = 'El proveedor es obligatorio.'
  }

  if (isBlank(data.invoiceNumber)) {
    errors.invoiceNumber = 'El numero de factura es obligatorio.'
  }

  if (isBlank(data.date)) {
    errors.date = 'La fecha es obligatoria.'
  }

  if (isBlank(data.currency)) {
    errors.currency = 'La moneda es obligatoria.'
  }

  if (isMissingNumber(data.subtotal)) {
    errors.subtotal = 'El subtotal es obligatorio.'
  }

  if (isMissingNumber(data.tax)) {
    errors.tax = 'El impuesto es obligatorio.'
  }

  if (isMissingNumber(data.total)) {
    errors.total = 'El total es obligatorio.'
  }

  return errors
}

export function validateTotalConsistency(subtotal: number, tax: number, total: number): string | null {
  if ([subtotal, tax, total].some((value) => Number.isNaN(value))) {
    return null
  }

  const expectedTotal = subtotal + tax
  const difference = Math.abs(expectedTotal - total)

  if (difference > 0.01) {
    return 'El total debe ser igual a subtotal + impuesto.'
  }

  return null
}
