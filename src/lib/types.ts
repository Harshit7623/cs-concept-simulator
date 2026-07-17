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
export type ConceptNode = Meta & {
  path: string;
  children: ConceptNode[];
  simulation?: () => Promise<{ default: React.ComponentType }>;
  logic?: () => Promise<{ default: React.ComponentType }>;
  references: Reference[];
};
