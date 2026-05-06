export interface InvoiceData {
  provider: string
  invoiceNumber: string
  date: string
  currency: string
  subtotal: number
  tax: number
  total: number
}

export interface ExtractedField<T = string | number> {
  value: T
  confidence: number
}

export interface AIExtractionResult {
  provider: ExtractedField<string>
  invoiceNumber: ExtractedField<string>
  date: ExtractedField<string>
  currency: ExtractedField<string>
  subtotal: ExtractedField<number>
  tax: ExtractedField<number>
  total: ExtractedField<number>
}

export interface AuditRecord {
  originalFile: File
  extractedData: AIExtractionResult | null
  confirmedData: InvoiceData
  userId: string
  timestamp: string
  result: 'success' | 'error' | 'cancelled'
}

export type WizardStep = 'upload' | 'confirm-ai' | 'review' | 'validation' | 'result'

export interface DuplicateCheckResult {
  isDuplicate: boolean
  existingInvoice?: InvoiceData & { registeredAt: string; registeredBy: string }
  error?: string
}
