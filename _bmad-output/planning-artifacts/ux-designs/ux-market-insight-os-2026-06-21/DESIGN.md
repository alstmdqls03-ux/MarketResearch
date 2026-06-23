---
name: Market Insight OS
description: 투자 판단 디버거. shadcn/ui + Tailwind 위에 올린 미니멀 핀테크 브랜드 레이어 — 차분하고 안티-FOMO, 성적표가 아닌 거울. 라이트/다크 동시 지원.
status: final
updated: 2026-06-21
colors:
  # shadcn 기본 토큰(background, foreground, muted, muted-foreground, popover,
  # card, border, input, ring, destructive)을 상속하고, 아래 브랜드/의미 토큰만 오버라이드한다.
  # --- 브랜드 액센트: Deep Indigo (등락 빨강/파랑과 비충돌) ---
  primary: '#4F46E5'
  primary-foreground: '#FFFFFF'
  primary-dark: '#818CF8'
  primary-foreground-dark: '#0E0E16'
  # --- 의미색(LOCKED · 한국식): 상승=빨강 / 하락=파랑. hue(색상 정체성)는 절대 변경 금지.
  #     단, 소형 텍스트 가독성을 위한 명도 변형(-text)은 허용한다(WCAG AA). 칩/배지/큰 숫자=fill, 소형 텍스트=-text ---
  up: '#E5383B'           # fill: 칩·배지·큰 숫자(large/UI 3:1)
  up-text: '#C81E1E'      # 소형 텍스트 변형: 흰 surface 위 ~5.9:1 (AA 4.5:1 통과)
  up-dark: '#FF5C5C'      # 다크 fill·텍스트 공통: 다크 surface 위 5.69:1 통과
  down: '#2563EB'         # fill: 흰 surface 위 5.17:1, 소형 텍스트도 통과
  down-text: '#2563EB'    # 대칭용 토큰(이미 AA 통과, fill과 동일 값)
  down-dark: '#5B8DEF'
  # --- 신뢰 UI: as-of/신선도 배지(amber 경고 톤) ---
  warning: '#B45309'      # 배지 bg 위 4.51:1(칼날) — 소형 텍스트는 warning-text 사용
  warning-text: '#9A3E07' # as-of 배지 소형 텍스트 변형: 앰버 bg 위 ~5:1대 마진 확보
  warning-bg: '#FEF3C7'
  warning-dark: '#FBBF24'
  warning-bg-dark: '#3A2E12'
  # --- 중립(cool gray) · shadcn 기본을 Deep Indigo 계열로 살짝 차갑게 조정 ---
  background: '#F5F5F8'
  surface: '#FFFFFF'
  border: '#E5E5EC'
  text-primary: '#1A1A2E'
  text-secondary: '#6B6B80'
  muted: '#9A9AAE'        # 비텍스트 장식(구분선·도트)에만. 소형 텍스트 금지(흰 surface 위 2.76:1, AA 미달)
  # 면책/캡션 텍스트 전용(AA 4.5:1 보장). 존재감은 색이 아니라 사이즈·여백·아이콘으로 낮춘다.
  disclaimer-fg: '#52525B'      # zinc-600급, 흰 surface 위 ~7:1
  disclaimer-fg-dark: '#A1A1AA' # zinc-400급, 다크 surface 위 AA 통과
  # destructive: 파괴 액션(예: 관심종목 삭제) 전용. 상승 빨강(up)과 절대 공유 금지 —
  # 빨강은 이미 '상승=긍정'으로 LOCKED라 삭제에 재사용하면 '상승'으로 오독된다.
  # 따라서 destructive는 중립-강조(zinc) 톤으로 두고, 반드시 아이콘 + 텍스트 라벨을 병기해 색 단독 의존을 금지한다.
  destructive: '#3F3F46'         # zinc-700, 흰 surface 위 고대비
  destructive-foreground: '#FFFFFF'
  destructive-dark: '#D4D4D8'    # zinc-300, 다크 surface 위 고대비
  destructive-foreground-dark: '#0E0E16'
  background-dark: '#0E0E16'
  surface-dark: '#1A1A26'
  border-dark: '#2A2A3A'
  text-primary-dark: '#ECECF4'
  text-secondary-dark: '#9A9AB0'
  muted-dark: '#6E6E82'         # 비텍스트 장식 전용. 소형 텍스트 금지(다크 surface 위 3.46:1, AA 미달)
