import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

type Node = { id: string; x: number; y: number };
type Edge = [number, number];
type State = {
  visited: number[];
  queue: number[];
  current: number;
  levelComplete: boolean;
  queueDisplay: string[];
  description: string;
};

const nodes: Node[] = [
  { id: "A", x: 250, y: 30 },
  { id: "B", x: 120, y: 140 },
  { id: "C", x: 380, y: 140 },
  { id: "D", x: 50, y: 270 },
  { id: "E", x: 200, y: 270 },
  { id: "F", x: 380, y: 270 },
  { id: "G", x: 200, y: 390 },
];

const edges: Edge[] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [4, 6],
];

const states: State[] = [
  { visited: [], queue: [0], current: -1, levelComplete: false, queueDisplay: ["A"], description: "Enqueue source node A" },
  { visited: [0], queue: [], current: 0, levelComplete: true, queueDisplay: [], description: "Dequeue A — level 0 complete" },
  { visited: [0], queue: [1, 2], current: 0, levelComplete: false, queueDisplay: ["B", "C"], description: "Enqueue neighbors B and C" },
  { visited: [0, 1], queue: [2], current: 1, levelComplete: false, queueDisplay: ["C"], description: "Dequeue B" },
  { visited: [0, 1], queue: [2, 3, 4], current: 1, levelComplete: false, queueDisplay: ["C", "D", "E"], description: "Enqueue neighbors D and E" },
  { visited: [0, 1, 2], queue: [3, 4], current: 2, levelComplete: false, queueDisplay: ["D", "E"], description: "Dequeue C" },
  { visited: [0, 1, 2], queue: [3, 4, 5], current: 2, levelComplete: false, queueDisplay: ["D", "E", "F"], description: "Enqueue neighbor F" },
  { visited: [0, 1, 2, 3], queue: [4, 5], current: 3, levelComplete: false, queueDisplay: ["E", "F"], description: "Dequeue D — no unvisited neighbors" },
  { visited: [0, 1, 2, 3, 4], queue: [5], current: 4, levelComplete: true, queueDisplay: ["F"], description: "Dequeue E — level 1 complete" },
  { visited: [0, 1, 2, 3, 4], queue: [5, 6], current: 4, levelComplete: false, queueDisplay: ["F", "G"], description: "Enqueue neighbor G" },
  { visited: [0, 1, 2, 3, 4, 5], queue: [6], current: 5, levelComplete: false, queueDisplay: ["G"], description: "Dequeue F — no unvisited neighbors" },
  { visited: [0, 1, 2, 3, 4, 5, 6], queue: [], current: 6, levelComplete: true, queueDisplay: [], description: "Dequeue G — all nodes visited" },
];

export default function BfsSimulation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () =>
        setStep((s) => {
          if (s >= states.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      900 / speed,
    );
    return () => clearInterval(id);
  }, [playing, speed]);

  const current = states[step];

  const nodeColor = (idx: number) => {
    if (idx === current.current) return "var(--accent-algorithms)";
    if (current.queue.includes(idx)) return "color-mix(in srgb, var(--accent-algorithms) 60%, transparent)";
    if (current.visited.includes(idx)) return "var(--accent-algorithms)";
    return "var(--surface)";
  };

  const nodeOpacity = (idx: number) => {
    if (idx === current.current) return 1;
    if (current.queue.includes(idx)) return 0.85;
    if (current.visited.includes(idx)) return 0.7;
    return 0.35;
  };

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">BFS traversal</h3>
          <p className="text-sm text-muted">{current.description}</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          step {step + 1}/{states.length}
        </span>
      </div>
      <div className="relative mx-auto h-[450px] w-[500px]">
        <svg className="absolute inset-0 h-full w-full">
          {edges.map(([from, to], i) => (
            <line
              key={i}
              x1={nodes[from].x}
              y1={nodes[from].y}
              x2={nodes[to].x}
              y2={nodes[to].y}
              stroke="var(--border)"
              strokeWidth={2}
            />
          ))}
        </svg>
        {nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-default items-center justify-center rounded-full font-mono text-sm font-bold text-background"
            style={{
              left: node.x,
              top: node.y,
              backgroundColor: nodeColor(idx),
              opacity: nodeOpacity(idx),
              boxShadow:
                idx === current.current
                  ? "0 0 16px 4px var(--accent-algorithms)"
                  : "none",
            }}
            animate={{
              scale: idx === current.current ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
          >
            {node.id}
          </motion.div>
        ))}
        {current.levelComplete && current.current >= 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-2 right-2 rounded-md bg-surface px-3 py-1 font-mono text-xs text-accent-algorithms"
          >
            level {current.visited.filter((v, i, a) => a.indexOf(v) === i).length - 1} complete
          </motion.div>
        )}
      </div>
      <div className="mx-auto mb-4 flex max-w-[500px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2">
        <span className="font-mono text-xs text-muted">Queue:</span>
        <div className="flex flex-wrap gap-1">
          {current.queueDisplay.length === 0 ? (
            <span className="font-mono text-xs italic text-muted">empty</span>
          ) : (
            current.queueDisplay.map((id, i) => (
              <span
                key={i}
                className="rounded bg-accent-algorithms/20 px-2 py-0.5 font-mono text-xs text-accent-algorithms"
              >
                {id}
              </span>
            ))
          )}
        </div>
      </div>
      <SimulationControls
        isPlaying={playing}
        speed={speed}
        canStepBack={step > 0}
        canStepForward={step < states.length - 1}
        onPlayPause={() => setPlaying((c) => !c)}
        onStepBack={() => setStep((s) => Math.max(0, s - 1))}
        onStepForward={() => setStep((s) => Math.min(states.length - 1, s + 1))}
        onReset={() => {
          setStep(0);
          setPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
