# Spine Pair Review — Market Insight OS

## Overall verdict

스파인 쌍은 내용상 매우 강하다 — PRD의 모든 FR/NFR/UJ가 IA·State·Component·Flow로 촘촘히 매핑되고, shadcn 상속 규율과 LOCKED 의미색·신뢰 UI 같은 제품 고유 제약이 일관되게 양쪽에 살아 있다. 결정적 약점은 **시각 레퍼런스 계약의 부재**다: D14가 약속한 3종 목업이 생성되지 않았고, 존재하는 `color-themes-1.html`조차 어느 스파인에서도 인라인 링크되지 않으며 "spines-win-on-conflict" 선언이 한 번도 없다. 토큰 측면에서는 load-bearing 색 조합의 명시적 대비 타깃이 없고 `{colors.destructive}` 참조가 로컬 미정의(상속)라는 점이 다운스트림 검증 공백으로 남는다.

## 1. Flow coverage — strong

체크: PRD User Journeys J0–J5 전수 대조. J0→Flow J0, J1→Flow 1, J2→Flow 2, J3→Flow J3, J5→Flow J5 모두 명명된 protagonist(민수/지영/신규/Lurker)·번호 단계·클라이맥스 비트 보유. 실패 경로는 Flow 1·Flow 2에 명시. J4(운영)는 의도적 축소로 미해결/갭에 근거 기록.

### Findings
- **medium** FR43(유효하지 않은 종목 입력 거부·안내)이 IA 표(관심종목 행)에만 있고 전용 State Pattern·Flow·마이크로카피가 없다 — 온보딩 Flow J0의 "관심종목 1개만" 입력이 거부될 때의 행위가 미정의 (EXPERIENCE.md:25,75 / Flow J0). *Fix:* State Patterns에 "입력 거부/미지원 종목" 행 1개 추가(가시적 안내, 재입력 유도), Voice 표에 거부 카피 1줄.
- **low** Flow 1 클라이맥스 복기 카피가 PRD와 미세 불일치 — PRD J1은 "목표가는 도달했지만"(prd.md:110), EXPERIENCE Flow 1은 "결과는 좋았으나 horizon은 '1주'였고"(EXPERIENCE.md:121)로 목표가 도달 언급이 빠졌다. 의미 손상은 아니나 인용 데이터포인트(FR23) 한 개가 누락. *Fix:* 복기 예시에 목표가 도달 사실을 복원하거나 의도적 단순화임을 주석.
- **low** 운영자 J4가 Key Flow에서 빠진 것은 미해결/갭에 근거가 있으나, 다운스트림이 운영 화면을 별도 스펙으로 다룰지 여부가 `[NOTE FOR UX]` 미해결 상태 (EXPERIENCE.md:153). *Fix:* 다음 게이트 전 결정 필요 — IA 표의 "운영자(최소)" 행을 MVP 범위에서 명시적으로 인앤아웃 표기.

## 2. Token completeness — adequate

체크: frontmatter 모든 토큰 정의 확인. 색 토큰은 라이트/다크 쌍 완비(primary/up/down/warning/중립 전부 `-dark` 동반, hex 누락 0). `{path.to.token}` 참조 전수 추적 — components 블록 내부 참조 전부 frontmatter에 resolve. typography 3단 + numeric 정의됨.

### Findings
- **high** `{components.async-state}.error-foreground: '{colors.destructive}'` 및 Colors 본문의 `destructive` 참조가 frontmatter에 정의되지 않은 토큰을 가리킨다 (DESIGN.md:109,128). 의도는 shadcn 상속이나, 다른 색은 전부 명시 오버라이드된 상태라 검증기가 미정의로 플래그할 수 있고 라이트/다크 쌍·대비도 미보장. *Fix:* 주석으로 "destructive는 shadcn 기본 상속(오버라이드 안 함)"임을 frontmatter 또는 Colors에 1줄 명시(이미 본문 128행에 서술은 있으나 토큰 참조 옆 주석 권장).
- **high** load-bearing 색 조합의 명시적 대비 타깃 부재 — up/down on `{colors.surface}`, `{colors.warning}` on `{colors.warning-bg}`, `{colors.primary-foreground}` on `{colors.primary}`가 모두 정보 전달 핵심인데 AA 비율 수치 명시가 없다. Accessibility Floor는 "검증"만 언급(EXPERIENCE.md:95, DESIGN.md 없음). *Fix:* DESIGN.md Colors 또는 Do/Don't에 핵심 조합별 목표 대비(예: 본문 4.5:1, 큰 텍스트 3:1) 1블록 추가.
- **medium** `{typography.numeric}`에 `fontSize`/`lineHeight` 미정의 — 시세·점수 전용이라 사이즈가 컨텍스트별로 다르다는 의도는 합리적이나, numeric을 단독 적용하는 표면에서 다운스트림이 사이즈를 추측해야 한다 (DESIGN.md:56-60). *Fix:* "numeric은 title/body의 fontSize를 따르고 variant만 덧입힌다"는 1줄 규칙 추가.

