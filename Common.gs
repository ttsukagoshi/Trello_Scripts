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
