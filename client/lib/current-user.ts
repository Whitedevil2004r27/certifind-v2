import { auth as clerkAuth, currentUser } from "@clerk/nextjs/server";
import { auth as legacyAuth } from "@/auth";
import { isClerkServerEnabled } from "@/lib/auth-config";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string;
  provider: "clerk" | "legacy";
};

function toRole(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "student";
}

export async function getAppUser(): Promise<AppUser | null> {
  if (isClerkServerEnabled()) {
    const authState = await clerkAuth();

    if (!authState.userId) return null;

    const claims = authState.sessionClaims as
      | {
          email?: string;
          fullName?: string;
          firstName?: string;
          lastName?: string;
          username?: string;
          imageUrl?: string;
          picture?: string;
          metadata?: { role?: unknown };
        }
      | undefined;
    const claimName =
      claims?.fullName ||
      [claims?.firstName, claims?.lastName].filter(Boolean).join(" ") ||
      claims?.username ||
      "";
    let user: Awaited<ReturnType<typeof currentUser>> | null = null;
    if (!claims?.email || !claimName) {
      user = await currentUser();
    }

    const primaryEmail =
      claims?.email ??
      user?.emailAddresses.find((entry) => entry.id === user.primaryEmailAddressId)?.emailAddress ??
      user?.emailAddresses[0]?.emailAddress ??
      "";
    const metadataRole =
      claims?.metadata?.role ??
      user?.publicMetadata?.role ??
      user?.privateMetadata?.role;

    return {
      id: authState.userId,
      email: primaryEmail,
      name: claimName || user?.fullName || user?.username || primaryEmail.split("@")[0] || "Learner",
      image: claims?.imageUrl || claims?.picture || user?.imageUrl,
      role: toRole(metadataRole),
      provider: "clerk",
    };
  }

  const session = await legacyAuth();
  const legacyUser = session?.user as
    | {
        id?: string;
        email?: string | null;
        name?: string | null;
        image?: string | null;
        role?: string;
      }
    | undefined;

  if (!legacyUser?.id) return null;

  const email = legacyUser.email ?? "";

  return {
    id: legacyUser.id,
    email,
    name: legacyUser.name || email.split("@")[0] || "Learner",
    image: legacyUser.image,
    role: legacyUser.role ?? "student",
    provider: "legacy",
  };
}

export function isAdminUser(user: AppUser | null) {
  if (!user) return false;
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return user.role === "admin" || (!!user.email && adminEmails.includes(user.email.toLowerCase()));
}
