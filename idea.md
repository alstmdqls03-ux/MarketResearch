# Market Insight OS — Product Idea

> 개인 투자자가 매일 시장을 조사하고, 종목/섹터를 분석하고, 자기 투자 판단력을 기록·검증하면서 인사이트를 쌓는 AI 리서치 대시보드.
>
> **핵심 철학:** 경제적 자유는 좋은 종목 하나가 아니라, 좋은 판단을 반복하는 시스템에서 온다.

- **문서 상태:** Draft v0.1 (논의 확정본)
- **작성일:** 2026-06-21
- **작성자:** BMad + Claude (PM / AI Architect / Startup Advisor)
- **다음 단계:** 이 문서를 입력으로 BMad `create-prd` → `create-architecture` → `create-epics-and-stories` 진행

---

## 0. 논의로 확정된 핵심 결정 (Locked Decisions)

이 문서의 모든 설계는 아래 결정 위에 서 있다. 결정이 바뀌면 해당 섹션을 다시 본다.

| # | 결정 사항 | 선택 | 근거 |
|---|---|---|---|
| D1 | **MVP 시장 범위** | **US(미국 주식) 단일** | yfinance/Finnhub로 시세·재무가 깨끗하고 SEC filing 기반 RAG가 차별화에 최적. 데이터 난이도 최저. |
| D2 | **본인 실투자 시장** | 미국 주식 위주 | 실사용성과 데이터 난이도가 동시에 해결됨 (충돌 없음). |
| D3 | **MVP Hero 기능** | **판단 저널 + AI 복기** | 가장 강한 시나리오("매수 전 30초 체크") + 유일무이한 차별점("판단 디버거"). |
| D4 | **무게중심** | 실사용 우선 | 내가 매일 쓰는 도구 = 가장 설득력 있는 포트폴리오. 도그푸딩이 곧 검증. |
| D5 | **Cold-start 해법** | Research Card를 Hero의 의무 짝으로 MVP 포함 | 저널은 첫날 빈 통 → 리서치 카드가 첫 2주 retention 책임. |
| D6 | **루프 완결 메커니즘** | 판단 기록 시점에 **가격·지표 스냅샷 저장** | 스냅샷이 없으면 "이 판단이 옳았나" 평가 불가 → Hero 작동 불가. |
| D7 | **시세 데이터 신선도** | 종가/지연(EOD·15분) | 판단 저널·복기엔 충분, 비용·복잡도 최저. 무료 티어로 커버. |
| D8 | **AI 복기 트리거** | 매도 시 + 시간경과(1주/1개월) 자동 | 보유 중에도 판단 품질 평가 가능. |
| D9 | **Insight Score (MVP)** | 객관 **프로세스 완수율**만 라이트 포함 | "AI 주관 채점"은 자의적·조작 가능 → MVP는 검증 가능한 객관 지표만. AI 품질평가는 v2. |
| D10 | **LLM** | Claude (복기·리스크추론 = Opus / 요약 = Haiku) | 깊은 추론과 비용을 역할별 분리. |
| D11 | **RAG 벡터 저장소** | Supabase pgvector | DB·Auth·벡터를 한 스택으로 통합, 1인 운영 부담 최소. |
| D12 | **인증 모델** | 멀티유저 (Supabase Auth + RLS) | 비용 거의 0, 포트폴리오에 auth 있으면 보기 좋음. |
| D13 | **법적 스탠스** | 상승논리/하락리스크 분리 + 행동 지시 금지 + 면책 | 투자자문 규제 회피, 제품 철학과도 일치. |
| D14 | **아키텍처 경계** | Next.js(UI+Auth+CRUD) ↔ FastAPI(AI/RAG/시장데이터/배치) | Python 생태계(yfinance·RAG) 분리. 경계 못박아 늪 방지. |

---

## 1. Product Vision

**Market Insight OS**는 개인 투자자의 **투자 판단력 향상**을 위한 AI 리서치/저널/검증 시스템이다.

주식 추천 앱도, 자동매매 봇도, 뉴스 요약 앱도 아니다. 투자자의 **판단력·리서치 능력·감정 통제·복기 습관**을 키운다.

> **한 문장 비전:** "코드에 버그가 있듯 투자에도 버그가 있다. 이 제품은 당신의 **투자 버그를 찾아주는 디버거**다."

