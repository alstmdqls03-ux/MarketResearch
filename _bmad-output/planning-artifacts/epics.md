---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-06-22'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-market-insight-os-2026-06-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-market-insight-os-2026-06-21/EXPERIENCE.md
  - idea.md
---

# Market Insight OS - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Market Insight OS, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**계정 & 관심종목**
- FR1: 사용자는 계정을 만들고 로그인할 수 있다.
- FR2: 사용자는 자신의 데이터(관심종목·결정·일지)에만 접근할 수 있다(타 사용자 격리).
- FR3: 사용자는 미국 종목을 관심종목에 추가·삭제할 수 있다.
- FR4: 신규 사용자는 관심종목 1개 입력만으로 즉시 가치(리서치 카드)를 받는다.
- FR43: 시스템은 유효하지 않거나 지원하지 않는 종목 입력을 거부하고 안내한다.

**종목 리서치**
- FR5: 사용자는 종목별 리서치 카드를 요청할 수 있다.
- FR6: 리서치 카드는 상승 논리와 하락 리스크를 분리해 제시한다.
- FR7: 리서치 카드는 공개 데이터(공시·뉴스·재무)를 근거로 하고 출처를 표기한다.
- FR8: 리서치 카드는 종목 매수/매도를 추천하지 않는다(체크포인트 형태).
- FR9: 사용자는 실적 일정 등 핵심 체크포인트를 볼 수 있다.

**판단 기록 (Journaling)**
- FR10: 사용자는 매수 전 30초 체크(이유·최대 리스크·기간·감정)를 탭/선택으로 기록할 수 있다(타이핑 선택).
- FR11: 시스템은 결정 기록 시 그 시점 가격·지표 스냅샷(사용자가 본 정보 집합, as-of 포함)을 함께 저장한다.
- FR12: 결정과 스냅샷은 원자적으로 저장된다(하나 실패 시 모두 롤백).
- FR13: 사용자는 매도 전 체크(이유·감정·계획 변화)를 기록할 수 있다.
- FR14: 충동 감정(FOMO/공포 등) 입력 시 시스템은 비강제 마이크로 개입("계획인가 감정인가")을 제시한다.
- FR15: 기록된 결정은 수정 불가(append-only)이며 변경은 버전으로 남는다.
- FR16: 같은 종목 반복 매수는 각각 별도 결정으로 기록된다(물타기 추적).
- FR17: 사용자는 과거 결정을 소급 기록할 수 있다(스냅샷은 '기록 시점' 표시).
- FR18: 사용자는 목표가·손절 기준을 선택적으로 기록할 수 있다.
- FR39: 사용자가 매도를 고려할 때, 시스템은 해당 보유의 원래 매수 논리·목표가·손절·투자기간을 함께 보여준다.

**복기 & 판단 품질**
- FR19: 시스템은 결정 기록 직후 단일 결정 기반 즉시 통찰을 제시한다(콜드스타트 대응).
- FR20: 시스템은 매도 시 또는 기간(1주/1개월) 경과 시 AI 복기를 생성한다.
- FR21: 복기는 사용자의 계획 준수 여부만 평가하고 종목의 미래·적합성은 언급하지 않는다.
- FR22: 복기는 사용자가 결정 시점에 본 정보로만 평가한다(공정성).
- FR23: 복기·통찰은 구체적 데이터 포인트 최소 1개를 인용한다.
- FR24: 시스템은 사용자의 과거 일지를 참조해 개인 맥락(예: 추격매수 이력)을 제시한다.
- FR25: 시스템은 프로세스 완수율 기반 Insight Score를 산출한다.
- FR26: Insight Score는 채점이 아니라 패턴을 비추는 형태로 제시된다(거울).
- FR40: 시스템은 매도 결정을 해당 종목의 미결 매수 결정과 연결해 결과(보유기간·손익)를 산출한다.
- FR41: 사용자는 자신의 프로세스 완수율 추세(시간 경과)를 볼 수 있다.

**시장 개요**
- FR27: 사용자는 대시보드에서 주요 지수·거시 지표와 관심종목 변화를 볼 수 있다.
- FR28: 사용자는 투자자 관점의 일일 시장 브리프를 볼 수 있다.
- FR29: 일일 브리프는 뉴스가 사용자의 관심종목에 미치는 영향을 연결해 제시한다.
- FR30: 대시보드는 미완료 복기를 알린다.
- FR31: 시스템은 리서치만 보는 사용자에게 비강제 넛지로 첫 기록을 유도한다.

**신뢰 & 안전**
- FR32: 모든 시세는 신선도(as-of) 시각과 함께 표기된다.
- FR33: 데이터 오류·지연 시 시스템은 조용히 넘어가지 않고 가시적으로 알린다.
- FR34: AI 생성 출력에는 면책 고지가 함께 표시된다(per-output).
- FR42: AI 생성(리서치 카드·복기) 실패 시 시스템은 사용자에게 알리고 재시도를 제공한다.

**운영 & 데이터**
- FR35: 시스템은 EOD 시세·재무·공시·뉴스를 수집·캐시한다.
- FR36: 시스템은 야간 배치로 EOD 갱신·기간경과 복기·점수 갱신·RAG 인제스트를 수행한다.
- FR37: 운영자는 파이프라인 실패를 모니터링하고 재시도·대체 소스로 복구할 수 있다.
- FR38: 시스템은 LLM 사용 비용을 추적한다.

### NonFunctional Requirements

