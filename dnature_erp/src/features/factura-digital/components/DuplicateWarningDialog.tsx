import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import type { InvoiceData } from '../types/invoice'
import { ComparisonTable } from './ComparisonTable'

interface DuplicateWarningDialogProps {
  open: boolean
  newInvoice: InvoiceData
  existingInvoice: InvoiceData & { registeredAt: string; registeredBy: string }
  onContinue: () => void
  onCancel: () => void
  isLoading?: boolean
}

/**
 * Dialog modal que muestra advertencia de factura duplicada
 * Permite al usuario ver la factura existente y elegir continuar o cancelar
 */
export function DuplicateWarningDialog({
  open,
  newInvoice,
  existingInvoice,
  onContinue,
  onCancel,
  isLoading = false,
}: DuplicateWarningDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
        <WarningIcon sx={{ color: 'warning.main' }} />
        Factura duplicada
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Ya existe una factura registrada con el número <strong>{existingInvoice.invoiceNumber}</strong> del
            proveedor <strong>{existingInvoice.provider}</strong>.
          </Alert>

          <Box>
            <ComparisonTable newInvoice={newInvoice} existingInvoice={existingInvoice} />
          </Box>

          <Alert severity="info">
            Si continúa, se registrará una nueva factura con los mismos datos. Asegúrese de que es una factura
            diferente antes de proceder.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ gap: 1, p: 2 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={onContinue} variant="contained" disabled={isLoading} sx={{ textTransform: 'none' }}>
          {isLoading ? 'Registrando...' : 'Continuar de todos modos'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
