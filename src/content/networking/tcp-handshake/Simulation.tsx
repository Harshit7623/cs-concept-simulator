import { useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../components/ui/SimulationControls";

interface StepData {
  clientState: string;
  serverState: string;
  arrow: { from: "client" | "server"; label: string } | null;
  description: string;
  phase: number;
}

const STEPS: StepData[] = [
  {
    clientState: "CLOSED",
    serverState: "LISTEN",
    arrow: null,
    description: "Initial state: client is closed, server is listening.",
    phase: 0,
  },
  {
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    arrow: { from: "client", label: "SYN (seq=x)" },
    description: "Client sends a SYN segment with initial sequence number x.",
    phase: 1,
  },
  {
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
    arrow: { from: "server", label: "SYN-ACK (seq=y, ack=x+1)" },
    description:
      "Server responds with SYN-ACK, its own sequence y, and acknowledges x+1.",
    phase: 2,
  },
  {
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    arrow: { from: "client", label: "ACK (seq=x+1, ack=y+1)" },
    description:
      "Client sends ACK. Both sides are now ESTABLISHED.",
    phase: 3,
  },
];

export default function TCPHandshakeSimulation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  const data = STEPS[step];

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          TCP Three-Way Handshake
        </h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          Phase {step}/3
        </span>
      </div>

      <div className="flex items-center justify-center gap-4 py-12">
        <motion.div
          layout
          className={`flex w-36 flex-col items-center rounded-xl border-2 bg-surface p-4 ${
            data.clientState === "ESTABLISHED"
              ? "border-success"
              : data.phase >= 1
                ? "border-accent-networking"
                : "border-border"
          }`}
        >
          <span className="text-sm font-semibold text-foreground">Client</span>
          <span
            className={`mt-1.5 rounded-full bg-background px-2 py-0.5 font-mono text-xs ${
              data.clientState === "ESTABLISHED"
                ? "text-success"
                : "text-muted"
            }`}
          >
            {data.clientState}
          </span>
        </motion.div>

        <div className="relative flex w-44 items-center justify-center">
          {data.arrow && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                transformOrigin:
                  data.arrow.from === "client" ? "left center" : "right center",
              }}
              className="flex w-full flex-col items-center"
            >
              <div className="flex w-full items-center">
                <div
                  className={`h-0.5 flex-1 ${
                    data.arrow.from === "client"
                      ? "bg-gradient-to-r from-accent-networking to-accent-networking/60"
                      : "bg-gradient-to-l from-accent-networking to-accent-networking/60"
                  }`}
                />
                <div
                  className={`h-0 w-0 border-y-4 border-l-8 border-y-transparent ${
                    data.arrow.from === "client"
                      ? "border-l-accent-networking"
                      : "rotate-180 border-l-accent-networking"
                  }`}
                />
              </div>
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`absolute whitespace-nowrap font-mono text-xs text-accent-networking ${
                  data.arrow.from === "client" ? "-top-6" : "top-4"
                }`}
              >
                {data.arrow.label}
              </motion.span>
            </motion.div>
          )}
        </div>

        <motion.div
          layout
          className={`flex w-36 flex-col items-center rounded-xl border-2 bg-surface p-4 ${
            data.serverState === "ESTABLISHED"
              ? "border-success"
              : data.phase >= 2
                ? "border-accent-networking"
                : "border-border"
          }`}
        >
          <span className="text-sm font-semibold text-foreground">Server</span>
          <span
            className={`mt-1.5 rounded-full bg-background px-2 py-0.5 font-mono text-xs ${
              data.serverState === "ESTABLISHED"
                ? "text-success"
                : "text-muted"
            }`}
          >
            {data.serverState}
          </span>
        </motion.div>
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center text-sm text-muted"
      >
        {data.description}
      </motion.p>

      <SimulationControls
        isPlaying={playing}
        speed={speed}
        canStepBack={step > 0}
        canStepForward={step < STEPS.length - 1}
        onPlayPause={() => setPlaying((c) => !c)}
        onStepBack={() => setStep((s) => Math.max(0, s - 1))}
        onStepForward={() =>
          setStep((s) => Math.min(STEPS.length - 1, s + 1))
        }
        onReset={() => {
          setStep(0);
          setPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}