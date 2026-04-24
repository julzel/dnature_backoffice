import React, { useState } from 'react';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import ValidationStatus from './ValidationStatus';
import { validateFile } from '../validators/fileValidator';

interface UploadStepProps {
  onContinue: (file: File) => void;
}

export default function UploadStep({ onContinue }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setIsValidating(true);
    setError(null);

    setTimeout(() => {
      const validationResult = validateFile(selectedFile);

      if (!validationResult.isValid) {
        setError(validationResult.errors.join(', '));
        setFile(null);
        setPreview(null);
        setIsValidating(false);
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      setIsValidating(false);
    }, 500);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFile = event.dataTransfer.files?.[0] || null;
    handleFileChange(droppedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleContinue = () => {
    if (file) {
      onContinue(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Paso 1: Carga tu factura
      </Typography>

      {!file ? (
        <Paper
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '2px dashed #ccc',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
            },
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            Arrastra tu factura aquí o haz clic para seleccionar
          </Typography>
          <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 2 }}>
            Formatos aceptados: JPG, PNG, PDF (máx. 10 MB)
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Subir archivo
            </Button>
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              onClick={() => cameraInputRef.current?.click()}
            >
              Tomar foto
            </Button>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleInputChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            hidden
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
          />
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Archivo seleccionado:
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </Typography>
            {preview && file.type !== 'application/pdf' && (
              <Box
                component="img"
                src={preview}
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 1,
                  mt: 1,
                }}
              />
            )}
          </Paper>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveFile}
            fullWidth
          >
            Eliminar archivo
          </Button>
        </Box>
      )}

      {isValidating && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Validando archivo...</Typography>
        </Box>
      )}

      {error && <ValidationStatus isValid={false} errors={[error]} />}

      <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!file || isValidating}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}