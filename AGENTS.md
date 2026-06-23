# AGENTS.md — 규칙 포인터 (어기면 CI 실패)

1. **와이어 = snake_case** (DB→API→클라이언트). 변환 레이어 삽입 금지(`data.userId` ✗ / `data.user_id` ✓).
2. **계약 단일 진실원 = `openapi.yaml`** (에러 봉투·enum·ISO8601). TS=생성 타입, Python=Pydantic.
3. **오류는 단일 봉투** `{ error: { code, message, retryable, as_of? } }`. 라우터에서 raw `HTTPException` 금지 → `app.errors.AppError`.
4. **datetime = ISO 8601 UTC 문자열** (`Date`/epoch 직렬화 금지). 모든 시세에 `as_of`.
5. **`import anthropic` 은 `api/app/services/llm/` 안에서만** (단일 LLM chokepoint). 구조화 출력에 `recommendation` 필드 금지.
6. **판단 근거는 단일 `rationale` JSONB** (분리 금지). `service_role` 키는 야간 배치 전용.
7. **타입 생성물 수기 편집 금지**: `web/lib/database.types.ts`(supabase gen types), zod는 Row 타입에 `satisfies`.

> 왜(rationale)는 `_bmad-output/planning-artifacts/architecture.md`, 사람 의도는 project-context.md.
> CI 게이트: `tsc --noEmit → eslint → ruff → pytest → supabase gen types|diff → grep 가드`.
