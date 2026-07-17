import { ExternalLink, ShieldCheck } from "lucide-react";
import type { Reference } from "../../lib/types";
export function ReferencesList({ references }: { references: Reference[] }) {
  return (
    <div className="space-y-3">
      {references.length ? (
        references.map((r) => (
          <a
            key={r.url}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-border bg-surface p-4 transition hover:border-foreground/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {r.source} · {r.type}
                </p>
              </div>
              <ExternalLink size={15} className="text-muted" />
            </div>
            {r.verified && (
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-success">
                <ShieldCheck size={13} /> Verified
              </span>
            )}
          </a>
        ))
      ) : (
        <p className="text-sm text-muted">
          References will be added as this concept matures.
        </p>
      )}
    </div>
  );
}
