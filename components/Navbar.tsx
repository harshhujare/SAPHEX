"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";

const navLinks = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Our Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(5,5,15,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div className="container-leos flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span
              className="font-display text-xl tracking-[0.2em] uppercase text-white group-hover:opacity-80 transition-opacity"
              style={{ letterSpacing: "0.3em", fontSize: "1.1rem" }}
            >
              LEOS
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
                style={{ letterSpacing: "0.05em" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col items-end gap-1.5 p-2 group"
            aria-label="Toggle menu"
          >
            <span
              className="block h-px bg-white transition-all duration-300 group-hover:opacity-60"
              style={{
                width: "28px",
                transform: open ? "rotate(45deg) translate(4px, 4px)" : "none",
              }}
            />
            <span
              className="block h-px bg-white transition-all duration-300 group-hover:opacity-60"
              style={{
                width: open ? "28px" : "18px",
                transform: open ? "rotate(-45deg) translate(1px, -3px)" : "none",
                opacity: open ? 1 : 0.6,
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{ background: "rgba(5,5,15,0.97)", backdropFilter: "blur(30px)" }}
          >
            <nav className="flex flex-col gap-6 items-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="font-display text-4xl text-white hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
