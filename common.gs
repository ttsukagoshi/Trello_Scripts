// Add to menu when spreadsheet is opened
function onOpen(e) {
  SpreadsheetApp.getUi()
  .createMenu('Trello')
  .addItem('Get My Board', 'trelloBoards')
  .addItem('Get Board Content', 'trelloReport')
  //.addSeparator()
  //.addItem('Delete Archived Cards', 'deleteArchivedCards')
  .addToUi();
}

// Global params
var timeZone = Session.getScriptTimeZone();

/**
 * Standarized Date Format for this project.
 * @param {string} dateString
 * @return {string} dateIso
 */
function stDate(dateString) {
  var dateIso = Utilities.formatDate(new Date(dateString), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
  return dateIso;
}

/**
 * Standarized error message for this project
 * @param {object} e: error object returned by try-catch
 * @return {string} message: standarized error message
 */
function errorMessage(e) {
  var message = 'Error : line - ' + e.lineNumber + '\n[' + e.name + '] ' + e.message + '\n' + e.stack;
  return message;
}
