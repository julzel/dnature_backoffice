import type { DuplicateCheckResult, InvoiceData } from '../types/invoice'

const STORAGE_KEY = 'dnature_invoices'

export interface StoredInvoice extends InvoiceData {
  id: string
  registeredAt: string
  registeredBy: string
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadInvoices(): StoredInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredInvoice[]) : []
  } catch {
    return []
  }
}

function saveInvoices(invoices: StoredInvoice[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Verifica si ya existe una factura con el mismo número y proveedor en localStorage.
 */
export async function checkDuplicate(
  invoiceNumber: string,
  provider: string,
): Promise<DuplicateCheckResult> {
  // Simulate async network call for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800))

  const invoices = loadInvoices()
  const match = invoices.find(
    (inv) =>
      inv.invoiceNumber.trim().toLowerCase() === invoiceNumber.trim().toLowerCase() &&
      inv.provider.trim().toLowerCase() === provider.trim().toLowerCase(),
  )

  if (match) {
    return { isDuplicate: true, existingInvoice: match }
  }

  return { isDuplicate: false }
}

/**
 * Guarda la factura en localStorage y devuelve un ID de registro.
 */
export async function registerInvoice(
  data: InvoiceData,
): Promise<{ success: boolean; rowId?: string; error?: string }> {
  // Simulate async network call for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const invoices = loadInvoices()
  const newInvoice: StoredInvoice = {
    ...data,
    id: `INV-${Date.now()}`,
    registeredAt: new Date().toISOString(),
    registeredBy: 'demo',
  }

  saveInvoices([...invoices, newInvoice])

  return { success: true, rowId: newInvoice.id }
}

/**
 * Devuelve todas las facturas almacenadas (útil para listados y depuración).
 */
export function getAllInvoices(): StoredInvoice[] {
  return loadInvoices()
}

/**
 * Elimina todas las facturas del almacén local (útil para pruebas).
 */
export function clearInvoices(): void {
  localStorage.removeItem(STORAGE_KEY)
}
