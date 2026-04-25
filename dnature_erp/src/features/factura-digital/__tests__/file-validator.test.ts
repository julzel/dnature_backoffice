import { validateFile, validateFileSize, validateFileType } from '../validators/fileValidator'

describe('fileValidator', () => {
  it('returns true for allowed types', () => {
    expect(validateFileType(new File(['a'], 'a.jpg', { type: 'image/jpeg' }))).toBe(true)
    expect(validateFileType(new File(['a'], 'a.png', { type: 'image/png' }))).toBe(true)
    expect(validateFileType(new File(['a'], 'a.pdf', { type: 'application/pdf' }))).toBe(true)
  })

  it('returns false for unsupported types', () => {
    expect(validateFileType(new File(['a'], 'a.txt', { type: 'text/plain' }))).toBe(false)
  })

  it('returns false when the file exceeds the limit', () => {
    const oversizedFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', {
      type: 'application/pdf',
    })

    expect(validateFileSize(oversizedFile)).toBe(false)
  })

  it('returns the expected error messages for an invalid file', () => {
    const invalidFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'bad.txt', {
      type: 'text/plain',
    })

    expect(validateFile(invalidFile)).toEqual({
      isValid: false,
      errors: [
        'Formato no permitido. Use JPG, PNG o PDF.',
        'El archivo excede el tamano maximo permitido.',
      ],
    })
  })
})
