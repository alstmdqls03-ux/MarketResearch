import { BottomTabBar } from "@/components/app-shell/bottom-tab-bar";
import { SideNav } from "@/components/app-shell/side-nav";

// 앱 셸 — 이후 모든 (app) 화면이 상속. 모바일=하단 탭바, 데스크톱=사이드 내비.
// 인증 보호(미들웨어 matcher)는 Story 1.2 소관.
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
      <SideNav />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] outline-none md:pb-0"
      >
        {children}
      </main>
      <BottomTabBar />
    </div>
  );
}
