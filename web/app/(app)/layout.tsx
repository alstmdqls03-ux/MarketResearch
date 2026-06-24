import { Suspense } from "react";

import { AuthBadge } from "@/components/app-shell/auth-badge";
import { BottomTabBar } from "@/components/app-shell/bottom-tab-bar";
import { SideNav } from "@/components/app-shell/side-nav";

// 앱 셸 — 이후 모든 (app) 화면이 상속. 모바일=하단 탭바+상단 헤더, 데스크톱=사이드 내비.
// 인증 보호는 proxy.ts 미들웨어가 담당(Story 1.2). 사용자 표식/로그아웃=AuthBadge.
export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* 스킵 링크 — 키보드 포커스 시에만 표시 (a11y 베이스라인) */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        본문 바로가기
      </a>
      <SideNav
        authSlot={
          <Suspense fallback={null}>
            <AuthBadge />
          </Suspense>
        }
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 모바일 헤더 — 데스크톱은 사이드 내비가 대체 */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-2 md:hidden">
          <span className="text-sm font-bold tracking-tight">
            Market Insight OS
          </span>
          <div className="min-w-0 max-w-[60%]">
            <Suspense fallback={null}>
              <AuthBadge />
            </Suspense>
          </div>
        </header>
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] outline-none md:pb-0"
        >
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}
