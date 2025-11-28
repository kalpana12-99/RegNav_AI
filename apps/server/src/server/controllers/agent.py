from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_qdrant import QdrantVectorStore
from server.services import regulatory_agent
from server.utils import APIResponse

router = APIRouter()


class ChatBody(BaseModel):
    query: str

async def chat(body: ChatBody, vector_store: QdrantVectorStore):
    if not body.query:
        raise HTTPException(status_code=400, detail="Missing query parameter")

    try:
        response = await regulatory_agent.invoke(body.query, vector_store)
        return APIResponse.create(status_code=200, data=response).model_dump()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing query: {str(e)}"
        )
