import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

type Frame = {
  id: string;
  name: string;
  vars: string[];
  depth: number;
};

type HeapBlock = {
  id: string;
  size: number;
  label: string;
  allocated: boolean;
  freed: boolean;
  frameLink: string;
};

type Step = {
  label: string;
  stack: Frame[];
  heap: HeapBlock[];
  highlight?: string;
};

const STEPS: Step[] = [
  {
    label: "main() called: push stack frame",
    stack: [{ id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 }],
    heap: [],
  },
  {
    label: "funcA() called: push frame",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp"], depth: 1 },
    ],
    heap: [],
    highlight: "funcA",
  },
  {
    label: "malloc(32): allocate on heap",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp", "ptr"], depth: 1 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: true, freed: false, frameLink: "funcA" },
    ],
    highlight: "heap-alloc",
  },
  {
    label: "funcB() called: push frame",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp", "ptr"], depth: 1 },
      { id: "funcB", name: "funcB()", vars: ["y"], depth: 2 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: true, freed: false, frameLink: "funcA" },
    ],
    highlight: "funcB",
  },
  {
    label: "malloc(16): another heap block",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp", "ptr"], depth: 1 },
      { id: "funcB", name: "funcB()", vars: ["y", "buf"], depth: 2 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: true, freed: false, frameLink: "funcA" },
      { id: "h2", size: 16, label: "0x7f20", allocated: true, freed: false, frameLink: "funcB" },
    ],
    highlight: "heap-alloc",
  },
  {
    label: "funcB() returns: pop frame",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp", "ptr"], depth: 1 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: true, freed: false, frameLink: "funcA" },
      { id: "h2", size: 16, label: "0x7f20", allocated: true, freed: false, frameLink: "funcB" },
    ],
    highlight: "pop-funcB",
  },
  {
    label: "free(): first heap block freed",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
      { id: "funcA", name: "funcA()", vars: ["x", "temp", "ptr"], depth: 1 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: false, freed: true, frameLink: "funcA" },
      { id: "h2", size: 16, label: "0x7f20", allocated: true, freed: false, frameLink: "funcB" },
    ],
    highlight: "free",
  },
  {
    label: "funcA() returns: pop frame",
    stack: [
      { id: "main", name: "main()", vars: ["argc", "argv"], depth: 0 },
    ],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: false, freed: true, frameLink: "funcA" },
      { id: "h2", size: 16, label: "0x7f20", allocated: true, freed: false, frameLink: "funcB" },
    ],
    highlight: "pop-funcA",
  },
  {
    label: "main() returns: stack empty, heap leak",
    stack: [],
    heap: [
      { id: "h1", size: 32, label: "0x7f00", allocated: false, freed: true, frameLink: "funcA" },
      { id: "h2", size: 16, label: "0x7f20", allocated: true, freed: false, frameLink: "funcB" },
    ],
    highlight: "leak",
  },
];

export default function StackVsHeapSimulation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  const current = STEPS[step];
  const maxStep = STEPS.length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= maxStep) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 900 / speed);
    return () => clearInterval(id);
  }, [playing, speed, maxStep]);

  return (
    <div className="p-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{current.label}</h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          step {step + 1}/{STEPS.length}
        </span>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase text-accent-systems">
            Stack
          </h4>
          <div className="flex flex-col-reverse gap-1.5">
            {current.stack.map((frame, i) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-accent-systems/40 bg-accent-systems/10 px-3 py-2"
              >
                <span className="font-mono text-sm font-bold text-accent-systems">
                  {frame.name}
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {frame.vars.map((v) => (
                    <span
                      key={v}
                      className="rounded bg-background px-1.5 font-mono text-xs text-muted"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            {current.stack.length === 0 && (
              <div className="py-4 text-center font-mono text-xs text-muted">
                (empty)
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase text-accent-systems">
            Heap
          </h4>
          <div className="flex flex-col gap-1.5">
            {current.heap.length === 0 && (
              <div className="py-4 text-center font-mono text-xs text-muted">
                (empty)
              </div>
            )}
            {current.heap.map((block) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: block.freed ? 0.3 : 1,
                  scale: 1,
                  borderColor:
                    block.freed
                      ? "var(--error)"
                      : block.allocated
                        ? "var(--success)"
                        : "var(--border)",
                }}
                transition={{ duration: 0.35 }}
                className="rounded-lg border-2 px-3 py-2"
                style={{
                  height: Math.max(40, block.size * 1.8),
                  borderColor: block.freed
                    ? "var(--error)"
                    : "var(--success)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">
                    {block.label}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {block.size} B
                  </span>
                </div>
                {block.freed && (
                  <span
                    className="mt-1 inline-block rounded px-1 font-mono text-xs"
                    style={{ background: "var(--error)", color: "var(--background)" }}
                  >
                    freed
                  </span>
                )}
                {!block.freed && block.allocated && (
                  <span
                    className="mt-1 inline-block rounded px-1 font-mono text-xs"
                    style={{ background: "var(--success)", color: "var(--background)" }}
                  >
                    allocated
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {current.highlight === "leak" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 rounded-lg border border-[var(--warning)] bg-[var(--warning)]/10 px-3 py-2 text-center font-mono text-xs"
          style={{ color: "var(--warning)" }}
        >
          Memory leak: heap blocks remain after stack unwinds
        </motion.div>
      )}
      <SimulationControls
        isPlaying={playing}
        speed={speed}
        canStepBack={step > 0}
        canStepForward={step < maxStep}
        onPlayPause={() => setPlaying((p) => !p)}
        onStepBack={() => setStep((s) => Math.max(0, s - 1))}
        onStepForward={() => setStep((s) => Math.min(maxStep, s + 1))}
        onReset={() => {
          setStep(0);
          setPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}
