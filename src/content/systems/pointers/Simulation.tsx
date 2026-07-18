import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../components/ui/SimulationControls";

type MemoryCell = {
  id: string;
  address: string;
  value: string;
  type: string;
  name: string;
  isPointer: boolean;
  pointsTo?: string;
  highlight?: "change" | "active" | "none";
};

type Step = {
  label: string;
  cells: MemoryCell[];
  arrows: { from: string; to: string }[];
};

const ADDR = ["0x00","0x01","0x02","0x03","0x04","0x05","0x06","0x07","0x08","0x09","0x0A","0x0B","0x0C","0x0D","0x0E","0x0F"];

const STEPS: Step[] = [
  {
    label: "int x = 42: allocate x at address 0x04",
    cells: [
      { id: "x", address: "0x04", value: "42", type: "int", name: "x", isPointer: false, highlight: "active" },
    ],
    arrows: [],
  },
  {
    label: "int *p = &x: p stores address of x",
    cells: [
      { id: "x", address: "0x04", value: "42", type: "int", name: "x", isPointer: false, highlight: "none" },
      { id: "p", address: "0x08", value: "0x04", type: "int*", name: "p", isPointer: true, pointsTo: "x", highlight: "active" },
    ],
    arrows: [{ from: "p", to: "x" }],
  },
  {
    label: "*p = 99: dereference p, change x to 99",
    cells: [
      { id: "x", address: "0x04", value: "99", type: "int", name: "x", isPointer: false, highlight: "change" },
      { id: "p", address: "0x08", value: "0x04", type: "int*", name: "p", isPointer: true, pointsTo: "x", highlight: "none" },
    ],
    arrows: [{ from: "p", to: "x" }],
  },
  {
    label: "int y = *p: read via dereference, y = 99",
    cells: [
      { id: "x", address: "0x04", value: "99", type: "int", name: "x", isPointer: false, highlight: "none" },
      { id: "p", address: "0x08", value: "0x04", type: "int*", name: "p", isPointer: true, pointsTo: "x", highlight: "none" },
      { id: "y", address: "0x0C", value: "99", type: "int", name: "y", isPointer: false, highlight: "active" },
    ],
    arrows: [{ from: "p", to: "x" }],
  },
  {
    label: "int **pp = &p: pointer to pointer",
    cells: [
      { id: "x", address: "0x04", value: "99", type: "int", name: "x", isPointer: false, highlight: "none" },
      { id: "p", address: "0x08", value: "0x04", type: "int*", name: "p", isPointer: true, pointsTo: "x", highlight: "none" },
      { id: "y", address: "0x0C", value: "99", type: "int", name: "y", isPointer: false, highlight: "none" },
      { id: "pp", address: "0x10", value: "0x08", type: "int**", name: "pp", isPointer: true, pointsTo: "p", highlight: "active" },
    ],
    arrows: [
      { from: "p", to: "x" },
      { from: "pp", to: "p" },
    ],
  },
  {
    label: "**pp = 7: double dereference, x = 7",
    cells: [
      { id: "x", address: "0x04", value: "7", type: "int", name: "x", isPointer: false, highlight: "change" },
      { id: "p", address: "0x08", value: "0x04", type: "int*", name: "p", isPointer: true, pointsTo: "x", highlight: "none" },
      { id: "y", address: "0x0C", value: "99", type: "int", name: "y", isPointer: false, highlight: "none" },
      { id: "pp", address: "0x10", value: "0x08", type: "int**", name: "pp", isPointer: true, pointsTo: "p", highlight: "none" },
    ],
    arrows: [
      { from: "p", to: "x" },
      { from: "pp", to: "p" },
    ],
  },
];

const CELL_DIM = { w: 88, h: 64 };
const SNAP = { x: 20, y: 20 };

function getCellPos(id: string, cells: MemoryCell[]) {
  const idx = cells.findIndex((c) => c.id === id);
  if (idx === -1) return { x: 0, y: 0 };
  const row = Math.floor(idx / 2);
  const col = idx % 2;
  return {
    x: SNAP.x + col * (CELL_DIM.w + 12),
    y: SNAP.y + row * (CELL_DIM.h + 8),
  };
}

function Arrow({ from, to, cells }: { from: string; to: string; cells: MemoryCell[] }) {
  const f = getCellPos(from, cells);
  const t = getCellPos(to, cells);
  const fx = f.x + CELL_DIM.w;
  const fy = f.y + CELL_DIM.h / 2;
  const tx = t.x;
  const ty = t.y + CELL_DIM.h / 2;
  const mx = (fx + tx) / 2;
  const d = `M ${fx} ${fy} Q ${mx} ${fy} ${mx} ${ty} T ${tx} ${ty}`;
  return (
    <svg className="pointer-events-none absolute inset-0" style={{ zIndex: 0 }}>
      <motion.path
        d={d}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
        fill="none"
        stroke="var(--accent-systems)"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
        strokeDasharray="6 3"
      />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--accent-systems)" />
        </marker>
      </defs>
    </svg>
  );
}

export default function PointersSimulation() {
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
    }, 1000 / speed);
    return () => clearInterval(id);
  }, [playing, speed, maxStep]);

  const totalCells = current.cells.length;
  const rows = Math.ceil(totalCells / 2);
  const gridH = SNAP.y * 2 + rows * CELL_DIM.h + (rows - 1) * 8;

  return (
    <div className="p-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{current.label}</h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          step {step + 1}/{STEPS.length}
        </span>
      </div>
      <div className="relative" style={{ minHeight: gridH }}>
        {current.arrows.map((a) => (
          <Arrow key={`${a.from}-${a.to}`} from={a.from} to={a.to} cells={current.cells} />
        ))}
        <div className="flex flex-wrap gap-2" style={{ position: "relative", zIndex: 1 }}>
          {current.cells.map((cell) => {
            const pos = getCellPos(cell.id, current.cells);
            return (
              <motion.div
                key={cell.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  borderColor:
                    cell.highlight === "change"
                      ? "var(--warning)"
                      : cell.highlight === "active"
                        ? "var(--accent-systems)"
                        : "var(--border)",
                }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border-2 bg-surface px-3 py-2"
                style={{
                  width: CELL_DIM.w,
                  minHeight: CELL_DIM.h,
                  borderColor:
                    cell.highlight === "change"
                      ? "var(--warning)"
                      : cell.highlight === "active"
                        ? "var(--accent-systems)"
                        : "var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted">{cell.address}</span>
                  <span className="font-mono text-[10px] text-accent-systems">{cell.type}</span>
                </div>
                <div className="mt-1 text-center">
                  <span className="font-mono text-sm font-bold text-foreground">{cell.name}</span>
                </div>
                <div className="text-center font-mono text-xs text-muted">
                  {cell.isPointer ? `→ ${cell.value}` : `= ${cell.value}`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
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
