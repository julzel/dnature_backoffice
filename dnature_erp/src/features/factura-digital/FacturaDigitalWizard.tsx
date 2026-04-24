import UploadStep from './components/UploadStep';

// Inside the FacturaDigitalWizard component, replace the content rendering logic:
<Box sx={{ p: 3 }}>
  {state.activeStep === 0 && <UploadStep />}
  {/* ...existing code for other steps... */}
</Box>