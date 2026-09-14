import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ScrollCameraRig
 * ---------------
 * Reads a scroll progress value (0..1) from a shared ref (driven by GSAP
 * ScrollTrigger in the page) and gently dollies + yaws the camera through the
 * architectural structure. Motion is damped (lerp) so it is smooth and fully
 * reversible — a premium "controlled parallax", never a rollercoaster.
 */
export function ScrollCameraRig({ progressRef }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, -4));

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progressRef?.current || 0));

    // Camera Z travel ~4.5u, gentle vertical rise, subtle yaw via lookAt.
    const targetZ = 8 - p * 4.5;
    const targetY = 0.4 + p * 0.7;

    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;

    // Slight lateral drift of the look target => <=8deg yaw feel.
    const lookX = p * 0.6;
    lookTarget.current.x += (lookX - lookTarget.current.x) * 0.06;
    camera.lookAt(lookTarget.current.x, camera.position.y * 0.2, -4);
  });

  return null;
}

export default ScrollCameraRig;
