# Factura a Google Sheets

## Ejercicio de Diseño de Producto y Software


Este ejercicio consiste en convertir una idea vaga en un **PRD
(Product Requirements Document)** claro y estructurado, de manera que
posteriormente la implementación sea casi trivial.

El enfoque del ejercicio está en:

-   entender el problema
-   estructurar requerimientos
-   diseñar flujos de usuario
-   definir modelos de datos
-   identificar riesgos y errores
-   dividir el sistema en módulos manejables

La IA puede ayudar durante el proceso, pero **todas las decisiones
deben quedar explícitamente documentadas en el PRD**.

------------------------------------------------------------------------

# Contexto del Ejercicio

Desarrollar un pequeño módulo interno
para manejar facturas físicas de DNAture.

Actualmente, cuando una factura llega a la empresa, alguien debe:

1.  recibir la factura física
2.  revisar los datos importantes
3.  registrar manualmente la información en un archivo contable (por
    ejemplo en Google Sheets)

Esto consume tiempo y es propenso a errores.

La empresa quiere un sistema donde:

1.  El usuario pueda **tomar una foto de la factura o subir una imagen**
2.  El sistema envíe la imagen a un servicio de **IA que extraiga la
    información importante**
3.  El sistema muestre la información detectada para revisión
4.  El usuario confirme o corrija los datos
5.  El sistema registre automáticamente la información en **Google
    Sheets**

Para esta parte el objetivo es **diseñar el producto y el sistema**, no programarlo.

------------------------------------------------------------------------

# Objetivo del Ejercicio

Al finalizar, debes haber producido:

1.  Un **PRD principal**
2.  Varios **sub-PRDs para los módulos del sistema**
3.  Un **flujo completo del sistema**
4.  Un **modelo de datos inicial**
5.  Una lista clara de **casos borde y errores**

Si el diseño está bien hecho, **un desarrollador podría implementar el
sistema siguiendo tus documentos sin tener que adivinar nada
importante**.

------------------------------------------------------------------------

# Reglas del Ejercicio

Durante este ejercicio:

1.  **Primero escribe tus ideas.**
2.  Luego puedes usar IA para:
    -   mejorar claridad
    -   detectar casos borde
    -   mejorar redacción
3.  Nunca aceptes respuestas de la IA sin evaluarlas críticamente.

Recuerda:

> La IA puede proponer soluciones, pero **la responsabilidad del diseño
> es tuya**.

------------------------------------------------------------------------

# Parte 1 --- Definición del Problema

Primero debes describir claramente el problema.

Tu documento debe responder:

### ¿Quién usa el sistema?

Ejemplos posibles:

-   recepción
-   contabilidad
-   administración

### ¿Qué problema resuelve?

Ejemplos:

-   registro manual lento
-   errores humanos al copiar datos
-   dificultad para auditar facturas

### ¿Cómo sabremos si el sistema fue exitoso?

Define **3 métricas medibles**, por ejemplo:

-   tiempo promedio para registrar una factura
-   porcentaje de facturas que requieren corrección manual
-   número de facturas procesadas por día

Entrega esperada:

Problem Statement\
User Roles\
Success Metrics

------------------------------------------------------------------------

# Parte 2 --- Historias de Usuario

Define entre **6 y 10 historias de usuario**.

Ejemplos:

-   Como recepcionista quiero subir una foto de una factura para
    registrarla.
-   Como contabilidad quiero revisar los datos extraídos antes de
    guardarlos.
-   Como administrador quiero configurar la hoja de Google Sheets donde
    se guardan los datos.

Cada historia debe incluir **criterios de aceptación claros**.

Ejemplo:

Historia:\
Como usuario quiero subir una imagen de factura para procesarla.

Criterios de aceptación: - el sistema acepta JPG, PNG o PDF - el archivo
no puede superar cierto tamaño - el sistema muestra una vista previa de
la imagen - el sistema permite iniciar el proceso de escaneo

------------------------------------------------------------------------

# Parte 3 --- Flujo Completo del Sistema

Describe el **flujo principal de extremo a extremo**.

Ejemplo del flujo esperado:

