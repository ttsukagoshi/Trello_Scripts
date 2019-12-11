// params from script properties
// File > Properties > Script Properties
// 参考：スクリプトエディタの「ファイル」＞「プロジェクトのプロパティ」＞タブ「スクリプトのプロパティ」
var scriptProperties = PropertiesService.getScriptProperties();
var pUserName = scriptProperties.getProperty('userName');
var pTrelloKey = scriptProperties.getProperty('trelloKey'); // Trello API Key
var pTrelloToken = scriptProperties.getProperty('trelloToken'); // Trello API Token
var pBoardId = scriptProperties.getProperty('boardId');

// Setting class 'Trello'
// See official document at https://developers.trello.com/reference#introduction
var Trello = {
  // BASIC PARAMETERS
  baseUrl: 'https://api.trello.com/1',
  pKeyToken: function() {
    var keyToken = 'key=' + pTrelloKey + '&token=' + pTrelloToken;
    return keyToken;
  },
  
  // HTTP REQUEST METHODS
  get: function(url) {
    var response = UrlFetchApp.fetch(url, {'method':'GET', 'muteHttpExceptions':false});
    return response;
  },
  tDelete: function(url) {
    var response = UrlFetchApp.fetch(url, {'method':'DELETE', 'muteHttpExceptions':false});
    return response;
  },
  
  // FUNCTIONS
  /**
   * Function to return URL for getBoard
   * @param {string} boardId: Trello Board ID
   * @return {string} uUrl: unique part of url for this GET call
   */
  getBoardUrl: function(boardId){
    var uUrl = '/boards/' + boardId;
    return uUrl;
  },
  /**
   * Retrieve details of a board
   * @param {string} boardId: Trello Board ID
   * @return {object} board: details of board
   */
  getBoard: function(boardId) {
    var extUrl = this.getBoardUrl(boardId) + '?'  + this.pKeyToken();
    var url = this.baseUrl + extUrl;
    try {
      var board = this.get(url);
      board = JSON.parse(board);
      return board;
    } catch(e) {
      var error = errorMessage(e);
      return error;
    }
  },
  /**
   * Function to return URL for getCards.
   * @param {string} boardId: Board ID of the target Trello board
   * @param {string} option: 'all', 'closed', 'none', 'open', or 'visible'
   * @return {string} uUrl: unique part of url for this GET call
   */
  getCardsUrl: function(boardId, option){
    var uUrl = '/boards/' + boardId + '/cards/' + option;
    return uUrl;
  },
  /**
   * Returns an object of all cards in a designated Trello board
   * @param {string} boardId: Board ID of the target Trello board
   * @param {string} option: 'all', 'closed', 'none', 'open', or 'visible'
   * @return {object} cards: cards in the targeted board
   */
  getCards: function(boardId, option){
    var extUrl = this.getCardsUrl(boardId, option) + '?' + this.pKeyToken();
    var url = this.baseUrl + extUrl;
    try {
      var cards = this.get(url);
      cards = JSON.parse(cards);
      return cards;
    } catch(e) {
      var error = errorMessage(e);
      return error;
    }
  },
  /**
   * Function to return URL for getLists.
   * @param {string} boardId: Board ID of the target Trello board
   * @return {string} uUrl: unique part of url for this GET call
   */
  getListsUrl: function(boardId) {
    var uUrl = '/boards/' + boardId + '/lists';
    return uUrl;
  },
  /**
   * Returns an object of all lists in a designated Trello board
   * @param {string} boardId: Board ID of the target Trello board
   * @return {object} lists: cards in the targeted board
   */
  getLists: function(boardId) {
    var extUrl = this.getListsUrl(boardId) + '?' + this.pKeyToken();
    var url = this.baseUrl + extUrl;
    try {
      var lists = this.get(url);
      lists = JSON.parse(lists);
      return lists;
    } catch(e) {
      var error = errorMessage(e);
      return error;
    }
  },
  /**
   * BATCH: Make multiple GET requests to the Trello API using this.get***Url() functions
   * KNOWN ISSUE: not compatible with URLs that have commas in their query params
   * See official document at https://developers.trello.com/reference#batch for workarounds
   * @param {array} urls: array of GET request URLs in form of this.get***Url functions
   * @return {object} responses: array of objects in line with the order of request URLs in urls
   */
  batchGet: function(urls) {
    var encodedUrls = encodeURIComponent(urls.join());
    var url = this.baseUrl + '/batch/?urls=' + encodedUrls + '&' + this.pKeyToken();
    try {
      var responses = this.get(url);
      responses = JSON.parse(responses);
      return responses;
    } catch(e) {
      var error = errorMessage(e);
      return error;
    }
  },
  /**
   * Delete card
   * @param {string} cardId: Trello card ID
   * @return {object} deleted: result of DELETE
   */
  deleteCard: function(cardId) {
    var url = this.baseUrl + 'cards/' + cardId + '?'  + this.pKeyToken();
    try {
      var deleted = this.tDelete(url);
      deleted = JSON.parse(deleted);
      return deleted;
    } catch(e) {
      var error = errorMessage(e);
      return error;
    }
  }
}

/**
 * List the contents of a Trello board into a newly created Google Spreadsheet sheet
 */
function trelloReport(){
  // Get contents of Trello board
  var boardId = pBoardId;
  var getBoardUrl = Trello.getBoardUrl(boardId);
  var getCardsUrl = Trello.getCardsUrl(boardId,'all');
  var getListsUrl = Trello.getListsUrl(boardId);
  var urls = [getBoardUrl, getCardsUrl, getListsUrl];
  var responses = Trello.batchGet(urls);
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
  // var cardParams = Trello.cardParams();
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
  var now = Utilities.formatDate(new Date(), 'JST', 'yyyyMMddHHmmss');
  var sheetName = 'TrelloReport' + now;
  
  var reportSS = SpreadsheetApp.getActiveSpreadsheet();
  var reportSheet = reportSS.insertSheet(sheetName, 0); // Insert new sheet at the left-most position (<- sheetIndex = 0)
  var headerRange = reportSheet.getRange(1,1,1,header[0].length);
  var headerData = headerRange.setValues(header);
  var reportRange = reportSheet.getRange(2,1,data.length,header[0].length);
  var reportData = reportRange.setValues(data);
}


/**
 * Bulk delete all archived cards in a designated Trello board
 * NOTE: CANNOT BE UNDONE!!!
 */
function deleteArchivedCards() {
  var cards = Trello.getCards(pBoardId, 'closed');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardId = card.id;
    var deleted = Trello.deleteCard(cardId);
    Logger.log(deleted);
  }
}

