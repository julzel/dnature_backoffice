# PRD - Módulo de Registro de Factura Digital con IA

## 1. Resumen ejecutivo

Este documento define los requerimientos del módulo de **registro de facturas digitales**. El objetivo es permitir que un usuario cargue una imagen o PDF de una factura, usar IA para extraer sus datos, permitir revisión y corrección manual, validar consistencia y posibles duplicados, y finalmente registrar la información en el archivo contable, específicamente en **Google Sheets**, manteniendo además una **traza de auditoría** del proceso.

El flujo funcional base identificado es:

1. Cargar y validar imagen o documento.
2. Confirmar procesamiento con IA.
3. Revisar y corregir datos extraídos.
4. Ejecutar validación final de consistencia y duplicados.
5. Registrar la factura y mostrar confirmación.

---

## 2. Problema que resuelve

El proceso manual de digitación de facturas es lento, propenso a errores y difícil de auditar. Este módulo busca reducir fricción operativa y mejorar la calidad del registro contable mediante:

- automatización de extracción de datos con IA,
- validaciones tempranas para evitar errores por imágenes inválidas,
- revisión humana antes del guardado,
- verificación de duplicados,
- registro estructurado en Google Sheets,
- y almacenamiento de evidencia para auditoría.

---

## 3. Objetivos del producto

### Objetivo principal
Permitir el registro asistido de facturas digitales en un archivo contable con apoyo de IA y validaciones de negocio.

### Objetivos secundarios
- Reducir el tiempo de captura de datos.
- Disminuir errores de transcripción.
- Evitar registros duplicados.
- Mejorar trazabilidad y auditoría del proceso.
- Estandarizar la experiencia de captura y validación.

---

## 4. Alcance

### Incluido en esta fase
- Carga de imagen o PDF de la factura.
- Validación inicial del archivo.
- Confirmación explícita antes de consumir IA.
- Extracción de datos por IA.
- Revisión y edición manual de campos.
- Validación de campos obligatorios.
- Detección de posible duplicado.
- Registro en Google Sheets.
- Confirmación final del registro.
- Guardado de auditoría con imagen, datos, usuario y fecha.

### Fuera de alcance por ahora
- Integración con ERP contable completo.
- Conciliación contable automática avanzada.
- Aprobaciones multinivel.
- Clasificación contable compleja por centro de costo.
- Extracción desde correos o bandejas automáticas.
- Soporte multiidioma.

---

## 5. Usuarios objetivo

### Usuario operativo
Persona encargada de cargar y registrar facturas en el sistema.

### Usuario administrador o auditor
Persona que necesita revisar trazabilidad, errores, duplicados y evidencia del registro.

---

## 6. Flujo E2E del producto

### Entrada
Imagen o PDF de la factura.

### Flujo
1. El usuario carga la factura.
2. El sistema valida formato, tamaño y calidad.
3. El usuario confirma que desea procesarla con IA.
4. El sistema extrae datos mediante IA.
5. El usuario revisa, corrige y confirma la información.
6. El sistema valida consistencia y posible duplicado.
7. El usuario decide continuar o cancelar si existe advertencia.
8. El sistema registra los datos en Google Sheets.
9. El sistema guarda auditoría y muestra resultado final.

### Salida
Registro exitoso en el archivo contable y evidencia del proceso.

---

## 7. Requerimientos funcionales

## RF-01. Carga de factura
El sistema debe permitir al usuario cargar una factura mediante archivo o fotografía.

### Detalles
- Mostrar opción para subir imagen.
- Mostrar opción para tomar foto.
- Permitir selección de archivo desde el dispositivo.
- Mostrar vista previa del archivo cargado.

## RF-02. Validación inicial del archivo
El sistema debe validar que el archivo sea apto para procesamiento antes de continuar.

### Validaciones mínimas
- Formato permitido: JPG, PNG, PDF.
- Tamaño de archivo dentro del límite definido por negocio o infraestructura.
- Calidad visual suficiente para lectura: no borrosa, incompleta o ilegible.
- Resultado de validación visible para el usuario.

### Resultado esperado
Si la validación falla, el sistema no debe permitir el avance al procesamiento con IA.

## RF-03. Confirmación previa al uso de IA
El sistema debe solicitar confirmación explícita del usuario antes de enviar el documento al servicio de IA.

### Justificación
Evitar consumo innecesario de recursos de IA y dar control al usuario.

### Comportamiento esperado
- Mostrar modal o pantalla de confirmación.
- Permitir confirmar o cancelar.
- Solo al confirmar, enviar imagen al servicio de IA.

