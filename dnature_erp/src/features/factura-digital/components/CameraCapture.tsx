import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Button } from '@mui/material'

interface CameraCaptureProps {
  onCapture: (file: File | null) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const handleCapture = () => {
    const simulatedCapture = new File(['camera-photo'], 'captura-camara.jpg', {
      type: 'image/jpeg',
    })
    onCapture(simulatedCapture)
  }

  return (
    <Button onClick={handleCapture} startIcon={<CameraAltIcon />} variant="outlined">
      Tomar foto
    </Button>
  )
}
