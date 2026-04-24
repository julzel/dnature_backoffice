import { mapResponseToExtractionResult } from '../services/aiMapper'

describe('mapResponseToExtractionResult', () => {
  it('maps a valid API payload into AIExtractionResult', () => {
    const result = mapResponseToExtractionResult({
      provider: { value: 'Proveedor Uno', confidence: 0.92 },
      invoiceNumber: { value: 'F001-123', confidence: 0.88 },
      date: { value: '2026-04-24', confidence: 0.9 },
      currency: { value: 'PEN', confidence: 0.99 },
      subtotal: { value: 100.5, confidence: 0.87 },
      tax: { value: '18.09', confidence: 0.8 },
      total: { value: 118.59, confidence: 0.94 },
    })

    expect(result).toEqual({
      provider: { value: 'Proveedor Uno', confidence: 0.92 },
      invoiceNumber: { value: 'F001-123', confidence: 0.88 },
      date: { value: '2026-04-24', confidence: 0.9 },
      currency: { value: 'PEN', confidence: 0.99 },
      subtotal: { value: 100.5, confidence: 0.87 },
      tax: { value: 18.09, confidence: 0.8 },
      total: { value: 118.59, confidence: 0.94 },
    })
  })

  it('assigns empty values and confidence 0 to missing fields', () => {
    const result = mapResponseToExtractionResult({
      provider: { value: 'Proveedor parcial', confidence: 1.2 },
      total: { value: 'no-numero', confidence: 0.7 },
    })

    expect(result).toEqual({
      provider: { value: 'Proveedor parcial', confidence: 1 },
      invoiceNumber: { value: '', confidence: 0 },
      date: { value: '', confidence: 0 },
      currency: { value: '', confidence: 0 },
      subtotal: { value: 0, confidence: 0 },
      tax: { value: 0, confidence: 0 },
      total: { value: 0, confidence: 0 },
    })
  })
})
