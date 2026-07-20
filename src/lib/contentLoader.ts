import type { ComponentType } from "react";
import type {
  CodeTrace,
  ConceptNode,
  Meta,
  Reference,
  TraceableSimulationProps,
} from "./types";

export const sectionLabels: Record<string, string> = {
  algorithms: "Algorithms",
  os: "Operating Systems",
  networking: "Networking",
  systems: "Systems",
  languages: "Languages",
};

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
const traces = import.meta.glob("/src/content/**/trace.json", {
  eager: true,
  query: "?json",
  import: "default",
}) as Record<string, CodeTrace>;
const pathFor = (key: string) =>
  key.replace("/src/content/", "").replace("/meta.json", "");
const componentLoader = (loader: (() => Promise<unknown>) | undefined) =>
  loader as () => Promise<{ default: ComponentType<TraceableSimulationProps> }>;
const byPath = new Map<string, ConceptNode>();

for (const [key, meta] of Object.entries(metas)) {
  const path = pathFor(key);
  const node: ConceptNode = {
    ...meta,
    path,
    children: [],
    references: refs[key.replace("meta.json", "references.json")] ?? [],
    codeTrace: traces[key.replace("meta.json", "trace.json")] ?? null,
    hasCodeTrace: Boolean(traces[key.replace("meta.json", "trace.json")]),
    simulation: componentLoader(
      simulations[key.replace("meta.json", "Simulation.tsx")],
    ),
    logic: componentLoader(logics[key.replace("meta.json", "logic.mdx")]),
  };
  byPath.set(path, node);
}

const toCategoryTitle = (segment: string) =>
  segment
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const categoriesByPath = new Map<string, ConceptNode>();

function createCategory(path: string, section: string): ConceptNode {
  const existing = categoriesByPath.get(path);

  if (existing) return existing;

  const segment = path.split("/").at(-1) ?? path;
  const node: ConceptNode = {
    id: `category:${path}`,
    title: path === section ? sectionLabels[section] ?? toCategoryTitle(segment) : toCategoryTitle(segment),
    section,
    parentPath: path.includes("/") ? path.split("/").slice(0, -1).join("/") : undefined,
    order: -1,
    difficulty: "beginner",
    tags: [],
    prerequisites: [],
    summary: "",
    accentSection: section,
    path,
    children: [],
    references: [],
    isCategory: true,
    hasCodeTrace: false,
    codeTrace: null,
  };

  categoriesByPath.set(path, node);
  return node;
}

for (const node of byPath.values()) {
  const parentPath = node.parentPath?.trim() || node.section;
  const segments = parentPath.split("/");

  for (let index = 1; index <= segments.length; index += 1) {
    createCategory(segments.slice(0, index).join("/"), node.section);
  }
}

for (const category of categoriesByPath.values()) {
  const parentPath = category.parentPath;

  if (parentPath) {
    categoriesByPath.get(parentPath)?.children.push(category);
  }
}

for (const node of byPath.values()) {
  const parentPath = node.parentPath?.trim() || node.section;
  const parent = categoriesByPath.get(parentPath);

  if (parent) parent.children.push(node);
}

const sort = (nodes: ConceptNode[]) => {
  nodes.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  nodes.forEach((n) => sort(n.children));
};
const roots = [...categoriesByPath.values()].filter((node) => !node.parentPath);
sort(roots);
export const conceptTree = roots;
export const flatConceptIndex = [...byPath.values()];
export const getConceptByPath = (path: string) => byPath.get(path);
