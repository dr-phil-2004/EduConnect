// app/dashboard/student/page.tsx

import { CourseCard } from "../_components/course-card";
import { StatBlock } from "../_components/stat-block";


// TODO: remplacer par un fetch Prisma réel (CourseEnrollment where studentId = user.id)
const mockCourses = [
  { id: "1", title: "Bases de données relationnelles", subject: "Informatique", meta: "3 nouvelles ressources" },
  { id: "2", title: "Structures de marché", subject: "Économie", meta: "Devoir à rendre le 28 sept." },
  { id: "3", title: "Algèbre linéaire", subject: "Mathématiques", meta: "Aucune activité récente" },
];

const mockAnnouncements = [
  { id: "a1", title: "Ouverture des inscriptions bourses 2026", author: "Ministère de l'Enseignement Supérieur" },
  { id: "a2", title: "Report de l'examen de mi-semestre", author: "Prof. Adjovi — Bases de données" },
];

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl text-ink">Mon espace</h1>
        <p className="mt-1 text-sm text-ink-soft">Un aperçu de tes cours et de ce qui t'attend.</p>
      </div>

      <div className="grid grid-cols-3 gap-8 border-b border-line pb-8">
        <StatBlock label="Cours suivis" value={mockCourses.length} accent="teal" />
        <StatBlock label="Devoirs en attente" value={1} accent="gold" />
        <StatBlock label="Questions sans réponse" value={0} accent="teal" />
      </div>

      <section>
        <h2 className="font-display mb-4 text-lg text-ink">Mes cours</h2>
        <div className="grid grid-cols-2 gap-4">
          {mockCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              subject={course.subject}
              meta={course.meta}
              href={`/dashboard/student/courses/${course.id}`}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-lg text-ink">Annonces officielles</h2>
        <ul className="flex flex-col divide-y divide-line border-t border-line">
          {mockAnnouncements.map((a) => (
            <li key={a.id} className="py-3">
              <p className="text-sm font-medium text-ink">{a.title}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{a.author}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}