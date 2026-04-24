export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateFileType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): boolean {
  return file.size <= maxSize;
}

export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!validateFileType(file)) {
    errors.push('Formato no permitido. Use JPG, PNG o PDF.');
  }

  if (!validateFileSize(file)) {
    errors.push('El archivo excede el tamaño máximo permitido (10 MB).');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}