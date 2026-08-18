"use client";

import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import AeosNavbar from "./AeosNavbar";
import { RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Infinity (∞) lemniscate path animation ──────────────────────────────────
// Chips travel along a lemniscate curve while spinning on their own axis

// Card sizes: small floating playing cards
const SEED_WIDTHS  = [0.30, 0.33, 0.28, 0.31, 0.34, 0.29, 0.32, 0.30, 0.33, 0.28];
const SEED_HEIGHTS = [0.42, 0.40, 0.44, 0.41, 0.39, 0.43, 0.40, 0.42, 0.38, 0.44];

// ── Lemniscate (∞) parametric function ──
// Returns [x, y] on a lemniscate of Bernoulli for parameter t
function lemniscate(t: number, scale: number): [number, number] {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);
  const denom = 1 + sinT * sinT;
  const x = (scale * cosT) / denom;
  const y = (scale * sinT * cosT) / denom;
  return [x, y];
}

// ─── Single glass card on infinity path ───────────────────────────────────────
function GlassCard({
  index,
  mouseRef,
  cardCount,
  sizeFactor,
  lemniscateScale,
  enableMouseFollow,
}: {
  index: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  cardCount: number;
  sizeFactor: number;
  lemniscateScale: number;
  enableMouseFollow: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const magnet = useRef({ x: 0, y: 0 });

  // Each chip is evenly distributed along the ∞ path
  const phaseOffset = (index / cardCount) * Math.PI * 2;
  // Unique self-spin speed per card
  const selfSpinSpeed = 0.4 + (index % 3) * 0.15;
  // Slight z-depth variation per card for 3D feel
  const zPhase = index * 0.7;
  const w = SEED_WIDTHS[index] * sizeFactor;
  const h = SEED_HEIGHTS[index] * sizeFactor;

  useFrame(({ clock, invalidate }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // ── Position: follow the infinity path ──
    const pathT = t * 0.25 + phaseOffset;
    const [lx, ly] = lemniscate(pathT, lemniscateScale);
    const lz = Math.sin(pathT * 0.8 + zPhase) * 0.25;

    ref.current.position.x = lx;
    ref.current.position.y = ly;
    ref.current.position.z = lz;

    // ── Rotation: spin on own axis + face along path direction ──
    const baseRotY = t * selfSpinSpeed;
    const baseRotZ = pathT * 0.5;
    const baseRotX = Math.sin(t * 0.3 + phaseOffset) * 0.3;

    // ── Magnetic cursor tilt (micro-animation) ──
    if (enableMouseFollow && mouseRef.current) {
      magnet.current.x = THREE.MathUtils.lerp(magnet.current.x, mouseRef.current.x, 0.06);
      magnet.current.y = THREE.MathUtils.lerp(magnet.current.y, mouseRef.current.y, 0.06);
      
      const dx = magnet.current.x - (lx * 0.3);
      const dy = magnet.current.y - (ly * 0.3);

      ref.current.rotation.x = baseRotX + dy * -0.6;
      ref.current.rotation.y = baseRotY + dx * 0.6;
      ref.current.rotation.z = baseRotZ;
    } else {
      ref.current.rotation.x = baseRotX;
      ref.current.rotation.y = baseRotY;
      ref.current.rotation.z = baseRotZ;
    }

    // Request next frame (needed for "demand" frameloop)
    invalidate();
  });

  return (
    <RoundedBox
      ref={ref}
      args={[w, h, 0.001]}
      radius={0.01}
      smoothness={6}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      {/* Transmissive dark glass */}
      <meshPhysicalMaterial
        color="#040412"
        transmission={0.92}
        roughness={0.35}
        metalness={0.0}
        ior={1.2}
        thickness={0.6}
        iridescence={0.2}
        iridescenceIOR={1.5}
        iridescenceThicknessRange={[100, 800]}
        envMapIntensity={0.03}
        clearcoat={0.1}
        clearcoatRoughness={0.2}
        attenuationColor={new THREE.Color("#1a0a30")}
        attenuationDistance={0.5}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </RoundedBox>
  );
}

// ─── Card cluster — parent handles mouse-follow tilt ──────────────────────────
function CardCluster({
  mouseRef,
  cardCount,
  sizeFactor,
  lemniscateScale,
  groupScale,
  enableMouseFollow,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  cardCount: number;
  sizeFactor: number;
  lemniscateScale: number;
  groupScale: number;
  enableMouseFollow: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ invalidate }) => {
    if (!groupRef.current) return;
    if (!enableMouseFollow || !mouseRef.current) return;

    // Parent group only does mouse-follow tilt
    const targetX = mouseRef.current.y * -0.15;
    const targetY = mouseRef.current.x * 0.15;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.03
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.03
    );

    invalidate();
  });

  return (
    <group ref={groupRef} scale={groupScale}>
      {Array.from({ length: cardCount }, (_, i) => (
        <GlassCard
          key={i}
          index={i}
          mouseRef={mouseRef}
          cardCount={cardCount}
          sizeFactor={sizeFactor}
          lemniscateScale={lemniscateScale}
          enableMouseFollow={enableMouseFollow}
        />
      ))}
    </group>
  );
}

