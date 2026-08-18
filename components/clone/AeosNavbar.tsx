"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Nav links ─────────────────────────────────────────────────────────────── */
const navLinks = [
  { label: "Home", href: "#hero", align: "left" as const },
  { label: "What we do", href: "#what-we-do", align: "right" as const },
  { label: "How we do it", href: "#process", align: "left" as const },
  { label: "Why choose us", href: "#why", align: "right" as const },
  { label: "Talk to us", href: "#contact", align: "left" as const },
];

/* ─── NavLink with golden underline that stretches full-width ────────────────
   The underline stretches from the text all the way across to the opposite
   side of the container (matching the AEOS reference).                       */
function NavLink({
  label,
  href,
  align,
  index,
  onClose,
}: {
  label: string;
  href: string;
  align: "left" | "right";
  index: number;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      {/* The link text itself */}
      <a
        href={href}
        onClick={onClose}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          textDecoration: "none",
          color: "#f0ede0",
          fontFamily: "'Instrument Sans', sans-serif",
          fontWeight: 400,
          fontSize: "clamp(24px, 5vw, 56px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          cursor: "pointer",
          display: "block",
          textAlign: align === "right" ? "right" : "left",
          paddingBottom: 12,
          zIndex: 2,
        }}
      >
        {label}
      </a>

      {/* Full-width golden underline — stretches the entire row width */}
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "#f0c030",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: align === "left" ? "left center" : "right center",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      />

      {/* Golden dot centered above the underline */}
      <span
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: `translateX(-50%) scale(${hovered ? 1 : 0})`,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#f0c030",
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transitionDelay: hovered ? "0.12s" : "0s",
          zIndex: 3,
        }}
      />
    </motion.div>
  );
}

/* ─── Main Navbar ───────────────────────────────────────────────────────────── */
export default function AeosNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hamburgerHovered, setHamburgerHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [lineGeometry, setLineGeometry] = useState({
    logoRight: 110,
    linesLeft: 900,
    linesCenterY: 33,
  });

  /* Detect mobile viewport */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Measure positions for the tapered connecting line.
     The button is 48px wide, the inner lines are 28px wide and centered,
     so the lines' left edge = buttonRect.left + (48-28)/2 = buttonRect.left + 10 */
  const measure = useCallback(() => {
    if (!logoRef.current || !hamburgerRef.current) return;
    const logoRect = logoRef.current.getBoundingClientRect();
    const btnRect = hamburgerRef.current.getBoundingClientRect();
    setLineGeometry({
      logoRight: logoRect.right + 4,
      linesLeft: btnRect.left + 10,
      linesCenterY: btnRect.top + btnRect.height / 2,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    const timeout = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timeout);
    };
  }, [measure]);

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleToggle = () => setMenuOpen((prev) => !prev);

  const transition = "all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          NAVBAR BAR
          ════════════════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: isMobile ? "16px 16px 16px" : "22px 28px 18px",
          background: "rgba(5, 5, 15, 0.45)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(240,237,224,0.06)",
        }}
      >
        {/* ── Logo ── */}
        <div ref={logoRef} style={{ lineHeight: 1, zIndex: 101 }}>
          <div
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 400,
              fontSize: 17,
              letterSpacing: "0.24em",
              color: "#f0ede0",
              textTransform: "uppercase",
            }}
          >
            SAPHEX
          </div>
          <div
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 300,
              fontSize: 8,
              letterSpacing: "0.55em",
              color: "rgba(240,237,224,0.5)",
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            L A B S
          </div>
        </div>

        {/* ── Hamburger / Close trigger ── */}
        <button
          ref={hamburgerRef}
          onClick={handleToggle}
          onMouseEnter={() => setHamburgerHovered(true)}
          onMouseLeave={() => setHamburgerHovered(false)}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 101,
            padding: 0,
            marginTop: -4,
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >

          {menuOpen ? (
            /* ── Close icon: × ── */
            <span
              style={{
                position: "relative",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  width: 20,
                  height: 2,
                  background: "#f0ede0",
                  transform: "rotate(45deg)",
                  borderRadius: 1,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  width: 20,
                  height: 2,
                  background: "#f0ede0",
                  transform: "rotate(-45deg)",
                  borderRadius: 1,
                }}
              />
            </span>
          ) : (
            /* ── Hamburger → Arrow hover ──
               3 lines stacked. On hover, top & bottom translateY to center
               then rotate from the RIGHT edge so they meet at one point,
               forming a right-pointing arrow (>). */
            <span
              style={{
                position: "relative",
                width: 28,
                height: 14,
              }}
            >
              {/* Top line — on hover: move down to center + rotate up from right = top arm of > */}
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 28,
                  height: 2,
                  background: "#f0ede0",
                  borderRadius: 1,
                  transition,
                  transformOrigin: "right center",
                  transform: hamburgerHovered
                    ? "translateY(6px) rotate(-25deg)"
                    : "translateY(0) rotate(0deg)",
                }}
              />
              {/* Middle line — stays visible to form the shaft of the arrow */}
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  left: 0,
                  width: 28,
                  height: 2,
                  background: "#f0ede0",
                  borderRadius: 1,
                  transition,
                  opacity: 1,
                }}
              />
              {/* Bottom line — on hover: move up to center + rotate down from right = bottom arm of > */}
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  width: 28,
                  height: 2,
                  background: "#f0ede0",
                  borderRadius: 1,
                  transition,
                  transformOrigin: "right center",
                  transform: hamburgerHovered
                    ? "translateY(-6px) rotate(25deg)"
                    : "translateY(0) rotate(0deg)",
                }}
              />
            </span>
          )}
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════════
          TAPERED CONNECTING LINE (the hamburger's middle line extending left
          all the way to the logo). The polygon is thick (1px) at the hamburger
          end and tapers to a needle-sharp point at the logo end.
          ════════════════════════════════════════════════════════════════════════ */}
      {!menuOpen && (
        <svg
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: 70,
            zIndex: 101,
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="taper-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(240,237,224,0)" />
              <stop offset="25%" stopColor="rgba(240,237,224,0.12)" />
              <stop offset="75%" stopColor="rgba(240,237,224,0.5)" />
              <stop offset="100%" stopColor="rgba(240,237,224,0.75)" />
            </linearGradient>
          </defs>
          {/* Triangle polygon: needle point at logo, 2px tall at hamburger end (matches line weight) */}
          <polygon
            points={[
              `${lineGeometry.logoRight},${lineGeometry.linesCenterY}`,
              `${lineGeometry.linesLeft},${lineGeometry.linesCenterY - 1}`,
              `${lineGeometry.linesLeft},${lineGeometry.linesCenterY + 1}`,
            ].join(" ")}
            fill="url(#taper-grad)"
          />
        </svg>
      )}



      {/* ════════════════════════════════════════════════════════════════════════
          FULLSCREEN MENU OVERLAY (glassmorphism)
          ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 98,
              background: "rgba(5, 5, 15, 0.82)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            {/* Horizontal rule at top of overlay */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{
                position: "absolute",
                top: 66,
                left: 0,
                right: 0,
                height: 1,
                background: "rgba(240,237,224,0.12)",
                transformOrigin: "left center",
              }}
            />

            {/* Navigation links — pushed hard to each side */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: isMobile ? "80px 16px 40px" : "100px clamp(24px, 3vw, 40px) 60px",
                gap: "clamp(8px, 2.5vh, 28px)",
                width: "100%",
              }}
            >
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  align={link.align}
                  index={i}
                  onClose={() => setMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
