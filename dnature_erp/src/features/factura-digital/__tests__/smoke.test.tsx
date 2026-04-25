import { render, screen } from '@testing-library/react'
import FacturaDigitalWizard from '../FacturaDigitalWizard'

describe('FacturaDigitalWizard', () => {
  it('renders the wizard with five steps', () => {
    render(<FacturaDigitalWizard />)

    expect(screen.getByText('Cargar Factura')).toBeInTheDocument()
    expect(screen.getByText('Confirmar Procesamiento')).toBeInTheDocument()
    expect(screen.getByText('Revisar Datos')).toBeInTheDocument()
    expect(screen.getByText('Validacion')).toBeInTheDocument()
    expect(screen.getByText('Resultado')).toBeInTheDocument()
  })
})
