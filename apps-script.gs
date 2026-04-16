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

    var sheet = getOrCreateSheet_(SHEET_NAME);
    sheet.appendRow([
      payload.fecha || '',
      payload.cambio || '',
      payload.descripcion || '',
      payload.medico || '',
      payload.website || ''
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
