# LlmChatTemplate

## 前提条件

OpenAPI KEY を用いて動作するテンプテートです。

### ローカル環境

- Docker がインストール＆起動している
- aws cli がインストールされている
- sam がインストールされている
- node v20 以降がインストールされている
- python 3.11.5 がインストールされている
- pyenv がインストールされている
- poetry がインストールされている

### AWS 環境

- secretsmanager で OPENAI_API_KEY が管理されていること。(gpt-talk という名前で一旦はシークレットを作成しています)

### 環境構築コマンド

```sh
npm install
npx nx run learn-documents:install
npx nx run chat-talk:install
```

## Procedure manual

1. secretsmanager でシークレットキー「OPENAI_API_KEY」を作成し、`apps/chat-talk/template.yaml`の`gpt-talk`部分を適切に置き換える。
2. sam の stackname は「chat-talk-v1」となっているが、必要に応じて置き換える。
3. デプロイコマンドで cloudformation を展開し、必要な AWS 環境を用意する（aws へ cloudformation の展開を行うを参照）
4. `apps/chat-ui/src/app/env/environment.ts`に cognito の値を設定する。
5. cognito にユーザーを新規登録する（パスワード強制変更になっているので、aws コマンドでスキップさせる）
6. learn-documents アプリで学習させたデータを aws コマンドで s3 へ upload する
7. chart-ui をビルドし、aws コマンドで s3 へ upload する
8. cloudformation を展開された cloudfront の URL へアクセスすると、ログインして質問を行うことができる。

## development

### API

```sh
# APIの動作確認コマンド
npx nx run chat-talk:test
```

### UI

```sh
# awsへcloudformationの展開が行われていること。
# ローカルでUIの開発ができるコマンド
npx nx run chat-ui:serve
```

## vector index store

```sh

export OPENAI_API_KEY=[OPEN AI API KEY]

# vector store (chrome db)の作成
npx nx run learn-documents:run

# vector store (chrome db)の動作チェック
# (apps/learn-documents/learn_documents/test.pyの内容を実行)
npx nx run learn-documents:test

```

## deploy

### aws へ cloudformation の展開を行う

```sh
# cloudfomation環境を展開する(初回はguided付きで、パラメーターを随意最適化してください)
npx nx run chat-talk:deploy_guide

# ２回目以降
npx nx run chat-talk:deploy
```

### 学習データ upload

```sh
# clean up
aws s3 rm s3://chat-talk-v1-store/ --recursive
# upload
aws s3 cp ./apps/learn-documents/chroma_db/ s3://chat-talk-v1-store/ --recursive
```

### frontend upload

```sh

# フロントエンドファイルのビルド
npx nx run chat-ui:build

# パスワード強制変更をawsコマンドでスキップさせるコマンド
aws cognito-idp admin-set-user-password --region ap-northeast-1 --user-pool-id [ユーザープールID] --username [対象ユーザーID] --password [更新後パスワード] --permanent


# フロントエンドファイルupload
aws s3 rm s3://chat-talk-v1-frontend/ --recursive
aws s3 cp ./dist/apps/chat-ui/ s3://chat-talk-v1-frontend/ --recursive

# cloudfrontのキャッシュクリア
aws cloudfront create-invalidation --distribution-id [cloudfrontのid] --paths "/*"
```
