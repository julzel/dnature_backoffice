import { useMemo, useState } from 'react'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { ReviewStep } from '../features/factura-digital/components/ReviewStep'
import { useAIProcessing } from '../features/factura-digital/hooks/useAIProcessing'
import type { InvoiceData } from '../features/factura-digital/types/invoice'

const steps = ['Carga', 'Confirmar IA', 'Revision', 'Validacion', 'Resultado']

export default function Facturacion() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [confirmedData, setConfirmedData] = useState<InvoiceData | null>(null)
  const { error, isProcessing, processInvoice, reset, result, retry } = useAIProcessing()

  const activeStep = useMemo(() => {
    if (confirmedData) {
      return 3
    }

    if (result) {
      return 2
    }

    if (selectedFile || isProcessing) {
      return 1
    }

    return 0
  }, [confirmedData, isProcessing, result, selectedFile])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setConfirmedData(null)
    reset()
  }

  const handleProcess = async () => {
    if (selectedFile) {
      await processInvoice(selectedFile)
    }
  }

  const handleConfirm = (data: InvoiceData) => {
    setConfirmedData(data)
  }

  return (
    <Box sx={{ bgcolor: '#f4f6f1', minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
              Modulo de factura digital
            </Typography>
            <Typography sx={{ color: '#17352c', fontWeight: 800 }} variant="h4">
              Revision y correccion de factura extraida con IA
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 1 }} variant="body1">
              Carga una factura, procesala con el API configurado y confirma los datos antes de
              continuar al registro.
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }} variant="outlined">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }} variant="outlined">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }} variant="h6">
                  Archivo de factura
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {selectedFile ? selectedFile.name : 'Selecciona un PDF o imagen para extraer datos.'}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  component="label"
                  disabled={isProcessing}
                  startIcon={<CloudUploadOutlinedIcon />}
                  variant="outlined"
                >
                  Seleccionar archivo
                  <Box
                    component="input"
                    hidden
                    type="file"
                    accept="application/pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                  />
                </Button>
                <Button
                  disabled={!selectedFile || isProcessing}
                  onClick={handleProcess}
                  startIcon={isProcessing ? <CircularProgress color="inherit" size={18} /> : undefined}
                  variant="contained"
                >
                  {isProcessing ? 'Procesando' : 'Procesar con IA'}
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {error ? (
            <Alert
              action={
                <Button
                  color="inherit"
                  disabled={isProcessing}
                  onClick={retry}
                  size="small"
                  startIcon={<RestartAltOutlinedIcon />}
                >
                  Reintentar
                </Button>
              }
              severity="error"
            >
              {error}
            </Alert>
          ) : null}

          {confirmedData ? (
            <Alert severity="success">
              Datos confirmados para la factura <strong>{confirmedData.invoiceNumber}</strong> del
              proveedor <strong>{confirmedData.provider}</strong>.
            </Alert>
          ) : null}

          {selectedFile && result ? (
            <ReviewStep extractionResult={result} file={selectedFile} onConfirm={handleConfirm} />
          ) : null}
        </Stack>
      </Container>
    </Box>
  )
}
