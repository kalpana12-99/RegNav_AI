from fastapi import UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from langchain_qdrant import QdrantVectorStore
from tenacity import retry, stop_after_attempt, wait_exponential
from typing import Optional
from pathlib import Path

from server.lib import upload
from server.services import document_processor
from server.utils import APIError, APIResponse

NUMBER_OF_RETRIES = 5
RETRY_DELAY_FACTOR = 1.5

async def process_document(
    vector_store: QdrantVectorStore,
    file: UploadFile = File(...),
):
    file_path: Optional[Path] = None

    try:
        file_path = await upload(file)

        @retry(
            stop=stop_after_attempt(NUMBER_OF_RETRIES),
            wait=wait_exponential(multiplier=RETRY_DELAY_FACTOR),
        )
        async def process_with_retry():
            await document_processor.process(file_path, vector_store)

        await process_with_retry()

        return JSONResponse(
            status_code=200,
            content=APIResponse.create(200, "Embeddings successfully created.").model_dump(),
        )

    except APIError as e:
        raise HTTPException(status_code=e.status_code, detail=e)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if file_path and file_path.exists():
            file_path.unlink(missing_ok=True)
