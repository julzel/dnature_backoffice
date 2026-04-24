import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { AIExtractionResult, InvoiceData } from '../types/invoice'
import { ConfidenceChip } from './ConfidenceChip'

interface InvoiceFormProps {
  values: InvoiceData
  errors: Partial<Record<keyof InvoiceData, string>>
  confidenceLevels: Partial<Record<keyof InvoiceData, number>>
  originalData: AIExtractionResult
  isValid: boolean
  onChange: (field: keyof InvoiceData, value: string | number) => void
  onConfirm: () => void
}

type FieldConfig = {
  field: keyof InvoiceData
  label: string
  type?: 'text' | 'number' | 'date'
  currency?: boolean
}

const fieldGroups: FieldConfig[] = [
  { field: 'provider', label: 'Proveedor' },
  { field: 'invoiceNumber', label: 'Numero de factura' },
  { field: 'date', label: 'Fecha', type: 'date' },
  { field: 'currency', label: 'Moneda' },
  { field: 'subtotal', label: 'Subtotal', type: 'number', currency: true },
  { field: 'tax', label: 'Impuesto', type: 'number', currency: true },
  { field: 'total', label: 'Total', type: 'number', currency: true },
]

function getOriginalValue(field: keyof InvoiceData, originalData: AIExtractionResult) {
  const extractedField = originalData[field]
  return extractedField ? String(extractedField.value) : ''
}

function getNumericValue(value: number) {
  return Number.isNaN(value) ? '' : value
}

export function InvoiceForm({
  values,
  errors,
  confidenceLevels,
  originalData,
  isValid,
  onChange,
  onConfirm,
}: InvoiceFormProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography sx={{ fontWeight: 700 }} variant="h6">
          Datos extraidos
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Corrige cualquier valor antes de confirmar.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        {fieldGroups.map((config) => {
          const confidence = confidenceLevels[config.field] ?? 0
          const isLowConfidence = confidence < 0.8
          const errorMessage = errors[config.field]
          const value = values[config.field]

          return (
            <Box
              data-field={config.field}
              data-low-confidence={isLowConfidence ? 'true' : 'false'}
              key={config.field}
              sx={{
                borderRadius: 2,
                p: 1.5,
                bgcolor: isLowConfidence ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                border: '1px solid',
                borderColor: isLowConfidence ? 'warning.light' : 'divider',
              }}
            >
              <Stack spacing={1.25}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
                >
                  <Tooltip title={`Valor extraido por IA: ${getOriginalValue(config.field, originalData)}`}>
                    <Typography component="label" sx={{ fontWeight: 600 }} variant="body2">
                      {config.label}
                    </Typography>
                  </Tooltip>
                  <ConfidenceChip confidence={confidence} />
                </Stack>

                {config.field === 'currency' ? (
                  <FormControl fullWidth>
                    <Select
                      aria-label={config.label}
                      displayEmpty
                      error={Boolean(errorMessage)}
                      onChange={(event) => onChange(config.field, event.target.value)}
                      value={String(value)}
                    >
                      <MenuItem value="">
                        <em>Selecciona una moneda</em>
                      </MenuItem>
                      <MenuItem value="PEN">PEN</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                    <FormHelperText error={Boolean(errorMessage)}>
                      {errorMessage ?? ' '}
                    </FormHelperText>
                  </FormControl>
                ) : (
                  <TextField
                    error={Boolean(errorMessage)}
                    fullWidth
                    helperText={errorMessage ?? ' '}
                    onChange={(event) =>
                      onChange(
                        config.field,
                        config.type === 'number' ? event.target.value : event.target.value,
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        'aria-label': config.label,
                      },
                      input: config.currency
                        ? {
                            startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                          }
                        : undefined,
                    }}
                    type={config.type === 'date' ? 'date' : config.type === 'number' ? 'number' : 'text'}
                    value={typeof value === 'number' ? getNumericValue(value) : value}
                  />
                )}
              </Stack>
            </Box>
          )
        })}
      </Box>

      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={!isValid} onClick={onConfirm} variant="contained">
          Confirmar datos
        </Button>
      </Stack>
    </Stack>
  )
}
