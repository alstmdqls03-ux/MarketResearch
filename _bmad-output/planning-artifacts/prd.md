---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
classification:
  projectType: web_app
  domain: fintech
  complexity: high
  projectContext: greenfield
  complianceSurface: 'investment-advice-boundary + personal-data (no payments/KYC/AML)'
inputDocuments:
  - /Users/seungbinmin/Desktop/dev_gStack/market_research/_bmad-output/product-brief.md
  - /Users/seungbinmin/Desktop/dev_gStack/market_research/idea.md
workflowType: 'prd'
project_name: 'Market Insight OS'
---

# Product Requirements Document - Market Insight OS

**Author:** BMad
**Date:** 2026-06-21

## Executive Summary

Market Insight OS는 미국 주식 개인 투자자의 **투자 판단력**을 키우는 AI 의사결정 리뷰 시스템이다. 종목 추천 앱·자동매매 봇·뉴스 요약 앱이 아니라 **"투자 판단 디버거"** — 나쁜 판단과 그 프로세스 비용을 체감하는 순간 사이의 **피드백 루프를 압축**하는 제품이다.

**문제:** 개인 투자자는 정보 부족이 아니라 *행동 격차(behavior gap — 감정적 행동으로 시장 대비 까먹는 손실)*로 실패한다. 자신의 판단·감정을 기록하지 않기에 같은 실수(FOMO 매수, 공포 매도, 물타기, 손절 실패)를 반복한다. 검증 근거: 과잉매매(Barber-Odean), 처분효과(disposition effect — 이익은 빨리 실현하고 손실은 끌어안는 편향), 패닉셀(MIT/Allianz: 미국인 34%). [DALBAR 848bp는 방법론 논쟁이 있어 보조 예시로만 사용]

**대상:** 미국 주식을 거래하지만 자기만의 투자 기준이 없어 같은 실수를 반복하는 초보~중급 개인 투자자.

**작동:** 매수 직전 30초 체크 → 결정 시점 가격·지표 *스냅샷* → 매도 또는 시간경과(1주/1개월) 시 AI 복기 → 수익률이 아닌 **프로세스 품질**을 점수화. 핵심 설계 원칙상 가치는 **결정 #1부터** 제공된다(누적 데이터를 기다리지 않음).

### What Makes This Special

- **두 개의 차별화 순간:** ① 매수 직전 *"지금 이건 계획인가, 감정인가?"* 개입, ② 듀얼 RAG(Retrieval-Augmented Generation, 검색증강생성)로 공개 공시·뉴스 + *내 투자일지*를 결합해 "당신은 이 종목에서 추격매수 이력이 있습니다"를 경고 — 개인 투자자용 제품 중 전무.
- **핵심 통찰:** 판단 품질 ≠ 결과 품질(Annie Duke의 *resulting*). 운과 실력을 분리하려면 수익률이 아니라 프로세스를 측정해야 한다.
- **제1 제품 원칙:** 반성은 숙제·잔소리가 아니라 *호기심의 쾌감*이어야 하며, Insight Score는 성적표가 아니라 **거울**이다.
- **정직한 해자:** 초기엔 약함(이력 없음) → 누적 개인 결정 이력(전환비용 매달 상승) + incumbent가 사업모델상 복제 못 하는 포지션(Public=자동매매, Seeking Alpha=추천과 자기모순)으로 후기에 강해짐.
- **정직한 퍼널:** *획득*은 리서치 효용(넓은 깔때기), *리텐션·차별화*는 판단 루프.

## Project Classification

- **Project Type:** Web Application (Next.js 대시보드 + FastAPI 백엔드)
- **Domain:** Fintech — 단, 결제·KYC·AML·자금이동 없음 → **규제 표면이 좁음** (① 투자자문 경계: "종목이 아니라 프로세스를 평가" 원칙으로 회피, ② 개인 데이터 보호)
- **Complexity:** High (투자자문 규제 경계 + AI/RAG + 데이터 신뢰성)
- **Context:** Greenfield (신규 제품)

## Success Criteria

