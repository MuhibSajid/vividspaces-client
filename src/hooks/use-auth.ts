import { authClient } from "@/lib/auth-client";

export type AuthUser = {
  name: string;
  email: string;
  image?: string;
};

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  const user: AuthUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? undefined,
      }
    : null;

  async function logout() {
    await authClient.signOut();
  }

  return { user, isPending, logout };
}