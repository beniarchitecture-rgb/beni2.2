import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollCameraRig } from "./ScrollCameraRig";

const ORANGE = "#E8600A";
const CONCRETE = "#3A3F49";
const SLAB = "#23272F";

/**
 * A single rectangular architectural "portal" frame built from 4 thin bars.
 * Repeated along -Z to create a parametric perspective corridor.
 */
function PortalFrame({ z = 0, scale = 1 }) {
  const w = 3.4;
  const h = 4.2;
  const t = 0.08;
  return (
    <group position={[0, 0, z]} scale={scale}>
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, t, t]} />
        <meshStandardMaterial
          color={CONCRETE}
          roughness={0.9}
          metalness={0.05}
          emissive={ORANGE}
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh position={[0, -h / 2, 0]}>
        <boxGeometry args={[w, t, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[-w / 2, 0, 0]}>
        <boxGeometry args={[t, h, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[t, h, t]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

function PointField() {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const N = 300;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = -Math.random() * 14;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#E8E6DF"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ArchitecturalStructure() {
  const group = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    const breathing = Math.sin(time * 0.15) * 0.08;
    // Damped pointer parallax (~+/-6deg).
    const targetY = breathing + mouse.current.x * 0.12;
    const targetX = -mouse.current.y * 0.06;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
  });

  const portals = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 7; i++) arr.push({ z: -i * 2.2, scale: 1 - i * 0.06 });
    return arr;
  }, []);

  return (
    <group ref={group}>
      {portals.map((p, i) => (
        <PortalFrame key={i} z={p.z} scale={p.scale} />
      ))}

      {/* Floating concrete slabs */}
      <mesh position={[-2.2, -1.2, -2]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.12, 1.1]} />
        <meshStandardMaterial color={SLAB} roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[2.1, 1.0, -3.2]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[1.3, 0.12, 1.0]} />
        <meshStandardMaterial color={SLAB} roughness={0.85} metalness={0.08} />
      </mesh>

      {/* Central abstract glass volume */}
      <mesh position={[0, 0, -1]}>
        <boxGeometry args={[1.4, 2.4, 1.4]} />
        <meshStandardMaterial
          color="#7FA6C4"
          transparent
          opacity={0.16}
          roughness={0.15}
          metalness={0.2}
          emissive="#2A3542"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Single guiding accent line (orange, used sparingly) */}
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.03, 5.4, 0.03]} />
        <meshStandardMaterial
          color={ORANGE}
          emissive={ORANGE}
          emissiveIntensity={0.9}
          toneMapped={false}
        />
      </mesh>

      <PointField />
    </group>
  );
}

function Lights() {
  return (
    <>
      {/* Cool ambient bounce (sky) + warm ground, tropical daylight feel */}
      <hemisphereLight args={["#BFD7FF", "#1E2228", 0.7]} />
      {/* Warm key light (Abidjan sun) */}
      <directionalLight color="#FFD7B0" intensity={1.7} position={[4, 6, 3]} />
      {/* Neutral rim light */}
      <directionalLight color="#E8E6DF" intensity={0.5} position={[-6, 2, -4]} />
      <ambientLight intensity={0.15} />
    </>
  );
}

/**
 * HeroArchitecturalBackdrop
 * -------------------------
 * Lazy-mounted, transparent WebGL layer that sits BEHIND the existing hero
 * image + text as a subtle depth overlay. Never blocks CTAs.
 */
export function HeroArchitecturalBackdrop({ capability, progressRef, onReady }) {
  return (
    <Canvas
      dpr={capability.dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 8], fov: 42 }}
      shadows={false}
      onCreated={() => onReady && onReady()}
      style={{ width: "100%", height: "100%" }}
      data-testid="home-hero-webgl-canvas"
    >
      <Lights />
      <ArchitecturalStructure />
      {capability.allowScrollRig && progressRef && (
        <ScrollCameraRig progressRef={progressRef} />
      )}
    </Canvas>
  );
}

export default HeroArchitecturalBackdrop;
