import type { ComponentType } from "react";
import type { ConceptNode, Meta, Reference } from "./types";
const metas = import.meta.glob("/src/content/**/meta.json", {
  eager: true,
  query: "?json",
  import: "default",
}) as Record<string, Meta>;
const simulations = import.meta.glob("/src/content/**/Simulation.tsx");
const logics = import.meta.glob("/src/content/**/logic.mdx");
const refs = import.meta.glob("/src/content/**/references.json", {
  eager: true,
  query: "?json",
  import: "default",
}) as Record<string, Reference[]>;
const pathFor = (key: string) =>
  key.replace("/src/content/", "").replace("/meta.json", "");
const componentLoader = (loader: (() => Promise<unknown>) | undefined) =>
  loader as () => Promise<{ default: ComponentType }>;
const roots: ConceptNode[] = [];
const byPath = new Map<string, ConceptNode>();
for (const [key, meta] of Object.entries(metas)) {
  const path = pathFor(key);
  const node: ConceptNode = {
    ...meta,
    path,
    children: [],
    references: refs[key.replace("meta.json", "references.json")] ?? [],
    simulation: componentLoader(
      simulations[key.replace("meta.json", "Simulation.tsx")],
    ),
    logic: componentLoader(logics[key.replace("meta.json", "logic.mdx")]),
  };
  byPath.set(path, node);
}
for (const node of byPath.values()) {
  const parent = node.path.split("/").slice(0, -1).join("/");
  const p = byPath.get(parent);
  (p ? p.children : roots).push(node);
}
const sort = (nodes: ConceptNode[]) => {
  nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  nodes.forEach((n) => sort(n.children));
};
sort(roots);
export const conceptTree = roots;
export const flatConceptIndex = [...byPath.values()];
export const getConceptByPath = (path: string) => byPath.get(path);
export const sectionLabels: Record<string, string> = {
  algorithms: "Algorithms",
  os: "Operating Systems",
  networking: "Networking",
  systems: "Systems",
  languages: "Languages",
};
