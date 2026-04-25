import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'

interface ProcessingStatusProps {
  isProcessing: boolean
  error: string | null
}

export function ProcessingStatus({ isProcessing, error }: ProcessingStatusProps) {
  if (isProcessing) {
    return (
      <Stack spacing={2} sx={{ alignItems: 'center', py: 2 }}>
        <CircularProgress aria-label="Procesando con IA" size={32} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
            Procesando factura
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Estamos extrayendo los datos del comprobante con IA.
          </Typography>
        </Box>
      </Stack>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return null
}
