"""Market Insight OS — FastAPI 진입점 (부트스트랩 골격).

Story 1.1: /health 만 노출. 실제 라우터(research/reviews/brief/...)·JWT 검증은
후속 스토리(3.1a~)에서 등록한다. AI 로직은 첫날부터 모듈로 격리해 두되,
Fly.io 배포 분리는 복기 배치가 강제하는 Week 3-4까지 미룬다(단계적 분리).
"""

from __future__ import annotations

from fastapi import FastAPI

from app.errors import register_exception_handlers

app = FastAPI(title="Market Insight OS API")

# 단일 exception_handler 등록 — 라우터는 raw HTTPException을 던지지 않는다(grep 가드).
register_exception_handlers(app)


@app.get("/health")
async def health() -> dict[str, str]:
    """헬스체크. CI pytest 게이트의 통과 대상이자 배포 readiness 신호."""
    return {"status": "ok"}
