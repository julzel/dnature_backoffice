import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { ConfirmAIStep } from '../features/factura-digital/components/ConfirmAIStep'
import type { AIExtractionResult, WizardStep } from '../features/factura-digital/types/invoice'

const steps: { label: string; value: WizardStep }[] = [
  { label: 'Carga', value: 'upload' },
  { label: 'Confirmar IA', value: 'confirm-ai' },
  { label: 'Revision', value: 'review' },
]

function getActiveStep(step: WizardStep) {
  const stepIndex = steps.findIndex((item) => item.value === step)
  return stepIndex >= 0 ? stepIndex : 0
}

export default function Facturacion() {
  const [step, setStep] = useState<WizardStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractionResult, setExtractionResult] = useState<AIExtractionResult | null>(null)

  const fileSummary = useMemo(() => {
    if (!selectedFile) {
      return null
    }

    return `${selectedFile.name} · ${selectedFile.type || 'archivo'}`
  }, [selectedFile])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    setExtractionResult(null)
    setStep('upload')
  }

  const handleContinue = () => {
    if (!selectedFile) {
      return
    }

    setStep('confirm-ai')
  }

  const handleCancelAI = () => {
    setStep('upload')
  }

  const handleSuccess = (result: AIExtractionResult) => {
    setExtractionResult(result)
    setStep('review')
  }

  return (
    <Box sx={{ bgcolor: '#f5f7f2', minHeight: '100vh', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
              Registro de factura digital
            </Typography>
            <Typography sx={{ color: '#17352c', fontWeight: 800 }} variant="h4">
              Procesamiento asistido con confirmacion previa
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 680, mt: 1 }} variant="body1">
              Carga un comprobante, confirma el uso de IA y revisa la informacion extraida antes
              de seguir con el flujo.
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }} variant="outlined">
            <Stepper activeStep={getActiveStep(step)} alternativeLabel>
              {steps.map((item) => (
                <Step key={item.value}>
                  <StepLabel>{item.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Paper sx={{ borderRadius: 2, p: { xs: 3, md: 4 } }} variant="outlined">
            <Stack spacing={3}>
              <Box>
                <Typography sx={{ color: '#17352c', fontWeight: 700 }} variant="h5">
                  Paso 1. Cargar factura
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  El archivo se conserva si cancelas el procesamiento en el paso siguiente.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component="label" startIcon={<UploadFileOutlinedIcon />} variant="contained">
                  Seleccionar archivo
                  <input
                    accept=".pdf,image/*"
                    hidden
                    onChange={handleFileChange}
                    type="file"
                  />
                </Button>
                <Button disabled={!selectedFile} onClick={handleContinue} variant="outlined">
                  Continuar al paso 2
                </Button>
              </Stack>

              {fileSummary ? (
                <Alert severity="info">
                  Archivo listo para procesar: <strong>{fileSummary}</strong>
                </Alert>
              ) : (
                <Alert severity="warning">Selecciona una imagen o PDF para continuar.</Alert>
              )}
            </Stack>
          </Paper>

          {step === 'review' && extractionResult ? (
            <Paper sx={{ borderRadius: 2, p: { xs: 3, md: 4 } }} variant="outlined">
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CheckCircleOutlineOutlinedIcon color="success" />
                  <Typography sx={{ color: '#17352c', fontWeight: 700 }} variant="h5">
                    Paso 3. Revision preliminar
                  </Typography>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  La extraccion termino correctamente y los datos estan listos para la siguiente
                  historia del flujo.
                </Typography>
                <Alert severity="success">
                  Se extrajo la factura <strong>{extractionResult.invoiceNumber.value}</strong> del
                  proveedor <strong>{extractionResult.provider.value}</strong>.
                </Alert>
              </Stack>
            </Paper>
          ) : null}
        </Stack>
      </Container>

      {step === 'confirm-ai' && selectedFile ? (
        <ConfirmAIStep file={selectedFile} onCancel={handleCancelAI} onSuccess={handleSuccess} />
      ) : null}
    </Box>
  )
}
