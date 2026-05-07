import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import type { ValidationResult } from '../validators/fileValidator';

interface Props {
  result: ValidationResult;
}

export default function ValidationStatus({ result }: Props) {
  if (result.isValid) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon color="success" />}>
        <AlertTitle>Archivo válido</AlertTitle>
        <Typography>El archivo cumple con los requisitos.</Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Alert severity="error" icon={<ErrorIcon color="error" />}>
        <AlertTitle>Errores de validación</AlertTitle>
        <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
          {result.errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))}
        </Box>
      </Alert>
    </Box>
  );
}
