import logging
from pathlib import Path
import shutil
from uuid import uuid4

from fastapi import UploadFile
from server.config import config

async def upload(file: UploadFile) -> Path:
    if not file.filename:
        file.filename = uuid4().hex

    upload_dir = Path(config.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / file.filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            logging.info(f"File {file.filename} uploaded successfully")
            return file_path
    except Exception as e:
        if file_path.exists():
            file_path.unlink(missing_ok=True)
        logging.error(f"Failed to upload file {file.filename}: {e}")
        raise OSError(f"Failed to upload file {file.filename}: {e}")
