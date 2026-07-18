import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

interface Process {
  id: string;
  burst: number;
  remaining: number;
  done: boolean;
}

interface StepState {
  processes: Process[];
  running: string | null;
  queue: string[];
  time: number;
}

const INITIAL: Process[] = [
  { id: "P1", burst: 5, remaining: 5, done: false },
  { id: "P2", burst: 3, remaining: 3, done: false },
  { id: "P3", burst: 7, remaining: 7, done: false },
  { id: "P4", burst: 4, remaining: 4, done: false },
];

const QUANTUM = 2;

function buildSteps(): StepState[] {
  const steps: StepState[] = [];
  const procs = INITIAL.map((p) => ({ ...p }));
  const queue = procs.map((p) => p.id);
  let time = 0;

  steps.push({
    processes: procs.map((p) => ({ ...p })),
    running: null,
    queue: [...queue],
    time,
  });

  while (queue.length > 0) {
    const id = queue.shift()!;
    const proc = procs.find((p) => p.id === id)!;
    const runTime = Math.min(QUANTUM, proc.remaining);
    proc.remaining -= runTime;
    time += runTime;
    if (proc.remaining <= 0) {
      proc.done = true;
    } else {
      queue.push(id);
    }
    steps.push({
      processes: procs.map((p) => ({ ...p })),
      running: id,
      queue: [...queue],
      time,
    });
  }
  return steps;
}

export default function RoundRobinSimulation() {
  const steps = useMemo(buildSteps, []);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 650 / speed);
    return () => clearInterval(id);
  }, [playing, speed, steps.length]);

  const state = steps[step];

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Round-Robin Scheduling
        </h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          Time: {state.time}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-xs text-muted">
        <span className="rounded bg-surface px-2 py-0.5 font-mono">
          Quantum: {QUANTUM}
        </span>
        <span className="rounded bg-surface px-2 py-0.5 font-mono">
          Step: {step}/{steps.length - 1}
        </span>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-3">
          {state.processes.map((proc) => {
            const pct = (proc.remaining / proc.burst) * 100;
            return (
              <div key={proc.id} className="flex items-center gap-3">
                <span className="w-8 font-mono text-sm font-medium text-foreground">
                  {proc.id}
                </span>
                <div className="relative h-8 flex-1 overflow-hidden rounded-md border border-border bg-surface">
                  <motion.div
                    className={`h-full rounded-l-md ${
                      proc.done
                        ? "bg-success"
                        : state.running === proc.id
                          ? "bg-accent-os"
                          : "bg-accent-os/30"
                    }`}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-foreground">
                    {proc.remaining}/{proc.burst}
                  </span>
                </div>
                {proc.done && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="font-mono text-xs text-success"
                  >
                    DONE
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>

        <div className="w-40 shrink-0 rounded-lg border border-border bg-surface p-3">
          <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
            Ready Queue
          </h4>
          <div className="flex flex-col gap-1.5">
            {state.queue.length === 0 ? (
              <span className="text-xs italic text-muted">empty</span>
            ) : (
              state.queue.map((id, i) => (
                <motion.span
                  key={`${id}-${step}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-md border px-2 py-1 font-mono text-xs text-foreground ${
                    state.running === id
                      ? "border-accent-os bg-accent-os/20"
                      : "border-border bg-background"
                  }`}
                >
                  {id}
                </motion.span>
              ))
            )}
          </div>
        </div>
      </div>

      <SimulationControls
        isPlaying={playing}
        speed={speed}
        canStepBack={step > 0}
        canStepForward={step < steps.length - 1}
        onPlayPause={() => setPlaying((c) => !c)}
        onStepBack={() => setStep((s) => Math.max(0, s - 1))}
        onStepForward={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
        onReset={() => {
          setStep(0);
          setPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}