3년 후 모습: 사용자가 자신의 투자 결정 이력 전체를 시스템 안에 가지고 있고, "나는 급락장에서 공포 매도하는 버그가 있었지만 지난 6개월간 그 빈도가 80% 줄었다"를 데이터로 말할 수 있다.

---

## 2. Problem Statement

개인 투자자는 **정보가 부족해서** 실패하는 것이 아니라, **정보가 너무 많고 구조화되지 않아서** 실패한다. 그리고 자신의 판단과 감정을 기록하지 않기 때문에 **같은 실수를 반복**한다.

구체적 문제:
1. 시장 뉴스가 너무 많아 핵심 파악이 어렵다.
2. 종목을 사고 싶은 이유는 있지만 리스크를 정리하지 않는다.
3. 매수/매도 기준이 감정적이다 (FOMO 매수, 공포 매도, 물타기, 손절 실패).
4. 투자 결과를 복기하지 않는다.
5. 같은 실수를 반복한다.
6. 경제/섹터/기업을 연결해 보는 힘이 부족하다.
7. 투자 실력이 성장하는지 측정할 방법이 없다.

**핵심 통찰:** 위 7개 중 1·6은 "리서치 도구"가, 2~5·7은 "판단 저널 + 복기 시스템"이 푼다. 우리는 **후자(2~5·7)를 Hero로** 두고, 전자(1·6)를 cold-start용 조연으로 붙인다.

---

## 3. Target Users

**핵심 타겟:** 주식은 하고 싶은데 정보가 너무 많아 판단력이 안 쌓이는 개인 투자자 (초보~중급).

특징:
- 주식 계좌 있음, 유튜브·뉴스·커뮤니티는 봄
- 자기만의 투자 기준이 부족함
- FOMO 매수 / 급락 시 공포 매도 / 물타기 / 손절 실패를 자주 겪음
- 경제적 자유를 원하지만 체계적 리서치·복기 시스템이 없음
- **미국 주식**을 주로 거래 (D1·D2)

비타겟: 데이트레이더, 퀀트 전문가, 자동매매 추구자, 단타 급등주 추종자.

---

## 4. User Personas

### Persona A — "민수" (Primary, 본인 = 도그푸딩 대상)
- 29세, 개발자, 미국 빅테크·반도체 위주 투자
- 실적·뉴스는 보지만 매수 이유를 글로 안 남김 → 손실 나면 왜 샀는지 기억 안 남
- FOMO 매수 경향 인지하고 있으나 고치지 못함
- **원하는 것:** "매수 누르기 전에 30초만 나를 멈춰 세워줄 것", "한 달 뒤 내 실수 패턴 리포트"
- **성공 정의:** 같은 실수의 빈도가 측정 가능하게 줄어드는 것

### Persona B — "지영" (Secondary)
- 34세, 직장인, 미국 ETF + 개별주 소액
- 뉴스에 과민 반응, 급락 시 공포 매도
- **원하는 것:** "이 뉴스가 내 종목에 진짜 영향 있는지", "감정인지 계획인지 구분"
- **성공 정의:** 출근길 5분 안에 오늘 시장과 내 종목 상태 파악

---

## 5. Core Value Proposition

> **"매수 버튼 누르기 전 30초. 그리고 한 달 뒤, 그 판단이 옳았는지 알려주는 시스템."**

기존 앱이 주는 것: 주가·뉴스·차트·추천·커뮤니티.
우리가 주는 것:
1. 시장을 **투자자 관점**으로 이해하게 함
2. 내 판단을 **30초 만에** 기록하게 함
3. 내 실수를 **데이터로** 분석해줌
4. 나만의 투자 원칙을 만들게 함
5. 판단 품질을 **점수로** 측정해 성장을 보이게 함

차별화 핵심: **공개 데이터 RAG + 개인 투자일지 RAG의 결합.** "SK하이닉스 HBM 성장 논리 정리해줘"에 공시·IR·뉴스 기반으로 답하면서, *동시에* 사용자의 과거 일지에서 "급등 후 추격매수 패턴"을 끌어와 주의를 준다. 이건 어떤 경쟁 제품도 못 한다.

---

## 6. MVP Feature List (4주)

