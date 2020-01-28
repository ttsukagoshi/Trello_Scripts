日本語は準備中

# Properties and Methods in *TrelloScript* Library
See **TrelloScriptLibrary.gs** for actual code.  
See [the official documentation](https://developers.trello.com/) for detailed description.

## Properties
| Name | Description |
| --- | --- |
| baseUrl | Basic URL for making requests to Trello API, including the API version. |
| trelloKey | Property for API key. Should be reset by the individual scripts using the library. |
| trelloToken | Property for API token. Should be reset by the individual scripts using the library. |
| apiKeyToken | Property for a set of API key & token to be used in subsequent functions. Should be reset by the individual scripts using the library by `TrelloScript.apiKeyToken = 'key=' + myApiKey + '&token=' + myApiToken`|

### Resetting Properties
Properties *trelloKey*, *trelloToken*, and *apiKeyToken* listed above need to be reset by individual scripts using this library.  
Typically, you could assign the property a new value by `TrelloScript.[var name] = 'newValue'` in your script, where `TrelloScript` is the default identifier of this library.
e.g.
```javascript
var myApiKey = 'myKey';
var myApiToken = 'myToken';
TrelloScript.trelloKey = myApiKey;
TrelloScript.trelloToken = myApiToken;
TrelloScript.apiKeyToken = 'key=' + myApiKey + '&token=' + myApiToken`;
//...
// rest of your script
```

## Methods
| Name | Return Type | Description / link to corresponding documentation |
| --- | --- | --- |
| get(string *url*) | JSON object | Makes a HTTP GET request to the *url*. |
| post(string *url*) | JSON object | Makes a HTTP POST request to the *url*. |
| tDelete(string *url*) | JSON object | Makes a HTTP DELETE request to the *url*. |
| getMyBoardsUrl(boolean *simple*) | string | Returns `/members/me/boards` or if `simple === true`, `/members/me/boards?fields=name`|
| getMyBoards(boolean *simple*) | Object | Retrieve details of the boards of the current user, as represented by the Trello API key and token. https://developers.trello.com/reference#membersidboards |
| getMyUserDataUrl() | string | Returns `/members/me?fields=all` |
| getMyUserData() | Object | Retrieve details of the current user, as represented by the Trello API key and token. https://developers.trello.com/reference#membersid |
| getBoardUrl(string *boardId*) | string | Returns `/boards/[Board ID]` |
| getBoard(string *boardId*) | Object | Retrieve details of a board. https://developers.trello.com/reference#boardsboardid-1 |
| getBoardActionsUrl(string *boardId*) | string | Returns `/boards/[Board ID]/actions?limit=1000` |
| getBoardActions(string *boardId*) | Object | Returns an object of actions in a designated Trello board. Only the most recent 1,000 actions can be retrieved, as limited by the Trello API. https://developers.trello.com/reference#boardsboardidactions |
| getBoardCardsUrl(string *boardId*, string *option*) | string | Returns `/boards/[Board ID]/cards/[option]`, where *option* can be one of `all`, `closed`, `none`, `open`, or `visible` to designate the type of cards to retrieve by this URL |
| getBoardCards(string *boardId*, string *option*) | Object | Returns an object of cards in a designated Trello board. https://developers.trello.com/reference#boardsboardidtest |
| getBoardChecklistsUrl(string *boardId*) | string | Returns `/boards/[Board ID]/checklists` |
| getBoardChecklists(string *boardId*) | Object | Returns an object of all checklists in a designated Trello board. https://developers.trello.com/reference#boardsboardidactions-3 |
| getBoardListsUrl(string *boardId*) | string | Returns `/boards/[Board ID]/lists` |
| getBoardLists(string *boardId*) | Object | Returns an object of all lists in a designated Trello board. https://developers.trello.com/reference#boardsboardidlists |
| batchGet(Array *urls*) | Array | BATCH: Make multiple GET requests to the Trello API using `get***Url()` functions. KNOWN ISSUE: not compatible with URLs that have commas in their query params. See official document at https://developers.trello.com/reference#batch for workarounds. |
| postCard(Object *queryParams*) | Object | Create Trello card. https://developers.trello.com/reference#cardsid-1 |
| deleteCard(string *cardId*) | Object | Delete card. https://developers.trello.com/reference#delete-card |
| errorMessage(Object *e*) | string | Standarized error message for this script, as used in try-catch |
