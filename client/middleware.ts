import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: do not add logic between this and return
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const role = user?.user_metadata?.role as string | undefined;

  // /dashboard — requires any login
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // /saved — requires student or above
  if (path.startsWith('/saved') && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // /paid-courses — requires premium or admin
  if (path.startsWith('/paid-courses')) {
    if (!user || !['premium', 'admin'].includes(role ?? '')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // /admin — requires admin role only
  if (path.startsWith('/admin')) {
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
      .split(',').map(e => e.trim().toLowerCase());
    const isAdmin = user && adminEmails.includes(user.email?.toLowerCase() ?? '');
    if (!isAdmin) {
      return user
        ? NextResponse.redirect(new URL('/dashboard', request.url))
        : NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Already logged in — redirect away from auth pages
  if (user && ['/login', '/signup'].includes(path)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/paid-courses/:path*',
    '/admin/:path*',
    '/saved/:path*',
    '/login',
    '/signup',
  ],
};
