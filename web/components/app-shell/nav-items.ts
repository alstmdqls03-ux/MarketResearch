import {
  Activity,
  LayoutDashboard,
  Newspaper,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// 탭바·사이드내비 공유 진입점 (단일 소스). 피처 화면은 후속 스토리(1.4~1.7·4.x).
export const navItems: NavItem[] = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/watchlist", label: "관심종목", icon: Star },
  { href: "/score", label: "Score", icon: Activity },
  { href: "/brief", label: "Daily Brief", icon: Newspaper },
];

// 현재 경로가 해당 탭에 속하는지 (자식 경로 포함)
export function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}
