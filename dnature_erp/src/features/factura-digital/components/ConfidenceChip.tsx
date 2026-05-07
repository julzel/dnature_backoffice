import { Chip } from '@mui/material'

interface ConfidenceChipProps {
  confidence: number
}

export function ConfidenceChip({ confidence }: ConfidenceChipProps) {
  let label = 'Confianza baja'
  let color: 'success' | 'warning' | 'error' = 'error'

  if (confidence >= 0.9) {
    label = 'Confianza alta'
    color = 'success'
  } else if (confidence >= 0.8) {
    label = 'Confianza media'
    color = 'warning'
  }

  return (
    <Chip
      color={color}
      label={`${label} ${Math.round(confidence * 100)}%`}
      size="small"
      variant={color === 'warning' ? 'outlined' : 'filled'}
    />
  )
}
