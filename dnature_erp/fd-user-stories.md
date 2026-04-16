# Factura Digital — User Stories & Tickets

> Módulo de Registro de Factura Digital con IA
> Stack: React 19, TypeScript, Material UI, Vite
> Testing: React Testing Library (RTL) + Vitest
> Principios: KISS, SOLID, DRY

---

## Convenciones

- **Estructura de carpetas sugerida:**

```
src/
  features/
    factura-digital/
      components/        # Componentes de UI reutilizables
      hooks/             # Custom hooks del módulo
      services/          # Llamadas a APIs
      types/             # Tipos e interfaces TypeScript
      utils/             # Funciones utilitarias puras
      validators/        # Funciones de validación
      constants/         # Constantes del módulo
      __tests__/         # Tests unitarios
      FacturaDigitalWizard.tsx  # Componente orquestador (stepper)
```

- Cada ticket es independiente y puede asignarse a un desarrollador distinto.
- Los tickets están ordenados por dependencia lógica.
- Prioridad: 🔴 Crítica | 🟠 Alta | 🟡 Media | 🟢 Baja

---

## FD-001 — Setup inicial del módulo y dependencias

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como desarrollador, me gustaría tener la estructura base del módulo de factura digital con todas las dependencias instaladas, para poder comenzar a implementar las funcionalidades del producto.

### Criterios de aceptación

- [ ] AC-1: Material UI (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`) está instalado y funcional.
- [ ] AC-2: Vitest y React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest`, `jsdom`) están configurados.
- [ ] AC-3: La estructura de carpetas del módulo `src/features/factura-digital/` está creada.
- [ ] AC-4: Existe un archivo de tipos compartidos (`types/invoice.ts`) con las interfaces base del módulo.
- [ ] AC-5: El script `test` está configurado en `package.json`.
- [ ] AC-6: Existe un test de humo que verifica que el entorno de testing funciona correctamente.

### Instrucciones de implementación

**Dependencias a instalar:**

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Tipos base (`types/invoice.ts`):**

```ts
export interface InvoiceData {
  provider: string;
  invoiceNumber: string;
  date: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
}

export interface ExtractedField<T = string | number> {
  value: T;
  confidence: number; // 0-1
}

export interface AIExtractionResult {
  provider: ExtractedField<string>;
  invoiceNumber: ExtractedField<string>;
  date: ExtractedField<string>;
  currency: ExtractedField<string>;
  subtotal: ExtractedField<number>;
  tax: ExtractedField<number>;
  total: ExtractedField<number>;
}

export interface AuditRecord {
  originalFile: File;
  extractedData: AIExtractionResult | null;
  confirmedData: InvoiceData;
  userId: string;
  timestamp: string;
  result: 'success' | 'error' | 'cancelled';
}

export type WizardStep =
  | 'upload'
  | 'confirm-ai'
  | 'review'
  | 'validation'
  | 'result';
```

**Configuración de Vitest (`vitest.config.ts` o dentro de `vite.config.ts`):**

Agregar la configuración de test dentro de `vite.config.ts`:

```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

**Setup de testing (`src/test/setup.ts`):**

```ts
import '@testing-library/jest-dom';
```

### Tests requeridos

- Test de humo: renderizar un componente MUI básico y verificar que se muestra.

---

## FD-002 — Wizard / Stepper principal

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como usuario, me gustaría ver un flujo guiado paso a paso para registrar mi factura, para entender en qué etapa del proceso me encuentro y qué sigue.

### Criterios de aceptación

- [ ] AC-1: Se muestra un stepper horizontal con 5 pasos: Cargar Factura → Confirmar Procesamiento → Revisar Datos → Validación → Resultado.
- [ ] AC-2: El paso activo se resalta visualmente.
- [ ] AC-3: Los pasos completados muestran un indicador de completado.
- [ ] AC-4: No se puede avanzar al siguiente paso sin completar el actual.
- [ ] AC-5: El usuario puede ver el nombre de cada paso en el stepper.
- [ ] AC-6: El contenido del paso activo se renderiza debajo del stepper.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Stepper`, `Step`, `StepLabel` de `@mui/material`
- `Container`, `Box`, `Paper` para layout

**Componente principal: `FacturaDigitalWizard.tsx`**

