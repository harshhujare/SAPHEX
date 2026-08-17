"use client";
import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — two-state cursor system:
 *
 * DEFAULT:  small dot + floating ring follower
 * TEXT:     ring expands into a white "spotlight" circle with mix-blend-mode:difference
 *           → text beneath it appears colour-inverted (black→white, white→black)
 *
 * The spotlight uses mix-blend-mode:difference so it inverts anything under it
 * without any JS colour calculations — pure CSS compositing.
 */
export default function CustomCursor() {
  const dotRef      = useRef<HTMLDivElement>(null);
  const spotRef     = useRef<HTMLDivElement>(null);  // spotlight / follower
  const posRef      = useRef({ mx: 0, my: 0, fx: 0, fy: 0 });
  const stateRef    = useRef({ onText: false });
  const rafRef      = useRef<number>(0);

  // TEXT_SELECTORS — every element whose text we want to spotlight on hover
  const TEXT_SELECTORS = "h1,h2,h3,h4,h5,h6,p,span,a,button,label,li,em,strong,[data-spotlight]";

  const isTextTarget = useCallback((el: Element | null): boolean => {
    if (!el) return false;
    return el.matches(TEXT_SELECTORS) || !!el.closest(TEXT_SELECTORS);
  }, []);

  useEffect(() => {
    const pos = posRef.current;
    const state = stateRef.current;

    // ── Mouse move: snap dot immediately ──
    const onMove = (e: MouseEvent) => {
      pos.mx = e.clientX;
      pos.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top  = e.clientY + "px";
      }
    };

    // ── Hover detection ──
    const onOver = (e: MouseEvent) => {
      const entering = isTextTarget(e.target as Element);
      if (entering === state.onText) return;
      state.onText = entering;

      if (entering) {
        // Expand into spotlight — hide the small dot
        dotRef.current?.classList.add("cursor--text");
        spotRef.current?.classList.add("spotlight--text");
      } else {
        dotRef.current?.classList.remove("cursor--text");
        spotRef.current?.classList.remove("spotlight--text");
      }
    };

    // ── RAF loop: smooth-follow the spotlight ──
    const loop = () => {
      pos.fx += (pos.mx - pos.fx) * 0.1;
      pos.fy += (pos.my - pos.fy) * 0.1;
      if (spotRef.current) {
        spotRef.current.style.left = pos.fx + "px";
        spotRef.current.style.top  = pos.fy + "px";
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    // ── Custom events from components where canvas blocks mouseover ──
    const onForceSpotlight = () => {
      if (state.onText) return;
      state.onText = true;
      dotRef.current?.classList.add("cursor--text");
      spotRef.current?.classList.add("spotlight--text");
    };
    const onForceNormal = () => {
      if (!state.onText) return;
      state.onText = false;
      dotRef.current?.classList.remove("cursor--text");
      spotRef.current?.classList.remove("spotlight--text");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("cursor:spotlight", onForceSpotlight);
    window.addEventListener("cursor:normal",    onForceNormal);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("cursor:spotlight", onForceSpotlight);
      window.removeEventListener("cursor:normal",    onForceNormal);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTextTarget]);

  return (
    <>
      <style>{`
        /* ── hide system cursor everywhere ── */
        *, *::before, *::after { cursor: none !important; }

        /* ── small dot — snaps instantly to mouse ── */
        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 6px; height: 6px;
          background: #ffffff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10001;
          transform: translate(-50%, -50%);
          transition: opacity 0.2s, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
          mix-blend-mode: difference;
          will-change: left, top;
        }
        /* Hide dot when in spotlight mode — the big circle takes over */
        .cursor-dot.cursor--text {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }

        /* ── spotlight — smooth-follows with lag ── */
        .cursor-spotlight {
          position: fixed;
          top: 0; left: 0;
          /* Default: the subtle ring follower */
          width: 36px; height: 36px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          will-change: left, top, width, height;

          /* Default state: transparent fill, faint border ring */
          background: transparent;
          border: 1px solid rgba(255,255,255,0.22);

          /* Smooth morph between states */
          transition:
            width  0.45s cubic-bezier(0.25,0.46,0.45,0.94),
            height 0.45s cubic-bezier(0.25,0.46,0.45,0.94),
            background 0.35s ease,
            border-color 0.35s ease,
            opacity 0.3s ease;
        }

        /* TEXT hover state: become the white spotlight */
        .cursor-spotlight.spotlight--text {
          width: 120px; height: 120px;
          background: #ffffff;
          border-color: transparent;
          /* mix-blend-mode:difference inverts whatever is underneath */
          mix-blend-mode: difference;
        }
      `}</style>

      {/* Instantly-snapping small dot */}
      <div ref={dotRef} className="cursor-dot" />

      {/* Smooth-following spotlight */}
      <div ref={spotRef} className="cursor-spotlight" />
    </>
  );
}
