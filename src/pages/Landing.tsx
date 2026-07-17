import { lazy, Suspense } from "react";
import {
  ArrowRight,
  Box,
  Network,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { sectionLabels } from "../lib/contentLoader";
const HeroScene = lazy(() => import("./HeroScene"));
const cards = [
  [
    "algorithms",
    Workflow,
    "Algorithms",
    "Trace the decisions behind classic algorithms.",
  ],
  [
    "os",
    Box,
    "Operating systems",
    "See scheduling, memory, and process state.",
  ],
  [
    "networking",
    Network,
    "Networking",
    "Follow packets through real protocols.",
  ],
  ["systems", Terminal, "Systems", "Make pointers and bytes tangible."],
  ["languages", Zap, "Languages", "Understand runtime behavior by doing."],
] as const;

const accentClasses: Record<string, string> = {
  algorithms: "text-accent-algorithms",
  os: "text-accent-os",
  networking: "text-accent-networking",
  systems: "text-accent-systems",
  languages: "text-accent-languages",
};
export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background font-mono text-sm">
            ∷
          </div>
          <span className="font-semibold tracking-tight">
            CS Concept Simulator
          </span>
        </div>
        <Link
          to="/workspace"
          className="text-sm text-muted hover:text-foreground"
        >
          Open workspace <ArrowRight className="ml-1 inline" size={14} />
        </Link>
      </nav>
      <section className="relative mx-auto grid max-w-7xl items-center gap-6 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:pt-20">
        <div className="relative z-10">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[.25em] text-accent-algorithms">
            An interactive CS lab
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.05em] sm:text-7xl">
            Make the invisible parts of computing{" "}
            <span className="text-muted">visible.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            Explore algorithms, systems, and protocols as living diagrams.
            Change a step. Watch the model respond. Build intuition that sticks.
          </p>
          <div className="mt-9 flex gap-3">
            <Link
              to="/workspace/algorithms/sorting/merge-sort"
              className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-85"
            >
              Enter the lab <ArrowRight className="ml-2 inline" size={15} />
            </Link>
            <a
              href="#sections"
              className="rounded-lg border border-border px-5 py-3 text-sm text-muted hover:bg-surface-hover"
            >
              Browse sections
            </a>
          </div>
        </div>
        <div className="h-[370px] min-h-0 rounded-3xl border border-border bg-surface/55 shadow-panel">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted">
                Booting scene…
              </div>
            }
          >
            <HeroScene />
          </Suspense>
        </div>
      </section>
      <section
        id="sections"
        className="mx-auto max-w-7xl border-t border-border px-6 py-14"
      >
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted">
              The library
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Five ways to think in systems
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {Object.keys(sectionLabels).length} sections · growing
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([key, Icon, title, desc]) => (
            <Link
              to={`/workspace/${key}`}
              key={key}
              className="group rounded-2xl border border-border bg-surface/45 p-4 transition hover:-translate-y-1 hover:bg-surface-hover"
            >
              <Icon size={18} className={accentClasses[key]} />
              <h3 className="mt-10 font-medium">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
              <ArrowRight
                size={15}
                className="mt-5 text-muted transition group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