- Usar un custom hook `useWizardState` para manejar el paso activo, datos acumulados y navegación.
- El hook debe exponer: `activeStep`, `goNext()`, `goBack()`, `setStepData()`, `wizardData`.
- Renderizar condicionalmente el componente de cada paso según `activeStep`.

**Hook sugerido: `hooks/useWizardState.ts`**

```ts
// Estado del wizard
interface WizardState {
  activeStep: number;
  file: File | null;
  extractedData: AIExtractionResult | null;
  confirmedData: InvoiceData | null;
  registrationResult: 'success' | 'error' | null;
}
```

- Usar `useReducer` para manejar transiciones de estado de forma predecible.
- Cada paso actualiza solo su porción del estado.
- Principio KISS: el stepper solo orquesta, cada paso maneja su propia lógica interna.

### Tests requeridos (RTL)

- Renderiza el stepper con 5 pasos visibles.
- El primer paso está activo por defecto.
- Los pasos futuros no están marcados como completados.
- Al cambiar `activeStep`, el contenido del paso correspondiente se muestra.

---

## FD-003 — Carga de factura (Paso 1)

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como usuario, me gustaría cargar una imagen o PDF de mi factura desde mi dispositivo o tomar una foto, para que el sistema pueda procesarla y extraer los datos.

### Criterios de aceptación

- [ ] AC-1: Existe un área de drag & drop donde puedo soltar un archivo.
- [ ] AC-2: Existe un botón "Subir archivo" que abre el selector de archivos del sistema.
- [ ] AC-3: Existe un botón "Tomar foto" que activa la cámara del dispositivo (si está disponible).
- [ ] AC-4: Solo se aceptan archivos JPG, PNG o PDF.
- [ ] AC-5: Se muestra una vista previa del archivo cargado (imagen o indicador para PDF).
- [ ] AC-6: El botón "Continuar" solo se habilita si hay un archivo válido cargado.
- [ ] AC-7: Si el usuario cambia de archivo, la vista previa se actualiza.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Button` con `startIcon` para acciones de carga y cámara.
- `Box` con estilos de borde punteado para el área de drag & drop.
- `Typography` para instrucciones.
- `IconButton` con `CloudUploadIcon`, `CameraAltIcon`, `DeleteIcon`.
- `Card` / `CardMedia` para la vista previa.
- `Alert` para mensajes de validación.

**Componentes a crear:**

- `components/FileUploadArea.tsx` — Área de drag & drop + botón de subir.
- `components/CameraCapture.tsx` — Botón y lógica de captura con cámara.
- `components/FilePreview.tsx` — Vista previa de imagen/PDF.
- `components/UploadStep.tsx` — Orquestador del paso 1.

**Hook sugerido: `hooks/useFileUpload.ts`**

- Manejar `dragOver`, `drop`, `onChange` events.
- Validar tipo MIME: `image/jpeg`, `image/png`, `application/pdf`.
- Generar URL de preview con `URL.createObjectURL()`.
- Limpiar URL con `URL.revokeObjectURL()` en cleanup.
- Retornar: `{ file, preview, error, handleDrop, handleSelect, handleRemove }`.

**Validaciones (DRY — extraer a `validators/fileValidator.ts`):**

```ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateFile(file: File): ValidationResult { ... }
```

### Tests requeridos (RTL)

- Renderiza el área de drop, botón de subir y botón de cámara.
- Al seleccionar un archivo válido (JPG), muestra la vista previa.
- Al seleccionar un archivo inválido (`.txt`), muestra mensaje de error.
- El botón "Continuar" está deshabilitado si no hay archivo.
- El botón "Continuar" se habilita al cargar un archivo válido.
- Al hacer click en eliminar, se limpia el archivo y la vista previa.

---

## FD-004 — Validación inicial del archivo

**Prioridad:** 🟠 Alta

### Historia de usuario

> Como usuario, me gustaría recibir retroalimentación inmediata si mi archivo no es válido (formato incorrecto, muy pesado, borroso), para no perder tiempo intentando procesar un documento inservible.

### Criterios de aceptación

- [ ] AC-1: Si el formato no es JPG, PNG o PDF, se muestra un error: "Formato no permitido. Use JPG, PNG o PDF."
- [ ] AC-2: Si el archivo excede el tamaño máximo, se muestra un error: "El archivo excede el tamaño máximo permitido."
- [ ] AC-3: Se muestra un indicador visual del resultado de la validación (ícono check verde o error rojo).
- [ ] AC-4: Si la validación falla, el botón "Continuar" permanece deshabilitado.
- [ ] AC-5: Las validaciones se ejecutan inmediatamente al cargar el archivo.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Alert` con severity `error` | `success` para mensajes de validación.
- `CheckCircleIcon`, `ErrorIcon` para indicadores visuales.
- `LinearProgress` si se implementa validación async (calidad de imagen).

