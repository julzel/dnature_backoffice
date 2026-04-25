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

function PlaceholderStep({
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
      <Alert severity="info">Este paso quedara implementado en una historia siguiente.</Alert>
    </Stack>
  )
}

function ResultStep({ onReset }: { onReset: () => void }) {
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
            {activeStep === 0 ? (
              <UploadStep
                initialFile={wizardData.file}
                onFileReady={(file) => setStepData({ file })}
              />
            ) : null}
            {activeStep === 1 ? (
              <PlaceholderStep
                description="Aqui se confirmara el uso de IA antes del procesamiento."
                title="Paso 2: Confirmar Procesamiento"
              />
            ) : null}
            {activeStep === 2 ? (
              <PlaceholderStep
                description="Aqui se mostrara el formulario editable para revisar y corregir datos."
                title="Paso 3: Revisar Datos"
              />
            ) : null}
            {activeStep === 3 ? (
              <PlaceholderStep
                description="Aqui se ejecutaran validaciones antes del registro final."
                title="Paso 4: Validacion"
              />
            ) : null}
            {activeStep === 4 ? <ResultStep onReset={reset} /> : null}

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
