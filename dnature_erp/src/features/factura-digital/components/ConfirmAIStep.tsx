import { useCallback, useEffect, useMemo, useRef } from 'react'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import { Alert, Avatar, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useAIProcessing } from '../hooks/useAIProcessing'
import type { AIExtractionResult } from '../types/invoice'

interface ConfirmAIStepProps {
  file: File
  onProcessed: (result: AIExtractionResult) => void
  onBack: () => void
}

export function ConfirmAIStep({ file, onProcessed, onBack }: ConfirmAIStepProps) {
  const { isProcessing, error, result, processInvoice, retry, reset } = useAIProcessing()
  const hasAdvancedRef = useRef(false)

  // Derive image preview URL; clean up object URL when file changes or component unmounts
  const previewUrl = useMemo(
    () => (file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Advance once when extraction result arrives
  useEffect(() => {
    if (result && !hasAdvancedRef.current) {
      hasAdvancedRef.current = true
      onProcessed(result)
    }
  }, [result, onProcessed])

  const handleProcess = useCallback(() => {
    hasAdvancedRef.current = false
    processInvoice(file)
  }, [file, processInvoice])

  const handleBack = useCallback(() => {
    reset()
    onBack()
  }, [reset, onBack])

  const fileSizeKb = (file.size / 1024).toFixed(0)

  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h5">
          Confirmar procesamiento con IA
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Revisa el documento seleccionado y confirma que deseas extraer sus datos automáticamente.
        </Typography>
      </Box>

      {/* File summary card */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, p: 2.5 }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' } }}
        >
          <Avatar
            src={previewUrl ?? undefined}
            variant="rounded"
            sx={{ width: 80, height: 80, bgcolor: 'action.hover', flexShrink: 0 }}
          >
            {!previewUrl && (
              <PictureAsPdfOutlinedIcon sx={{ fontSize: 36, color: 'text.secondary' }} />
            )}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600 }} noWrap>
              {file.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {fileSizeKb} KB · {file.type}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Info alert — idle state */}
      {!isProcessing && !error && !result && (
        <Alert severity="info" icon={<SmartToyOutlinedIcon />}>
          La IA analizará el documento y extraerá los datos de la factura. El proceso puede tardar
          hasta 30 segundos.
        </Alert>
      )}

      {/* Processing state */}
      {isProcessing && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            py: 4,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Extrayendo datos de la factura...
          </Typography>
        </Box>
      )}

      {/* Error state */}
      {error && !isProcessing && (
        <Alert severity="error">
          {error}. Asegúrate de que la imagen es nítida y el documento está completo.
        </Alert>
      )}

      {/* Navigation */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', pt: 1 }}>
        <Button disabled={isProcessing} onClick={handleBack} variant="text">
          Atrás
        </Button>

        {error ? (
          <Button
            disabled={isProcessing}
            onClick={() => retry()}
            startIcon={
              isProcessing ? <CircularProgress size={16} color="inherit" /> : <SmartToyOutlinedIcon />
            }
            variant="contained"
          >
            {isProcessing ? 'Procesando...' : 'Reintentar'}
          </Button>
        ) : (
          <Button
            disabled={isProcessing}
            onClick={handleProcess}
            startIcon={
              isProcessing ? <CircularProgress size={16} color="inherit" /> : <SmartToyOutlinedIcon />
            }
            variant="contained"
          >
            {isProcessing ? 'Procesando...' : 'Procesar con IA'}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
