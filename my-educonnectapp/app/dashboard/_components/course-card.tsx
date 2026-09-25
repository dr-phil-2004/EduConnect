// components/dashboard/course-card.tsx
import Link from "next/link";

export function CourseCard({
  id,
  title,
  subject,
  meta,
  href,
}: {
  id: string;
  title: string;
  subject: string;
  meta: string; // ex: "12 étudiants" ou "Dernière mise à jour il y a 2 jours"
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-line bg-surface px-5 py-4 transition-colors hover:border-teal focus-visible:border-teal"
    >
      <p className="text-sm font-medium text-gold">{subject}</p>
      <h3 className="font-display mt-1 text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft">{meta}</p>
    </Link>
  );
}