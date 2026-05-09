import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Brightness4 as DarkIcon, Brightness7 as LightIcon, Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '../auth/AuthProvider'
import { useColorMode } from '../theme/ThemeProvider'

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
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { toggleColorMode, mode } = useColorMode()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 800, color: 'primary.contrastText' }}>
              DNAture ERP
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}>
              <IconButton color="inherit" onClick={toggleColorMode} size="small">
                {mode === 'light' ? <DarkIcon /> : <LightIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Cerrar sesión">
              <IconButton color="inherit" onClick={handleLogout} size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1 }}>
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

              {/* Quick Actions Section */}
              <Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }} component="h2">
                  Acciones rápidas
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="contained" size="large">
                    Cargar factura
                  </Button>
                  <Button variant="outlined" size="large">
                    Ver reportes
                  </Button>
                  <Button variant="outlined" size="large">
                    Configuración
                  </Button>
                </Stack>
              </Box>

              {/* Upcoming Tasks Section */}
              <Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }} component="h2">
                  Próximas tareas
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Stack spacing={2}>
                    <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Revisar facturas pendientes
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            23 comprobantes esperando validación
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Verificar reportes del mes
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Reporte de abril está listo para descargar
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