1.  usuario sube imagen
2.  sistema valida formato
3.  sistema envía imagen al servicio de IA
4.  IA devuelve datos estructurados
5.  sistema muestra datos detectados
6.  usuario revisa y corrige
7.  sistema guarda datos
8.  sistema registra una fila en Google Sheets

También debes describir **flujos alternos**, por ejemplo:

-   la imagen es ilegible
-   la IA no logra detectar información suficiente
-   la factura ya existe en el sistema
-   Google Sheets no responde
-   el usuario abandona el proceso

Entrega esperada:

Happy Path\
Alternative Flows\
System States

------------------------------------------------------------------------

# Parte 4 --- Modelo de Datos

Define qué información debe almacenar el sistema.

Un posible objeto sería:

InvoiceRecord

Campos posibles:

-   vendor_name
-   vendor_tax_id
-   invoice_number
-   invoice_date
-   currency
-   subtotal
-   tax
-   total
-   image_url
-   extracted_data_raw
-   confidence_scores
-   status
-   created_by
-   timestamps

También debes definir:

-   qué campos son obligatorios
-   qué campos puede corregir el usuario
-   qué datos provienen de la IA

------------------------------------------------------------------------

# Parte 5 --- Integración con Google Sheets

Define cómo se almacenará la información en Google Sheets.

Debes especificar:

-   qué columnas tendrá la hoja
-   formato de fechas
-   formato de moneda
-   cómo se evita registrar facturas duplicadas
-   qué ocurre si la API de Google Sheets falla

Entrega esperada:

Sheet Schema\
Column Mapping\
Duplicate Detection Strategy\
Error Handling

------------------------------------------------------------------------

# Parte 6 --- Uso de Inteligencia Artificial

Debes definir claramente:

-   qué información se envía a la IA
-   qué estructura debe tener la respuesta
-   qué hacer si la confianza es baja
-   cuándo el usuario debe intervenir

Por ejemplo:

{ vendor_name: "...", invoice_number: "...", total: "...", confidence: {
vendor_name: 0.94, total: 0.88 } }

------------------------------------------------------------------------

# Parte 7 --- Casos Borde y Manejo de Errores

Todo sistema real tiene errores.

Debes listar al menos **10 posibles problemas**, por ejemplo:

-   foto borrosa
-   factura parcialmente visible
-   moneda no reconocida
-   factura duplicada
-   error de red
-   error del servicio de IA
-   error al escribir en Google Sheets

Para cada uno debes definir:

-   qué ve el usuario
-   qué hace el sistema
-   si se permite reintentar

------------------------------------------------------------------------

# Parte 8 --- Requerimientos No Funcionales

Define requisitos importantes para el sistema.

### Seguridad

Las facturas contienen datos sensibles.

### Auditoría

Debe guardarse:

-   la imagen original
-   los datos extraídos por IA
-   los datos confirmados por el usuario

### Rendimiento

El proceso de extracción debería tardar menos de cierto tiempo.

### Retención de datos

Definir cuánto tiempo se almacenan las imágenes.

------------------------------------------------------------------------

# Parte 9 --- División en Sub-PRDs

El sistema debe dividirse en módulos.

Define sub-PRDs para:

### Upload Module

Subida y validación de archivos.

### AI Extraction Module

Comunicación con el servicio de IA.

### Review Interface

Interfaz donde el usuario revisa los datos.

### Google Sheets Sync

Registro final en la hoja contable.

### Audit & Logs

Registro de acciones y trazabilidad.

Cada sub-PRD debe tener:

-   propósito
-   requerimientos
-   flujos
-   errores posibles

------------------------------------------------------------------------

# Entregables del Ejercicio

Debes entregar:

1.  PRD principal
2.  Sub-PRDs de los módulos
3.  Diagrama del flujo del sistema
4.  Modelo de datos
5.  Lista de casos borde
6.  Definición de métricas de éxito

------------------------------------------------------------------------

# Criterio de Evaluación

Tu diseño será considerado exitoso si:

-   el sistema está completamente definido
-   no existen ambigüedades importantes
-   los flujos están claros
-   los datos están bien estructurados
-   los errores están contemplados
-   un desarrollador podría implementar el sistema sin tener que hacer
    suposiciones críticas


