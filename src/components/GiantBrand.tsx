import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * GiantBrand — the huge cursor-reactive "STUDY HAVEN" wordmark that lives behind
 * the onboarding (login) card.
 *
 * How it works:
 *  • The letterforms are generated once at runtime as an SVG path (opentype.js +
 *    a CDN-hosted display font), so they can be layered, skewed and gradient-filled.
 *  • A pointer position (-1..1) is smoothed with springs; every layer rides that
 *    spring at a different depth -> true parallax.
 *  • Layers: cursor spotlight / breathing outline ghost / blurred colour echo that
 *    smears harder the faster you move / crisp gradient hero line (revealed with a
 *    left-to-right clip sweep) / mirrored reflection below / floating sparkles.
 *  • If the font ever fails to load it degrades gracefully to a CSS stroke wordmark.
 */

const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/archivo-black@latest/files/archivo-black-latin-400-normal.woff";

type Form = { w: number; h: number; d: string };

// -- small pure helpers (module scope - never hooks) --------------------------
function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mixPair(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `rgb(${Math.round(ca[0] + (cb[0] - ca[0]) * t)},${Math.round(ca[1] + (cb[1] - ca[1]) * t)},${Math.round(ca[2] + (cb[2] - ca[2]) * t)})`;
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export default function GiantBrand() {
  const [form, setForm] = useState<Form | null>(null);
  const [failed, setFailed] = useState(false);
  const [hue, setHue] = useState(0); // cycles between two brand gradients
  const [revealed, setRevealed] = useState(false);

  // pointer in -1..1 space, smoothed with a soft spring
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 48, damping: 17, mass: 0.9 });
  const sy = useSpring(py, { stiffness: 48, damping: 17, mass: 0.9 });
  // velocity-driven smear for the blurred echo layer
  const speed = useTransform(px, (v) => Math.abs(v));
  const sv = useSpring(speed, { stiffness: 80, damping: 20 });

  // deep parallax (ghost layers) / tight parallax (hero layer)
  const gx = useTransform(sx, [-1, 1], [42, -42]);
  const gy = useTransform(sy, [-1, 1], [24, -24]);
  const fx = useTransform(sx, [-1, 1], [16, -16]);
  const fy = useTransform(sy, [-1, 1], [9, -9]);
  const skew = useTransform(sx, [-1, 1], [-2, 2]);
  const gBlur = useTransform(sv, [0, 1], [6, 14]);
  // cursor spotlight position (percent strings)
  const glowX = useTransform(sx, [-1, 1], ["24%", "76%"]);
  const glowY = useTransform(sy, [-1, 1], ["28%", "72%"]);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(600px circle at ${x as string} ${y as string}, rgba(247,165,29,0.10), transparent 65%)`
  );

  // build the SVG letterforms once
  useEffect(() => {
    let live = true;
    import("opentype.js")
      .then(async (ot) => {
        const res = await fetch(FONT_URL);
        if (!res.ok) throw new Error(`font ${res.status}`);
        const font = ot.parse(new Uint8Array(await res.arrayBuffer()));
        if (!live || !font.supported) throw new Error("unsupported font");
        const p = font.getPath("STUDY HAVEN", 0, 0, 100, { letterSpacing: 3, kerning: true } as never);
        const bb = p.getBoundingBox();
        const w = Math.ceil(bb.x2 - bb.x1);
        const h = Math.ceil(bb.y2 - bb.y1);
        if (!live || w <= 0 || h <= 0) return;
        setForm({ w, h, d: p.toPathData(2) });
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  // slow hue cycle between palettes (9s per leg, ping-pong)
  useEffect(() => {
    if (failed) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const phase = ((t - t0) / 9000) % 2;
      setHue(phase < 1 ? smoothstep(phase) : 1 - smoothstep(phase - 1));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [failed]);

  // viewport-wide cursor tracking
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py]);

  // entrance sweep once the form exists
  useEffect(() => {
    if (!form) return;
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, [form]);

  // graceful fallback - plain CSS giant outlined wordmark, still parallaxed
  if (failed) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          style={{ x: fx, y: fy }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          <div className="font-display select-none whitespace-nowrap text-[17vw] font-extrabold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_rgba(247,165,29,0.14)]">
            STUDY HAVEN
          </div>
        </motion.div>
      </div>
    );
  }

  if (!form) return null; // invisible until first paint of the letterforms

  const pad = form.h * 0.08;
  const vb = `${-pad} ${-pad} ${form.w + pad * 2} ${form.h + pad * 2}`;
  const c0 = mixPair("#f7a51d", "#3fd0c9", hue); // marigold <-> teal
  const c1 = mixPair("#ff6b4a", "#f7a51d", hue); // flame <-> marigold

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {/* cursor spotlight trailing across the wordmark */}
      <motion.div className="absolute inset-0" style={{ background: glowBg }} />

      {/* back ghost - thin outline, deep parallax, slow breathe */}
      <motion.svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        className="anim-brand-breathe absolute left-1/2 top-1/2 h-[min(42vh,320px)] w-[min(94vw,1480px)] -translate-x-1/2 -translate-y-1/2"
        style={{ x: gx, y: gy }}
      >
        <path d={form.d} fill="none" stroke="rgba(170,177,207,0.15)" strokeWidth={form.h * 0.006} />
      </motion.svg>

      {/* mid ghost - blurred colour echo, extra-deep parallax, smears when moving */}
      <motion.svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 h-[min(42vh,320px)] w-[min(94vw,1480px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: useTransform(gx, (v) => v * 1.5),
          y: useTransform(gy, (v) => v * 1.5),
          filter: useTransform(gBlur, (b) => `blur(${b}px)`),
          opacity: 0.4,
        }}
      >
        <defs>
          <linearGradient id="gb-mid" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c0} />
            <stop offset="100%" stopColor={c1} />
          </linearGradient>
        </defs>
        <path d={form.d} fill="url(#gb-mid)" />
      </motion.svg>

      {/* hero line - crisp gradient fill + warm rim, revealed left-to-right on mount */}
      <motion.svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 h-[min(42vh,320px)] w-[min(94vw,1480px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: fx,
          y: fy,
          skewX: skew,
          clipPath: revealed ? "inset(-30% -30% -30% -30%)" : "inset(-30% 104% -30% -30%)",
          transition: "clip-path 1.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <defs>
          <linearGradient id="gb-hero" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c0} />
            <stop offset="55%" stopColor="#8ea2ff" />
            <stop offset="100%" stopColor={c1} />
          </linearGradient>
        </defs>
        <path d={form.d} fill="url(#gb-hero)" opacity={0.3} />
        <path d={form.d} fill="none" stroke="rgba(247,165,29,0.5)" strokeWidth={form.h * 0.007} opacity={0.5} />
      </motion.svg>

      {/* mirrored reflection echoing below */}
      <motion.svg
        viewBox={vb}
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-[66%] h-[min(42vh,320px)] w-[min(94vw,1480px)] -translate-x-1/2 opacity-[0.06]"
        style={{
          x: useTransform(gx, (v) => v * 1.8),
          scaleY: -1,
          filter: "blur(3px)",
        }}
      >
        <path d={form.d} fill="#aab1cf" />
      </motion.svg>

      {/* twinkling sparkles scattered around the mark */}
      {[
        ["12%", "22%", 1.1, "#ffbe4d"],
        ["84%", "18%", 1.6, "#5d7bff"],
        ["72%", "72%", 0.8, "#3fd0c9"],
        ["22%", "78%", 1.9, "#ff7a54"],
        ["50%", "12%", 1.35, "#ffd37a"],
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
