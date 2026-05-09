import { Box, Button, Container, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { ConfirmAIStep } from './components/ConfirmAIStep'
import { ReviewStep } from './components/ReviewStep'
import UploadStep from './components/UploadStep'
import { ValidationStep } from './components/ValidationStep'
import { useWizardState } from './hooks/useWizardState'

const steps = [
  'Cargar Factura',
  'Confirmar Procesamiento',
  'Revisar Datos',
  'Validación',
  'Resultado',
]

export default function FacturaDigitalWizard() {
  const { activeStep, canGoNext, goBack, goNext, advance, setStepData, reset, wizardData } =
    useWizardState()

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
              Factura digital
            </Typography>
            <Typography color="text.primary" sx={{ fontWeight: 800 }} variant="h4">
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
            {/* Step 0 — Upload file */}
            {activeStep === 0 && (
              <UploadStep
                initialFile={wizardData.file}
                onFileReady={(file) => setStepData({ file })}
              />
            )}

            {/* Step 1 — Confirm AI processing (FD-005) */}
            {activeStep === 1 && wizardData.file && (
              <ConfirmAIStep
                file={wizardData.file}
                onProcessed={(result) => advance({ extractedData: result })}
                onBack={goBack}
              />
            )}

            {/* Step 2 — Review & correct extracted data (FD-007) */}
            {activeStep === 2 && wizardData.file && wizardData.extractedData && (
              <ReviewStep
                file={wizardData.file}
                extractionResult={wizardData.extractedData}
                onConfirm={(data) => advance({ confirmedData: data })}
                onBack={goBack}
              />
            )}

            {/* Step 3 — Duplicate validation (FD-008) */}
            {activeStep === 3 && wizardData.confirmedData && (
              <ValidationStep
                confirmedData={wizardData.confirmedData}
                onNext={() => {}}
                onBack={goBack}
                onValidationPassed={() => advance({ validationPassed: true })}
              />
            )}

            {/* Step 4 — Result */}
            {activeStep === 4 && (
              <Stack spacing={3}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }} variant="h5">
                    Factura registrada
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                    El registro contable quedará disponible en una próxima versión.
                  </Typography>
                </Box>
                <Box>
                  <Button onClick={reset} variant="contained">
                    Registrar otra factura
                  </Button>
                </Box>
              </Stack>
            )}

            {/* External nav — only for step 0 (other steps handle navigation internally) */}
            {activeStep === 0 && (
              <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 4 }}>
                <Button disabled={!canGoNext} onClick={goNext} variant="contained">
                  Siguiente
                </Button>
              </Stack>
            )}
          </Paper>
        </Stack>
      </Box>
    </Container>
  )
}
