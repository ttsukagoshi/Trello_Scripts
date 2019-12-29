/**
 * This is a Google App Script library for using Trello API on app script
 * For details, go to https://github.com/ttsukagoshi/Trello_Scripts/
 */

// Global vars
var baseUrl = 'https://api.trello.com/1',
    trelloKey = 'apiKey', // to be declared at individual scripts
    trelloToken = 'apiToken', // to be declared at individual scripts
    apiKeyToken = 'key=apiKey&token=apiToken'; // to be declared at individual scripts

/**
 * GET request
 * @param {string} url
 * @return {Object} response - JSON format
 */
function get(url) {
  var response = UrlFetchApp.fetch(url, {'method':'GET', 'muteHttpExceptions':false});
  return response;
}

/**
 * POST request
 * @param {string} url
 * @return {Object} response - JSON format
 */
function post(url) {
  var response = UrlFetchApp.fetch(url, {'method':'POST', 'muteHttpExceptions':false});
  return response;
}

/**
 * DELETE request
 * @param {string} url
 * @return {Object} response - JSON format
 */
function tDelete(url) {
  var response = UrlFetchApp.fetch(url, {'method':'DELETE', 'muteHttpExceptions':false});
  return response;
}

/**
 * Function to return URL for getMyBoards
 * @param {Boolean} simple - if true, returns the partial URL for retrieving only board ID and name. Defaults to false.
 * @return {string} uUrl - unique part of url for this GET call
 */
function getMyBoardsUrl(simple) {
  simple = simple || false;
  var uUrl = '/members/me/boards';
  if (simple === true) {
    uUrl += '?fields=name';
  }
  return uUrl;
}

/**
 * Retrieve details of the boards of the current user, as represented by the Trello API key and token
 * https://developers.trello.com/reference#membersidboards
 * 
 * @param {boolean} simple - if true, returns the partial URL for retrieving only board ID and name. Defaults to false.
 * @return {Object} myBoards - parsed JSON object showing details of the user's boards
 */
