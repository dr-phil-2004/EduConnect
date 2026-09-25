// app/dashboard/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "./_components/Sidebar";
import { fraunces, inter } from "@/lib/fonts";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const role =
    ((sessionClaims?.publicMetadata as { role?: string })?.role as
      | "STUDENT"
      | "TEACHER"
      | undefined) ?? "STUDENT";

  return (
    <div className={`${fraunces.variable} ${inter.variable} flex min-h-screen`}>
      <Sidebar role={role} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-line bg-surface px-8 py-4">
          <p className="text-sm text-ink-soft">
            Bienvenue sur votre espace
          </p>
          {/* Emplacement pour le futur toggle d'accessibilité (contraste, lecture vocale) */}
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}