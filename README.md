日本語は後述

# Trello Scripts
Google App Scripts to manage Trello using its API and Google Spreadsheet.  

## Content
- code.gs: `[Required]`Primary file with the main codes written. To be used as a spreadsheet-bound script.
- backup.gs: `[Optional]`Script to create a full backup of all available Trello boards including actions and attachments. Requires [additional authentications as mentioned below](https://github.com/ttsukagoshi/Trello_Scripts#additional-oauth-scopes-when-using-trellobackupgs).
- TrelloScriptLibrary.gs: Code for the Google App Script library *Trello Script* used in **code.gs**.

## Scope of Authentications (OAuth required for this script)
- Connect to an external service: https://www.googleapis.com/auth/script.external_request
- See, edit, create, and delete your spreadsheets in Google Drive: https://www.googleapis.com/auth/spreadsheets

### Additional OAuth Scopes when Using backup.gs
- Send email as you: https://www.googleapis.com/auth/script.send_mail
- See, edit, create, and delete all of your Google Drive files: https://www.googleapis.com/auth/drive

## Prepare
1. Create a new Google Spreadsheet (or use an existing Spreadsheet).
1. Copy contents of **code.gs** and **common.gs** into the spreadsheet using the script editor ([Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions) is a good place to start if you don't know what I mean by the script editor) and save the code.
1. From the script editor, go to *File* -> *Project Properties* to set some script properties:  
    - trelloKey: API key for Trello
    - trelloToken: API token for Trello
    - boardId: Trello Board Id that you want to manage using the script   
If you're not sure where to find the API keys and tokens for Trello, see [API Key Security](https://developers.trello.com/docs/api-key-security) at the Trello Developers documentation.
1. Enable TrelloScript Library by entering its project key `M44otJ56pF074bNKTJJ7ktI0YdntMo1yT` on *Resources* -> *Library* -> *Add a Library*. The default identifier `TrelloScript` is used in scripts of **code.gs**.
1. Refresh the Google Spreadsheet; you'll see that a menu *Trello* is added to your menu
1. You'll be asked for [authentications, as mentioned above,](https://github.com/ttsukagoshi/Trello_Scripts#scope-of-authentications-oauth-required-for-this-script) when executing the script for the first time.

## Functions
- `trelloBoards` (Menu Name: *Get My Board*): Returns the list of the names and IDs of all Trello boards available to your account as a pop-up alert. Useful for getting board IDs for other functions.
- `trelloDeleteArchivedCards` (Menu Name: *Delete Archived Cards*): Delete archived cards in a Trello board. Designate board by board ID. **USE WITH CARE; CANNOT BE UNDONE!!**
- `trelloReport` (Menu Name: *Get Board Content*): Creates a new sheet on the spreadsheet and list all cards in a Trello board, including archived ones, on it. Designate board by board ID.
- `trelloShowKeyToken` (Menu Name: *Key & Token*): Shows on an alert window your Trello API key and token registered on your script properties. Useful for making test requests on [Trello Developers website](https://developers.trello.com/). 

## Variables and Methods in *TrelloScript* Library
See TrelloScriptLibrary_documentation.md

## References
- [Trello Developers](https://developers.trello.com/): Official documentation for Trello API

---
GASとGoogleスプレッドシートを使ってTrelloを管理する。  

## 内容
- code.gs: `[必須]`主要なコードが書かれたファイル。スプレッドシートにコンテナバインドされたスクリプトとして使用。
- backup.gs: `[任意]`アクセス可能な全てのTrelloボードをGoogle Driveにバックアップするためのスクリプト。
- TrelloScriptLibrary.gs: **code.gs**で使用するGoogle App Scriptライブラリ「*Trello Script*」のコード

## 認証のスコープ （このスクリプトを実行するのに必要なOAuth）
- Connect to an external service: https://www.googleapis.com/auth/script.external_request
- See, edit, create, and delete your spreadsheets in Google Drive: https://www.googleapis.com/auth/spreadsheets

### backup.gsを使用する際に必要となる追加認証
- Send email as you: https://www.googleapis.com/auth/script.send_mail
- See, edit, create, and delete all of your Google Drive files: https://www.googleapis.com/auth/drive

## 準備
1. このスクリプトを利用するための新しいGoogleスプレッドシートを作成する（既存のスプレッドシートでも可）。
1. **code.gs**および**common.gs**の内容を、スプレッドシートのスクリプトエディタにコピー＆ペーストする。「スクリプトエディタ？？」という状態なら[【初心者向けGAS】本当の最初の一歩！スクリプトエディタでプロジェクトを開く](https://tonari-it.com/gas-script-editor/)などがわかりやすい。
1. スクリプトエディタで、下記スクリプトプロパティを設定する（*ファイル* -> *プロジェクトのプロパティ* -> *スクリプトのプロパティ*）：  
    - trelloKey: TrelloのAPI key
    - trelloToken: TrelloのAPIトークン
    - boardId: このスクリプトで管理したいTrelloボードのID  
TrelloのAPI keyやトークンについての説明は公式ドキュメントの[API Key Security](https://developers.trello.com/docs/api-key-security)参照。
1. *リソース* -> *ライブラリ* -> *Add a Library*に、プロジェクトキー`M44otJ56pF074bNKTJJ7ktI0YdntMo1yT`を入力することで、ライブラリ*Trello Script*を有効にする。最新バージョンを選択。Identifier `TrelloScript` は初期値のままでok。変更するならば、**code.gs**内の記述変更を忘れずに。
1. コードを保存の上、スプレッドシートを更新。メニュー「*Trello*」が追加されていることを確認すれば準備完了。
1. スクリプトの初回実行時には、「認証のスコープ」にあるとおりの許可を行う必要がある。

## 関数
- `trelloBoards` (メニュー名: *Get My Board*): 自分のアカウントからアクセス可能な全てのTrelloボードの名前とIDを、ポップアップメッセージとして表示。他の関数を実行する際に便利。
- `trelloDeleteArchivedCards` (メニュー名: *Delete Archived Cards*): 指定したTrelloボード内の、アーカイブされたカードを削除する。対象はボードIDで指定。**元に戻せないので、実行は要注意！！！**
- `trelloReport` (メニュー名: *Get Board Content*): 新しいシートを作り、そこに指定したTrelloボード内の全てのカードをリスト化する。アーカイブされたカードも含まれる。対象はボードIDで指定。
- `trelloShowKeyToken` (メニュー名: *Key & Token*): ポップアップメッセージとして、スクリプトプロパティに設定されたTrello APIキーとトークンを表示させる。公式ドキュメントTrello Developers内で試験リクエストするときに便利。

## 参考資料
- [Trello Developers](https://developers.trello.com/): Trello APIの公式ガイド