> 원칙: hero(저널+복기)와 그 cold-start 짝(Research Card)에 집중. 나머지는 라이트하게.

| # | 기능 | 역할 | 비고 |
|---|---|---|---|
| F1 | **Auth** (Supabase, 멀티유저+RLS) | 기반 | D12 |
| F2 | **Watchlist** | 기반 | 종목 등록/삭제, 관심 종목 = 모든 기능의 입력 |
| F3 | **Stock Research Card (RAG)** | Cold-start Hero 짝 | 상승논리/하락리스크 **분리** 표시 (D13). filing·뉴스 RAG. |
| F4 | **Investment Journal (30초 체크 + 복기)** | **HERO** | 매수 전 30초 체크리스트 → **가격 스냅샷(D6)** → 매도 시·시간경과 시 AI 복기(D8) |
| F5 | **AI 복기 피드백** | HERO 일부 | 기록 vs 실제 결과 대조, 판단 품질 코멘트 |
| F6 | **Insight Score (라이트, 객관)** | HERO 강화 | 프로세스 완수율만 (D9) |
| F7 | **Daily Market Brief (라이트)** | Cold-start | Research 엔진 재활용. 주요 지수 + 관심종목 영향 수준 |
| F8 | **Basic Dashboard** | 통합 화면 | 지수 + 관심종목 + 오늘의 리스크 + 미완료 복기 |

핵심 동선: **Research Card 보다가 → 그 자리에서 30초 매수 체크 → 저장 → (나중에) AI 복기.** F3와 F4는 분리된 기능이 아니라 하나의 흐름.

---

## 7. Non-MVP Feature List (Phase 2+)

- Strategy Lab (전략 조건 정의 + 추적 + 간단 백테스트)
- Personal Pattern Analyzer (반복 실수 자동 탐지: FOMO/공포매도/물타기 등) — 기록이 쌓인 뒤
- AI 주관 품질평가 기반 Insight Score 고도화
- 개인화 뉴스 (내 패턴까지 반영한 뉴스 코멘트)
- Theme/Sector Tracker (풀버전)
- 한국 주식(KR) 지원 (OpenDART/KRX)
- 자동매매, 실시간 매수/매도 추천, 복잡한 차트, 커뮤니티, 랭킹, 옵션/선물/레버리지, 과도한 알림, 고급 퀀트 백테스팅, 실시간 틱 시세
- 유료화 (Free/Pro/Premium 티어)

---

## 8. User Flow

### 8.1 핵심 루프 (Hero)
```
관심종목 등록(F2)
   └─> Research Card 조회(F3): 상승논리 | 하락리스크 분리
          └─> [매수 결심] 30초 체크(F4)
                 - 왜 사나? / 가장 큰 리스크? / 투자기간? / 지금 감정?
                 └─> 저장 시점 가격·지표 스냅샷(D6)
                        └─> (보유) 1주/1개월 경과 → 자동 복기 트리거(D8)
                        └─> (매도) 매도 기록 → 즉시 복기 트리거(D8)
                               └─> AI 복기(F5): 기록 vs 결과 대조
                                      └─> Insight Score 갱신(F6)
```

### 8.2 일상 루프 (Retention)
```
출근길 → Dashboard(F8) → Daily Brief(F7) 확인
   → 관심종목 급변 이유 → Research Card(F3)
   → 미완료 복기 알림 → 복기(F5)
```

---

## 9. Main Pages / Screen Structure

MVP 화면 (핵심 3 + 보조 2):

1. **Dashboard** (F8) — 지수(S&P500/Nasdaq/USD-KRW/US10Y/WTI/Gold), 오늘 핵심 이슈 3개, 관심종목 변화, 오늘의 리스크, **미완료 복기 카드**
2. **Stock Detail / Research Card** (F3) — 기업 개요·사업모델·주가흐름·**상승논리·하락리스크(분리)**·재무지표·뉴스·실적일정·체크포인트·내 과거 기록
3. **Journal** (F4·F5) — 매수 전 체크리스트, 매도 전 체크리스트, 감정 기록, 사후 복기, AI 피드백
4. **Insight Score** (F6) — 이번 달 프로세스 완수율, 자주 빠뜨린 항목, 개선점
5. **Daily Brief** (F7) — 투자자 관점 시장 요약

