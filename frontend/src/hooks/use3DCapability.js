import { useEffect, useState } from "react";

/**
 * use3DCapability
 * ---------------
 * Central capability + performance gate for all WebGL zones.
 * Decides whether 3D should render at all, and with which quality knobs,
 * based on the device, user motion preference and WebGL support.
 *
 * Returns:
 *  - enabled        : mount the Canvas at all
 *  - allowPostFX    : allow (subtle) post-processing (desktop, enough cores)
 *  - allowScrollRig : allow scroll-driven camera choreography
 *  - isMobile       : viewport <= 768px
 *  - reducedMotion  : prefers-reduced-motion
 *  - dpr            : clamped device pixel ratio
 *  - baseOpacity    : default opacity for subtle hero overlay
 */
function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

const DEFAULT_STATE = {
  enabled: false,
  allowPostFX: false,
  allowScrollRig: false,
  isMobile: false,
  reducedMotion: false,
  dpr: 1,
  baseOpacity: 0.6,
};

export function use3DCapability() {
  const [cap, setCap] = useState(DEFAULT_STATE);

  useEffect(() => {
    const compute = () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const webgl = detectWebGL();
      const lowCore = (navigator.hardwareConcurrency || 8) <= 4;
      const enabled = webgl && !reducedMotion;

      setCap({
        enabled,
        allowPostFX: enabled && !isMobile && !lowCore,
        allowScrollRig: enabled && !isMobile && !reducedMotion,
        isMobile,
        reducedMotion,
        dpr: isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.75),
        baseOpacity: isMobile ? 0.32 : 0.6,
      });
    };

    compute();

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    // Safari <14 fallback: addListener/removeListener
    const add = (mq, fn) =>
      mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
    const remove = (mq, fn) =>
      mq.removeEventListener
        ? mq.removeEventListener("change", fn)
        : mq.removeListener(fn);

    add(mqMotion, compute);
    add(mqMobile, compute);
    window.addEventListener("resize", compute);

    return () => {
      remove(mqMotion, compute);
      remove(mqMobile, compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return cap;
}

export default use3DCapability;
