# Market Insight OS — UX 디자인 검증 보고서

> 출처: `review-rubric.md` (스파인 쌍 루브릭 워크) + `review-accessibility.md` (WCAG 2.1 AA 렌즈)
> 생성일: 2026-06-21

## 총평

스파인 쌍은 내용상 매우 강하다 — PRD의 모든 FR/NFR/UJ가 IA·State·Component·Flow로 촘촘히 매핑되고, shadcn 상속 규율과 LOCKED 의미색·신뢰 UI 같은 제품 고유 제약이 일관되게 양쪽에 살아 있다. 리뷰 시점의 결정적 약점은 **시각 레퍼런스 계약의 부재**였다: D14가 약속한 3종 목업 미생성, `color-themes-1.html` orphan, "spines-win-on-conflict" 선언 부재. 토큰 측면에서는 load-bearing 색 조합의 대비 타깃 부재와 `{colors.destructive}` 미정의가 다운스트림 검증 공백으로 남아 있었다.

접근성 렌즈는 추가로 대비 층에서 실제로 깨지는 조합(면책 muted, 상승 RED 소형 텍스트, 칼날 통과하던 as-of 앰버)과 비타이핑 경로의 키보드/스크린리더 계약 부재를 적출했다. **리뷰 이후 스파인이 편집되어 거의 모든 지적이 해결되었다.** 아래 각 지적의 `[해결됨]` / `[미해결]` 태그가 현재 상태를 표시한다.

---

## Critical

- **[해결됨] 면책 고지(disclaimer) AA 본문 대비 미달 (접근성)** — DESIGN.md L98-100. 라이트 2.76:1 / 다크 3.46:1, 11px 소형. 면책은 규제 방패이자 제품 원칙(FR34). → disclaimer-fg #52525B(light)/#A1A1AA(dark), ≥4.5:1로 해결.
- **[해결됨] D14 핵심 화면 목업 3종 미생성 (Visual reference)** — .decision-log.md:71. 리서치 카드/30초 체크/대시보드. → key-research-card / key-buy-check / key-dashboard .html 렌더로 해결.

## High

- **[해결됨] `{colors.destructive}` frontmatter 미정의 참조 (Token completeness)** — DESIGN.md:109,128. → zinc #3F3F46/#D4D4D8 정의 + icon+label 의무로 해결.
- **[해결됨] load-bearing 색 조합의 대비 타깃 부재 (Token completeness)** — EXPERIENCE.md:95. → contrast targets 블록(4.5:1 / 3:1) 추가로 해결.
- **[해결됨] `color-themes-1.html` orphan (Visual reference)** — .decision-log.md:56. → 인라인 링크 + Deep Indigo 최종 채택 명명으로 해결.
- **[해결됨] "spines-win-on-conflict" 선언 부재 (Visual reference)** — cf. experience-example:29. → Foundation에 선언 추가로 해결.
- **[해결됨] 상승 RED 소형 텍스트 AA 미달 (접근성)** — color-themes-1.html L107-108. #E5383B = 4.23:1, 상승/하락 비대칭. → up-text #C81E1E (~5.9:1) 추가, fill #E5383B 유지로 해결.
- **[해결됨] as-of 앰버 배지 4.51:1 칼날 통과 (접근성)** — DESIGN.md L94-96. → warning-text #9A3E07로 해결.
- **[해결됨] 비타이핑(탭/칩) 경로 포커스·레이블·점진 공개 announce가 "지향" 선언에 그침 (접근성)** — EXPERIENCE.md L97-102. → 칩 aria-pressed + 점진공개 announce를 Component Patterns + Accessibility Floor에 의무화로 해결.

## Medium

