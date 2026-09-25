// app/api/webhooks/clerk/route.ts
// Reçoit les events Clerk (user.created, user.updated) et synchronise avec Prisma.
// C'est ICI qu'on attribue le rôle par défaut (ex: STUDENT) à l'inscription.

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismaClient";
import { clerkClient } from "@clerk/nextjs/server";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as WebhookEvent;
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  // ── Création d'un utilisateur ──
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name, public_metadata, unsafe_metadata } = evt.data;

    // Le rôle peut être choisi côté client via unsafeMetadata lors de l'inscription.
    const chosenRole =
      ((unsafe_metadata as { role?: string } | undefined)?.role === "TEACHER"
        ? "TEACHER"
        : ((public_metadata as { role?: string } | undefined)?.role === "TEACHER"
          ? "TEACHER"
          : "STUDENT")) as "STUDENT" | "TEACHER";

    const user = await prisma.user.create({
      data: {
        clerkId: id,
        email: email_addresses[0]?.email_address ?? "",
        firstName: first_name ?? undefined,
        lastName: last_name ?? undefined,
        role: chosenRole,
      },
    });

    // On répercute le rôle dans les publicMetadata Clerk
    // pour que le middleware puisse le lire sans requête DB à chaque page.
    const client = await clerkClient();
    await client.users.updateUserMetadata(id, {
      publicMetadata: { role: user.role },
    });
  }

  // ── Mise à jour (ex: role changé via onboarding) ──
  if (evt.type === "user.updated") {
    const { id, public_metadata } = evt.data;
    const role = (public_metadata as { role?: string } | undefined)?.role;
    if (id && role) {
      await prisma.user
        .updateMany({
          where: { clerkId: id },
          data: { role: role as "STUDENT" | "TEACHER" | "ADMIN" | "MINISTRY" },
        })
        .catch(() => {});
    }
  }

  // ── Suppression ──
  if (evt.type === "user.deleted") {
    if (evt.data.id) {
      await prisma.user.delete({ where: { clerkId: evt.data.id } }).catch(() => {});
    }
  }

  return new Response("OK", { status: 200 });
}

/**
 * IMPORTANT : quand un ADMIN change le rôle d'un utilisateur côté app,
 * il faut aussi appeler clerkClient().users.updateUserMetadata(clerkId, { publicMetadata: { role } })
 * pour garder Prisma et Clerk synchronisés. Sinon le middleware lira l'ancien rôle.
 */