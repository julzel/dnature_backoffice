import { useEffect, useMemo } from 'react'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material'

interface DocumentPreviewProps {
  file: File
}

export function DocumentPreview({ file }: DocumentPreviewProps) {
  const previewUrl = useMemo(
    () => (file.type.startsWith('image/') ? URL.createObjectURL(file) : null),
    [file],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const icon =
    file.type === 'application/pdf' ? (
      <PictureAsPdfOutlinedIcon fontSize="large" />
    ) : file.type.startsWith('image/') ? (
      <ImageOutlinedIcon fontSize="large" />
    ) : (
      <DescriptionOutlinedIcon fontSize="large" />
    )

  return (
    <Paper sx={{ borderRadius: 2, p: 3 }} variant="outlined">
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontWeight: 700 }} variant="h6">
            Documento original
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Vista de referencia para revisar y corregir datos.
          </Typography>
        </Box>

        {previewUrl ? (
          <Box
            component="img"
            src={previewUrl}
            alt={`Vista previa de ${file.name}`}
            sx={{
              width: '100%',
              maxHeight: 340,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              objectFit: 'contain',
              bgcolor: '#f6f7f9',
            }}
          />
        ) : (
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 4,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'rgba(183, 110, 21, 0.12)',
                color: '#b76e15',
              }}
              variant="rounded"
            >
              {icon}
            </Avatar>
            <Typography align="center" variant="body2">
              {file.name}
            </Typography>
          </Stack>
        )}

        <Typography color="text.secondary" variant="body2">
          {file.name}
        </Typography>
      </Stack>
    </Paper>
  )
}