## RF-04. Procesamiento con IA
El sistema debe enviar el documento validado al servicio de IA para extraer datos estructurados de la factura.

### Datos esperados de extracción
Como mínimo, el flujo y maqueta sugieren los siguientes campos:
- proveedor,
- número de factura,
- fecha,
- moneda,
- subtotal,
- impuesto,
- total.

### Consideraciones
- Manejar error de extracción si la IA falla.
- Informar al usuario que el documento está siendo procesado.
- Esperar respuesta estructurada para alimentar el formulario de revisión.

## RF-05. Revisión y corrección manual
El sistema debe presentar los datos extraídos en un formulario editable antes del registro final.

### Reglas
- Todos los campos relevantes deben ser visibles.
- Los campos con baja confianza deben resaltarse.
- El usuario debe poder editar cualquier dato manualmente.
- Los campos obligatorios deben validarse antes de confirmar.

### Resultado esperado
El usuario confirma una versión final y corregida de la factura.

## RF-06. Validación final de negocio
Antes del registro definitivo, el sistema debe ejecutar validaciones de consistencia y duplicados.

### Validaciones mínimas
- Comparar número de factura para detectar posible duplicado.
- Comparar proveedor para reforzar la detección de duplicado.
- Validar consistencia general de los datos.

### Comportamiento esperado
- Si se detecta duplicado potencial, mostrar advertencia.
- Permitir continuar o cancelar según reglas de negocio.

## RF-07. Registro contable
El sistema debe transformar la información validada al formato requerido por el archivo contable y registrarla en Google Sheets.

### Reglas
- Mapear campos del formulario al esquema del archivo contable.
- Registrar los datos en la hoja correspondiente.
- Confirmar si el registro fue exitoso.
- Manejar errores de escritura o integración.

## RF-08. Auditoría
El sistema debe guardar evidencia suficiente para trazabilidad y revisión posterior.

### Datos de auditoría mínimos
- imagen o archivo original,
- datos extraídos por IA,
- datos finales confirmados por el usuario,
- usuario responsable,
- fecha y hora,
- resultado del proceso.

## RF-09. Confirmación final
El sistema debe mostrar al usuario un estado final claro del proceso.

### Posibles estados
- Registro exitoso.
- Error en procesamiento.
- Error en registro.
- Registro cancelado.

---

## 8. Requerimientos no funcionales

## RNF-01. Usabilidad
La experiencia debe ser simple, guiada y lineal, con estados visibles en cada etapa.

## RNF-02. Claridad de validaciones
Los mensajes de error, advertencia y éxito deben ser comprensibles y accionables.

## RNF-03. Trazabilidad
Cada registro debe quedar asociado a evidencia suficiente para revisión posterior.

## RNF-04. Rendimiento
El usuario debe recibir retroalimentación inmediata cuando el sistema está validando, procesando o registrando.

## RNF-05. Confiabilidad
El sistema debe manejar fallos del servicio de IA o de Google Sheets sin pérdida silenciosa de información.

## RNF-06. Seguridad básica
El acceso a registrar facturas y consultar auditoría debe restringirse según el rol del usuario.

---

## 9. Campos de datos sugeridos

A partir del flujo y la maqueta disponible, los campos base del formulario deberían incluir:

- Proveedor
- Número de factura
- Fecha
- Moneda
- Subtotal
- Impuesto
- Total

Campos opcionales recomendados para expansión futura:
- tipo de gasto,
- categoría contable,
- observaciones,
- referencia interna,
- sucursal o centro de costo,
- estado del registro.

---

## 10. Componentes principales de UI

## 10.1 Carga de imagen
- UploadButton
- CameraButton
- DragAndDropArea
- ImagePreview
- ValidationStatusMessage
- ContinueButton

## 10.2 Confirmación y procesamiento
- ConfirmationModal
- ConfirmButton
- CancelButton
- ProcessingLoader
- ProcessingStatusMessage

## 10.3 Revisión de datos
- InvoiceForm
- EditableField
- ConfidenceIndicator
- ValidationMessage
- EditButton
- ConfirmDataButton

## 10.4 Validación final
- DuplicateWarningModal
- ValidationBanner
- ContinueButton
- CancelButton

## 10.5 Registro y confirmación
- LoadingState
- SuccessMessage
- SummaryCard
- RetryButton
- NewInvoiceButton
- ActionButtons

---

## 11. Reglas de negocio iniciales

1. Ninguna factura debe procesarse con IA si el archivo no supera la validación inicial.
2. El usuario debe confirmar antes de consumir IA.
3. Ninguna factura debe registrarse sin revisión humana final.
4. Los campos obligatorios deben estar completos antes del registro.
5. Una coincidencia por número de factura y proveedor debe disparar alerta de posible duplicado.
6. Todo registro debe dejar evidencia auditable.
7. El fallo de integración con Google Sheets debe informarse claramente y no debe presentarse como éxito.

