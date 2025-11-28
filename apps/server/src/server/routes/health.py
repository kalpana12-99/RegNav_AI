from fastapi import APIRouter

router = APIRouter()

def register_health_routes():
    @router.get("/health")
    async def health_check():
        return {"status": "OK"}

    return router
