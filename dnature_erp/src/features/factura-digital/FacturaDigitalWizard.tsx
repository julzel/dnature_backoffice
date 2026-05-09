import { Box, Button, Card, CardContent, CircularProgress, Container, Divider, List, ListItem, ListItemText, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useCallback, useState } from 'react'
import { ConfirmAIStep } from './components/ConfirmAIStep'
import { ReviewStep } from './components/ReviewStep'
import UploadStep from './components/UploadStep'
import { ValidationStep } from './components/ValidationStep'
import { useWizardState } from './hooks/useWizardState'
import { registerInvoice } from './services/invoiceService'

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
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)
  const [rowId, setRowId] = useState<string | null>(null)

  const handleValidationPassed = useCallback(async () => {
    if (!wizardData.confirmedData) return
    setIsRegistering(true)
    setRegistrationError(null)
    try {
      const result = await registerInvoice(wizardData.confirmedData)
      if (result.success) {
        setRowId(result.rowId ?? null)
        advance({ validationPassed: true })
      } else {
        setRegistrationError(result.error ?? 'No se pudo registrar la factura.')
      }
    } catch (err) {
      setRegistrationError(err instanceof Error ? err.message : 'Error inesperado.')
    } finally {
      setIsRegistering(false)
    }
  }, [wizardData.confirmedData, advance])

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
                onValidationPassed={handleValidationPassed}
                isRegistering={isRegistering}
                registrationError={registrationError}
              />
            )}

            {/* Step 4 — Result */}
            {activeStep === 4 && wizardData.confirmedData && (
              <Stack spacing={3}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <CheckCircleOutlineIcon color="success" sx={{ fontSize: 36 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700 }} variant="h5">
                      Factura registrada exitosamente
                    </Typography>
                    {rowId && (
                      <Typography variant="body2" color="text.secondary">
                        ID de registro: <strong>{rowId}</strong>
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Resumen de la factura
                    </Typography>
                    <List dense disablePadding>
                      <ListItem disableGutters>
                        <ListItemText primary="Proveedor" secondary={wizardData.confirmedData.provider} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem disableGutters>
                        <ListItemText primary="Número de factura" secondary={wizardData.confirmedData.invoiceNumber} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem disableGutters>
                        <ListItemText primary="Fecha" secondary={wizardData.confirmedData.date} />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem disableGutters>
                        <ListItemText
                          primary="Total"
                          secondary={`${wizardData.confirmedData.currency} ${wizardData.confirmedData.total.toFixed(2)}`}
                          secondaryTypographyProps={{ fontWeight: 700, color: 'text.primary' }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

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
