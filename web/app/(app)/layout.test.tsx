import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import AppLayout from "./layout";

// 반응형 nav 2개(side/bottom)가 jsdom에선 모두 DOM에 남아 axe landmark-unique 오탐을 유발하므로
// (실제 브라우저는 display:none으로 한쪽만 a11y 트리에 노출) 레이아웃은 구조 검증만,
// axe는 단일 nav 컴포넌트(bottom-tab-bar)·directional-value 테스트에서 수행한다.
describe("AppLayout (앱 셸)", () => {
  it("스킵 링크가 #main을 가리킨다", () => {
    render(
      <AppLayout>
        <div>본문</div>
      </AppLayout>,
    );
    expect(
      screen.getByRole("link", { name: "본문 바로가기" }),
    ).toHaveAttribute("href", "#main");
  });

  it("main 랜드마크에 id=main", () => {
    render(
      <AppLayout>
        <div>본문</div>
      </AppLayout>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
  });
});
