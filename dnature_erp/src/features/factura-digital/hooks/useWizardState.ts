import { useReducer } from 'react'
import type { AIExtractionResult, InvoiceData } from '../types/invoice'

export interface WizardState {
  activeStep: number
  file: File | null
  extractedData: AIExtractionResult | null
  confirmedData: InvoiceData | null
  validationPassed: boolean
  registrationResult: 'success' | 'error' | null
}

type WizardPayload = Partial<Omit<WizardState, 'activeStep'>>

type WizardAction =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SET_DATA'; payload: WizardPayload }
  | { type: 'RESET' }

const LAST_STEP_INDEX = 4

const initialState: WizardState = {
  activeStep: 0,
  file: null,
  extractedData: null,
  confirmedData: null,
  validationPassed: false,
  registrationResult: null,
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, activeStep: Math.min(state.activeStep + 1, LAST_STEP_INDEX) }
    case 'BACK':
      return { ...state, activeStep: Math.max(state.activeStep - 1, 0) }
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
      return state.validationPassed
    default:
      return false
  }
}

export function useWizardState() {
  const [wizardData, dispatch] = useReducer(wizardReducer, initialState)

  const activeStep = wizardData.activeStep
  const canGoBack = activeStep > 0
  const canGoNext = activeStep < LAST_STEP_INDEX && isStepComplete(wizardData, activeStep)

  return {
    activeStep,
    canGoBack,
    canGoNext,
    goBack: () => {
      if (canGoBack) {
        dispatch({ type: 'BACK' })
      }
    },
    goNext: () => {
      if (canGoNext) {
        dispatch({ type: 'NEXT' })
      }
    },
    reset: () => dispatch({ type: 'RESET' }),
    setStepData: (payload: WizardPayload) => dispatch({ type: 'SET_DATA', payload }),
    wizardData,
  }
}
