import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";

type State = {
  array: number[];
  pivotIdx: number;
  i: number;
  j: number;
  description: string;
};

const states: State[] = [
  { array: [7, 2, 9, 4, 1, 8, 3, 6], pivotIdx: 7, i: -1, j: -1, description: "Choose pivot (last element = 6)" },
  { array: [7, 2, 9, 4, 1, 8, 3, 6], pivotIdx: 7, i: 0, j: 0, description: "Compare arr[0] = 7 > 6, no swap" },
  { array: [2, 7, 9, 4, 1, 8, 3, 6], pivotIdx: 7, i: 1, j: 1, description: "arr[1] = 2 ≤ 6, swap arr[0] ↔ arr[1]" },
  { array: [2, 7, 9, 4, 1, 8, 3, 6], pivotIdx: 7, i: 1, j: 2, description: "arr[2] = 9 > 6, no swap" },
  { array: [2, 4, 9, 7, 1, 8, 3, 6], pivotIdx: 7, i: 2, j: 3, description: "arr[3] = 4 ≤ 6, swap arr[1] ↔ arr[3]" },
  { array: [2, 4, 1, 7, 9, 8, 3, 6], pivotIdx: 7, i: 3, j: 4, description: "arr[4] = 1 ≤ 6, swap arr[2] ↔ arr[4]" },
  { array: [2, 4, 1, 7, 9, 8, 3, 6], pivotIdx: 7, i: 3, j: 5, description: "arr[5] = 8 > 6, no swap" },
  { array: [2, 4, 1, 3, 9, 8, 7, 6], pivotIdx: 7, i: 4, j: 6, description: "arr[6] = 3 ≤ 6, swap arr[3] ↔ arr[6]" },
  { array: [2, 4, 1, 3, 6, 8, 7, 9], pivotIdx: 4, i: 4, j: 7, description: "Place pivot 6 at its final position" },
];

const maxVal = 9;

export default function QuickSortSimulation() {
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
      800 / speed,
    );
    return () => clearInterval(id);
  }, [playing, speed]);

  const current = states[step];

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Partition step</h3>
          <p className="text-sm text-muted">{current.description}</p>
        </div>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          step {step + 1}/{states.length}
        </span>
      </div>
      <div className="flex h-52 items-end justify-center gap-2 p-6">
        {current.array.map((v, idx) => (
          <div key={idx} className="flex w-8 flex-col items-center gap-1">
            {idx === current.pivotIdx && (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-1 font-mono text-[10px] uppercase tracking-wider text-accent-algorithms"
              >
                pivot
              </motion.span>
            )}
            <motion.div
              layout
              animate={{
                height: `${v * 14}px`,
                opacity:
                  idx === current.pivotIdx
                    ? 1
                    : current.i >= 0 && idx < current.i
                      ? 0.5
                      : 0.85,
              }}
              className={`w-full rounded-t-md ${idx === current.pivotIdx ? "bg-accent-algorithms" : "bg-accent-algorithms/60"}`}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            />
            <span className="font-mono text-xs text-muted">{v}</span>
          </div>
        ))}
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
