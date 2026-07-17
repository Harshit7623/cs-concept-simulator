import { ChevronDown, ChevronRight, Folder, FileCode2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { conceptTree, sectionLabels } from "../../lib/contentLoader";
import { accentClass } from "../../lib/utils";
import type { ConceptNode } from "../../lib/types";
function Node({ node, depth = 0 }: { node: ConceptNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const loc = useLocation();
  const active = loc.pathname.endsWith(node.path);
  return (
    <div>
      <div
        className={`flex items-center gap-1 ${active ? "bg-surface-hover" : ""}`}
        style={{ paddingLeft: 12 + depth * 14 }}
      >
        {node.children.length > 0 && (
          <button
            aria-label="Toggle folder"
            onClick={() => setOpen((v) => !v)}
            className="p-1 text-muted"
          >
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        )}
        <Link
          to={`/workspace/${node.path}`}
          className={`flex min-w-0 flex-1 items-center gap-2 py-1.5 pr-3 text-xs ${active ? `font-semibold ${accentClass(node.section)}` : "text-muted hover:text-foreground"}`}
        >
          {node.children.length > 0 ? (
            <Folder size={14} />
          ) : (
            <FileCode2 size={14} />
          )}
          <span className="truncate">{node.title}</span>
        </Link>
      </div>
      {open &&
        node.children.map((c) => (
          <Node key={c.path} node={c} depth={depth + 1} />
        ))}
    </div>
  );
}
export function Sidebar() {
  return (
    <aside className="scrollbar hidden w-64 shrink-0 overflow-y-auto border-r border-border bg-surface/40 py-4 lg:block">
      <div className="px-4 pb-3 font-mono text-[10px] uppercase tracking-[.2em] text-muted">
        Library
      </div>
      {conceptTree.map((n) => (
        <div key={n.path}>
          <div
            className={`px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[.16em] ${accentClass(n.section)}`}
          >
            {sectionLabels[n.section] ?? n.section}
          </div>
          <Node node={n} />
        </div>
      ))}
    </aside>
  );
}
