import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { Check, X } from "lucide-react";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className="min-h-screen bg-[#0B1220] text-[#F6F4EC] antialiased"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: brand panel (hidden on mobile) */}
        <div className="relative hidden flex-col justify-between overflow-hidden border-r border-[rgba(246,244,236,0.08)] p-10 lg:flex">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#3FA796]/10 blur-3xl" />

          <Link
            href="/"
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            SmartApply
          </Link>

          <div>
            <h1
              className="max-w-sm text-3xl leading-[1.15] font-medium tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Pick up right where your last match left off.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#A8B0C3]">
              Log in to see your saved matches, tracked applications, and
              resume feedback.
            </p>

            {/* small echo of the hero match card */}
            <div className="mt-8 max-w-sm rounded-2xl border border-[rgba(246,244,236,0.12)] bg-[rgba(246,244,236,0.04)] p-5">
              <p className="text-xs uppercase tracking-wide text-[#A8B0C3]">
                Keywords from the posting
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#3FA796]/40 bg-[#3FA796]/10 px-2.5 py-1 text-xs text-[#8FE3CF]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <Check size={12} />
                  Figma
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#3FA796]/40 bg-[#3FA796]/10 px-2.5 py-1 text-xs text-[#8FE3CF]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <Check size={12} />
                  Design systems
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E8A33D]/40 bg-[#E8A33D]/10 px-2.5 py-1 text-xs text-[#F3C77E]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  <X size={12} />
                  SQL
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#A8B0C3]">
            © {new Date().getFullYear()} SmartApply
          </p>
        </div>

        {/* Right: form */}
        <div className="flex flex-col items-center justify-center p-6">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              SmartApply
            </Link>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-6 text-center lg:text-left">
              <h2
                className="text-2xl font-medium tracking-tight"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-[#A8B0C3]">
                Log in to continue where you left off.
              </p>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-[#A8B0C3]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#3FA796] hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}