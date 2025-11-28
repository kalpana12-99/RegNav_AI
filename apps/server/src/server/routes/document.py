from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_qdrant import QdrantVectorStore
from server.controllers import process_document

router = APIRouter()

def register_upload_routes(vector_store: QdrantVectorStore):
    @router.post("/upload")
    async def upload_endpoint(file: UploadFile = File(...)):
        try:
            return await process_document(vector_store=vector_store, file=file)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
