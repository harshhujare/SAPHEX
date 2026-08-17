"use client";
import { useState } from "react";

/**
 * ProcessSection — Stacking cards scroll effect
 *
 * Each step is a full-viewport sticky section.
 * Step 1 pins to the screen → Step 2 slides UP over it → Step 3 slides over Step 2.
 * Classic "stacking cards" pattern using position: sticky.
 */

const steps = [
  {
    number: 1,
    title: "Discovery",
    description:
      "Together, we dive into your world. A brainstorming session where your challenges meet our creative thinking",
    accordion: "We learn from you",
    accordionContent:
      "We begin with deep discovery — understanding your workflows, pain points, competitive landscape, and technical constraints. This isn't a questionnaire; it's collaborative architecture.",
    icon: "telescope",
  },
  {
    number: 2,
    title: "Analysis",
    description:
      "We craft a tailored action plan that aligns with your budget and requirements — no guesswork, just solutions",
    accordion: "We build for you",
    accordionContent:
      "We map your existing data systems, identify automation leverage points, and design the AI architecture. Every decision is grounded in measurable outcomes and build feasibility.",
    icon: "lightbulb",
  },
  {
    number: 3,
    title: "Execution",
    description:
      "It's go time. Our team gets to work, setting plans into motion, turning ideas into real-world impact",
    accordion: "We keep you looped",
    accordionContent:
      "Weekly demos, transparent sprints, and production-ready code. From prototype to deployed system — with zero hand-waving. Continuous integration, monitoring dashboards, and documentation that your team can actually use.",
    icon: "wrench",
  },
];

// ── SVG Icons (white line-art, matching the reference) ──
function TelescopeIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Tripod legs */}
      <line x1="60" y1="75" x2="40" y2="115" />
      <line x1="60" y1="75" x2="80" y2="115" />
      <line x1="60" y1="75" x2="60" y2="110" />
      {/* Main tube */}
      <rect x="30" y="28" width="65" height="22" rx="3" transform="rotate(-30 62 39)" />
      {/* Lens front */}
      <ellipse cx="88" cy="22" rx="8" ry="14" transform="rotate(-30 88 22)" />
      {/* Eyepiece */}
      <rect x="18" y="58" width="15" height="10" rx="2" transform="rotate(-30 25 63)" />
      {/* Mount circle */}
      <circle cx="60" cy="72" r="6" />
      <circle cx="60" cy="72" r="3" fill="#fff" />
      {/* Finder scope */}
      <line x1="50" y1="35" x2="42" y2="28" />
      <circle cx="40" cy="26" r="4" />
      <circle cx="40" cy="26" r="2" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Bulb */}
      <path d="M60 20 C40 20, 28 35, 28 52 C28 65, 38 72, 45 80 L45 90 L75 90 L75 80 C82 72, 92 65, 92 52 C92 35, 80 20, 60 20Z" />
      {/* Base lines */}
      <line x1="45" y1="96" x2="75" y2="96" />
      <line x1="48" y1="102" x2="72" y2="102" />
      <line x1="52" y1="108" x2="68" y2="108" />
      {/* Filament */}
      <path d="M52 80 L52 65 L58 55 L62 65 L68 55 L68 65 L68 80" fill="none" />
      {/* Rays */}
      <line x1="60" y1="6" x2="60" y2="14" />
      <line x1="30" y1="15" x2="35" y2="22" />
      <line x1="90" y1="15" x2="85" y2="22" />
      <line x1="16" y1="40" x2="23" y2="43" />
      <line x1="104" y1="40" x2="97" y2="43" />
      <line x1="14" y1="60" x2="22" y2="60" />
      <line x1="106" y1="60" x2="98" y2="60" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Wrench 1 (bottom-left to top-right) */}
      <path d="M30 90 L75 45" />
      <path d="M75 45 C80 35, 95 30, 100 38 C105 46, 98 58, 90 55 L75 45Z" />
      <path d="M30 90 C25 95, 20 100, 25 105 C30 110, 35 105, 40 100 L30 90Z" />
      {/* Wrench 2 (top-left to bottom-right) */}
      <path d="M90 90 L45 45" />
      <path d="M45 45 C40 35, 25 30, 20 38 C15 46, 22 58, 30 55 L45 45Z" />
      <path d="M90 90 C95 95, 100 100, 95 105 C90 110, 85 105, 80 100 L90 90Z" />
      {/* Center bolt */}
      <circle cx="60" cy="60" r="8" />
      <circle cx="60" cy="60" r="4" fill="#fff" />
    </svg>
  );
}