typography:
  # 폰트 패밀리는 shadcn 기본(Geist)을 Pretendard로 전면 교체(KR+Latin 통합).
  # 위계 3단: title / body / caption. 수치는 tabular-nums 강제.
  title:
    fontFamily: 'Pretendard'
    fontSize: 17px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body:
    fontFamily: 'Pretendard'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.55'
  caption:
    fontFamily: 'Pretendard'
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.5'
  numeric:
    # 시세·등락률·점수 전용. 정렬을 위해 tabular-nums.
    # fontSize는 컨텍스트의 title/body를 따르고 numeric은 variant(tabular-nums)만 덧입힌다.
    # 단, 단독 적용 표면이 추측하지 않도록 기본 사이즈를 명시한다.
    fontFamily: 'Pretendard'
    fontSize: 14px
    lineHeight: '1.4'
    fontVariantNumeric: 'tabular-nums'
    fontWeight: '700'
rounded:
  # shadcn 기본(0.5rem)과 정합. 카드는 8~10px대.
  sm: 6px
  md: 8px
  lg: 10px
  full: 9999px
spacing:
  # 8px 그리드. shadcn/Tailwind 4-base 스케일과 호환.
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  tap-min: 44px
components:
  research-card:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
    padding: '{spacing.4}'
    thesis-bull-accent: '{colors.up}'
    thesis-bear-accent: '{colors.down}'
  chip:
    radius: '{rounded.full}'
    min-height: '{spacing.tap-min}'
    selected-background: '{colors.primary}'
    selected-foreground: '{colors.primary-foreground}'
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.md}'
    min-height: '46px'
  asof-badge:
    background: '{colors.warning-bg}'
    foreground: '{colors.warning-text}'
    radius: '{rounded.full}'
  disclaimer:
    # 대비는 양보 불가(AA 4.5:1) — disclaimer-fg 사용. 존재감은 사이즈·여백·아이콘으로 낮춘다.
    foreground: '{colors.disclaimer-fg}'
    fontSize: '{typography.caption.fontSize}'
  score-mirror:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
    value-color: '{colors.text-primary}'
  async-state:
    progress-color: '{colors.primary}'
    retry-foreground: '{colors.primary}'
    error-foreground: '{colors.destructive}'
---

## Brand & Style

Market Insight OS는 "종목을 찍어주는 앱"의 시각적 관습을 의도적으로 거스른다. 빨강-초록 깜빡임, 급등 강조, FOMO를 자극하는 화려함 대신 **차분한 미니멀 핀테크** — 타이트한 그리드, 카드 위주 구성, 중립 회색 + 단일 브랜드 액센트, 균일한 위계, 군더더기 없음. 제품 철학이 그대로 시각 언어가 된다: 이 화면은 **성적표가 아니라 거울**이고, 행동을 막지 않고 비춘다.

브랜드는 shadcn/ui + Tailwind를 **전면 상속**한다. 이 DESIGN.md는 브랜드 레이어 델타만 규정한다 — Deep Indigo 액센트, 한국식 의미색(상승=빨강/하락=파랑), Pretendard 타이포, 신뢰 UI 토큰(as-of 배지·면책·오류), 그리고 몇 개의 제품 고유 컴포넌트. shadcn에서 그대로 오는 80%(Button, Card, Dialog, Sheet, Tabs, Skeleton, Toast)는 기본 스펙을 유지한다. 이를 임의로 커스터마이즈하는 것은 브랜드 규율 위반이다.

라이트와 다크를 모두 1급 지원하며, 시스템 설정을 따라 자동 전환한다. 토큰은 두 벌(`-dark` 접미사)로 관리한다.

## Colors

팔레트는 의도적으로 절제되어 있다 — 판단을 비추는 거울은 화면이 시끄러우면 안 된다. 선택 팔레트는 [Deep Indigo 컬러 테마](mockups/color-themes-1.html)(라이트/다크 토큰을 한 화면에서 비교한 팔레트 시안)에 시각화되어 있다.

