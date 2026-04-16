import { Button } from '@mui/material'
import { render, screen } from '@testing-library/react'

describe('Factura digital testing setup', () => {
  it('renders a basic MUI component', () => {
    render(<Button>Componente MUI</Button>)

    expect(screen.getByRole('button', { name: 'Componente MUI' })).toBeInTheDocument()
  })
})
