from llama_index.core import  VectorStoreIndex, SimpleDirectoryReader
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
import os.path
import chromadb
import sys
print("python version:", sys.version)

data_dir = os.path.join(os.path.dirname(__file__), '../data')
# persist_dir = os.path.join(os.path.dirname(__file__), "./vector_store")
db_path = os.path.join(os.path.dirname(__file__), "../chroma_db")

db = chromadb.PersistentClient(path=db_path)
chroma_collection = db.get_or_create_collection("table_store")


vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

reader = SimpleDirectoryReader(
    input_dir=data_dir
)
documents = reader.load_data()
# index = VectorStoreIndex.from_documents(documents)
index = VectorStoreIndex.from_documents(
    documents, storage_context=storage_context
)

# index.storage_context.persist(persist_dir)

