import { lazy, Suspense, useMemo } from "react";
import { Command, Menu, PanelRight, Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { getConceptByPath, sectionLabels } from "../lib/contentLoader";
import { Sidebar } from "../features/sidebar/Sidebar";
import { ChatPanel } from "../features/chat/ChatPanel";
import { ReferencesList } from "../features/references/ReferencesList";
import { ThemeToggle } from "../features/theme/ThemeToggle";
export default function Workspace() {
  const loc = useLocation();
  const path = loc.pathname.replace(/^\/workspace\/?/, "").replace(/\/$/, "");
  const concept = getConceptByPath(path);
  const Simulation = concept?.simulation ? lazy(concept.simulation) : null;
  const Logic = concept?.logic ? lazy(concept.logic) : null;
  const tab = new URLSearchParams(loc.search).get("tab") ?? "simulation";
  const trail = path.split("/").filter(Boolean);
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/45 px-4">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background font-mono text-xs">
            ∷
          </span>
          <span className="hidden sm:inline">CS Simulator</span>
        </Link>
        <div className="hidden items-center gap-1 text-xs text-muted md:flex">
          /{" "}
          <Link to="/workspace" className="hover:text-foreground">
            workspace
          </Link>
          {trail.map((t, i) => (
            <span key={t}>
              {" "}
              /{" "}
              <span className={i === trail.length - 1 ? "text-foreground" : ""}>
                {i === 0 ? (sectionLabels[t] ?? t) : (concept?.title ?? t)}
              </span>
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:bg-surface-hover sm:flex">
            <Search size={14} /> Search{" "}
            <kbd className="font-mono text-[10px]">
              <Command size={10} className="inline" />K
            </kbd>
          </button>
          <button
            className="rounded-lg border border-border p-2 text-muted lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={16} />
          </button>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="scrollbar min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
            {concept ? (
              <>
                <div className="mb-7">
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted">
                    {sectionLabels[concept.section] ?? concept.section} ·{" "}
                    {concept.difficulty}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                    {concept.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-muted">{concept.summary}</p>
                </div>
                <div className="mb-5 flex gap-1 border-b border-border">
                  <Link
                    to={loc.pathname + "?tab=simulation"}
                    className={`px-3 py-2 text-sm ${tab === "simulation" ? "border-b-2 border-foreground text-foreground" : "text-muted"}`}
                  >
                    Simulation
                  </Link>
                  <Link
                    to={loc.pathname + "?tab=logic"}
                    className={`px-3 py-2 text-sm ${tab === "logic" ? "border-b-2 border-foreground text-foreground" : "text-muted"}`}
                  >
                    Logic
                  </Link>
                  <Link
                    to={loc.pathname + "?tab=references"}
                    className={`px-3 py-2 text-sm ${tab === "references" ? "border-b-2 border-foreground text-foreground" : "text-muted"}`}
                  >
                    References
                  </Link>
                </div>
                {tab === "references" ? (
                  <ReferencesList references={concept.references} />
                ) : tab === "logic" ? (
                  <Suspense
                    fallback={
                      <div className="text-muted">Loading explanation…</div>
                    }
                  >
                    {Logic && (
                      <article className="prose prose-invert max-w-none text-foreground [&_h1]:text-2xl [&_p]:text-muted [&_code]:font-mono [&_code]:text-accent-algorithms">
                        <Logic />
                      </article>
                    )}
                  </Suspense>
                ) : (
                  <Suspense
                    fallback={
                      <div className="h-72 animate-pulse rounded-2xl bg-surface" />
                    }
                  >
                    {Simulation && <Simulation />}
                  </Suspense>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="font-mono text-xs uppercase tracking-[.2em] text-muted">
                  No concept at this path
                </p>
                <h1 className="mt-3 text-2xl font-semibold">
                  Choose a topic from the library
                </h1>
                <Link
                  to="/workspace/algorithms/sorting/merge-sort"
                  className="mt-6 inline-block rounded-lg bg-foreground px-4 py-2 text-sm text-background"
                >
                  Open Merge Sort
                </Link>
              </div>
            )}
          </div>
        </main>
        <ChatPanel concept={concept} />
      </div>
    </div>
  );
}
