import React, { useReducer } from 'react';

import { Stepper, Step, StepLabel, Container, Box, Paper } from '@mui/material';

const steps = [
  'Cargar Factura',
  'Confirmar Procesamiento',
  'Revisar Datos',
  'Validación',
  'Resultado',
];

interface WizardState {
  activeStep: number;
}

const initialState: WizardState = {
  activeStep: 0,
};

function wizardReducer(state: WizardState, action: { type: 'NEXT' | 'BACK' | 'RESET' }): WizardState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, activeStep: state.activeStep + 1 };
    case 'BACK':
      return { ...state, activeStep: state.activeStep - 1 };
    case 'RESET':
      return { ...state, activeStep: 0 };
    default:
      return state;
  }
}

const FacturaDigitalWizard: React.FC = () => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Paper elevation={3}>
          <Stepper activeStep={state.activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 3 }}>
            {state.activeStep === steps.length ? (
              <div>
                <p>Proceso completado</p>
                <button onClick={() => dispatch({ type: 'RESET' })}>Reiniciar</button>
              </div>
            ) : (
              <div>
                <p>Paso {state.activeStep + 1}: {steps[state.activeStep]}</p>
                <button
                  onClick={() => dispatch({ type: 'BACK' })}
                  disabled={state.activeStep === 0}
                >
                  Atrás
                </button>
                <button
                  onClick={() => dispatch({ type: 'NEXT' })}
                  disabled={state.activeStep === steps.length - 1}
                >
                  Siguiente
                </button>
              </div>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default FacturaDigitalWizard;