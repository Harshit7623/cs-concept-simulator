import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const arrayValues = [0.36, 0.76, 0.52, 0.91, 0.45, 0.68, 0.3, 0.84];
const codeLineWidths = [1.65, 1.1, 1.45, 0.82, 1.55, 1.25, 1.7];

const flowPaths = [
  [
    [-2.1, -0.85, -0.25],
    [-0.7, -0.2, 0.2],
    [0.25, 0.55, 0.1],
    [1.95, 0.85, -0.4],
  ],
  [
    [-1.8, 0.7, -0.2],
    [-0.65, 0.45, 0.35],
    [0.45, -0.1, 0.05],
    [2.25, -0.65, -0.3],
  ],
  [
    [-1.65, -0.3, 0.1],
    [-0.25, -0.95, 0.25],
    [0.9, -0.55, 0.05],
    [2.1, 0.22, -0.25],
  ],
] as const;

function AlgorithmArray() {
  const group = useRef<THREE.Group>(null);
  const bars = useRef<(THREE.Mesh | null)[]>([]);
  const cursor = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!group.current || !cursor.current) return;

    const time = clock.getElapsedTime();
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.18,
      0.025,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.12,
      0.025,
    );

    bars.current.forEach((bar, index) => {
      if (!bar) return;
      const pulse = 0.92 + Math.sin(time * 1.8 + index * 0.8) * 0.08;
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, pulse, 0.08);
    });

    const progress = (Math.sin(time * 0.62) + 1) * 0.5;
    cursor.current.position.x = THREE.MathUtils.lerp(-1.48, 1.48, progress);
    (cursor.current.material as THREE.MeshBasicMaterial).opacity =
      0.65 + Math.sin(time * 3) * 0.2;
    group.current.rotation.z += delta * 0.01;
  });

  return (
    <group ref={group} position={[1.45, -0.45, 0.25]} rotation={[-0.12, -0.28, 0]}>
      <mesh position={[0, -0.86, 0]}>
        <boxGeometry args={[3.85, 0.06, 0.46]} />
        <meshBasicMaterial color="#273348" transparent opacity={0.7} />
      </mesh>
      {arrayValues.map((value, index) => {
        const height = 0.35 + value * 1.55;
        const x = -1.48 + index * 0.423;
        return (
          <group key={index} position={[x, -0.82, 0]}>
            <mesh position={[0, height / 2, 0]} ref={(element) => (bars.current[index] = element)}>
              <boxGeometry args={[0.28, height, 0.28]} />
              <meshBasicMaterial
                color={index === 3 ? "#f4c46d" : index % 2 === 0 ? "#7bb4ff" : "#a98bea"}
                transparent
                opacity={index === 3 ? 0.95 : 0.78}
              />
            </mesh>
            <mesh position={[0, 0.03, 0.19]}>
              <boxGeometry args={[0.28, 0.03, 0.02]} />
              <meshBasicMaterial color="#e7eefb" transparent opacity={0.45} />
            </mesh>
          </group>
        );
      })}
      <mesh ref={cursor} position={[-1.48, 0.9, 0.24]}>
        <boxGeometry args={[0.16, 0.08, 0.05]} />
        <meshBasicMaterial color="#8cf0c4" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function InstructionPanel() {
  const group = useRef<THREE.Group>(null);
  const activeLine = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || !activeLine.current) return;
    const time = clock.getElapsedTime();
    group.current.rotation.y += delta * 0.032;
    activeLine.current.position.y = 0.6 - ((Math.floor(time * 1.15) % codeLineWidths.length) * 0.2);
    (activeLine.current.material as THREE.MeshBasicMaterial).opacity =
      0.46 + Math.sin(time * 3.2) * 0.16;
  });

  return (
    <group ref={group} position={[2.22, 0.82, -0.72]} rotation={[0.12, -0.38, 0.06]}>
      <mesh>
        <boxGeometry args={[2.35, 1.95, 0.08]} />
        <meshBasicMaterial color="#111b2a" transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[2.19, 1.79, 0.01]} />
        <meshBasicMaterial color="#0b1019" transparent opacity={0.9} />
      </mesh>
      <mesh ref={activeLine} position={[-0.08, 0.6, 0.075]}>
        <boxGeometry args={[2.06, 0.14, 0.012]} />
        <meshBasicMaterial color="#315b8e" transparent opacity={0.55} />
      </mesh>
      {codeLineWidths.map((width, index) => (
        <mesh key={index} position={[-0.5 + width / 2, 0.6 - index * 0.2, 0.088]}>
          <boxGeometry args={[width, 0.04, 0.01]} />
          <meshBasicMaterial
            color={index === 0 || index === 4 ? "#a98bea" : "#7bb4ff"}
            transparent
            opacity={index === 0 || index === 4 ? 0.72 : 0.48}
          />
        </mesh>
      ))}
      <mesh position={[-0.94, 0.6, 0.09]}>
        <boxGeometry args={[0.12, 1.48, 0.01]} />
        <meshBasicMaterial color="#253147" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function PivotGate() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current || !core.current) return;
    group.current.rotation.y += delta * 0.08;
    core.current.rotation.z = clock.getElapsedTime() * 0.6;
  });

  return (
    <group ref={group} position={[0.05, -0.05, 0.15]}>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.9, 0.9, 0.04]} />
        <meshBasicMaterial color="#20334f" transparent opacity={0.38} wireframe />
      </mesh>
      <mesh ref={core} rotation={[0.65, 0.2, 0]}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial color="#f4c46d" transparent opacity={0.9} wireframe />
      </mesh>
      <mesh position={[-0.72, 0, 0]}>
        <boxGeometry args={[0.03, 1.4, 0.03]} />
        <meshBasicMaterial color="#8cf0c4" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0.72, 0, 0]}>
        <boxGeometry args={[0.03, 1.4, 0.03]} />
        <meshBasicMaterial color="#8cf0c4" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function ControlFlow() {
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const curves = useMemo(
    () =>
      flowPaths.map(
        (points) =>
          new THREE.CatmullRomCurve3(
            points.map((point) => new THREE.Vector3(...point)),
          ),
      ),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    packets.current.forEach((packet, index) => {
      if (!packet) return;
      const point = curves[index].getPointAt((time * 0.11 + index * 0.29) % 1);
      packet.position.copy(point);
      (packet.material as THREE.MeshBasicMaterial).opacity =
        0.72 + Math.sin(time * 3 + index) * 0.18;
    });
  });

  return (
    <group>
      {flowPaths.map((points, index) => (
        <Line
          key={index}
          points={points}
          color={index === 1 ? "#a98bea" : "#456987"}
          transparent
          opacity={0.48}
          lineWidth={1}
        />
      ))}
      {flowPaths.map((_, index) => (
        <mesh key={index} ref={(element) => (packets.current[index] = element)}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial
            color={index === 1 ? "#f4c46d" : "#8cf0c4"}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function ComputationalStage() {
  const stage = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!stage.current) return;
    stage.current.rotation.x = THREE.MathUtils.lerp(
      stage.current.rotation.x,
      -0.08 - pointer.y * 0.1,
      0.025,
    );
    stage.current.rotation.y = THREE.MathUtils.lerp(
      stage.current.rotation.y,
      -0.1 + pointer.x * 0.12,
      0.025,
    );
    stage.current.position.y = Math.sin(clock.getElapsedTime() * 0.25) * 0.04;
    stage.current.rotation.z += delta * 0.004;
  });

  return (
    <group ref={stage} position={[1.15, 0, 0]}>
      <Grid
        position={[0.45, -1.45, -0.65]}
        rotation={[Math.PI / 2, 0, 0]}
        args={[8, 5]}
        cellSize={0.35}
        cellThickness={0.5}
        sectionSize={1.4}
        sectionThickness={1}
        cellColor="#162338"
        sectionColor="#2b4667"
        fadeDistance={7}
        fadeStrength={1.3}
        infiniteGrid={false}
      />
      <AlgorithmArray />
      <PivotGate />
      <InstructionPanel />
      <ControlFlow />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#080b12"]} />
      <fog attach="fog" args={["#080b12", 4.8, 11]} />
      <ComputationalStage />
    </Canvas>
  );
}
