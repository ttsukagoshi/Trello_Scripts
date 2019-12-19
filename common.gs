var timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();

/**
 * Standarized Date Format for this project.
 * @param {String} dateString
 * @return {String} dateIso
 */
function stDate(dateString) {
  var dateIso = Utilities.formatDate(new Date(dateString), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
  return dateIso;
}
