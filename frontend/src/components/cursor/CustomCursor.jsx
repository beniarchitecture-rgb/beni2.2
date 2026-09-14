import { useEffect, useRef, useState } from "react";

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

/**
 * CustomCursor (WebGL-aware)
 * --------------------------
 * Preserves the original orange dot + ring cursor, and adds contextual states:
 *  - hover : over any interactive element (link / button / input)
 *  - webgl : over a zone marked with [data-cursor-label] => shows a label
 *  - drag  : while pressing inside a WebGL zone => shows the drag label
 *
 * Positioning is done via requestAnimationFrame + transform (no per-move React
 * re-render) for smoothness. Hidden on touch/mobile via CSS.
 */
export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  const [mode, setMode] = useState("default"); // default | hover | webgl | drag
  const [label, setLabel] = useState("");

  useEffect(() => {
    const readZone = (el) => (el ? el.closest("[data-cursor-label]") : null);
    const readInteractive = (el) =>
      el
        ? el.closest('a, button, [role="button"], input, textarea, select, label')
        : null;

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const zone = readZone(e.target);
      const interactive = readInteractive(e.target);
      if (zone) {
        setMode((m) => (m === "drag" ? "drag" : "webgl"));
        setLabel(zone.getAttribute("data-cursor-label") || "");
      } else if (interactive) {
        setMode("hover");
        setLabel("");
      } else {
        setMode("default");
        setLabel("");
      }
    };

    const onDown = (e) => {
      const zone = readZone(e.target);
      if (zone) {
        setMode("drag");
        setLabel(
          zone.getAttribute("data-cursor-drag-label") ||
            zone.getAttribute("data-cursor-label") ||
            ""
        );
      }
    };

    const onUp = (e) => {
      const zone = readZone(e.target);
      if (zone) {
        setMode("webgl");
        setLabel(zone.getAttribute("data-cursor-label") || "");
      } else {
        setMode("default");
        setLabel("");
      }
    };

    const render = () => {
      const { x, y } = posRef.current;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${x + 16}px, ${y + 16}px)`;
      }
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const isWebgl = mode === "webgl" || mode === "drag";

  return (
    <>
      <div
        ref={dotRef}
        className={cx("cursor", mode === "hover" && "hover", isWebgl && "webgl")}
        data-testid="custom-cursor-dot"
      />
      <div
        ref={ringRef}
        className={cx(
          "cursor-ring",
          mode === "hover" && "hover",
          isWebgl && "webgl",
          mode === "drag" && "drag"
        )}
        data-testid="custom-cursor-ring"
      />
      <div
        ref={labelRef}
        className={cx("cursor-label", isWebgl && label && "visible")}
        data-testid="custom-cursor-label"
      >
        {label}
      </div>
    </>
  );
};

export default CustomCursor;
