"""부트스트랩 헬스체크 테스트 — CI pytest 게이트의 통과 대상."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_unexpected_error_is_enveloped() -> None:
    """단일 exception_handler가 예상 밖 예외도 봉투로 감싸는지(스택 노출 금지)."""

    @app.get("/_boom")
    async def _boom() -> None:
        raise RuntimeError("boom")

    # raise_server_exceptions=False → 핸들러가 잡은 500 응답을 그대로 관찰
    local_client = TestClient(app, raise_server_exceptions=False)
    resp = local_client.get("/_boom")
    assert resp.status_code == 500
    body = resp.json()
    assert set(body["error"]) >= {"code", "message", "retryable"}
    assert body["error"]["code"] == "internal_error"
