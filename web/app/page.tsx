import Link from "next/link";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

// 정적 랜딩. 로그인 사용자의 /dashboard 리다이렉트는 proxy.ts 미들웨어가 담당.
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col">
      <nav className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-bold tracking-tight">Market Insight OS</span>
        <ThemeSwitcher />
      </nav>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">투자 판단 디버거</h1>
          <p className="text-sm text-muted-foreground">
            매수 직전 30초와 한 달 뒤 복기 사이의 피드백 루프. 종목을 찍어주는
            앱이 아니라, 당신의 판단을 비추는 거울입니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/auth/sign-up">시작하기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">로그인</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
