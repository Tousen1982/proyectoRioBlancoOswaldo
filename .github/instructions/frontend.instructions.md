---
name: 'Frontend del chat'
description: 'Usar al crear o modificar la interfaz web del chatbot.'
applyTo: 'public/**'
---

# Reglas del frontend

## Tecnologías permitidas

- Solo HTML5, CSS3 y JavaScript Vanilla (ES2020+). Sin frameworks ni CDNs.


---

# Objetivo visual

La aplicación debe parecer una herramienta corporativa real de Distribuidora Río Claro y no una prueba técnica.

La interfaz debe transmitir:

- Profesionalismo.
- Simplicidad.
- Claridad.
- Facilidad de uso.
- Diseño corporativo moderno.

---

# Estructura visual

La aplicación es de una sola página.

Debe contener:

1. Encabezado corporativo.
2. Nombre del asistente.
3. Descripción breve.
4. Área principal de conversación.
5. Preguntas sugeridas.
6. Área de entrada de texto.
7. Botón de envío.
8. Indicador de procesamiento.
9. Pie de página.

---

# Encabezado

Mostrar:

Título:

Asistente Corporativo Río Claro

Subtítulo:

Consulta políticas, facturación, productos y procedimientos internos mediante inteligencia artificial.

El encabezado debe permanecer visible en la parte superior.

---

# Chat

El chat es el elemento principal de la aplicación.

Requisitos:

- Historial visible.
- Scroll automático al último mensaje.
- Animaciones suaves.
- Diseño similar a Microsoft Copilot o ChatGPT.
- Mantener espaciados amplios.

---

# Tipos de mensaje

## Usuario

Mostrar:

- Alineado a la derecha.
- Color corporativo principal.
- Texto blanco.

## Asistente

Mostrar:

- Alineado a la izquierda.
- Fondo neutro.
- Texto oscuro.

## Error

Mostrar:

- Fondo rojo suave.
- Texto de error claro.

## Sistema

Mostrar:

- Fondo gris.
- Texto secundario.

---

# Seguridad

Insertar contenido usando:

```javascript
textContent
```

Nunca usar:

```javascript
innerHTML
```

No renderizar HTML devuelto por el backend.

Todo texto debe tratarse como contenido no confiable.

---

# Conversación

Guardar el:

```text
conversation_id
```

en memoria JavaScript.

Si existe:

- reutilizar la conversación.

Si no existe:

- crear nueva conversación.

El conversation_id se pierde al recargar la página.

No utilizar LocalStorage.

---

# Preguntas sugeridas

Mostrar una sección de accesos rápidos.

Botones sugeridos:

- ¿Cuál es la política de devoluciones?
- ¿Cómo se validan las facturas?
- ¿Qué hacer ante una factura duplicada?
- ¿Cuál es la política de trabajo remoto?
- ¿Cuántas horas de capacitación son obligatorias?
- ¿Cuánto cuesta el Cloro Industrial 5L?

Al hacer clic:

- copiar automáticamente el texto al campo de entrada.
- opcionalmente enviar la consulta.

---

# Estado de carga

Mientras el backend responde:

- deshabilitar textarea.
- deshabilitar botón enviar.
- mostrar spinner visual.
- mostrar texto:

Consultando documentación corporativa...

Cuando termine:

- habilitar controles.
- ocultar spinner.

---

# Fuentes documentales

Cuando el backend proporcione referencias:

mostrar sección:

Fuente:

- Politicas_Devoluciones_y_Garantias_RioClaro.docx
- Manual_Cuentas_Por_Pagar_RioClaro.docx
- Catalogo_Productos_RioClaro_2026.docx

Las referencias nunca deben ocultarse.

---

# Accesibilidad

Garantizar:

- Navegación por teclado.
- Labels visibles.
- Contraste adecuado.
- Focus visible.
- Compatible con lectores de pantalla.

No depender de hover para funciones críticas.

---

# Responsive

La aplicación debe funcionar correctamente en:

- 360px
- 390px
- 768px
- 1024px
- 1440px

Nunca generar scroll horizontal.

---

# Tema oscuro

Implementar:

```css
prefers-color-scheme: dark
```

Utilizar variables CSS.

Ejemplo:

```css
:root {
  --primary-color:;
  --background-color:;
  --surface-color:;
  --text-color:;
}
```

No duplicar estilos para cada tema.

---

# Experiencia de usuario

La aplicación debe sentirse rápida.

Requisitos:

- Animación suave al agregar mensajes.
- Scroll automático.
- Retroalimentación inmediata.
- Tiempo de espera visible.
- Interfaz limpia.

Evitar ventanas emergentes innecesarias.

---

# Estilo visual

Inspirarse en:

- Microsoft Copilot
- Azure Portal
- Microsoft 365

Usar:

- Bordes redondeados.
- Sombras suaves.
- Espaciado consistente.
- Tipografía moderna del sistema.

No utilizar colores demasiado saturados.

---

# Preparación para futuras fases

El diseño debe permitir agregar posteriormente:

- Validación de facturas.
- Historial de consultas.
- Dashboard administrativo.

No implementar dichas funciones todavía.

Preparar únicamente la estructura visual para su futura incorporación.
