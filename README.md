日本語は準備中

# Trello Scripts
Google App Scripts to manage Trello using its API and Google Spreadsheet
The current codes are mainly those for GET requests.

## Content
- code.gs: primary file with the main codes written
- common.gs: some common functions that can be used elsewhere (but not to often as to list it in a library)

## How to Use
### 1. Prepare
1. Create a new Google Spreadsheet (or use an existing Spreadsheet).
1. Copy contents of code.gs and common.gs into the spreadsheet using the script editor ([Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions) is a good place to start if you don't know what I mean by the script editor) and save the code.
1. From the script editor, go to *File* -> *Project Properties* to set some script properties:  
- trelloKey: API key for Trello
- trelloToken: API token for Trello
- userName: Username for your Trello account
- boardId: Trello Board Id that you want to manage using the script   
If you're not sure where to find the API keys and tokens for Trello, see [API Key Security](https://developers.trello.com/docs/api-key-security) at the Trello Developers documentation.
1. Refresh the Google Spreadsheet; you'll see that a menu *Trello* is added to your menu
1. Enjoy!

## References
- [Trello Developers](https://developers.trello.com/): Official documentation for Trello API

---
GASとGoogleスプレッドシートを使ってTrelloを管理する
現在のところ、主にGETの用途を想定。

## 内容
- code.gs: 主要なコードが書かれたファイル
- common.gs: 他のスクリプトでも使えそうな、一般的な関数を入れたファイル

## 使い方
### 準備

## 参考資料
- [Trello Developers](https://developers.trello.com/): Trello APIの公式ガイド
