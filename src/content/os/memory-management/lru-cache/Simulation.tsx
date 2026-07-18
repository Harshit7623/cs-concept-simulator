import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

interface CacheOp {
  access: number;
  hit: boolean;
  cache: number[];
  evicted: number | null;
}

const SEQUENCE = [1, 2, 3, 4, 1, 5, 2, 6, 3, 4];
const CAPACITY = 4;

function buildSteps(): CacheOp[] {
  const steps: CacheOp[] = [];
  const cache: number[] = [];
  for (const page of SEQUENCE) {
    const idx = cache.indexOf(page);
    let evicted: number | null = null;
    if (idx !== -1) {
      cache.splice(idx, 1);
      cache.unshift(page);
    } else {
      if (cache.length >= CAPACITY) {
        evicted = cache.pop()!;
      }
      cache.unshift(page);
    }
    steps.push({ access: page, hit: idx !== -1, cache: [...cache], evicted });
  }
  return steps;
}

export default function LRUCacheSimulation() {
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
    }, 700 / speed);
    return () => clearInterval(id);
  }, [playing, speed, steps.length]);

  const op = steps[step];

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">LRU Cache</h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          Access {step + 1}/{steps.length}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm text-foreground">
          Accessing page:{" "}
          <strong className="text-accent-os">{op.access}</strong>
        </span>
        <span
          className={`rounded-full px-3 py-0.5 font-mono text-xs ${
            op.hit
              ? "bg-success/20 text-success"
              : "bg-warning/20 text-warning"
          }`}
        >
          {op.hit ? "HIT" : "MISS"}
        </span>
        {op.evicted !== null && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-mono text-xs text-muted"
          >
            Evicted: {op.evicted}
          </motion.span>
        )}
      </div>

      <div className="mb-6 flex items-center justify-center gap-3">
        {op.cache.map((page, i) => (
          <motion.div
            key={`${page}-${i}`}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`flex h-20 w-20 items-center justify-center rounded-xl border-2 font-mono text-xl font-bold ${
              i === 0
                ? "border-accent-os bg-accent-os/15 text-accent-os"
                : "border-border bg-surface text-foreground"
            }`}
          >
            {page}
          </motion.div>
        ))}
        {Array.from({ length: CAPACITY - op.cache.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface text-muted"
          >
            <span className="font-mono text-xs">empty</span>
          </div>
        ))}
      </div>

      <div className="mb-1 text-xs text-muted">Access timeline:</div>
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className={`h-7 w-7 rounded text-xs font-mono transition ${
              i === step
                ? "bg-accent-os text-background"
                : s.hit
                  ? "bg-success/20 text-success"
                  : "bg-warning/20 text-warning"
            }`}
          >
            {s.access}
          </button>
        ))}
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