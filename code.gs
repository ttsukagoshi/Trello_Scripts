// Global vars
var userLocale = Session.getActiveUserLocale();
var scriptProperties = PropertiesService.getScriptProperties(); // File > Properties > Script Properties
// Update Library properties
TrelloScript.trelloKey = scriptProperties.getProperty('trelloKey'); // Trello API Key
TrelloScript.trelloToken = scriptProperties.getProperty('trelloToken'); // Trello API Token
var pTrelloKey = TrelloScript.trelloKey;
var pTrelloToken = TrelloScript.trelloToken;
TrelloScript.apiKeyToken = 'key=' + pTrelloKey + '&token=' + pTrelloToken;
// params from script properties
var pUserName = scriptProperties.getProperty('userName');
var pBoardId = scriptProperties.getProperty('boardId');

// Add to menu when spreadsheet is opened
function onOpen(e) {
  SpreadsheetApp.getUi()
  .createMenu('Trello')
  .addItem('Get Board Content', 'trelloReport')
  .addSeparator()
  .addItem('Key & Token', 'showKeyToken')
  .addItem('Get My Board', 'trelloBoards')
  .addSeparator()
  .addItem('Delete Archived Cards', 'deleteArchivedCards')
  .addToUi();
}

/**
 * Get the IDs of the Trello boards that are available to the current user, as represented by the Trello API key and token.
 */
function trelloBoards(){
  var ui = SpreadsheetApp.getUi();
  var simple = true;
  var myBoards = TrelloScript.getMyBoards(simple);
  var alertMessage = [];
  alertMessage.push('Board ID/Name: ')
  
  for (var i = 0; i < myBoards.length; i++) {
    var myBoard = myBoards[i];
    var text = myBoard.name + ' / ' + myBoard.id;
    alertMessage.push(text);
  }
  
  alertMessage = alertMessage.join('\n');
  ui.alert(alertMessage);
}

/**
 * List the contents of a Trello board into a newly created Google Spreadsheet sheet
 */
function trelloReport(){
  // Get contents of Trello board
  var boardId = pBoardId;
  var getBoardUrl = TrelloScript.getBoardUrl(boardId);
  var getBoardCardsUrl = TrelloScript.getBoardCardsUrl(boardId,'all');
  var getBoardListsUrl = TrelloScript.getBoardListsUrl(boardId);
  var urls = [getBoardUrl, getBoardCardsUrl, getBoardListsUrl];
  var responses = TrelloScript.batchGet(urls);
  var board = responses[0]['200']; // HTTP Response header 200 for valid request
  var cards = responses[1]['200']; // HTTP Response header 200 for valid request
  var lists = responses[2]['200']; // HTTP Response header 200 for valid request
  
  // Board information
  var boardName = board.name;
  var boardLabels = board.labelNames;
  // Object for list ID and list name in the board
  var listsIdName = {};
  for (var i = 0; i < lists.length; i++) {
    var ilist = lists[i];
    var ilistId = ilist.id;
    var ilistName = ilist.name;
    listsIdName[ilistId] = ilistName;
  }
  
  // Objects to enter into spreadsheet
  var header = [];
  var data = [];
  header[0] = ['cardId', 'cardName', 'cardClosed', 'dateLastActivity', 'cardDesc', 'due', 'dueComplete', 'listName', 'labelNames', 'cardShortUrl']; // Must be in line with the below {object} data
  
  // Convert contents of {object}cards into array
  for (i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardId = card.id;
    var cardClosed = card.closed;
    var dateLastActivity = card.dateLastActivity;
    var cardDesc = card.desc;
    var due = card.due;
    var dueComplete = card.dueComplete;
    var idAttachmentCover = card.idAttachmentCover;
    var idChecklists = card.idChecklists;
    var idList = card.idList;
    var cardLabels= card.labels;
    var cardName = card.name;
    var cardShortUrl = card.shortUrl;
    
    // Format params
    // dateLastActivity
    if (dateLastActivity !== null) {
      dateLastActivity = stDate(dateLastActivity);
    }
    // due
    if (due !== null) {
      due = stDate(due);
    }
    // listName
    var listName = listsIdName[idList];
    // labelNames
    var labelNames = [];
    for (var j = 0; j < cardLabels.length; j++) {
      var label = cardLabels[j];
      labelNames.push(label.name);
    }
    labelNames = labelNames.join(', ');
    
    data[i] = [cardId, cardName, cardClosed, dateLastActivity, cardDesc, due, dueComplete, listName, labelNames, cardShortUrl];
  }
 
  // Create a new sheet in this Google Spreadsheet
  var now = Utilities.formatDate(new Date(), timeZone, 'yyyyMMddHHmmss');
  var sheetName = 'TrelloReport' + now;
  
  var reportSS = SpreadsheetApp.getActiveSpreadsheet();
  var reportSheet = reportSS.insertSheet(sheetName, 0); // Insert new sheet at the left-most position (<- sheetIndex = 0)
  var sheetTitle = reportSheet.getRange(1,1).setValue('Trello Board Name: ' + boardName);
  var sheetHeader = reportSheet.getRange(3,1,1,header[0].length).setValues(header);
  var reportData = reportSheet.getRange(4,1,data.length,header[0].length).setValues(data);
}


