---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-06-21'
inputDocuments:
  - idea.md
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/ux-designs/ux-market-insight-os-2026-06-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-market-insight-os-2026-06-21/EXPERIENCE.md
workflowType: 'architecture'
project_name: 'Market Insight OS'
user_name: 'BMad'
date: '2026-06-21'
---

# Architecture Decision Document — Market Insight OS

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (43개, FR1–43 · 7 범주):** 계정·관심종목(FR1–4,43) / 종목 리서치(FR5–9) / 판단 기록(FR10–18,39) / 복기·판단품질(FR19–26,40–41) / 시장 개요(FR27–31) / 신뢰·안전(FR32–34,42) / 운영·데이터(FR35–38).

아키텍처 함의: 핵심은 **판단 저널 + 스냅샷 + AI 복기 루프**(HERO). 대부분의 FR은 멀티테넌트 CRUD(Next.js)와 AI/RAG/시장데이터(FastAPI)로 깔끔히 양분된다.

**Non-Functional Requirements (아키텍처를 좌우하는 것):**
- **NFR-R1 (원자성):** 결정+스냅샷 단일 트랜잭션, **고아 결정 0** → 1순위 제약.
- **NFR-P3 (비동기 AI):** 리서치 카드·복기는 UI 비차단 + 진행 표시 + 재시도 → 백그라운드 처리 필요.
- **NFR-A1/A2 (AI 가드레일):** 데이터 인용 ≥1, 추천·예측 0 → 생성 파이프라인 검증 게이트.
- **NFR-P1/P2:** 30초 체크 반응 <100ms, 대시보드 <2s(캐시 EOD). **NFR-AC1:** WCAG 2.1 AA.

**Scale & Complexity:**
- Primary domain: **풀스택 웹**(모바일 우선 반응형 + WebView 셸) + **AI/데이터 백엔드**.
- Complexity level: **중(medium)** — 멀티테넌시(RLS)+듀얼 컨텍스트 RAG+비동기 AI+야간 배치가 올리고, 실시간 시세 없음(EOD)+좁은 스코프(MVP 8기능)가 낮춤.
- 추정 아키텍처 컴포넌트: ~7 — Next.js 앱 / FastAPI(AI·데이터) / Supabase(Postgres·Auth·RLS·pgvector) / RAG 인제스트 / 시장데이터 캐시 / 야간 배치 스케줄러 / LLM 비용 추적.

### Technical Constraints & Dependencies

- **서비스 경계(D14, 잠김):** Next.js(UI·Auth·CRUD) ↔ FastAPI(AI·RAG·시장데이터·배치). Python 생태계 분리.
- **스택:** Next.js + Tailwind + shadcn/ui · Supabase(Postgres+Auth+RLS+pgvector) · Claude(Opus 복기 / Haiku 요약).
- **외부 데이터(무료·합법만, 캐시 우선):** yfinance·Finnhub·SEC EDGAR·FRED·News RSS.
- **DB 가드레일(사용자 지시):** 테이블 최소화 + JSONB 우선, 판단 근거+스냅샷 단일 `decisions` 행 JSONB, append-only 버전, 매도→매수 self-reference, 테이블마다 존재 이유 주석.
- **폼팩터:** 단일 반응형 웹앱을 WebView 셸로 래핑(웹 품질=앱 품질).

**확정된 아키텍처 결정(ADR, Advanced Elicitation 도출):**
- **ADR-A · 원자성:** `record_decision(...)` **Postgres RPC**가 EOD 캐시에서 `snapshot_json` 조립 + 근거 JSONB와 함께 **단일 행 INSERT**. 가드레일(JSONB 통째)과 NFR-R1이 상호 강화 — 별도 스냅샷 테이블이 오히려 고아 위험. 크로스 서비스 호출 0.
- **ADR-B · 비동기 경계:** **"큐는 쿼리"** — 별도 jobs 테이블 없이 엔티티 상태 컬럼(`research_cards.status`, `decisions.ai_review_status`)이 큐. 시간경과 복기=야간 배치 SELECT, 매도 복기=fire+상태 폴링, 재시도=엔드포인트 재호출+멱등 가드. **작업 의도는 반드시 DB에 먼저 persist**(인프로세스 유실 방지).
- **ADR-C · JSONB 통째:** 30초 체크 근거 9개 flat 컬럼 → 단일 `rationale jsonb`로 수렴(목표가·손절 포함). 생명주기별 JSONB 분리 유지: `rationale`(결정시)·`snapshot_json`(결정시·원자)·`outcome_json`(매도시)·`ai_review`(복기시). 구조적 키(user·ticker·action·시각·self-ref·version)는 flat — "근거 분리 금지"이지 "전부 한 blob"이 아님.
- **ADR-D · RAG 격리:** 3중 방어 — `documents/doc_chunks` RLS(심층) + FastAPI 벡터 쿼리에 `user_id` 하드 필터(service-role이 RLS 우회하므로 필수) + 공개/개인 검색 물리 분리 후 프롬프트 병합. 단일 무필터 ANN 금지.

