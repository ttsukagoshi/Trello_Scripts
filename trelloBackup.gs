/**
 * This script requires additional OAuth Scope:
 * Send email as you: https://www.googleapis.com/auth/script.send_mail
 * See, edit, create, and delete all of your Google Drive files: https://www.googleapis.com/auth/drive
 */

var thisSpreadsheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl();

// Additional script properties as global variables
// For more details, see https://github.com/ttsukagoshi/Trello_Scripts/blob/master/README.md
var backupRootFolderId = scriptProperties.getProperty('backupRootFolderId');

/**
 * Create a backup spreadsheet as a content list of all available boards
 *
 * @param {string} option - select how to handle the created backup spreadsheet: 'Email'
 * 
 */
function trelloBackup() {
  var startScript = new Date();
  
  // Email address of current user; send email notifications to this address
  var myEmail = Session.getActiveUser().getEmail();
  
  // Create a new Google Drive folder in the backup root folder
  var now = new Date();
  var folderName = Utilities.formatDate(now, timeZone, 'yyyyMMddHHmmss');
  var backupFolder = DriveApp.getFolderById(backupRootFolderId).createFolder(folderName); 
  var backupFolderUrl = backupFolder.getUrl();
  var backupFolderAttachments = backupFolder.createFolder('Attachments');
  
  // Create spreadsheet
  var spreadsheetName = 'Trello Backup' + folderName;
  var sheetId = createSpreadsheet(backupFolder, spreadsheetName); // create a spreadsheet under a Google Drive folder designated by Folder ID
  var backupSpreadsheet = SpreadsheetApp.openById(sheetId);
  
  // Attachments to download
  // Attachments other than URLs that are save in trello-attachements server will be downloaded
  var downloadList = [];
  var downloadListUrls = [];
  var downloadListNames = [];
  var filterUrl = 'https://trello-attachments.s3.amazonaws.com/';
  var filterUrlLength = filterUrl.length;
  
  try {
    // Get list of all board information in simple form (only name and ID) 
    var myBoards = TrelloScript.getMyBoards();
    var username = TrelloScript.getMyUserData().username;
    
    // Thow error if no board is available
    if (myBoards.length == 0) {
      throw new Error('No board available / 対象ボードが存在しません');
    }
    
    for (var i = 0; i < myBoards.length; i++) {
      var myBoard = myBoards[i];
      // Get contents of this board
      var myBoardData = trelloData(myBoard.id),
          myBoardShortLink = myBoard.shortLink;
      var myBoardName = myBoardData[0],
          myBoardTimestamp = myBoardData[1],
          myBoardContents = myBoardData[2],
          myBoardActions = myBoardData[3],
          myBoardAttachments = myBoardData[4];
      
      var dataSet = [
        {'sheetName' : 'Contents_' + myBoardShortLink, 'sheetData' : myBoardContents},
        {'sheetName' : 'Actions_' + myBoardShortLink, 'sheetData' : myBoardActions},
        {'sheetName' : 'Attachments_' + myBoardShortLink, 'sheetData' : myBoardAttachments}
      ];
      
      // Create new sheets for the data of this board
      var createdSheets = createSheets(backupSpreadsheet, dataSet, 'Trello Board Name: ' + myBoardName, myBoardTimestamp);
      
      for (var j = 0; j < myBoardAttachments.length; j++) {
        var attachment = myBoardAttachments[j];
        var attachmentsNum = attachment.attachmentsNum,
            cardAttachmentName = attachment.cardAttachmentName,
            cardAttachmentUrl = attachment.cardAttachmentUrl;
        var fileName = attachmentsNum + '_' + cardAttachmentName;
        if (cardAttachmentUrl.substring(0, filterUrlLength) !== filterUrl) {
          continue
        } else {
          attachment['fileName'] = fileName;
          downloadList.push(attachment);
          downloadListUrls.push(cardAttachmentUrl);
          downloadListNames.push(fileName);
        }
      }
    }
    // Clear spreadsheet of initial blank sheet
    var backupSheets = backupSpreadsheet.getSheets();
    backupSpreadsheet.deleteSheet(backupSheets[backupSheets.length - 1]);
    
    // Save attachment files to Google Drive
    var responses = UrlFetchApp.fetchAll(downloadListUrls);
    for (var k = 0; k < responses.length; k++) {
      var blob = responses[k].getBlob().setName(downloadListNames[k]);
      backupFolderAttachments.createFile(blob);
    }
    
    // Check for script execution time
    var stopScript = new Date();
    var exeTime = ((stopScript - startScript)/1000) + 'sec';
    
    // Send email message when complete
    var mailSubject = 'Complete: Trello Backup for ' + stDate(now);
    var mailBody = 'A complete backup of Trello Boards for ' + username + ' as of '+ stDate(now) + ' has been created at\n'
      + backupFolderUrl + '\n'
      + 'Script execution time: ' + exeTime + '\n\n'
      + 'This script is run on the following Google Spreadsheet: ' + thisSpreadsheetUrl + '\n'
      + 'For details of this script, see https://github.com/ttsukagoshi/Trello_Scripts';
    if (userLocale === 'ja') {
      mailSubject = '完了：Trelloバックアップ ' + stDate(now);
      mailBody = 'ユーザ「' + username + '」のTrelloボード一式のバックアップが完了しました。（'+ stDate(now) + '時点）\n'
      + backupFolderUrl + '\n'
      + 'スクリプト実行時間: ' + exeTime + '\n\n'
      + 'このスクリプトは、次のGoogle Spreadsheet上で実行されています: ' + thisSpreadsheetUrl + '\n'
      + 'スクリプトの詳細については、次のURLをご参照ください: https://github.com/ttsukagoshi/Trello_Scripts';
    }
    MailApp.sendEmail(myEmail, mailSubject, mailBody);
  } catch (e) {
    var errorTo = Session.getActiveUser().getEmail();
    var referTo = thisSpreadsheetUrl;
    var errorNow = new Date();
    var errorText = TrelloScript.errorMessage(e) + '\n\nCheck script at ' + thisSpreadsheetUrl;
    MailApp.sendEmail(errorTo, 'Trello Backup Error: ' + stDate(errorNow), errorText);
  }
}

/**
 * Function to create a Google Spreadsheet in a particular Google Drive folder
 * @param {Object} targetFolder - Google Drive folder object in which you want to place the spreadsheet
 * @param {string} ssName - name of spreadsheet 
 * @return {string} ssId - spreadsheet ID of created spreadsheet
 */
function createSpreadsheet(targetFolder, ssName) {
  var ssId = SpreadsheetApp.create(ssName).getId();
  var temp = DriveApp.getFileById(ssId);
  targetFolder.addFile(temp);
  DriveApp.getRootFolder().removeFile(temp);
  return ssId;
}
