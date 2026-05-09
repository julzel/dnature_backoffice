import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Facturacion from '../../../pages/Facturacion'

describe('Facturacion flow', () => {
  it('keeps the uploaded file when cancelling the AI confirmation step', async () => {
    const user = userEvent.setup()

    render(<Facturacion />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['pdf'], 'factura-abril.pdf', { type: 'application/pdf' })

    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: 'Continuar al paso 2' }))

    expect(screen.getByRole('dialog', { name: 'Confirmar procesamiento con IA' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog', { name: 'Confirmar procesamiento con IA' })).not.toBeInTheDocument()
    expect(screen.getByText(/Archivo listo para procesar:/)).toBeInTheDocument()
    expect(screen.getByText(/factura-abril\.pdf/)).toBeInTheDocument()
  })
})
