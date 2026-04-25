import { useReducer } from 'react'
import type { AIExtractionResult, InvoiceData } from '../types/invoice'

export interface WizardState {
  activeStep: number
  file: File | null
  extractedData: AIExtractionResult | null
  confirmedData: InvoiceData | null
  registrationResult: 'success' | 'error' | null
}

type WizardPayload = Partial<Omit<WizardState, 'activeStep'>>

type WizardAction =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GO_TO'; payload: number }
  | { type: 'SET_DATA'; payload: WizardPayload }
  | { type: 'RESET' }

const LAST_STEP_INDEX = 4

const initialState: WizardState = {
  activeStep: 0,
  file: null,
  extractedData: null,
  confirmedData: null,
  registrationResult: null,
}

function clampStep(step: number) {
  if (step < 0) {
    return 0
  }

  if (step > LAST_STEP_INDEX) {
    return LAST_STEP_INDEX
  }

  return step
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, activeStep: clampStep(state.activeStep + 1) }
    case 'BACK':
      return { ...state, activeStep: clampStep(state.activeStep - 1) }
    case 'GO_TO':
      return { ...state, activeStep: clampStep(action.payload) }
    case 'SET_DATA':
      return { ...state, ...action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function isStepComplete(state: WizardState, step: number) {
  switch (step) {
    case 0:
      return Boolean(state.file)
    case 1:
      return Boolean(state.extractedData)
    case 2:
      return Boolean(state.confirmedData)
    case 3:
      return state.registrationResult !== null
    default:
      return false
  }
}

export function useWizardState() {
  const [wizardData, dispatch] = useReducer(wizardReducer, initialState)

  const activeStep = wizardData.activeStep
  const canGoBack = activeStep > 0
  const canGoNext = activeStep < LAST_STEP_INDEX && isStepComplete(wizardData, activeStep)

  const goNext = () => {
    if (!canGoNext) {
      return
    }

    dispatch({ type: 'NEXT' })
  }

  const goBack = () => {
    if (!canGoBack) {
      return
    }

    dispatch({ type: 'BACK' })
  }

  const goToStep = (step: number) => {
    dispatch({ type: 'GO_TO', payload: step })
  }

  const setStepData = (payload: WizardPayload) => {
    dispatch({ type: 'SET_DATA', payload })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  return {
    activeStep,
    canGoBack,
    canGoNext,
    goBack,
    goNext,
    goToStep,
    reset,
    setStepData,
    wizardData,
  }
}