- **Deep Indigo `{colors.primary}` (라이트 `#4F46E5` / 다크 `#818CF8`)** 가 단 하나의 브랜드 액센트다. "전문가의 조용한 확신". 주요 버튼, 활성 내비, 선택된 칩, 진행 표시에만 쓴다. shadcn의 기본 `primary`를 대체한다. **순수 빨강/파랑을 피해 방향 신호(등락)와 혼동되지 않도록** 선택되었다.
- **상승 `{colors.up}` (`#E5383B` / 다크 `#FF5C5C`) · 하락 `{colors.down}` (`#2563EB` / 다크 `#5B8DEF`)** 는 **LOCKED 의미색**이다. 한국식 관습(빨강=상승, 파랑=하락)을 따른다. 대상 종목은 미국 주식이나 한국 사용자의 직관을 우선한다. 방향 외 어떤 용도로도(브랜드·상태·장식) 쓰지 않는다. **초록을 상승색으로 절대 쓰지 않는다.** **LOCK은 hue(색상 정체성, 상승=빨강)에 적용하고, 소형 텍스트 가독성용 명도 변형은 허용한다.** 칩·배지·큰 숫자에는 fill 토큰(`{colors.up}`/`{colors.down}`)을, **소형 텍스트(thesis 헤더 11px대, 캡션급 등락 라벨)에는 텍스트 변형 `{colors.up-text}` (`#C81E1E`, 흰 surface 위 ~5.9:1) / `{colors.down-text}`** 를 쓴다. 하락 `#2563EB`는 fill로도 5.17:1을 넘어 `down-text`는 동일 값(대칭용)이다. 다크 테마는 `{colors.up-dark}`/`{colors.down-dark}`가 fill·텍스트 공통으로 AA를 통과한다.
- **Warning/as-of `{colors.warning}` (앰버, bg `{colors.warning-bg}`)** 는 신선도 경고 전용이다. 데이터가 EOD/지연임을 알리는 as-of 배지, 신선도 임계 초과 degrade에만 등장한다. 일반 강조에는 쓰지 않는다. `{colors.warning}` 자체는 bg 위 4.51:1로 칼날 통과이므로 **as-of 배지의 소형 텍스트는 한 톤 어두운 `{colors.warning-text}` (`#9A3E07`, 5:1대 마진)** 를 쓴다.
- **중립 회색(cool gray)** — `{colors.background}` / `{colors.surface}` / `{colors.border}` / `{colors.text-primary}` / `{colors.text-secondary}` / `{colors.muted}`. `{colors.muted}`는 **비텍스트 장식(구분선·도트)에만** 쓴다(흰 위 2.76:1 / 다크 3.46:1로 소형 텍스트 AA 미달). **면책·캡션 텍스트는 절대 `muted`를 쓰지 않고 전용 `{colors.disclaimer-fg}` (`#52525B`, ~7:1) / 다크 `{colors.disclaimer-fg-dark}` (`#A1A1AA`)** 를 쓴다. 면책의 "한 단계 낮은 존재감"은 **색이 아니라 사이즈·여백·아이콘**으로 만든다(대비는 양보 불가).
- **destructive `{colors.destructive}` (`#3F3F46` / 다크 `#D4D4D8`, foreground `{colors.destructive-foreground}`)** 는 **로컬 정의 토큰**이다(shadcn 기본을 상속하지 않고 오버라이드). 파괴 액션(관심종목 삭제 등)과 비동기 생성 실패/오류 상태에 쓴다. **빨강은 이미 상승(긍정)으로 LOCKED**이므로 destructive에 빨강을 재사용하면 "상승/긍정"으로 오독된다 — 따라서 **중립-강조(zinc) 톤**으로 두고, **반드시 아이콘 + 텍스트 라벨을 병기**해 색 단독 의존을 금지한다. 등락의 빨강(`{colors.up}`)과 의미가 다르므로 같은 자리에서 충돌하지 않게 한다.

**대비 타깃(load-bearing 조합).** 정보 전달 핵심 조합은 다음을 충족한다: **본문/소형 텍스트 ≥4.5:1, 큰 텍스트(18.66px+ 또는 14px+700)·비텍스트 UI(보더·아이콘) ≥3:1.** 방향색은 위 텍스트 변형(`up-text`/`down-text`)으로 소형 텍스트 4.5:1을, fill은 칩·배지에서 UI 3:1을 만족한다. as-of 앰버 텍스트는 `warning-text`로, 면책은 `disclaimer-fg`로 4.5:1을 만족한다.

