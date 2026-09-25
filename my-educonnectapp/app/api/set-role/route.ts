import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";

type Role = "STUDENT" | "TEACHER";
const VALID: Role[] = ["STUDENT", "TEACHER"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const role = VALID.includes(body.role as Role) ? (body.role as Role) : null;
  if (!role) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });

  await prisma.user
    .updateMany({
      where: { clerkId: userId },
      data: { role },
    })
    .catch(() => {});

  return NextResponse.json({ role });
}
