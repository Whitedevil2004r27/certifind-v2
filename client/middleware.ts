import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isClerkServerEnabled } from "@/lib/auth-config";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/paid-courses(.*)",
  "/admin(.*)",
  "/bookmarks(.*)",
]);

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authState = await auth();

    if (!authState.userId) {
      return loginRedirect(req);
    }
  }
}, {
  signInUrl: "/login",
  signUpUrl: "/signup",
});

function loginRedirect(req: NextRequest) {
  const url = new URL("/login", req.nextUrl);
  const callbackUrl = `${req.nextUrl.pathname}${req.nextUrl.search}`;

  if (callbackUrl !== "/login") {
    url.searchParams.set("callbackUrl", callbackUrl);
  }

  return NextResponse.redirect(url);
}

async function legacyMiddleware(req: NextRequest) {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(
    req.cookies.get("authjs.session-token") ||
      req.cookies.get("__Secure-authjs.session-token") ||
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token")
  );
  const path = nextUrl.pathname;

  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return loginRedirect(req);
  }

  if (path.startsWith("/bookmarks") && !isLoggedIn) {
    return loginRedirect(req);
  }

  if (path.startsWith("/paid-courses")) {
    if (!isLoggedIn) {
      return loginRedirect(req);
    }
  }

  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      return loginRedirect(req);
    }
  }

  if (isLoggedIn && ["/login", "/signup"].includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isClerkServerEnabled()) {
    return clerkHandler(req, event);
  }

  return legacyMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
