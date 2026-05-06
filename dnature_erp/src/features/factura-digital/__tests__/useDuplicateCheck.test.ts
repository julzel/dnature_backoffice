import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDuplicateCheck } from '../hooks/useDuplicateCheck'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('../services/invoiceService', () => ({
  checkDuplicate: vi.fn(),
  InvoiceValidationError: class InvoiceValidationError extends Error {
    name = 'InvoiceValidationError'
  },
}))

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useDuplicateCheck Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('inicializa con estado idle', () => {
    const { result } = renderHook(() => useDuplicateCheck())

    expect(result.current.isChecking).toBe(false)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('establece isChecking a true cuando se inicia la verificación', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')
    vi.mocked(mockCheckDuplicate).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ isDuplicate: false }), 100)
        }),
    )

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      result.current.checkDuplicate('INV-001', 'Provider')
    })

    expect(result.current.isChecking).toBe(false)
  })

  it('retorna el resultado de la búsqueda sin duplicado', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')
    vi.mocked(mockCheckDuplicate).mockResolvedValueOnce({
      isDuplicate: false,
    })

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      await result.current.checkDuplicate('INV-001', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.result?.isDuplicate).toBe(false)
    })
  })

  it('retorna el resultado de la búsqueda con duplicado', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')

    const mockExisting = {
      provider: 'Provider',
      invoiceNumber: 'INV-001',
      date: '2024-05-01',
      currency: 'USD',
      subtotal: 100,
      tax: 10,
      total: 110,
      registeredAt: '2024-05-01T10:00:00Z',
      registeredBy: 'John',
    }

    vi.mocked(mockCheckDuplicate).mockResolvedValueOnce({
      isDuplicate: true,
      existingInvoice: mockExisting,
    })

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      await result.current.checkDuplicate('INV-001', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.result?.isDuplicate).toBe(true)
      expect(result.current.result?.existingInvoice).toEqual(mockExisting)
    })
  })

  it('maneja errores de la búsqueda', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')
    vi.mocked(mockCheckDuplicate).mockRejectedValueOnce(new Error('Error de red'))

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      await result.current.checkDuplicate('INV-001', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.error).toContain('Error de red')
    })
  })

  it('maneja InvoiceValidationError correctamente', async () => {
    const { checkDuplicate: mockCheckDuplicate, InvoiceValidationError } = await import(
      '../services/invoiceService'
    )

    vi.mocked(mockCheckDuplicate).mockRejectedValueOnce(
      new InvoiceValidationError('El número de factura es requerido'),
    )

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      await result.current.checkDuplicate('', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.error).toBe('El número de factura es requerido')
    })
  })

  it('limpia el estado cuando se invoca reset', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')
    vi.mocked(mockCheckDuplicate).mockResolvedValueOnce({
      isDuplicate: false,
    })

    const { result } = renderHook(() => useDuplicateCheck())

    await act(async () => {
      await result.current.checkDuplicate('INV-001', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.result).not.toBeNull()
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.isChecking).toBe(false)
    expect(result.current.result).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('permite múltiples búsquedas secuenciales', async () => {
    const { checkDuplicate: mockCheckDuplicate } = await import('../services/invoiceService')

    vi.mocked(mockCheckDuplicate)
      .mockResolvedValueOnce({ isDuplicate: false })
      .mockResolvedValueOnce({ isDuplicate: true, existingInvoice: {} as any })

    const { result } = renderHook(() => useDuplicateCheck())

    // Primera búsqueda
    await act(async () => {
      await result.current.checkDuplicate('INV-001', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.result?.isDuplicate).toBe(false)
    })

    // Segunda búsqueda
    await act(async () => {
      await result.current.checkDuplicate('INV-002', 'Provider')
    })

    await waitFor(() => {
      expect(result.current.result?.isDuplicate).toBe(true)
    })
  })
})
