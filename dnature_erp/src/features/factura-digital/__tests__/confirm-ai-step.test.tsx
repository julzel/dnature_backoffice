import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { ConfirmAIStep } from '../components/ConfirmAIStep'
import * as aiService from '../services/aiService'

const baseFile = new File(['invoice'], 'factura-demo.png', { type: 'image/png' })

describe('ConfirmAIStep', () => {
  it('shows the confirmation dialog on render and cancels correctly', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<ConfirmAIStep file={baseFile} onCancel={onCancel} onSuccess={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: 'Confirmar procesamiento con IA' })).toBeVisible()
    expect(screen.getByText('factura-demo.png')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('starts processing, disables actions and completes successfully', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    type ExtractionPayload = Awaited<ReturnType<typeof aiService.extractInvoiceData>>
    let resolveRequest: ((value: ExtractionPayload) => void) | undefined

    vi.spyOn(aiService, 'extractInvoiceData').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(<ConfirmAIStep file={baseFile} onCancel={vi.fn()} onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: 'Procesar con IA' }))

    expect(await screen.findByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Procesando...' })).toBeDisabled()

    if (!resolveRequest) {
      throw new Error('The mocked request did not start')
    }

    resolveRequest({
      provider: { value: 'Proveedor test', confidence: 0.9 },
      invoiceNumber: { value: 'F-123', confidence: 0.9 },
      date: { value: '2026-04-24', confidence: 0.9 },
      currency: { value: 'PEN', confidence: 0.9 },
      subtotal: { value: 100, confidence: 0.9 },
      tax: { value: 18, confidence: 0.9 },
      total: { value: 118, confidence: 0.9 },
    })

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })

  it('shows an error and allows retrying', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    vi.spyOn(aiService, 'extractInvoiceData')
      .mockRejectedValueOnce(new Error('No fue posible extraer los datos. Intente con una imagen mas clara.'))
      .mockResolvedValueOnce({
        provider: { value: 'Proveedor retry', confidence: 0.9 },
        invoiceNumber: { value: 'F-RETRY', confidence: 0.9 },
        date: { value: '2026-04-24', confidence: 0.9 },
        currency: { value: 'PEN', confidence: 0.9 },
        subtotal: { value: 120, confidence: 0.9 },
        tax: { value: 21.6, confidence: 0.9 },
        total: { value: 141.6, confidence: 0.9 },
      })

    render(<ConfirmAIStep file={baseFile} onCancel={vi.fn()} onSuccess={onSuccess} />)

    await user.click(screen.getByRole('button', { name: 'Procesar con IA' }))

    expect(await screen.findByText('No fue posible extraer los datos. Intente con una imagen mas clara.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })
  })
})
