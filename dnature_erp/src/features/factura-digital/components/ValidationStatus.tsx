import React from 'react';
import { Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface ValidationStatusProps {
  isValid: boolean;
  errors: string[];
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({ isValid, errors }) => {
  if (isValid) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon />}>
        Archivo válido.
      </Alert>
    );
  }

  return (
    <Alert severity="error" icon={<ErrorIcon />}>
      {errors.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </Alert>
  );
};

export default ValidationStatus;