import { Alert, Box, Button, Container, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import UploadStep from './components/UploadStep'
import { useWizardState } from './hooks/useWizardState'

const steps = [
  'Cargar Factura',
  'Confirmar Procesamiento',
  'Revisar Datos',
  'Validacion',
  'Resultado',
]

function PlaceholderStep({ title }: { title: string }) {
  return (
    <Stack spacing={2}>
      <Typography sx={{ fontWeight: 700 }} variant="h5">
        {title}
      </Typography>
      <Alert severity="info">Este paso quedara implementado en una historia siguiente.</Alert>
    </Stack>
  )
}

export default function FacturaDigitalWizard() {
  const { activeStep, canGoBack, canGoNext, goBack, goNext, setStepData, wizardData } =
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
              Registro guiado de factura
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
            {activeStep === 0 ? (
              <UploadStep
                initialFile={wizardData.file}
                onFileReady={(file) => setStepData({ file })}
              />
            ) : null}
            {activeStep === 1 ? <PlaceholderStep title="Paso 2: Confirmar Procesamiento" /> : null}
            {activeStep === 2 ? <PlaceholderStep title="Paso 3: Revisar Datos" /> : null}
            {activeStep === 3 ? <PlaceholderStep title="Paso 4: Validacion" /> : null}
            {activeStep === 4 ? <PlaceholderStep title="Paso 5: Resultado" /> : null}

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', mt: 4 }}>
              <Button disabled={!canGoBack} onClick={goBack} variant="text">
                Atras
              </Button>
              <Button disabled={!canGoNext} onClick={goNext} variant="contained">
                Siguiente
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Container>
  )
}
