import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../../components/ui/SimulationControls";
import type { TraceableSimulationProps } from "../../../../lib/types";

const source = [8, 3, 6, 2, 7, 4, 1, 5];

export default function MergeSortSimulation({
  externalStep,
}: TraceableSimulationProps = {}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  useEffect(() => {
    if (!playing || externalStep !== undefined) return;
    const id = setInterval(
      () =>
        setStep((s) => {
          if (s >= source.length) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      650 / speed,
    );
    return () => clearInterval(id);
  }, [externalStep, playing, speed]);

  const currentStep = Math.max(0, Math.min(source.length, externalStep ?? step));

  const values = useMemo(
    () =>
      source
        .map((v, i) => ({ v, i }))
        .sort((a, b) => (a.i < currentStep && b.i < currentStep ? a.v - b.v : 0)),
    [currentStep],
  );
  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Divide, sort, merge</h3>
        </div>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          pass {currentStep}/8
        </span>
      </div>
      <div className="flex h-[13.25rem] items-end justify-center gap-2 p-6">
        {values.map(({ v, i }) => (
          <motion.div
            key={i}
            layout
            className="flex w-[2.2rem] flex-col items-center gap-2"
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            <motion.div
              animate={{ height: `${v * 15.4}px`, opacity: i < currentStep ? 1 : 0.55 }}
              className="w-full rounded-t-md bg-accent-algorithms"
            />
            <span className="font-mono text-xs text-muted">{v}</span>
          </motion.div>
        ))}
      </div>
      {externalStep === undefined ? (
        <SimulationControls
          isPlaying={playing}
          speed={speed}
          canStepBack={step > 0}
          canStepForward={step < source.length}
          onPlayPause={() => setPlaying((current) => !current)}
          onStepBack={() => setStep((current) => Math.max(0, current - 1))}
          onStepForward={() =>
            setStep((current) => Math.min(source.length, current + 1))
          }
          onReset={() => {
            setStep(0);
            setPlaying(false);
          }}
          onSpeedChange={setSpeed}
        />
      ) : null}
    </div>
  );
}
