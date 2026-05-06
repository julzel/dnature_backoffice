import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import type { InvoiceData } from '../types/invoice'

interface ComparisonTableProps {
  newInvoice: InvoiceData
  existingInvoice: InvoiceData & { registeredAt: string; registeredBy: string }
}

/**
 * Componente que muestra una tabla comparativa entre la factura actual y la existente
 */
export function ComparisonTable({ newInvoice, existingInvoice }: ComparisonTableProps) {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(amount)
    } catch {
      return `${amount} ${currency}`
    }
  }

  const getRowStyle = (newValue: string | number, existingValue: string | number) => {
    const isEqual = String(newValue) === String(existingValue)
    return {
      backgroundColor: isEqual ? 'transparent' : '#fff3cd',
    }
  }

  const rows = [
    { label: 'Proveedor', newValue: newInvoice.provider, existingValue: existingInvoice.provider },
    { label: 'Número de Factura', newValue: newInvoice.invoiceNumber, existingValue: existingInvoice.invoiceNumber },
    { label: 'Fecha', newValue: formatDate(newInvoice.date), existingValue: formatDate(existingInvoice.date) },
    {
      label: 'Subtotal',
      newValue: formatCurrency(newInvoice.subtotal, newInvoice.currency),
      existingValue: formatCurrency(existingInvoice.subtotal, existingInvoice.currency),
    },
    {
      label: 'Impuesto',
      newValue: formatCurrency(newInvoice.tax, newInvoice.currency),
      existingValue: formatCurrency(existingInvoice.tax, existingInvoice.currency),
    },
    {
      label: 'Total',
      newValue: formatCurrency(newInvoice.total, newInvoice.currency),
      existingValue: formatCurrency(existingInvoice.total, existingInvoice.currency),
    },
  ]

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
        Comparación de datos
      </Typography>
      <TableContainer>
        <Table size="small" sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, width: '25%' }}>Campo</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '37.5%' }}>Nueva factura</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '37.5%' }}>Factura existente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label} sx={getRowStyle(row.newValue, row.existingValue)}>
                <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                <TableCell>{row.newValue}</TableCell>
                <TableCell>{row.existingValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
        📝 Factura existente registrada por{' '}
        <strong>{existingInvoice.registeredBy}</strong> el{' '}
        <strong>{formatDate(existingInvoice.registeredAt)}</strong>
      </Typography>
    </Box>
  )
}
