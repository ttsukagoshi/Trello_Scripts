var timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();

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
 * Create Google Spreadsheet sheet(s) from set(s) of header(s) and value(s)
 * 
 * @param {Object} spreadsheet - Spreadsheet object to create sheet on 
 * @param {Array} dataSet - Array of formatted object containing data object(s) which should be in form of 
 * [
 *     {'sheetName':{string}'sheetName0', 'sheetData':{Object}dataObject0},
 *     {'sheetName':{string}'sheetName1', 'sheetData':{Object}dataObject1},...
 * ]
 * @param {string} prefix - Optional. Prefix to be added to title of each sheet.
 * @param {Date} timestamp - Optional. Timestamp of dataSet; defaults to the time when script is executed.
 * @return {Array} createdSheets - Array of sheets created in form of [{sheetId0=sheetName0},{sheetId1=sheetName1}, ...]
 */
function createSheets(spreadsheet, dataSet, prefix, timestamp) {
  prefix = prefix || '';
  timestamp = timestamp || new Date();
  var createdSheets = [];
  
  for (var i = 0; i < dataSet.length; i++) {
    var createdSheet = {};
    var dataObject = dataSet[i];
    var sheetName = dataObject.sheetName,
        sheetData = dataObject.sheetData,
        sheetTitle = prefix + ' - ' + sheetName + ' as of ' + Utilities.formatDate(timestamp, timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX");
    var sheet = spreadsheet.insertSheet(sheetName, i); // Insert new sheet to spreadsheet
    
    // Breakdown object sheetData into its header and values; see function breakdownObject for details
    var sheetDataElem = breakdownObject(sheetData);
    var sheetDataHeader = sheetDataElem[0], // note that sheetDataHeader is already a two-dimensional array
        sheetDataValues = sheetDataElem[1];
    
    // Enter into sheet
    sheet.getRange(1, 1).setValue(sheetTitle); // Title
    sheet.getRange(3, 1, 1, sheetDataHeader[0].length).setValues(sheetDataHeader); // Header
    sheet.getRange(4, 1, sheetDataValues.length, sheetDataHeader[0].length).setValues(sheetDataValues); // Values
    
    createdSheet[sheet.getSheetId()] = sheetName;
    createdSheets.push(createdSheet);
  }
}

/**
 * Converts the input array of object into array of keys, i.e.,header, and its values
 *
 * @param {Array} data - array of objects
 * @return {Array} output - array of [header, values], where header and values are both two-dimensional arrays
 */
function breakdownObject(data) {
  var header = [],
      values = [],
      keys = Object.keys(data[0]),
      key = '';
  // define header
  header[0] = keys;
  // define values
  for (var i = 0; i < data.length; i++) {
    var datum = data[i];
    values[i] = [];
    for (var j = 0; j < keys.length; j++) {
      key = keys[j];
      values[i].push(datum[key]);
    }
  }
  var output = [header, values];
  return output;
}
