import { useEffect, useMemo, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import { ProcessingStatus } from './ProcessingStatus'

// comentario para subir pull request
interface ConfirmationDialogProps {
  open: boolean
  file: File
  isProcessing: boolean
  error: string | null
  onCancel: () => void
  onConfirm: () => void
  onRetry: () => void
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function ConfirmationDialog({
  open,
  file,
  isProcessing,
  error,
  onCancel,
  onConfirm,
  onRetry,
}: ConfirmationDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file.type.startsWith('image/')) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const fileIcon = useMemo(() => {
    if (file.type === 'application/pdf') {
      return <PictureAsPdfOutlinedIcon />
    }

    if (file.type.startsWith('image/')) {
      return <ImageOutlinedIcon />
    }

    return <DescriptionOutlinedIcon />
  }, [file.type])

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Confirmar procesamiento con IA</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          <Typography color="text.secondary" variant="body2">
            Revisa el archivo cargado antes de enviarlo al servicio de IA.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              p: 2,
              alignItems: 'center',
            }}
          >
            {previewUrl ? (
              <Box
                component="img"
                src={previewUrl}
                alt={`Vista previa de ${file.name}`}
                sx={{
                  width: 112,
                  height: 112,
                  borderRadius: 2,
                  objectFit: 'cover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            ) : (
              <Avatar
                variant="rounded"
                sx={{
                  width: 112,
                  height: 112,
                  bgcolor: 'rgba(17, 94, 89, 0.08)',
                  color: 'primary.main',
                }}
              >
                {fileIcon}
              </Avatar>
            )}

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{file.name}</Typography>
              <Typography color="text.secondary" variant="body2">
                {file.type || 'Tipo de archivo no disponible'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          </Stack>

          <ProcessingStatus error={error} isProcessing={isProcessing} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button disabled={isProcessing} onClick={onCancel} variant="text">
          Cancelar
        </Button>
        {error ? (
          <Button disabled={isProcessing} onClick={onRetry} variant="outlined">
            Reintentar
          </Button>
        ) : null}
        <Button disabled={isProcessing} onClick={onConfirm} variant="contained">
          {isProcessing ? 'Procesando...' : 'Procesar con IA'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
