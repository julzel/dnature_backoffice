import { Box, Container, Stack, Typography } from '@mui/material'

export default function SuppliersPage() {
  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            <Box>
              <Typography color="primary" variant="overline">
                Módulo
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Proveedores
              </Typography>
            </Box>

            <Box sx={{ py: 12, textAlign: 'center' }}>
              <Typography variant="h5" color="text.secondary">
                Este módulo está en desarrollo
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                La gestión de proveedores estará disponible pronto.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