### Cross-Cutting Concerns Identified

인증·RLS 격리 / 결정+스냅샷 원자성 / **신뢰 UI**(as-of 신선도·가시적 오류·per-output 면책) / 비동기+재시도 / LLM 비용 추적 / 캐시(EOD·리서치 카드) / 듀얼 컨텍스트 RAG / append-only 버전.

### Assumption Audit (가정 감사)

| # | 가정 | 신뢰도 | 영향 | 비고 |
|---|------|:---:|:---:|------|
| A1 | EOD 데이터로 충분(D7) | 높음 | 높음 | 결정가≠체결가, 결과는 EOD 기준 — as-of로 커버 |
| A2 | 반응형 웹+WebView 셸로 충분 | 중상 | 중 | WebView 내 Supabase 세션 쿠키 처리 주의 |
| A3 | 서버 조립 EOD 스냅샷=사용자가 본 정보(FR22) | 중 | 높음 | ⚠️ 스냅샷이 본 `research_card` 버전 id를 pin해야 공정성 완성 |
| A4 | 야간 배치 신뢰성(FR36) | 중 | 높음 | 실패 시 복기 미발사·점수 정체 → FR37 복구 단일점 |
| A5 | Insight Score=process_flags 집계만(D9) | 높음 | 중 | 견고 |
| A6 | 무료 데이터 소스 안정(yfinance 비공식) | 낮음 | 중 | ⚠️ Finnhub 폴백 + 가시적 degrade 선제 필요 |
| A7 | Claude 비용 관리 가능(Opus=복기만) | 중 | 중 | 캐시+Haiku 양치기 |

**드러난 핵심 함의 5건:** (1) JSONB 가드레일 ↔ NFR-R1 원자성 상호 강화 (2) 비동기 작업 인프로세스 유실 → DB-first persist (3) 스냅샷이 본 리서치 카드 버전 pin → 복기 공정성(FR22) (4) 무료 데이터 소스 폴백/degrade 선제(A6) (5) RAG 격리는 RLS 우회 전제 → 쿼리 레벨 하드 필터.

## Starter Template Evaluation

### Primary Technology Domain
풀스택 웹 + AI/데이터 백엔드. D14 경계로 두 서비스 분리 → 서비스별 스타터 2개(단일 통합 스타터 없음).

### Starter Options Considered

**Frontend (Next.js):**
- ✅ **Supabase Next.js 스타터** (`create-next-app -e with-supabase`) — Next.js 16 App Router + TS + Tailwind + **shadcn/ui(new-york, Tailwind v4·React 19) 초기화** + **`@supabase/ssr` 쿠키 세션** 사전 배선. WebView 세션 난제(A2)·shadcn 요구 즉시 해결.
- 차선: 순정 `create-next-app`(Supabase SSR·shadcn 수동 배선).
- ❌ create-t3-app: NextAuth+Prisma+tRPC가 Supabase Auth+RLS와 충돌.

**Backend (FastAPI):**
- ✅ **uv 관리 FastAPI** (`uv init --app` + `fastapi[standard]`) — FastAPI 팀 공식 권장, Python ≥3.12, `uv.lock` 재현성.
- ❌ tiangolo full-stack-fastapi-template: 자체 React 프론트+SQLModel ORM 번들 → Next.js+Supabase RLS+RPC 설계와 충돌.

### Selected Starters & Initialization Commands

**① Frontend:**
```bash
npx create-next-app@latest -e with-supabase market-insight-web
```
**② Backend:**
```bash
uv init --app market-insight-ai && cd market-insight-ai
uv add "fastapi[standard]" anthropic httpx supabase pgvector asyncpg
uv run fastapi dev
```

**스타터가 내려주는 결정:** TS(웹)/Python 3.12+(AI) · Tailwind v4+shadcn/ui new-york(DESIGN.md 토큰 오버라이드) · Supabase SSR 쿠키 Auth(RLS 멀티테넌시·WebView 세션) · Turbopack(웹)/uv(AI) · App Router·FastAPI 라우터 구조.

### Party Mode 합의 — 운영·배포 결정 (Winston · Amelia · John)

세 에이전트 모두 스타터 선택은 합리적이라 인정. 추가로 다음을 **합의·확정**한다:

