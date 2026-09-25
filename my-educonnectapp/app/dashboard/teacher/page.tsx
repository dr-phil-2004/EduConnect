// app/dashboard/teacher/page.tsx

import { CourseCard } from "../_components/course-card";
import { StatBlock } from "../_components/stat-block";


// TODO: remplacer par un fetch Prisma réel (Course where teacherId = user.id)
const mockCourses = [
  { id: "1", title: "Bases de données relationnelles", subject: "Informatique", meta: "42 étudiants inscrits" },
  { id: "2", title: "Structures de marché", subject: "Économie", meta: "18 étudiants inscrits" },
];

const mockPendingSubmissions = [
  { id: "s1", student: "Awa Djibril", course: "Bases de données relationnelles", submittedAgo: "il y a 2h" },
  { id: "s2", student: "Kofi Mensah", course: "Bases de données relationnelles", submittedAgo: "il y a 1 jour" },
];

const mockQuestions = [
  { id: "q1", student: "Fadel Soulé", question: "Comment fonctionne une jointure externe ?", course: "Bases de données relationnelles" },
];

export default function TeacherDashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Mon espace</h1>
          <p className="mt-1 text-sm text-ink-soft">Tes cours et ce qui demande ton attention.</p>
        </div>
        <button className="border border-teal bg-teal px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
          Publier un cours
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8 border-b border-line pb-8">
        <StatBlock label="Cours publiés" value={mockCourses.length} accent="teal" />
        <StatBlock label="Devoirs à corriger" value={mockPendingSubmissions.length} accent="gold" />
        <StatBlock label="Questions en attente" value={mockQuestions.length} accent="gold" />
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
              href={`/dashboard/teacher/courses/${course.id}`}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-lg text-ink">À corriger</h2>
        <ul className="flex flex-col divide-y divide-line border-t border-line">
          {mockPendingSubmissions.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-ink">{s.student}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{s.course} · {s.submittedAgo}</p>
              </div>
              <a href={`/dashboard/teacher/grading/${s.id}`} className="text-sm font-medium text-teal hover:underline">
                Corriger
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display mb-4 text-lg text-ink">Questions des étudiants</h2>
        <ul className="flex flex-col divide-y divide-line border-t border-line">
          {mockQuestions.map((q) => (
            <li key={q.id} className="py-3">
              <p className="text-sm font-medium text-ink">{q.question}</p>
              <p className="mt-0.5 text-xs text-ink-soft">{q.student} · {q.course}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}