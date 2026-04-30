import { describe, it, expect } from 'vitest';
import { validateFileType, validateFileSize, validateFile } from '../validators/fileValidator';

function makeFile(name: string, type: string, size = 1024) {
  // jsdom supports File constructor
  return new File(['a'.repeat(size)], name, { type, lastModified: Date.now() });
}

describe('fileValidator', () => {
  it('validateFileType returns true for JPG, PNG, PDF', () => {
    expect(validateFileType(makeFile('a.jpg', 'image/jpeg'))).toBe(true);
    expect(validateFileType(makeFile('a.png', 'image/png'))).toBe(true);
    expect(validateFileType(makeFile('a.pdf', 'application/pdf'))).toBe(true);
  });

  it('validateFileType returns false for disallowed types', () => {
    expect(validateFileType(makeFile('a.txt', 'text/plain'))).toBe(false);
  });

  it('validateFileSize returns false if file exceeds limit', () => {
    const big = makeFile('big.jpg', 'image/jpeg', 11 * 1024 * 1024);
    expect(validateFileSize(big, 10 * 1024 * 1024)).toBe(false);
  });

  it('validateFile returns proper ValidationResult', () => {
    const bad = makeFile('bad.txt', 'text/plain', 12 * 1024 * 1024);
    const res = validateFile(bad as unknown as File);
    expect(res.isValid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(1);
    expect(res.errors).toEqual(expect.arrayContaining([
      'Formato no permitido. Use JPG, PNG o PDF.',
      'El archivo excede el tamaño máximo permitido.'
    ]));
  });
});
