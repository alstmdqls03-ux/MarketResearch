# Market Insight OS

미국 주식 개인 투자자를 위한 **AI 투자판단 디버거** — 매수 전 30초 체크 → 결정 스냅샷 → AI 복기 → 프로세스 품질 거울.

## 모노레포 구조 (2폴더)

| 경로 | 역할 | 배포 |
|------|------|------|
| `web/` | Next.js 16 (App Router·shadcn·Supabase SSR) — UI·Auth·CRUD | Vercel |
| `api/` | FastAPI (uv) — AI·RAG·시장데이터·배치 | Fly.io (Week 3-4 분리) |
| `supabase/` | 스키마·RLS·RPC·pgvector 단일 소유 (Alembic 금지) | Supabase |
| `openapi.yaml` | 서비스 간 계약 단일 진실원 | — |
| `AGENTS.md` | 규칙 포인터(어기면 CI 실패) | — |

## 개발

```bash
# web
cd web && npm run dev          # http://localhost:3000

# api
cd api && uv run fastapi dev   # http://localhost:8000  (GET /health)
```

## CI 게이트 (하나라도 red면 머지 차단)
`tsc --noEmit` → `eslint` → `ruff` → `pytest` → `supabase gen types | diff` → `grep` 가드

기획·아키텍처 문서: `_bmad-output/planning-artifacts/`
