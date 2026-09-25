// app/dashboard/page.tsx
// Cette page ne devrait normalement jamais être affichée car le middleware redirige
// vers /dashboard/teacher ou /dashboard/student selon le rôle
import { redirect } from "next/navigation";

export default function DashboardIndexPage() {
  redirect("/dashboard/student");
}