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
import type { ReactNode } from 'react'
import type { AIExtractionResult, InvoiceData } from './types/invoice'
import { useWizardState } from './hooks/useWizardState'

const steps = [
  'Cargar Factura',
  'Confirmar Procesamiento',
  'Revisar Datos',
  'Validacion',
  'Resultado',
]

function StepPanel({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h5">
          {title}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Box>
      <Alert severity="info">Completa este paso para habilitar el avance del wizard.</Alert>
    </Stack>
  )
}

function ResultPanel({ onReset }: { onReset: () => void }) {
  return (
    <Stack spacing={2}>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h5">
          Resultado
        </Typography>
        <Typography color="text.secondary" variant="body2">
          El wizard termino y puede reiniciarse para comenzar un nuevo registro.
        </Typography>
      </Box>
      <Alert severity="success">Proceso completado.</Alert>
      <Box>
        <Button onClick={onReset} variant="outlined">
          Reiniciar wizard
        </Button>
      </Box>
    </Stack>
  )
}

function demoExtractedData(): AIExtractionResult {
  return {
    provider: { value: 'Proveedor demo', confidence: 0.95 },
    invoiceNumber: { value: 'F001-0001', confidence: 0.91 },
    date: { value: '2026-04-24', confidence: 0.89 },
    currency: { value: 'PEN', confidence: 0.9 },
    subtotal: { value: 100, confidence: 0.9 },
    tax: { value: 18, confidence: 0.88 },
    total: { value: 118, confidence: 0.9 },
  }
}

function demoConfirmedData(): InvoiceData {
  return {
    provider: 'Proveedor demo',
    invoiceNumber: 'F001-0001',
    date: '2026-04-24',
    currency: 'PEN',
    subtotal: 100,
    tax: 18,
    total: 118,
  }
}

function getStepContent(
  activeStep: number,
  setStepData: (payload: {
    file?: File | null
    extractedData?: AIExtractionResult | null
    confirmedData?: InvoiceData | null
    registrationResult?: 'success' | 'error' | null
  }) => void,
  onReset: () => void,
): ReactNode {
  switch (activeStep) {
    case 0:
      return (
        <Stack spacing={2}>
          <Typography variant="body1">Paso 1: Cargar Factura</Typography>
          <StepPanel
            description="Aqui vivira el flujo de carga del archivo de factura."
            title="Carga inicial del comprobante"
          />
          <Box>
            <Button
              onClick={() =>
                setStepData({
                  file: new File(['demo'], 'factura-demo.pdf', { type: 'application/pdf' }),
                })
              }
              variant="contained"
            >
              Marcar paso como completo
            </Button>
          </Box>
        </Stack>
      )
    case 1:
      return (
        <Stack spacing={2}>
          <Typography variant="body1">Paso 2: Confirmar Procesamiento</Typography>
          <StepPanel
            description="Aqui se confirmara el uso de IA antes del procesamiento."
            title="Confirmacion del procesamiento"
          />
          <Box>
            <Button onClick={() => setStepData({ extractedData: demoExtractedData() })} variant="contained">
              Marcar paso como completo
            </Button>
          </Box>
        </Stack>
      )
    case 2:
      return (
        <Stack spacing={2}>
          <Typography variant="body1">Paso 3: Revisar Datos</Typography>
          <StepPanel
            description="Aqui se mostrara el formulario editable para revisar y corregir datos."
            title="Revision de datos extraidos"
          />
          <Box>
            <Button onClick={() => setStepData({ confirmedData: demoConfirmedData() })} variant="contained">
              Marcar paso como completo
            </Button>
          </Box>
        </Stack>
      )
    case 3:
      return (
        <Stack spacing={2}>
          <Typography variant="body1">Paso 4: Validacion</Typography>
          <StepPanel
            description="Aqui se ejecutaran validaciones antes del registro final."
            title="Validaciones del registro"
          />
          <Box>
            <Button onClick={() => setStepData({ registrationResult: 'success' })} variant="contained">
              Marcar paso como completo
            </Button>
          </Box>
        </Stack>
      )
    case 4:
      return <ResultPanel onReset={onReset} />
    default:
      return null
  }
}

export default function FacturaDigitalWizard() {
  const { activeStep, canGoBack, canGoNext, goBack, goNext, reset, setStepData, wizardData } =
    useWizardState()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
              Factura digital
            </Typography>
            <Typography sx={{ color: '#17352c', fontWeight: 800 }} variant="h4">
              Wizard principal del registro de factura
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 700, mt: 1 }} variant="body1">
              Este flujo orquesta los cinco pasos del proceso y deja visible en que etapa se
              encuentra el usuario.
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }} variant="outlined">
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step completed={index < activeStep} key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Paper sx={{ borderRadius: 2, p: { xs: 3, md: 4 } }} variant="outlined">
            {getStepContent(activeStep, setStepData, reset)}

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={!canGoBack} onClick={goBack} variant="text">
                Atras
              </Button>
              <Button disabled={!canGoNext} onClick={goNext} variant="contained">
                Siguiente
              </Button>
            </Stack>
          </Paper>

          <Alert severity="info">
            Estado actual: paso {wizardData.activeStep + 1} de {steps.length}.
          </Alert>
        </Stack>
      </Box>
    </Container>
  )
}