피해야 할 것: 그라데이션 표면, 상승색으로서의 초록, 브랜드 액센트의 등락 신호 오용, 두 개 이상의 브랜드 컬러, 면책/소형 텍스트에 `muted` 사용, destructive에 상승 빨강 재사용.

## Typography

shadcn 기본 폰트 램프(Geist)를 **Pretendard로 전면 교체**한다. Pretendard는 KR과 Latin을 한 패밀리로 통합해 한국어 본문과 미국 티커(NVDA)가 섞인 화면에서 일관된 리듬을 준다.

위계는 **3단**으로 고정한다:

- **title `{typography.title}` (17px/700)** — 카드 헤더, 티커, 화면 제목.
- **body `{typography.body}` (14px/400)** — 상승논리·하락리스크 본문, 일반 텍스트.
- **caption `{typography.caption}` (11px/600)** — as-of 시각, 면책 고지, 메타 라벨.

**수치(`{typography.numeric}`)는 `tabular-nums`를 강제**한다 — 시세, 등락률(%), Insight Score, 보유기간/손익. 표·리스트에서 자릿수가 흔들리지 않게 한다. 디스플레이 사이즈·전체 대문자 라벨은 쓰지 않는다(미니멀 균일 위계).

## Layout & Spacing

8px 그리드. 스케일은 4 / 8 / 12 / 16 / 24 / 32px이며 shadcn·Tailwind 4-base와 호환된다. 가장 큰 간격은 주요 카드 사이, 가장 작은 간격은 긴밀한 요소(라벨-값) 사이에 둔다.

**모바일 우선.** 핵심 루프(30초 체크)의 모든 액션은 **엄지 도달 영역**에 배치하고 탭 타깃은 `{spacing.tap-min}`(≥44px) 이상으로 둔다. 모바일은 단일 컬럼, 데스크톱은 대시보드를 멀티 컬럼으로 확장한다(레이아웃 행위 상세는 EXPERIENCE.md).

## Elevation & Depth

shadcn의 절제된 그림자를 상속한다. 그림자를 위계 장치로 쓰지 않는다 — 위계는 레이아웃과 타이포에서 나온다. 카드는 `{colors.surface}`와 `{colors.background}`의 톤 차이 + 1px `{colors.border}`로 구분하며, 호버/포커스 시에만 미세한 그림자를 더한다. 다크 모드에서는 표면 톤(`{colors.surface-dark}`)으로 층을 구분한다.

## Shapes

- `{rounded.sm}` (6px) — 입력, 작은 표면.
- `{rounded.md}` (8px) — 버튼, 일반 카드.
- `{rounded.lg}` (10px) — Research Card, Score 거울 등 주요 표면.
- `{rounded.full}` — 칩, as-of 배지 등 pill 형태에만.

코너는 8~10px대로 부드럽되 과하지 않다. "도구"로 읽히도록 둥근 소비자 앱 느낌은 피한다.

## Components

