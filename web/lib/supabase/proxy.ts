import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

// 보호 정책 (순수 함수 — 테스트 용이). 공개 = 랜딩(/)·인증 플로우(/auth/*).
// 그 외(앱 셸 (app)/* = /dashboard·/watchlist·/score·/brief 포함)는 로그인 필요.
// "/auth" 정확 매칭 + "/auth/" 접두만 공개 — "/authxyz" 같은 우발적 공개 방지.
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" || pathname === "/auth" || pathname.startsWith("/auth/")
  );
}

// 갱신된 세션 쿠키를 리다이렉트 응답으로 이관 (브라우저-서버 세션 동기화 유지).
function redirectWithSession(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip proxy check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    // 비로그인 → 로그인 화면으로 리다이렉트 (FR1)
    return redirectWithSession(request, "/auth/login", supabaseResponse);
  }

  if (user && pathname === "/") {
    // 로그인 사용자가 랜딩에 오면 앱 셸로 (랜딩 페이지는 정적 유지)
    return redirectWithSession(request, "/dashboard", supabaseResponse);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
