---
baseline_commit: f65fdd587a25ef008e9376e1bfc41ebe9039c011
---

# Story 1.2: 회원가입·로그인 (SSR 쿠키 세션)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a 투자자,
I want 이메일로 계정을 만들고 로그인하고, 보호된 화면이 비로그인 접근을 막아주기를,
so that 내 판단 기록·데이터를 안전하게 보관하고 다시 찾을 수 있다.

## Acceptance Criteria

> 출처: [epics.md#Story 1.2] (FR1). 핵심: **스타터(with-supabase)가 인증 골격을 이미 제공** — 이 스토리는 *연결·통합·정리*이지 처음부터 구현이 아니다.

**AC1 — 이메일 가입·로그인 → SSR 쿠키 세션 (FR1)**
**Given** Supabase Auth가 실제 인스턴스에 연결된 상태(env 설정 완료)에서
**When** 신규 사용자가 이메일로 가입하고 로그인하면
**Then** `@supabase/ssr` 쿠키 세션이 생성되고, 로그인 후 **앱 셸 `/dashboard`** 로 진입한다(스타터 기본 `/protected` 아님)
**And** 세션은 `proxy.ts`(Next 16 미들웨어) `updateSession`으로 매 요청 갱신되어 RSC에서 무작위 로그아웃이 없다

**AC2 — 보호 경로 가드 (FR1)**
**Given** 로그아웃 상태에서
**When** 셸 라우트(`(app)/*` — `/dashboard`·`/watchlist`·`/score`·`/brief`)에 직접 접근하면
**Then** `/auth/login` 으로 리다이렉트된다
**And** 공개 경로(`/`, `/auth/*`)는 비로그인도 접근 가능하다(가드 제외 목록이 명시적이다)

**AC3 — 1-8 앱 셸과 인증 통합**
**Given** 로그인 상태에서
**When** 앱 셸을 보면
**Then** 셸(사이드 내비/적절한 위치)에 **로그인 사용자 표식 + 로그아웃** 액션이 있고, 로그아웃 시 `/auth/login`(또는 `/`)으로 빠진다
**And** 인증된 사용자가 `/`(랜딩)에 오면 `/dashboard`로 보낸다(비로그인은 랜딩/로그인 진입)

**AC4 — 스타터 데모 정리**
**Given** 스타터가 남긴 데모 자산에서
**When** 정리하면
**Then** 데모 `/protected` 라우트·튜토리얼 랜딩(connect-supabase/sign-up-user steps)·deploy 버튼·"Next.js Supabase Starter" 브랜딩이 제거/대체되고, 잔여 auth 페이지(login/sign-up/forgot/update-password/confirm/error)는 유지·브랜드 카피(한국어)로 정돈된다
**And** `tsc·eslint·vitest·next build` 게이트가 green이다

## Tasks / Subtasks

- [x] **Task 1 — Supabase Auth 인스턴스 연결 (AC1 선결)**
  - [x] 무료 클라우드 프로젝트 생성: `market-insight-os`(ref `gdygfmzxwwoagevngsom`, 서울, $0/월)
  - [x] `web/.env.local`에 URL + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 설정(git 제외 확인)
  - [x] Auth 도달성 확인(`/auth/v1/health` 200, `email:true`). ⚠️ "Confirm email" 토글은 대시보드 수동(코드는 무관) — 라이브 e2e 시 결정
  - [x] `hasEnvVars` true → 미들웨어 가드 활성
- [x] **Task 2 — 포스트-인증 리다이렉트를 셸로 재타깃 (AC1)**
  - [x] `login-form.tsx` → `/dashboard`
  - [x] `sign-up-form.tsx` `emailRedirectTo` → `.../dashboard`
  - [x] `update-password-form.tsx` → `/dashboard`
  - [x] `confirm/route.ts` `next` 기본값 `/` 유지(메일 확인 후 미들웨어가 authed→/dashboard 처리)
- [x] **Task 3 — 보호 가드 명시화 (AC2)**
  - [x] `lib/supabase/proxy.ts`에 순수 함수 `isPublicPath()` 추출(공개=`/`·`/auth/*`, 레거시 `/login` 제거) + `updateSession`이 사용
  - [x] 광범위 matcher가 `(app)/*` 커버 확인. **authed 사용자 `/` 접근 → `/dashboard` 리다이렉트도 미들웨어로 이동**(랜딩 정적 유지 위해)
- [x] **Task 4 — 셸 인증 통합 (AC3)**
  - [x] `components/app-shell/auth-badge.tsx`(서버, getClaims) — 이메일 + `LogoutButton`. `side-nav` `authSlot` prop + 모바일 헤더에 배치(둘 다 `<Suspense>` 래핑 — Next 16 Cache Components)
  - [x] `logout-button.tsx` 한국어·ghost·sm
  - [x] `app/page.tsx`: 정적 랜딩(브랜드+로그인/시작 CTA). authed→/dashboard는 미들웨어
- [x] **Task 5 — 스타터 데모 정리 (AC4)**
  - [x] `app/protected/` 삭제
  - [x] 고아 컴포넌트 삭제: `deploy-button·hero·next-logo·supabase-logo·env-var-warning·auth-button` + `components/tutorial/`
  - [x] 브랜딩 "Market Insight OS", auth 폼 카피 한국어(login/sign-up/update-password), 에러색 `text-red-500`→`text-destructive`+`role=alert`
- [x] **Task 6 — 테스트 + 게이트 (AC4)**
  - [x] `lib/supabase/proxy.test.ts` — `isPublicPath` 정책(공개/보호/미지정 경로) 3 케이스
  - [x] `(app)/layout.test.tsx`에 AuthBadge stub mock 추가(async 서버 컴포넌트)
  - [x] `tsc·eslint·vitest(14)·next build`(/ 정적, (app) PPR) green + api 회귀

## Dev Notes

### 이 스토리의 본질 — "거의 다 있다, 연결·통합·정리"
`create-next-app -e with-supabase` 스타터가 **인증을 사실상 구현**해뒀다. 처음부터 만들지 말 것:
- **이미 존재(재사용):** `lib/supabase/{client,server,proxy}.ts` · `proxy.ts`(Next 16 미들웨어) · auth 페이지 7종(`app/auth/{login,sign-up,sign-up-success,forgot-password,update-password,confirm,error}`) · 폼 컴포넌트(`login-form`,`sign-up-form`,`forgot-password-form`,`update-password-form`) · `auth-button`·`logout-button`.
- **세션 검증:** `supabase.auth.getClaims()` 사용(로컬 JWT claims — 아키텍처의 "JWT 로컬 검증"과 정합, `getUser()` 네트워크 왕복 회피). [Source: architecture.md#Auth 신뢰 경계]
- **실제 작업:** ① Supabase 인스턴스 연결 ② 리다이렉트 셸로 ③ 1-8 셸 통합 ④ 데모 정리. **재구현 금지.**

### ⚠️ Next 16 = `middleware.ts`가 아니라 `proxy.ts`
Next 16에서 미들웨어 파일이 **`proxy.ts`로 개명**됨(빌드 출력 "ƒ Proxy (Middleware)" 확인). 루트 `web/proxy.ts`가 진입점이고 `export function proxy(request)` + `config.matcher`. 세션 갱신 헬퍼는 `lib/supabase/proxy.ts`의 `updateSession`. **`middleware.ts`를 새로 만들지 말 것** — 이미 `proxy.ts`로 동작 중. [Source: web/proxy.ts 실측]

### 현재 보호 로직 (lib/supabase/proxy.ts `updateSession`)
```
if (path !== "/" && !user && !path.startsWith("/login") && !path.startsWith("/auth"))
   → redirect /auth/login
```
- `hasEnvVars` false면 가드 **스킵**(현재 실 Supabase 미연결 → 보호 비활성). Task 1으로 env 설정 시 활성.
- 즉 **셸 `(app)/*` 보호는 이 전역 로직이 이미 커버**(1-8의 "보호는 1.2 소관" 교차의존이 여기서 닫힘). Task 3은 공개 경로 허용을 명시화(레거시 `/login` 정리)하는 정도.
- **getClaims()와 redirect 사이에 코드 넣지 말 것**(주석 경고 — 무작위 로그아웃 유발). [Source: lib/supabase/proxy.ts 실측]

### 리다이렉트 재타깃 (현재 → 목표)
| 파일 | 현재 | 목표 |
|---|---|---|
| `components/login-form.tsx:42` | `router.push("/protected")` | `/dashboard` |
| `components/sign-up-form.tsx:47` | `emailRedirectTo .../protected` | `.../dashboard` |
| `components/update-password-form.tsx:37` | `router.push("/protected")` | `/dashboard` |
| `components/logout-button.tsx` | `/auth/login` | 유지(또는 `/`) |
[Source: 실측 grep]

### env 변수 (스타터 규약 — 주의)
스타터는 `NEXT_PUBLIC_SUPABASE_URL` + **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** 를 쓴다(아키텍처/1-1 메모의 "anon key" 아님 — Supabase 신 네이밍 publishable key). `lib/supabase/{client,server,proxy}.ts` 모두 이 이름 참조. [Source: 실측]

### 1-8 셸과의 통합 포인트
- 1-8이 만든 셸: `app/(app)/layout.tsx`(server 컴포넌트) + `side-nav.tsx`(client, ThemeSwitcher 하단). 여기에 **사용자 이메일 + LogoutButton**을 추가. layout이 server라 `await createClient().auth.getClaims()`로 사용자 취득해 client 자식에 props로 내리거나, 작은 server 컴포넌트(`<AuthBadge/>`)를 side-nav 옆에 배치.
- `(app)` 라우트는 1-8에서 공개 렌더였음 → 이제 미들웨어 가드로 보호됨(인증 통합 완료). [Source: 1-8-app-shell.md 교차의존]

### 범위 밖 (후속 스토리)
- **온보딩 J0**("관심종목 1개만" 빈손방지) — 후속(관심종목 1.4 이후). 1.2는 로그인 후 `/dashboard` 진입까지.
- **RLS·데이터 격리(FR2)** — Story 1.3(스키마 동결)에서 `user_id=auth.uid()` 정책. 1.2는 인증만.
- 소셜 로그인·이메일 템플릿 커스텀·비번 정책 심화 — 후속/운영.

### Project Structure Notes (수정/삭제 위주, 신규 최소)
```
web/
├── proxy.ts                         # (유지) Next 16 미들웨어
├── lib/supabase/proxy.ts            # (수정) 공개 경로 명시화 + test
├── lib/supabase/proxy.test.ts       # (신규) 가드 테스트
├── components/{login,sign-up,update-password}-form.tsx  # (수정) /dashboard
├── components/app-shell/side-nav.tsx                    # (수정) 로그아웃·사용자
├── app/page.tsx                     # (수정) 인증 시 /dashboard 리다이렉트 + 데모 제거
├── app/protected/                   # (삭제) 데모
└── components/{tutorial/*, deploy-button, hero, *-logo}.tsx  # (삭제) 스타터 크루프트
```
[Source: architecture.md#Project Structure, 1-1·1-8 실측]

### 1-1·1-8에서 이어지는 사실 (Previous Story Intelligence)
- web = Next **16.2.9** · Tailwind **v3** · shadcn · Pretendard · next-themes. 셸·토큰·a11y 베이스라인 완비(1-8).
- 게이트: web `tsc → eslint → vitest`(Vitest+RTL+jsdom+axe) · CI 잡 이름 **고정**(web/api/contract-guards) — 잡 이름 바꾸면 branch protection 깨짐.
- 와이어 snake_case 규칙·단일 에러봉투(api)·`directional-value` 헬퍼 존재. [Source: 1-1, 1-8]

### References
- [Source: epics.md#Story 1.2] — AC 원본(FR1)
- [Source: architecture.md#Authentication & Security, #Party Mode 합의(인증 신뢰 경계)] — JWT 로컬 검증·RLS·service_role 격리
- [Source: EXPERIENCE.md#IA(로그인/온보딩), #Voice and Tone] — 표준 인증, 카피 톤
- [Source: 1-8-app-shell.md] — 셸 통합 지점·교차의존
- [Source: web/proxy.ts, lib/supabase/*.ts, components/*-form.tsx 실측]

## Latest Tech Information (확인 필요 — dev-story 시 검증)
- **Next 16 미들웨어 = `proxy.ts`**(`middleware.ts` 개명). `export function proxy` + `config.matcher`. 새 `middleware.ts` 만들지 말 것.
- **Supabase SSR**: `@supabase/ssr` `getClaims()`(로컬 JWT) — `getUser()`보다 빠름. 쿠키 세션은 `createServerClient` getAll/setAll 패턴.
- **env 키**: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`(신 네이밍). 무료 Supabase 프로젝트 또는 로컬 `supabase start`.

## Dev Agent Record

### Agent Model Used
claude-opus-4-8 (bmad-dev-story)

### Debug Log References
- **Next 16 Cache Components(PPR)**: `AuthBadge`가 쿠키(getClaims) 동적 접근 → `<Suspense>` 밖이면 `/dashboard` 프리렌더 차단. 해결: 셸 레이아웃의 AuthBadge 2곳을 `<Suspense fallback={null}>` 래핑.
- **랜딩 `/`도 동일 에러**(Home에서 getClaims). 해결: authed→/dashboard 리다이렉트를 **미들웨어(proxy.ts)로 이동**, `/`는 정적 유지. (라우팅 중앙화 = 더 깔끔)
- **stale `.next` 타입**: protected/ 삭제 후 `.next/types/validator.ts`가 삭제 라우트 참조 → `rm -rf .next`(CI는 빌드 전 tsc라 무관, 로컬만).
- **layout.test 깨짐**: AuthBadge(async 서버+next/headers)가 RTL에서 렌더 불가 → 테스트에 `vi.mock(auth-badge)` stub.

### Completion Notes List
- **AC1-4 충족.** Supabase 무료 프로젝트 연결(서울), 리다이렉트 셸 재타깃, 보호 가드 명시화+authed 랜딩 리다이렉트(미들웨어), 셸 인증 통합(AuthBadge+로그아웃), 스타터 데모 대청소.
- **인증 거의 재구현 안 함** — 스타터 자산 재사용(폼·세션·미들웨어). 실제 작업 = 연결·재타깃·통합·정리.
- **라이브 e2e(가입→로그인) 미수행**: "Confirm email" 토글(대시보드)에 의존 + 실 메일박스 필요. 코드·보호로직(unit)·빌드는 검증됨. **수동 검증 권장:** 대시보드에서 confirm-email 설정 후 브라우저에서 가입/로그인 → /dashboard 진입, 로그아웃, 비로그인 /dashboard 접근→/auth/login 확인.
- 에러 표시를 `text-destructive`(zinc, 브랜드 정합 — 빨강은 상승색 LOCK) + `role=alert`로 통일.
- 게이트: web tsc·eslint·vitest(14)·`next build`(/ 정적, (app) PPR ◐) + api 회귀 green.

### File List
**신규:**
- `web/components/app-shell/auth-badge.tsx`
- `web/lib/supabase/proxy.test.ts`
- `web/.env.local`(git 제외 — 커밋 안 됨)

**수정:**
- `web/lib/supabase/proxy.ts`(isPublicPath 추출, authed 랜딩 리다이렉트)
- `web/app/page.tsx`(정적 브랜드 랜딩)
- `web/app/(app)/layout.tsx`(AuthBadge+Suspense, 모바일 헤더)
- `web/app/(app)/layout.test.tsx`(AuthBadge stub mock)
- `web/components/app-shell/side-nav.tsx`(authSlot prop)
- `web/components/{login,sign-up,update-password}-form.tsx`(redirect /dashboard, 한국어, text-destructive)
- `web/components/logout-button.tsx`(한국어·ghost·sm)

**삭제:**
- `web/app/protected/`(layout+page)
- `web/components/{deploy-button,hero,next-logo,supabase-logo,env-var-warning,auth-button}.tsx`
- `web/components/tutorial/`(5 파일)

### Change Log
- 2026-06-24 — 인증(AC1-4): Supabase 무료 프로젝트 연결, 리다이렉트 셸 재타깃, 보호 가드 명시화(미들웨어 중앙화), 셸 AuthBadge 통합, 스타터 데모 정리. baseline_commit=f65fdd5.

---

## ⚠️ Story Creation Notes (BMad → 사용자 확인용, 시작 전 결정 권장)

1. ~~Supabase 인스턴스(블로커)~~ → ✅ **해소(2026-06-24):** 무료 클라우드 프로젝트 생성 완료 — `market-insight-os`(ref `gdygfmzxwwoagevngsom`, 서울 리전, $0/월, ACTIVE_HEALTHY). `web/.env.local`에 URL + publishable key 설정(git 제외). `hasEnvVars`가 true가 되어 미들웨어 가드 활성. **dev-story는 Task 1의 인스턴스 연결을 건너뛰고 이메일 인증 설정 확인부터 시작.** (스키마·RLS는 1.3)
2. **랜딩(`/`) 처리** — MVP에선 인증 시 `/dashboard` 리다이렉트 + 비인증 최소 랜딩으로 가정. 본격 마케팅/온보딩 랜딩은 후속.
3. **데모 정리 범위** — `/protected`·튜토리얼·deploy 버튼 제거 권장. 혹시 보존하고 싶은 게 있으면 알려주세요.

---

## Senior Developer Review (AI)

- **리뷰어:** claude-opus-4-8 (인라인) · **일자:** 2026-06-24 · **대상:** feat/1-2-auth-login (PR #3)
- **결과:** **Approve (2 fixes applied)** — CI 3 jobs green. 인증/세션 경계라 보호 로직 정밀 점검 후 2건 보강.

### Findings
| # | 심각도 | 내용 | 처리 |
|---|--------|------|------|
| 1 | Low→Fixed | `isPublicPath`가 `startsWith("/auth")` → `/authxyz`·`/auth-internal` 같은 가상 경로가 공개로 샐 여지. | ✅ **수정** — `=== "/auth"` + `startsWith("/auth/")`로 한정. 테스트 추가(15). |
| 2 | **Low-Med→Fixed** | 미들웨어 리다이렉트가 `getClaims()`로 갱신된 **세션 쿠키를 이관 안 함**(스타터 주석 72-83이 경고하는 패턴). authed `/`→`/dashboard`에서 토큰 리프레시 유실 가능. | ✅ **수정** — `redirectWithSession()` 헬퍼로 supabaseResponse 쿠키를 리다이렉트 응답에 복사. |
| 3 | Info | `hasEnvVars` false면 미들웨어가 **전체 스킵(fail-open)** — env 누락 시 보호 해제. 스타터 dev 편의 설계. | 프로덕션 배포 시 env 보장 필수. 향후 fail-closed 검토(비차단). |
| 4 | Info | 라이브 e2e(가입→로그인) 미수행 — confirm-email 토글+실 메일박스 의존. unit(보호 정책)·빌드는 통과. | 머지 후 브라우저 수동 검증. |
| 5 | Info | `getClaims()` JWT 검증을 신뢰(라이브러리). service_role은 어디에도 미저장(배치 전용, 3.1a). | 정상 |

### 종합
스타터 인증 자산을 재사용하며 연결·통합·정리를 완수. 보안 경계인 미들웨어에서 **공개 경로 누수(#1)와 세션 쿠키 유실(#2)**을 리뷰에서 보강 — 둘 다 인증 경계의 정확성 항목이라 지금 잡는 게 옳음. 라이브 e2e만 수동으로 남음. **머지 권장.**