### User Success
- **결정 #1 가치(Aha):** 사용자가 *첫* 매수를 기록한 직후, 자신이 입력한 값을 인용한 비(非)일반적 통찰을 즉시 받는다. (예: "12% 급등 후 매수 — 당신이 적은 최대 리스크 '고평가'를 이 진입가가 존중하나요?")
- **"멈춤" 작동:** 감정=FOMO/조급/복수매매로 기록한 매수에서, 사용자가 최소 '일시정지/재고'를 경험한다.
- **자기통찰:** 사용 한 달 후, 사용자가 앱이 짚어준 *자신의 반복 실수 패턴*을 최소 1개 이름 댈 수 있다.

### Business Success (실사용 + 포트폴리오 우선)
- **도그푸딩 지속:** 제작자 본인이 **8주 연속**, 주 2건 이상 *실제* 결정을 기록하며 사용.
- **포트폴리오 임팩트:** 듀얼 RAG + 판단 루프를 엔드투엔드로 데모 가능. 기술 showcase(RAG·LLM 비용분리·RLS)가 명확히 드러남.
- **(Future) 시장 검증:** 공개 시 활성화·리텐션·WTP(연 $170~480 밴드) 검증.

### Technical Success
- **스냅샷 무결성(P0):** 기록된 결정의 **100%**가 `price_at_decision` + 지표 스냅샷을 포함 (루프를 닫는 데이터 — 누락 시 제품 핵심 붕괴).
- **복기 품질 바:** 모든 AI 복기 문장은 *구체적 데이터 포인트*(가격변동/사용자 입력 리스크/실적일) 최소 1개를 인용 — 뻔한 공자말씀 0건.
- **데이터 신뢰:** 모든 시세에 "as of" 시각 표기, 실패는 *조용히 말고 가시적으로*.
- **30초 약속:** 매수 체크 입력 시간 **중앙값 < 30초**.
- **AI 비용:** 활성 사용자당 월 LLM 비용이 예산 내 (Opus=복기 / Haiku=요약 분리).

### Measurable Outcomes
- **★ North Star:** ① (지속) 결정 기록 연속 주차 수 ② (개선) **프로세스 완수율 추세 상승** — 예: "매수 중 리스크를 미리 적은 비율"이 1주차 기준선 대비 상승.
- **보조:** 7일/30일 잔존(저널링 기준선 6~8% → 매수순간 결박으로 **≥25% 지향**), 결정당 복기 완료율, 손절기준 기입 비율, 체크 입력 중앙값 <30초.
- **컴플라이언스(규제 도메인 최소선):** 종목 매수/매도 추천 0건, 면책 고지 상시 노출, 개인 일지 RLS 격리 100%.

## Product Scope

### MVP - Minimum Viable Product
Auth(멀티유저·RLS) · Watchlist · Research Card(RAG) · **Journal(30초+스냅샷)** · **AI 복기** · Insight Score(객관 프로세스 완수율) · Daily Brief(라이트) · Dashboard. **+ 결정 #1 즉시 반영**(콜드스타트 정면돌파). 컴플라이언스 최소선 포함.

### Growth Features (Post-MVP)
Pattern Analyzer(반복실수 자동탐지) · Strategy Lab · AI 주관 품질평가 · 개인화 뉴스 · Theme Tracker 풀버전 · 수익화 티어(Free/Pro/Premium).

### Vision (Future)
한국주식(KR) 지원 · DART/SEC 자료 요약(Premium) · PDF 리포트 업로드 분석 · 자동 리포트. 해자 = 시간이 쌓일수록 강해지는 **개인 결정 데이터셋**.

## User Journeys

> 횡단 원칙(모든 여정 공통): **저마찰 우선 — 핵심 루프의 모든 필수 입력은 탭/선택/스크롤로 완료 가능해야 하며, 타이핑은 항상 선택이다. 단, 마찰을 0으로 만들지 않는다 — 30초 체크는 "정직한 생각 한 박자"를 강제하는 의도된 과속방지턱이다.** (→ NFR-U 참조)

