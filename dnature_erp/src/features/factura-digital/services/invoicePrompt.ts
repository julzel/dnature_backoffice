/**
 * Prompt de extracción de datos para facturas.
 * Instrucciones enviadas a Gemini junto con la imagen o PDF de la factura.
 */
export const INVOICE_EXTRACTION_PROMPT = `
Analiza el documento de factura adjunto y extrae los datos estructurados.

Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura, sin bloques de código markdown, sin texto adicional ni explicaciones:

{
  "provider": { "value": "<nombre del proveedor o emisor>", "confidence": 0.0 },
  "invoiceNumber": { "value": "<número o código de la factura>", "confidence": 0.0 },
  "date": { "value": "<fecha en formato YYYY-MM-DD>", "confidence": 0.0 },
  "currency": { "value": "<código ISO 4217: CRC, USD, EUR, etc.>", "confidence": 0.0 },
  "subtotal": { "value": 0.00, "confidence": 0.0 },
  "tax": { "value": 0.00, "confidence": 0.0 },
  "total": { "value": 0.00, "confidence": 0.0 }
}

Reglas de extracción:
- confidence: número decimal entre 0 y 1 que indica el nivel de certeza para ese campo.
  Usa valores bajos (menores a 0.7) si el campo no es claramente legible o es ambiguo.
- date: siempre en formato ISO 8601 (YYYY-MM-DD). Si el año no está visible, infiere el más probable.
- currency: usa el código ISO 4217 de tres letras. Si no está explícito en la factura, infiere por contexto (símbolo ₡ → CRC, $ → USD, € → EUR).
- subtotal, tax, total: números decimales sin símbolo de moneda ni separadores de miles.
  Si un campo no aparece en la factura (por ejemplo, no se muestra el impuesto por separado), usa 0 con confidence 0.
- Si no puedes extraer un campo de texto, devuelve "" con confidence 0.
- No inventes datos. Si la imagen es ilegible, devuelve todos los campos con sus valores vacíos y confidence 0.
`.trim()
