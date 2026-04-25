import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { validateFile } from '../validators/fileValidator'
import { useFileUpload } from '../hooks/useFileUpload'
import FilePreview from './FilePreview'
import FileUploadArea from './FileUploadArea'
import ValidationStatus from './ValidationStatus'

interface UploadStepProps {
  initialFile?: File | null
  onFileReady: (file: File | null) => void
}

export default function UploadStep({ initialFile = null, onFileReady }: UploadStepProps) {
  const { error, file, handleDrop, handleRemove, preview } = useFileUpload(initialFile)

  const handleFileDrop = (nextFile: File | null) => {
    handleDrop(nextFile)
    if (nextFile) {
      const validation = validateFile(nextFile)
      onFileReady(validation.isValid ? nextFile : null)
      return
    }

    onFileReady(null)
  }

  const handleDelete = () => {
    handleRemove()
    onFileReady(null)
  }

  const validation = file ? validateFile(file) : error ? { isValid: false, errors: [error] } : null

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h5">
          Paso 1: Cargar Factura
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Carga una imagen o PDF de la factura para iniciar el proceso.
        </Typography>
      </Box>

      <FileUploadArea error={null} onFileSelected={handleFileDrop} />

      <ValidationStatus validation={validation} />

      {file ? (
        <Stack spacing={2}>
          <FilePreview file={file} onRemove={handleDelete} preview={preview} />
          <Alert severity="success">Archivo listo para continuar al siguiente paso.</Alert>
        </Stack>
      ) : null}

      <Box>
        <Button disabled={!validation?.isValid || !file} variant="contained">
          Continuar
        </Button>
      </Box>
    </Stack>
  )
}
