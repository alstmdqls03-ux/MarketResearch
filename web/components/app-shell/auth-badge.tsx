import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

// 셸의 로그인 사용자 표식 + 로그아웃 (서버 컴포넌트, getClaims = 로컬 JWT).
// (app) 라우트는 미들웨어 보호 하에 있어 보통 사용자가 존재한다.
export async function AuthBadge() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  if (!email) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className="min-w-0 flex-1 truncate text-xs text-muted-foreground"
        title={email}
      >
        {email}
      </span>
      <LogoutButton />
    </div>
  );
}
