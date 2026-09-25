// scripts/set-role.ts
// Usage : npx tsx scripts/set-role.ts ton-email@exemple.com TEACHER
import "dotenv/config";
import { createClerkClient } from "@clerk/backend";
import { prisma } from "@/lib/prismaClient";


const VALID_ROLES = ["STUDENT", "TEACHER", "ADMIN", "MINISTRY"] as const;
type Role = (typeof VALID_ROLES)[number];

async function main() {
  const [email, role] = process.argv.slice(2);

  if (!email || !role || !VALID_ROLES.includes(role as Role)) {
    console.error("Usage: npx tsx scripts/set-role.ts <email> <STUDENT|TEACHER|ADMIN|MINISTRY>");
    process.exit(1);
  }

  const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

  // 1. Trouver l'utilisateur Clerk par email
  const { data: users } = await clerkClient.users.getUserList({ emailAddress: [email] });
  const clerkUser = users[0];

  if (!clerkUser) {
    console.error(`Aucun utilisateur Clerk trouvé pour ${email}`);
    process.exit(1);
  }

  // 2. Mettre à jour Clerk (publicMetadata → lu par le middleware)
  await clerkClient.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: { role },
  });

  // 3. Mettre à jour Prisma (source de vérité pour les requêtes DB)
  // upsert : si le webhook n'a pas encore créé la ligne (ex. pas de tunnel
  // webhook configuré en local), on la crée ici au lieu d'échouer.
  await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: { role: role as Role },
    create: {
      clerkId: clerkUser.id,
      email,
      role: role as Role,
    },
  });

  console.log(`✅ ${email} est maintenant ${role}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});