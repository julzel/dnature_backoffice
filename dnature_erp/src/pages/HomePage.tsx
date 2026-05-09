import { useState } from 'react'
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

interface MetricCard {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

const metrics: MetricCard[] = [
  {
    label: 'Facturas emitidas',
    value: '1,234',
    change: '+12% este mes',
    changeType: 'positive',
  },
  {
    label: 'Ingresos totales',
    value: 'S/ 45,670',
    change: '+8% vs mes anterior',
    changeType: 'positive',
  },
  {
    label: 'Facturas pendientes',
    value: '23',
    change: '+5 hoy',
    changeType: 'neutral',
  },
  {
    label: 'Errores de validación',
    value: '3',
    change: '-2 que ayer',
    changeType: 'positive',
  },
]

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            {/* Page Header */}
            <Box>
              <Typography color="primary" variant="overline">
                Panel de control
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                Bienvenido a DNAture ERP
              </Typography>
            </Box>

            {/* Metrics Grid */}
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }} component="h2">
                Métricas del mes
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {metrics.map((metric, index) => (
                  <Paper
                    key={metric.label}
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      bgcolor: hoveredCard === index ? 'background.paper' : undefined,
                      transform: hoveredCard === index ? 'translateY(-2px)' : undefined,
                      boxShadow: hoveredCard === index ? 2 : undefined,
                      '&:hover': {
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                      },
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Stack spacing={1.5}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {metric.label}
                      </Typography>

                      <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {metric.value}
                      </Typography>

                      {metric.change && (
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              metric.changeType === 'positive'
                                ? 'success.main'
                                : metric.changeType === 'negative'
                                  ? 'error.main'
                                  : 'text.secondary',
                            fontWeight: 600,
                          }}
                        >
                          {metric.changeType === 'positive' ? '↑ ' : metric.changeType === 'negative' ? '↓ ' : ''}
                          {metric.change}
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Upcoming Tasks Section */}
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }} component="h2">
                Próximas tareas
              </Typography>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={2}>
                  <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Revisar facturas pendientes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          23 comprobantes esperando validación
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Verificar reportes del mes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Reporte de abril está listo para descargar
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