**Funciones de validación (`validators/fileValidator.ts`):**

```ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateFileType(file: File): boolean;
export function validateFileSize(file: File, maxSize: number): boolean;
export function validateFile(file: File): ValidationResult;
```

- SOLID (SRP): Cada validación es una función pura independiente.
- DRY: Reutilizar constantes de `constants/fileConstants.ts`.
- KISS: Las validaciones son síncronas y determinísticas.

**Componente: `components/ValidationStatus.tsx`**

- Recibe `ValidationResult` como prop.
- Muestra lista de errores o mensaje de éxito.

### Tests requeridos (RTL)

- `validateFileType` retorna `true` para JPG, PNG, PDF.
- `validateFileType` retorna `false` para tipos no permitidos.
- `validateFileSize` retorna `false` si el archivo excede el límite.
- `ValidationStatus` muestra mensaje de éxito cuando `isValid` es `true`.
- `ValidationStatus` muestra cada error de la lista cuando `isValid` es `false`.

---

## FD-005 — Modal de confirmación para procesamiento con IA (Paso 2)

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como usuario, me gustaría confirmar explícitamente que deseo procesar mi factura con IA antes de que el sistema lo haga, para tener control sobre el uso de recursos y poder cancelar si cargué el archivo equivocado.

### Criterios de aceptación

- [ ] AC-1: Al avanzar al paso 2, se muestra un diálogo de confirmación.
- [ ] AC-2: El diálogo muestra una miniatura o referencia del archivo cargado.
- [ ] AC-3: El diálogo tiene un botón "Procesar con IA" (primario) y un botón "Cancelar" (secundario).
- [ ] AC-4: Al confirmar, se inicia el procesamiento con IA y se muestra un loader.
- [ ] AC-5: Al cancelar, el usuario regresa al paso 1 con su archivo intacto.
- [ ] AC-6: Mientras se procesa, el usuario no puede interactuar con los botones (estado loading).
- [ ] AC-7: Si el procesamiento falla, se muestra un mensaje de error con opción de reintentar.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` para el modal.
- `Button` con `loading` prop (MUI Lab o custom) para el estado de procesamiento.
- `CircularProgress` para el loader.
- `Alert` para errores de procesamiento.
- `Avatar` o `CardMedia` para miniatura del archivo.

**Componentes a crear:**

- `components/ConfirmAIStep.tsx` — Paso 2 del wizard.
- `components/ConfirmationDialog.tsx` — Modal reutilizable de confirmación.
- `components/ProcessingStatus.tsx` — Loader + mensajes de estado.

**Hook sugerido: `hooks/useAIProcessing.ts`**

```ts
interface UseAIProcessingReturn {
  isProcessing: boolean;
  error: string | null;
  result: AIExtractionResult | null;
  processInvoice: (file: File) => Promise<void>;
  retry: () => void;
  reset: () => void;
}
```

- Manejar estados: `idle` → `processing` → `success` | `error`.
- Implementar lógica de retry.
- Principio SRP: el hook solo maneja la comunicación con el servicio de IA.

**Servicio: `services/aiService.ts`**

```ts
export async function extractInvoiceData(file: File): Promise<AIExtractionResult>;
```

- Enviar el archivo como `FormData`.
- Retornar datos estructurados con niveles de confianza por campo.
- Manejar timeout y errores de red.

### Tests requeridos (RTL)

- El diálogo de confirmación se muestra al renderizar el paso.
- Al hacer click en "Cancelar", se invoca el callback de cancelación.
- Al hacer click en "Procesar con IA", se muestra el loader.
- Si el procesamiento falla, se muestra mensaje de error y botón de reintentar.
- Mientras procesa, los botones están deshabilitados.
- Mock del servicio de IA para simular éxito y error.

---

## FD-006 — Servicio de extracción con IA

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como sistema, necesito enviar el documento al servicio de IA y recibir los datos extraídos de forma estructurada, para alimentar el formulario de revisión.

### Criterios de aceptación

- [ ] AC-1: El servicio envía el archivo al endpoint de IA como `multipart/form-data`.
- [ ] AC-2: La respuesta se transforma al tipo `AIExtractionResult`.
- [ ] AC-3: Cada campo incluye un nivel de confianza (`confidence: 0-1`).
- [ ] AC-4: Si el servicio falla (timeout, error de red, error del servidor), se lanza un error descriptivo.
- [ ] AC-5: Existe un timeout configurable para la petición.

### Instrucciones de implementación

**Servicio: `services/aiService.ts`**

```ts
const AI_ENDPOINT = import.meta.env.VITE_AI_SERVICE_URL;
const AI_TIMEOUT = 30000;

