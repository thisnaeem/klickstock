import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const LOGIN = "/login";
export const PUBLIC_ROUTES = [
  "/",
  "/login", 
  "/register",
  "/api/auth/signup",
  "/api/auth/verify"
];

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isLoginPage = nextUrl.pathname === LOGIN;
  const isMaintenancePage = nextUrl.pathname === "/maintenance";
  const isApiRoute = nextUrl.pathname.startsWith('/api/');

  // Check if maintenance mode is enabled
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // If in maintenance mode and not on maintenance page, redirect to maintenance
  if (isMaintenanceMode && !isMaintenancePage) {
    return NextResponse.redirect(new URL("/maintenance", nextUrl));
  }

  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Allow all API routes to pass through
  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isAuthenticated && isLoginPage) {
    // Redirect authenticated users from login page to dashboard
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}