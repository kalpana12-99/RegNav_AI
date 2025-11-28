from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_qdrant import QdrantVectorStore
from server.controllers import chat, ChatBody

router = APIRouter()

def register_chat_routes(vector_store: QdrantVectorStore):
    @router.post("/chat")
    async def chat_endpoint(body: ChatBody):
        try:
            return await chat(body=body, vector_store=vector_store)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return router