- NFR-U1: 핵심 루프 필수 입력은 키보드 없이 탭/선택/스크롤로 완료(타이핑 선택).
- NFR-U2: 매수 체크 입력 중앙값 < 30초 — 의도된 과속방지턱(0으로 최적화 금지).
- NFR-U3: 모바일 핵심 액션은 엄지 도달 영역, 탭 타깃 ≥ 44px.
- NFR-U4: 선택 칩은 "기타(직접)" 옵션 포함(거짓 기록 방지).
- NFR-P1: 30초 체크 입력 반응 < 100ms.
- NFR-P2: 대시보드 초기 로드 < 2s(캐시 EOD).
- NFR-P3: 리서치 카드·복기 생성은 비동기 + 진행 표시, 동일 종목 재요청은 캐시 즉시.
- NFR-AC1: WCAG 2.1 AA 지향(대비·키보드·스크린리더·큰 터치 타깃).
- NFR-R1: 결정+스냅샷 단일 트랜잭션, 고아 결정 0.
- NFR-R2: 시세 신선도 임계 초과 시 가시적 degrade, 누락 지표 경고.
- NFR-A1: 복기·통찰은 데이터 포인트 ≥1 인용, 미달 시 차단/재생성.
- NFR-A2: 복기에 종목 추천/미래 예측 문구 0건(가드레일).

### Additional Requirements

- AR1: 스타터 초기화 — `npx create-next-app -e with-supabase` (Next 16 + shadcn + Supabase SSR Auth) + `uv init --app` FastAPI. **Epic 1 Story 1.**
- AR2: Supabase 스키마·RLS(`user_id=auth.uid()`)·`record_decision` RPC·pgvector — `supabase/migrations` 단일 소유(Alembic 금지).
- AR3: `decisions.snapshot_json`에 `viewed_research_card_id` NOT NULL(카드 기반 매수) + `research_cards` 불변/버전(복기 공정성 척추).
- AR4: 단일 LLM chokepoint `services/llm/generate()` + 구조화 출력(스키마에 recommendation 필드 부재) + AI 출력 no streaming + 유계 재시도(≤2)→가시적 실패.
- AR5: snake_case 와이어 통일 + `supabase gen types`/zod satisfies/OpenAPI 단일 진실원 + CI 게이트(tsc→eslint→pytest→types-diff).
- AR6: 시장데이터 provider 추상화(yfinance 1차→Finnhub 폴백) + 캐시 우선(securities·price_snapshots·research_cards).
- AR7: 스케줄러 — Supabase Cron(pg_cron+pg_net)→FastAPI 배치 엔드포인트(공유 시크릿) + pg_cron 복구 잡(stuck status 리셋).
- AR8: 인증 신뢰 경계 — FastAPI가 Supabase JWT 로컬 검증(HS256), 사용자 토큰 클라이언트로 RPC 호출, service_role=배치 전용 격리.
- AR9: D14 단계적 분리 — Week1 단일 Next.js(Vercel), AI 로직 모듈 격리 → Week3-4 FastAPI(Fly.io) 분리. 모노레포 2폴더(/web,/api).
- AR10: LLM 비용 추적 — append-only `llm_usage`(model·in/out 토큰·cost·purpose·user).

### UX Design Requirements