function getMyBoards(simple) {
  simple = simple || false;
  var delimiter = '?';
  if (simple === true) {
    delimiter = '&';
  }
  var extUrl = getMyBoardsUrl(simple) + delimiter + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var myBoards = get(url);
    myBoards = JSON.parse(myBoards);
    return myBoards;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Function to return URL for getBoard
 * @param {string} boardId - Trello Board ID
 * @return {string} uUrl - unique part of url for this GET call
 */
function getBoardUrl(boardId){
  var uUrl = '/boards/' + boardId;
  return uUrl;
}

/**
 * Retrieve details of a board
 * https://developers.trello.com/reference#boardsboardid-1
 *
 * @param {string} boardId - Trello Board ID
 * @return {Object} board - details of board
 */
function getBoard(boardId) {
  var extUrl = getBoardUrl(boardId) + '?'  + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var board = get(url);
    board = JSON.parse(board);
    return board;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Function to return URL for getBoardActions.
 * @param {string} boardId - Board ID of the target Trello board
 * @return {string} uUrl - unique part of url for this GET call
 */
function getBoardActionsUrl(boardId){
  var uUrl = '/boards/' + boardId + '/actions?limit=1000';
  return uUrl;
}

/**
 * Returns an object of actions in a designated Trello board
 * Only the most recent 1,000 actions can be retrieved, as limited by the Trello API
 * https://developers.trello.com/reference#boardsboardidactions
 * 
 * @param {string} boardId - Board ID of the target Trello board
 * @return {Object} actions - the most recent 1,000 (upper limit) actions in the targeted board
 */
function getBoardActions(boardId){
  var extUrl = getBoardActionsUrl(boardId) + '&' + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var actions = get(url);
    actions = JSON.parse(actions);
    return actions;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Function to return URL for getBoardCards.
 * @param {string} boardId - Board ID of the target Trello board
 * @param {string} option - 'all', 'closed', 'none', 'open', or 'visible'
 * @return {string} uUrl - unique part of url for this GET call
 */
function getBoardCardsUrl(boardId, option){
  var uUrl = '/boards/' + boardId + '/cards/' + option;
  return uUrl;
}

/**
 * Returns an object of all cards in a designated Trello board
 * https://developers.trello.com/reference#boardsboardidtest
 *
 * @param {string} boardId - Board ID of the target Trello board
 * @param {string} option - 'all', 'closed', 'none', 'open', or 'visible'
 * @return {Object} cards - cards in the targeted board
 */
function getBoardCards(boardId, option){
  var extUrl = getBoardCardsUrl(boardId, option) + '?' + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var cards = get(url);
    cards = JSON.parse(cards);
    return cards;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Function to return URL for getBoardChecklists.
 * @param {string} boardId - Board ID of the target Trello board
 * @return {string} uUrl - unique part of url for this GET call
 */
function getBoardChecklistsUrl(boardId){
  var uUrl = '/boards/' + boardId + '/checklists';
  return uUrl;
}

/**
 * Returns an object of all checklists in a designated Trello board
 * https://developers.trello.com/reference#boardsboardidactions-3
 * 
 * @param {string} boardId - Board ID of the target Trello board
 * @return {Object} checklists - checklists in the targeted board
 */
function getBoardChecklists(boardId){
  var extUrl = getBoardChecklistsUrl(boardId) + '?' + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var checklists = get(url);
    checklists = JSON.parse(checklists);
    return checklists;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Function to return URL for getBoardLists.
 * @param {string} boardId - Board ID of the target Trello board
 * @return {string} uUrl - unique part of url for this GET call
 */
function getBoardListsUrl(boardId) {
  var uUrl = '/boards/' + boardId + '/lists';
  return uUrl;
}

/**
 * Returns an object of all lists in a designated Trello board
 * https://developers.trello.com/reference#boardsboardidlists
 * 
 * @param {string} boardId - Board ID of the target Trello board
 * @return {Object} lists - cards in the targeted board
 */
function getBoardLists(boardId) {
  var extUrl = getBoardListsUrl(boardId) + '?' + apiKeyToken;
  var url = baseUrl + extUrl;
  try {
    var lists = get(url);
    lists = JSON.parse(lists);
    return lists;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * BATCH: Make multiple GET requests to the Trello API using get***Url() functions
 * KNOWN ISSUE: not compatible with URLs that have commas in their query params
 * See official document at https://developers.trello.com/reference#batch for workarounds
 * @param {Object} urls - One-dimensional array of GET request URLs in form of get***Url functions
 * @return {Object} responses - array of objects in line with the order of request URLs in urls
 */
function batchGet(urls) {
  var encodedUrls = encodeURIComponent(urls.join());
  var url = baseUrl + '/batch/?urls=' + encodedUrls + '&' + apiKeyToken;
  try {
    if (urls.length < 1) {
      throw new Error('Enter one or more URL(s) in form of one-dimensional array.');
    }
    var responses = this.get(url);
    responses = JSON.parse(responses);
    return responses;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Create Trello card
 * https://developers.trello.com/reference#cardsid-1
 * 
 * @param {Object} queryParams - object in form of {[query params1]=[parameter1],[query params2]=[parameter2], ...}
 * See above URL for full details of available query params.
 * @return {Object} createdCard - parsed JSON object with the details of the card created
 */
function postCard(queryParams) {
  var queryKeys = queryParams.keys();
  var extUrl = '?';
  for (var i = 0; i < queryKeys.length; i++) {
    var key = queryKeys[i];
    var value = queryParams[key];
    var keyValue = key + '=' + value + '&';
    extUrl += keyValue;
  }
  var url = baseUrl + '/cards' + extUrl + apiKeyToken;
  try {
    var createdCard = post(url);
    createdCard = JSON.parse(createdCard);
    return createdCard;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/**
 * Delete card
 * https://developers.trello.com/reference#delete-card
 * 
 * @param {string} cardId - Trello card ID
 * @return {Object} deleted - result of DELETE
 */
function deleteCard(cardId) {
  var url = baseUrl + '/cards/' + cardId + '?'  + apiKeyToken;
  try {
    var deleted = tDelete(url);
    deleted = JSON.parse(deleted);
    return deleted;
  } catch(e) {
    var error = errorMessage(e);
    return error;
  }
}

/************************************************************/

/**
 * Standarized error message for this script
 * @param {Object} e - error object returned by try-catch
 * @return {string} message - standarized error message
 */
function errorMessage(e) {
  var message = 'Error : line - ' + e.lineNumber + '\n[' + e.name + '] ' + e.message + '\n' + e.stack;
  return message;
}
