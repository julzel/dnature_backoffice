import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import type { DragEvent } from 'react'
import CameraCapture from './CameraCapture'

interface FileUploadAreaProps {
  error: string | null
  onFileSelected: (file: File | null) => void
}

export default function FileUploadArea({ error, onFileSelected }: FileUploadAreaProps) {
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files?.[0] ?? null
    onFileSelected(droppedFile)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <Stack spacing={2.5}>
      <Box
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="region"
        aria-label="Area de carga de factura"
        sx={{
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: '#fafbf8',
        }}
      >
        <Typography sx={{ fontWeight: 700 }} variant="h6">
          Suelta aqui tu factura
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
          Formatos permitidos: JPG, PNG o PDF.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center', mt: 3 }}>
          <Button component="label" startIcon={<CloudUploadIcon />} variant="contained">
            Subir archivo
            <input
              accept="image/jpeg,image/png,application/pdf"
              hidden
              onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
              type="file"
            />
          </Button>
          <CameraCapture onCapture={onFileSelected} />
        </Stack>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}
