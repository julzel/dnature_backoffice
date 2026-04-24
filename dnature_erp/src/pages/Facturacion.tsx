import { useState } from 'react'
import { Alert, Box, Container, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material'
import type { AIExtractionResult, InvoiceData } from '../features/factura-digital/types/invoice'
import { ReviewStep } from '../features/factura-digital/components/ReviewStep'

const demoExtractionResult: AIExtractionResult = {
  provider: { value: 'Proveedor Demo SAC', confidence: 0.96 },
  invoiceNumber: { value: 'F001-987', confidence: 0.93 },
  date: { value: '2026-04-24', confidence: 0.9 },
  currency: { value: 'PEN', confidence: 0.78 },
  subtotal: { value: 100, confidence: 0.85 },
  tax: { value: 18, confidence: 0.74 },
  total: { value: 118, confidence: 0.92 },
}

const demoFile = new File(['demo file'], 'factura-demo.pdf', { type: 'application/pdf' })

const steps = ['Carga', 'Confirmar IA', 'Revision', 'Validacion', 'Resultado']

export default function Facturacion() {
  const [confirmedData, setConfirmedData] = useState<InvoiceData | null>(null)

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
              Esta vista deja operativo el Paso 3 para revisar, corregir y confirmar la
              informacion obtenida por IA antes de seguir al flujo contable.
            </Typography>
          </Box>

          <Paper sx={{ borderRadius: 2, p: { xs: 2, md: 3 } }} variant="outlined">
            <Stepper activeStep={2} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {confirmedData ? (
            <Alert severity="success">
              Datos confirmados para la factura <strong>{confirmedData.invoiceNumber}</strong> del
              proveedor <strong>{confirmedData.provider}</strong>.
            </Alert>
          ) : null}

          <ReviewStep
            extractionResult={demoExtractionResult}
            file={demoFile}
            onConfirm={setConfirmedData}
          />
        </Stack>
      </Container>
    </Box>
  )
}
