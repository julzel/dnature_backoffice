import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../constants/fileConstants'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const ALLOWED_TYPES = ALLOWED_FILE_TYPES

export function validateFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type)
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize
}

export function validateFile(file: File): ValidationResult {
  const errors: string[] = []

  if (!validateFileType(file)) {
    errors.push('Formato no permitido. Use JPG, PNG o PDF.')
  }

  if (!validateFileSize(file)) {
    errors.push('El archivo excede el tamano maximo permitido.')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
