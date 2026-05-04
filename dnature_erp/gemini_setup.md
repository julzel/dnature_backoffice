# Configuración de Google Gemini para extracción de facturas

## Resumen

Este módulo utiliza **Gemini 2.0 Flash** para extraer datos estructurados de imágenes y PDFs de facturas. La integración corre en el frontend y requiere únicamente una API key de Google AI Studio.

---

## 1. Requisito previo: cuenta de Google

Google AI Studio no tiene registro propio: usa tu cuenta de Google existente (Gmail, Google Workspace, etc.).

Si aún no tienes una, créala en [https://accounts.google.com/signup](https://accounts.google.com/signup) antes de continuar.

---

## 2. Obtener una API key gratuita

1. Ve a [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Inicia sesión con tu cuenta de Google.
3. Haz clic en **"Create API key"**.
4. Selecciona un proyecto de Google Cloud existente o crea uno nuevo.
5. Copia la API key generada.

> **Tier gratuito:** 15 requests por minuto y 1.500 requests por día, sin necesidad de tarjeta de crédito. Suficiente para pruebas de prototipo.

---

## 3. Configurar la variable de entorno

En la raíz del proyecto (`dnature_erp/`), crea un archivo `.env.local`:

```bash
VITE_GEMINI_API_KEY=AIza...tu_api_key_aqui
```

> `.env.local` ya está cubierto por `.gitignore` en proyectos Vite. **Nunca subas la API key al repositorio.**

Para verificar que Vite la reconoce, reinicia el servidor de desarrollo:

```bash
npm run dev
```

---

## 4. Dependencia instalada

El SDK oficial ya está instalado en este proyecto:

```bash
npm install @google/generative-ai
```

No es necesario reinstalarlo. Aparece en `package.json` bajo `dependencies`.

---

## 5. Archivos del servicio

| Archivo | Propósito |
|---|---|
| `src/features/factura-digital/services/aiExtractionService.ts` | Función principal `extractInvoiceData(file)` |
| `src/features/factura-digital/services/invoicePrompt.ts` | Prompt de extracción enviado a Gemini |

### Uso básico

```typescript
import { extractInvoiceData, ExtractionError, MissingApiKeyError } from '../services/aiExtractionService'

try {
  const result = await extractInvoiceData(file) // file: File (JPG, PNG o PDF)
  console.log(result.provider.value)     // "Distribuidora XYZ"
  console.log(result.total.value)        // 13950.61
  console.log(result.total.confidence)   // 0.97
} catch (error) {
  if (error instanceof MissingApiKeyError) {
    // API key no configurada
  } else if (error instanceof ExtractionError) {
    // Error de extracción o comunicación con Gemini
  }
}
```

El tipo de retorno es `AIExtractionResult` (definido en `src/features/factura-digital/types/invoice.ts`):

```typescript
interface AIExtractionResult {
  provider:       ExtractedField<string>
  invoiceNumber:  ExtractedField<string>
  date:           ExtractedField<string>   // formato YYYY-MM-DD
  currency:       ExtractedField<string>   // código ISO 4217: CRC, USD, EUR
  subtotal:       ExtractedField<number>
  tax:            ExtractedField<number>
  total:          ExtractedField<number>
}

interface ExtractedField<T> {
  value:      T
  confidence: number  // 0–1: probabilidad de que el valor sea correcto
}
```

---

## 6. Formatos soportados

| Formato | MIME type | Soportado |
|---|---|---|
| JPEG / JPG | `image/jpeg` | ✅ |
| PNG | `image/png` | ✅ |
| PDF | `application/pdf` | ✅ |

Tamaño máximo: **5 MB** (límite definido en `fileConstants.ts`, consistente con el límite inline de la API de Gemini).

---

## 7. Consideraciones de seguridad

### Para el prototipo (entorno local / staging privado)
Una variable `VITE_GEMINI_API_KEY` en `.env.local` es suficiente. Vite la embebe en el bundle solo en tiempo de compilación.

### Para producción (usuarios externos)
La API key **no debe quedar expuesta en el bundle del frontend**. La solución recomendada es un proxy backend ligero:

- **Supabase Edge Function** (si ya usas Supabase)
- **Vercel Serverless Function** (`/api/extract-invoice.ts`)
- **Google Cloud Function**

El frontend envía el archivo al endpoint propio, y el backend llama a Gemini con la API key almacenada en variables de entorno del servidor.

---

## 8. Ajustar el prompt

El prompt de extracción está en `services/invoicePrompt.ts`. Puedes modificarlo para:

- Añadir campos adicionales (e.g., dirección del proveedor, líneas de detalle).
- Cambiar el idioma de las instrucciones.
- Ajustar las reglas de inferencia de moneda o fecha.

Después de cambiar el prompt, prueba con facturas reales para verificar que la estructura del JSON devuelto siga siendo compatible con `AIExtractionResult`.

---

## 9. Verificación rápida

Para confirmar que la configuración funciona antes de integrarlo al wizard, puedes probar en la consola del navegador (con el servidor de desarrollo corriendo):

```javascript
// En las DevTools del navegador
import('/src/features/factura-digital/services/aiExtractionService.js')
  .then(m => console.log('Servicio cargado:', m))
```

Si no hay errores de importación, la API key está siendo leída correctamente.
