var SHEET_NAME = 'CambiosMedicos';
var ACCESS_TOKEN = 'change-log-web-token';

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

    if (!isValidToken_(payload.token)) {
      return jsonOutput({ status: 'error', message: 'No autorizado.' });
    }

    var website = safeString(payload.website);
    if (website) {
      return jsonOutput({ status: 'error', message: 'Datos invalidos.' });
    }

    var fecha = safeString(payload.fecha);
    var cambio = safeString(payload.cambio);
    var descripcion = safeString(payload.descripcion);
    var medico = safeString(payload.medico);

    if (!isValidDate_(fecha) || !isValidText_(cambio, 3, 120) || !isValidText_(descripcion, 5, 1000) || !isValidText_(medico, 3, 120)) {
      return jsonOutput({ status: 'error', message: 'Datos invalidos.' });
    }

    fecha = sanitizeForSheet_(fecha);
    cambio = sanitizeForSheet_(cambio);
    descripcion = sanitizeForSheet_(descripcion);
    medico = sanitizeForSheet_(medico);

    var sheet = getOrCreateSheet_(SHEET_NAME);
    sheet.appendRow([
      fecha,
      cambio,
      descripcion,
      medico
    ]);

    return jsonOutput({
      status: 'success',
      data: {
        fecha: payload.fecha,
        cambio: payload.cambio,
        descripcion: payload.descripcion,
        medico: payload.medico,
        website: payload.website
      }
    });
  } catch (error) {
    Logger.log('doPost error: ' + (error && error.message ? error.message : String(error)));
    return jsonOutput({ status: 'error', message: 'Error interno.' });
  }
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
    sheet.appendRow(['fecha', 'cambio', 'descripcion', 'medico', 'website']);
  }

  return sheet;
}

function isValidToken_(token) {
  return String(token || '').trim() === ACCESS_TOKEN;
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
