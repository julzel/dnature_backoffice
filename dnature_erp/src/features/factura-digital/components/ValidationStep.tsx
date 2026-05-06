import { useCallback, useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import type { InvoiceData } from '../types/invoice'
import { useDuplicateCheck } from '../hooks/useDuplicateCheck'
import { DuplicateWarningDialog } from './DuplicateWarningDialog'

interface ValidationStepProps {
  confirmedData: InvoiceData
  onNext: () => void
  onBack: () => void
  onValidationPassed?: () => void
}

type ValidationState = 'idle' | 'checking' | 'duplicate-found' | 'no-duplicate' | 'error'

/**
 * Paso 4 del wizard - Validación de duplicados y consistencia
 * Verifica si existe una factura duplicada antes de permitir el registro
 */
export function ValidationStep({ confirmedData, onNext, onBack, onValidationPassed }: ValidationStepProps) {
  const { isChecking, result, error, checkDuplicate, reset } = useDuplicateCheck()
  const [validationState, setValidationState] = useState<ValidationState>('idle')
  const [showDialog, setShowDialog] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  /**
   * Inicia la verificación de duplicados al montar el componente
   */
  useEffect(() => {
    const startValidation = async () => {
      setValidationState('checking')
      await checkDuplicate(confirmedData.invoiceNumber, confirmedData.provider)
    }
    startValidation()
  }, [confirmedData.invoiceNumber, confirmedData.provider, checkDuplicate])

  /**
   * Actualiza el estado de validación basado en el resultado de la búsqueda
   */
  useEffect(() => {
    if (isChecking) {
      setValidationState('checking')
      return
    }

    if (error) {
      setValidationState('error')
      return
    }

    if (result?.isDuplicate) {
      setValidationState('duplicate-found')
      setShowDialog(true)
      return
    }

    if (result && !result.isDuplicate && !error) {
      setValidationState('no-duplicate')
    }
  }, [isChecking, result, error])

  /**
   * Maneja la decisión del usuario cuando encuentra duplicado
   */
  const handleContinueDespiteDuplicate = useCallback(async () => {
    setIsRegistering(true)
    try {
      // Esperar un poco antes de continuar para simular procesamiento
      await new Promise((resolve) => setTimeout(resolve, 500))
      setShowDialog(false)
      onValidationPassed?.()
      onNext()
    } finally {
      setIsRegistering(false)
    }
  }, [onNext, onValidationPassed])

  /**
   * Maneja la cancelación cuando encuentra duplicado
   */
  const handleCancelDuplicate = useCallback(() => {
    setShowDialog(false)
    reset()
    // El usuario permanece en este paso para revisar datos
  }, [reset])

  /**
   * Reintentar la verificación en caso de error
   */
  const handleRetry = useCallback(async () => {
    reset()
    setValidationState('checking')
    await checkDuplicate(confirmedData.invoiceNumber, confirmedData.provider)
  }, [checkDuplicate, confirmedData.invoiceNumber, confirmedData.provider, reset])

  return (
    <Container maxWidth="md">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Paso 4: Validación de duplicados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verificando si existe una factura con el mismo número y proveedor...
          </Typography>
        </Box>

        {/* Estado: Verificando */}
        {validationState === 'checking' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Verificando duplicados...
            </Typography>
          </Box>
        )}

        {/* Estado: Sin duplicado - Avanzar automáticamente */}
        {validationState === 'no-duplicate' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <CheckCircleOutlinedIcon sx={{ fontSize: 48, color: 'success.main' }} />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Validación completada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              No se encontraron duplicados. La factura se registrará automáticamente.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={() => {
                  onValidationPassed?.()
                  onNext()
                }}
                sx={{ textTransform: 'none' }}
              >
                Continuar al registro
              </Button>
            </Box>
          </Box>
        )}

        {/* Estado: Duplicado encontrado */}
        {validationState === 'duplicate-found' && result?.existingInvoice && (
          <Alert severity="warning" icon={<ErrorOutlinedIcon />}>
            Se encontró una factura duplicada. Por favor, revise los datos en el diálogo que aparece a continuación.
          </Alert>
        )}

        {/* Estado: Error */}
        {validationState === 'error' && (
          <Stack spacing={2}>
            <Alert severity="error">
              {error || 'Ocurrió un error al verificar duplicados. Por favor, intente de nuevo.'}
            </Alert>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleRetry} sx={{ textTransform: 'none' }}>
                Reintentar
              </Button>
              <Button onClick={onBack} sx={{ textTransform: 'none' }}>
                Volver atrás
              </Button>
            </Box>
          </Stack>
        )}

        {/* Resumen de datos siendo validados */}
        {validationState !== 'checking' && (
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f9f9f9',
              borderRadius: 1,
              borderLeft: '4px solid #1976d2',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Datos a validar:
            </Typography>
            <Typography variant="body2">
              <strong>Proveedor:</strong> {confirmedData.provider}
            </Typography>
            <Typography variant="body2">
              <strong>Número de factura:</strong> {confirmedData.invoiceNumber}
            </Typography>
            <Typography variant="body2">
              <strong>Fecha:</strong> {confirmedData.date}
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> {confirmedData.total} {confirmedData.currency}
            </Typography>
          </Box>
        )}

        {/* Navegación */}
        {validationState !== 'checking' && validationState !== 'no-duplicate' && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
            <Button onClick={onBack} sx={{ textTransform: 'none' }}>
              Volver atrás
            </Button>
          </Box>
        )}
      </Stack>

      {/* Dialog de duplicado */}
      {result?.existingInvoice && (
        <DuplicateWarningDialog
          open={showDialog}
          newInvoice={confirmedData}
          existingInvoice={result.existingInvoice}
          onContinue={handleContinueDespiteDuplicate}
          onCancel={handleCancelDuplicate}
          isLoading={isRegistering}
        />
      )}
    </Container>
  )
}