## 3. Component coverage — strong

체크: 7개 제품 컴포넌트(research-card, chip, button-primary, asof-badge, disclaimer, score-mirror, async-state) 전부 DESIGN.md.Components(시각) + EXPERIENCE.md.Component Patterns(행위) 양쪽 행 보유. 이름·토큰 참조 양 스파인 verbatim 일치. shadcn 상속 컴포넌트 목록도 양쪽 정합.

### Findings
- **low** DESIGN.md Components는 `Separator`를 shadcn 상속 목록에 포함(DESIGN.md:165)하나 EXPERIENCE.md Foundation의 상속 목록은 `Skeleton`만 예시(EXPERIENCE.md:18,76). 불일치는 아니나(예시 vs 전체) 다운스트림이 상속 컴포넌트 전체 목록을 한 곳에서 못 본다. *Fix:* 경미 — 무시 가능, 또는 EXPERIENCE에서 "DESIGN.md.Components의 상속 목록 참조" 1줄.
- **low** score-mirror의 "추세 라인/바" 시각이 DESIGN.md:172에 언급되나 차트 컴포넌트가 components 블록에 토큰화되지 않음. MVP 단순 시각이라 과대 토큰화는 불필요하나, 추세 색(up/down 의미색 vs primary) 선택이 미지정. *Fix:* 추세선은 의미색 아닌 `{colors.primary}` 또는 중립 사용임을 1줄 못박기(거울 철학상 등락색 오용 방지).

## 4. State coverage — strong

체크: State Patterns 6행이 빈상태/온보딩·로딩/비동기·오류(가시적)·as-of/stale·append-only/버전·원자결정+스냅샷을 커버. IA 13개 표면 walk — 각 표면의 cold-load·empty·error·stale·version 상태가 State 표 또는 Flow로 매핑됨. DB GUARDRAIL 블록이 State에서 다운스트림 아키텍처 계약으로 명시.

### Findings
- **medium** 운영자(최소) 표면이 State Patterns에 행이 없다 — 파이프라인 실패 모니터·재시도(FR37)의 운영자측 상태(실패 큐·재시도 진행·복구)가 사용자측 "데이터 보강 중"(prd.md:130)과 분리되어 미기술 (EXPERIENCE.md State 표 / IA:36). *Fix:* 의도적 축소면 State 표 상단/하단에 "운영자 상태는 별도 내부 스펙" 1줄, 아니면 행 추가.
- **low** "cold-load"(대시보드 NFR-P2 <2s) 상태가 State 표에 명시적 행 없음 — 로딩/비동기 AI 행은 리서치·복기 한정이고 대시보드 초기 로드 스켈레톤은 미기술 (EXPERIENCE.md:76 vs prd.md:334). *Fix:* 로딩 행에 "대시보드 콜드로드 스켈레톤(<2s)" 포함.

## 5. Visual reference coverage — broken

체크: `.working/` 디렉터리 = `color-themes-1.html` 1개만 존재. D14가 약속한 `key-research-card`/`key-30s-check`/`key-dashboard` 3종 목업 미생성. 양 스파인의 인라인 시각 레퍼런스 링크 = 0건. "spines-win-on-conflict" 선언 = 0건.

