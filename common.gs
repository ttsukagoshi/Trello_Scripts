// Add to menu when spreadsheet is opened
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [];
  menuItems.push({name: 'Get Board Content', functionName: 'trelloReport'});
  spreadsheet.addMenu('Trello', menuItems);
}

/**
 * Standarized Date Format for this project.
 * @param {string} dateString
 * @return {string} dateIso
 */
function stDate(dateString) {
  var dateIso = Utilities.formatDate(new Date(dateString), 'JST', "yyyy-MM-dd'T'HH:mm:ssXXX");
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
