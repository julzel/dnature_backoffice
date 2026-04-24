import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import { useInvoiceForm } from '../hooks/useInvoiceForm'
import type { AIExtractionResult, InvoiceData } from '../types/invoice'
import { DocumentPreview } from './DocumentPreview'
import { InvoiceForm } from './InvoiceForm'

interface ReviewStepProps {
  file: File
  extractionResult: AIExtractionResult
  onConfirm: (data: InvoiceData) => void
}

export function ReviewStep({ file, extractionResult, onConfirm }: ReviewStepProps) {
  const { confidenceLevels, errors, handleChange, isValid, validate, values } =
    useInvoiceForm(extractionResult)

  const handleConfirm = () => {
    if (validate()) {
      onConfirm(values)
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        <CheckCircleOutlineOutlinedIcon color="success" />
        <Box>
          <Typography sx={{ fontWeight: 800 }} variant="h4">
            Paso 3. Revision y correccion
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Valida lo extraido por IA antes de continuar al siguiente paso.
          </Typography>
        </Box>
      </Stack>

      {!isValid ? (
        <Alert severity="warning">
          Hay datos pendientes por corregir antes de confirmar la factura.
        </Alert>
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.4fr) minmax(280px, 0.9fr)' },
        }}
      >
        <Paper sx={{ borderRadius: 2, p: 3 }} variant="outlined">
          <InvoiceForm
            confidenceLevels={confidenceLevels}
            errors={errors}
            isValid={isValid}
            onChange={handleChange}
            onConfirm={handleConfirm}
            originalData={extractionResult}
            values={values}
          />
        </Paper>

        <DocumentPreview file={file} />
      </Box>
    </Stack>
  )
}
