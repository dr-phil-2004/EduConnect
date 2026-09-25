// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const STUDENT_NAV: NavItem[] = [
  { label: "Mes cours", href: "/dashboard/student" },
  { label: "Mes devoirs", href: "/dashboard/student/submissions" },
  { label: "Mes questions", href: "/dashboard/student/questions" },
  { label: "Annonces", href: "/dashboard/student/announcements" },
];

const TEACHER_NAV: NavItem[] = [
  { label: "Mes cours", href: "/dashboard/teacher" },
  { label: "À corriger", href: "/dashboard/teacher/grading" },
  { label: "Questions étudiants", href: "/dashboard/teacher/questions" },
  { label: "Annonces", href: "/dashboard/teacher/announcements" },
];

export function Sidebar({ role }: { role: "STUDENT" | "TEACHER" }) {
  const pathname = usePathname();
  const items = role === "TEACHER" ? TEACHER_NAV : STUDENT_NAV;

  return (
    <nav
      aria-label="Navigation principale"
      className="flex h-full w-64 flex-col border-r border-line bg-surface px-4 py-6"
    >
      <div className="mb-8 px-2">
        <span className="font-display text-lg text-teal">EduConnect</span>
        <p className="mt-1 text-xs text-ink-soft">
          {role === "TEACHER" ? "Espace enseignant" : "Espace étudiant"}
        </p>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-teal-soft font-medium text-teal"
                    : "text-ink-soft hover:bg-teal-soft hover:text-teal"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}