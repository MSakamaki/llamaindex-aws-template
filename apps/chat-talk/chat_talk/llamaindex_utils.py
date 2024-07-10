import os
import os.path
import boto3
import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext

# s3 = boto3.client('s3')
bucket_name = os.environ['BUCKET_NAME']  
persist_dir = '/tmp/vector_store'
print(f'Bucket name: {bucket_name}')

def download_dir(client, resource, dist, local='/tmp', bucket='your_bucket'):
  paginator = client.get_paginator('list_objects')
  for result in paginator.paginate(Bucket=bucket, Delimiter='/', Prefix=dist):
    if result.get('CommonPrefixes') is not None:
      for subdir in result.get('CommonPrefixes'):
        download_dir(client, resource, subdir.get('Prefix'), local, bucket)
    for file in result.get('Contents', []):
      dest_pathname = os.path.join(local, file.get('Key'))
      if not os.path.exists(os.path.dirname(dest_pathname)):
        os.makedirs(os.path.dirname(dest_pathname))
      if not file.get('Key').endswith('/'):
        resource.meta.client.download_file(bucket, file.get('Key'), dest_pathname)

def llamaindex_initialize():
  client = boto3.client('s3')
  resource = boto3.resource('s3')
  download_dir(client, resource, '', persist_dir, bucket=bucket_name)

def llamaindex_create_index():
  db = chromadb.PersistentClient(path=persist_dir)
  chroma_collection = db.get_or_create_collection("table_store")
  vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
  storage_context = StorageContext.from_defaults(vector_store=vector_store)
  return VectorStoreIndex.from_vector_store(
    vector_store, storage_context=storage_context
  )

def llamaindex_query(prompt: str, index):
    return index.as_query_engine().query(prompt)
