import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FacturaDigitalWizard from '../FacturaDigitalWizard'

describe('FacturaDigitalWizard', () => {
  it('renders the stepper with the five visible steps', () => {
    render(<FacturaDigitalWizard />)

    const steps = [
      'Cargar Factura',
      'Confirmar Procesamiento',
      'Revisar Datos',
      'Validacion',
      'Resultado',
    ]

    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument()
    })
  })

  it('shows the first step content by default and keeps future navigation blocked', () => {
    render(<FacturaDigitalWizard />)

    expect(screen.getByText('Paso 1: Cargar Factura')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Atras' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })

  it('renders the corresponding step content when activeStep changes', async () => {
    const user = userEvent.setup()

    render(<FacturaDigitalWizard />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['jpg-binary'], 'factura.jpg', { type: 'image/jpeg' })

    await user.upload(input, file)
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(screen.getByText('Paso 2: Confirmar Procesamiento')).toBeInTheDocument()
  })
})