- UX-DR1: 디자인 토큰 적용 — Deep Indigo(라이트 #4F46E5/다크 #818CF8), 한국식 등락색(상승 #E5383B/하락 #2563EB)+부호/화살표 글리프, Pretendard+tabular-nums, 라이트/다크 2벌(shadcn 오버라이드).
- UX-DR2: 컴포넌트 research-card(상승/하락 분리, as-of, 출처, per-output 면책, 캐시 즉시).
- UX-DR3: 컴포넌트 chip(탭 단일/다중, `aria-pressed`, "기타(직접)" 타이핑 전환).
- UX-DR4: 컴포넌트 progressive-disclosure(감정 탭→"계획인가 감정인가"→필드 펼침, SR announce).
- UX-DR5: 컴포넌트 button-primary(화면당 1개 주행동, 비동기 시 진행 표시).
- UX-DR6: 컴포넌트 asof-badge(모든 시세 신선도, 임계 초과 degrade).
- UX-DR7: 컴포넌트 disclaimer(모든 AI 출력 per-output 1줄).
- UX-DR8: 컴포넌트 score-mirror(채점 아닌 패턴 문장+추세).
- UX-DR9: 컴포넌트 async-state(UI 비차단·진행·실패 시 재시도).
- UX-DR10: 접근성 — WCAG AA, ≥44px, 색+글리프 병기, 칩 aria-pressed, 점진공개 aria-live, 비동기 오류 role=alert, 30초 self-paced(2.2.1 비위반).
- UX-DR11: 반응형 — 모바일 우선(하단 탭바: 대시보드/관심종목/Score/Daily Brief) + 데스크톱 멀티컬럼, WebView 셸.
- UX-DR12: 주요 플로우 — J0 온보딩(빈손 방지) · 민수 성공 루프 · 민수 엣지(공포매도 직면) · 지영(출근길 뉴스) · J5(lurker→첫 기록).

### FR Coverage Map

- FR1: Epic 1 — 가입·로그인
- FR2: Epic 1 — 사용자 데이터 격리(RLS)
- FR3: Epic 1 — 관심종목 추가·삭제
- FR43: Epic 1 — 유효하지 않은 종목 입력 거부·안내
- FR27: Epic 1 — 지수·거시·관심종목 변화(기본 대시보드, E4에서 통합 확장)
- FR32: Epic 1 — as-of 신선도 표기(횡단)
- FR33: Epic 1 — 데이터 오류 가시적 알림(횡단)
- FR35: Epic 1 — EOD 시세 수집·캐시
- FR4: Epic 1 — 즉시 가치 최소판(종목 팩트 패널, AI 없음) / Epic 3 — 풀 리서치 카드
- FR10: Epic 2 — 매수 전 30초 체크
- FR11: Epic 2 — 결정 시점 스냅샷 저장
- FR12: Epic 2 — 결정+스냅샷 원자 저장
- FR13: Epic 2 — 매도 전 체크
- FR14: Epic 2 — 충동 감정 마이크로 개입
- FR15: Epic 2 — append-only 버전
- FR16: Epic 2 — 종목 반복 매수 별도 기록(물타기)
- FR17: Epic 2 — 과거 결정 소급 기록
- FR18: Epic 2 — 목표가·손절 선택 기록
- FR39: Epic 2 — 매도 고려 시 원래 매수 논리 대조
- FR5: Epic 3 — 리서치 카드 요청
- FR6: Epic 3 — 상승논리/하락리스크 분리
- FR7: Epic 3 — 공개 데이터 근거·출처 표기
- FR8: Epic 3 — 추천 없음(체크포인트)
- FR9: Epic 3 — 실적 등 핵심 체크포인트
- FR19: Epic 3 — 결정 직후 즉시 통찰(AI 인프라 가동 후)
- FR28: Epic 3 — 일일 시장 브리프
- FR29: Epic 3 — 뉴스→관심종목 영향 연결
- FR31: Epic 3 — 비강제 넛지로 첫 기록 유도
- FR34: Epic 3 — per-output 면책 고지(횡단)
- FR42: Epic 3 — AI 생성 실패 알림·재시도(횡단)
- FR38: Epic 3 — LLM 비용 추적
- FR20: Epic 4 — 매도/기간경과 AI 복기
- FR21: Epic 4 — 계획 준수만 평가
- FR22: Epic 4 — 본 정보로만 평가(공정성)
- FR23: Epic 4 — 데이터 포인트 ≥1 인용
- FR24: Epic 4 — 개인 일지 맥락 인용
- FR40: Epic 4 — 매도↔매수 연결·결과 산출
- FR30: Epic 4 — 미완료 복기 알림(대시보드 통합)
- FR36: Epic 4 — 야간 배치(EOD·복기·점수·RAG)
- FR37: Epic 4 — 운영자 파이프라인 모니터·복구
- FR25: Epic 4 (마지막·경량·컷 가능) — 프로세스 완수율 Insight Score
- FR26: Epic 4 (마지막·경량·컷 가능) — 거울(채점 아님)
- FR41: Epic 4 (마지막·경량·컷 가능) — 완수율 추세

> **재배치 근거(Party Mode: John·Sally·Amelia):** HERO 저널(AI 불필요)을 앞으로 당겨 도그푸딩 2주 생존 확보. 모든 AI/RAG를 Epic 3에 모아 FastAPI를 greenfield로 한 번에 도입(중간 이주 비용 0). 스키마는 Epic 1 일괄 동결. Insight Score는 표본 부족 리스크로 후순위·컷 가능. → **D14 단계 갱신: Epic 1–2 단일 Next.js(AI 없음, Week1–2) → Epic 3 FastAPI greenfield(Week3).**

## Epic List

### Epic 1: 기반 + 첫인상 — 로그인하고 관심종목·시세·종목 팩트를 본다
가입·로그인 후 미국 종목을 관심종목에 등록하고 EOD 시세·주요 지수를 본다. 신규 사용자는 **종목 팩트 패널**(가격·재무지표, AI 없음)로 빈손을 면한다. 스타터 초기화·**Supabase 스키마 일괄 동결**(decisions JSONB·RLS·`record_decision` RPC stub·research_cards 코어 테이블)·시장 provider+폴백·캐시. 단일 Next.js, AI 없음. 독립: 완결된 인증+관심종목+시세+팩트.
**FRs covered:** FR1, FR2, FR3, FR43, FR4(최소판), FR27, FR32, FR33, FR35

### Epic 2: 판단 저널 (HERO, AI-free) — 30초로 기록하고 스냅샷을 남긴다
매수 전 30초 체크(점진공개·칩) + 결정 시점 스냅샷 **원자 저장**(`record_decision` RPC), 매도 체크(원래 매수 논리 대조), append-only 버전·물타기. **AI 불필요** → Week2부터 도그푸딩 가동. 단일 Next.js. 독립: 완결된 저널+스냅샷.
**FRs covered:** FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR39

### Epic 3: 종목 리서치 + AI 인프라 — 카드로 이해하고 즉시 통찰을 받는다
상승논리/하락리스크 분리 카드(출처·체크포인트), 일일 브리프, 결정 직후 즉시 통찰, 비강제 넛지. **FastAPI greenfield**(LLM chokepoint·구조화 출력=recommendation 필드 부재·no streaming·유계 재시도)·RAG 인제스트·research_cards 불변/버전·면책·비용 추적. 저널 스냅샷이 카드 버전을 핀(공정성). 독립: 리서치+브리프+통찰.
**FRs covered:** FR4(풀), FR5, FR6, FR7, FR8, FR9, FR19, FR28, FR29, FR31, FR34, FR42, FR38

### Epic 4: 복기 & 거울 — 한 달 뒤 판단을 비추고 성장을 본다
시간경과/매도 시 AI 복기(계획 준수만·본 정보로만·데이터 인용), 매도↔매수 결과 산출, 대시보드 통합(미완료 복기 알림), 야간 배치+스케줄러+운영자 모니터. **Insight Score(거울)는 마지막 스토리·객관 완수율 %만·시간 부족 시 컷.** 독립: 루프 완결.
**FRs covered:** FR20, FR21, FR22, FR23, FR24, FR40, FR30, FR36, FR37, FR25(컷 가능), FR26(컷 가능), FR41(컷 가능)

### 재배치 정제 노트 (Party Mode 2차 — step-03 스토리 AC에 반영)

1. **Epic 2 — "근거 한 줄" 필수 + "아직 리서치 안 함" 라벨(Sally):** 30초 체크에 자유 입력 근거 한 줄을 필수화(빈 감정 태깅 방지 — 고치려는 그 행동). 카드 부재 시 "판단 연습장, 리서치 곧 붙음" 라벨. 거꾸로 순서를 기초공사로 전환.
2. **공정성 핀(Winston·Amelia):** Epic 2는 `viewed_research_card_id` **nullable + `card_existed` sentinel**(정직한 "카드 없었음" 기록). Epic 3에서 partial CHECK(`NOT VALID`→`VALIDATE CONSTRAINT`)로 조임. 조건부 NOT NULL을 Epic 2에 걸지 않음.
3. **`record_decision` 계약 동결(Winston):** 시그니처·입출력 스키마·"단일 트랜잭션 append-only" 계약을 **Epic 1에 동결**, stub은 `not_impl`만. Epic 2에서 시그니처 변경 금지(impl만).
4. **stub 단계 강제(Amelia):** Epic 1 계약 테스트(`signature`·`appends_not_updates`·`returns_decision_id`·`jsonb_shape`) + **append-only RLS/trigger는 stub 단계부터 LIVE**. Epic 3 마이그레이션은 **backfill UPDATE 금지**(content_hash 등은 GENERATED 컬럼).
5. **Epic 3 슬라이스 축소(Winston) + 스키마 구멍(Amelia):** Epic 3 비타협 = "FastAPI 엔드포인트 1개·카드 1장". **RAG v0 = 소스 프롬프트 인라인 주입**(임베딩 벡터 검색은 후순위 스토리). nudge/즉시통찰은 부하 시 후순위. **`purchase_type` enum을 Epic 1 스키마 동결에 포함**(card/manual 등).

> **AC 자기완결(Paige):** 위 정제 사항은 모두 해당 스토리 AC 본문에 인라인 전개됨. 본 노트는 설계 근거 아카이브일 뿐, 스토리 구현은 각 AC만으로 자기완결적이어야 한다(에이전트가 콜드로 집어도 외부 참조 불필요).

> **Phase-2 메모(Sally — MVP 밖):** **알림 표면 UX**(푸시→충동 0.5초 완충, 알림 카피·알림→즉시통찰 감정 완충). 충동(FOMO·공포매도)은 앱 밖 알림에서 시작되나 현재 5개 플로우는 "앱 열고 진입"만 전제. **단 idea.md 부록 B상 알림 채널은 의도적 MVP 제외(인앱만)** → 알림 표면 자체가 MVP에 없으므로 **Phase 2**로 둔다. 알림 도입 시 이 스토리를 함께 설계.

---

## Epic 1: 기반 + 첫인상 — 로그인하고 관심종목·시세·종목 팩트를 본다

가입·로그인 후 미국 종목을 관심종목에 등록하고 EOD 시세·주요 지수·종목 팩트를 본다. 단일 Next.js(Vercel), AI 없음. 스키마·RLS·record_decision 계약은 Epic 1에서 일괄 동결한다.

### Story 1.1: 모노레포 스타터 부트스트랩 + CI 게이트

투자자 도구 개발자로서, 두 서비스 모노레포를 스타터로 초기화하고 싶다. 그래야 일관된 기반 위에서 안전하게 기능을 쌓을 수 있다.

**Acceptance Criteria:**

**Given** 빈 저장소에서
**When** `npx create-next-app -e with-supabase`로 `/web`를, `uv init --app`로 `/api` 골격을 초기화하면 (AR1, AR9)
**Then** 모노레포 2폴더(`/web`, `/api`)가 서고 shadcn/ui·Supabase SSR Auth가 사전 배선된다
**And** CI 파이프라인(`tsc --noEmit`→`eslint`→`pytest`→`supabase gen types | diff`, AR5)이 설정되고 하나라도 실패 시 머지가 차단된다
**And** `/web`가 Vercel에 배포되어 공개 URL로 접속된다

### Story 1.2: 회원가입·로그인 (SSR 쿠키 세션)

투자자로서, 계정을 만들고 로그인하고 싶다. 그래야 내 데이터를 안전하게 보관하고 다시 찾을 수 있다.

**Acceptance Criteria:**

**Given** Supabase Auth가 배선된 상태에서
**When** 신규 사용자가 이메일로 가입·로그인하면
**Then** SSR 쿠키 세션이 생성되고 보호 경로에 접근할 수 있다 (FR1)

**Given** 로그아웃 상태에서
**When** 보호 경로에 직접 접근하면
**Then** 로그인 화면으로 리다이렉트된다

### Story 1.3: 스키마 일괄 동결 + RLS + record_decision 계약 stub

개발자로서, 핵심 스키마와 결정 기록 계약을 처음에 동결하고 싶다. 그래야 이후 에픽이 시그니처 변경 없이 속만 채울 수 있다.

**Acceptance Criteria:**

**Given** `supabase/migrations`(단일 소유, Alembic 금지)에서
**When** 마이그레이션을 적용하면 (AR2)
**Then** `profiles · watchlist_items · securities · price_snapshots · research_cards(코어 PK + purchase_type enum: 'card'|'manual') · decisions(생명주기 JSONB) · llm_usage` 테이블과 RLS(`user_id = auth.uid()`)가 생성된다
**And** `decisions`의 `viewed_research_card_id`는 **nullable**, `card_existed`는 **boolean**으로 선언된다(카드 없이 기록한 결정을 정직히 구분)

**Given** 단일 `decisions` 행의 **JSONB 키 셋을 4개 에픽분 모두 사전 동결**해야 하므로
**When** 스키마를 동결하면
**Then** `rationale`(이유·최대리스크·기간·감정·목표가·손절·근거 한 줄), `snapshot_json`(price_at_decision·지표·as_of·snapshot_status·viewed_research_card_id·card_existed), `outcome_json`(matched_buy_id·holding_period·pct_return·matched_status), `ai_review`(verdict·cited_points·model) — **전 키가 snake_case로 명시 동결**되어 하류 에픽이 append 시 트리거 거부가 없다 (Amelia)

**Given** `record_decision` RPC 계약을 동결하되 본문은 `RAISE EXCEPTION 'not_impl'`이면
**When** 계약 테스트를 돌리면
**Then** **계약 = `record_decision(p_user uuid, p_ticker text, p_action text, p_rationale jsonb) → decision_id uuid`, 단일 트랜잭션 원자성(NFR-R1), append-only**가 고정되고, 테스트(`signature`·`appends_not_updates`·`returns_decision_id`·`jsonb_shape`)가 통과한다
**And** **append-only RLS/trigger는 stub 단계부터 LIVE**(UPDATE/DELETE 거부)이고, service_role 키는 배치 전용으로 격리된다 (AR8)

### Story 1.4: 관심종목 추가·삭제 + 티커 검증

투자자로서, 미국 종목을 관심종목에 넣고 빼고 싶다. 그래야 내가 보는 종목에 집중할 수 있다.

**Acceptance Criteria:**

**Given** `watchlist_items`(RLS) 위에서
**When** 사용자가 유효한 미국 티커(예: NVDA)를 추가/삭제하면
**Then** 목록에 즉시 반영된다 (FR3)

**Given** 존재하지 않거나 미지원 티커를 입력하면
**When** 추가를 시도하면
**Then** 시스템은 추가를 거부하고 명확한 안내 메시지를 보여준다 (FR43)

### Story 1.5: EOD 시세 provider 추상화 + 캐시 + 폴백 (HTTP REST)

투자자로서, 관심종목의 최신 종가를 보고 싶다. 그래야 시장 상황을 파악할 수 있다.

**Acceptance Criteria:**

**Given** provider 인터페이스(AR6) 뒤에서 — **Epic 1은 FastAPI가 없으므로 HTTP REST API(예: Finnhub) 로만 시세를 받는다**(yfinance 등 Python 라이브러리 경로는 FastAPI가 생기는 Epic 3에서 동일 인터페이스로 합류)
**When** Next.js가 시세를 요청하면
**Then** `price_snapshots` 캐시 우선으로 EOD 종가를 반환한다 (FR35)

**Given** 1차 REST provider가 실패하면
**When** 폴백이 동작하면
**Then** 보조 REST provider로 채우고, 둘 다 실패 시 마지막 캐시+as-of로 가시적 degrade를 표시한다 (NFR-R2)

**Given** 신규 상장 등으로 데이터가 전혀 없으면
**When** 시세를 요청하면
**Then** 빈 값을 조용히 숨기지 않고 "데이터 없음"을 명시한다 (FR33)

### Story 1.6: 종목 팩트 패널 (첫인상, AI 없음)

신규 사용자로서, 관심종목 1개만 넣어도 즉시 뭔가 보고 싶다. 그래야 빈 화면에 이탈하지 않는다.

**Acceptance Criteria:**

**Given** 관심종목 1개가 등록되면
**When** 종목 상세를 열면
**Then** 가격·핵심 재무지표(P/E·시총 등)를 캐시 기반 **팩트 패널**(AI 없음)로 즉시 보여준다 (FR4 최소판)
**And** "풀 리서치 카드는 곧" 라벨로 다음 가치를 예고한다

### Story 1.7: 기본 대시보드 + as-of 배지 + 가시적 오류

투자자로서, 주요 지수와 관심종목 변화를 한 화면에서 보고 싶다. 그래야 오늘 시장을 빠르게 파악한다.

**Acceptance Criteria:**

**Given** 대시보드에서
**When** 진입하면
**Then** 주요 지수·거시와 관심종목 변화를 한국식 등락색(상승 빨강/하락 파랑)+글리프로 보여준다 (FR27, UX-DR1)
**And** 모든 시세에 as-of 신선도 배지가 동반된다 (FR32, UX-DR6)

**Given** 데이터 오류·지연 시
**When** 화면이 렌더되면
**Then** 조용히 넘어가지 않고 가시적으로 알린다 (FR33)

### Story 1.8: 앱 셸 — 반응형 레이아웃 + 하단 탭바 + 접근성 베이스라인

> **기초 스토리 — 피처 화면(1.4~1.7)보다 먼저 구현해 이후 모든 화면이 상속.**

사용자로서, 모바일·데스크톱에서 일관된 내비게이션과 접근성을 원한다. 그래야 어디서나 매끄럽게 쓸 수 있다.

**Acceptance Criteria:**

**Given** 앱 셸에서
**When** 모바일로 접속하면
**Then** 하단 탭바(대시보드/관심종목/Score/Daily Brief)가 엄지 영역에 뜨고, 데스크톱은 사이드 내비+멀티컬럼으로 확장된다(WebView 셸) (UX-DR11, NFR-U3)

**Given** 접근성 베이스라인이 적용되면
**When** 컴포넌트를 렌더하면
**Then** 탭 타깃 ≥44px, 칩 선택은 `aria-pressed`, 점진공개는 `aria-live`, 등락은 색+부호/화살표 글리프 병기, 비동기 오류는 `role="alert"`로 노출된다 (UX-DR10, NFR-AC1)
**And** DESIGN.md 토큰(Deep Indigo·한국식 등락색·Pretendard+tabular-nums, 라이트/다크)이 shadcn 위에 오버라이드된다 (UX-DR1)

---

## Epic 2: 판단 저널 (HERO, AI-free) — 30초로 기록하고 스냅샷을 남긴다

매수/매도 결정을 30초 탭 기록 + 결정 시점 스냅샷 원자 저장. AI 불필요 → Week2부터 도그푸딩 가동. 단일 Next.js.

### Story 2.1a: record_decision 구현 + 원자 스냅샷 (백엔드)

개발자로서, 결정과 그 시점 스냅샷을 단일 트랜잭션으로 저장하고 싶다. 그래야 고아 결정 없이 복기가 가능하다.

**Acceptance Criteria:**

**Given** 동결된 계약 `record_decision(p_user uuid, p_ticker text, p_action text, p_rationale jsonb) → decision_id uuid`(시그니처 변경 없음) 위에서
**When** 근거 JSONB + ticker로 RPC를 호출하면
**Then** 근거 JSONB + EOD 캐시 기반 스냅샷이 **단일 트랜잭션으로 원자 저장**되고 decision_id를 반환한다 (FR10, FR11, FR12, NFR-R1)
**And** 카드 부재 시 `viewed_research_card_id=NULL`, `card_existed=false`로 정직하게 기록된다

**Given** 결정 시점 EOD 스냅샷 소스가 비어 있으면(미캐시·미지원)
**When** record_decision를 호출하면
**Then** 결정은 저장되되 스냅샷은 `snapshot_status='unavailable'` + as-of NULL로 명시 기록되고(조용한 부분 저장 금지), 결정-스냅샷 원자성(둘 다 기록 or 둘 다 롤백)은 유지된다 (NFR-R1, NFR-R2)

### Story 2.1b: 매수 전 30초 체크 UX (프런트)

투자자로서, 매수 직전 30초만 멈춰 이유·리스크·기간·감정을 남기고 싶다. 그래야 나중에 그 판단을 되돌아볼 수 있다.

**Acceptance Criteria:**

**Given** 매수 30초 체크 시트에서
**When** 사용자가 이유·최대 리스크·기간·감정 칩을 탭으로 완료하면
**Then** 필수 입력은 키보드 없이 탭/선택으로 완료되고 반응은 <100ms이며(NFR-U1, NFR-P1, UX-DR3·4), 저장 시 Story 2.1a의 record_decision를 호출한다
**And** **"왜 사니?" 근거 한 줄이 필수 입력**이고, 카드 없이 진입 시 "아직 리서치 안 함 · 판단 연습장" 라벨이 표시된다

**Given** 근거 한 줄이 비어 있으면
**When** 저장을 시도하면
**Then** 저장이 막히고 근거 입력을 요구한다(빈 감정 태깅 방지)

**Given** 카드(리서치) 부재로 "아직 리서치 안 함" 라벨이 뜬 상태에서 (Sally — 침묵 구간 방지)
**When** 결정을 저장한 직후
**Then** "리서치 곧"으로 끝내지 않고 **지금 할 수 있는 1탭 행동**(예: 방금 기록 "되돌아보기"/내 결정 이력 보기)을 제시해 다음 행동의 공백을 메운다

### Story 2.2: 충동 감정 마이크로 개입

투자자로서, 충동적으로 살 때 한 번 멈칫하고 싶다. 그래야 감정과 계획을 구분할 수 있다.

**Acceptance Criteria:**

**Given** 감정 칩에서 FOMO/불안/조급/복수매매를 선택하면
**When** 점진 공개가 트리거되면
**Then** "지금 계획인가요, 감정인가요?" 비강제 마이크로카피가 출현한다 (FR14)
**And** 사용자의 행동을 막지 않으며, 기록은 그대로 진행된다(막지 않고 직면)

### Story 2.3: 목표가·손절 선택 입력

투자자로서, 목표가·손절 기준을 선택적으로 남기고 싶다. 그래야 나중에 계획 준수를 확인할 수 있다.

**Acceptance Criteria:**

**Given** 30초 체크에서
**When** 목표가/손절을 선택 입력하면
**Then** `rationale` JSONB에 함께 저장된다 (FR18)
**And** 미입력 시에도 결정 저장은 정상 동작한다(선택 항목)

### Story 2.4: 매도 전 체크 + 원래 매수 논리 대조

투자자로서, 팔기 전에 내가 왜 샀는지 다시 보고 싶다. 그래야 공포 매도를 직면할 수 있다.

**Acceptance Criteria:**

**Given** 보유 종목의 미결 매수 결정이 존재하면
**When** 매도 전 체크를 열면
**Then** 원래 매수 논리·목표가·손절·투자기간을 함께 보여준다 (FR39)
**And** 매도 이유·감정·계획 변화를 탭으로 기록한다 (FR13)

### Story 2.5: 기록 무결성 — append-only·물타기·소급 기록

투자자로서, 내 결정 이력이 조작 없이 쌓이길 원한다. 그래야 복기가 공정하다.

**Acceptance Criteria:**

**Given** 기록된 결정은 수정 불가(append-only)이고
**When** 변경이 필요하면
**Then** 새 버전 행으로 누적된다(이전 행 superseded) (FR15)

**Given** 같은 종목을 반복 매수하면
**When** 각각 기록하면
**Then** 별도 결정으로 추적된다(물타기) (FR16)

**Given** 과거 결정을 뒤늦게 기록하면
**When** 소급 입력하면
**Then** 스냅샷은 '기록 시점'으로 정직하게 표시된다 (FR17)

---

## Epic 3: 종목 리서치 + AI 인프라 — 카드로 이해하고 즉시 통찰을 받는다

상승/하락 분리 리서치 카드·일일 브리프·즉시 통찰·넛지. FastAPI greenfield에 AI 인프라를 한 번에 도입. 비타협은 "엔드포인트 1개·카드 1장".

### Story 3.1a: FastAPI greenfield + JWT 검증 부트스트랩

개발자로서, FastAPI 서비스를 인증 경계와 함께 세우고 싶다. 그래야 AI 기능을 안전한 기반 위에 얹을 수 있다.

**Acceptance Criteria:**

**Given** `/api`에 FastAPI greenfield(uv)를 세우고 Fly.io에 배포하면 (AR9)
**When** Next.js→FastAPI 호출 시 `Authorization: Bearer`가 오면
**Then** FastAPI가 Supabase JWT를 로컬 검증(HS256, `audience="authenticated"`)하고 `sub`=user_id로 사용자 스코프로만 동작한다 (AR8)
**And** service_role 키는 배치 전용으로만 사용되고, CORS는 Next.js 오리진만 허용한다

**Given** JWT가 만료/위조되면
**When** 요청이 오면
**Then** 401과 에러 봉투 `{error:{code,message,retryable}}`를 반환한다

**Given** E3 AI 로직 착수 *전에* (Winston — 통합을 미루지 말 것)
**When** 본 스토리를 완료하면
**Then** **"Hello + 인증된 RPC 1왕복" 워킹 스켈레톤**(Next.js→Fly.io FastAPI→Supabase→응답)이 종단 간 통과하고, 이후 카드/통찰 로직은 검증된 통합 위에 얹는다

개발자로서, 모든 AI 생성을 단일 통로로 강제하고 싶다. 그래야 가드레일을 한 곳에서 박을 수 있다.

**Acceptance Criteria:**

**Given** `services/llm/generate()` 단일 chokepoint 위에서 (AR4)
**When** AI 생성을 호출하면
**Then** **구조화 출력 스키마(JSON)에 recommendation 필드가 존재하지 않고**(조언 슬롯 제거), 출력은 스트리밍하지 않고 생성→완료 후 렌더된다
**And** `anthropic` 직접 import는 chokepoint 외부에서 금지(CI grep)되며, 모든 생성은 `llm_usage`에 토큰·비용이 기록된다 (FR38)

**Given** 구조화 출력 JSON 파싱이 실패하거나 모델 API가 다운/레이트리밋이면
**When** 생성을 시도하면
**Then** 유계 재시도(≤2, 실패 사유 피드백)를 수행하고, 최종 실패 시 **degraded 출력이 아니라 가시적 재시도 상태**를 반환한다 (FR42, NFR-A2)

**Given** 재시도가 소진된 뒤 (Amelia — 소비처 3곳: 즉시통찰·브리프·넛지)
**When** 각 소비 화면이 렌더되면
**Then** **graceful degrade 표면**(빈 통찰/카드 fallback + "지금은 생성하지 못했어요 · 재시도" CTA)을 일관되게 보여주고, 잘못된/빈 콘텐츠를 진짜처럼 노출하지 않는다

### Story 3.2: 리서치 카드 생성 (RAG v0 인라인) + 상승/하락 분리 + 출처

투자자로서, 종목의 상승 논리와 하락 리스크를 출처와 함께 분리해 보고 싶다. 그래야 재무제표 없이도 균형 있게 이해한다.

**Acceptance Criteria:**

**Given** chokepoint 위에서 RAG v0(공시·뉴스 소스를 프롬프트에 인라인 주입, 임베딩 벡터 검색은 후순위 스토리)로
**When** 종목 카드를 요청하면
**Then** 상승 논리와 하락 리스크를 **분리**해 제시하고 출처(공시/뉴스/재무)와 실적 체크포인트를 표기한다 (FR5,6,7,9)
**And** 매수/매도를 추천하지 않으며 per-output 면책이 동반된다 (FR8, FR34, UX-DR2·7)

**Given** 해당 종목의 공시/뉴스 소스가 비어 있으면(신규 상장·커버리지 없음)
**When** 카드를 생성하면
**Then** 출처 없는 카드를 만들지 않고, "공개 데이터 부족" 상태를 가시적으로 안내한다(환각 방지, FR33)

**Given** `research_cards`에 versioning(`version`·`content_hash` GENERATED·`superseded_by`)을 추가하고(기존 행 backfill UPDATE 금지)
**When** 카드를 재생성하면
**Then** 새 버전 행이 생기고 기존 행은 불변이며, `decisions.viewed_research_card_id`에 partial CHECK(`purchase_type='card' → NOT NULL`)를 `NOT VALID` 추가 후 `VALIDATE CONSTRAINT`로 적용한다

### Story 3.3: 빈손 온보딩 — 관심종목 1개로 즉시 풀 카드

신규 사용자로서, 관심종목 1개만 넣어도 풀 리서치 카드를 즉시 받고 싶다. 그래야 빈손으로 이탈하지 않는다.

**Acceptance Criteria:**

**Given** 신규 사용자가 관심종목 1개를 입력하면
**When** 온보딩이 진행되면
**Then** 즉시 풀 리서치 카드(상승/하락 분리)를 보여준다 (FR4 풀)
**And** "이 종목 사보신 적 있나요?" 소급 기록 옵션을 제시한다 (J0)

### Story 3.4: 결정 직후 즉시 통찰 (콜드스타트)

투자자로서, 첫 결정을 기록하자마자 작은 통찰을 받고 싶다. 그래야 복기 전에도 가치를 느낀다.

**Acceptance Criteria:**

**Given** 결정을 막 기록한 직후
**When** 통찰을 생성하면
**Then** 단일 결정 기반으로 구체적 데이터 포인트 ≥1개를 인용한 통찰을 제시한다 (FR19, FR23, NFR-A1)

**Given** 인용할 데이터 포인트가 없으면(스냅샷 unavailable 등)
**When** 통찰 생성을 시도하면
**Then** 빈 통찰을 억지로 만들지 않고(NFR-A1 차단), 결정 자체(근거/감정)를 비추는 사실 기반 한 줄로 정직하게 대체하거나 통찰을 생략한다

### Story 3.5: 일일 시장 브리프 (관심종목 영향)

투자자로서, 출근길 5분에 시장과 내 종목 상태를 파악하고 싶다. 그래야 충동에 휘둘리지 않는다.

**Acceptance Criteria:**

**Given** 대시보드/탭바에서
**When** 일일 브리프를 열면
**Then** 투자자 관점 시장 요약을 보여준다 (FR28)
**And** 브리프는 사용자의 **관심종목 ≥1개를 명시 참조**하며 해당 뉴스 영향을 연결해 제시한다(측정 가능) (FR29)

### Story 3.6: lurker → 첫 기록 비강제 넛지

리서치만 보는 사용자로서, 첫 기록의 가치를 강요 없이 알고 싶다. 그래야 자연스럽게 판단 루프에 진입한다.

**Acceptance Criteria:**

**Given** 리서치 카드 하단에서
**When** 기록이 0인 사용자가 카드를 보면
**Then** "30초로 남겨두면 한 달 뒤 옳았는지 알려드려요" 비강제 넛지를 보여준다 (FR31, J5)
**And** 행동을 막지 않는다

---

## Epic 4: 복기 & 거울 — 한 달 뒤 판단을 비추고 성장을 본다

시간경과/매도 시 AI 복기, 매도↔매수 결과 산출, 대시보드 통합, 야간 배치. Insight Score는 마지막·경량·컷 가능.

### Story 4.1: 매도↔매수 연결 · 결과 산출 (복기 선행)

투자자로서, 매도가 어떤 매수와 연결돼 어떤 결과였는지 알고 싶다. 그래야 복기가 그 결과를 인용할 수 있다.

**Acceptance Criteria:**

**Given** 매도 결정이 기록되면
**When** 결과를 산출하면
**Then** 해당 종목의 미결 매수 결정과 **결정 단위 FIFO(선입선출)** 로 연결해 보유기간과 **%기반 손익(진입가 vs 청산가, 수량 불필요)** 을 계산한다 (FR40)
**And** 매칭 규칙은 결정론적이고 문서화된다(추후 변경 시 버전)

**Given** 매칭되는 미결 매수가 없으면(고아 매도)
**When** 결과를 산출하면
**Then** `unmatched`로 표시하고 손익 산출을 생략한다(억지 매칭 금지)

### Story 4.2: AI 복기 생성 (매도 시 + 기간경과) + 가드레일

투자자로서, 한 달 뒤 내 판단이 계획대로였는지 비춰주길 원한다. 그래야 같은 실수를 줄인다.

**Acceptance Criteria:**

**Given** 매도 시(Story 4.1 결과 산출 후) 또는 기간(1주/1개월) 경과 시
**When** 복기가 생성되면
**Then** **사용자의 계획 준수 여부만** 평가하고 종목의 미래·적합성은 언급하지 않으며, Story 4.1의 outcome(보유기간·손익)을 인용한다 (FR20, FR21, NFR-A2, FR40)
**And** **결정 시점에 본 정보(핀된 스냅샷+카드 버전)로만** 평가하며(현재 시세 미참조), 구체 데이터 포인트 ≥1을 인용한다 (FR22, FR23, NFR-A1)
**And** 개인 일지를 참조해 개인 맥락(예: 추격매수 이력)을 제시한다 (FR24)

**Given** 결정이 `card_existed=false`(리서치 없이 기록)거나 스냅샷이 `unavailable`이면
**When** 복기를 생성하면
**Then** "리서치 없이 내린 판단"임을 정직하게 반영해 가진 정보로만 공정 평가하고, 생성 실패 시 가시적 재시도 상태를 반환한다 (FR22, FR42)

**Given** "한 달 뒤 복기"는 4주 MVP 안에 자연 발생하지 않으므로 (John — 시간 정합성 검증)
**When** Week4 도그푸딩 단계에서
**Then** **과거 날짜로 백데이트한 더미 결정 ≥5건**으로 기간경과 복기 트리거를 강제 리허설해, 실시간 한 달을 기다리지 않고도 복기 엔진이 진실을 말하는지(인용·공정성·가드레일) 검증한다

### Story 4.3: 대시보드 통합 — 미완료 복기 알림

투자자로서, 미완료 복기를 대시보드에서 바로 알고 싶다. 그래야 복기 습관이 유지된다.

**Acceptance Criteria:**

**Given** 대시보드에서
**When** 미완료 복기가 있으면
**Then** 알림 카드로 노출하고 복기로 진입할 수 있다 (FR30)
**And** 대시보드 초기 로드는 캐시 EOD 기준 <2s다 (NFR-P2)

### Story 4.4a: 스케줄러 + 복구 잡 + 운영자 관측성

운영자로서, 야간 파이프라인을 자동 트리거하고 멈춘 작업을 복구하고 싶다. 그래야 작업이 유실되지 않는다.

**Acceptance Criteria:**

**Given** Supabase Cron(pg_cron+pg_net)이 FastAPI 배치 엔드포인트를 공유 시크릿으로 호출하면 (AR7)
**When** 야간 스케줄이 발화하면
**Then** 배치 엔드포인트가 트리거되고, pg_cron 복구 잡이 stuck 상태(`processing` 5분 초과)를 `pending`으로 리셋한다

**Given** 파이프라인 실패 시
**When** 운영자가 확인하면
**Then** 실패를 가시적으로 표시하고 재시도/대체 소스로 복구할 수 있다 (FR37)

### Story 4.4b: 야간 배치 태스크 (EOD·복기·점수·인제스트)

운영자로서, 야간에 데이터·복기·점수를 갱신하고 싶다. 그래야 사용자가 아침에 최신 상태를 본다.

**Acceptance Criteria:**

**Given** 배치 엔드포인트가 트리거되면
**When** 배치가 돌면
**Then** EOD 갱신·기간경과 복기(due 쿼리)·점수 갱신·RAG 인제스트를 수행한다 (FR36)
**And** 각 태스크는 **멱등(idempotent)** 이고 status 가드로 중복 실행에 안전하다

**Given** 일부 태스크가 실패하거나 10분(pg_cron 한도)을 초과하면
**When** 배치가 진행되면
**Then** 성공 태스크는 커밋되고 실패는 다음 실행에 재처리되며(부분 실패 격리), 장시간 작업은 청크로 분할한다

### Story 4.5: Insight Score (거울) + 추세 — 경량·컷 가능

투자자로서, 내 판단 프로세스 완수율을 거울처럼 보고 싶다. 그래야 채점이 아니라 패턴으로 성장을 본다.

**Acceptance Criteria:**

**Given** 결정들의 객관 `process_flags`(리스크 사전기입·손절·복기완료 등)에서
**When** 점수를 산출하면
**Then** **채점이 아니라 패턴 문장**("매수 5건 중 2건만 리스크 사전 기입")으로 제시한다 (FR25, FR26)
**And** 프로세스 완수율 추세(시간 경과)를 보여준다 (FR41)

**Given** 결정이 0건이면(빈상태, 분모 0)
**When** Score를 열면
**Then** 숫자/퍼센트 대신 "첫 기록을 남기면 거울이 보이기 시작해요" 온보딩 빈상태를 보여준다(0으로 나누지 않음)

> **참고:** 본 스토리는 4주차 표본 부족 리스크로 **객관 완수율 %만**(AI 채점 없음) 구현하며, 시간 부족 시 v2로 컷한다.
