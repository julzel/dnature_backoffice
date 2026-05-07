import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewStep } from '../components/ReviewStep'
import type { AIExtractionResult } from '../types/invoice'

const extractionResult: AIExtractionResult = {
  provider: { value: 'Proveedor Demo SAC', confidence: 0.96 },
  invoiceNumber: { value: 'F001-987', confidence: 0.93 },
  date: { value: '2026-04-24', confidence: 0.9 },
  currency: { value: 'PEN', confidence: 0.78 },
  subtotal: { value: 100, confidence: 0.85 },
  tax: { value: 18, confidence: 0.74 },
  total: { value: 118, confidence: 0.92 },
}

const file = new File(['demo file'], 'factura-demo.pdf', { type: 'application/pdf' })

describe('ReviewStep', () => {
  it('renders all extracted fields and document preview', () => {
    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Proveedor' })).toHaveValue('Proveedor Demo SAC')
    expect(screen.getByRole('textbox', { name: 'Numero de factura' })).toHaveValue('F001-987')
    expect(screen.getByLabelText('Fecha')).toHaveValue('2026-04-24')
    expect(screen.getByLabelText('Moneda')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Subtotal' })).toHaveValue(100)
    expect(screen.getByRole('spinbutton', { name: 'Impuesto' })).toHaveValue(18)
    expect(screen.getByRole('spinbutton', { name: 'Total' })).toHaveValue(118)
    expect(screen.getByText('Documento original')).toBeInTheDocument()
    expect(screen.getAllByText('factura-demo.pdf').length).toBeGreaterThan(0)
  })

  it('marks low-confidence fields and shows the proper chip labels', () => {
    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={vi.fn()} />)

    expect(screen.getByText('Confianza baja 78%')).toBeInTheDocument()
    expect(screen.getByText('Confianza baja 74%')).toBeInTheDocument()
    expect(screen.getByText('Confianza alta 96%')).toBeInTheDocument()

    expect(screen.getByLabelText('Moneda').closest('[data-low-confidence="true"]')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: 'Impuesto' }).closest('[data-low-confidence="true"]')).toBeInTheDocument()
  })

  it('updates field values when edited', async () => {
    const user = userEvent.setup()

    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={vi.fn()} />)

    const providerInput = screen.getByRole('textbox', { name: 'Proveedor' })
    await user.clear(providerInput)
    await user.type(providerInput, 'Proveedor Corregido')

    expect(providerInput).toHaveValue('Proveedor Corregido')
  })

  it('shows required-field errors and keeps confirm disabled when a field is empty', async () => {
    const user = userEvent.setup()

    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={vi.fn()} />)

    const providerInput = screen.getByRole('textbox', { name: 'Proveedor' })
    await user.clear(providerInput)

    expect(await screen.findByText('El proveedor es obligatorio.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar datos' })).toBeDisabled()
  })

  it('shows total consistency error when total does not match subtotal plus tax', async () => {
    const user = userEvent.setup()

    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={vi.fn()} />)

    const totalInput = screen.getByRole('spinbutton', { name: 'Total' })
    await user.clear(totalInput)
    await user.type(totalInput, '90')

    expect(await screen.findByText('El total debe ser igual a subtotal + impuesto.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar datos' })).toBeDisabled()
  })

  it('confirms the corrected data only when the form is valid', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(<ReviewStep extractionResult={extractionResult} file={file} onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Confirmar datos' }))

    expect(onConfirm).toHaveBeenCalledWith({
      provider: 'Proveedor Demo SAC',
      invoiceNumber: 'F001-987',
      date: '2026-04-24',
      currency: 'PEN',
      subtotal: 100,
      tax: 18,
      total: 118,
    })
  })
})
