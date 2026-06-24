---
baseline_commit: 1e5f397c317f22c089f2a4399095030e45ff8590
---

# Story 1.8: 앱 셸 — 반응형 레이아웃 + 하단 탭바 + 접근성 베이스라인

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

> **기초 스토리 — 피처 화면(1.2 인증, 1.4~1.7)보다 먼저 구현해 이후 모든 화면이 이 셸·토큰·a11y 베이스라인을 상속한다.** [Source: epics.md#Story 1.8]

## Story

As a 사용자,
I want 모바일·데스크톱에서 일관된 내비게이션과 접근성·브랜드 시각을 가진 앱 셸을,
so that 이후 모든 화면이 동일한 셸·디자인 토큰·접근성 규칙 위에 얹혀 어디서나 매끄럽게 쓸 수 있다.

## Acceptance Criteria

> 출처: [epics.md#Story 1.8] (UX-DR1, UX-DR10, UX-DR11, NFR-U3, NFR-AC1). DESIGN.md/EXPERIENCE.md 스파인이 목업/이 문서와 충돌 시 **스파인 우선**.

**AC1 — 반응형 셸 + 하단 탭바/사이드 내비 (UX-DR11, NFR-U3)**
**Given** 앱 셸(`app/(app)/layout.tsx`)에서
**When** 모바일(<768px)로 접속하면
**Then** 하단 고정 탭바(**대시보드 / 관심종목 / Score / Daily Brief** 4개)가 엄지 도달 영역에 뜨고, 각 탭 타깃 ≥44px, iOS WebView 세이프에어리어(`env(safe-area-inset-bottom)`)를 존중한다
**And** 데스크톱(≥768px)에선 하단 탭바 대신 **좌측 사이드 내비**로 전환되고 콘텐츠 영역은 멀티컬럼 확장이 가능하다(같은 코드, 반응형)
**And** 현재 위치 탭은 `aria-current="page"`로 노출되고 Deep Indigo 액센트로만 활성 표시된다

**AC2 — DESIGN.md 토큰 적용 (UX-DR1)**
**Given** shadcn/ui + Tailwind(v3) 기반에서
**When** 셸과 하위 화면을 렌더하면
**Then** DESIGN.md 토큰이 shadcn 기본 위에 오버라이드된다: **Deep Indigo `primary`**(라이트 `#4F46E5`/다크 `#818CF8`), **한국식 의미색**(상승=빨강 `up`/하락=파랑 `down`, hue LOCKED), **warning/as-of·disclaimer-fg·destructive(zinc)** 토큰, **Pretendard** 폰트(Geist 대체), 수치 **tabular-nums**
**And** 라이트/다크 두 벌이 시스템 설정에 따라 자동 전환된다(기존 next-themes 재사용)

**AC3 — 접근성 베이스라인 (UX-DR10, NFR-AC1)**
**Given** 접근성 베이스라인이 셸에 적용되면
**When** 셸·내비·방향수치 헬퍼를 렌더하면
**Then** ① 탭 타깃 ≥44px ② "본문 바로가기" 스킵 링크(`<a href="#main">`, 포커스 시 표시) ③ 키보드 포커스 가시 링(`:focus-visible`) ④ **등락은 색만이 아니라 부호/화살표 글리프(▲▼, +/−) 병기** + 스크린리더용 "상승/하락" 텍스트 ⑤ 내비는 `<nav>` 랜드마크 + 활성 `aria-current`
**And** 자동 a11y 검사(axe)가 셸·핵심 컴포넌트에서 위반 0으로 통과한다

**AC4 — 후속 화면이 들어올 자리 (셸 라우트 골격)**
**Given** 셸 라우트 그룹 `app/(app)/`에서
**When** 4개 탭으로 이동하면
**Then** `(app)/{dashboard,watchlist,score,brief}` 각 라우트가 **빈 상태 플레이스홀더**("준비 중" 또는 EXPERIENCE.md의 빈상태 카피)로 렌더되어 탭 내비가 실제로 동작한다(피처 콘텐츠는 후속 스토리 1.4~1.7·4.x)

## Tasks / Subtasks

- [x] **Task 1 — Tailwind v3 토큰 시스템 (AC2)**
  - [x] `globals.css` `:root`/`.dark`에 DESIGN.md 토큰 HSL 삼중값 적용(브랜드·의미·중립 + 신규 up/down/warning/disclaimer-fg)
  - [x] `tailwind.config.ts` `colors`에 up/down/warning/disclaimer-fg 매핑 + `spacing.tap-min: 44px` + `fontFamily.sans` Pretendard
  - [x] **Tailwind v3 유지**(사용자 승인) — v4 미이주
- [x] **Task 2 — Pretendard 폰트 (AC2)**
  - [x] `pretendard`(공식 npm, 1.3.9) 설치 → `layout.tsx`에서 Pretendard Variable dynamic-subset CSS import, Geist 제거. ⚠️ `@fontsource-variable/pretendard`는 404 → 공식 `pretendard` 패키지 사용
  - [x] `fontFamily.sans` Pretendard 우선 + `.tabular-nums` 유틸(globals.css)
  - [x] 루트 `metadata` 브랜드값으로 수정(title "Market Insight OS", `lang="ko"`)
- [x] **Task 3 — 앱 셸 레이아웃 + 내비 (AC1)**
  - [x] `app/(app)/layout.tsx` — 스킵 링크 + `<main id="main" tabIndex=-1>` + 반응형(모바일 col / 데스크톱 row). next-themes 루트 재사용
  - [x] `components/app-shell/bottom-tab-bar.tsx`(client, usePathname, aria-current, min-h-[44px], `pb-[env(safe-area-inset-bottom)]`, `md:hidden`)
  - [x] `components/app-shell/side-nav.tsx`(`hidden md:flex`, 동일 항목) + `nav-items.ts`(단일 소스 + isActive 헬퍼)
  - [x] 4개 항목 lucide 아이콘(LayoutDashboard/Star/Activity/Newspaper)
  - [x] `ThemeSwitcher`를 사이드 내비 하단에 노출
- [x] **Task 4 — 접근성 베이스라인 헬퍼 (AC3)**
  - [x] `components/brand/directional-value.tsx` — 색(up-text/down-text) + 글리프(▲▼/—) + 부호 + SR텍스트(상승/하락/보합) + tabular-nums
  - [x] 스킵 링크(`sr-only focus:not-sr-only`) + `:focus-visible` 전역 링(globals.css)
  - [x] 범위 밖(규칙만 문서화): chip/progressive-disclosure/async-state/research-card/score-mirror/asof-badge → 후속 스토리
- [x] **Task 5 — 셸 라우트 골격 + 빈상태 (AC4)**
  - [x] `app/(app)/{dashboard,watchlist,score,brief}/page.tsx` 4개 — `ScreenPlaceholder`("준비 중" 톤). `next build`에서 4개 정적 프리렌더 확인
  - [x] 인증 보호는 Story 1.2(미들웨어) 소관으로 명시(교차의존)
- [x] **Task 6 — 테스트 + a11y 게이트 (AC3)**
  - [x] Vitest 4.1 + RTL 16 + jsdom + vitest-axe 설치, `vitest.config.ts`/`vitest.setup.ts`
  - [x] 컴포넌트 테스트 10개: directional-value(상승/하락/보합/포맷터/axe) · bottom-tab-bar(4탭/aria-current/axe) · 셸(스킵링크/main) — **10/10 pass**
  - [x] `package.json` `test` 스크립트 + CI web job에 `vitest` 스텝 추가
  - [x] 전체 게이트 로컬 green(tsc·eslint·vitest·`next build` + api 회귀)

## Dev Notes

### 이 스토리의 본질 & 범위
**셸 + 토큰 + a11y 베이스라인**을 세워 이후 모든 화면이 상속하게 한다. *피처 콘텐츠는 안 만든다* — 탭이 가리키는 4개 화면은 빈 플레이스홀더다. 핵심 산출물: ① 반응형 셸(모바일 탭바 ↔ 데스크톱 사이드 내비) ② DESIGN.md 토큰을 shadcn v3 위에 오버라이드 ③ a11y 베이스라인(스킵·포커스·44px·색+글리프·axe 게이트).

### ⚠️ v3/v4 결정 (리뷰 Finding #7 — 시작 전 확인)
1-1 스타터가 **Tailwind v3.4**를 내려줬다(아키텍처/UX는 "Tailwind 4-base 호환" 표현이나 v4 전용 기능을 요구하진 않음). **권장: v3 유지.** 근거: ⓐ 스캐폴드·shadcn이 v3로 동작 중 ⓑ DESIGN.md 토큰은 전부 CSS 변수 + config extend로 v3에서 표현 가능(v4 `@theme` 불필요) ⓒ 부트스트랩 직후 v4 이주는 shadcn 호환 리스크 큰 yak-shave. v4는 훗날 독립 과제로. → 본 스토리는 **v3 문법**(`@tailwind`, `hsl(var(--x))`, `tailwind.config.ts`)으로 작성. [Source: 1-1 Completion Notes, architecture.md#Frontend]

### 토큰 블록 (turnkey — DESIGN.md hex를 shadcn v3 HSL 삼중값으로 변환 완료)
`globals.css`는 shadcn 관습대로 **HSL 삼중값**(`H S% L%`, `hsl()` 래퍼 없이)을 CSS 변수에 넣고, `tailwind.config.ts`가 `hsl(var(--x))`로 감싼다. shadcn 기본 토큰(background/foreground/card/...)은 **Deep Indigo 계열 중립으로 덮고**, 아래 의미·브랜드 토큰을 추가한다.

**`globals.css` `:root`(라이트) 추가/오버라이드:**
```
--primary: 243 75% 59%;          /* Deep Indigo #4F46E5 */
--primary-foreground: 0 0% 100%;
--background: 240 18% 97%;        /* #F5F5F8 */
--card: 0 0% 100%;               /* surface #FFFFFF */
--border: 240 16% 91%;           /* #E5E5EC */
--input: 240 16% 91%;
--ring: 243 75% 59%;             /* 포커스 링 = primary */
--foreground: 240 28% 14%;       /* text-primary #1A1A2E */
--muted-foreground: 240 9% 46%;  /* text-secondary #6B6B80 (캡션 아님) */
--destructive: 240 5% 26%;       /* zinc #3F3F46 (상승빨강과 분리) */
--destructive-foreground: 0 0% 100%;
/* 의미·신뢰 토큰 (shadcn 밖, 신규) */
--up: 359 77% 56%;        --up-text: 0 74% 45%;
--down: 221 83% 53%;      --down-text: 221 83% 53%;
--warning: 26 90% 37%;    --warning-text: 22 91% 32%;   --warning-bg: 48 96% 89%;
--disclaimer-fg: 240 5% 34%;
```
**`.dark` 오버라이드:**
```
--primary: 234 89% 74%;          /* #818CF8 */
--primary-foreground: 240 30% 7%;
--background: 240 22% 7%;        /* #0E0E16 */
--card: 240 19% 13%;             /* surface-dark #1A1A26 */
--border: 240 16% 20%;           /* #2A2A3A */
--foreground: 240 27% 94%;       /* #ECECF4 */
--muted-foreground: 240 12% 65%;
--destructive: 240 5% 84%;       /* #D4D4D8 */
--up: 0 100% 68%;        --up-text: 0 100% 68%;      /* #FF5C5C fill·텍스트 공통 */
--down: 220 82% 65%;     --down-text: 220 82% 65%;   /* #5B8DEF */
--warning: 43 96% 56%;   --warning-text: 43 96% 56%; --warning-bg: 42 53% 15%;
--disclaimer-fg: 240 5% 65%;     /* #A1A1AA */
```
**`tailwind.config.ts` `theme.extend.colors` 추가:**
```ts
up: { DEFAULT: "hsl(var(--up))", text: "hsl(var(--up-text))" },
down: { DEFAULT: "hsl(var(--down))", text: "hsl(var(--down-text))" },
warning: { DEFAULT: "hsl(var(--warning))", text: "hsl(var(--warning-text))", bg: "hsl(var(--warning-bg))" },
"disclaimer-fg": "hsl(var(--disclaimer-fg))",
// + spacing: { "tap-min": "44px" }
```
> **의미색 LOCK(절대 규칙):** 상승=빨강/하락=파랑 **hue 변경 금지**, 초록을 상승색으로 금지, 등락색을 브랜드/상태/장식에 전용 금지. 소형 텍스트(<14px 또는 14px/non-bold)는 `up-text`/`down-text` 변형으로 4.5:1 확보. destructive(삭제)는 zinc — 상승 빨강 재사용 금지 + 아이콘+라벨 병기. [Source: DESIGN.md#Colors, #Do's and Don'ts]

### Pretendard
스타터는 `next/font/google`의 **Geist**를 쓴다(layout.tsx). Pretendard는 google fonts에 없으므로: **권장 `@fontsource-variable/pretendard`**(npm, 재현성·오프라인 OK) → `import "@fontsource-variable/pretendard"` 후 `font-family: "Pretendard Variable"`. 대안: `next/font/local`(woff2 동봉). CDN @font-face는 WebView 오프라인 시 깨질 수 있어 비권장. `fontFamily.sans`를 Pretendard 우선 + system fallback. [Source: DESIGN.md#Typography]

### 반응형 셸 구조
- 브레이크포인트 **md(768px)**: 모바일=하단 탭바(`md:hidden`, fixed bottom, `pb-[env(safe-area-inset-bottom)]`), 데스크톱=좌측 사이드 내비(`hidden md:flex`). 콘텐츠 `<main id="main">`는 모바일에서 탭바 높이만큼 하단 패딩.
- WebView 셸: 동일 코드가 앱 품질(EXPERIENCE.md Foundation). 세이프에어리어·고정 탭바가 iOS 홈 인디케이터와 겹치지 않게.
- 모달 중첩 1단까지(EXPERIENCE.md IA). `Esc`로 최상단 닫기.
- 탭바/사이드내비는 **client 컴포넌트**(`usePathname`). 셸 layout 자체는 RSC 가능. [Source: EXPERIENCE.md#IA, architecture.md#Frontend(RSC 우선)]

### 접근성 베이스라인 (이 스토리가 봉인하는 규칙)
- 탭 타깃 ≥44px(`tap-min`), 엄지 영역, 스킵 링크, `:focus-visible` 가시 링, `<nav>` 랜드마크 + `aria-current="page"`.
- **색 단독 금지** → `directional-value.tsx`가 색+글리프(▲▼)+부호+SR텍스트를 강제. 이후 대시보드·리서치카드가 이 헬퍼를 재사용.
- WCAG 2.2.1 비위반: 셸엔 타이머·자동진행 없음. [Source: EXPERIENCE.md#Accessibility Floor, DESIGN.md#Do's/Don'ts]
- **범위 밖이나 규칙 예고**(컴포넌트는 후속): 칩 `aria-pressed`(2.1b), 점진공개 `aria-live`(2.1b), 비동기 오류 `role="alert"`(3.x). 본 스토리 AC3의 "칩/점진공개/비동기" 문구는 **베이스라인 규약**을 뜻하며 실제 컴포넌트 구현이 아님.

### Project Structure Notes (생성/수정)
```
web/
├── app/
│   ├── layout.tsx                 # (수정) Geist→Pretendard, 브랜드 metadata
│   ├── globals.css                # (수정) 브랜드 토큰 라이트/다크 + focus-visible
│   └── (app)/                     # (신규) 셸 라우트 그룹
│       ├── layout.tsx             #   셸: 스킵링크 + main + 반응형 내비
│       ├── dashboard/page.tsx     #   빈상태 플레이스홀더
│       ├── watchlist/page.tsx     #   "
│       ├── score/page.tsx         #   "
│       └── brief/page.tsx         #   "
├── components/
│   ├── app-shell/{bottom-tab-bar,side-nav}.tsx   # (신규, client)
│   └── brand/directional-value.tsx               # (신규) 색+글리프+SR
├── tailwind.config.ts             # (수정) 의미색·tap-min extend
└── **/*.test.tsx                  # (신규) Vitest co-located
```
폴더명 규칙: 컴포넌트 `PascalCase.tsx`, 와이어 데이터 없으니 snake_case 무관. shadcn `components/ui`는 불변, 조합만. [Source: architecture.md#Structure Patterns, #Project Structure]

### 1-1에서 이어지는 사실 (Previous Story Intelligence)
- web = **Next 16.2.9 · React 19 · Tailwind v3.4.19 · shadcn new-york(neutral, cssVariables) · next-themes 배선됨**. `lib/utils.ts`(cn) 존재. `components/ui`에 button/card/input/label/checkbox/dropdown-menu/badge 있음.
- ESLint 공존 네이밍 규칙 적용됨(와이어 snake_case ↔ 로컬 camelCase). `.next`/생성물 ignore.
- 게이트: web=`tsc --noEmit`+`eslint`(현재 JS 테스트러너 없음 → Task 6에서 Vitest 추가). [Source: 1-1-starter-bootstrap.md]

### References
- [Source: epics.md#Story 1.8] — AC 원본(UX-DR1/10/11, NFR-U3/AC1)
- [Source: DESIGN.md] — 토큰(colors/typography/spacing/components), Do's/Don'ts, 등락색 LOCK
- [Source: EXPERIENCE.md#Foundation, #IA, #Accessibility Floor, #Interaction Primitives] — 폼팩터·하단탭바·a11y 행위
- [Source: architecture.md#Frontend Architecture, #Implementation Patterns, #Project Structure] — RSC 우선·shadcn 오버라이드·디렉터리
- [Source: 1-1-starter-bootstrap.md] — 스택 버전·기존 배선·게이트

## Latest Tech Information (확인 필요 — dev-story 시 검증)
- **Tailwind v3 + shadcn 토큰**: CSS 변수(HSL 삼중값) + `tailwind.config.ts` 매핑이 표준. v4(`@theme`)와 문법 다름 — 본 스토리는 v3.
- **Pretendard**: `@fontsource-variable/pretendard`(권장) 또는 `next/font/local`. CDN @font-face는 WebView 오프라인 비권장.
- **Vitest + RTL + jsdom + vitest-axe**: Next 16/React 19 컴포넌트 테스트 표준 조합. dev-story 시 최신 호환 버전 확인 후 lock.

## Dev Agent Record

### Agent Model Used
claude-opus-4-8 (bmad-dev-story)

### Debug Log References
- `@fontsource-variable/pretendard` 404 → 공식 `pretendard`(1.3.9) 패키지의 variable dynamic-subset CSS 사용(`font-family: "Pretendard Variable"`).
- axe landmark-unique 오탐: 반응형 nav 2개(side/bottom)가 jsdom에선 둘 다 DOM 잔존(CSS display 미적용) → axe는 단일 nav(bottom-tab-bar)·directional-value에만 적용, 레이아웃은 구조 검증으로 분리. 실제 브라우저는 한쪽만 display되어 무관.
- `min-h` 유틸은 spacing extend를 안 받음 → 탭 타깃은 `min-h-[44px]` arbitrary value 사용(spacing.tap-min은 padding/height용으로 유지).
- CI 잡 이름을 안정값(`web`/`api`/`contract-guards`)으로 변경 + branch protection 컨텍스트 동기화(스텝 추가 시 required-check 깨짐 방지).

### Completion Notes List
- **AC1-4 전부 충족.** 로컬 게이트 0 실패: web(tsc·eslint·vitest 10/10·`next build` 4라우트 프리렌더) + api 회귀(ruff·pytest).
- **Tailwind v3 유지**(사용자 승인) — DESIGN.md hex 28개를 HSL 삼중값으로 변환해 shadcn 위 오버라이드. 등락색 hue LOCK 준수, destructive=zinc(상승빨강과 분리).
- **Vitest 도입**(사용자 승인) — web 첫 테스트러너. co-located `*.test.tsx` 패턴 확립 + axe 자동 a11y 게이트. CI web job에 vitest 스텝 추가.
- **directional-value**가 "색 단독 금지" 규칙(색+글리프+부호+SR텍스트)을 코드로 봉인 → 후속 대시보드·리서치카드가 재사용.
- **범위 분리 준수**: chip/progressive-disclosure/async-state/research-card/score-mirror/asof-badge는 토큰만 정의, 컴포넌트는 후속 스토리(2.1b/3.x/4.x).
- **교차의존 메모**: `(app)` 라우트 인증 보호는 Story 1.2 미들웨어 matcher 소관(현재 셸은 공개 렌더). 1.2 구현 시 `(app)` 보호 추가 필요.

### File List
**신규:**
- `web/app/(app)/layout.tsx` · `web/app/(app)/{dashboard,watchlist,score,brief}/page.tsx`
- `web/app/(app)/layout.test.tsx`
- `web/components/app-shell/{nav-items.ts, bottom-tab-bar.tsx, side-nav.tsx, screen-placeholder.tsx}`
- `web/components/app-shell/bottom-tab-bar.test.tsx`
- `web/components/brand/directional-value.tsx` · `web/components/brand/directional-value.test.tsx`
- `web/vitest.config.ts` · `web/vitest.setup.ts`

**수정:**
- `web/app/layout.tsx` (Geist→Pretendard, 브랜드 metadata, lang=ko)
- `web/app/globals.css` (DESIGN.md 토큰 라이트/다크 + focus-visible + tabular-nums)
- `web/tailwind.config.ts` (의미색·tap-min·Pretendard extend)
- `web/package.json` (pretendard + vitest 의존성, `test` 스크립트)
- `.github/workflows/ci.yml` (web job에 vitest 스텝, 잡 이름 안정화)

### Change Log
- 2026-06-24 — 앱 셸 구현(AC1-4): 반응형 셸(모바일 탭바↔데스크톱 사이드내비)·DESIGN.md 토큰(v3)·Pretendard·a11y 베이스라인(스킵·포커스·색+글리프·axe)·4탭 플레이스홀더·Vitest 도입. baseline_commit=1e5f397.

---

## ⚠️ Story Creation Notes (BMad → 사용자 확인용, 시작 전 결정 권장)

1. **Tailwind v3 유지 vs v4 마이그레이션** — 리뷰 Finding #7. 권장=**v3 유지**(이유는 Dev Notes "v3/v4 결정"). dev-story 시작 전 OK 주시면 그대로, v4 원하면 별도 마이그레이션 태스크 추가.
2. **Vitest 테스트러너 도입** — 이 스토리에서 web에 컴포넌트 테스트(+axe a11y 게이트)를 처음 들임. 아키텍처의 co-located `*.test.ts` 패턴에 부합하나 CI가 1스텝 늘어남. 도입 권장(접근성 베이스라인 스토리에 axe 자동검사가 딱 맞음). 빼고 싶으면 tsc+eslint+수동검증으로 축소 가능.
3. **빈상태 카피** — 4개 탭 플레이스홀더 문구는 EXPERIENCE.md 톤("준비 중")으로 최소화. 실제 빈상태/온보딩 UX는 후속 스토리.

---

## Senior Developer Review (AI)

- **리뷰어:** claude-opus-4-8 (인라인) · **일자:** 2026-06-24 · **대상:** feat/1-8-app-shell (PR #2)
- **결과:** **Approve (minor fix applied)** — CI 3 jobs green. 재사용 헬퍼의 NaN 처리 1건 리뷰 중 수정.

### Findings
| # | 심각도 | 내용 | 처리 |
|---|--------|------|------|
| 1 | **Low→Fixed** | `DirectionalValue`가 NaN/Infinity 입력 시 "NaN" 렌더. 대시보드·리서치카드가 재사용할 헬퍼이고 시세 누락→0 나눗셈 등에서 NaN 발생 가능(NFR-R2: 누락은 "—"여야). | ✅ **수정** — `Number.isFinite` 가드 → "—" + SR "데이터 없음". 테스트 추가(11/11). |
| 2 | Info | `bg-primary/10`(side-nav 활성) 등 opacity 모디파이어는 **공백 HSL 삼중값**(`243 75% 59%`)에 의존 → `hsl(var(--primary) / 0.1)`로 정상. shadcn 표준 패턴과 정합 확인. | 정상(조치 없음) |
| 3 | Info | 전역 `:focus-visible` 링이 모든 포커스 요소에 광범위 적용 — a11y 베이스라인으로 적절. `main[tabindex=-1]`은 의도적으로 outline-none(스킵 링크 후 무음 포커스). | 수용 |
| 4 | Info | `DirectionalValue`가 large/small 구분 없이 `-text` 변형 사용(항상 AA 안전, 다소 덜 선명). 향후 `size` prop로 fill 변형 노출 여지. | 후속 여지(비차단) |
| 5 | Info | axe color-contrast는 jsdom canvas 미지원으로 스킵됨(경고) — 실제 대비는 DESIGN.md에서 검증된 토큰. E2E(Playwright+axe)는 후속 bmad-qa. | 수용 |

### 종합
셸·토큰·a11y 베이스라인이 스파인대로 섰고 CI 실측 green. 재사용 1순위 헬퍼(`DirectionalValue`)의 NaN 견고성을 리뷰에서 보강. CI 잡 이름 안정화로 향후 게이트 확장 시 required-check 깨짐도 예방. **머지 권장.**