### Journey 0 — 신규 사용자(Onboarding): "빈 화면을 가치로"
- **Opening:** 가입 직후, 관심종목 0·결정 0. 보통 앱은 텅 빈 대시보드로 맞아 이탈을 부른다.
- **Rising:** 앱은 단 하나만 요청한다 — "관심종목 1개만." 입력 즉시 Research Card(상승/하락 분리)가 떠 *즉각적 가치*를 준다.
- **Climax:** "이 종목, 사보신 적 있나요?" → 있으면 과거 1건을 30초로 소급 기록(스냅샷은 '기록 시점'으로 정직하게 표시) → 즉시 통찰 미리보기. 없으면 "다음에 살 때 30초만."
- **Resolution:** 첫 세션을 빈손이 아니라 카드 1개(+선택적 기록 1건)를 들고 나간다.
- **Reveals:** 온보딩 빈 상태 설계 · 단일 종목 즉시 가치 · 소급 기록 옵션.

### Journey 1 — 민수(Primary), Success Path: "첫 결정에서 통찰을 받다"
- **Opening:** 민수는 NVDA 실적 기대에 매수하려 한다. 평소엔 그냥 샀다.
- **Rising:** Research Card에서 *상승논리 | 하락리스크*를 분리해 본다. 매수 직전 30초 체크 — *감정 한 번 탭 → "지금 계획인가, 감정인가?" → 나머지는 선택*(점진 공개, 타이핑 없이). 감정에 'FOMO'를 누른다.
- **Climax:** 기록하자마자 — *결정 #1인데도* — 앱이 말한다: "12% 급등 후 매수네요. 적으신 최대 리스크는 '고평가', 다음 실적일 D-9. 이 진입가가 그 리스크를 존중하나요?" (구체 데이터 인용) 민수가 멈칫한다. 이때 **결정 시점 스냅샷 = 민수가 그 순간 실제로 본 정보 집합(as-of 시각 포함)**으로 저장된다.
- **Resolution:** 한 달 뒤 자동 복기: "목표가는 도달했지만 horizon은 '1주'였고 FOMO 진입이었습니다. 결과는 좋았으나 *프로세스는 운에 가까움*." Insight Score는 점수가 아니라 거울로: "이번 달 매수 5건 중 2건만 리스크를 사전 기입." 민수가 처음으로 자기 패턴을 본다.
- **Reveals:** Watchlist · Research Card(RAG, 상승/하락 분리) · 30초 체크(점진 공개·저마찰) · 감정 캡처+마이크로카피 · 결정 스냅샷(정보 집합) · **결정 #1 즉시 통찰** · 시간경과 자동 복기 · Insight Score(거울).

### Journey 2 — 민수(Primary), Edge Case: "급락장, 공포 매도 직전"
- **Opening:** 시장 급락, 보유 종목 -8%. 민수는 패닉에 매도 버튼으로 손이 간다.
- **Rising:** 매도 전 체크(매도 이유?·감정?, 탭 선택). 감정 '공포'. 앱이 *그가 매수 시 적었던* "투자 기간 6개월 / 손절 -15%"를 들이민다 — "현재 -8%, 당신의 손절선 아직."
- **Climax:** 민수가 과거 자기 논리와 직면해 공포 매도를 멈춘다. (매도하더라도 그 결정은 기록되어 다음 복기 대상이 된다 — 강제가 아니라 직면.)
- **Failure path:** 시세 API 지연/오류 → *틀린 값을 조용히 보여주지 않고* "as of 16:00 EOD · 실시간 아님" 명시, 누락 지표는 가시적 경고. 복기는 *사용자가 본 정보로만* 평가해 공정성을 지킨다.
- **Reveals:** 매도 전 체크 · 개인 기록 대조(개인 RAG) · 데이터 신선도 표기·실패 가시화 · 복기 공정성 · 면책.