export async function extractInvoiceData(file: File): Promise<AIExtractionResult> {
  const formData = new FormData();
  formData.append('invoice', file);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT);

  try {
    const response = await fetch(`${AI_ENDPOINT}/extract`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Error del servicio: ${response.status}`);

    return mapResponseToExtractionResult(await response.json());
  } finally {
    clearTimeout(timeoutId);
  }
}
```

- SOLID (ISP): El servicio solo expone la función necesaria para este módulo.
- Usar `AbortController` para timeout.
- Crear un mapper `mapResponseToExtractionResult` para desacoplar el contrato de la API de los tipos internos.

**Archivo de mapeo: `services/aiMapper.ts`**

- Transformar la respuesta cruda de la API al tipo `AIExtractionResult`.
- Validar que los campos esperados estén presentes.
- Asignar confidence `0` a campos faltantes.

### Tests requeridos (RTL / Vitest)

- Test unitario del mapper: transforma respuesta correcta al tipo esperado.
- Test unitario del mapper: asigna `confidence: 0` a campos faltantes.
- Test del servicio con `fetch` mockeado: retorna datos correctos en caso de éxito.
- Test del servicio con `fetch` mockeado: lanza error descriptivo en caso de fallo HTTP.
- Test del servicio: maneja timeout correctamente.

---

## FD-007 — Formulario de revisión y corrección (Paso 3)

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como usuario, me gustaría ver los datos extraídos de mi factura en un formulario editable y poder corregir cualquier dato incorrecto antes de registrarlo, para asegurarme de que la información sea precisa.

### Criterios de aceptación

- [ ] AC-1: Se muestran todos los campos extraídos: proveedor, número de factura, fecha, moneda, subtotal, impuesto, total.
- [ ] AC-2: Cada campo es editable.
- [ ] AC-3: Los campos con confianza baja (< 0.8) se resaltan con un borde o fondo de advertencia (amarillo/naranja).
- [ ] AC-4: Los campos obligatorios muestran error si están vacíos al intentar confirmar.
- [ ] AC-5: El campo "Total" se valida contra la suma de subtotal + impuesto.
- [ ] AC-6: El botón "Confirmar datos" solo se habilita si todos los campos obligatorios están completos.
- [ ] AC-7: Se muestra la vista previa del documento original junto al formulario para referencia.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `TextField` para campos de texto y números.
- `Select` / `MenuItem` para moneda.
- `InputAdornment` para símbolos de moneda.
- `FormControl`, `FormHelperText` para validación.
- `Tooltip` para mostrar el valor original extraído por IA.
- `Chip` con colores para indicar confianza (verde: alta, amarillo: media, rojo: baja).
- `Grid` para layout de formulario responsive.
- `Divider` para separar secciones.

**Componentes a crear:**

- `components/ReviewStep.tsx` — Orquestador del paso 3.
- `components/InvoiceForm.tsx` — Formulario editable.
- `components/ConfidenceChip.tsx` — Indicador de confianza por campo.
- `components/DocumentPreview.tsx` — Vista previa lado a lado.

**Hook sugerido: `hooks/useInvoiceForm.ts`**

```ts
interface UseInvoiceFormReturn {
  values: InvoiceData;
  errors: Partial<Record<keyof InvoiceData, string>>;
  confidenceLevels: Partial<Record<keyof InvoiceData, number>>;
  handleChange: (field: keyof InvoiceData, value: string | number) => void;
  validate: () => boolean;
  isValid: boolean;
}
```

- Inicializar con datos de `AIExtractionResult`, mapeando `value` a cada campo.
- Conservar `confidence` para renderizar indicadores.
- Validar campos obligatorios y consistencia del total.
- KISS: usar `useState` + funciones de validación puras.

**Validaciones (`validators/invoiceValidator.ts`):**

```ts
export function validateRequiredFields(data: InvoiceData): Record<string, string>;
export function validateTotalConsistency(subtotal: number, tax: number, total: number): string | null;
```

### Tests requeridos (RTL)

- Renderiza todos los campos del formulario con los valores extraídos.
- Los campos con confianza < 0.8 tienen estilo de advertencia.
- Al dejar un campo obligatorio vacío y hacer click en confirmar, se muestra error.
- Al editar un campo, el valor se actualiza.
- La validación de total muestra error si `total ≠ subtotal + tax`.
- El botón "Confirmar" está deshabilitado si hay errores.
- Se muestra el `ConfidenceChip` correcto según el nivel de confianza.

---

## FD-008 — Validación de duplicados y consistencia (Paso 4)

**Prioridad:** 🟠 Alta

### Historia de usuario

> Como usuario, me gustaría que el sistema verifique si ya existe una factura con el mismo número y proveedor antes de registrarla, para evitar registros duplicados en el sistema contable.

### Criterios de aceptación

- [ ] AC-1: Al confirmar los datos, el sistema busca facturas existentes con el mismo número de factura.
- [ ] AC-2: Si se encuentra coincidencia por número de factura **y** proveedor, se muestra una advertencia de duplicado.
- [ ] AC-3: La advertencia muestra los datos de la factura existente para comparación.
- [ ] AC-4: El usuario puede elegir "Continuar de todos modos" o "Cancelar".
- [ ] AC-5: Si no se detecta duplicado, el flujo avanza automáticamente al registro.
- [ ] AC-6: Se muestra un loader mientras se ejecuta la verificación.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Dialog` para modal de advertencia de duplicado.
- `Alert` con severity `warning` para el banner de duplicado.
- `Table`, `TableRow`, `TableCell` para comparar datos existentes vs. nuevos.
- `CircularProgress` para loader de verificación.
- `Button` para acciones de continuar/cancelar.

**Componentes a crear:**

- `components/ValidationStep.tsx` — Orquestador del paso 4.
- `components/DuplicateWarningDialog.tsx` — Modal de advertencia.
- `components/ComparisonTable.tsx` — Tabla comparativa.

**Servicio: `services/invoiceService.ts`**

```ts
export async function checkDuplicate(
  invoiceNumber: string,
  provider: string
): Promise<DuplicateCheckResult>;

interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingInvoice?: InvoiceData & { registeredAt: string; registeredBy: string };
}
```

**Hook sugerido: `hooks/useDuplicateCheck.ts`**

```ts
interface UseDuplicateCheckReturn {
  isChecking: boolean;
  result: DuplicateCheckResult | null;
  error: string | null;
  checkDuplicate: (invoiceNumber: string, provider: string) => Promise<void>;
}
```

### Tests requeridos (RTL)

- Muestra loader mientras verifica duplicados.
- Si no hay duplicado, invoca callback de continuar automáticamente.
- Si hay duplicado, muestra el diálogo de advertencia.
- El diálogo muestra los datos de la factura existente.
- Al hacer click en "Continuar de todos modos", avanza al registro.
- Al hacer click en "Cancelar", regresa al paso anterior.
- Maneja error del servicio y muestra mensaje.

---

## FD-009 — Registro en Google Sheets

**Prioridad:** 🔴 Crítica

### Historia de usuario

> Como usuario, me gustaría que al confirmar todos los datos, la factura se registre automáticamente en Google Sheets (archivo contable), para tener la información centralizada y lista para contabilidad.

### Criterios de aceptación

- [ ] AC-1: Al pasar la validación de duplicados, se envían los datos al servicio de registro.
- [ ] AC-2: Los datos se transforman al formato requerido por Google Sheets antes del envío.
- [ ] AC-3: Si el registro es exitoso, se almacena la referencia de la fila creada.
- [ ] AC-4: Si el registro falla, se muestra un error claro con opción de reintentar.
- [ ] AC-5: El fallo de registro **nunca** se presenta como éxito.
- [ ] AC-6: Se muestra un loader con mensaje descriptivo durante el registro.

### Instrucciones de implementación

**Servicio: `services/sheetsService.ts`**

```ts
export async function registerInvoice(data: InvoiceData): Promise<RegistrationResult>;

interface RegistrationResult {
  success: boolean;
  rowId?: string;
  sheetName?: string;
  error?: string;
}
```

- Enviar datos como JSON al backend que interactúa con Google Sheets API.
- El backend se encarga de autenticación OAuth con Google.
- El frontend solo envía los datos mapeados.

**Mapper: `services/sheetsMapper.ts`**

```ts
export function mapInvoiceToSheetRow(data: InvoiceData): Record<string, string | number>;
```

- Mapear campos de `InvoiceData` al esquema de columnas de Google Sheets.
- DRY: centralizar el mapeo en un solo lugar para facilitar cambios futuros.
- SOLID (OCP): diseñar el mapper para que agregar campos nuevos no modifique lógica existente.

**Hook sugerido: `hooks/useInvoiceRegistration.ts`**

```ts
interface UseInvoiceRegistrationReturn {
  isRegistering: boolean;
  result: RegistrationResult | null;
  error: string | null;
  register: (data: InvoiceData) => Promise<void>;
  retry: () => void;
}
```

### Tests requeridos (RTL / Vitest)

- Test del mapper: transforma `InvoiceData` al formato de fila esperado.
- Test del servicio (fetch mockeado): retorna éxito con `rowId`.
- Test del servicio (fetch mockeado): retorna error descriptivo en caso de fallo.
- Test del hook: `isRegistering` es `true` durante la petición.
- Test del hook: `retry` reenvía la petición con los mismos datos.

---

## FD-010 — Pantalla de resultado final (Paso 5)

**Prioridad:** 🟠 Alta

### Historia de usuario

> Como usuario, me gustaría ver un resumen claro del resultado del proceso (éxito, error o cancelación) con los datos registrados, para tener certeza de que mi factura fue procesada correctamente.

### Criterios de aceptación

- [ ] AC-1: Si el registro fue exitoso, se muestra un mensaje de éxito con ícono verde y resumen de los datos registrados.
- [ ] AC-2: Si el registro falló, se muestra un mensaje de error con opción de reintentar.
- [ ] AC-3: Si el proceso fue cancelado, se muestra un mensaje informativo.
- [ ] AC-4: Existe un botón "Registrar otra factura" que reinicia el wizard desde el paso 1.
- [ ] AC-5: El resumen incluye: proveedor, número de factura, total y fecha.
- [ ] AC-6: Se muestra la fecha y hora del registro.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Alert` con severity `success` | `error` | `info` para el estado final.
- `Card`, `CardContent` para el resumen.
- `List`, `ListItem`, `ListItemText` para detalles de la factura.
- `CheckCircleOutlineIcon`, `ErrorOutlineIcon`, `InfoOutlinedIcon` para íconos de estado.
- `Button` para acciones finales.
- `Divider` para separar secciones.

**Componentes a crear:**

- `components/ResultStep.tsx` — Orquestador del paso 5.
- `components/ResultSummaryCard.tsx` — Tarjeta de resumen.
- `components/ResultActions.tsx` — Botones de acción final.

**Lógica:**

- Recibir el estado del resultado desde el wizard state.
- El botón "Registrar otra factura" debe resetear todo el `wizardState`.
- KISS: componente puramente presentacional, sin lógica de negocio.

### Tests requeridos (RTL)

- Muestra mensaje de éxito con ícono verde cuando `result` es `success`.
- Muestra mensaje de error con botón de reintentar cuando `result` es `error`.
- Muestra resumen con proveedor, número, total y fecha.
- Al hacer click en "Registrar otra factura", se invoca el callback de reset.
- No muestra botón de reintentar en estado de éxito.

---

## FD-011 — Registro de auditoría

**Prioridad:** 🟠 Alta

### Historia de usuario

> Como auditor, me gustaría que cada proceso de registro de factura genere una traza de auditoría con el archivo original, los datos extraídos, los datos confirmados, el usuario y la fecha, para poder revisar y validar los registros en el futuro.

### Criterios de aceptación

- [ ] AC-1: Al completar un registro (exitoso o fallido), se guarda un registro de auditoría.
- [ ] AC-2: El registro incluye: archivo original, datos extraídos por IA, datos confirmados por usuario, ID de usuario, timestamp, resultado del proceso.
- [ ] AC-3: El archivo original se sube a un almacenamiento persistente (definido por backend).
- [ ] AC-4: Si la auditoría falla, se registra el error pero no bloquea el flujo principal.
- [ ] AC-5: El registro de auditoría se ejecuta de forma independiente al registro contable.

### Instrucciones de implementación

**Servicio: `services/auditService.ts`**

```ts
export async function saveAuditRecord(record: AuditRecord): Promise<void>;
export async function uploadInvoiceFile(file: File): Promise<string>; // retorna URL del archivo
```

- El servicio de auditoría es fire-and-forget desde el punto de vista del usuario.
- Usar `Promise.allSettled` para ejecutar auditoría y registro en paralelo sin que uno bloquee al otro.
- SOLID (SRP): el servicio de auditoría está completamente separado del servicio de registro.

**Hook sugerido: `hooks/useAudit.ts`**

```ts
interface UseAuditReturn {
  saveAudit: (record: AuditRecord) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}
```

**Integración en el wizard:**

- Invocar `saveAudit` en el paso final, junto con `registerInvoice`.
- Construir el `AuditRecord` desde el estado acumulado del wizard.

### Tests requeridos (RTL / Vitest)

- Test del servicio (fetch mockeado): envía el registro de auditoría correctamente.
- Test del servicio: sube el archivo original y retorna URL.
- Test: si la auditoría falla, no lanza excepción (fire-and-forget).
- Test: el `AuditRecord` contiene todos los campos requeridos.

---

## FD-012 — Manejo global de errores del módulo

**Prioridad:** 🟡 Media

### Historia de usuario

> Como usuario, me gustaría que si algo sale mal en cualquier parte del proceso, se me muestre un mensaje claro y comprensible con opciones para corregir, reintentar o cancelar, para no quedarme bloqueado sin saber qué hacer.

### Criterios de aceptación

- [ ] AC-1: Cada error muestra un mensaje en lenguaje comprensible (no códigos técnicos).
- [ ] AC-2: Los errores de red muestran: "No se pudo conectar con el servidor. Verifique su conexión."
- [ ] AC-3: Los errores de IA muestran: "No fue posible extraer los datos. Intente con una imagen más clara."
- [ ] AC-4: Los errores de Google Sheets muestran: "No se pudo registrar la factura. Intente de nuevo."
- [ ] AC-5: Siempre hay una acción disponible: reintentar, volver atrás o cancelar.
- [ ] AC-6: No se pierde el contexto del usuario (datos ya ingresados) ante un error recuperable.

### Instrucciones de implementación

**Componentes MUI sugeridos:**

- `Snackbar` con `Alert` para errores no bloqueantes.
- `Dialog` para errores bloqueantes que requieren acción.
- `Alert` inline para errores de formulario.

**Utilidad: `utils/errorMessages.ts`**

```ts
export function getErrorMessage(error: unknown): string;
export function getErrorAction(errorType: ErrorType): 'retry' | 'goBack' | 'cancel';
```

- Mapear tipos de error a mensajes amigables.
- DRY: centralizar todos los mensajes de error en un solo archivo.
- KISS: no sobre-diseñar el manejo de errores; mensajes claros y acciones simples.

**Componente: `components/ErrorBoundaryFallback.tsx`**

- Fallback para errores no manejados dentro del módulo.
- Mostrar mensaje genérico + botón de reiniciar el wizard.

### Tests requeridos (RTL / Vitest)

- `getErrorMessage` retorna mensaje amigable para errores de red.
- `getErrorMessage` retorna mensaje amigable para errores de IA.
- `getErrorMessage` retorna mensaje genérico para errores desconocidos.
- `ErrorBoundaryFallback` renderiza mensaje y botón de reinicio.

---

## FD-013 — Integración E2E del wizard completo

**Prioridad:** 🟠 Alta

### Historia de usuario

> Como usuario, me gustaría completar el flujo completo de registro de factura de principio a fin sin interrupciones, asegurándome de que todos los pasos se conectan correctamente.

### Criterios de aceptación

- [ ] AC-1: El usuario puede navegar los 5 pasos del wizard secuencialmente.
- [ ] AC-2: Los datos se pasan correctamente entre pasos (archivo → IA → formulario → validación → resultado).
- [ ] AC-3: El estado del wizard se preserva al navegar entre pasos.
- [ ] AC-4: El botón "Atrás" regresa al paso anterior con los datos intactos.
- [ ] AC-5: "Registrar otra factura" reinicia todo el estado del wizard.
- [ ] AC-6: La ruta `/facturacion` renderiza el wizard completo.

### Instrucciones de implementación

**Integración en `pages/Facturacion.tsx`:**

```tsx
import FacturaDigitalWizard from '../features/factura-digital/FacturaDigitalWizard';

export default function Facturacion() {
  return <FacturaDigitalWizard />;
}
```

**Componente orquestador: `FacturaDigitalWizard.tsx`**

```tsx
export default function FacturaDigitalWizard() {
  const wizard = useWizardState();

  const steps = [
    { label: 'Cargar Factura', component: <UploadStep /> },
    { label: 'Confirmar Procesamiento', component: <ConfirmAIStep /> },
    { label: 'Revisar Datos', component: <ReviewStep /> },
    { label: 'Validación', component: <ValidationStep /> },
    { label: 'Resultado', component: <ResultStep /> },
  ];

  return (
    <Container maxWidth="md">
      <Stepper activeStep={wizard.activeStep}>
        {steps.map(({ label }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        {steps[wizard.activeStep].component}
      </Box>
    </Container>
  );
}
```

- El wizard pasa datos entre pasos mediante el estado compartido de `useWizardState`.
- Cada paso recibe callbacks para `onNext`, `onBack` y acceso a `wizardData`.
- Usar `React.Context` o prop drilling (KISS) para compartir el estado.

### Tests requeridos (RTL)

- Test de integración: renderiza el wizard en paso 1.
- Test de integración: simular flujo completo con servicios mockeados (upload → confirm → review → validate → result).
- El estado se preserva al volver al paso anterior.
- "Registrar otra factura" reinicia al paso 1 con estado limpio.

---

## Resumen de tickets

| ID       | Título                                    | Prioridad | Dependencias |
|----------|-------------------------------------------|-----------|--------------|
| FD-001   | Setup inicial del módulo y dependencias   | 🔴 Crítica | —            |
| FD-002   | Wizard / Stepper principal                | 🔴 Crítica | FD-001       |
| FD-003   | Carga de factura (Paso 1)                 | 🔴 Crítica | FD-001       |
| FD-004   | Validación inicial del archivo            | 🟠 Alta    | FD-003       |
| FD-005   | Modal de confirmación para IA (Paso 2)    | 🔴 Crítica | FD-002       |
| FD-006   | Servicio de extracción con IA             | 🔴 Crítica | FD-001       |
| FD-007   | Formulario de revisión y corrección       | 🔴 Crítica | FD-006       |
| FD-008   | Validación de duplicados y consistencia   | 🟠 Alta    | FD-007       |
| FD-009   | Registro en Google Sheets                 | 🔴 Crítica | FD-008       |
| FD-010   | Pantalla de resultado final (Paso 5)      | 🟠 Alta    | FD-009       |
| FD-011   | Registro de auditoría                     | 🟠 Alta    | FD-009       |
| FD-012   | Manejo global de errores                  | 🟡 Media   | FD-002       |
| FD-013   | Integración E2E del wizard completo       | 🟠 Alta    | Todos        |

---

## Orden sugerido de implementación

```
Fase 1 (Base):       FD-001 → FD-002 + FD-003 (paralelo) → FD-004
Fase 2 (IA):         FD-006 → FD-005
Fase 3 (Revisión):   FD-007 → FD-008
Fase 4 (Registro):   FD-009 → FD-010 + FD-011 (paralelo)
Fase 5 (Polish):     FD-012 → FD-013
```
