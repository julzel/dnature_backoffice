import React from 'react'
import { Alert, Box, Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import type { ValidationResult } from '../validators/fileValidator'

interface ValidationStatusProps {
  validation: ValidationResult | null
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({ validation }) => {
  if (!validation) {
    return null
  }

  if (validation.isValid) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon />}>
        <Stack spacing={0.5}>
          <Typography sx={{ fontWeight: 700 }} variant="body2">
            Archivo valido
          </Typography>
          <Typography variant="body2">
            El archivo cumple con el formato y tamano permitidos.
          </Typography>
        </Stack>
      </Alert>
    )
  }

  return (
    <Alert severity="error" icon={<ErrorIcon />}>
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 700 }} variant="body2">
          Archivo invalido
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {validation.errors.map((error) => (
            <li key={error}>
              <Typography variant="body2">{error}</Typography>
            </li>
          ))}
        </Box>
      </Stack>
    </Alert>
  )
}

export default ValidationStatus