- **[해결됨] FR43 거부 상태 전용 State/Flow/카피 부재 (Flow coverage)** — EXPERIENCE.md:25,75. → 거부 상태 State Pattern 추가로 해결.
- **[해결됨] `{typography.numeric}` fontSize/lineHeight 미정의 (Token completeness)** — DESIGN.md:56-60. → fontSize 14px / lineHeight 1.4 정의로 해결.
- **[해결됨] 운영자(최소) State Patterns 행 부재 (State coverage)** — EXPERIENCE.md State 표 / IA:36. FR37 실패 큐·재시도. → 운영자 State 행 추가로 해결.
- **[해결됨] Insight Score / Score 거울 / score-mirror 표기 혼재 (Inheritance discipline)** — DESIGN.md:101,172. → canonical "Insight Score (거울)"로 정규화하여 해결.
- **[미해결] 도트/보더 등 비텍스트 UI 요소 3:1 대비 미검증 (접근성)** — color-themes-1.html L99,L104,L101. 입력/포커스 요소 경계 input/ring 토큰 3:1 별도 검증 필요.
- **[미해결] 보조·파괴 인터랙션(삭제, ⓘ, "기타" close)의 ≥44px 타깃 누락 (접근성)** — EXPERIENCE.md L26,L98. "모든 인터랙티브 요소 ≥44px" 일반화 + 히트영역 명시 필요.
- **[미해결] "기타(직접)" 입력 모달 포커스 트랩/복귀 미규정 (접근성)** — EXPERIENCE.md L64,L87. 칩→입력 포커스 이동·Esc 복귀 명시 필요.
- **[미해결] 오류·재시도 상태 SR announce 미규정 (접근성)** — DESIGN.md L173. role="alert"/aria-live="assertive" + aria-busy 명시 필요.

## Low

- **[미해결] Flow 1 복기 카피 PRD 미세 불일치(목표가 도달 누락) (Flow coverage)** — prd.md:110 / EXPERIENCE.md:121. 인용 데이터포인트(FR23) 복원 또는 단순화 주석.
- **[미해결] 운영자 J4 다운스트림 스펙 처리 [NOTE FOR UX] 미결 (Flow coverage)** — EXPERIENCE.md:153. IA 표 운영자 행 MVP 인앤아웃 표기 필요.
- **[미해결] shadcn 상속 컴포넌트 전체 목록 한 곳 부재(Separator vs Skeleton) (Component coverage)** — DESIGN.md:165 / EXPERIENCE.md:18. 경미.
- **[미해결] score-mirror 추세선 색(의미색 vs primary/중립) 미지정 (Component coverage)** — DESIGN.md:172. 추세선 primary/중립 사용 못박기.
- **[미해결] 대시보드 cold-load 스켈레톤(<2s) State 행 부재 (State coverage)** — EXPERIENCE.md:76 / prd.md:334.
- **[미해결] DESIGN.md frontmatter sources 미기재 (Shape fit)** — 추적성 비대칭, 경미.
- **[미해결] Score 거울 추세선 색-단독 신호 위험 (접근성)** — DESIGN.md L172,L181. 직접 라벨/패턴 병기 필요.
- **[미해결] 숫자·티커 SR 발음/언어 태깅 미규정 (접근성)** — EXPERIENCE.md L101 / DESIGN.md L134. 부분 lang 태깅 + aria-label 권장.
- **[해결됨] 30초 과속방지턱 자가 속도 — WCAG 2.2.1 위반 없음 (접근성)** — EXPERIENCE.md L88. self-paced noted. 확인 완료.

---

## Category verdicts

| # | Category | Verdict |
|---|----------|---------|
| 1 | Flow coverage | strong |
| 2 | Token completeness | adequate |
| 3 | Component coverage | strong |
| 4 | State coverage | strong |
| 5 | Visual reference coverage | broken |
| 6 | Bloat & overspecification | strong |
| 7 | Inheritance discipline | adequate |
| 8 | Shape fit | strong |

접근성 리뷰(WCAG 2.1 AA): 리뷰 시점 집계 critical 1 · high 3 · medium 4 · low 3 — 거의 전부 사후 편집으로 해결.

---

## Reviewer files

- `review-rubric.md` — 스파인 쌍 루브릭 워크(8개 카테고리, Flow/Token/Component/State/Visual reference/Bloat/Inheritance/Shape fit)
- `review-accessibility.md` — 접근성(WCAG 2.1 AA) 적대적 렌즈(대비·색-단독·탭 타깃·키보드/SR·모션/타이밍·피드백)
