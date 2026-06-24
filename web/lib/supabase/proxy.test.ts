import { describe, expect, it } from "vitest";

import { isPublicPath } from "./proxy";

describe("isPublicPath (보호 정책)", () => {
  it("공개 경로: 랜딩(/)과 인증 플로우(/auth/*)", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/auth/login")).toBe(true);
    expect(isPublicPath("/auth/sign-up")).toBe(true);
    expect(isPublicPath("/auth/forgot-password")).toBe(true);
  });

  it("보호 경로: 앱 셸 (app) 라우트는 로그인 필요", () => {
    for (const p of ["/dashboard", "/watchlist", "/score", "/brief"]) {
      expect(isPublicPath(p)).toBe(false);
    }
  });

  it("보호 경로: 알 수 없는 경로도 기본 보호", () => {
    expect(isPublicPath("/settings")).toBe(false);
    expect(isPublicPath("/decisions/123")).toBe(false);
  });
});
