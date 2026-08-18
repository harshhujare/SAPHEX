"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/**
 * AILandscape — Scroll-expanding video section
 *
 * As the user scrolls INTO this section:
 *   - The video container grows from a centered card to full-viewport
 *   - Border radius shrinks from 16px → 0
 *
 * On mobile: less scroll budget, wider starting width, shorter initial height.
 */
export default function AILandscape() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-10%" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Pause video when out of view to save resources
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  // ── Scroll progress for the entire section ──
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // ── Map scroll progress to animation values ──
  const startWidth = isMobile ? "92%" : "78%";
  const startHeight = isMobile ? "35vh" : "45vh";

  const width = useTransform(scrollYProgress, [0.15, 0.5], [startWidth, "100%"]);
  const height = useTransform(scrollYProgress, [0.15, 0.5], [startHeight, "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0.15, 0.5], [16, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.6, 0.75], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.2, 0.35], [30, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        height: isMobile ? "180vh" : "250vh",
        position: "relative",
        background: "#06060c",
      }}
    >
      {/* ── Sticky wrapper — pins the video in the viewport ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ── Expanding video container ── */}
        <motion.div
          style={{
            position: "relative",
            width,
            height,
            borderRadius,
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          {/* ── Looping background video ── */}
          <video
            ref={videoRef}
            src="/ai-landscape.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23d4bfff'/%3E%3Cstop offset='1' stop-color='%23f0e8d8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23g)'/%3E%3C/svg%3E"
          />

          {/* ── Subtle dark overlay for text legibility ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.28)",
              pointerEvents: "none",
            }}
          />

          {/* ── Centered text overlay — fades in during scroll ── */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5vw",
              opacity: textOpacity,
              y: textY,
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(1.1rem, 3vw, 2.25rem)",
                color: "#ffffff",
                textAlign: "center",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
                textShadow:
                  "0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)",
                maxWidth: 760,
              }}
            >
              The AI landscape is changing fast — we&apos;ll stay on top of it
              for you
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