### Journey 3 — 지영(Secondary): "뉴스에 흔들리는 출근길"
- **Opening:** 출근길, "금리 인하 기대 기술주 급등" 헤드라인. 지영은 FOMO를 느낀다.
- **Rising:** Daily Brief를 연다. 일반 요약이 아니라 *"이 뉴스는 당신 관심종목 X·Y에 긍정적일 수 있으나 이미 선반영 → 변동성↑"* (MVP는 '관심종목 영향'까지; 패턴까지 반영한 개인화는 Growth).
- **Climax:** 충동 진입 대신 Research Card로 가격 구간과 실적일을 확인한다.
- **Resolution:** 5분 안에 시장+내 종목 상태를 파악하고 충동을 넘긴다.
- **Reveals:** Daily Brief(라이트, 관심종목 영향) · Dashboard · Research Card.

### Journey 4 — 운영자/제작자(Ops): "야간 파이프라인이 조용히 틀어졌다"
- **Opening:** 매일 밤 배치: EOD 시세 갱신 → review_due 도달 결정 자동 복기 → Insight Score 갱신 → RAG 인제스트.
- **Rising:** 어느 밤 Finnhub 무료 티어 rate limit(요청 한도 초과)로 일부 종목 EOD 누락.
- **Climax:** 운영 로그/대시보드가 실패를 *가시화*. 영향받은 결정 복기는 보류되고 사용자 화면엔 "데이터 보강 중"이 뜬다.
- **Resolution:** 운영자가 재시도/대체 소스로 복구. 스냅샷 무결성은 깨지지 않는다.
- **Reveals:** 배치 스케줄러 · 파이프라인 관측성(로그·알림) · graceful degradation · 캐시 · LLM 비용 모니터링.

### Journey 5 — Lurker(리서치 전용) → 첫 기록 전환
- **Opening:** 2주간 Daily Brief·Research Card만 보고 기록은 0 (가장 흔한 패턴, R5 대응).
- **Rising:** 관심종목이 급등, "살까" 고민하며 Research Card를 연다.
- **Climax:** 카드 하단 *비강제* 넛지 — "이 결심, 30초로 남겨두면 한 달 뒤 옳았는지 알려드려요." (가치 약속, 강요 없음)
- **Resolution:** 첫 결정 기록 → 판단 루프 진입. *획득(리서치) → 리텐션(판단)* 다리를 건넌다.
- **Reveals:** 비강제 전환 넛지 · 리서치→기록 다리 · 가치 약속 카피.

### Journey Requirements Summary
- **저마찰 입력(횡단·핵심):** 핵심 루프 전 입력은 탭/선택/스크롤로 완료, 타이핑은 선택 (J0·J1·J5).
- **온보딩·인증:** 멀티유저, RLS 격리, 빈 상태 즉시 가치, 소급 기록 (J0, 전체).
- **리서치:** Research Card 생성(공개 RAG), 상승/하락 분리, 출처 표기 (J1, J3, J5).
- **판단 기록:** 매수/매도 전 30초 체크(점진 공개), 감정 캡처+마이크로카피, **결정 시점 스냅샷=정보 집합**, append-only/버전 무결성, 물타기=종목당 다중 결정 (J1, J2).
- **즉시 통찰:** 단일 결정 기반 피드백(콜드스타트 정면돌파) (J0, J1).
- **복기·점수:** 시간경과/매도 트리거 AI 복기(구체 데이터 인용·본 정보로만 평가), Insight Score(거울) (J1, J2).
- **개인화 맥락:** 개인 일지 RAG 대조 (J1, J2).
- **일일 화면:** Dashboard, Daily Brief(라이트, 관심종목 영향) (J3).
- **신뢰·안전:** 시세 as-of 표기, 실패 가시화, 면책 (J2).
- **퍼널 전환:** 비강제 넛지로 리서치→기록 유도 (J5).
- **운영·관측성:** 배치 스케줄러, 파이프라인 모니터링, graceful degradation, 비용 추적 (J4).

## Domain-Specific Requirements

### Compliance & Regulatory
- **투자자문 비해당 유지** (Lowe v. SEC publisher exclusion): 비개인화 · 종목 매수/매도 추천 0건 · 면책 상시. 제품 원칙 "종목이 아니라 프로세스를 평가".
- **복기 자문 경계:** AI 복기는 오직 *"사용자가 자신의 계획을 지켰는가"* 만 평가. 종목의 미래·좋고나쁨·매수적합성은 *절대 언급 금지*(프롬프트 제약으로 강제). 면책은 약관이 아니라 **AI 출력 지점마다(per-output)** 노출.
- **명시적 비범위:** 결제·KYC·AML·PCI-DSS·자금 이동 없음 → 해당 규제 표면 없음.
- **데이터 라이선스:** 무료·합법 소스만. Reuters·Bloomberg 등 라이선스 소스 회피.

