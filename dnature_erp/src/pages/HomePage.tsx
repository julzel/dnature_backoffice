import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function HomePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="primary" variant="overline">
                  DNAture ERP
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Panel de bienvenida
                </Typography>
              </Box>
              <Button onClick={handleLogout} variant="outlined" color="error">
                Cerrar sesión
              </Button>
            </Box>

            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h5" color="text.secondary">
                Bienvenido al sistema
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Este es el panel de inicio. El contenido se agregará pronto.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
