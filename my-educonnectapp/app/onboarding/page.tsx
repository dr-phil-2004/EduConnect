"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";

type Role = "STUDENT" | "TEACHER";

export default function OnboardingPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [selected, setSelected] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  async function handleConfirm(role: Role) {
    if (!user) return;
    setSelected(role);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement");

      const target = role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student";
      router.replace(target);
    } catch {
      setError("Une erreur est survenue. Réessaie.");
      setSaving(false);
    }
  }

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.15_180)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="w-full max-w-lg">
        <h1 className="font-display text-2xl text-ink text-center">
          Bienvenue sur EduConnect
        </h1>
        <p className="mt-2 text-center text-sm text-ink-soft">
          Choisis ton profil pour personnaliser ton espace.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => handleConfirm("STUDENT")}
            disabled={saving}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center transition-colors disabled:opacity-60 ${
              selected === "STUDENT"
                ? "border-[oklch(0.55_0.15_180)] bg-[oklch(0.92_0.05_180)]"
                : "border-line hover:border-[oklch(0.55_0.15_180)] hover:bg-[oklch(0.92_0.05_180)]"
            }`}
          >
            <GraduationCap className="h-10 w-10 text-[oklch(0.55_0.15_180)]" />
            <span className="font-display text-lg text-ink">Étudiant</span>
            <span className="text-xs text-ink-soft">Accède à tes cours, devoirs et annonces.</span>
          </button>

          <button
            onClick={() => handleConfirm("TEACHER")}
            disabled={saving}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 text-center transition-colors disabled:opacity-60 ${
              selected === "TEACHER"
                ? "border-[oklch(0.55_0.15_180)] bg-[oklch(0.92_0.05_180)]"
                : "border-line hover:border-[oklch(0.55_0.15_180)] hover:bg-[oklch(0.92_0.05_180)]"
            }`}
          >
            <BookOpen className="h-10 w-10 text-[oklch(0.55_0.15_180)]" />
            <span className="font-display text-lg text-ink">Enseignant</span>
            <span className="text-xs text-ink-soft">Publie des cours, corrige et réponds aux questions.</span>
          </button>
        </div>

        {saving && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
            <Loader2 className="h-4 w-4 animate-spin" />
            Configuration de ton espace…
          </div>
        )}
        {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
