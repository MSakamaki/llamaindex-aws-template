# LlmChatTemplate


## 前提条件

### ローカル環境

- Dockerがインストール＆起動している
- aws cliがインストールされている
- samがインストールされている
- node v20以降がインストールされている
- pyenvがインストールされている
- poetryがインストールされている

### AWS環境

- secretsmanagerでOPENAI_API_KEYが管理されていること。(gpt-talkという名前で一旦はシークレットを作成しています)


## deploy

### 初回

```sh
# cloudfomation環境を展開する(初回はguided付きで、パラメーターを随意最適化してください)
npx nx run chat-talk:deploy_guide
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
# フロントエンドファイルupload
aws s3 rm s3://chat-talk-v1-frontend/ --recursive
aws s3 cp ./dist/apps/[アプリ名]/ s3://chat-talk-v1-frontend/ --recursive

# キャッシュクリア
aws cloudfront create-invalidation --distribution-id [cloudfrontのid] --paths "/*"
```


