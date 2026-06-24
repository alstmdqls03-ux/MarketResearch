import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

vi.mock("next/navigation", () => ({
  usePathname: () => "/watchlist",
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

import { BottomTabBar } from "./bottom-tab-bar";

describe("BottomTabBar", () => {
  it("4개 탭을 렌더한다", () => {
    render(<BottomTabBar />);
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(
      screen.getByRole("navigation", { name: "주요 메뉴" }),
    ).toBeInTheDocument();
  });

  it("현재 경로 탭에만 aria-current=page", () => {
    render(<BottomTabBar />);
    expect(screen.getByRole("link", { name: /관심종목/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /대시보드/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("axe 위반 없음", async () => {
    const { container } = render(<BottomTabBar />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
