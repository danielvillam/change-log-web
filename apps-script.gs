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