### Technical Constraints
- **보안:** Supabase Auth · RLS(행 단위 격리).
- **service-role 우회 차단:** FastAPI 배치가 service-role 키(RLS 우회 관리자 키)를 쓰므로 — 사용자 데이터 쿼리는 *앱 코드에서 user 스코프 강제 또는 per-user JWT*, 블랭킷 service-role로 사용자 데이터 읽기 금지.
- **시크릿 관리:** 모든 외부 API 키(LLM·시장데이터)는 서버(FastAPI) 전용, 클라이언트 키 보유 0.
- **프라이버시:** 투자일지=민감 개인데이터. 개인 RAG 임베딩 사용자별 격리. **개인 일지가 Claude API로 전송됨 → 공급자 데이터 처리 정책 명시 + 최소 컨텍스트만 전송 + 사용자 고지.** 내보내기/삭제 권리는 Future.
- **데이터 신뢰성:** EOD/지연 · as-of 표기 · 조용한 오류 금지. **신선도 품질 게이트:** 표시 전 유효성·신선도 검증, 임계 초과 시 가시적 degrade.
- **AI 안전:** 프롬프트 가드레일(추천 금지) · RAG 출처 첨부 · 수치 API 원본. **복기 품질 eval:** '데이터 포인트 ≥1 인용' 규칙을 자동 평가로 검사, 위반 출력 플래그.

### Data Integrity
- **스냅샷 원자성(P0):** 결정 쓰기 + 스냅샷 저장 = 단일 트랜잭션. 스냅샷 실패 시 결정도 롤백(복기 불가한 고아 결정 방지).
- 결정 **append-only/버전** 무결성, 물타기=종목당 다중 결정 행.

### Integration Requirements
- 시장데이터 yfinance/Finnhub(EOD), FRED(거시) — 캐시 우선
- 공시 SEC EDGAR · 뉴스 Google/Yahoo RSS
- LLM Claude(Opus 복기/Haiku 요약) · 벡터 Supabase pgvector

### Risk Mitigations
- 자문 경계 침범 → 행동 지시 금지·중립 표현·per-output 면책
- 환각/오정보 → RAG 출처 + 원본 수치 + 복기 eval
- 데이터 소스 장애 → graceful degradation + 대체 소스 + 캐시 + 신선도 게이트
- 개인데이터 유출 → RLS + user 스코프 강제 + 최소 수집 + LLM 최소 전송

## Innovation & Novel Patterns

### Detected Innovation Areas
1. **듀얼 컨텍스트 RAG** — 공개 filing·뉴스 + *개인 투자일지*를 한 답변에 결합. retail 제품 전무, 기관 스택(Nemotron·Intelligize)에만 존재.
2. **판단 평가 루프** — 결정 스냅샷 → 시간경과/매도 자동 복기 → 프로세스 품질 점수. 이 3종 세트를 가진 출시 소비자 제품 없음.
3. **"피드백 압축" 인터랙션** — 매수 직전 30초 개입("계획인가 감정인가"). 행동을 *막지 않고 비추는* 새 상호작용 패턴.
4. **패러다임 전환** — 수익률이 아닌 *프로세스*를 측정(resulting → 거울).

### Market Context & Competitive Landscape
- 트레이딩 저널(Edgewonk·Tradervue·TradesViz): 데이트레이더용·사후·수동, AI 복기 없음.
- AI 리서치(Fiscal.ai·Seeking Alpha·TIKR): 공개 RAG만 / 추천 엔진(=우리가 아닌 것).
- 포트폴리오 트래커·Notion: 결과 측정 또는 수동 기록.
- → **화이트스페이스 확인.** 위협: Edgewonk·RizeTrade·Public·Fiscal.ai 인접. 네이밍 지뢰: alpha/picks/journal(오염어) 회피.

