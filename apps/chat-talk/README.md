# chat-talk

## nx commands


```sh
npx nx run chat-talk:deploy

npx nx run chat-talk:deploy -- --guided
```

## sam commands


```sh
# 初回は以下でリソースを作る
sam deploy --guided
```

その後、アプリケーションルートで以下のコマンドをつかい、vector storeをアップロードする

```sh
# ベークターデータアップロード
aws s3 cp ./apps/learn-xlsx/learn_xlsx/chroma_db/ s3://graat-rag-talk-store/ --recursive

```


## call api

```sh

curl -X POST -H "Content-Type: application/json" -d '{"token" : "gpt-talk-61a694fb-14af-463e-b96b-21508ec46e8f" , "question" : "エＡＴＭマスターテーブルのKEYに○がついている項目名を教えてください。"}' https://elk7vnye2nyrpunk2f3yule7he0gkpgx.lambda-url.ap-northeast-1.on.aws/


```