**핵심 화면 3개 (D3 기준):** Journal → Research Card → Dashboard 순.

---

## 10. Database Schema (초안)

> Supabase Postgres. 모든 사용자 테이블에 RLS (`user_id = auth.uid()`). 핵심은 **decision snapshot**.

```sql
-- 사용자 (Supabase auth.users 확장)
profiles (
  id uuid PK references auth.users,
  display_name text,
  created_at timestamptz
)

-- 관심종목
watchlist_items (
  id uuid PK,
  user_id uuid FK,
  ticker text,            -- US 티커 (D1)
  added_at timestamptz,
  note text
)

-- 종목 마스터 / 캐시 (전역, EOD)
securities (
  ticker text PK,
  name text,
  sector text,
  industry text,
  updated_at timestamptz
)
price_snapshots (             -- EOD 시세 캐시 (D7)
  ticker text FK,
  date date,
  open numeric, high numeric, low numeric, close numeric, volume bigint,
  PRIMARY KEY (ticker, date)
)

-- 리서치 카드 (생성 결과 캐시)
research_cards (
  id uuid PK,
  ticker text FK,
  user_id uuid FK,           -- null이면 공용 캐시
  bull_case jsonb,           -- 상승 논리 (분리)
  bear_case jsonb,           -- 하락 리스크 (분리)
  financials jsonb,
  checkpoints jsonb,
  sources jsonb,             -- RAG 출처 (filing/뉴스 링크·청크id)
  generated_at timestamptz,
  model text
)

-- ★ 투자 판단 기록 (HERO). 스냅샷이 핵심 (D6)
decisions (
  id uuid PK,
  user_id uuid FK,
  ticker text FK,
  action text,               -- 'buy' | 'sell'
  -- 30초 체크 (짧은 입력, D15)
  reason_tags text[],        -- ['실적','AI수혜','저평가',...]
  biggest_risk_tag text,
  horizon text,              -- '1w'|'1m'|'6m'|'1y+'
  emotion text,              -- '평온'|'FOMO'|'불안'|'확신'|'복수매매'|'조급'
  conviction int,            -- 1~5
  target_price numeric,
  stop_loss numeric,
  free_note text,            -- 선택, 짧게
  -- 스냅샷 (자동 저장) ★
  price_at_decision numeric,
  snapshot_json jsonb,       -- 그 시점 지표·지수·뉴스 sentiment 등
  decided_at timestamptz,
  -- 복기 (D8)
  review_due_at timestamptz, -- 시간경과 자동 트리거 시각
  closed_at timestamptz,     -- 매도 기록 시
  outcome_json jsonb,        -- 결과: 가격변화·달성여부
  ai_review jsonb,           -- AI 복기 피드백
  process_flags jsonb        -- Insight Score용 객관 플래그 (D9)
)

-- 일일 브리프 캐시
daily_briefs (
  id uuid PK,
  user_id uuid FK,           -- null이면 공용 시장요약
  date date,
  summary jsonb,
  generated_at timestamptz
)

-- RAG 벡터 (D11)
documents (
  id uuid PK,
  source_type text,          -- 'sec_filing'|'news'|'ir'|'user_journal'
  ticker text,
  user_id uuid,              -- user_journal일 때만
  title text, url text,
  published_at timestamptz
)
doc_chunks (
  id uuid PK,
  document_id uuid FK,
  content text,
  embedding vector(1536),    -- pgvector
  metadata jsonb
)
```

`process_flags` 예시: `{checklist_complete: true, stop_loss_set: true, risk_written: true, reviewed: false, emotion_logged: true}` → Insight Score는 이 플래그들의 집계로만 계산 (D9).

---

## 11. API Design (초안)

> 경계 (D14): **Next.js** = Auth·단순 CRUD(watchlist/decisions 읽기·쓰기, RLS 통과). **FastAPI** = AI 생성·RAG·시장데이터·배치.

### FastAPI (Python — AI/Data 서비스)
```
POST /research/card           # ticker → 리서치 카드 생성 (RAG). 캐시 우선.
POST /journal/review          # decision_id → AI 복기 생성
GET  /brief/daily             # 오늘 시장 브리프 (사용자 관심종목 반영)
POST /rag/ingest              # filing/뉴스/유저 일지 → 청킹·임베딩
GET  /market/quote            # EOD/지연 시세 (yfinance/Finnhub 프록시·캐시)
GET  /market/financials       # 재무지표
POST /score/recompute         # 사용자 Insight Score 재계산 (객관 플래그 집계)
```

