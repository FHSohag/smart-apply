import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UploadResumeDialog } from "@/components/resume/upload-resume-dialog";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  hasResume: boolean;
}

export function DashboardHeader({ user, hasResume }: DashboardHeaderProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1
          className="text-3xl font-medium tracking-tight text-[#F6F4EC]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          Welcome back, {user.name} 👋
        </h1>

        <p className="mt-2 text-[#A8B0C3]">
          Manage your resumes and get AI-powered job recommendations.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {!hasResume && <UploadResumeDialog />}

        <div className="flex items-center gap-3 rounded-lg border border-[rgba(246,244,236,0.12)] bg-[rgba(246,244,236,0.03)] px-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="bg-[#3FA796]/15 text-[#3FA796]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:block">
            <p className="font-medium text-[#F6F4EC]">{user.name}</p>

            <p className="text-sm text-[#A8B0C3]">{user.email}</p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
