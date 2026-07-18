import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SimulationControls,
  type SimulationSpeed,
} from "../../../components/ui/SimulationControls";

interface StepData {
  activeFrom: number;
  activeTo: number;
  label: string;
  direction: "forward" | "backward";
  description: string;
  serverStates: string[];
}

const SERVERS = [
  "Client",
  "Recursive\nResolver",
  "Root NS",
  "TLD NS\n(.com)",
  "Authoritative\nNS",
];

const STEPS: StepData[] = [
  {
    activeFrom: -1,
    activeTo: -1,
    label: "",
    direction: "forward",
    description: "Initial state — all servers idle.",
    serverStates: ["\u2014", "\u2014", "\u2014", "\u2014", "\u2014"],
  },
  {
    activeFrom: 0,
    activeTo: 1,
    label: "example.com?",
    direction: "forward",
    description: "Client queries the recursive resolver for example.com.",
    serverStates: ["querying", "receiving", "\u2014", "\u2014", "\u2014"],
  },
  {
    activeFrom: 1,
    activeTo: 2,
    label: "example.com?",
    direction: "forward",
    description: "Recursive resolver asks a root nameserver.",
    serverStates: ["waiting", "querying", "receiving", "\u2014", "\u2014"],
  },
  {
    activeFrom: 2,
    activeTo: 1,
    label: "\u2192 .com TLD",
    direction: "backward",
    description:
      "Root refers resolver to the .com TLD nameserver.",
    serverStates: ["waiting", "receiving", "responded", "\u2014", "\u2014"],
  },
  {
    activeFrom: 1,
    activeTo: 3,
    label: "example.com?",
    direction: "forward",
    description: "Resolver queries the .com TLD nameserver.",
    serverStates: [
      "waiting",
      "querying",
      "done",
      "receiving",
      "\u2014",
    ],
  },
  {
    activeFrom: 3,
    activeTo: 1,
    label: "\u2192 ns.example.com",
    direction: "backward",
    description:
      "TLD refers resolver to the authoritative nameserver for example.com.",
    serverStates: [
      "waiting",
      "receiving",
      "done",
      "responded",
      "\u2014",
    ],
  },
  {
    activeFrom: 1,
    activeTo: 4,
    label: "example.com?",
    direction: "forward",
    description: "Resolver queries the authoritative nameserver.",
    serverStates: [
      "waiting",
      "querying",
      "done",
      "done",
      "receiving",
    ],
  },
  {
    activeFrom: 4,
    activeTo: 1,
    label: "\u2192 93.184.216.34",
    direction: "backward",
    description:
      "Authoritative nameserver responds with the IP address.",
    serverStates: [
      "waiting",
      "receiving",
      "done",
      "done",
      "responded",
    ],
  },
  {
    activeFrom: 1,
    activeTo: 0,
    label: "\u2192 93.184.216.34",
    direction: "backward",
    description:
      "Recursive resolver returns the IP to the client and caches the result.",
    serverStates: [
      "receiving",
      "cached!",
      "done",
      "done",
      "done",
    ],
  },
];

export default function DNSResolutionSimulation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<SimulationSpeed>(1);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= STEPS.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 900 / speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  const data = STEPS[step];

  const isActive = (i: number) =>
    data.activeFrom === i || data.activeTo === i;

  return (
    <div className="p-0">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          DNS Resolution
        </h3>
        <span className="rounded-full bg-background px-3 py-1 font-mono text-xs text-muted">
          Step {step}/{STEPS.length - 1}
        </span>
      </div>

      <div className="relative flex items-start justify-center gap-2 py-8">
        {SERVERS.map((name, i) => (
          <div key={name} className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: isActive(i) ? 1.05 : 1,
              }}
              className={`flex h-16 w-28 items-center justify-center rounded-xl border-2 bg-surface text-center text-xs font-medium text-foreground ${
                isActive(i)
                  ? "border-accent-networking"
                  : data.serverStates[i] === "done" ||
                      data.serverStates[i] === "cached!"
                    ? "border-success"
                    : data.serverStates[i] === "responded"
                      ? "border-accent-networking"
                      : "border-border"
              }`}
            >
              {name.split("\n").map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </motion.div>
            {data.serverStates[i] !== "\u2014" && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`mt-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                  data.serverStates[i] === "cached!"
                    ? "bg-success/20 text-success"
                    : data.serverStates[i] === "done" ||
                        data.serverStates[i] === "responded"
                      ? "bg-accent-networking/20 text-accent-networking"
                      : "bg-warning/20 text-warning"
                }`}
              >
                {data.serverStates[i]}
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {data.activeFrom !== -1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex justify-center"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "auto" }}
            transition={{ duration: 0.4 }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 ${
              data.direction === "forward"
                ? "bg-accent-networking/15 text-accent-networking"
                : "bg-accent-networking/10 text-accent-networking"
            }`}
          >
            <span className="font-mono text-xs">
              {data.direction === "forward" ? "\u2192" : "\u2190"}{" "}
              {data.label}
            </span>
          </motion.div>
        </motion.div>
      )}

      <motion.p
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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