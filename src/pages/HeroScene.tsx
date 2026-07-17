import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
function Network() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return [
          Math.cos(a) * 2.3,
          Math.sin(a) * 1.5,
          Math.sin(a * 2) * 0.65,
        ] as [number, number, number];
      }),
    [],
  );
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.08;
  });
  return (
    <group ref={group}>
      {nodes.map((p, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.2} floatIntensity={0.2}>
          <mesh position={p}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={i % 3 === 0 ? "#8bb8ff" : "#c5a7ff"} />
          </mesh>
        </Float>
      ))}
      {nodes.map((p, i) => (
        <Line
          key={`l-${i}`}
          points={[p, nodes[(i + 1) % nodes.length]]}
          color="#495267"
          transparent
          opacity={0.55}
          lineWidth={1}
        />
      ))}
    </group>
  );
}
export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <Network />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
      />
    </Canvas>
  );
}