### Next.js Route Handlers (CRUD)
```
GET/POST/DELETE /api/watchlist
GET/POST        /api/decisions          # 30초 체크 저장 시 스냅샷도 함께 기록
PATCH           /api/decisions/:id/close # 매도 기록 → FastAPI 복기 트리거
GET             /api/dashboard           # 집계 뷰
```

### 배치 (FastAPI + 스케줄러)
```
nightly: EOD 시세 갱신 → review_due_at 도달 decision 자동 복기 → Insight Score 갱신
daily AM: 공용 시장요약 생성 (Daily Brief 씨앗)
```

---

## 12. AI / RAG Architecture

### 12.1 모델 역할 분리 (D10)
- **Claude Opus** — AI 복기(판단 품질 추론), 하락 리스크 심층 정리
- **Claude Haiku** — 뉴스/카드 요약, 분류, 태깅 (양치기)

### 12.2 RAG 파이프라인 (D11)
```
[수집] SEC EDGAR filing(10-K/10-Q/8-K) + 뉴스 RSS + 사용자 투자일지
   └─[청킹] 의미 단위 분할 + 메타데이터(ticker, source_type, date)
        └─[임베딩] → Supabase pgvector (doc_chunks)
             └─[검색] 하이브리드(벡터 + ticker/날짜 필터)
                  └─[생성] Claude — 공개데이터 컨텍스트 + 개인일지 컨텍스트 결합
```

### 12.3 차별화 핵심 — 듀얼 컨텍스트
리서치/복기 생성 시 **두 종류의 컨텍스트를 항상 결합**:
1. **공개 RAG**: filing·IR·뉴스 → 사실 기반 상승논리/하락리스크
2. **개인 RAG**: 사용자 과거 일지 → "당신은 이 종목에서 추격매수 이력이 있다" 같은 주의

### 12.4 AI 가드레일 (D13)
- AI가 **하는 것**: 뉴스요약, 재무분석 보조, 리스크 체크리스트 생성, 일지 정리, 논리 구조화, 복기 피드백, 리서치 보조
- AI가 **하지 않는 것**: 무조건 매수/매도 결정, 수익률 보장, 단기 급등 예측, 과도한 종목 추천, 사용자 판단 대체
- **응답 템플릿** ("엔비디아 사도 될까?" 유형):
  > "매수/매도를 결정하기 전에 확인하세요: ① 현재 밸류에이션 ② 다음 실적일 ③ AI CAPEX 지속성 ④ 경쟁 리스크 ⑤ 당신의 투자 기간 ⑥ 최근 당신의 FOMO 매수 패턴 여부."
- 금지: "지금 매수 추천합니다."

---

## 13. Data Source Strategy

| 범주 | MVP 소스 | 비고 |
|---|---|---|
| US 시세 (EOD/지연) | yfinance, Finnhub(무료) | D7. 캐시 필수. |
| US 재무 | yfinance, Financial Modeling Prep | |
| 공시/Filing | **SEC EDGAR** | RAG 차별화 핵심 |
| 거시 | FRED | 금리·환율·지수 |
| 뉴스 | Google News RSS, Yahoo Finance RSS | Reuters/Bloomberg는 라이선스 회피 |
| (Phase 2) KR | OpenDART, KRX, 한국은행 ECOS | MVP 제외 |

원칙: **무료·합법 소스만**, 모든 외부 호출은 캐시(`securities`/`price_snapshots`/`research_cards`)를 우선.

---

## 14. Insight Score 설계 (MVP = 객관, D9)

**점수화 대상은 "수익률"이 아니라 "판단 프로세스의 완수율"이다.** 좋은 판단도 단기 손실날 수 있고 나쁜 판단도 운으로 수익날 수 있으므로.

MVP 점수 = 아래 객관 플래그의 집계 (AI 채점 없음):

