import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadResumeDialog } from "@/components/resume/upload-resume-dialog";
import { LogoutButton } from "@/components/auth/logout-button";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
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
        <h1 className="text-3xl font-bold">Welcome back, {user.name} 👋</h1>

        <p className="mt-2 text-muted-foreground">
          Manage your resumes and prepare AI-powered job applications.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <UploadResumeDialog />

        <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="hidden text-left sm:block">
            <p className="font-medium leading-none">{user.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          </div>

          <form action="/api/auth/sign-out" method="POST">
            <LogoutButton />
          </form>
        </div>
      </div>
    </header>
  );
}