### Validation Approach
- 가장 위험한 가정 = *"사람들이 30초라도 기록한다"* → 도그푸딩 8주로 1차 검증.
- 결정 #1 즉시 통찰의 가치 → 첫 기록 후 사용자 "오" 반응 정성 관찰.
- 복기 품질 → eval로 데이터 인용률 측정 + 정성 유용성 평가.

### Risk Mitigation
- **Fallback:** 개인 RAG가 초기 빈약하면 → 공개 RAG + *규칙기반 휴리스틱*(예: 급등 후 매수·손절 미설정 감지)으로 통찰 생성을 대체. (혁신이 데이터 누적 전에도 작동하도록)
- 복제 리스크(R1) → 누적 개인 데이터 해자 + incumbent 포지션 모순.
- 행동변화 불확실(R4) → 호기심의 쾌감 UX + 거울 프레이밍.
- 시장 중력=리서치 도구(R5) → 퍼널 분리(획득=리서치 / 리텐션=판단).

## Web Application Specific Requirements

### Project-Type Overview
인증 뒤에서 동작하는 개인용 대시보드 웹앱. Next.js App Router 기반, 인증 영역은 SPA(Single-Page Application, 단일 페이지 앱)처럼 매끄럽게, 공개 랜딩만 SSR(Server-Side Rendering, 서버 렌더링). **실시간 시세 없음(EOD/지연)** → WebSocket·스트리밍 불필요.

### Technical Architecture Considerations
- 프론트: Next.js(App Router, RSC=React Server Components) + Tailwind + shadcn/ui.
- 백엔드 경계: Next(UI·Auth·CRUD) ↔ FastAPI(AI·RAG·시장데이터·배치). (D14)
- 비동기 패턴: 리서치 카드/복기는 생성에 수 초 → *비동기 + 진행 표시*, UI 차단 금지.

### Browser Support Matrix
- 1순위: 모바일 — iOS Safari, Chrome Android (최신 2개 버전).
- 2순위: 데스크톱 — Chrome·Safari·Firefox·Edge (최신 2개). IE 미지원.

### Responsive Design (모바일 우선 · 저마찰)
- **모바일 우선 설계.** 핵심 루프(30초 체크)는 *엄지 도달 영역*에 배치, 탭 타깃 크게, 타이핑 없이 완료.
- 데스크톱은 대시보드를 넓게 활용(멀티 컬럼).

### Performance Targets
- 30초 체크 입력 반응 < 100ms (즉각 느낌).
- 대시보드 초기 로드: 캐시된 EOD로 빠르게(목표 < 2s).
- 리서치 카드/복기: 비동기, 진행 표시, 캐시 우선(동일 종목 재요청 시 즉시).

### SEO Strategy
- MVP 최소: 공개 랜딩만 SSR·인덱싱, 앱 본문은 인증 뒤 noindex. 본격 SEO는 Growth.

### Accessibility
- 실용적 기준: WCAG 2.1 AA(웹 접근성 지침) 지향 — 충분한 대비, 키보드 조작 가능, 큰 터치 타깃. 솔로 MVP 범위에서 과투자 않되 기본은 지킴.

### Implementation Considerations
- 실시간 미지원으로 상태관리 단순(폴링/수동 새로고침으로 충분).
- 오프라인/PWA는 MVP 제외(Future).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
- **Approach: 경험(Experience) + 문제해결 MVP.** 핵심 경험(리서치→30초→스냅샷→복기)이 *실제로 작동하고 가치를 주는지* 검증. 가장 빠른 validated learning(검증된 학습) = "제작자 본인이 30초 습관을 8주 지속하며 통찰을 얻는가".
- **최소 유용성 기준:** 결정 1건 기록 → 즉시 통찰 + 한 달 뒤 복기가 작동하면 "useful".
- **Resource:** 솔로 개발, ~4주, Claude 보조, 외부 인력 0.

