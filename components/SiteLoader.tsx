"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SiteLoader — Premium splash screen
 *
 * White background, SAPHEX LABS logo centered.
 * Letters stagger-reveal, a golden progress line fills beneath,
 * then the entire screen wipes away to reveal the site.
 */
export default function SiteLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progressDone, setProgressDone] = useState(false);

  useEffect(() => {
    // Mark progress bar as "done" after a beat
    const progressTimer = setTimeout(() => setProgressDone(true), 2000);
    // Dismiss loader after progress completes + short hold
    const dismissTimer = setTimeout(() => setLoading(false), 2600);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  // Lock scroll while loader is visible
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const logoLetters = "SAPHEX".split("");
  const subLetters = "LABS".split("");

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#f5f3ee",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
            }}
          >
            {/* ── SAPHEX ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {logoLetters.map((char, i) => (
                <motion.span
                  key={`logo-${i}`}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(42px, 8vw, 72px)",
                    letterSpacing: "0.24em",
                    color: "#0a0a0a",
                    display: "inline-block",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* ── LABS ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5em",
                marginTop: 6,
              }}
            >
              {subLetters.map((char, i) => (
                <motion.span
                  key={`sub-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  transition={{
                    delay: 0.8 + i * 0.06,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(10px, 2vw, 14px)",
                    letterSpacing: "0.55em",
                    color: "#0a0a0a",
                    display: "inline-block",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* ── Golden progress line ── */}
            <motion.div
              style={{
                position: "absolute",
                bottom: "15%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "clamp(120px, 20vw, 200px)",
                height: 2,
                background: "rgba(0,0,0,0.06)",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progressDone ? 1 : 0.6 }}
                transition={
                  progressDone
                    ? { duration: 0.4, ease: "easeOut" }
                    : { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }
                }
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#c8a84b",
                  transformOrigin: "left center",
                  borderRadius: 1,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site content renders underneath from the start (for faster perceived load) */}
      {children}
    </>
  );
}
