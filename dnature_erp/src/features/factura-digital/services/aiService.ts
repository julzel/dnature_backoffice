import type { AIExtractionResult } from '../types/invoice'

const MOCK_DELAY_MS = 1200

function normalizeAmount(value: number) {
  return Number(value.toFixed(2))
}

export async function extractInvoiceData(file: File): Promise<AIExtractionResult> {
  await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS))

  if (file.name.toLowerCase().includes('error')) {
    throw new Error('No fue posible extraer los datos. Intente con una imagen mas clara.')
  }

  const sizeFactor = Math.max(file.size, 10_000) / 10_000
  const subtotal = normalizeAmount(100 * sizeFactor)
  const tax = normalizeAmount(subtotal * 0.18)
  const total = normalizeAmount(subtotal + tax)

  return {
    provider: { value: 'Proveedor demo SAC', confidence: 0.94 },
    invoiceNumber: { value: `F-${file.name.replace(/\W+/g, '').slice(0, 8).toUpperCase() || '0001'}`, confidence: 0.91 },
    date: { value: '2026-04-24', confidence: 0.89 },
    currency: { value: 'PEN', confidence: 0.96 },
    subtotal: { value: subtotal, confidence: 0.87 },
    tax: { value: tax, confidence: 0.84 },
    total: { value: total, confidence: 0.9 },
  }
}
