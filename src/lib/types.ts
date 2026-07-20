export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Meta = {
  id: string;
  title: string;
  section: string;
  parentPath?: string;
  order: number;
  difficulty: Difficulty;
  tags: string[];
  prerequisites: string[];
  summary: string;
  accentSection: string;
};
export type Reference = {
  title: string;
  type: "paper" | "video" | "doc" | "tool" | "book" | "article";
  source: string;
  url: string;
  verified: boolean;
};
export type CodeTraceStep = {
  line: number;
  variables: Record<string, unknown>;
  callStack: string[];
  stdout: string;
};
export type CodeTrace = {
  language: "c" | "cpp" | "go" | "java" | "javascript" | "python" | "pseudocode";
  sourceCode: string;
  steps: CodeTraceStep[];
  stepMap: Array<number | [number, number]>;
};
export type TraceableSimulationProps = {
  /** Lets ConceptWorkbench own the shared state for a traced concept. */
  externalStep?: number;
};
export type ConceptNode = Meta & {
  path: string;
  children: ConceptNode[];
  /** A navigation-only grouping created from a concept's parentPath. */
  isCategory?: boolean;
  hasCodeTrace: boolean;
  codeTrace: CodeTrace | null;
  simulation?: () => Promise<{ default: React.ComponentType<TraceableSimulationProps> }>;
  logic?: () => Promise<{ default: React.ComponentType }>;
  references: Reference[];
};