const iconMap: Record<string, () => JSX.Element> = {
  telescope: TelescopeIcon,
  lightbulb: LightbulbIcon,
  wrench: WrenchIcon,
};

export default function ProcessSection() {
  return (
    <section
      id="process"
      style={{
        position: "relative",
        background: "#000",
        /* 100vh per step × 3 steps — gives each sticky card its scroll budget */
        height: "300vh",
      }}
    >
      <style>{`
        .process-step {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 14vh;
          background: #000;
          border-top: 1px solid rgba(255,255,255,0.06);
          z-index: 1;
          box-sizing: border-box;
        }
        .process-step:first-child { border-top: none; }

        .process-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 5vw;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 2.6fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: start;
        }

        .process-right-col {
          display: flex;
          flex-direction: column;
        }

        .process-right-top {
          display: grid;
          grid-template-columns: 1.8fr 0.8fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: start;
        }

        .process-step-label {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          margin-bottom: 12px;
        }

        .process-step-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }

        .process-step-desc {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 400;
          color: rgba(255,255,255,0.75);
          line-height: 1.4;
          letter-spacing: -0.02em;
          padding-top: 8px;
        }

        .process-icon-wrap {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding-top: 8px;
        }

        /* Accordion item — sits under the description */
        .process-accordion {
          width: 100%;
          margin-top: clamp(40px, 8vh, 80px);
          box-sizing: border-box;
        }

        .process-accordion-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px 0;
          border: none;
          border-top: 1px solid rgba(255,255,255,0.12);
          background: none;
          cursor: pointer;
          color: rgba(255,255,255,0.85);
          font-family: 'Inter', sans-serif;
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          font-weight: 400;
          text-align: left;
          transition: color 0.2s;
        }
        .process-accordion-btn:hover { color: #fff; }

        .process-accordion-plus {
          font-size: 20px;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .process-accordion-plus.open {
          transform: rotate(45deg);
        }

        .process-accordion-content {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.3s ease;
          max-height: 0;
          opacity: 0;
        }
        .process-accordion-content.open {
          max-height: 200px;
          opacity: 1;
        }
        .process-accordion-content p {
          padding: 0 0 20px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          max-width: 600px;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .process-inner {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .process-right-top {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .process-icon-wrap {
            justify-content: flex-start;
            order: -1;
          }
          .process-icon-wrap svg {
            width: 64px;
            height: 64px;
          }
          .process-step {
            padding-top: 80px;
            align-items: flex-start;
          }
          .process-accordion-content p {
            max-width: none;
          }
        }
        @media (max-width: 480px) {
          .process-step {
            padding-top: 60px;
          }
          .process-icon-wrap svg {
            width: 48px;
            height: 48px;
          }
          .process-step-desc {
            font-size: clamp(1rem, 4vw, 1.8rem);
          }
        }
      `}</style>

      {steps.map((step, i) => (
        <StepPanel key={step.number} step={step} index={i} />
      ))}
    </section>
  );
}

function StepPanel({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = iconMap[step.icon];

  return (
    <div className="process-step" style={{ zIndex: index + 1 }}>
      <div className="process-inner">
        {/* Left: Step label + title */}
        <div>
          <p className="process-step-label">(Step {step.number})</p>
          <h2 className="process-step-title">{step.title}</h2>
        </div>

        {/* Right: Description, Icon, and Accordion */}
        <div className="process-right-col">
          <div className="process-right-top">
            {/* Center: Description */}
            <p className="process-step-desc">{step.description}</p>

            {/* Right: Icon */}
            <div className="process-icon-wrap">
              <Icon />
            </div>
          </div>

          {/* Bottom: Accordion */}
          <div className="process-accordion">
            <button
              className="process-accordion-btn"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
            >
              <span>{step.accordion}</span>
              <span className={`process-accordion-plus ${open ? "open" : ""}`}>
                +
              </span>
            </button>
            <div className={`process-accordion-content ${open ? "open" : ""}`}>
              <p>{step.accordionContent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
