import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'
import FacturaDigitalWizard from '../../FacturaDigitalWizard'; // Import the component

export default FacturaDigitalWizard;

describe('Factura digital testing setup', () => {
  it('renders a basic MUI component', () => {
    render(<Button>Componente MUI</Button>)

    expect(screen.getByRole('button', { name: 'Componente MUI' })).toBeInTheDocument()
  })

  test('renders the wizard with 5 steps', () => {
    render(<FacturaDigitalWizard/>)

    const steps = [
      'Cargar Factura',
      'Confirmar Procesamiento',
      'Revisar Datos',
      'Validación',
      'Resultado',
    ]

    steps.forEach((step) => {
      expect(screen.getByText(step)).toBeInTheDocument()
    })

    expect(screen.getByText('Paso 1: Cargar Factura')).toBeInTheDocument()
  })
})