| 플래그 | 측정 | 가중 |
|---|---|---|
| 매수 이유를 적었는가 | reason_tags 존재 | ✅ |
| 가장 큰 리스크를 적었는가 | biggest_risk_tag 존재 | ✅ |
| 손절 기준이 있었는가 | stop_loss 존재 | ✅ |
| 감정 상태를 기록했는가 | emotion 존재 | ✅ |
| 사후 복기를 했는가 | reviewed = true | ✅ |
| 투자 기간을 정했는가 | horizon 존재 | ✅ |

표현 예: *"이번 달 매수 12건 중 4건만 리스크를 미리 적었습니다 (33%)."* → 반박 불가, 행동 변화 유도.

**Phase 2:** AI 주관 품질평가(논리 일관성·거시 고려 여부 등) + 반복 실수 탐지(Pattern Analyzer) 결합.

---

## 15. Investment Journal UX 설계

핵심 원칙: **입력은 짧게(30초), AI 정리는 길게.** 긴 글 쓰기를 강요하면 안 쓴다.

### 매수 전 30초 체크 (탭 선택 위주)
1. **왜 사나요?** (멀티선택) 실적 / AI수혜 / 저평가 / 차트 / 뉴스 / 기타
2. **가장 큰 리스크는?** (단일) 고평가 / 실적부진 / 금리 / 경쟁 / 감정매수 / 섹터과열
3. **투자 기간은?** 1주 / 1개월 / 6개월 / 1년+
4. **지금 감정은?** 평온 / FOMO / 불안 / 확신 / 복수매매 / 조급
5. (선택) 목표가 / 손절가 / 한 줄 메모

→ 저장 순간 **가격·지표 스냅샷 자동 기록**(D6).

### 결정적 UX 카피
> **"잠깐. 지금 이 매수는 계획인가, 감정인가?"**

감정 = FOMO/복수매매/조급 선택 시 추가 마이크로카피 노출.

### 복기 (AI가 길게)
매도 시 또는 시간경과 시(D8) AI가 기록 vs 결과를 대조해 피드백. 사용자는 읽기만.

---

## 16. Risk & Limitation

| 리스크 | 대응 |
|---|---|
| **법적(투자자문 규제)** | 상승논리/하락리스크 분리, 행동 지시("소액 진입" 등) 금지, 면책 고지 명문화 (D13) |
| **Cold-start** (저널 빈 통) | Research Card·Daily Brief가 첫 2주 가치 책임 (D5) |
| **데이터 신뢰성** (무료 소스) | EOD 한정, 캐시, 출처 표기 (D7) |
| **LLM 비용** | Haiku로 양치기, Opus는 복기에만, 캐시 적극 (D10) |
| **LLM 환각** | RAG 출처 첨부, 수치는 API 원본 표시 |
| **스코프 팽창** | MVP 8기능 고정, 나머지 Phase 2 (§7) |
| **개인정보(투자일지)** | RLS, 개인 RAG는 본인 컨텍스트에만 사용 |

명시적 한계: 투자 추천/수익 보장 아님. 단기 예측 아님. 판단 **보조** 도구.

---

## 17. Competitive Analysis

| 제품 | 강점 | 우리와의 차이 |
|---|---|---|
| 증권사 앱 (토스/MTS) | 실거래·시세 | 판단 기록·복기 없음. 우리는 비거래·판단 성장 |
| TradingView | 차트·커뮤니티 | 차트 중심. 우리는 판단/저널 중심 |
| Notion 투자일지 | 자유 기록 | 수동·구조 없음·AI 복기 없음. 우리는 30초 입력 + 자동 스냅샷 + AI 복기 |
| Seeking Alpha 등 | 리서치 콘텐츠 | 일반 콘텐츠. 우리는 **내 일지와 결합된 개인화 리서치** |
| Robo-advisor | 자동 운용 | 판단을 대체. 우리는 판단력을 **키움** |

**해자(moat):** 공개 RAG + 개인 일지 RAG 결합 + 시간 누적된 개인 판단 데이터. 쓸수록 강해지고 이전 비용이 높다.

---

## 18. 4-Week MVP Development Roadmap

> 솔로 개발 기준. 매주 끝에 "내가 직접 써본다"(도그푸딩, D4).

**Week 1 — 기반 + 리서치 노트 (1단계)**
- Next.js + Tailwind + shadcn/ui 셋업, Supabase Auth(멀티유저+RLS) (D12)
- FastAPI 골격, yfinance/Finnhub EOD 시세 프록시+캐시
- Watchlist(F2), 종목 상세 기본 골격
- ✅ 검증: 내 관심종목 등록 + EOD 시세 표시

