import chromadb
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.core import StorageContext
import os.path

db_path = os.path.join(os.path.dirname(__file__), "../chroma_db")

db = chromadb.PersistentClient(path=db_path)
chroma_collection = db.get_or_create_collection("table_store")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# load your index from stored vectors
index = VectorStoreIndex.from_vector_store(
    vector_store, storage_context=storage_context
)

question = "納豆の生産量が日本一なのはどこですか？"
query_engine = index.as_query_engine()
response = query_engine.query(question)
print("Question :", question)
print("Answer   :", response)
