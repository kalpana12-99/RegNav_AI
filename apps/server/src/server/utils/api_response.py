from pydantic import BaseModel
from typing import Generic, TypeVar, Optional
from http import HTTPStatus

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    status_code: int
    data: Optional[T] = None
    message: str = "Success"
    success: bool

    @classmethod
    def create(cls, status_code: int, data: Optional[T] = None, message: Optional[str] = None):
        return cls(
            status_code=status_code,
            data=data,
            message=message  or "Success",
            success=(status_code < HTTPStatus.BAD_REQUEST)
        )
