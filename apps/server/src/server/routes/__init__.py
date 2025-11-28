from .health import register_health_routes
from .document import register_upload_routes
from .chat import register_chat_routes

__all__ = [
    "register_health_routes",
    "register_upload_routes",
    "register_chat_routes",
]
