export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 md:py-10" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container-leos flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span
            className="font-display text-lg tracking-[0.3em] text-white uppercase"
            style={{ letterSpacing: "0.3em" }}
          >
            SAPHEX LABS
          </span>
          <span className="text-xs ml-4" style={{ color: "var(--text-muted)" }}>
            © {year} SAPHEX Labs. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {["Terms", "Privacy", "Twitter", "LinkedIn"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs hover:text-white transition-colors duration-200"
              style={{ color: "var(--text-muted)", letterSpacing: "0.05em" }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#40c8a0", boxShadow: "0 0 6px rgba(64,200,160,0.8)" }}
          />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