### MVP Feature Set (Phase 1)
> 기능 목록은 **Product Scope** 섹션 참조(중복 방지). 여기서는 매핑·실행 관점만 기록.
- **지원 핵심 여정:** J0(온보딩)·J1(핵심 루프)·J2(감정 개입)·J5(전환). J3(일상) 라이트, J4(운영) 최소.
- **수동으로 시작 가능:** Daily Brief는 on-demand(cron 자동화 아님), RAG 인제스트는 관심종목만.

### Post-MVP Features
> Phase 2(Growth)·Phase 3(Expansion) 기능 상세는 **Product Scope** 참조.

### Risk Mitigation Strategy
- **Technical:** 최난도 = 복기 품질·스냅샷 원자성·RAG. 완화 = Haiku/Opus 분리·eval 게이트·휴리스틱 fallback·캐시. 초기 RAG는 관심종목 소수로 한정.
- **Market:** 최대 리스크 = 리텐션(기록 안 함). 완화 = 매수순간 결박·30초·결정#1 가치·거울 프레이밍. 도그푸딩으로 조기 검증.
- **Resource(솔로):** 일정 압박 시 → **Hero(저널+복기) + Research Card** 만 남기고 Daily Brief·Insight Score 후순위 축소 가능. **절대 사수: 30초 체크 + 스냅샷 + 복기.**

## Functional Requirements

> **능력 계약(capability contract).** 여기 없는 기능은 최종 제품에 존재하지 않는다. FR 번호는 안정 식별자 — 영역 내 비순차는 의도된 것(완전성 검증 단계서 FR39~43 추가).

### 계정 & 관심종목
- FR1: 사용자는 계정을 만들고 로그인할 수 있다.
- FR2: 사용자는 자신의 데이터(관심종목·결정·일지)에만 접근할 수 있다(타 사용자 격리).
- FR3: 사용자는 미국 종목을 관심종목에 추가·삭제할 수 있다.
- FR4: 신규 사용자는 관심종목 1개 입력만으로 즉시 가치(리서치 카드)를 받는다.
- FR43: 시스템은 유효하지 않거나 지원하지 않는 종목 입력을 거부하고 안내한다.

### 종목 리서치
- FR5: 사용자는 종목별 리서치 카드를 요청할 수 있다.
- FR6: 리서치 카드는 상승 논리와 하락 리스크를 *분리*해 제시한다.
- FR7: 리서치 카드는 공개 데이터(공시·뉴스·재무)를 근거로 하고 출처를 표기한다.
- FR8: 리서치 카드는 종목 매수/매도를 추천하지 않는다(체크포인트 형태).
- FR9: 사용자는 실적 일정 등 핵심 체크포인트를 볼 수 있다.

### 판단 기록 (Journaling)
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

### 복기 & 판단 품질
- FR19: 시스템은 결정 기록 직후 단일 결정 기반 즉시 통찰을 제시한다(콜드스타트 대응).
- FR20: 시스템은 매도 시 또는 기간(1주/1개월) 경과 시 AI 복기를 생성한다.
- FR21: 복기는 사용자의 *계획 준수 여부*만 평가하고 종목의 미래·적합성은 언급하지 않는다.
- FR22: 복기는 사용자가 결정 시점에 본 정보로만 평가한다(공정성).
- FR23: 복기·통찰은 구체적 데이터 포인트(가격변동·입력 리스크·실적일) 최소 1개를 인용한다.
- FR24: 시스템은 사용자의 과거 일지를 참조해 개인 맥락(예: 추격매수 이력)을 제시한다.
- FR25: 시스템은 프로세스 완수율(리스크 사전기입·손절기준·복기완료 등) 기반 Insight Score를 산출한다.
- FR26: Insight Score는 채점이 아니라 패턴을 비추는 형태로 제시된다(거울).
- FR40: 시스템은 매도 결정을 해당 종목의 미결 매수 결정과 연결해 결과(보유기간·손익)를 산출한다. [루프 완결]
- FR41: 사용자는 자신의 프로세스 완수율 추세(시간 경과)를 볼 수 있다.

