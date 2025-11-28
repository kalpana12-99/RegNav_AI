from doctest import DocFileSuite
import logging
from pathlib import Path
from typing import Any, ReadOnly
from langchain_qdrant import QdrantVectorStore
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from uuid import uuid4

class DocumentProcessor:
    _CHUNK_SIZE = 1000
    _OVERLAP_SIZE = 200

    def __init__(self, chunk_size: int = _CHUNK_SIZE, overlap_size: int = _OVERLAP_SIZE):
        self.chunk_size = chunk_size
        self.overlap_size = overlap_size
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.overlap_size,
        )

    async def process(self, file_path: Path, vector_store: QdrantVectorStore):
        loader = PyPDFLoader(file_path)
        try:
            docs = loader.load()
        except Exception as e:
            logging.error(f"Failed to load document: {e}")
            raise RuntimeError(f"Failed to load document: {e}") from e

        chunks = self.text_splitter.split_documents(docs)
        point_ids = [str(uuid4()) for _ in chunks]

        try:
            await vector_store.aadd_documents(chunks, ids=point_ids)
        except Exception as e:
            await vector_store.adelete(ids=point_ids)
            raise RuntimeError(f"Failed to process document: {e}") from e

document_processor = DocumentProcessor()
