import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import { useFileUpload } from '../hooks/useFileUpload'
import FilePreview from './FilePreview'
import FileUploadArea from './FileUploadArea'

interface UploadStepProps {
  initialFile?: File | null
  onFileReady: (file: File | null) => void
}

export default function UploadStep({ initialFile = null, onFileReady }: UploadStepProps) {
  const { error, file, handleDrop, handleRemove, preview } = useFileUpload(initialFile)

  const handleFileDrop = (nextFile: File | null) => {
    handleDrop(nextFile)
    if (nextFile) {
      onFileReady(nextFile)
    }
  }

  const handleDelete = () => {
    handleRemove()
    onFileReady(null)
  }

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

      <FileUploadArea error={error} onFileSelected={handleFileDrop} />

      {file ? (
        <Stack spacing={2}>
          <FilePreview file={file} onRemove={handleDelete} preview={preview} />
          <Alert severity="success">Archivo listo para continuar al siguiente paso.</Alert>
        </Stack>
      ) : null}

      <Box>
        <Button disabled={!file} variant="contained">
          Continuar
        </Button>
      </Box>
    </Stack>
  )
}
