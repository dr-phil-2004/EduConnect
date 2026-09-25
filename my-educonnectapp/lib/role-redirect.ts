// lib/role-redirect.ts
export function getDashboardPathForRole(role?: string): string {
  if (role === "TEACHER") return "/dashboard/teacher";
  return "/dashboard/student";
}