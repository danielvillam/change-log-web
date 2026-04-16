# Registro de cambios en la programacion de medicos

Aplicacion web simple para registrar cambios en la programacion de medicos y guardar los datos en Google Sheets usando Google Apps Script.

## Arquitectura

El proyecto usa una estructura muy ligera:

- `index.html`
  - Formulario HTML.
  - Estilos CSS.
  - Envio de datos con `fetch`.
- `apps-script.gs`
  - Endpoint `doPost`.
  - Validacion y sanitizacion de datos.
  - Persistencia en Google Sheets.
- `icon.png`
  - Icono del proyecto.

## Flujo

1. El usuario completa el formulario en el navegador.
2. El frontend arma un JSON con `fecha`, `cambio`, `descripcion`, `medico` y `website`.
3. El frontend envia el payload con `fetch` al endpoint de Apps Script.
4. El backend valida que exista body y que el JSON sea correcto.
5. El backend valida campos, descarta el honeypot `website` si viene lleno y sanitiza texto antes de guardar.
6. La fila se persiste en la hoja de calculo configurada.

## Estructura de datos

El formulario captura estos campos:

- `fecha`: fecha del cambio.
- `cambio`: tipo de cambio realizado.
- `descripcion`: detalle del cambio.
- `medico`: nombre del medico.
- `website`: honeypot invisible para reducir spam.

La hoja guarda estas columnas:

- fecha
- cambio
- descripcion
- medico

## Configuracion

La configuracion es manual y se hace directamente en el codigo.

### Frontend

En `index.html`:

- Reemplazar `APPS_SCRIPT_URL` por la URL real de la Web App desplegada.

### Backend

En `apps-script.gs`:

- Mantener `SHEET_NAME` con el nombre de la hoja destino.
- Desplegar el script como Web App con permisos de escritura sobre la hoja.
- Configurar el acceso de la Web App para usuarios de Google Workspace autorizados.

## Requisitos

- HTML, CSS y JavaScript vanilla.
- Google Apps Script.
- Google Sheets.

## Seguridad actual

- Restriccion de acceso configurada en el despliegue de Apps Script (Google Workspace).
- Validaciones de longitud y formato antes de persistir.
- Sanitizacion para reducir riesgo de formula injection en Sheets.
- Honeypot para filtrar envios automatizados simples.
- Errores internos no expuestos al usuario.

## Limitaciones

- No hay control de roles ni sesiones.
- No hay rate limiting avanzado.
- El almacenamiento en Sheets es practico para un caso simple, pero no sustituye una base de datos.

## Desarrollo

Para probar el flujo completo:

1. Publica el Apps Script como Web App.
2. Copia la URL generada y pegala en `APPS_SCRIPT_URL`.
3. Verifica que el despliegue este restringido al Workspace correcto.
4. Abre `index.html` en el navegador con una cuenta autorizada y envia un registro de prueba.

## Ejemplo de request

```json
{
  "fecha": "2026-04-14",
  "cambio": "Ajuste en cirugia",
  "descripcion": "El medico estara apoyando otro proceso.",
  "medico": "Dr. Perez",
  "website": ""
}
```

## Respuesta esperada

```json
{
  "status": "success"
}
```
