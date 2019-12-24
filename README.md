日本語は後述

# Trello Scripts
Google App Scripts to manage Trello using its API and Google Spreadsheet.  

## Content
- code.gs: Primary file with the main codes written. To be used as a spreadsheet-bound script.
- common.gs: Some common functions that can be used elsewhere (but not to often as to list it in a library)
- TrelloScriptLibrary.gs: Code for the library that code.gs uses.

## Scope of Authentications
- scope ...

## Prepare
1. Create a new Google Spreadsheet (or use an existing Spreadsheet).
1. Copy contents of **code.gs** and **common.gs** into the spreadsheet using the script editor ([Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions) is a good place to start if you don't know what I mean by the script editor) and save the code.
1. From the script editor, go to *File* -> *Project Properties* to set some script properties:  
    - trelloKey: API key for Trello
    - trelloToken: API token for Trello
    - userName: Username for your Trello account
    - boardId: Trello Board Id that you want to manage using the script   
If you're not sure where to find the API keys and tokens for Trello, see [API Key Security](https://developers.trello.com/docs/api-key-security) at the Trello Developers documentation.
1. Enable TrelloScript Library by entering its project key `M44otJ56pF074bNKTJJ7ktI0YdntMo1yT` on *Resources* -> *Library* -> *Add a Library*. The default identifier `TrelloScript` is used in scripts of code.gs.
1. Refresh the Google Spreadsheet; you'll see that a menu *Trello* is added to your menu

## Functions
- deleteArchivedCards (Menu Name: *Delete Archived Cards*): Delete archived cards in a Trello board. Designate board by board ID. **USE WITH CARE; CANNOT BE UNDONE!!**
- showKeyToken (Menu Name: *Key & Token*): Shows on an alert window your Trello API key and token registered on your script properties. Useful for making test requests on [Trello Developers website](https://developers.trello.com/). 
- trelloBoards (Menu Name: *Get My Board*): Returns the list of the names and IDs of all Trello boards available to your account as a pop-up alert. Useful for getting board IDs for other functions.
- trelloReport (Menu Name: *Get Board Content*): Creates a new sheet on the spreadsheet and list all cards in a Trello board, including archived ones, on it. Designate board by board ID.

## Variables and Methods in *TrelloScript* Library
See TrelloScriptLibrary_documentation.md

## References
- [Trello Developers](https://developers.trello.com/): Official documentation for Trello API

---
GASとGoogleスプレッドシートを使ってTrelloを管理する。  
スプレッドシートにコンテナバインドされたスクリプトとして使用。

## 内容
- code.gs: 主要なコードが書かれたファイル
- common.gs: 他のスクリプトでも使えそうな、一般的な関数を入れたファイル

## 準備
1. このスクリプトを利用するための新しいGoogleスプレッドシートを作成する（既存のスプレッドシートでも可）。
1. **code.gs**および**common.gs**の内容を、スプレッドシートのスクリプトエディタにコピー＆ペーストする。「スクリプトエディタ？？」という状態なら[【初心者向けGAS】本当の最初の一歩！スクリプトエディタでプロジェクトを開く](https://tonari-it.com/gas-script-editor/)などがわかりやすい。
1. スクリプトエディタで、下記スクリプトプロパティを設定する（*ファイル* -> *プロジェクトのプロパティ* -> *スクリプトのプロパティ*）：  
    - trelloKey: TrelloのAPI key
    - trelloToken: TrelloのAPIトークン
    - userName: Trelloアカウントのユーザ名
    - boardId: このスクリプトで管理したいTrelloボードのID  
TrelloのAPI keyやトークンについての説明は公式ドキュメントの[API Key Security](https://developers.trello.com/docs/api-key-security)参照。
1. コードを保存の上、スプレッドシートを更新。メニュー「*Trello*」が追加されていることを確認すれば準備完了。

## 関数
- deleteArchivedCards (メニュー名: *Delete Archived Cards*): 指定したTrelloボード内の、アーカイブされたカードを削除する。対象はボードIDで指定。**元に戻せないので、実行は要注意！！！**
- showKeyToken (メニュー名: *Key & Token*): ポップアップメッセージとして、スクリプトプロパティに設定されたTrello APIキーとトークンを表示させる。公式ドキュメントTrello Developers内で試験リクエストするときに便利。
- trelloBoards (メニュー名: *Get My Board*): 自分のアカウントからアクセス可能な全てのTrelloボードの名前とIDを、ポップアップメッセージとして表示。他の関数を実行する際に便利。
- trelloReport (メニュー名: *Get Board Content*): 新しいシートを作り、そこに指定したTrelloボード内の全てのカードをリスト化する。アーカイブされたカードも含まれる。対象はボードIDで指定。

## 参考資料
- [Trello Developers](https://developers.trello.com/): Trello APIの公式ガイド
