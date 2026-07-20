import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sectionLabels } from "../../lib/contentLoader";
import type { ConceptNode } from "../../lib/types";
import { accentClass } from "../../lib/utils";
import {
  CUSTOM_SIMULATIONS_LABEL,
  CUSTOM_SIMULATIONS_SECTION,
  useGeneratedConcepts,
} from "../generate/GeneratedConceptsContext";

type SidebarVariant = "desktop" | "mobile";

type SidebarProps = {
  variant?: SidebarVariant;
  onNavigate?: () => void;
};

function getContentPath(pathname: string) {
  return pathname.replace(/^\/workspace\/?/, "").replace(/\/$/, "");
}

function countLeafConcepts(node: ConceptNode): number {
  if (node.children.length === 0) return 1;

  return node.children.reduce(
    (count, child) =>
      count + (child.children.length > 0 ? countLeafConcepts(child) : 1),
    0,
  );
}

function containsActivePath(node: ConceptNode, contentPath: string): boolean {
  return (
    node.path === contentPath ||
    node.children.some((child) => containsActivePath(child, contentPath))
  );
}

function ConceptNodeLink({
  node,
  depth,
  contentPath,
  onNavigate,
}: {
  node: ConceptNode;
  depth: number;
  contentPath: string;
  onNavigate?: () => void;
}) {
  const hasChildren = node.children.length > 0;
  const [open, setOpen] = useState(() => containsActivePath(node, contentPath));
  const isActive = contentPath === node.path;

  useEffect(() => {
    if (containsActivePath(node, contentPath)) setOpen(true);
  }, [contentPath, node]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 ${
          isActive ? "bg-surface-hover" : ""
        }`}
        style={{ paddingLeft: 26 + depth * 14 }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={`Toggle ${node.title}`}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded p-1 text-muted transition hover:bg-surface-hover hover:text-foreground"
          >
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        ) : (
          <span className="w-5" aria-hidden="true" />
        )}
        {node.isCategory ? (
          <span className="flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-3 text-xs font-medium text-foreground">
            <Folder size={14} aria-hidden="true" />
            <span className="truncate">{node.title}</span>
          </span>
        ) : (
          <Link
            to={`/workspace/${node.path}`}
            onClick={onNavigate}
            className={`flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-3 text-xs ${
              isActive
                ? `font-semibold ${accentClass(node.section)}`
                : "text-muted hover:text-foreground"
            }`}
          >
            <FileCode2 size={14} />
            <span className="truncate">{node.title}</span>
          </Link>
        )}
      </div>
      {hasChildren && open
        ? node.children.map((child) => (
            <ConceptNodeLink
              key={child.path}
              node={child}
              depth={depth + 1}
              contentPath={contentPath}
              onNavigate={onNavigate}
            />
          ))
        : null}
    </div>
  );
}

export function Sidebar({ variant = "desktop", onNavigate }: SidebarProps) {
  const [hidden, setHidden] = useState(false);
  const { conceptTree } = useGeneratedConcepts();
  const location = useLocation();
  const contentPath = getContentPath(location.pathname);
  const activeSection = contentPath.split("/")[0];
  const sectionRoot = conceptTree.find((node) => node.path === activeSection);
  const sectionLabel =
    sectionRoot?.title ??
    sectionLabels[activeSection] ??
    (activeSection === CUSTOM_SIMULATIONS_SECTION
      ? CUSTOM_SIMULATIONS_LABEL
      : undefined);

  // The library is intentionally contextual: at the workspace overview there
  // is no active section, so navigation stays out of the way.
  if (!sectionRoot || !sectionLabel) return null;

  if (variant === "desktop" && hidden) {
    return (
      <aside className="hidden w-12 shrink-0 border-r border-border bg-surface/40 lg:block">
        <button
          type="button"
          aria-label="Show Library sidebar"
          title="Show Library"
          onClick={() => setHidden(false)}
          className="m-2 rounded-lg p-2 text-muted transition hover:bg-surface-hover hover:text-foreground"
        >
          <PanelLeftOpen size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={
        variant === "desktop"
          ? "scrollbar hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-surface/40 py-4 lg:block"
          : "scrollbar min-h-0 flex-1 w-full overflow-y-auto bg-surface py-4"
      }
    >
      {variant === "desktop" ? (
        <div className="flex items-center justify-between px-4 pb-3">
          <Link
            to={`/workspace/${activeSection}`}
            onClick={onNavigate}
            className="font-mono text-[10px] uppercase tracking-[.2em] text-muted transition hover:text-foreground"
          >
            {sectionLabel}
          </Link>
          <button
            type="button"
            aria-label="Hide Library sidebar"
            title="Hide Library"
            onClick={() => setHidden(true)}
            className="rounded-md p-1 text-muted transition hover:bg-surface-hover hover:text-foreground"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>
      ) : null}

      <nav aria-label={`${sectionLabel} concepts`} className="space-y-1 px-2">
        <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted">
          {countLeafConcepts(sectionRoot)} concept
          {countLeafConcepts(sectionRoot) === 1 ? "" : "s"}
        </div>
        {sectionRoot.children.map((child) => (
          <ConceptNodeLink
            key={child.path}
            node={child}
            depth={0}
            contentPath={contentPath}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </aside>
  );
}
