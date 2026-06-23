# Story 1.1: 모노레포 스타터 부트스트랩 + CI 게이트

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 투자자 도구 개발자,
I want 두 서비스 모노레포(`/web` Next.js + `/api` FastAPI)를 스타터로 초기화하고 CI 게이트·배포를 배선하고 싶다,
so that 이후 모든 에픽이 일관된 기반 위에서 안전하게(빌드가 깨지면 머지 차단) 기능을 쌓을 수 있다.

## Acceptance Criteria

> 출처: [epics.md#Story 1.1] (AR1, AR5, AR9). 이 스토리는 **골격 + 강제장치 + 배포**만 책임진다. 스키마·인증·비즈니스 로직은 후속 스토리(1.2, 1.3)의 몫이다 — 아래 "범위 밖(Out of Scope)" 참조.

**AC1 — 모노레포 2폴더 부트스트랩**
**Given** 빈 저장소에서
**When** `npx create-next-app@latest -e with-supabase`로 `/web`를, `uv init --app`로 `/api` 골격을 초기화하면 (AR1, AR9)
**Then** 모노레포 2폴더(`/web`, `/api`)가 서고, `/web`에 shadcn/ui(new-york)·Tailwind v4·`@supabase/ssr` 쿠키 세션이 사전 배선된다
**And** `/api`는 `uv add "fastapi[standard]" anthropic httpx supabase pgvector asyncpg`가 적용되고 `uv run fastapi dev`로 로컬 기동되며 `GET /health` 가 `{"status":"ok"}`를 반환한다

**AC2 — CI 파이프라인(머지 차단 게이트)**
**Given** GitHub 저장소와 `.github/workflows/ci.yml`이 있는 상태에서
**When** PR이 열리면 CI가 `tsc --noEmit` → `eslint` → `pytest` → `supabase gen types | diff` 순으로 실행되고, 추가로 `grep` 가드(`api/app/routers/`에 `raise HTTPException` 금지, `services/llm/` 밖 `import anthropic` 금지)가 돈다 (AR5)
**Then** 하나라도 실패하면 PR 머지가 차단된다(GitHub branch protection: required status checks)
**And** 골격 상태에서 모든 게이트가 **green**으로 통과한다(각 게이트에 최소 1개의 통과 대상 존재 — 플레이스홀더 테스트 포함)

**AC3 — ESLint 공존 네이밍 규칙(snake_case 와이어)**
**Given** `/web`의 ESLint 설정에서
**When** 와이어(서버 데이터) 객체는 snake_case 프로퍼티를 허용하되 React 핸들러·로컬 변수·훅은 camelCase를 유지하도록 `@typescript-eslint/naming-convention`을 설정하면 (AR5, architecture.md#Enforcement)
**Then** `data.user_id`는 통과하고 `const userId = ...` 같은 로컬 변수도 통과하며, 와이어 객체에 camelCase 변환을 삽입한 코드(`data.userId`)는 lint 에러로 차단된다

**AC4 — 계약 단일 진실원 골격 + AGENTS.md**
**Given** 모노레포 루트에서
**When** `openapi.yaml`(서비스 간 계약 단일 진실원, snake_case·에러 봉투·enum·ISO8601 사양 포함) 스켈레톤과 `AGENTS.md`(≤10줄 규칙 포인터)를 둔다 (architecture.md#규칙의 거처)
**Then** 두 파일이 루트에 존재하고, `AGENTS.md`는 "snake_case on the wire · 단일 에러 봉투 · datetime은 ISO8601 문자열 · service_role은 배치 전용 · 판단근거는 단일 rationale JSONB · 스펙은 openapi.yaml · 어기면 CI 실패"를 가리킨다

**AC5 — /web Vercel 배포(단계적 분리: Week 1)**
**Given** `/web`가 부트스트랩된 상태에서
**When** Vercel에 모노레포 `/web` 루트를 연결해 배포하면 (AR9)
**Then** `/web`가 공개 URL로 접속된다(스타터 기본 랜딩/Supabase 연결 확인 페이지)
**And** `/api`(FastAPI)는 **이 스토리에서 배포하지 않는다** — 골격만 로컬 기동(Fly.io 분리는 복기 배치가 강제하는 Week 3–4, Story 3.1a). 단계적 분리 원칙 준수.

## Tasks / Subtasks

- [ ] **Task 0 — VCS 초기화 (AC2 선결)**
  - [ ] 프로젝트 루트가 git 저장소가 아니므로 `git init` (⚠️ 현재 `is git repo: false`)
  - [ ] GitHub 원격 저장소 생성 후 연결(`gh repo create` 또는 수동), 초기 커밋·푸시
  - [ ] `.gitignore`에 `node_modules/`, `.next/`, `.venv/`, `__pycache__/`, `.env*`(예시 제외), `.vercel/` 포함
- [ ] **Task 1 — `/web` 부트스트랩 (AC1)**
  - [ ] `npx create-next-app@latest -e with-supabase web` (모노레포 폴더명 `web`)
  - [ ] 기동 확인 `cd web && npm run dev` → 스타터 랜딩 렌더
  - [ ] shadcn/ui·Tailwind v4·`@supabase/ssr` 사전 배선 확인(스타터 기본). DESIGN.md 토큰 오버라이드는 **이 스토리 범위 밖**(1.8 앱 셸)
  - [ ] `.env.local.example` 유지, 실제 `.env.local`은 git 제외
- [ ] **Task 2 — `/api` 부트스트랩 (AC1)**
  - [ ] `uv init --app api && cd api`
  - [ ] `uv add "fastapi[standard]" anthropic httpx supabase pgvector asyncpg`
  - [ ] `uv add --dev pytest pytest-asyncio ruff`
  - [ ] `app/main.py`에 `GET /health` → `{"status":"ok"}` 1개 엔드포인트만
  - [ ] `app/` 디렉터리 골격 stub: `routers/`, `services/`, `internal/`, `deps.py`, `errors.py`(빈 단일 exception_handler 골격), `config.py` — 내용은 비워두되 폴더·파일은 생성(후속 스토리가 채움)
  - [ ] `uv run fastapi dev` 로컬 기동 + `curl localhost:8000/health` 확인
  - [ ] `uv.lock` 커밋
- [ ] **Task 3 — CI 파이프라인 (AC2)**
  - [ ] `.github/workflows/ci.yml` 작성: job 순서 `tsc --noEmit`(web) → `eslint`(web) → `pytest`(api) → `supabase gen types | diff`(types drift) → `grep` 가드
  - [ ] `api`에 플레이스홀더 테스트 `tests/test_health.py`(`/health` 200) — pytest 게이트가 green이 되도록
  - [ ] `grep` 가드 스텝: `! grep -rn "raise HTTPException" api/app/routers/` 및 `! grep -rn "import anthropic" api/app --include=*.py | grep -v "services/llm/"`
  - [ ] `supabase gen types | diff` 게이트: 이 스토리에선 supabase 스키마가 비어있을 수 있으므로, `web/lib/database.types.ts`를 현재 생성 결과로 커밋해 두고 diff가 0이 되게(1.3에서 실제 스키마 동결 시 갱신)
  - [ ] 로컬에서 각 명령을 한 번씩 돌려 green 확인 후 push
- [ ] **Task 4 — ESLint 공존 네이밍 규칙 (AC3)**
  - [ ] `web` ESLint flat config에 `@typescript-eslint/naming-convention` 규칙 추가(아래 Dev Notes 코드 블록 그대로)
  - [ ] 양성/음성 샘플로 검증: `data.user_id`(통과), `const userId`(통과), 와이어 객체 `data.userId` 접근(에러) — 검증 후 샘플 제거
- [ ] **Task 5 — 계약 골격 + AGENTS.md (AC4)**
  - [ ] 루트 `openapi.yaml` 스켈레톤: `openapi: 3.1.0`, `info`, 빈 `paths: {}`, `components.schemas`에 공통 `Error` 봉투(`error: {code, message, retryable, as_of?}`)와 공통 enum(`action: [buy, sell]`, `status: [pending, processing, done, failed]`) 정의
  - [ ] 루트 `AGENTS.md`(≤10줄) — 규칙 포인터(AC4 본문 항목)
- [ ] **Task 6 — Vercel 배포 (AC5)**
  - [ ] Vercel 프로젝트 생성, Root Directory = `web` 설정
  - [ ] Supabase 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) Vercel에 등록 — 실제 Supabase 프로젝트가 없으면 빈/임시 프로젝트로 연결(인증 동작은 1.2)
  - [ ] 배포 후 공개 URL 접속 확인
  - [ ] `/api` Fly.io 배포는 **하지 않음**(단계적 분리)

## Dev Notes

### 이 스토리의 본질
이것은 **기초공사 + 강제장치**다. "코드를 많이 짜는" 스토리가 아니라, **이후 27개 스토리가 의존할 구조와 CI 게이트를 정확히 세우는** 스토리다. 게이트가 느슨하면 멀티 에이전트가 규칙(snake_case 와이어 등)을 조용히 깨고, 그 비용이 후반에 폭발한다. AC2/AC3/AC4가 이 스토리의 진짜 가치다.

### 초기화 명령 (architecture.md#Selected Starters, 검증된 명령)
```bash
# Frontend
npx create-next-app@latest -e with-supabase web

# Backend
uv init --app api && cd api
uv add "fastapi[standard]" anthropic httpx supabase pgvector asyncpg
uv add --dev pytest pytest-asyncio ruff
uv run fastapi dev
```
스타터가 내려주는 결정(수용, 재결정 금지): TS(web)/Python 3.12+(api) · Tailwind v4 + shadcn/ui new-york · Supabase SSR 쿠키 Auth · Turbopack(web)/uv(api) · App Router·FastAPI 라우터 구조. [Source: architecture.md#Starter Template Evaluation]

### ESLint 공존 네이밍 규칙 (AC3 — 그대로 사용)
```js
// web ESLint config
'@typescript-eslint/naming-convention': ['error',
  { selector: 'property', format: null },                 // 와이어 필드(snake_case) 통과
  { selector: 'variableLike', format: ['camelCase', 'snake_case'] }]
```
**핵심:** snake_case는 *서버에서 온 데이터 객체에만* 적용한다. React 핸들러(`onClick`)·로컬 변수·훅(`useXxx`)은 camelCase 유지. 이 규칙이 멀티에이전트 Top-3 위반 중 ①(camelCase 변환 삽입 `data.userId`)을 lint에서 차단한다. [Source: architecture.md#Naming Patterns, #Enforcement Guidelines]

### CI 게이트 (AC2 — 어기면 머지 차단)
순서: `tsc --noEmit` → `eslint` → `pytest` → `supabase gen types | diff` → `grep` 가드.
- **types drift 차단:** `web/lib/database.types.ts`는 `supabase gen types typescript`의 **생성물**(`// GENERATED`, 수기 편집 금지). CI가 재생성 결과와 diff해서 0이 아니면 fail. zod 스키마는 손으로 쓰지 말고 Row 타입에 `satisfies`로 묶어 drift 시 `tsc`가 깨지게.
- **grep 가드:** `routers/`에서 `raise HTTPException` 금지(단일 `exception_handler`로만), `services/llm/` 밖에서 `import anthropic` 금지(단일 chokepoint 강제). 이 두 규칙은 1.x에선 대상 코드가 거의 없지만, **게이트를 지금 깔아두는 것**이 이 스토리의 임무다.
[Source: architecture.md#Enforcement Guidelines, #CI 게이트]

### Python 린트(Ruff)
2026 표준은 `uv` + **Ruff**(flake8/black/isort 대체) + pytest. architecture는 "eslint→pytest"만 명시했으나, `/api` 품질 게이트로 `uv run ruff check`를 CI pytest 앞에 추가하면 web의 eslint와 대칭이 된다. [Source: web research 2026 — Astral 툴체인]

### 단계적 분리 (왜 /api를 지금 배포 안 하나)
D14 서비스 경계는 옳으나 **배포 분리는 복기 야간 배치가 강제하는 Week 3–4(Story 3.1a)**에 한다. Week 1은 단일 Next.js(Vercel) 배포. `/api` 골격은 첫날부터 **모듈로 격리**해 세워두되 Fly.io 이주는 미룬다 — 그래야 타임아웃을 때리는 순간 이주 비용이 최소다. [Source: architecture.md#Party Mode 합의, AR9]

### 계약 단일 진실원 (AC4)
`openapi.yaml`이 서비스 간 계약의 단일 진실원. 지금은 `paths: {}` + 공통 `Error` 봉투 + enum만 정의한 스켈레톤이면 충분. 실제 엔드포인트는 각 스토리가 추가. `AGENTS.md`는 에이전트가 **1차로 읽는** ≤10줄 포인터(rationale은 architecture.md, 사람 의도는 project-context.md). [Source: architecture.md#규칙의 거처]

### 에러 봉투·날짜·enum 사양 (openapi.yaml에 박을 값)
- 에러 봉투(단일): `{ error: { code, message, retryable, as_of? } }`. 성공은 리소스 직접 반환(이중 래핑 금지).
- 날짜: 와이어는 **ISO 8601 UTC 문자열**(`Date`/epoch 금지). 모든 시세에 `as_of`.
- enum(소문자): `action: buy|sell` · `status: pending|processing|done|failed` · `emotion: 평온|FOMO|불안|확신|복수매매|조급`.
[Source: architecture.md#Format Patterns]

### 범위 밖 (Out of Scope — 후속 스토리가 한다)
- **인증 UI/세션 동작** → Story 1.2 (가입·로그인 SSR 쿠키)
- **DB 스키마·RLS·`record_decision` RPC·pgvector** → Story 1.3 (스키마 일괄 동결). 이 스토리에선 `supabase init`로 폴더만 만들어도 되고, 빈 마이그레이션이어도 된다.
- **DESIGN.md 디자인 토큰·탭바·반응형 레이아웃** → Story 1.8 (앱 셸)
- **`services/llm/generate()` chokepoint 실제 구현** → Story 3.1b (지금은 폴더/파일 stub만)
- **FastAPI JWT 로컬 검증·Fly.io 배포** → Story 3.1a

### Project Structure Notes
목표 디렉터리(이 스토리에서 *서야 하는* 골격만; 내용은 후속 스토리가 채움):
```
market-insight-os/
├── AGENTS.md          ← 이 스토리 (AC4)
├── openapi.yaml       ← 이 스토리 (AC4)
├── .github/workflows/ci.yml  ← 이 스토리 (AC2)
├── supabase/          ← supabase init (폴더만; 스키마는 1.3)
├── web/               ← 이 스토리 (AC1) → Vercel (AC5)
│   ├── lib/database.types.ts  # GENERATED
│   └── (eslint naming-convention 설정)  ← AC3
└── api/               ← 이 스토리 (AC1, 로컬 기동만)
    └── app/{main.py(/health), config.py, deps.py, errors.py, routers/, services/, internal/}
```
폴더명은 `web`/`api`(architecture 트리와 일치). 모노레포 루트 = git 루트 = CI·openapi·AGENTS의 거처. [Source: architecture.md#Project Structure & Boundaries]

### References
- [Source: epics.md#Story 1.1] — AC 원본(AR1, AR5, AR9)
- [Source: architecture.md#Starter Template Evaluation] — 초기화 명령·스타터 결정
- [Source: architecture.md#Party Mode 합의 — 운영·배포 결정] — 단계적 분리, Vercel/Fly.io
- [Source: architecture.md#Implementation Patterns & Consistency Rules] — 네이밍·구조·포맷·강제장치
- [Source: architecture.md#Enforcement Guidelines] — CI 게이트·ESLint·grep 가드·타입 생성 체인
- [Source: architecture.md#Project Structure & Boundaries] — 디렉터리 트리
- [Source: epics.md#Additional Requirements] — AR1, AR5, AR9 정의
- 웹 리서치(2026): `create-next-app -e with-supabase`(Next 16/Tailwind v4/shadcn 확인) · uv+Ruff+pytest 표준

## Latest Tech Information (web research, 2026-06)
- **`create-next-app -e with-supabase`**: Next.js 16(App Router) + TS + Tailwind v4 + shadcn/ui + `@supabase/ssr` 쿠키 세션 사전 배선 — architecture가 기대한 구성 그대로 유효. ([Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs), [Vercel template](https://vercel.com/templates/next.js/supabase))
- **uv + FastAPI(2026 표준)**: `uv init`(pyproject + lock) → `uv add "fastapi[standard]"` → dev로 `pytest`/`ruff`. `uv.lock`은 반드시 커밋(재현성). Ruff가 flake8/black/isort 대체. ([uv + FastAPI](https://docs.astral.sh/uv/guides/integration/fastapi/))
- ⚠️ init 시점에 메이저 버전이 올라갔을 수 있으니 dev는 `npx create-next-app@latest`/`uv` 최신으로 실행하고, 스타터가 내려주는 버전을 `package.json`/`uv.lock`에 그대로 고정(임의 다운그레이드 금지).

## Dev Agent Record

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

---

## ⚠️ Story Creation Notes (BMad → 사용자 확인용, 구현 차단 아님)

1. **저장소가 아직 git repo가 아님** (`is git repo: false`). AC2의 "머지 차단"은 GitHub branch protection을 전제하므로 Task 0(git init + GitHub 원격 + branch protection)이 선결이다. 솔로 프로젝트라 GitHub 없이 로컬만 쓸 거라면 — CI를 pre-push 훅으로 대체할지 결정 필요(현 AC는 GitHub Actions 전제).
2. **Supabase 프로젝트 실존 여부**: AC5 Vercel 배포와 AC2 `supabase gen types`는 Supabase 프로젝트 연결이 필요. 아직 프로젝트를 안 만들었다면 이 스토리에서 빈 프로젝트를 1개 생성(무료 티어)하는 것을 Task에 포함할지 확인.
3. **Ruff 추가는 architecture 명시 밖**(eslint→pytest만 적힘)이라 권장 사항으로 넣었음 — 원치 않으면 CI에서 빼도 됨.

위 3건은 dev 세션 시작 시 또는 지금 답해주면 반영합니다.