---

## 12. Manejo de errores

### Errores contemplados
- Archivo inválido.
- Imagen ilegible o incompleta.
- Fallo del servicio de IA.
- Datos incompletos o inconsistentes.
- Duplicado potencial.
- Fallo al registrar en Google Sheets.

### Respuesta esperada del sistema
- Mensaje claro del problema.
- Opción de corregir, reintentar o cancelar.
- No perder contexto del usuario cuando sea posible.

---

## 13. Dependencias e integraciones

## Integraciones principales
- Servicio de IA para OCR/extracción de datos.
- Google Sheets para registro contable.
- Sistema de autenticación o identificación de usuario.
- Almacenamiento de archivos o evidencia para auditoría.

## Dependencias técnicas probables
- Validación de archivos en frontend y backend.
- API de procesamiento asincrónico.
- Servicio de logging y auditoría.

---

## 14. Criterios de aceptación de alto nivel

### CA-01
Dado un archivo válido, el usuario puede cargarlo y ver una vista previa junto con el resultado de validación.

### CA-02
Si el archivo no cumple formato, tamaño o calidad mínima, el sistema bloquea el avance al siguiente paso.

### CA-03
Antes de procesar con IA, el sistema solicita confirmación explícita al usuario.

### CA-04
Tras el procesamiento, el sistema muestra los campos extraídos en un formulario editable.

### CA-05
Los campos con baja confianza se resaltan para revisión manual.

### CA-06
Si faltan campos obligatorios, el sistema no permite confirmar los datos finales.

### CA-07
Si se detecta un posible duplicado, el sistema muestra una advertencia y solicita decisión del usuario.

### CA-08
Al confirmar, el sistema registra los datos en Google Sheets y muestra un mensaje de éxito.

### CA-09
Si el registro falla, el sistema informa el error y ofrece reintento.

### CA-10
Cada proceso genera un registro de auditoría con archivo, datos, usuario y fecha.

---

## 15. Métricas sugeridas

### Métricas operativas
- Tiempo promedio desde carga hasta registro.
- Porcentaje de facturas procesadas sin edición manual.
- Porcentaje de facturas que requieren corrección manual.
- Tasa de fallos del servicio de IA.
- Tasa de fallos de registro en Google Sheets.
- Número de duplicados detectados.

### Métricas de calidad
- Precisión de extracción por campo.
- Tasa de error contable posterior al registro.
- Porcentaje de registros con auditoría completa.

---

## 16. Riesgos

- Imágenes de mala calidad reducen precisión de la IA.
- Dependencia de Google Sheets puede limitar escalabilidad y manejo transaccional.
- Falsos positivos o falsos negativos en detección de duplicados.
- Fricción excesiva si el flujo de revisión manual no está bien diseñado.
- Costos de IA si no se controla bien el uso.

---

## 17. Recomendaciones de implementación

1. Diseñar el flujo como un wizard de 5 pasos claramente visibles.
2. Implementar validaciones tempranas para reducir errores cuesta abajo.
3. Separar claramente datos extraídos por IA de datos confirmados por usuario.
4. Guardar estados intermedios para no perder progreso ante errores.
5. Diseñar la auditoría desde la primera versión, no como agregado posterior.
6. Preparar una capa de integración desacoplada para que Google Sheets pueda sustituirse por un sistema contable futuro.

---

## 18. Roadmap sugerido

### Fase 1 - MVP
- Carga de archivo.
- Validación inicial.
- Procesamiento con IA.
- Revisión manual.
- Detección básica de duplicados.
- Registro en Google Sheets.
- Auditoría mínima.

### Fase 2
- Reglas contables adicionales.
- Mejoras de duplicados con más criterios.
- Historial de facturas registradas.
- Revisión por roles.
- Dashboard operativo.

### Fase 3
- Integración con ERP o sistema contable formal.
- Clasificación automática por categoría.
- Aprobaciones y flujos internos.
- Captura masiva o desde correo.

---

## 19. Resumen final

El producto definido es un módulo de registro de facturas con un flujo asistido por IA pero controlado por el usuario. La lógica central del diseño prioriza tres cosas: **calidad del documento de entrada**, **revisión humana antes del guardado** y **trazabilidad del registro**. La combinación de validación inicial, extracción por IA, revisión manual, chequeo de duplicados, registro en Google Sheets y auditoría constituye una base sólida para un MVP funcional y extensible.