- **단계적 분리(Phased Split):** D14 경계는 옳으나 **배포 분리는 Week 1이 아니라 복기 배치가 강제하는 Week 3–4**에 한다. Week 1은 단일 Next.js 배포(Vercel). AI 로직은 **첫날부터 별 모듈/얇은 인터페이스로 격리**해 두어, 타임아웃을 때리는 순간(Week 2 RAG/배치) FastAPI로 이사 비용 최소. *근거:* FR20 시간경과 복기 = 야간 배치(백그라운드) → 장수 프로세스 필연 → 진짜 FastAPI 분리는 복기 루프에서 강제됨.
- **레포 구조:** **모노레포 2폴더(`/web`, `/api`)**. 배포 타깃은 갈라지되(Vercel `/web`, Fly.io `/api`) 이슈·커밋·CI는 한 곳.
- **FastAPI 배포 타깃:** **Fly.io always-on**(Cloud Run min-instances=0의 anthropic import 콜드스타트 2–4s 회피). 배치/RAG 같은 장시간 작업에 서버리스 부적합.
- **인증 신뢰 경계(핵심):** Next.js→FastAPI 호출 시 Next.js가 Supabase access token을 `Authorization: Bearer`로 전달, **FastAPI가 Supabase JWT secret(HS256)으로 로컬 검증**(`jwt.decode(..., audience="authenticated")`, `sub`=user_id; `get_user()` 네트워크 왕복 회피). **`record_decision` RPC는 사용자 토큰 클라이언트로 호출**(RLS 통과). **service_role 키는 야간 배치 전용으로 격리** — 우회하면 멀티테넌시 붕괴.
- **마이그레이션 단일 소유:** 스키마·pgvector DDL은 **Supabase가 소유**(`supabase/migrations/*.sql`, `supabase db push`). **Alembic 금지**(FastAPI가 DDL 소유하면 D14 위반) — FastAPI는 read/write만.
- **원자성 구현:** supabase-js `.rpc('record_decision', …)` = 단일 함수 호출 = 단일 트랜잭션(PL/pgSQL BEGIN/EXCEPTION 자동 롤백). JS측 클라이언트 트랜잭션 시도 금지.
- **비동기 유실 대비(ADR-B 보강):** entity `status='pending'` 영속화 **후** 작업 시작. **pg_cron 복구 잡**: `status='processing' AND updated_at < now()-interval '5min'` → `'pending'` 리셋. status 컬럼이 진실의 원천, BackgroundTasks는 best-effort.
- **Week 1 스파이크(필수):** iOS WKWebView 쿠키 저장소/persistence 동작 검증 — 실패 시 토큰을 WebView 브릿지로 주입하는 폴백.

> **Note:** 두 초기화 명령은 **구현 1번 스토리**. 단, 배포는 위 단계적 분리를 따른다.

