"use client";
import { useState } from "react";
import Image from "next/image";

export default function ContactSection() {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    company: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="contact-section"
      style={{
        background: "#000",
        padding: "6rem 5vw",
      }}
    >
      <style>{`
        /* ── Contact card ── */
        .contact-card {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 3fr;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: #0a0a0a;
        }

        /* ── Left panel (image + text overlay) ── */
        .contact-left {
          position: relative;
          min-height: 480px;
          overflow: hidden;
        }
        .contact-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.15) 0%,
            rgba(30,10,60,0.55) 50%,
            rgba(0,0,0,0.75) 100%
          );
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1;
        }
        .contact-left-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: clamp(1.5rem, 3vw, 2.5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* ── Right panel (form) ── */
        .contact-right {
          padding: clamp(1.5rem, 3vw, 2.5rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
          background: #0a0a0a;
        }

        /* ── Input base ── */
        .contact-input {
          width: 100%;
          background: #141414;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 14px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
          resize: none;
        }
        .contact-input::placeholder { color: rgba(255,255,255,0.35); }
        .contact-input:focus { border-color: rgba(255,255,255,0.3); }

        .contact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ── Submit button ── */
        .contact-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          margin-top: 4px;
        }
        .contact-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .contact-submit:active { transform: translateY(0); }

        /* ── Label ── */
        .contact-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-bottom: 16px;
        }
        .contact-label-bar {
          width: 3px;
          height: 14px;
          background: rgba(255,255,255,0.4);
          border-radius: 2px;
        }

        /* ── Success state ── */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          text-align: center;
          padding: 2rem;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .contact-card {
            grid-template-columns: 1fr;
          }
          .contact-left {
            min-height: 300px;
          }
          .contact-row {
            grid-template-columns: 1fr;
          }
          .contact-section {
            padding: 4rem 5vw;
          }
        }
        @media (max-width: 480px) {
          .contact-section {
            padding: 3rem 4vw;
          }
          .contact-left {
            min-height: 220px;
          }
          .contact-input {
            padding: 16px;
            font-size: 16px; /* prevents iOS zoom on focus */
          }
        }
      `}</style>

      <div className="contact-card">

        {/* ── Left: Image panel ── */}
        <div className="contact-left">
          <Image
            src="/contact-artwork.jpg"
            alt="Work with us"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="contact-left-overlay" />
          <div className="contact-left-content">
            <div className="contact-label">
              <span className="contact-label-bar" />
              Work With Us Today
            </div>
            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Ready to
              <br />
              <em
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "1.1em",
                }}
              >
                Upgrade?
              </em>
            </h2>
            <p
              style={{
                fontSize: "clamp(16px, 1.2vw, 18px)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.8)",
                maxWidth: 320,
              }}
            >
              Dive into the future with SAPHEX Labs. Get in touch and build out
              a smarter, more automated org.
            </p>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="contact-right">
          {sent ? (
            <div className="contact-success">
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.5"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  color: "#fff",
                  fontStyle: "italic",
                }}
              >
                Enquiry Sent!
              </p>
              <p style={{ fontSize: "clamp(14px, 1vw, 16px)", color: "rgba(255,255,255,0.7)" }}>
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {/* Row 1: Email + First Name */}
              <div className="contact-row">
                <input
                  className="contact-input"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  className="contact-input"
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Row 2: Company */}
              <input
                className="contact-input"
                type="text"
                placeholder="Company Name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />

              {/* Row 3: Message */}
              <textarea
                className="contact-input"
                placeholder="How can we help?"
                rows={6}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />

              {/* Submit */}
              <button type="submit" className="contact-submit">
                Submit Enquiry
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
