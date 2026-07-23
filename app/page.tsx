"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ScanSearch,
  FileCheck2,
  ListChecks,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const MATCH_SCORE = 82;

function MatchRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(246,244,236,0.12)"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3FA796"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-2xl font-semibold text-[#F6F4EC]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {animated}%
        </span>
        <span className="text-[10px] uppercase tracking-wide text-[#A8B0C3]">
          match
        </span>
      </div>
    </div>
  );
}

function KeywordChip({ label, matched }: { label: string; matched: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
        matched
          ? "border-[#3FA796]/40 bg-[#3FA796]/10 text-[#8FE3CF]"
          : "border-[#E8A33D]/40 bg-[#E8A33D]/10 text-[#F3C77E]"
      }`}
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {matched ? <Check size={12} /> : <X size={12} />}
      {label}
    </span>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  copy,
}: {
  icon: React.ElementType;
  title: string;
  copy: string;
}) {
  return (
    <div className="group rounded-2xl border border-[rgba(246,244,236,0.10)] bg-[rgba(246,244,236,0.03)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3FA796]/30 hover:bg-[rgba(246,244,236,0.05)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#3FA796]/10 text-[#3FA796] transition-colors group-hover:bg-[#3FA796]/20">
        <Icon size={20} />
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-[#F6F4EC]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#A8B0C3]">{copy}</p>
    </div>
  );
}

function Step({ n, title, copy }: { n: string; title: string; copy: string }) {
  return (
    <div className="flex gap-4">
      <span
        className="mt-0.5 shrink-0 text-2xl text-[#3FA796]/60"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        {n}
      </span>
      <div>
        <h3 className="mb-1 font-semibold text-[#F6F4EC]">{title}</h3>
        <p className="text-sm leading-relaxed text-[#A8B0C3]">{copy}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main
      className="min-h-screen bg-[#0B1220] text-[#F6F4EC] antialiased"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* NAV */}
      <header className="sticky top-0 z-20 border-b border-[rgba(246,244,236,0.08)] bg-[#0B1220]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span
            className="text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            SmartApply
          </span>
          <nav className="hidden items-center gap-8 text-sm text-[#A8B0C3] md:flex">
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#F6F4EC]"
            >
              How it works
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-[#F6F4EC]"
            >
              Features
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="cursor-pointer border-[rgba(246,244,236,0.2)] bg-transparent text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer bg-[#3FA796] text-[#0B1220] hover:bg-[#3FA796]/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: copy */}
          <div>
            <span
              className="mb-5 inline-block rounded-full border border-[rgba(246,244,236,0.15)] px-3 py-1 text-xs uppercase tracking-wide text-[#A8B0C3]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Resume × job match, in seconds
            </span>
            <h1
              className="text-4xl leading-[1.1] font-medium tracking-tight md:text-5xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Stop guessing if your resume passes the screen.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#A8B0C3]">
              SmartApply compares your resume against a job posting, shows
              exactly which skills and keywords you're missing, and helps you
              fix it before you hit apply.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button className="cursor-pointer h-11 gap-2 bg-[#3FA796] px-6 text-[#0B1220] hover:bg-[#3FA796]/90">
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-11 cursor-pointer border-[rgba(246,244,236,0.2)] bg-transparent px-6 text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
                >
                  Login
                </Button>
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-[rgba(246,244,236,0.08)] pt-8">
              {[
                ["12,400+", "resumes analyzed"],
                ["3.2×", "more interview callbacks"],
                ["68%", "avg. match score lift"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <div
                    className="text-xl font-semibold text-[#F6F4EC]"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {stat}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-[#A8B0C3]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: signature match card */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-[#3FA796]/10 blur-2xl" />
            <div className="rounded-2xl border border-[rgba(246,244,236,0.12)] bg-[rgba(246,244,236,0.04)] p-6 shadow-2xl shadow-black/40">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#A8B0C3]">
                    Analyzing against
                  </p>
                  <p className="mt-0.5 font-medium text-[#F6F4EC]">
                    Senior Product Designer — Northwind
                  </p>
                </div>
                <MatchRing score={MATCH_SCORE} />
              </div>

              <div className="mb-4 h-px bg-[rgba(246,244,236,0.08)]" />

              <p className="mb-3 text-xs uppercase tracking-wide text-[#A8B0C3]">
                Keywords from the posting
              </p>
              <div className="flex flex-wrap gap-2">
                <KeywordChip label="Figma" matched />
                <KeywordChip label="Design systems" matched />
                <KeywordChip label="User research" matched />
                <KeywordChip label="A/B testing" matched={false} />
                <KeywordChip label="SQL" matched={false} />
              </div>

              <div className="mt-5 rounded-xl bg-[rgba(246,244,236,0.05)] p-4">
                <p className="text-xs uppercase tracking-wide text-[#A8B0C3]">
                  Suggested fix
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#F6F4EC]">
                  Add a line about A/B testing — you ran experiments at your
                  last role but didn't name it directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-t border-[rgba(246,244,236,0.08)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="mb-12 text-2xl font-medium tracking-tight md:text-3xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            From resume to submitted application
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <Step
              n="01"
              title="Upload your resume"
              copy="Paste it in or upload a PDF. SmartApply parses your experience in seconds — no formatting cleanup needed."
            />
            <Step
              n="02"
              title="Paste the job posting"
              copy="Drop in a link or the description. We compare it line by line against your resume."
            />
            <Step
              n="03"
              title="Apply with confidence"
              copy="Get a match score, a list of missing keywords, and specific rewrites — before you submit."
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-t border-[rgba(246,244,236,0.08)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="mb-2 text-2xl font-medium tracking-tight md:text-3xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Everything for the application, not just the résumé
          </h2>
          <p className="mb-12 max-w-xl text-sm text-[#A8B0C3]">
            SmartApply covers the parts of applying that actually change whether
            you hear back.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={FileText}
              title="Resume analysis"
              copy="Line-by-line feedback on clarity, impact, and formatting an ATS can actually parse."
            />
            <FeatureCard
              icon={ScanSearch}
              title="Semantic matching"
              copy="See exactly which skills a listing expects — and which ones your resume is missing."
            />
            <FeatureCard
              icon={FileCheck2}
              title="Cover letter drafts"
              copy="Generate a first draft tailored to the role in under a minute, ready to edit."
            />
            <FeatureCard
              icon={ListChecks}
              title="Application tracker"
              copy="Keep every application, status, and follow-up date in one place."
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[rgba(246,244,236,0.08)]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2
            className="mx-auto max-w-lg text-2xl font-medium tracking-tight md:text-3xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Your next offer starts with a better match.
          </h2>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/register">
              <Button className="cursor-pointer h-11 gap-2 bg-[#3FA796] px-6 text-[#0B1220] hover:bg-[#3FA796]/90">
                Get Started
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="cursor-pointer h-11 border-[rgba(246,244,236,0.2)] bg-transparent px-6 text-[#F6F4EC] hover:bg-[rgba(246,244,236,0.08)] hover:text-[#F6F4EC]"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(246,244,236,0.08)] px-6 py-8 text-center text-xs text-[#A8B0C3]">
        © {new Date().getFullYear()} SmartApply
      </footer>
    </main>
  );
}