### 시장 개요
- FR27: 사용자는 대시보드에서 주요 지수·거시 지표와 관심종목 변화를 볼 수 있다.
- FR28: 사용자는 투자자 관점의 일일 시장 브리프를 볼 수 있다.
- FR29: 일일 브리프는 뉴스가 사용자의 관심종목에 미치는 영향을 연결해 제시한다.
- FR30: 대시보드는 미완료 복기를 알린다.
- FR31: 시스템은 리서치만 보는 사용자에게 비강제 넛지로 첫 기록을 유도한다.

### 신뢰 & 안전
- FR32: 모든 시세는 신선도(as-of) 시각과 함께 표기된다.
- FR33: 데이터 오류·지연 시 시스템은 조용히 넘어가지 않고 가시적으로 알린다.
- FR34: AI 생성 출력에는 면책 고지가 함께 표시된다(per-output).
- FR42: AI 생성(리서치 카드·복기) 실패 시 시스템은 사용자에게 알리고 재시도를 제공한다.

### 운영 & 데이터
- FR35: 시스템은 EOD 시세·재무·공시·뉴스를 수집·캐시한다.
- FR36: 시스템은 야간 배치로 EOD 갱신·기간경과 복기·점수 갱신·RAG 인제스트를 수행한다.
- FR37: 운영자는 파이프라인 실패를 모니터링하고 재시도·대체 소스로 복구할 수 있다.
- FR38: 시스템은 LLM 사용 비용을 추적한다.

## Non-Functional Requirements

### Usability & Friction (★ 핵심)
- NFR-U1: 핵심 루프(매수/매도 30초 체크)의 모든 *필수* 입력은 키보드 없이 탭/선택/스크롤로 완료 가능(타이핑은 항상 선택).
- NFR-U2: 매수 체크 입력 시간 중앙값 < 30초 (의도된 과속방지턱 — 0으로 최적화하지 않음).
- NFR-U3: 모바일 핵심 액션은 엄지 도달 영역 내, 탭 타깃 ≥ 44px.
- NFR-U4: 선택 칩은 "기타(직접)" 옵션을 포함해 거짓 기록을 방지한다.

### Performance
- NFR-P1: 30초 체크 입력 반응 < 100ms.
- NFR-P2: 대시보드 초기 로드 < 2s (캐시된 EOD 기준).
- NFR-P3: 리서치 카드·복기 생성은 비동기 + 진행 표시, 동일 종목 재요청은 캐시로 즉시.

### Security & Privacy
- NFR-S1: 사용자 데이터는 RLS로 행 단위 격리, 모든 사용자 데이터 접근은 user 스코프 강제(블랭킷 service-role 읽기 금지).
- NFR-S2: 모든 외부 API 키(LLM·시장데이터)는 서버 전용, 클라이언트 미노출.
- NFR-S3: 전송(HTTPS)·저장(at-rest) 암호화.
- NFR-S4: 투자일지=민감 데이터 — LLM 전송 시 최소 컨텍스트만, 공급자 데이터 정책 고지.

### Reliability & Data Integrity
- NFR-R1: 결정+스냅샷은 단일 트랜잭션 원자 저장(실패 시 롤백) — 고아 결정 0.
- NFR-R2: 시세 as-of 표기, 신선도 임계 초과 시 가시적 degrade(조용한 오류 0).
- NFR-R3: 외부 소스 장애 시 graceful degradation(대체 소스/캐시), 영향 결정 복기는 보류.

### AI Quality & Cost
- NFR-A1: 복기·통찰 출력의 100%가 구체적 데이터 포인트 ≥1 인용(eval 게이트 검증), 미달 시 차단/재생성.
- NFR-A2: 복기에 종목 추천/미래 예측 문구 0건(가드레일).
- NFR-A3: 활성 사용자당 월 LLM 비용 상한 설정·추적(Opus 복기/Haiku 요약 분리).

### Accessibility
- NFR-AC1: WCAG 2.1 AA 지향 — 대비·키보드 조작·스크린리더 레이블 기본 충족.

### Scalability (해당 약함 — 명시적 제외)
- 개인/MVP 범위로 급성장 미가정 → 범위 밖. Supabase/서버리스가 자연 확장 흡수, 본격 확장은 Growth.
