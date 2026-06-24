"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

import { isActive, navItems } from "./nav-items";

// 데스크톱 좌측 사이드 내비 (≥md). 모바일에선 숨김(하단 탭바가 대체). (UX-DR11)
// authSlot = 서버에서 렌더한 로그인 사용자 표식/로그아웃(AuthBadge).
export function SideNav({ authSlot }: { authSlot?: ReactNode }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="주요 메뉴"
      className="hidden w-56 shrink-0 flex-col border-r border-border bg-card md:flex"
    >
      <div className="px-4 py-5 text-base font-bold tracking-tight">
        Market Insight OS
      </div>
      <ul className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm",
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-2 border-t border-border p-3">
        {authSlot}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
