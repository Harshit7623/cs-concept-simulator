# Add a concept

Add a concept by creating one folder below src/content. The app scans this folder automatically, so do not edit routes, the sidebar, section cards, or the workspace shell.

## Folder location

Use kebab-case for every folder name. The concept folder name and metadata id must match.

### Direct concept

~~~text
src/content/networking/tcp-handshake/
  meta.json
  Simulation.tsx
  logic.mdx
  references.json
~~~

### Nested concept

~~~text
src/content/algorithms/sorting/quick-sort/
  meta.json
  Simulation.tsx
  logic.mdx
  references.json
~~~

The nested example has content path: algorithms/sorting/quick-sort.

## Required files

| File | Required | Purpose |
| --- | --- | --- |
| meta.json | Yes | Metadata, hierarchy, search, and display information. |
| Simulation.tsx | Yes | Standalone interactive visual. |
| logic.mdx | Yes | Explanation, C-style pseudocode, complexity, and pitfalls. |
| references.json | Yes | Curated references; an empty array is allowed. |
| trace.json | Optional | Static code-execution trace for the synchronized workbench. |

The current loader recognises these required and optional patterns:

~~~text
/src/content/**/meta.json
/src/content/**/Simulation.tsx
/src/content/**/logic.mdx
/src/content/**/references.json
/src/content/**/trace.json
~~~

## 1. meta.json

Copy this template and replace all values:

~~~json
{
  "id": "quick-sort",
  "title": "Quick Sort",
  "section": "algorithms",
  "parentPath": "algorithms/sorting",
  "order": 2,
  "difficulty": "intermediate",
  "tags": ["sorting", "divide-and-conquer", "partition"],
  "prerequisites": ["algorithms/sorting/merge-sort"],
  "summary": "Visualize partitioning around a pivot and recursively sorting each side.",
  "accentSection": "algorithms"
}
~~~

Rules:

- id: exact concept folder name, in kebab-case.
- title: human-readable concept name.
- section: algorithms, os, networking, systems, or languages.
- parentPath: parent folders without the concept name. A direct networking concept uses networking.
- order: sibling ordering number; begin at 1.
- difficulty: beginner, intermediate, or advanced.
- tags: short search keywords.
- prerequisites: paths to prior concepts; use an empty array when none are needed.
- summary: one or two sentences for cards and search results.
- accentSection: normally the same value as section.

## 2. Simulation.tsx

The file must default-export a React component with no required props. Keep its state inside the component and use Framer Motion for animated transitions.

~~~tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

