import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon,
  Inventory2 as InventoryIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material'
import { useAuth } from '../auth/AuthProvider'
import { useColorMode } from '../theme/ThemeProvider'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Facturación',
    path: '/facturacion',
    icon: <ReceiptIcon />,
  },
  {
    label: 'Inventario',
    path: '/inventario',
    icon: <InventoryIcon />,
  },
  {
    label: 'Proveedores',
    path: '/proveedores',
    icon: <ShippingIcon />,
  },
]

const DRAWER_WIDTH = 260

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { logout } = useAuth()
  const { toggleColorMode, mode } = useColorMode()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile) {
      setMobileDrawerOpen(false)
    }
  }

  const drawerContent = (
    <Box>
      <Box sx={{ p: 3 }}>
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText',
                fontWeight: 800,
              }}
            >
              D
            </Box>
            <Box>
              <Box sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.secondary' }}>DNATURE</Box>
              <Box sx={{ fontSize: '0.625rem', color: 'text.secondary' }}>ERP</Box>
            </Box>
          </Box>
          {isMobile && (
            <IconButton size="small" onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
      </Box>

      <List sx={{ px: 2 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" onClick={() => setMobileDrawerOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Box sx={{ fontWeight: 800, color: 'primary.contrastText' }}>DNAture ERP</Box>
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

        {/* Page Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  )
}
