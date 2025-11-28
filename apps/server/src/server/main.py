import asyncio
import logging
import sys

from server.application import App
from server.config import config
from server.lib import create_vector_store

async def bootstrap():
    try:
        vector_store = create_vector_store(
           model=config.EMBEDDINGS_MODEL,
           url=config.QDRANT_DB_URL,
           collection_name=config.COLLECTION_NAME
        )

        app = App(config.PORT, vector_store)
        await app.start()
    except Exception as e:
        logging.error(f"Error starting the application: {e}")
        sys.exit(1)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
    )
    try:
        asyncio.run(bootstrap())
    except KeyboardInterrupt:
        logging.info("Interrupted by user")
        sys.exit(0)
