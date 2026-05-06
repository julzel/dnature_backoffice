import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkDuplicate, registerInvoice, InvoiceValidationError } from '../services/invoiceService'
import type { InvoiceData } from '../types/invoice'

// ─── Mocks ───────────────────────────────────────────────────────────────────

global.fetch = vi.fn()

// ─── Test Data ───────────────────────────────────────────────────────────────

const mockInvoiceData: InvoiceData = {
  provider: 'Acme Corp',
  invoiceNumber: 'INV-2024-001',
  date: '2024-05-05',
  currency: 'USD',
  subtotal: 1000,
  tax: 100,
  total: 1100,
}

// ─── Tests para checkDuplicate ────────────────────────────────────────────────

describe('checkDuplicate Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna isDuplicate false cuando no hay duplicado', async () => {
    const mockResponse = { isDuplicate: false }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await checkDuplicate('INV-2024-001', 'Acme Corp')

    expect(result.isDuplicate).toBe(false)
    expect(result.existingInvoice).toBeUndefined()
  })

  it('retorna isDuplicate true y datos de factura existente cuando hay duplicado', async () => {
    const existingInvoice = {
      provider: 'Acme Corp',
      invoiceNumber: 'INV-2024-001',
      date: '2024-05-01',
      currency: 'USD',
      subtotal: 1000,
      tax: 100,
      total: 1100,
      registeredAt: '2024-05-01T10:00:00Z',
      registeredBy: 'John Doe',
    }

    const mockResponse = { isDuplicate: true, existingInvoice }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await checkDuplicate('INV-2024-001', 'Acme Corp')

    expect(result.isDuplicate).toBe(true)
    expect(result.existingInvoice).toEqual(existingInvoice)
  })

  it('lanza error cuando el número de factura está vacío', async () => {
    await expect(checkDuplicate('', 'Acme Corp')).rejects.toThrow(InvoiceValidationError)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('lanza error cuando el proveedor está vacío', async () => {
    await expect(checkDuplicate('INV-2024-001', '')).rejects.toThrow(InvoiceValidationError)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('lanza error cuando la respuesta del servidor falla', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Error interno del servidor' }),
    } as Response)

    await expect(checkDuplicate('INV-2024-001', 'Acme Corp')).rejects.toThrow(InvoiceValidationError)
  })

  it('lanza error cuando hay timeout', async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 100)
        }),
    )

    await expect(checkDuplicate('INV-2024-001', 'Acme Corp')).rejects.toThrow(InvoiceValidationError)
  })

  it('realiza la solicitud con parámetros correctos', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isDuplicate: false }),
    } as Response)

    await checkDuplicate('INV-2024-001', 'Acme Corp')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('invoiceNumber=INV-2024-001'),
      expect.any(Object),
    )
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('provider=Acme%20Corp'), expect.any(Object))
  })

  it('codifica correctamente los parámetros URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isDuplicate: false }),
    } as Response)

    await checkDuplicate('INV-2024/001', 'Provider & Co.')

    const callUrl = vi.mocked(fetch).mock.calls[0][0] as string
    expect(callUrl).toContain(encodeURIComponent('INV-2024/001'))
    expect(callUrl).toContain(encodeURIComponent('Provider & Co.'))
  })
})

// ─── Tests para registerInvoice ────────────────────────────────────────────────

describe('registerInvoice Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna éxito con rowId cuando el registro es exitoso', async () => {
    const mockResponse = { rowId: 'row-123', sheetName: 'Facturas 2024' }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await registerInvoice(mockInvoiceData)

    expect(result.success).toBe(true)
    expect(result.rowId).toBe('row-123')
    expect(result.sheetName).toBe('Facturas 2024')
  })

  it('retorna error cuando el registro falla', async () => {
    const mockResponse = { message: 'No se pudo registrar la factura' }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => mockResponse,
    } as Response)

    const result = await registerInvoice(mockInvoiceData)

    expect(result.success).toBe(false)
    expect(result.error).toBe('No se pudo registrar la factura')
  })

  it('retorna error cuando hay timeout', async () => {
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 100)
        }),
    )

    const result = await registerInvoice(mockInvoiceData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('tardó demasiado')
  })

  it('envia los datos como JSON en el body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rowId: 'row-123' }),
    } as Response)

    await registerInvoice(mockInvoiceData)

    const callArgs = vi.mocked(fetch).mock.calls[0]
    const bodyString = callArgs[1]?.body as string
    const bodyData = JSON.parse(bodyString)

    expect(bodyData).toEqual(mockInvoiceData)
  })

  it('usa el header Content-Type application/json', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ rowId: 'row-123' }),
    } as Response)

    await registerInvoice(mockInvoiceData)

    const callArgs = vi.mocked(fetch).mock.calls[0]
    expect(callArgs[1]?.headers).toEqual({ 'Content-Type': 'application/json' })
  })

  it('retorna error cuando los datos son null', async () => {
    const result = await registerInvoice(null as any)

    expect(result.success).toBe(false)
    expect(result.error).toBeTruthy()
  })

  it('maneja error de red genérico', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Error de conexión'))

    const result = await registerInvoice(mockInvoiceData)

    expect(result.success).toBe(false)
    expect(result.error).toContain('Error de conexión')
  })
})
