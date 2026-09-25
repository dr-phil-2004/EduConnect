// proxy.ts — à la racine du projet Next.js
// Protège les routes selon le rôle stocké dans les publicMetadata Clerk

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/teacher(.*)",
  "/admin(.*)",
  "/ministry(.*)",
  "/onboarding(.*)",
]);

const isTeacherRoute = createRouteMatcher(["/teacher(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isMinistryRoute = createRouteMatcher(["/ministry(.*)"]);

const DEFAULT_ROLE = "STUDENT";

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  // Pas connecté → redirection login
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role =
    (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role ??
    DEFAULT_ROLE;

  // Redirection automatique pour /dashboard vers le bon dashboard selon le rôle
  if (req.nextUrl.pathname === "/dashboard") {
    const target = role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Nouvel utilisateur sans rôle défini → onboarding
  if (!role && req.nextUrl.pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isTeacherRoute(req) && role !== "TEACHER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isMinistryRoute(req) && role !== "MINISTRY" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