**Sources:** [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app) · [Supabase Next.js 스타터](https://github.com/vercel/next.js/blob/canary/examples/with-supabase/README.md) · [shadcn CLI v4](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) · [uv + FastAPI](https://docs.astral.sh/uv/guides/integration/fastapi/)

## Core Architectural Decisions

### Decision Priority Analysis

**Critical (구현 차단):** JSONB 검증 전략 · 임베딩 모델 · 인증 신뢰 경계(확정) · `record_decision` 원자성(확정) · 스케줄러 · 에러 계약.
**Important (아키텍처 형성):** RAG 청킹 · 시장데이터 폴백 · 프론트 상태/데이터 페칭 · LLM 비용 추적.
**Deferred (Post-MVP):** 임베딩 제공자 승급(Voyage/Cohere) · Sentry·고급 관측성 · 정교한 CI 게이트 · KR 시장 · **대화형 챗봇(RAG Q&A)** — `api/routers`에 대화 엔드포인트 가산, 구조 변경 불필요 · **역사적 유사상황 분석**("과거 비슷한 국면에서 주가는 이랬다") — `services/rag`에 시장 히스토리 인제스트 가산; ⚠️ 예측 금지(D13) 가드레일 내 *역사적 사실 제시*로만 엄격 한정, "따라서 오를 것" 류 금지. 두 기능 모두 현재 아키텍처(RAG+FastAPI+Claude+pgvector)가 이미 받쳐줌 → MVP 구조 재설계 없이 Phase 2 가산.

### Data Architecture

- **DB:** Supabase Postgres(스타터 제공). 단일 `decisions` 테이블 · 생명주기 JSONB(`rationale`/`snapshot_json`/`outcome_json`/`ai_review`) · 파생 `process_flags` · append-only 버전(`root_id`,`version`) · 매도→매수 self-ref(`parent_decision_id`). 캐시 테이블(`securities`/`price_snapshots`/`research_cards`/`daily_briefs`). RAG(`documents`/`doc_chunks` + pgvector). 운영 `llm_usage`(append-only).
- **검증 전략:** **Zod**(Next.js 쓰기 경계 = `rationale` JSONB 형태의 단일 진실원, TS 타입 공유) + **Pydantic**(FastAPI 입출력) + **Postgres CHECK**(핵심 불변식: snapshot not null 등). 경계에서 형태 강제 → JSONB 쓰레기 유입 차단.
- **임베딩 모델:** **OpenAI `text-embedding-3-small`(1536차원)** — idea.md `vector(1536)` 일치, 저렴·안정. **제공자 추상화**(인터페이스 뒤에 두어 Voyage 3.5/Cohere embed-v4로 교체 가능). 한국어 일지×영어 SEC 교차언어 품질이 약하면 승급(Deferred).
- **RAG 청킹:** 섹션 인지 ~512–1024토큰 + 메타데이터(`ticker`/`source_type`/`date`). 하이브리드 검색(벡터 + ticker/날짜 필터).
- **마이그레이션:** Supabase 단일 소유(`supabase/migrations/*.sql`, `supabase db push`). Alembic 금지(D14).
- **캐싱:** 외부 호출 전부 캐시 우선. price_snapshots TTL=EOD(1일), research_cards 종목당 캐시.

### Authentication & Security

- Supabase Auth + **RLS(`user_id = auth.uid()`)** 멀티테넌시. SSR 쿠키 세션(스타터).
- **신뢰 경계:** Next.js→FastAPI 호출 시 `Authorization: Bearer <access_token>`, FastAPI가 **JWT secret(HS256) 로컬 검증**(`audience="authenticated"`, `sub`=user_id). `record_decision`은 사용자 토큰 클라이언트로 호출. **service_role=야간 배치 전용 격리**.
- **CORS/시크릿:** FastAPI는 Next.js 오리진만 허용. 배치 트리거 엔드포인트는 **공유 시크릿 헤더**.
- **RAG 격리(ADR-D):** 모든 벡터 쿼리 `WHERE user_id=:uid OR user_id IS NULL` 하드 필터(service-role RLS 우회 전제). 공개/개인 검색 물리 분리.

### API & Communication Patterns

- **REST + D14 경계.** FastAPI(`/research/card`,`/journal/review`,`/brief/daily`,`/rag/ingest`,`/market/*`,`/score/recompute`) · Next.js Route Handlers(`/api/watchlist`,`/api/decisions`,`/api/decisions/:id/close`,`/api/dashboard`).
- **에러 계약(통일 봉투):** `{ error: { code, message, retryable, as_of? } }`. AI 실패=`retryable:true`+가시적 재시도(FR42), 시세 stale=`as_of` 동봉(FR33).
- **비동기("큐는 쿼리"):** 엔티티 상태 컬럼(`research_cards.status`,`decisions.ai_review_status`)=큐. **복기=백그라운드 배치**(FR20 시간경과 야간 + 매도 async fire+상태 폴링). 작업 의도 DB-first persist, BackgroundTasks=best-effort.

### Frontend Architecture

- Next.js 16 App Router + **RSC 우선**. 변이(CRUD)는 **Server Actions/Route Handlers**, 클라이언트 비동기 폴링(복기·생성 상태)은 **TanStack Query(React Query)**.
- shadcn/ui + Tailwind v4 — **DESIGN.md 토큰을 여기 오버라이드**. 상태는 RSC + 최소 클라이언트 상태.

### Infrastructure & Deployment

- **호스팅:** Vercel(web) + **Fly.io always-on**(api, 콜드스타트 회피). 모노레포 2폴더(`/web`,`/api`). **단계적 분리**(Week 1 단일 Next.js → 복기 배치가 강제하는 Week 3–4 FastAPI 분리, AI 로직은 첫날부터 모듈 격리).
- **스케줄러:** **Supabase Cron(pg_cron+pg_net)** → 야간 FastAPI Fly 엔드포인트 POST(공유 시크릿). 무거운 배치(EOD 갱신·due 복기·점수·RAG 인제스트)는 FastAPI 실행. 복구 잡(stuck `processing` 리셋)=순수 SQL.
- **LLM 비용 추적(FR38):** append-only `llm_usage`(model·in/out 토큰·cost·purpose·user). 운영 감사용(판단 근거 아님 → 가드레일 무관, 존재 이유 주석).
- **관측성/CI(솔로 최소):** 구조적 로깅 + Vercel/Fly/Supabase 기본 로그(Sentry=Deferred). CI: Vercel 자동배포(web) · `fly deploy`(api) · `supabase db push`(마이그레이션).

### Decision Impact Analysis

**구현 시퀀스:** ① 두 스타터 초기화(Story 1) → ② Supabase 스키마·RLS·`record_decision` RPC → ③ Auth+Watchlist+시세 캐시(Week 1, 단일 Next.js) → ④ RAG 인제스트+Research Card(Week 2, FastAPI 분리 시작) → ⑤ 30초 체크+스냅샷 원자 저장(Week 3) → ⑥ 복기 배치+Insight Score+Dashboard(Week 4).

**교차 의존성:** `record_decision` RPC ← Zod/Pydantic 스키마 ← snapshot 캐시. 복기 배치 ← 스케줄러 ← status 큐. RAG 격리 ← 임베딩 추상화 + JWT user_id. 에러 봉투 ← as-of 신선도 + 재시도 UI(EXPERIENCE.md 정합).

**Sources:** [임베딩 모델 비교 2026](https://milvus.io/blog/choose-embedding-model-rag-2026.md) · [Supabase Cron](https://supabase.com/docs/guides/cron)

## Implementation Patterns & Consistency Rules

> 제품 방향: **실시간 불필요한 중장기 투자 컨설팅** → EOD 데이터·서버 경유·실시간 구독 미사용 확정. 멀티 AI 에이전트가 스토리를 구현하므로, 규칙은 *문서 약속*이 아니라 *어기면 빌드가 깨지는 강제*로 만든다.

### Naming Patterns
- **와이어 = `snake_case` 통일(끝까지).** DB→API→클라이언트 전 구간 snake_case. **경계 명확화:** snake는 **서버에서 온 데이터 객체에만** 적용, React 핸들러(`onClick`)·로컬 변수·훅은 camelCase 유지(생태계 관습과 공존).
- **DB:** snake_case 복수형 테이블(`decisions`,`watchlist_items`,`price_snapshots`), FK `user_id`, 인덱스 `idx_<table>_<col>`, RPC `verb_noun`(`record_decision`).
- **API:** 소문자 복수 리소스. Next `/api/watchlist`,`/api/decisions/:id/close` · FastAPI `/research/cards`,`/journal/reviews`(파라미터 `{id}`).
- **JSONB 키:** snake_case(`biggest_risk`,`stop_loss`,`as_of`).
- **코드:** TS 컴포넌트 `PascalCase.tsx`/훅 `useXxx`/함수 camelCase · Python 모듈·함수 snake_case/클래스 PascalCase.

### Structure Patterns
- **web(`/web`):** `app/`(라우트·기능별) · `components/ui`(shadcn) · `components/<feature>` · `lib/`(supabase 클라이언트·zod·유틸·생성 타입) · 테스트 co-located `*.test.ts`.
- **api(`/api`):** `app/{main,deps,routers/,services/,internal/}` · `tests/`(pytest).

### Format Patterns
- **에러 봉투(단일):** `{ error: { code, message, retryable, as_of? } }`. 성공은 리소스 직접 반환(이중 래핑 금지).
- **날짜:** 와이어는 **ISO 8601 UTC 문자열**. 모든 시세에 `as_of`.
- **enum(소문자):** `action`:`buy|sell` · `status`:`pending|processing|done|failed` · `emotion`:`평온|FOMO|불안|확신|복수매매|조급`.

### Process Patterns
- **데이터 접근:** **실시간 구독·클라이언트 직접 쿼리 미사용**, 브라우저는 항상 API 경유. (Auth 세션만 클라이언트가 직접 처리 — 스타터 기본.)
- **로딩/비동기:** TanStack Query 키 `[resource, id]`, 상태 컬럼 폴링. **에러:** 가시적(FR33/42), `role="alert"`. **재시도:** 멱등 재호출 + status 가드.
- **로깅:** 구조적 JSON(`level`,`event`,`user_id?`,`request_id`).

### Enforcement Guidelines (규칙 = 실패하는 테스트)

**타입 단일 진실원 = DB → 생성 체인으로 봉인:**
- `supabase gen types typescript` → `lib/database.types.ts`(수기 편집 금지, `// GENERATED`). zod는 손으로 쓰지 말고 Row 타입에 `satisfies`로 묶어 drift 시 `tsc`가 깨지게.
- **OpenAPI 스펙을 서비스 간 계약의 단일 진실원**으로(snake_case·에러 봉투·enum·ISO8601 사양화) → TS는 openapi-typescript 생성, Python은 Pydantic. 규칙 위반 = 타입 에러.

**규칙의 거처(에이전트가 읽는 곳):**
- **AGENTS.md(≤10줄 포인터):** "snake_case on the wire — 스펙은 openapi.yaml, 어기면 빌드 실패" 식 색인 + 강제 위치만.
- **architecture.md:** rationale(왜)만. **project-context.md:** 사람 의도 기록용(에이전트 1차 소스 아님).

**ESLint(공존 설정):**
```js
'@typescript-eslint/naming-convention': ['error',
  { selector: 'property', format: null },                 // wire fields 통과
  { selector: 'variableLike', format: ['camelCase','snake_case'] }]
```

**모든 AI 에이전트 필수:** 와이어 snake_case · 에러는 단일 봉투만 · 시세엔 항상 `as_of` · 판단 근거는 단일 `rationale` JSONB(분리 금지) · service_role은 배치 외 금지 · datetime은 ISO 문자열(`Date`/epoch 금지) · raw 예외 throw 금지(FastAPI 단일 `exception_handler`).

**CI 게이트(하나라도 red면 머지 차단):** `tsc --noEmit` → `eslint` → `pytest` → `supabase gen types | diff`(타입 drift 차단) + `grep` 가드(`raise HTTPException` in routers 금지).

**멀티에이전트 Top-3 위반 & 차단:** ① camelCase 변환 삽입(`data.userId`)→naming-convention+`no-restricted-syntax` ② datetime을 Date/epoch 직렬화→zod `.datetime()`+pytest `isinstance(str)` ③ 에러 봉투 우회→단일 exception_handler+CI grep.

## Project Structure & Boundaries

### Complete Project Directory Structure (모노레포, 2폴더)
```
market-insight-os/
├── README.md
├── AGENTS.md                      # ≤10줄: 규칙 포인터(snake_case 와이어·에러봉투·openapi.yaml·CI)
├── openapi.yaml                   # ★ 서비스 간 계약 단일 진실원(snake_case·에러봉투·enum·ISO8601)
├── .github/workflows/ci.yml       # tsc → eslint → pytest → types-diff → grep 가드
├── supabase/                      # ★ 스키마 단일 소유 (Alembic 금지)
│   ├── migrations/*.sql           #   테이블·RLS·record_decision RPC·pgvector·pg_cron 잡
│   └── config.toml
│
├── web/                           # Next.js 16 → Vercel
│   ├── package.json · next.config.ts · tsconfig.json · components.json(shadcn) · .env.local.example
│   ├── middleware.ts              # Supabase 세션 갱신
│   ├── app/
│   │   ├── (auth)/{login,signup}/
│   │   ├── (app)/{dashboard,watchlist,stocks/[ticker],decisions/[id],score,brief}/
│   │   ├── api/                   # Route Handlers(CRUD): watchlist · decisions · decisions/[id]/close · dashboard
│   │   ├── layout.tsx · globals.css
│   ├── components/{ui(shadcn), research-card, buy-check, sell-check, score-mirror, asof-badge, disclaimer, async-state}/
│   ├── lib/
│   │   ├── supabase/{client,server}.ts
│   │   ├── database.types.ts       # GENERATED (supabase gen types) — 수기 편집 금지
│   │   ├── schemas/*.ts            # zod (Row 타입에 satisfies)
│   │   ├── api/                    # FastAPI 클라이언트 + openapi-typescript 생성 타입
│   │   └── query/                  # TanStack Query 훅·키
│   └── **/*.test.ts               # co-located
│
└── api/                           # FastAPI(uv) → Fly.io (always-on)
    ├── pyproject.toml · uv.lock · Dockerfile · fly.toml · .env.example
    ├── app/
    │   ├── main.py · config.py
    │   ├── deps.py                # JWT 로컬 검증(HS256)·사용자 토큰 Supabase 클라이언트·service_role 격리
    │   ├── errors.py              # 단일 exception_handler → 에러 봉투
    │   ├── routers/{research,reviews,brief,rag,market,score,batch}.py
    │   ├── services/
    │   │   ├── rag/{ingest,chunk,embed,retrieve}.py   # embed=제공자 추상화(OpenAI 3-small)
    │   │   ├── llm/{claude,cost}.py                   # Opus 복기 / Haiku 요약 / llm_usage 기록
    │   │   ├── market/{provider,yfinance,finnhub}.py  # yfinance 1차→finnhub 폴백
    │   │   ├── review/ · score/
    │   ├── internal/batch.py       # 야간: EOD·due 복기·점수·RAG 인제스트
    │   └── schemas/                # Pydantic (openapi.yaml 정합)
    └── tests/                      # pytest
```

### Architectural Boundaries
- **API 경계(D14):** 브라우저→Next.js(Auth·CRUD)→(필요 시)FastAPI(AI·RAG·시장·배치). 브라우저는 DB 직접 접근 안 함(실시간 미사용). FastAPI↔Supabase는 사용자 토큰(RLS) / 배치는 service_role.
- **데이터 경계:** 스키마·RPC·pgvector는 `supabase/migrations`가 단일 소유. 캐시(securities·price_snapshots·research_cards)는 외부 호출 앞단.
- **컴포넌트 경계:** RSC=읽기/렌더, Server Actions·Route Handlers=변이, TanStack Query=비동기 폴링. shadcn `components/ui`는 불변, `components/<feature>`에서 조합(DESIGN.md 토큰).

### Requirements → Structure Mapping (Epic = Week)
- **Epic 1 기반(FR1–3,27,32):** `web/app/(auth)` · `(app)/{dashboard,watchlist}` · `api/routers/market` · `supabase/migrations`(profiles·watchlist·securities·price_snapshots·RLS)
- **Epic 2 리서치+RAG(FR4–9,28–29,43):** `api/routers/{research,brief,rag}` · `services/rag` · `web/components/research-card` · `stocks/[ticker]`
- **Epic 3 저널+스냅샷(FR10–18,39):** `web/components/{buy-check,sell-check}` · `api`(스냅샷 조립) · `record_decision` RPC · `decisions/[id]`
- **Epic 4 복기+점수+대시보드(FR19–26,30,40–41):** `api/routers/{reviews,score,batch}` · `internal/batch` · `web/components/score-mirror` · `score`
- **횡단(FR33–34,42):** `api/errors.py`(봉투) · `web/components/{asof-badge,disclaimer,async-state}` · `services/llm/cost`(FR38)

### Integration Points & Data Flow
- **내부 통신:** Next.js Route Handler ↔ FastAPI(REST, Bearer JWT) · Supabase Cron(pg_cron+pg_net) → FastAPI `routers/batch`(공유 시크릿).
- **외부 통합:** yfinance/Finnhub(시세, 폴백) · SEC EDGAR(공시) · FRED(거시) · News RSS · OpenAI(임베딩) · Anthropic(생성). 전부 캐시·추상화 뒤.
- **데이터 흐름(HERO):** 관심종목 → (FastAPI)리서치 카드[RAG 듀얼 컨텍스트] → (Next.js)30초 체크 → **record_decision RPC**[근거+스냅샷 단일 행 원자] → 야간 배치(due 복기, Opus) → Insight Score 집계 → 대시보드.

### Phase-2 확장 자리 (구조 변경 없이 가산)
- **대화형 챗봇:** `api/routers/chat.py` + `services/rag/retrieve` 재사용.
- **역사적 유사상황 분석:** `services/rag/ingest`에 시장 히스토리 소스 추가 + `routers/research` 확장(예측 금지 가드레일 내 사실 제시).

## Architecture Validation Results

### Coherence Validation ✅
- **결정 호환성:** 스택(Next.js 16/FastAPI/Supabase/Claude) 버전 검증·충돌 없음. D14 경계 ↔ 단계적 분리 ↔ 모노레포 정합. JSONB 가드레일 ↔ NFR-R1 원자성 상호 강화(모순 없음).
- **패턴 일관성:** snake_case 와이어 + 생성 타입 + OpenAPI 단일 진실원이 멀티에이전트 일관성을 CI로 강제.
- **구조 정합:** 디렉터리 트리가 RPC·배치·RAG 격리·신뢰 UI를 수용.

### Requirements Coverage Validation ✅
- **FR1–43 전부 매핑:** 계정·관심종목(1–4,43)·리서치(5–9)·판단기록(10–18,39)·복기·품질(19–26,40–41)·시장개요(27–31)·신뢰·안전(32–34,42)·운영·데이터(35–38).
- **NFR:** R1 원자성(RPC)·P1-3(TanStack+EOD 캐시)·A1/A2(가드레일, 아래 강화)·AC1(EXPERIENCE.md)·U*(UX).

### Implementation Readiness Validation ✅
핵심 결정·패턴·구조·요구사항 매핑 완비. 멀티에이전트 일관성은 생성 타입+CI 게이트로 강제.

### Gap Analysis & 강화 계획 (Advanced Elicitation + Party Mode 도출)

검증을 "통과한 듯 보이나 약한 지점"을 Red Team/Pre-mortem으로 드러내고, **단계 분리**로 해소:

**① NFR-A1/A2 가드레일 (인용 ≥1·추천/예측 0):**
- *놓쳤던 약점:* 인용 개수 ≠ grounding(환각 출처) · 같은 모델 judge 상관 맹점 · 정규식이 패러프레이즈 추천 못 잡음 · 멀티에이전트가 `skip_guardrail`로 침식 · 스트리밍 노출.
- **Week-1(구조적 차단):** ⓐ **구조화 출력 스키마에 `recommendation` 필드 부재**(조언 넣을 슬롯 제거 — 최강 가드) ⓑ **citation은 `chunk_id` 계약**으로(검증 *구조*만, 자동 채점은 미룸) ⓒ **단일 chokepoint `services/llm/generate()`** 소켓 깔기(`anthropic` 직접 import 금지 — 감시가 아니라 구조라 지금) ⓓ AI 출력 **스트리밍 금지**(생성→검증→렌더) ⓔ **유계 재시도(≤2) → 가시적 실패**(FR42), degraded 출력 금지.
- **Phase-2(감시 장치, 유저 생길 때):** 결정론 검증기 `assert_citations_grounded(ctx: frozenset[chunk_id])` + `BANNED_PHRASES` 정규식 + **교차모델 judge(Haiku↔Opus)는 판정이 아니라 감사 로그**(근거 span·신뢰도·모델버전 immutable) + 경계 사례 human escalation 큐 + CI `grep skip_guardrail`/`import anthropic` 가드 + 가드 RED 테스트 + **bull/bear 대칭 강제**(편향=암묵 추천 방지).
- *원칙(Amelia):* 규제 핵심은 **결정론 코드**가 잡고 judge에 위임하지 않는다. *원칙(Mary):* 면책은 방어선 3, 1차는 **출력 구조가 자문을 물리적으로 표현 불가능**하게.

**② 스냅샷 공정성 핀 (FR22) — 신뢰 척추, Week-1 비타협:**
- **`viewed_research_card_id` NOT NULL**(카드 기반 매수 결정의 스냅샷), `record_decision` RPC가 부재 시 거부(DB 제약이 강제). **`research_cards`는 불변/버전**(야간 재생성=새 행) — 핀이 항상 불변 콘텐츠를 가리킴. 복기는 **핀된 스냅샷+카드 버전만** 읽고 *현재* 시장데이터를 절대 안 봄.

**③ 역사분석(Deferred) 활성화 전 필수 규제 체크리스트(Mary):** 과거→미래 추론 연결어 금지 · 표본 편향 명시(생존편향·체리피킹, 반례 포함) · "유사 국면"은 versioned 룰로 고정 · 결과 분포 전체 제시 · 법률 사인오프 + 관할(한국 자본시장법 유사투자자문 vs 단순 정보제공) 명문화. **자체 가드레일 스펙 없이 활성화 금지.**

**④ 운영자 표면(FR37)·WebView 쿠키(A2):** 최소/Week-1 스파이크 — 비차단.

### Architecture Completeness Checklist
**Requirements Analysis:** [x] 컨텍스트 [x] 규모·복잡도 [x] 제약 [x] 횡단관심사
**Architectural Decisions:** [x] 핵심결정+버전 [x] 스택 [x] 통합패턴 [x] 성능
**Implementation Patterns:** [x] 네이밍 [x] 구조 [x] 통신 [x] 프로세스
**Project Structure:** [x] 디렉터리 [x] 경계 [x] 통합점 [x] 요구사항 매핑

### Architecture Readiness Assessment
**Overall Status: READY WITH MINOR GAPS** — 16개 체크리스트 충족, Critical 갭 없음. Important 갭(가드레일·스냅샷 핀)은 위 단계 계획으로 해소되며 Week-1 항목은 구현 첫 스토리에 포함.
**Confidence: high.**
**핵심 강점:** JSONB 원자성 자기강화 · CI 강제 일관성 · 단계적 분리로 솔로 속도 보존 · "필드 삭제+소켓"으로 가드 비용 최소화 · Phase-2(챗봇·역사분석) 구조 변경 없이 확장.
**향후 강화:** 감시 장치(judge·grep·RED) 활성화 · 임베딩 제공자 승급 · 운영자 표면 · KR 시장.

### Implementation Handoff
**AI 에이전트 지침:** 본 문서의 결정·패턴·구조·경계를 정확히 따른다. snake_case 와이어·단일 에러봉투·단일 chokepoint·service_role 배치 전용·판단근거 단일 JSONB를 위반하지 않는다.
**첫 구현 우선순위:** ① 두 스타터 초기화 → ② `supabase/migrations`(스키마·RLS·`record_decision` RPC, **`viewed_research_card_id` NOT NULL** + research_cards 버전) → ③ `services/llm/generate()` chokepoint + 구조화 출력(no recommendation 필드) → ④ Epic 1.
