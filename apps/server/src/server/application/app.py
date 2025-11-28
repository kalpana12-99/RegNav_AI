import asyncio
import signal
import logging
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from langchain_qdrant import QdrantVectorStore
from uvicorn import Config, Server
from server.routes import register_health_routes, register_upload_routes, register_chat_routes


class App:
    port: int
    app: FastAPI
    logger: logging.Logger
    server: Server
    vector_store: QdrantVectorStore

    def __init__(self, port: int, vector_store: QdrantVectorStore):
        self.port = port
        self.app = FastAPI(title="Server", docs_url="/api/docs")
        self.logger = logging.getLogger("server")
        self.vector_store = vector_store

    def _register_middlewares(self):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        self.app.add_middleware(GZipMiddleware)

    async def _register_routes(self):
        router = APIRouter(prefix="/api/v1")

        router.include_router(register_health_routes())
        router.include_router(register_upload_routes(self.vector_store))
        router.include_router(register_chat_routes(self.vector_store))

        self.app.include_router(router)

    async def start(self):
        """Start the FastAPI server with graceful shutdown."""

        self._register_middlewares()
        await self._register_routes()

        self.logger.info(f"Starting Server on port (self.port)")

        config = Config(app=self.app, host="0.0.0.0", port=self.port, log_level="info")
        self.server = Server(config=config)

        loop = asyncio.get_event_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            loop.add_signal_handler(
                sig, lambda s=sig: asyncio.create_task(self.shutdown(s))
            )

        await self.server.serve()

    async def shutdown(self, sig):
        "Gracefully shutdown the server."
        self.logger.info(f"Received signal {sig.name}. Shutting down the Server...")

        # close all resource here (if any)
        self.vector_store.client.close()

        if self.server:
            await self.server.shutdown()
        self.logger.info("Server shutdown complete.")
        raise SystemExit(0)
