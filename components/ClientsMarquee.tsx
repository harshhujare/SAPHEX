"use client";
import { motion } from "framer-motion";

const clients = [
  "eKraft.",
  "Lenovo",
  "Aashirvaad",
  "Google",
  "Netflix",
  "Adobe",
  "Samsung",
  "Microsoft",
  "Spotify",
];

export default function ClientsMarquee() {
  const doubled = [...clients, ...clients];

  return (
    <section className="py-16 sm:py-10 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container-leos mb-8">
        <span className="section-label">Clients We&apos;ve Worked With</span>
      </div>

      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-16 md:w-32"
          style={{ background: "linear-gradient(to right, var(--bg-primary), transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-16 md:w-32"
          style={{ background: "linear-gradient(to left, var(--bg-primary), transparent)" }}
        />

        <div className="flex marquee-track">
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center justify-center px-6 md:px-12"
              style={{ minWidth: 140 }}
            >
              <span
                className="text-2xl md:text-3xl font-light tracking-tight whitespace-nowrap transition-colors duration-300"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Inter', sans-serif",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)";
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
