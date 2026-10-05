import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * GiantBrand — the huge cursor-reactive "STUDY HAVEN" wordmark behind the
 * onboarding (login) card.
 *
 * v2 — fully self-contained & robust:
 *  • Letterforms are rendered as real DOM text using the site's bundled display
 *    font. No runtime font fetching, no opentype.js parsing, no network failure
 *    modes — it can never render a blank page.
 *  • A pointer position (-1..1) is smoothed with springs; every layer rides that
 *    spring at a different depth -> true parallax.
 *  • Layers: cursor spotlight / breathing outline ghost / blurred colour echo
 *    that smears harder the faster you move / crisp gradient hero line (revealed
 *    with a left-to-right clip sweep) / mirrored reflection below / sparkles.
 */

const WORD = "STUDY HAVEN";

// -- small pure helpers -------------------------------------------------------
function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mixPair(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${Math.round(ca[0] + (cb[0] - ca[0]) * t)},${Math.round(
    ca[1] + (cb[1] - ca[1]) * t,
  )},${Math.round(ca[2] + (cb[2] - ca[2]) * t)})`;
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// The wordmark now lives in a band at the TOP of the page (above the form) so
// it never gets covered by the info box. Layers fill this band and centre inside it.
const BAND = "pointer-events-none absolute inset-x-0 top-[13%] h-[30%] overflow-hidden";

const BASE_TEXT =
  "pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap font-display font-black leading-none tracking-tight select-none";
const SIZE = { fontSize: "clamp(2.2rem, 8.5vw, 7.5rem)" };

type Spring = MotionValue<number>;

/** Shared animated layers — one component so all hooks run unconditionally.
 *  All layers live inside the top band so nothing sits behind the form card. */
function BrandLayers({ sx, sy, gBlur, c0, c1 }: { sx: Spring; sy: Spring; gBlur: MotionValue<number>; c0: string; c1: string }) {
  // deep parallax (ghost layers) / tight parallax (hero layer). Vertical travel
  // is kept small since the band is short.
  const gx = useTransform(sx, [-1, 1], [42, -42]);
  const gy = useTransform(sy, [-1, 1], [10, -10]);
  const fx = useTransform(sx, [-1, 1], [16, -16]);
  const fy = useTransform(sy, [-1, 1], [5, -5]);
  const rx = useTransform(sx, [-1, 1], [70, -70]);
  const ry = useTransform(sy, [-1, 1], [12, -12]);
  const skew = useTransform(sx, [-1, 1], [-2, 2]);

  const grad = `linear-gradient(100deg, ${c0}, #8ea2ff 55%, ${c1})`;

  return (
    <div className={BAND}>
      {/* back ghost - thin outline, deep parallax, slow breathe */}
      <motion.div
        className={`${BASE_TEXT} anim-brand-breathe`}
        style={{ ...SIZE, x: gx, y: gy }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(170,177,207,0.16)]">
          {WORD}
        </span>
      </motion.div>

      {/* mid ghost - blurred colour echo, extra-deep parallax, smears when moving */}
      <motion.div
        className={BASE_TEXT}
        style={{
          ...SIZE,
          x: useTransform(gx, (v) => v * 1.5),
          y: useTransform(gy, (v) => v * 1.5),
          filter: useTransform(gBlur, (b) => `blur(${b}px)`),
          backgroundImage: grad,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: 0.32,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.32 }}
        transition={{ duration: 1.8, delay: 0.15 }}
      >
        <span>{WORD}</span>
      </motion.div>

      {/* hero line - crisp gradient fill + warm rim, revealed left-to-right on mount */}
      <HeroLine fx={fx} fy={fy} skew={skew} grad={grad} />

      {/* mirrored reflection echoing just below the wordmark, inside the band */}
      <motion.div
        className={`${BASE_TEXT} !inset-y-auto !top-[72%] overflow-hidden opacity-[0.07]`}
        style={{
          ...SIZE,
          height: "28%",
          x: rx,
          y: ry,
          transformOrigin: "top center",
          scaleY: -1,
          filter: "blur(3px)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 85%)",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
        }}
      >
        <span className="text-paper-100">{WORD}</span>
      </motion.div>
    </div>
  );
}

function HeroLine({
  fx,
  fy,
  skew,
  grad,
}: {
  fx: Spring;
  fy: Spring;
  skew: Spring;
  grad: string;
}) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div
      className={BASE_TEXT}
      style={{
        ...SIZE,
        x: fx,
        y: fy,
        skewX: skew,
        backgroundImage: grad,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        clipPath: revealed
          ? "inset(-30% -30% -30% -30%)"
          : "inset(-30% 104% -30% -30%)",
        transition: "clip-path 1.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <span>{WORD}</span>
    </motion.div>
  );
}

export default function GiantBrand() {
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [hue, setHue] = useState(0); // cycles between two brand gradients

  // pointer in -1..1 space, smoothed with a soft spring
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 48, damping: 17, mass: 0.9 });
  const sy = useSpring(py, { stiffness: 48, damping: 17, mass: 0.9 });
  // velocity-driven smear for the blurred echo layer
  const speed = useTransform(px, (v) => clamp01(Math.abs(v)));
  const sv = useSpring(speed, { stiffness: 80, damping: 20 });
  const gBlur = useTransform(sv, [0, 1], [6, 14]);

  // cursor spotlight position (percent strings) — centred on the top band
  const glowX = useTransform(sx, [-1, 1], ["24%", "76%"]);
  const glowY = useTransform(sy, [-1, 1], ["30%", "60%"]);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x as string} ${y as string}, rgba(247,165,29,0.10), transparent 65%)`,
  );

  // flag mount so entrance animations always play (never stuck hidden)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, []);

  // slow hue cycle between palettes (9s per leg, ping-pong)
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const phase = ((t - t0) / 9000) % 2;
      setHue(phase < 1 ? smoothstep(phase) : 1 - smoothstep(phase - 1));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // viewport-wide cursor tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  const c0 = mixPair("#f7a51d", "#3fd0c9", hue); // marigold <-> teal
  const c1 = mixPair("#ff6b4a", "#f7a51d", hue); // flame <-> marigold

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* cursor spotlight trailing across the wordmark */}
      <motion.div className="absolute inset-0" style={{ background: glowBg }} />

      {mounted && <BrandLayers sx={sx} sy={sy} gBlur={gBlur} c0={c0} c1={c1} />}

      {/* twinkling sparkles scattered around the top band */}
      {[
        ["12%", "30%", 1.1, "#ffbe4d"],
        ["84%", "26%", 1.6, "#5d7bff"],
        ["72%", "46%", 0.8, "#3fd0c9"],
        ["22%", "48%", 1.9, "#ff7a54"],
        ["50%", "22%", 1.35, "#ffd37a"],
      ].map(([x, y, delay, color], i) => (
        <span
          key={i}
          className="anim-brand-twinkle absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: x as string,
            top: y as string,
            background: color as string,
            boxShadow: `0 0 12px 2px ${color}`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
