日本語は準備中

# Properties and Methods in *TrelloScript* Library
See TrelloScriptLibrary.gs for actual code.  
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
| getMyBoards(boolean *simple*) | object | https://developers.trello.com/reference#membersidboards |
| getBoardUrl(string *boardId*) | string | Returns `/boards/[Board ID]` |
| getBoard(string *boardId*) | object | https://developers.trello.com/reference#boardsboardid-1 |
