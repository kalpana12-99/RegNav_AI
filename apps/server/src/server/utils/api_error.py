from typing import Any, List, Optional


class APIError(Exception):
    def __init__(
        self,
        status_code: int,
        message: str = "Something went wrong!",
        errors: Optional[List[Any]] = None,
        stack: Optional[str] = None,
    ):
        super().__init__(message)

        self.status_code = status_code
        self.data = None
        self.success = False
        self.errors = errors or []
        self.stack = stack or self._capture_stack()

    def _capture_stack(self) -> str:
        import traceback
        return "".join(traceback.format_stack(limit=5))
