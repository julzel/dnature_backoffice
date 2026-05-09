import { render, screen } from '@testing-library/react'
import ValidationStatus from '../components/ValidationStatus'

describe('ValidationStatus', () => {
  it('shows a success message when validation is valid', () => {
    render(<ValidationStatus validation={{ isValid: true, errors: [] }} />)

    expect(screen.getByText('Archivo valido')).toBeInTheDocument()
    expect(screen.getByText('El archivo cumple con el formato y tamano permitidos.')).toBeInTheDocument()
  })

  it('shows each validation error when validation fails', () => {
    render(
      <ValidationStatus
        validation={{
          isValid: false,
          errors: [
            'Formato no permitido. Use JPG, PNG o PDF.',
            'El archivo excede el tamano maximo permitido.',
          ],
        }}
      />,
    )

    expect(screen.getByText('Archivo invalido')).toBeInTheDocument()
    expect(screen.getByText('Formato no permitido. Use JPG, PNG o PDF.')).toBeInTheDocument()
    expect(screen.getByText('El archivo excede el tamano maximo permitido.')).toBeInTheDocument()
  })
})
