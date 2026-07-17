import { lazy, Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroScene = lazy(() => import("./HeroScene"));

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex w-full items-center px-8 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-foreground font-mono text-sm text-background">
            ∷
          </div>
          <span className="font-semibold tracking-tight">
            CS Concept Simulator
          </span>
        </div>
      </nav>

      <section className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 translate-x-[3%] scale-[1.02]">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm text-muted">
                Booting scene…
              </div>
            }
          >
            <HeroScene />
          </Suspense>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,transparent_0%,color-mix(in_oklab,var(--background)_22%,transparent)_42%,var(--background)_82%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1500px] items-center px-8 py-20 lg:px-10">
          <div className="max-w-3xl -translate-x-3 lg:-translate-x-6">
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
              to="/workspace"
              className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-85"
            >
              Enter the lab <ArrowRight className="ml-2 inline" size={15} />
            </Link>
          </div>
          </div>
        </div>
      </section>
    </main>
  );
}
