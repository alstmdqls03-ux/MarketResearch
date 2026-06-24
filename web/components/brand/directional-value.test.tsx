import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { DirectionalValue } from "./directional-value";

describe("DirectionalValue", () => {
  it("상승: ▲ 글리프 + '상승' SR텍스트 + + 부호 (색 단독 금지)", () => {
    const { container } = render(<DirectionalValue value={2.5} suffix="%" />);
    expect(container.textContent).toContain("▲");
    expect(container.textContent).toContain("상승");
    expect(container.textContent).toContain("+2.50%");
  });

  it("하락: ▼ 글리프 + '하락' SR텍스트 + 절댓값", () => {
    const { container } = render(<DirectionalValue value={-8} suffix="%" />);
    expect(container.textContent).toContain("▼");
    expect(container.textContent).toContain("하락");
    expect(container.textContent).toContain("8.00%");
  });

  it("보합: — 글리프 + '보합'", () => {
    const { container } = render(<DirectionalValue value={0} suffix="%" />);
    expect(container.textContent).toContain("—");
    expect(container.textContent).toContain("보합");
  });

  it("커스텀 포맷터 적용", () => {
    const { container } = render(
      <DirectionalValue value={1234.5} format={(n) => n.toLocaleString()} />,
    );
    expect(container.textContent).toContain("1,234.5");
  });

  it("axe 위반 없음", async () => {
    const { container } = render(<DirectionalValue value={2.5} suffix="%" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