**Week 2 — Research Card + RAG (Cold-start Hero 짝)**
- SEC EDGAR 수집 → pgvector 임베딩 파이프라인 (D11)
- Research Card 생성: 상승논리/하락리스크 분리 (F3, D13)
- Daily Brief 라이트 (F7)
- ✅ 검증: 종목 1개 리서치 카드가 출처와 함께 나옴

**Week 3 — HERO: 판단 저널 + 스냅샷**
- 30초 체크 UX (F4, §15), 저장 시 가격·지표 스냅샷 (D6)
- 매도 기록 + review_due_at 자동 설정 (D8)
- ✅ 검증: 매수 판단 1건 기록 → DB에 스냅샷 확인

**Week 4 — HERO 완결: AI 복기 + Insight Score + Dashboard**
- AI 복기 생성 (F5, Opus, 듀얼 컨텍스트)
- Insight Score 라이트 (F6, 객관 플래그 집계, D9)
- Dashboard(F8) 통합 + 미완료 복기 알림
- ✅ 검증: 기록→시간경과 복기→점수 갱신 풀 루프 동작 + 본인 1주 실사용

---

## 19. Portfolio Project Presentation Structure

발표/README 구성 (AI 아키텍트 + 풀스택 강조):

1. **Hook** — "투자 판단 디버거" 한 문장 + 매수 전 30초 데모 GIF
2. **Problem** — 정보 과잉 ≠ 판단력. 같은 실수 반복.
3. **Insight** — 수익률이 아닌 **판단 프로세스**를 측정
4. **Architecture 다이어그램** — Next.js ↔ FastAPI ↔ Supabase(pgvector) ↔ Claude (D14)
5. **기술 하이라이트 (showcase, D4 정렬):**
   - **듀얼 컨텍스트 RAG** (공개 filing + 개인 일지 결합) ← 핵심 자랑
   - **판단 평가 루프** (스냅샷 → 시간경과 → AI 복기)
   - LLM 비용 최적화 (Opus/Haiku 역할 분리)
   - RLS 멀티테넌시
6. **데모 시나리오** — 리서치 → 30초 체크 → 한 달 뒤 복기 → 점수
7. **결과/도그푸딩** — "내가 N주간 직접 썼고, 내 리스크-기록 비율이 X%→Y%로 개선됨"
8. **로드맵** — Pattern Analyzer / Strategy Lab / KR 지원

---

## 20. BMAD 연계 (다음 단계)

이 idea.md는 아래 BMad 흐름의 입력이다:

```
idea.md (현재)
  └─> bmad:create-prd          → PRD (이 문서의 §1~§9, §16~§17 기반)
       └─> bmad:create-architecture → 아키텍처 (§10~§14 기반, D14 경계)
            └─> bmad:create-epics-and-stories → 에픽/스토리 (§18 로드맵 → 스토리화)
                 └─> bmad:create-story → 개별 스토리 컨텍스트
                      └─> bmad:dev-story → 구현
```

**제안 에픽 분해 (Week 단위 = 에픽 후보):**
- Epic 1: 기반 (Auth·Watchlist·시세) — Week 1
- Epic 2: Research Card + RAG — Week 2
- Epic 3: 판단 저널 + 스냅샷 (HERO) — Week 3
- Epic 4: AI 복기 + Insight Score + Dashboard — Week 4

---

## 부록 A. 제품 철학 (의사결정 기준)

1. 예측보다 복기
2. 수익률보다 판단 품질
3. 추천보다 사고력
4. 정보량보다 구조화
5. 감정보다 원칙
6. 단기 급등보다 장기 생존

기능 추가/삭제로 고민될 때 이 6개에 비춰 결정한다.

## 부록 B. 미해결/추후 논의

- 유료화 시점·구조 (현재 개인·포폴 우선이라 보류)
- Daily Brief 자동화(cron) vs on-demand — MVP는 on-demand 캐싱, 트래픽 생기면 cron
- 알림 채널 (이메일/푸시) — MVP는 인앱만
- 개인 RAG가 충분히 쌓이기 전 "개인화 주의" 품질 — Week 4 도그푸딩에서 판단