/**
 * Bulk delete all archived cards in a designated Trello board
 * NOTE: CANNOT BE UNDONE!!!
 */
function deleteArchivedCards() {
  // set counters to avoid hitting Trello API rate limits
  /* Reference: https://developers.trello.com/docs/rate-limits
   * To help prevent strain on Trello’s servers, our API imposes rate limits per API key for all issued tokens. There is a limit of
   * 300 requests per 10 seconds for each API key and 
   * 100 requests per 10 seconds interval for each token.
  */
  var rateLimit = 100;
  var interval = 10 * 1000 // in milliseconds
  var counter = 0;
  
  // Log of all deleted cards
  var logDeleted = [];
  
  // Getting target board and card information
  var boardId = pBoardId;
  var getBoardUrl = TrelloScript.getBoardUrl(boardId);
  var getBoardCardsUrl = TrelloScript.getBoardCardsUrl(boardId,'closed');
  var urls = [getBoardUrl, getBoardCardsUrl];
  var responses = TrelloScript.batchGet(urls);
  var board = responses[0]['200']; // HTTP Response header 200 for valid request
  var cards = responses[1]['200']; // HTTP Response header 200 for valid request
  
  var boardName = board.name;
  
  // Prompt Message
  var ui = SpreadsheetApp.getUi();
  var promptMessage = 'You are about to delete all archived cards in Trello board \"' + boardName + '\." This action CANNOT BE UNDONE. To continue, enter name of target board for confirmation:';
  if (userLocale === 'ja') {
    promptMessage = 'Trelloボード名「' + boardName + '」内でアーカイブされた全てのカードを削除しようとしています。この操作は元に戻せません。\n続けるには、確認のために対象ボード名を入力してください。';
  }
  
  try {
    var promptConfirmation = ui.prompt('Confirm Delete / 確認', promptMessage, ui.ButtonSet.OK_CANCEL);
    if (promptConfirmation.getSelectedButton() !== ui.Button.OK) {
      throw new Error('Action Canceled / 削除がキャンセルされました');
    } else if (promptConfirmation.getResponseText() !== boardName) {
      throw new Error('Board name does not match / ボード名が一致しません');
    }
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var cardId = card.id;
      var cardName = card.name;
      var deleted = TrelloScript.deleteCard(cardId);
      logDeleted.push( 'Card ID: ' + cardId + ' / Card Name: ' + cardName);
      counter += 1;
      if (counter == rateLimit - 10) { // rateLimit minus 10 for a safe margin
        Utilities.sleep(interval);
        counter = 0;
      }
    }
    logDeleted = logDeleted.join('\n');
    ui.alert('Archived cards deleted / アーカイブされたカードが削除されました', logDeleted, ui.ButtonSet.OK);
  } catch(e) {
    var error = 'Canceled \n\n' + TrelloScript.errorMessage(e);
    ui.alert(error);
  }
}

/**
 * Show Trello Key & Token on alert window. Useful for making test requests on Trello Developers website.
 */
function showKeyToken(){
  var ui = SpreadsheetApp.getUi();
  var alertMessage = 'Key: ' + pTrelloKey + '\nToken: ' + pTrelloToken + '\nHandle with care!!!';
  ui.alert(alertMessage);
}
