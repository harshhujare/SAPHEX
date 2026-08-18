"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const services = [
  {
    id: "genai",
    label: "GenAI Marketing & Content",
    tagline: "Magical customer experiences",
    description:
      "Allow your customers & audience to be part of a movie trailer with their favourite actor or create a custom lullaby for their kids. Create unique marketing experiences & content to maximise reach and engagement. This is a level of user personalisation never seen before.",
  },
  {
    id: "llm",
    label: "Custom LLM Deployments",
    tagline: "Intelligence, fine-tuned to you",
    description:
      "Fine-tuned large language models trained on your proprietary data. We architect domain-specific LLMs that understand your industry's nuance, terminology, and workflows — delivering expert-level intelligence where generic models fall short.",
  },
  {
    id: "workflow",
    label: "Workflow Automation",
    tagline: "From chaos to clarity",
    description:
      "End-to-end automation of complex business processes. We design agent-driven systems that handle approvals, data pipelines, cross-tool orchestration, and decision-making — freeing your team for creative and strategic work.",
  },
  {
    id: "vision",
    label: "Vision Applications",
    tagline: "Systems that see and act",
    description:
      "Real-time computer vision solutions for video understanding, object detection, scene analytics, and visual search. We build systems that see, interpret, and act — from production quality control to immersive media experiences.",
  },
];

export default function WhatWeDo() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="what-we-do"
      style={{
        background: "#06060c",
        padding: "0 2vw 4rem",
      }}
    >
      <style>{`
        /* ── WhatWeDo responsive ── */
        .wwd-grid {
          display: grid;
          grid-template-columns: 2fr 3fr;
          min-height: 420px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,0.5);
        }
        @media (max-width: 768px) {
          .wwd-grid { grid-template-columns: 1fr; min-height: unset; }
          .wwd-right { height: 340px; }
          .wwd-desc-para { max-width: none; }
        }
        @media (max-width: 480px) {
          .wwd-right { height: 260px; }
          .wwd-left-panel { padding: 1.25rem !important; }
          .wwd-service-item { padding: 14px 0; min-height: 44px; display: flex; align-items: center; }
        }

        /* Service list items */
        .wwd-service-item {
          position: relative;
          padding: 18px 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          cursor: pointer;
          transition: color 0.25s;
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 1.5vw, 1.25rem);
          font-weight: 400;
          color: #6b6b6b;
          letter-spacing: -0.01em;
        }
        .wwd-service-item:last-child { border-bottom: none; }
        .wwd-service-item.active {
          font-weight: 700;
          color: #1a1a1a;
        }
        .wwd-service-item::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 2px;
          background: #c8a84b;
          transition: width 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .wwd-service-item.active::after { width: 100%; }

        /* Right panel overlay text */
        .wwd-image-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 2rem 2rem 2.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
        }
      `}</style>

        <div className="wwd-grid" style={{ maxWidth: "100%" }}>

          {/* ── Left panel: off-white ── */}
          <div
            className="wwd-left-panel"
            style={{
              background: "#f7f5f0",
              padding: "clamp(2rem, 4vw, 3.5rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top: label + heading */}
            <div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#666",
                  fontWeight: 600,
                  marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                }}
              >
                <span
                  style={{
                    width: 3,
                    height: 14,
                    background: "#c8a84b",
                    borderRadius: 2,
                    display: "inline-block",
                  }}
                />
                What We Do
              </span>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "#111",
                  letterSpacing: "-0.03em",
                  marginBottom: "clamp(0.75rem, 1.5vw, 1.25rem)",
                }}
              >
                We bring{" "}
                <em
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontWeight: 400,
                  }}
                >
                  AI, engineering &amp;{" "}
                  <br className="hidden-mobile" />
                  content
                </em>{" "}
                expertise
              </motion.h2>

              <p
                style={{
                  fontSize: "clamp(16px, 1.2vw, 18px)",
                  lineHeight: 1.7,
                  color: "#555",
                  maxWidth: 380,
                  marginBottom: "clamp(2rem, 4vw, 3rem)",
                }}
                className="wwd-desc-para"
              >
                Each problem is looked at from a fresh lens to provide you with a
                solution that solves your specific requirements and integrates with
                your existing infrastructure.
              </p>

              {/* Service list */}
              <nav>
                {services.map((svc, i) => (
                  <div
                    key={svc.id}
                    className={`wwd-service-item ${active === i ? "active" : ""}`}
                    onClick={() => setActive(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActive(i)}
                  >
                    {svc.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom tagline */}
            <p
              style={{
                marginTop: 32,
                fontSize: "clamp(12px, 1vw, 14px)",
                letterSpacing: "0.08em",
                color: "#888",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Engineering-first. Results-obsessed.
            </p>
          </div>

          {/* ── Right panel: artwork image ── */}
          <div
            className="wwd-right"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              >
                {/* Artwork image — same for all tabs, content changes in overlay */}
                <Image
                  src="/whatwedo-artwork.jpg"
                  alt="What we do illustration"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />

                {/* Overlay text */}
                <div className="wwd-image-overlay">
                  <motion.h3
                    key={`title-${active}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1.1,
                      marginBottom: 10,
                    }}
                  >
                    {services[active].tagline}
                  </motion.h3>
                  <motion.p
                    key={`desc-${active}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.18 }}
                    style={{
                      fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
                      lineHeight: 1.65,
                      color: "rgba(255,255,255,0.9)",
                      maxWidth: 560,
                    }}
                  >
                    {services[active].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
    </section>
  );
}
