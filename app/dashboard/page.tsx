import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>

      <p className="mt-2 text-muted-foreground">
        You are logged in to SmartApply.
      </p>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </main>
  );
}
