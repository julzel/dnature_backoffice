import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useAuth } from '../auth/AuthProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = login(username, password)

    if (success) {
      navigate('/', { replace: true })
    } else {
      setError('Nombre de usuario o contraseña incorrectos')
      setPassword('')
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }} variant="outlined">
          <Stack spacing={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography color="primary" sx={{ fontWeight: 700 }} variant="overline">
                DNAture ERP
              </Typography>
              <Typography sx={{ color: 'primary.main', fontWeight: 800, mt: 1 }} variant="h4">
                Ingresa a tu cuenta
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Demo: usuario <strong>demo</strong> / contraseña <strong>demo</strong>
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  label="Nombre de usuario"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  fullWidth
                  autoFocus
                />

                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || !username || !password}
                  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Card>
      </Container>
    </Box>
  )
}
