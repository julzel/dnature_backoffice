import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ValidationStep } from '../ValidationStep'
import { DuplicateWarningDialog } from '../DuplicateWarningDialog'
import { ComparisonTable } from '../ComparisonTable'
import type { InvoiceData } from '../../types/invoice'

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('../../services/invoiceService', () => ({
  checkDuplicate: vi.fn(),
  registerInvoice: vi.fn(),
  InvoiceValidationError: class InvoiceValidationError extends Error {
    name = 'InvoiceValidationError'
  },
}))

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

const mockExistingInvoice: InvoiceData & { registeredAt: string; registeredBy: string } = {
  ...mockInvoiceData,
  registeredAt: '2024-05-01T10:00:00Z',
  registeredBy: 'John Doe',
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ValidationStep Component', () => {
  const mockOnNext = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el paso de validación', () => {
    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByText('Paso 4: Validación de duplicados')).toBeInTheDocument()
    expect(screen.getByText('Verificando si existe una factura con el mismo número y proveedor...')).toBeInTheDocument()
  })

  it('muestra loader mientras verifica duplicados', () => {
    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    expect(screen.getByText('Verificando duplicados...')).toBeInTheDocument()
  })

  it('muestra mensaje de validación completada cuando no hay duplicado', async () => {
    const { checkDuplicate } = await import('../../services/invoiceService')
    vi.mocked(checkDuplicate).mockResolvedValueOnce({
      isDuplicate: false,
    })

    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    await waitFor(() => {
      expect(screen.getByText('Validación completada')).toBeInTheDocument()
      expect(screen.getByText(/No se encontraron duplicados/)).toBeInTheDocument()
    })
  })

  it('avanza automáticamente cuando no hay duplicado', async () => {
    const { checkDuplicate } = await import('../../services/invoiceService')
    vi.mocked(checkDuplicate).mockResolvedValueOnce({
      isDuplicate: false,
    })

    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    await waitFor(() => {
      expect(screen.getByText('Continuar al registro')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Continuar al registro'))

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalled()
    })
  })

  it('muestra advertencia cuando existe duplicado', async () => {
    const { checkDuplicate } = await import('../../services/invoiceService')
    vi.mocked(checkDuplicate).mockResolvedValueOnce({
      isDuplicate: true,
      existingInvoice: mockExistingInvoice,
    })

    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    await waitFor(() => {
      expect(screen.getByText('Se encontró una factura duplicada')).toBeInTheDocument()
    })
  })

  it('muestra mensaje de error cuando falla la verificación', async () => {
    const { checkDuplicate } = await import('../../services/invoiceService')
    vi.mocked(checkDuplicate).mockRejectedValueOnce(new Error('Error de red'))

    render(<ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />)

    await waitFor(() => {
      expect(screen.getByText(/Error de red/)).toBeInTheDocument()
    })

    expect(screen.getByText('Reintentar')).toBeInTheDocument()
  })

  it('permite reintentar después de un error', async () => {
    const { checkDuplicate } = await import('../../services/invoiceService')
    vi.mocked(checkDuplicate).mockRejectedValueOnce(new Error('Error inicial'))

    const { rerender } = render(
      <ValidationStep confirmedData={mockInvoiceData} onNext={mockOnNext} onBack={mockOnBack} />,
    )

    await waitFor(() => {
      expect(screen.getByText('Reintentar')).toBeInTheDocument()
    })

    vi.mocked(checkDuplicate).mockResolvedValueOnce({
      isDuplicate: false,
    })

    fireEvent.click(screen.getByText('Reintentar'))

    await waitFor(() => {
      expect(screen.getByText('Validación completada')).toBeInTheDocument()
    })
  })
})

describe('DuplicateWarningDialog Component', () => {
  const mockOnContinue = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el diálogo de advertencia', () => {
    render(
      <DuplicateWarningDialog
        open={true}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('Factura duplicada')).toBeInTheDocument()
    expect(screen.getByText(/Ya existe una factura registrada/)).toBeInTheDocument()
  })

  it('muestra los datos de la factura existente', () => {
    render(
      <DuplicateWarningDialog
        open={true}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
      />,
    )

    expect(screen.getByText('INV-2024-001')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
  })

  it('invoca onCancel al hacer click en Cancelar', () => {
    render(
      <DuplicateWarningDialog
        open={true}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
      />,
    )

    fireEvent.click(screen.getByText('Cancelar'))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('invoca onContinue al hacer click en Continuar de todos modos', () => {
    render(
      <DuplicateWarningDialog
        open={true}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
      />,
    )

    fireEvent.click(screen.getByText('Continuar de todos modos'))
    expect(mockOnContinue).toHaveBeenCalled()
  })

  it('deshabilita botones cuando isLoading es true', () => {
    render(
      <DuplicateWarningDialog
        open={true}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
        isLoading={true}
      />,
    )

    const cancelButton = screen.getByText('Cancelar')
    const continueButton = screen.getByText('Registrando...')

    expect(cancelButton).toBeDisabled()
    expect(continueButton).toBeDisabled()
  })

  it('no renderiza cuando open es false', () => {
    const { queryByText } = render(
      <DuplicateWarningDialog
        open={false}
        newInvoice={mockInvoiceData}
        existingInvoice={mockExistingInvoice}
        onContinue={mockOnContinue}
        onCancel={mockOnCancel}
      />,
    )

    expect(queryByText('Factura duplicada')).not.toBeInTheDocument()
  })
})

describe('ComparisonTable Component', () => {
  it('renderiza tabla de comparación', () => {
    render(<ComparisonTable newInvoice={mockInvoiceData} existingInvoice={mockExistingInvoice} />)

    expect(screen.getByText('Comparación de datos')).toBeInTheDocument()
    expect(screen.getByText('Campo')).toBeInTheDocument()
    expect(screen.getByText('Nueva factura')).toBeInTheDocument()
    expect(screen.getByText('Factura existente')).toBeInTheDocument()
  })

  it('muestra todos los campos de comparación', () => {
    render(<ComparisonTable newInvoice={mockInvoiceData} existingInvoice={mockExistingInvoice} />)

    expect(screen.getByText('Proveedor')).toBeInTheDocument()
    expect(screen.getByText('Número de Factura')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('Impuesto')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('muestra información de quién registró la factura existente', () => {
    render(<ComparisonTable newInvoice={mockInvoiceData} existingInvoice={mockExistingInvoice} />)

    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
  })

  it('formatea fechas correctamente', () => {
    const invoiceWithDate: InvoiceData = {
      ...mockInvoiceData,
      date: '2024-05-05',
    }

    const existingWithDate: InvoiceData & { registeredAt: string; registeredBy: string } = {
      ...mockExistingInvoice,
      date: '2024-05-05',
    }

    render(<ComparisonTable newInvoice={invoiceWithDate} existingInvoice={existingWithDate} />)

    // Debería formatearse como fecha localizada
    const cells = screen.getAllByText(/5 may/)
    expect(cells.length).toBeGreaterThan(0)
  })

  it('formatea moneda correctamente', () => {
    render(<ComparisonTable newInvoice={mockInvoiceData} existingInvoice={mockExistingInvoice} />)

    // Debería mostrar formato USD
    const totals = screen.getAllByText(/1,100/)
    expect(totals.length).toBeGreaterThan(0)
  })
})
