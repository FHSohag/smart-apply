import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-bold">SmartApply</h1>

      <p className="text-muted-foreground text-center max-w-xl">
        AI-powered career assistant to help you build better resumes, analyze
        job opportunities, and improve your applications.
      </p>

      <div className="flex gap-4">
        <Link href="/register">
          <Button>Get Started</Button>
        </Link>

        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
    </main>
  );
}
