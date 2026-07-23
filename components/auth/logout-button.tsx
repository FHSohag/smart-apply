"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

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

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="icon"
      className="cursor-pointer text-[#A8B0C3] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
      aria-label="Logout"
    >
      <LogOut className="h-6 w-6" />
    </Button>
  );
}
