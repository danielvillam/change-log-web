function doPost(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Endpoint no implementado.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
