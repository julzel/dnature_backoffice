import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ValidationStatus from '../components/ValidationStatus';

describe('ValidationStatus', () => {
  it('shows success message when isValid is true', () => {
    render(<ValidationStatus result={{ isValid: true, errors: [] }} />);
    expect(screen.getByText(/Archivo válido/i)).toBeInTheDocument();
    expect(screen.getByText(/El archivo cumple con los requisitos/i)).toBeInTheDocument();
  });

  it('shows each error when isValid is false', () => {
    const errors = ['Error A', 'Error B'];
    render(<ValidationStatus result={{ isValid: false, errors }} />);
    expect(screen.getByText(/Errores de validación/i)).toBeInTheDocument();
    expect(screen.getByText('Error A')).toBeInTheDocument();
    expect(screen.getByText('Error B')).toBeInTheDocument();
  });
});
