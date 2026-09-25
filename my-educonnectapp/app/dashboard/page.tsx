import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const role =
    ((sessionClaims?.publicMetadata as { role?: string })?.role ?? "STUDENT") ===
    "TEACHER"
      ? "TEACHER"
      : "STUDENT";

  redirect(role === "TEACHER" ? "/dashboard/teacher" : "/dashboard/student");
}
