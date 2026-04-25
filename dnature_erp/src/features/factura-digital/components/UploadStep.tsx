import React, { useEffect, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import DeleteIcon from '@mui/icons-material/Delete'
import ValidationStatus from './ValidationStatus'
import { validateFile } from '../validators/fileValidator'
import type { ValidationResult } from '../validators/fileValidator'

interface UploadStepProps {
  onContinue: (file: File) => void
}

export default function UploadStep({ onContinue }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const cameraInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return

    const validationResult = validateFile(selectedFile)
    setValidation(validationResult)

    if (!validationResult.isValid) {
      setFile(null)
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      setPreview(null)
      return
    }

    if (preview) {
      URL.revokeObjectURL(preview)
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null
    handleFileChange(selectedFile)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const droppedFile = event.dataTransfer.files?.[0] || null
    handleFileChange(droppedFile)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setValidation(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleContinue = () => {
    if (file) {
      onContinue(file)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ mb: 2 }} variant="h6">
        Paso 1: Carga tu factura
      </Typography>

      {!file ? (
        <Paper
          aria-label="Area de carga de factura"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          role="region"
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed #ccc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography sx={{ mb: 2 }} variant="body1">
            Arrastra tu factura aqui o haz clic para seleccionar
          </Typography>
          <Typography sx={{ color: '#666', display: 'block', mb: 2 }} variant="caption">
            Formatos aceptados: JPG, PNG, PDF (max. 10 MB)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => fileInputRef.current?.click()}
              startIcon={<CloudUploadIcon />}
              variant="contained"
            >
              Subir archivo
            </Button>
            <Button
              onClick={() => cameraInputRef.current?.click()}
              startIcon={<CameraAltIcon />}
              variant="outlined"
            >
              Tomar foto
            </Button>
          </Box>

          <input
            accept="image/jpeg,image/png,application/pdf"
            hidden
            onChange={handleInputChange}
            ref={fileInputRef}
            type="file"
          />
          <input
            accept="image/*"
            capture="environment"
            hidden
            onChange={handleInputChange}
            ref={cameraInputRef}
            type="file"
          />
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
            <Typography sx={{ mb: 1, fontWeight: 'bold' }} variant="body2">
              Archivo seleccionado:
            </Typography>
            <Typography sx={{ color: '#666', mb: 1 }} variant="body2">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
            {preview && file.type !== 'application/pdf' ? (
              <Box
                alt={`Vista previa de ${file.name}`}
                component="img"
                src={preview}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 1,
                  mt: 1,
                }}
              />
            ) : null}
          </Paper>
          <Button
            color="error"
            fullWidth
            onClick={handleRemoveFile}
            startIcon={<DeleteIcon />}
            variant="outlined"
          >
            Eliminar archivo
          </Button>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <ValidationStatus validation={validation} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
        <Button disabled={!validation?.isValid || !file} onClick={handleContinue} variant="contained">
          Continuar
        </Button>
      </Box>
    </Box>
  )
}