export default function QuickSortSimulation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);
  const values = [7, 2, 9, 4, 1];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= values.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 650 / speed);

    return () => window.clearInterval(timer);
  }, [isPlaying, speed, values.length]);

  return (
    <section aria-label="Quick Sort simulation">
      <div className="flex h-56 items-end gap-3 p-6">
        {values.map((value, index) => (
          <motion.div
            key={value}
            animate={{ opacity: index === activeIndex ? 1 : 0.55 }}
            className="flex w-10 flex-col items-center gap-2"
          >
            <div
              className="w-full rounded-t-md"
              style={{ height: "96px", background: "var(--accent-algorithms)" }}
            />
            <span className="font-mono text-xs text-muted">{value}</span>
          </motion.div>
        ))}
      </div>

      <SimulationControls
        isPlaying={isPlaying}
        speed={speed}
        canStepBack={activeIndex > 0}
        canStepForward={activeIndex < values.length - 1}
        onPlayPause={() => setIsPlaying((current) => !current)}
        onStepBack={() => setActiveIndex((current) => Math.max(0, current - 1))}
        onStepForward={() =>
          setActiveIndex((current) => Math.min(values.length - 1, current + 1))
        }
        onReset={() => {
          setActiveIndex(0);
          setIsPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />
    </section>
  );
}
~~~

Simulation rules:

- Use CSS variables and semantic Tailwind classes. Do not hardcode color literals in simulation code.
- All controls must work by keyboard.
- Use section accents only for active/highlight states, not paragraph text.
- Use the mono font for values, array cells, code-like labels, and Big-O notation.
- Use the global SimulationControls component from src/components/ui/SimulationControls. Do not create a custom control bar in an individual concept.
- Supply its controlled props: isPlaying, speed, step availability booleans, and the play/pause, step, reset, and speed callbacks. It provides Play, Pause, Step Forward, Step Back, Reset, and Speed consistently across every concept.
- Future traced concepts may accept externalStep as an optional prop. When a trace workbench supplies it, render that step and let the workbench own the controls.

## 3. logic.mdx

Use clear sections. Pseudocode must use the project C-style convention: typed declarations, braces, semicolons, and C-like function signatures.

~~~~mdx
## What quick sort solves

Quick sort orders an array by choosing a pivot, partitioning values around it, and recursively sorting the two partitions.

## Core idea

After partitioning, values left of the pivot are smaller or equal and values right of it are larger.

## Algorithm steps

1. Choose a pivot.
2. Partition values around it.
3. Sort the left partition.
4. Sort the right partition.

## Pseudocode

~~~c
void quickSort(int array[], int low, int high) {
  if (low >= high) return;

  int pivotIndex = partition(array, low, high);
  quickSort(array, low, pivotIndex - 1);
  quickSort(array, pivotIndex + 1, high);
}
~~~

## Complexity

- Average time: O(n log n)
- Worst-case time: O(n²)
- Space: O(log n) average recursion stack

## Common pitfalls

- Choosing a poor pivot on already sorted input.
- Including the pivot in both recursive ranges.
- Assuming quick sort is stable.
~~~~

Small MDX components are allowed. Keep the main visual in Simulation.tsx.

## 4. references.json

Use an empty array when no references are ready:

~~~json
[]
~~~

Otherwise add one object per source:

~~~json
[
  {
    "title": "Quick Sort",
    "type": "article",
    "source": "CP-Algorithms",
    "url": "https://cp-algorithms.com/",
    "verified": true
  }
]
~~~

Allowed type values:

~~~text
paper | video | doc | tool | book | article
~~~

Use valid absolute URLs. Set verified to true only after manually checking the source.

## Optional trace.json workbench

Add trace.json only when the concept needs synchronized code and visual execution. Its presence automatically enables the workbench on the Simulation tab; it never runs code in the browser or on a server.

When implemented, place it beside the four required files:

~~~text
src/content/algorithms/sorting/quick-sort/trace.json
~~~

Use this shape:

~~~json
{
  "language": "c",
  "sourceCode": "void example() {\\n  return;\\n}",
  "steps": [
    {
      "line": 1,
      "variables": { "value": 4 },
      "callStack": ["example()"],
      "stdout": ""
    }
  ],
  "stepMap": [0]
}
~~~

- line is one-indexed against sourceCode.
- variables must be a flat JSON object; values are displayed, never interpreted.
- stepMap maps each abstract visual step to a trace step. It may also use a range, for example [2, 4], when one visual beat covers several code steps.
- Update Simulation.tsx to accept optional externalStep?: number. When it is supplied, render that step and omit local SimulationControls; the workbench provides the one shared control bar.
- The data must be precomputed and static. Never execute source code in production.

## Final checklist

- Folder and id match and use kebab-case.
- All four required files are in the same folder.
- If trace.json is present, its line numbers, stepMap, and Simulation externalStep behavior agree.
- section and accentSection are valid section keys.
- parentPath matches the parent folders.
- order is correct among siblings.
- Reference URLs are valid.
- Simulation default-exports a component, uses theme tokens, and supports keyboard controls.
- Logic is structured and uses C-style pseudocode.
- No router, sidebar, registry, or workspace shell file was edited.
- Run:

~~~bash
npm run build
~~~

After reload or build, the concept appears automatically in its section overview, Library tree, route, and search index.
