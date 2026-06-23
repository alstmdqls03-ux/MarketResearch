"""단일 에러 봉투 + 단일 exception_handler.

계약(openapi.yaml 정합): ``{ "error": { "code", "message", "retryable", "as_of"? } }``
- 성공 응답은 리소스를 직접 반환(이중 래핑 금지).
- 라우터는 raw ``HTTPException`` 을 던지지 않는다(CI grep 가드). 대신 ``AppError`` 를 raise.
- AI 실패=``retryable=True`` (FR42), 시세 stale=``as_of`` 동봉(FR33).
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppError(Exception):
    """도메인 오류. 단일 exception_handler가 봉투로 직렬화한다."""

    def __init__(
        self,
        code: str,
        message: str,
        *,
        retryable: bool = False,
        as_of: str | None = None,
        status_code: int = 400,
    ) -> None:
        self.code = code
        self.message = message
        self.retryable = retryable
        self.as_of = as_of
        self.status_code = status_code
        super().__init__(message)


def _envelope(err: AppError) -> dict:
    body: dict = {"code": err.code, "message": err.message, "retryable": err.retryable}
    if err.as_of is not None:
        body["as_of"] = err.as_of  # ISO 8601 UTC 문자열
    return {"error": body}


def register_exception_handlers(app: FastAPI) -> None:
    """앱에 단일 예외 핸들러 등록. raw 스택을 절대 노출하지 않는다."""

    @app.exception_handler(AppError)
    async def _handle_app_error(_: Request, exc: AppError) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content=_envelope(exc))

    @app.exception_handler(RequestValidationError)
    async def _handle_validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        # FastAPI 기본 422({detail:[...]})를 단일 봉투로 통일 — 내부 구조는 노출 안 함.
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "validation_error",
                    "message": "요청 형식이 올바르지 않습니다.",
                    "retryable": False,
                }
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def _handle_http_exc(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        # 404/405 등 프레임워크 HTTPException 도 봉투로 통일.
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": "http_error",
                    "message": str(exc.detail),
                    "retryable": False,
                }
            },
        )

    @app.exception_handler(Exception)
    async def _handle_unexpected(_: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_error",
                    "message": "예상치 못한 오류가 발생했습니다.",
                    "retryable": False,
                }
            },
        )
