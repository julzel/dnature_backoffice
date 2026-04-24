import React, { useState } from 'react';
import { Box, Button, Typography, Card, CardMedia, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';

const UploadStep: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setError('Formato no permitido. Use JPG, PNG o PDF.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('El archivo excede el tamaño máximo permitido (10 MB).');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <Box sx={{ p: 3, border: '1px dashed gray', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cargar Factura
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!file ? (
        <Box>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mr: 2 }}
          >
            Subir archivo
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/jpeg,image/png,application/pdf"
            />
          </Button>
          <Button
            variant="outlined"
            startIcon={<CameraAltIcon />}
            disabled
          >
            Tomar foto
          </Button>
        </Box>
      ) : (
        <Card sx={{ mt: 2 }}>
          {preview && <CardMedia component="img" image={preview} alt="Vista previa" />}
          <Button
            variant="text"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveFile}
          >
            Eliminar archivo
          </Button>
        </Card>
      )}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!file}
      >
        Continuar
      </Button>
    </Box>
  );
};

export default UploadStep;