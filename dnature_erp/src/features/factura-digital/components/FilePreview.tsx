import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import { Avatar, Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material'

interface FilePreviewProps {
  file: File
  preview: string | null
  onRemove: () => void
}

export default function FilePreview({ file, preview, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'

  return (
    <Card variant="outlined">
      {isImage && preview ? (
        <CardMedia component="img" image={preview} alt={`Vista previa de ${file.name}`} sx={{ height: 220, objectFit: 'contain', bgcolor: '#f6f7f9' }} />
      ) : (
        <Stack spacing={2} sx={{ alignItems: 'center', py: 4 }}>
          <Avatar sx={{ bgcolor: 'rgba(183, 110, 21, 0.12)', color: '#b76e15', width: 72, height: 72 }} variant="rounded">
            {isPdf ? <PictureAsPdfOutlinedIcon fontSize="large" /> : <DescriptionOutlinedIcon fontSize="large" />}
          </Avatar>
          <Typography>{isPdf ? 'PDF cargado correctamente' : 'Archivo cargado'}</Typography>
        </Stack>
      )}
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{file.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {file.type}
            </Typography>
          </Box>
          <IconButton aria-label="Eliminar archivo" color="error" onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  )
}