// ─── Render loop controller — pauses when hero is not visible ─────────────────
function RenderController({ isVisible }: { isVisible: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (isVisible) {
      // Kick-start the render loop when becoming visible
      invalidate();
    }
  }, [isVisible, invalidate]);

  return null;
}

// ─── Three.js Scene ───────────────────────────────────────────────────────────
function Scene({
  mouseRef,
  isMobile,
  isVisible,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  isVisible: boolean;
}) {
  const cardCount = isMobile ? 5 : 10;
  const sizeFactor = isMobile ? 0.6 : 1;
  const lemniscateScale = isMobile ? 0.8 : 1.2;
  const groupScale = isMobile ? 1.0 : 1.35;
  const enableMouseFollow = !isMobile;

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 46 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      frameloop="demand"
    >
      <RenderController isVisible={isVisible} />

      {/* Minimal ambient — dark void aesthetic */}
      <ambientLight intensity={0.02} />

      {/* ── CYAN edge light from upper-left — neon glow source ── */}
      <directionalLight position={[-6, 4, 3]} intensity={5} color="#00d4ff" />
      {/* ── CYAN rim from lower-right — wraps around edges ── */}
      <directionalLight position={[5, -3, 2]} intensity={3.5} color="#00b8ff" />
      {/* ── MAGENTA back light — chromatic dispersion kick ── */}
      <directionalLight position={[0, 2, -5]} intensity={4} color="#cc30ff" />
      {/* ── BLUE accent from below — deep undertone ── */}
      <directionalLight position={[-2, -5, 1]} intensity={2.5} color="#2040ff" />
      {/* ── Subtle warm point for slight golden edge catch ── */}
      <pointLight position={[4, 1, 2]} intensity={1.5} color="#ffb040" />
      {/* ── Cool front fill so glass shapes remain visible ── */}
      <pointLight position={[0, 0, 4]} intensity={0.3} color="#80c0ff" />

      {/* NO Environment / HDRI — dark abstract void only */}

      <Suspense fallback={null}>
        <CardCluster
          mouseRef={mouseRef}
          cardCount={cardCount}
          sizeFactor={sizeFactor}
          lemniscateScale={lemniscateScale}
          groupScale={groupScale}
          enableMouseFollow={enableMouseFollow}
        />
      </Suspense>

      {/* Bloom — desktop only (biggest GPU savings on mobile) */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}

// ─── CTA Badge ────────────────────────────────────────────────────────────────
function TalkToUsBadge({ size = 96 }: { size?: number }) {
  const chars = "TALK TO US ★ TALK TO US ★ ".split("");
  const radius = size * 0.4375; // 42/96 ratio preserved
  const fontSize = size * 0.0885; // 8.5/96 ratio preserved
  return (
    <a
      href="#contact"
      data-spotlight
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        display: "block",
        cursor: "pointer",
        textDecoration: "none",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#f0ede0",
          border: "1px solid rgba(26,26,26,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          animation: "spinBadge 9s linear infinite",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              fontSize,
              fontFamily: "'Instrument Sans', sans-serif",
              fontWeight: 500,
              color: "#1a1a1a",
              letterSpacing: "0.04em",
              transform: `rotate(${(i / chars.length) * 360}deg) translate(0, -${radius}px)`,
              transformOrigin: "0 0",
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.208, // 20/96
          color: "#1a1a1a",
        }}
      >
        →
      </div>
    </a>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function SaphexHero() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  useEffect(() => {
    /* Detect mobile / touch device */
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);

    /* Mouse-follow only on non-touch devices */
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const onMove = (e: MouseEvent) => {
      if (isTouch) return;
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    /* IntersectionObserver — pause WebGL when hero is offscreen */
    const heroEl = heroRef.current;
    let observer: IntersectionObserver | null = null;
    if (heroEl) {
      observer = new IntersectionObserver(
        ([entry]) => setIsHeroVisible(entry.isIntersecting),
        { threshold: 0, rootMargin: "100px" }
      );
      observer.observe(heroEl);
    }

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("mousemove", onMove);
      observer?.disconnect();
    };
  }, []);

  /* Responsive badge size */
  const badgeSize = isMobile ? 72 : 96;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spinBadge {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <main
        ref={heroRef}
        style={{
          width: "100vw",
          height: "100vh",
          background: "#06060c",
          fontFamily: "'Instrument Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow — subtle purple center warmth */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: [
              "radial-gradient(ellipse 45% 38% at 50% 46%, rgba(50,12,80,0.45) 0%, transparent 70%)",
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(15,8,40,0.5) 0%, transparent 80%)",
            ].join(", "),
          }}
        />

        {/* Navbar */}
        <AeosNavbar />

        {/* 3D Canvas — full viewport */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <Scene mouseRef={mouseRef} isMobile={isMobile} isVisible={isHeroVisible} />
        </div>

        {/* Invisible spotlight-trigger overlay — sits above canvas, covers hero text zone.
            Fires custom events that CustomCursor listens to, bypassing the WebGL canvas
            which would otherwise swallow all mouseover events. */}
        {!isMobile && (
          <div
            data-spotlight
            onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor:spotlight"))}
            onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor:normal"))}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(480px, 70vw)",
              height: "clamp(120px, 20vh, 200px)",
              zIndex: 15,
              pointerEvents: "all",
              cursor: "none",
            }}
          />
        )}

        {/* Text overlay — rendered as HTML for crispness (matches original) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(96px, 20vw, 200px)",
              color: "#f0ede0",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              margin: 0,
              textShadow: "0 0 60px rgba(0,0,0,0.8)",
              mixBlendMode: "screen" as const,
            }}
          >
            magic
          </h1>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: "clamp(24px, 4vw, 40px)",
              color: "#ddd8c8",
              letterSpacing: "0.12em",
              marginTop: "0.2em",
              textShadow: "0 0 40px rgba(0,0,0,0.8)",
            }}
          >
            as a service
          </p>
        </div>

        {/* Bottom section */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          <div
            style={{ height: 1, background: "rgba(240,237,224,0.09)" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: -4,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#f0c030",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "center" : "flex-end",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : 0,
              padding: isMobile ? "12px 16px 20px" : "16px 28px 28px",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(12px, 1.1vw, 16px)",
                  lineHeight: 1.55,
                  color: "#ede9d8",
                  margin: 0,
                }}
              >
                We are SAPHEX Labs, an{" "}
                <em
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "1.18em",
                    fontWeight: 400,
                  }}
                >
                  engineering
                </em>{" "}
                team
                {!isMobile && <br />}
                {isMobile ? " " : ""}
                that specializes in AI &amp; Video Technology
              </p>
              <p
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontWeight: 300,
                  fontSize: "clamp(10px, 0.82vw, 12px)",
                  color: "rgba(237,233,216,0.38)",
                  margin: "5px 0 0",
                }}
              >
                Based in Bangalore, India. Tinkering since 2022.
              </p>
            </div>
            {!isMobile && <TalkToUsBadge size={badgeSize} />}
          </div>
        </div>
      </main>
    </>
  );
}