shadcn 컴포넌트(`Button`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Skeleton`, `Toast`, `Separator`)는 그대로 사용한다. 아래는 브랜드/제품 고유 스펙이다. (행위는 EXPERIENCE.md.Component Patterns에 있으며, 여기는 **시각 스펙만** 규정한다.)

- **Research Card (`{components.research-card}`)** — [리서치 카드 목업](mockups/key-research-card.html)(상승논리·하락리스크 좌측 컬러 보더 분리 + as-of 배지·면책 1줄을 보여주는 시안). `{colors.surface}` 배경, 1px `{colors.border}`, `{rounded.lg}` 코너. 상단에 티커(title) + 시세/등락률(numeric, 등락색). **상승논리 | 하락리스크를 좌측 컬러 보더로 분리**: 상승 블록은 좌측 `{colors.up}` 보더(UI 3:1), 하락 블록은 `{colors.down}` 보더. **소형 헤더 텍스트는 `{colors.up-text}` / `{colors.down-text}`** 를 써 4.5:1을 확보한다(보더=fill, 텍스트=text 변형). 등락률 numeric도 14px 미만이면 `up-text`/`down-text`. 카드 하단에 면책 1줄. as-of 배지는 티커 행 아래.
- **Chip (`{components.chip}`)** — [매수 30초 체크 목업](mockups/key-buy-check.html)(칩 선택 + 점진 공개로 이유·리스크·기간 필드가 펼쳐지는 시안). 탭 선택용 pill, `{rounded.full}`, 최소 높이 `{spacing.tap-min}`(≥44px). 미선택은 `{colors.border}` 외곽선 + `{colors.text-secondary}`, 선택 시 `{colors.primary}` 채움 + `{colors.primary-foreground}`. **"기타(직접)" 옵션을 항상 포함**해 거짓 기록을 방지한다(타이핑 선택지로 전환).
- **Primary Button (`{components.button-primary}`)** — `{colors.primary}` 채움, `{colors.primary-foreground}` 텍스트, `{rounded.md}`, 최소 높이 46px. 화면당 1개의 주 행동(예: "30초 체크 기록").
- **As-of Badge (`{components.asof-badge}`)** — `{colors.warning-bg}` 배경 + `{colors.warning-text}` 텍스트(5:1대 마진), `{rounded.full}` pill. "as of 16:00 EOD · 6/20" 형태. 실시간이 아님을 항상 명시.
- **Disclaimer (`{components.disclaimer}`)** — `{colors.disclaimer-fg}`(AA 4.5:1 보장), caption 사이즈, ⓘ 아이콘 + 한 줄. **존재감은 색이 아니라 사이즈·여백·아이콘으로 낮춘다**(대비 양보 금지). **모든 AI 출력(리서치 카드·복기·통찰)에 per-output으로 동반**한다.
- **Insight Score (거울 / `{components.score-mirror}`)** — [대시보드 목업](mockups/key-dashboard.html)(score-mirror 패턴 문장 + 추세, 지수·관심종목 변화를 담은 대시보드 시안). Insight Score 표시. `{colors.surface}` 카드. **숫자를 크게 강조하는 채점 UI를 피하고**, 프로세스 완수율을 문장+패턴으로 비춘다(예: "매수 5건 중 2건만 리스크 사전 기입"). 추세는 단순 라인/바로.
- **Async/Loading + Retry (`{components.async-state}`)** — 리서치 카드·복기 생성 중 shadcn `Skeleton` + `{colors.primary}` 진행 표시. 실패 시 **조용히 넘어가지 않고** `{colors.destructive}` 오류 + `{colors.primary}` 재시도 버튼을 가시적으로 노출.

## Do's and Don'ts

| Do | Don't |
|---|---|
| 브랜드 레이어 외 모든 토큰은 shadcn 기본 상속 | `primary`·의미색·신뢰 토큰 외 shadcn 색 토큰 오버라이드 |
| 상승=빨강 `{colors.up}`, 하락=파랑 `{colors.down}` (hue 고정). 소형 텍스트는 명도 변형 `{colors.up-text}`/`{colors.down-text}` 허용 | 초록을 상승색으로 사용 / 등락색을 다른 의미로 전용 / hue 자체를 변경 |
| 면책·소형 텍스트는 `{colors.disclaimer-fg}`로 ≥4.5:1, 존재감은 사이즈·여백·아이콘으로 낮춤 | 면책/소형 텍스트에 `{colors.muted}` 사용(대비 미달) / 낮은 대비로 위계 표현 |
| destructive는 중립 zinc 톤 + 아이콘 + 텍스트 라벨 병기 | destructive에 상승 빨강(`{colors.up}`) 재사용(= 긍정 오독) / 색 단독 의존 |
| **방향 색에 부호/화살표 글리프 병기**(▲▼, +/−) — 색맹 안전 | 색만으로 등락을 전달(색맹 사용자 정보 손실) |
| 수치는 `tabular-nums` (시세·등락률·점수) | 비례폭 숫자로 자릿수 흔들림 |
| Deep Indigo는 액센트로만 절제 사용 | 액센트를 등락 신호처럼 배치(순수 빨강/파랑 인접 회피) |
| AI 출력마다 면책 1줄 + as-of 배지 동반 | 면책을 약관에만 두고 출력 지점에서 생략 |
| 데이터 오류/지연을 앰버 배지로 가시화 | 틀린 값을 조용히 그대로 표시 |
| Score는 거울(문장·패턴)로 제시 | 큰 숫자 채점·등수·랭킹으로 성적표화 |
| 탭 타깃 ≥44px, 엄지 영역 | 좁은 탭 타깃·상단 모서리 핵심 액션 |
