import type { DuplicateCheckResult, InvoiceData } from '../types/invoice'

/**
 * Error especializado para validaciones de facturas
 */
export class InvoiceValidationError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'InvoiceValidationError'
    this.cause = cause
  }
}

/**
 * Verifica si existe una factura duplicada por número de factura y proveedor
 * @param invoiceNumber - Número de factura a verificar
 * @param provider - Proveedor de la factura
 * @returns Resultado de la verificación de duplicado
 */
export async function checkDuplicate(
  invoiceNumber: string,
  provider: string,
): Promise<DuplicateCheckResult> {
  const API_ENDPOINT = import.meta.env.VITE_INVOICE_API_URL || '/api'
  const CHECK_TIMEOUT = 15000 // 15 segundos

  // Validar inputs
  if (!invoiceNumber?.trim()) {
    throw new InvoiceValidationError('El número de factura no puede estar vacío.')
  }

  if (!provider?.trim()) {
    throw new InvoiceValidationError('El proveedor no puede estar vacío.')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT)

  try {
    const response = await fetch(
      `${API_ENDPOINT}/invoices/check-duplicate?invoiceNumber=${encodeURIComponent(invoiceNumber)}&provider=${encodeURIComponent(provider)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new InvoiceValidationError(
        errorData.message || `Error del servidor: ${response.status}`,
        response,
      )
    }

    const data = await response.json()
    return mapResponseToDuplicateCheckResult(data)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new InvoiceValidationError('La verificación de duplicados tardó demasiado. Intente de nuevo.', error)
    }

    if (error instanceof InvoiceValidationError) {
      throw error
    }

    throw new InvoiceValidationError('Error al verificar duplicados.', error)
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Mapea la respuesta de la API al tipo DuplicateCheckResult
 * @param data - Datos crudos de la API
 * @returns DuplicateCheckResult estructurado
 */
function mapResponseToDuplicateCheckResult(data: any): DuplicateCheckResult {
  if (!data || typeof data !== 'object') {
    throw new InvoiceValidationError('Respuesta inválida del servidor.')
  }

  const isDuplicate = Boolean(data.isDuplicate)

  if (isDuplicate && data.existingInvoice) {
    return {
      isDuplicate: true,
      existingInvoice: {
        provider: data.existingInvoice.provider || '',
        invoiceNumber: data.existingInvoice.invoiceNumber || '',
        date: data.existingInvoice.date || '',
        currency: data.existingInvoice.currency || '',
        subtotal: parseFloat(data.existingInvoice.subtotal) || 0,
        tax: parseFloat(data.existingInvoice.tax) || 0,
        total: parseFloat(data.existingInvoice.total) || 0,
        registeredAt: data.existingInvoice.registeredAt || new Date().toISOString(),
        registeredBy: data.existingInvoice.registeredBy || 'Sistema',
      },
    }
  }

  return {
    isDuplicate: false,
  }
}

/**
 * Registra una factura en el sistema (placeholder para FD-009)
 * @param data - Datos de la factura a registrar
 * @returns Resultado del registro
 */
export async function registerInvoice(
  data: InvoiceData,
): Promise<{ success: boolean; rowId?: string; sheetName?: string; error?: string }> {
  const API_ENDPOINT = import.meta.env.VITE_INVOICE_API_URL || '/api'
  const REGISTER_TIMEOUT = 30000 // 30 segundos

  if (!data) {
    throw new InvoiceValidationError('Los datos de la factura son requeridos.')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REGISTER_TIMEOUT)

  try {
    const response = await fetch(`${API_ENDPOINT}/invoices/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.message || `Error al registrar: ${response.status}`,
      }
    }

    const result = await response.json()
    return {
      success: true,
      rowId: result.rowId,
      sheetName: result.sheetName,
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        error: 'El registro tardó demasiado. Intente de nuevo.',
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al registrar.',
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
