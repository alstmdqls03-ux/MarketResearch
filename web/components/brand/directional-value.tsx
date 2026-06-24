import { cn } from "@/lib/utils";

// 등락 수치를 색 + 글리프(▲▼) + 부호 + 스크린리더 텍스트로 렌더한다.
// DESIGN.md 규칙 봉인: "색만으로 등락 전달 금지" — 색맹 안전. 소형 텍스트는 up-text/down-text 변형(4.5:1).
// 등락색 hue LOCKED(상승=빨강/하락=파랑). 이후 대시보드·리서치카드가 이 헬퍼를 재사용.

type Direction = "up" | "down" | "flat";

function directionOf(value: number): Direction {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

export interface DirectionalValueProps {
  /** 등락 값. 양수=상승, 음수=하락, 0=보합. */
  value: number;
  /** 표시 접미사 (예: "%"). */
  suffix?: string;
  /** 절댓값 포맷터 (기본: toFixed(2)). */
  format?: (magnitude: number) => string;
  className?: string;
}

export function DirectionalValue({
  value,
  suffix = "",
  format,
  className,
}: DirectionalValueProps) {
  // 누락/비유효 값은 "NaN"이 아니라 명시적 미가용으로 표기 (NFR-R2).
  if (!Number.isFinite(value)) {
    return (
      <span className={cn("text-muted-foreground", className)}>
        <span className="sr-only">데이터 없음</span>
        <span aria-hidden>—</span>
      </span>
    );
  }
  const dir = directionOf(value);
  const glyph = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  const sign = dir === "up" ? "+" : dir === "down" ? "−" : "";
  const srLabel = dir === "up" ? "상승" : dir === "down" ? "하락" : "보합";
  const magnitude = format
    ? format(Math.abs(value))
    : Math.abs(value).toFixed(2);
  const colorClass =
    dir === "up"
      ? "text-up-text"
      : dir === "down"
        ? "text-down-text"
        : "text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-semibold tabular-nums",
        colorClass,
        className,
      )}
    >
      <span aria-hidden>{glyph}</span>
      <span>
        <span className="sr-only">{srLabel} </span>
        {sign}
        {magnitude}
        {suffix}
      </span>
    </span>
  );
}
