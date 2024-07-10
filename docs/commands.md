
## run

```sh
export OPENAI_API_KEY=[OPEN AI API KEY]

# vector store (chrome db)の作成
npx nx run learn-documents:run

# vector store (chrome db)の動作チェック
npx nx run learn-documents:test
```


## add projects

```sh
npx nx generate @nxlv/python:poetry-project learn-documents --directory=apps/learn-documents --projectType=application --unitTestRunner=none

npx nx generate @nxlv/python:poetry-project chat-talk --directory=apps/chat-talk --projectType=application --unitTestRunner=none

```


## learn-documents

```sh
npx nx run learn-documents:add --name llama-index-core
npx nx run learn-documents:add --name llama-index-llms-openai
npx nx run learn-documents:add --name llama-index-embeddings-openai
npx nx run learn-documents:add --name llama-index-readers-file
npx nx run learn-documents:add --name chromadb
npx nx run learn-documents:add --name llama-index-vector-stores-chroma
```


## chat-talk 

```requirements.txt

openai ~= 1.34.0
openpyxl ~= 3.1.3
langchain ~= 0.2.1
llama-index-core ~= 0.10.40
llama-index-llms-openai ~= 0.1.21
llama-index-llms-replicate ~= 0.1.3
llama-index-readers-file ~= 0.1.23
llama-index-embeddings-openai ~= 0.1.10
chromadb ~= 0.5.0
llama-index-vector-stores-chroma ~= 0.1.8
boto3 ~= 1.34.127
tenacity ~= 8.2.3

```