import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

type State = {
  low: number;
  high: number;
  mid: number;
  description: string;
  found: boolean;
};

const arr = [2, 4, 6, 8, 10, 12, 14, 16];
const target = 10;

const states: State[] = [
  { low: 0, high: 7, mid: 3, description: "low=0, high=7, mid=3 → arr[3]=8", found: false },
  { low: 0, high: 7, mid: 3, description: "10 > 8 → discard left half", found: false },
  { low: 4, high: 7, mid: 5, description: "low=4, high=7, mid=5 → arr[5]=12", found: false },
  { low: 4, high: 5, mid: 4, description: "10 < 12 → discard right half", found: false },
  { low: 4, high: 5, mid: 4, description: "low=4, high=5, mid=4 → arr[4]=10", found: false },
  { low: 4, high: 5, mid: 4, description: "Target found at index 4!", found: true },
];

export default function BinarySearchSimulation() {
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
      700 / speed,
    );
    return () => clearInterval(id);
  }, [playing, speed]);

  const current = states[step];

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Searching for {target}</h3>
          <p className="text-sm text-muted">{current.description}</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          step {step + 1}/{states.length}
        </span>
      </div>
      <div className="flex h-52 items-end justify-center gap-2 p-6">
        {arr.map((v, idx) => {
          const inRange = idx >= current.low && idx <= current.high;
          const isMid = idx === current.mid;
          const isFound = current.found && isMid;

          return (
            <div key={idx} className="flex w-8 flex-col items-center gap-1">
              {(isMid || idx === current.low || idx === current.high) && (
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-1 font-mono text-[10px] uppercase tracking-wider"
                  style={{
                    color: isFound
                      ? "var(--success)"
                      : isMid
                        ? "var(--accent-algorithms)"
                        : "var(--foreground-muted)",
                  }}
                >
                  {isFound ? "found" : isMid ? "mid" : idx === current.low ? "low" : "high"}
                </motion.span>
              )}
              <motion.div
                layout
                animate={{
                  height: `${v * 10}px`,
                  opacity: isFound ? 1 : inRange ? 1 : 0.25,
                  scale: isFound ? 1.1 : 1,
                }}
                className="w-full rounded-t-md"
                style={{
                  backgroundColor: isFound
                    ? "var(--success)"
                    : isMid
                      ? "var(--accent-algorithms)"
                      : "var(--accent-algorithms)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              />
              <span className="font-mono text-xs text-muted">{v}</span>
            </div>
          );
        })}
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
