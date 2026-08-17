"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100vh", background: "var(--bg-primary)" }}
    >
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(80,130,255,0.8) 0%, transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.2,
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(140,80,255,0.8) 0%, transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.15,
            top: "20%",
            right: "15%",
          }}
        />
      </div>

      {/* Hero image — centered */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="relative glow-blue"
          style={{ width: 660, height: 660 }}
        >
          <Image
            src="/hero.png"
            alt="LEOS hero visual"
            fill
            priority
            sizes="660px"
            className="object-contain"
            style={{ mixBlendMode: "screen" }}
          />
        </div>
      </motion.div>

      {/* Center text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ zIndex: 10, flexGrow: 1, paddingTop: 80 }}
      >
        <h1
          className="font-display leading-none"
          style={{
            fontSize: "clamp(4rem, 12vw, 9rem)",
            background: "linear-gradient(135deg, #ffffff 0%, #c0c8ff 40%, #8090ff 70%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          magic
        </h1>
        <p
          className="mt-3 uppercase"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            letterSpacing: "0.25em",
            color: "var(--text-secondary)",
          }}
        >
          as a service
        </p>
      </motion.div>

      {/* Divider line */}
      <div
        className="relative w-full"
        style={{ borderTop: "1px solid var(--border)", zIndex: 10 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            background: "#5080ff",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Bottom descriptor */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="relative container-leos flex items-end justify-between"
        style={{ zIndex: 10, paddingTop: 32, paddingBottom: 32 }}
      >
        <div>
          <p className="text-white font-light leading-relaxed" style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}>
            We are LEOS, an{" "}
            <em className="font-display" style={{ fontStyle: "italic", color: "#8090ff" }}>
              engineering
            </em>{" "}
            team
            <br />
            that specializes in AI &amp; Video Technology
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Based in Bangalore, India. Tinkering since 2022.
          </p>
        </div>

        {/* Talk to us button */}
        <TalkToUs />
      </motion.div>
    </section>
  );
}

function TalkToUs() {
  return (
    <a
      href="#contact"
      className="group relative flex-shrink-0"
      style={{ width: 96, height: 96 }}
      aria-label="Talk to us"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          <defs>
            <path
              id="circle-text-path"
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            />
          </defs>
          <text fill="white" fontSize="10.5" fontFamily="Inter, sans-serif" letterSpacing="2.5">
            <textPath href="#circle-text-path">TALK TO US ✦ TALK TO US ✦ </textPath>
          </text>
        </svg>
      </motion.div>
      <div
        className="absolute flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
        style={{
          inset: 12,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </a>
  );
}
