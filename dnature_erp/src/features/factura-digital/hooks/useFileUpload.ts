import { useEffect, useRef, useState } from 'react'
import { validateFile } from '../validators/fileValidator'

interface UseFileUploadReturn {
  file: File | null
  preview: string | null
  error: string | null
  handleDrop: (file: File | null) => void
  handleSelect: (file: File | null) => void
  handleRemove: () => void
}

export function useFileUpload(initialFile: File | null = null): UseFileUploadReturn {
  const [file, setFile] = useState<File | null>(initialFile)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewUrlRef = useRef<string | null>(null)

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }

  const applyFile = (nextFile: File | null) => {
    if (!nextFile) {
      clearPreviewUrl()
      setFile(null)
      setPreview(null)
      setError(null)
      return
    }

    const validation = validateFile(nextFile)
    if (!validation.isValid) {
      clearPreviewUrl()
      setFile(null)
      setPreview(null)
      setError(validation.errors[0] ?? 'No fue posible cargar el archivo.')
      return
    }

    clearPreviewUrl()
    const objectUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = objectUrl
    setFile(nextFile)
    setPreview(objectUrl)
    setError(null)
  }

  useEffect(() => {
    if (initialFile) {
      applyFile(initialFile)
    }

    return () => {
      clearPreviewUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    file,
    preview,
    error,
    handleDrop: applyFile,
    handleSelect: applyFile,
    handleRemove: () => applyFile(null),
  }
}
