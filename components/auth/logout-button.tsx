"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess() {
          toast.success("Logged out successfully");
          router.push("/login");
        },
      },
    });
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