### Findings
- **critical** D14(decision-log)가 명시한 핵심 화면 목업 3종(리서치 카드/30초 체크/대시보드)이 생성되지 않았다 (.decision-log.md:71, `.working/`에 부재). 예시(experience-example)는 `mockups/*.html`을 IA 섹션에 인라인 링크하는데 본 EXPERIENCE는 목업 자체가 없어 다운스트림 빌드가 시각 합성 레퍼런스 없이 출발. *Fix:* 3종 목업 렌더 후 EXPERIENCE.md IA 섹션 끝에 인라인 링크(예: "→ 합성 레퍼런스: `.working/key-*.html`").
- **high** 존재하는 `color-themes-1.html`이 어느 스파인에서도 링크/명명되지 않음 — orphan. 이 파일은 브랜드 액센트 후보 비교(Deep Indigo/Teal 등)이며 최종 선택은 D10에서 확정됐으므로, 미링크 시 다운스트림이 폐기된 후보를 살아있는 레퍼런스로 오인할 위험 (.working/color-themes-1.html, .decision-log.md:56). *Fix:* DESIGN.md Colors에 "최종 팔레트 확정: `.working/color-themes-1.html` 1번(Deep Indigo) 채택, 나머지 후보는 폐기" 1줄로 명명·인라인.
- **high** "spines-win-on-conflict"(스파인이 목업/시각 레퍼런스와 충돌 시 우선) 선언이 양 스파인 어디에도 없음 — 예시는 EXPERIENCE IA에 "Spine wins on conflict"를 명시(experience-example:29). *Fix:* 목업 링크와 같은 줄에 "충돌 시 스파인 우선" 1회 명시.

## 6. Bloat & overspecification — strong

verdict: 과소·과대 모두 없음. DESIGN.md는 브랜드 델타만 규정하고 shadcn 80%를 상속 선언으로 압축. components 블록은 7개로 절제. EXPERIENCE는 sources(FR/NFR)를 중복 기술 안 함을 명시(EXPERIENCE.md:12). DB GUARDRAIL은 길지만 사용자 지시·다운스트림 계약이라 정당.

## 7. Inheritance discipline — adequate

verdict: 소스(prd/product-brief) resolve, UJ·컴포넌트명·glossary verbatim 일치(리서치 카드/Insight Score/30초 체크/as-of 배지 등 양 스파인 동일). EXPERIENCE 토큰 참조 전부 DESIGN 토큰으로 resolve(단 destructive 예외는 §2 high). 네이밍 가드(alpha/picks/signals/journal 회피) 양쪽 정합.

### Findings
- **medium** "Insight Score" vs "Score 거울" vs "Score Mirror(score-mirror)" 표기 혼재 — 컴포넌트 토큰명은 `score-mirror`(영문), IA·Voice는 "Insight Score(거울)", Component Patterns는 "Score 거울"로 부른다 (DESIGN.md:101,172 / EXPERIENCE.md:32,68). 의미 동일하나 다운스트림 검색·매핑 시 이름 3종. *Fix:* 1차 표기를 "Insight Score (거울 / `score-mirror`)"로 한 번 정의하고 이후 일관 사용.

## 8. Shape fit — strong

verdict: DESIGN.md 본문 섹션이 spec 정규 순서(Brand&Style→Colors→Typography→Layout&Spacing→Elevation&Depth→Shapes→Components→Do's/Don'ts) 정확히 준수. frontmatter 키 셋(name/description/colors/typography/rounded/spacing/components) 정합. EXPERIENCE 필수 기본 섹션(Foundation/IA/Voice/Component Patterns/State/Interaction Primitives/Accessibility/Key Flows) 전부 존재. "미해결/갭" 자가점검 섹션은 발명됐으나 다운스트림 트리아지 가치로 자리값 함.

### Findings
- **low** DESIGN.md frontmatter에 `status: draft`는 있으나 `sources` 미기재(EXPERIENCE는 sources 보유). DESIGN spec상 sources 필수는 아니나 추적성 비대칭. *Fix:* 경미 — 무시 가능.

## Mechanical notes

- **시각 레퍼런스 = 가장 큰 다운스트림 공백:** 목업 3종 미생성(critical) + `color-themes-1.html` orphan(high) + spines-win 선언 부재(high). 이 셋이 §5를 broken으로 만든다.
- **이름 비일관:** Insight Score / Score 거울 / score-mirror 3종(§7 medium). 그 외 컴포넌트·UJ 명칭은 양 스파인 verbatim 일치 — 깨끗함.
- **토큰 참조 무결성:** `{path.to.token}` 참조 전수 resolve. 단일 예외 `{colors.destructive}`는 shadcn 상속(미정의가 의도)이나 명시 주석 권장(§2 high).
- **Frontmatter 완전성:** DESIGN — name/description/status/updated/colors(라이트·다크 쌍 완비)/typography/rounded/spacing/components 충족, sources만 누락(경미). EXPERIENCE — name/status/updated/sources 충족.
- **대비 타깃 부재:** load-bearing 색 조합 AA 수치 미명시(§2 high) — 접근성 렌즈 게이트에서 재확인 권장.

---
**File:** `/Users/seungbinmin/Desktop/dev_gStack/market_research/_bmad-output/planning-artifacts/ux-designs/ux-market-insight-os-2026-06-21/review-rubric.md`
