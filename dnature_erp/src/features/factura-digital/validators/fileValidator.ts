import { ALLOWED_TYPES, MAX_FILE_SIZE } from '../constants/fileConstants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFileType(file: File): boolean {
  if (!file || !file.type) return false;
  return ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number]);
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  if (!file || typeof file.size !== 'number') return false;
  return file.size <= maxSize;
}

export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!validateFileType(file)) {
    errors.push('Formato no permitido. Use JPG, PNG o PDF.');
  }

  if (!validateFileSize(file)) {
    errors.push('El archivo excede el tamaño máximo permitido.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default validateFile;
