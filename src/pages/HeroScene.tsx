import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Line, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_COLORS = ["#8bb8ff", "#c5a7ff", "#6ee7b7", "#f7c873"];

function LearningGraph() {
  const graph = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const radius = 2.1 + (index % 3) * 0.28;
        return [
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 0.75,
          Math.sin(angle) * radius * 0.62,
        ] as [number, number, number];
      }),
    [],
  );
  const links = useMemo(
    () =>
      nodes
        .map((_, index) => [nodes[index], nodes[(index + 1) % nodes.length]])
        .concat([
          [nodes[1], nodes[9]],
          [nodes[4], nodes[14]],
          [nodes[7], nodes[16]],
          [nodes[11], nodes[3]],
        ]),
    [nodes],
  );

  useFrame((_, delta) => {
    if (!graph.current || !core.current) return;
    graph.current.rotation.y += delta * 0.055;
    graph.current.rotation.x = THREE.MathUtils.lerp(
      graph.current.rotation.x,
      pointer.y * 0.16,
      0.04,
    );
    graph.current.rotation.z = THREE.MathUtils.lerp(
      graph.current.rotation.z,
      -pointer.x * 0.12,
      0.04,
    );
    core.current.rotation.x += delta * 0.22;
    core.current.rotation.y -= delta * 0.16;
  });

  return (
    <group ref={graph}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.58, 1]} />
        <meshBasicMaterial color="#c5a7ff" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.08, 0.012, 8, 96]} />
        <meshBasicMaterial color="#8bb8ff" transparent opacity={0.48} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[1.4, 0.008, 8, 96]} />
        <meshBasicMaterial color="#6ee7b7" transparent opacity={0.3} />
      </mesh>
      {links.map(([from, to], index) => (
        <Line
          key={index}
          points={[from, to]}
          color={index % 4 === 0 ? "#6ee7b7" : "#53627b"}
          transparent
          opacity={index % 4 === 0 ? 0.65 : 0.38}
          lineWidth={index % 4 === 0 ? 1.25 : 0.7}
        />
      ))}
      {nodes.map((position, index) => (
        <Float
          key={index}
          speed={0.7 + (index % 4) * 0.12}
          rotationIntensity={0.25}
          floatIntensity={0.28}
        >
          <mesh position={position}>
            <sphereGeometry args={[index % 5 === 0 ? 0.14 : 0.085, 16, 16]} />
            <meshBasicMaterial
              color={NODE_COLORS[index % NODE_COLORS.length]}
              transparent
              opacity={0.9}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function DataFragments() {
  const fragments = useMemo(
    () =>
      [
        [-2.8, 1.5, -0.5],
        [2.8, 1.2, -0.7],
        [-2.5, -1.2, 0.3],
        [2.6, -1.5, 0.4],
      ] as [number, number, number][],
    [],
  );
  return (
    <>
      {fragments.map((position, index) => (
        <Float key={index} speed={0.8 + index * 0.1} floatIntensity={0.35}>
          <mesh position={position} rotation={[0.3, index, 0.5]}>
            <boxGeometry args={[0.22, 0.22, 0.22]} />
            <meshBasicMaterial
              color={NODE_COLORS[(index + 1) % NODE_COLORS.length]}
              wireframe
              transparent
              opacity={0.65}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 6.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <color attach="background" args={["#08090d"]} />
      <fog attach="fog" args={["#08090d", 5, 12]} />
      <Stars radius={12} depth={5} count={450} factor={1.2} saturation={0.2} fade speed={0.25} />
      <Sparkles count={90} scale={[9, 5, 5]} size={1.2} speed={0.22} color="#8bb8ff" />
      <LearningGraph />
      <DataFragments />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.18} />
    </Canvas>
  );
}
