// middleware.ts — à la racine du projet Next.js
// Protège les routes selon le rôle stocké dans les publicMetadata Clerk

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes par rôle
const isTeacherRoute = createRouteMatcher(["/teacher(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isMinistryRoute = createRouteMatcher(["/ministry(.*)"]);
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/teacher(.*)",
  "/admin(.*)",
  "/ministry(.*)",
  
]);
const isPubliqueRoute = createRouteMatcher([
  "/"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Route publique : rien à vérifier
  if (!isProtectedRoute(req)) return NextResponse.next();

  // Pas connecté → redirection login
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Le rôle est stocké dans publicMetadata.role (défini via webhook à l'inscription)
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role ?? "STUDENT";

  // Redirection automatique pour /dashboard vers le bon dashboard selon le rôle
  if (req.nextUrl.pathname === "/dashboard") {
    if (role === "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard/teacher", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard/student", req.url));
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