from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from pydantic import SecretStr
from server.config import config
import logging

def create_vector_store(model: str, url: str, collection_name: str, api_key: SecretStr = config.OPENAI_API_KEY) -> QdrantVectorStore:
    # HACK HACK HACK
    # this is done to ensure the embedding dimensions are not None
    # TODO: figure a way to dynamically determine the embedding dimensions
    _EMBEDDINGS_DIMENSIONS = 1536

    try:
        embedding = OpenAIEmbeddings(model=model, api_key=api_key, dimensions=_EMBEDDINGS_DIMENSIONS)
        client = QdrantClient(url=url)

        existing_collections = [c.name for c in client.get_collections().collections]
        if collection_name not in existing_collections:
            logging.info(f"Creating collection '{collection_name}' in Qdrant...")
            logging.info(f"Embedding model: {embedding}")

            if embedding.dimensions is None:
                raise ValueError("Embedding dimensions are not available. Make sure the model supports embeddings.")

            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=embedding.dimensions,
                    distance=Distance.COSINE,
                ),
            )

        return QdrantVectorStore(client=client, collection_name=collection_name, embedding=embedding)
    except Exception as e:
        logging.exception(f"Error creating vector store: {e}")
        raise
