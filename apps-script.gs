var SHEET_NAME = 'CambiosMedicos';

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('index')
    .setTitle('Cambios programacion de medicos');
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ status: 'error', message: 'Body vacio.' });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (error) {
      return jsonOutput({ status: 'error', message: 'JSON invalido.' });
    }

    if (!payload || typeof payload !== 'object') {
      return jsonOutput({ status: 'error', message: 'JSON invalido.' });
    }

    return jsonOutput(processPayload_(payload));
  } catch (error) {
    Logger.log('doPost error: ' + (error && error.message ? error.message : String(error)));
    return jsonOutput({ status: 'error', message: 'Error interno.' });
  }
}

function submitChange(payload) {
  try {
    return processPayload_(payload);
  } catch (error) {
    Logger.log('submitChange error: ' + (error && error.message ? error.message : String(error)));
    return { status: 'error', message: 'Error interno.' };
  }
}

function processPayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    return { status: 'error', message: 'JSON invalido.' };
  }

  var website = safeString(payload.website);
  if (website) {
    return { status: 'error', message: 'Datos invalidos.' };
  }

  var fechaNovedad = safeString(payload.fecha_novedad);
  var fechaReubicar = safeString(payload.fecha_reubicar);
  var cambio = safeString(payload.cambio);
  var descripcion = safeString(payload.descripcion);
  var medico = safeString(payload.medico);

  if (!isValidDate_(fechaNovedad) || !isValidDate_(fechaReubicar) || !isValidText_(cambio, 3, 120) || !isValidText_(descripcion, 5, 1000) || !isValidText_(medico, 3, 120)) {
    return { status: 'error', message: 'Datos invalidos.' };
  }

  fechaNovedad = sanitizeForSheet_(fechaNovedad);
  fechaReubicar = sanitizeForSheet_(fechaReubicar);
  cambio = sanitizeForSheet_(cambio);
  descripcion = sanitizeForSheet_(descripcion);
  medico = sanitizeForSheet_(medico);

  var sheet = getOrCreateSheet_(SHEET_NAME);
  sheet.appendRow([fechaNovedad, fechaReubicar, cambio, descripcion, medico]);

  return { status: 'success' };
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(['fecha_novedad', 'fecha_reubicar', 'cambio', 'descripcion', 'medico']);
  }

  return sheet;
}

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function isValidDate_(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  var parts = value.split('-');
  var year = Number(parts[0]);
  var month = Number(parts[1]);
  var day = Number(parts[2]);

  var date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isValidText_(value, minLen, maxLen) {
  return value.length >= minLen && value.length <= maxLen;
}

function sanitizeForSheet_(value) {
  if (/^[=+\-@]/.test(value)) {
    return "'" + value;
  }

  return value;
}
