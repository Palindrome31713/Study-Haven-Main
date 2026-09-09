import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ---------------- custom icon set ---------------- */

const PATHS: Record<string, ReactNode> = {
  sigma: <path d="M18 6V5H6.5l6 7-6 7H18v-1" />,
  atom: (
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
    </>
  ),
  flask: <path d="M10 3h4M10.5 3v5.2L5.6 17.4A2.4 2.4 0 0 0 7.8 21h8.4a2.4 2.4 0 0 0 2.2-3.6L13.5 8.2V3M8 15h8" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z" />
    </>
  ),
  pen: <path d="M12 19l7-7a2.1 2.1 0 0 0-3-3l-7 7-1.5 4.5L12 19zM15 6l3 3M4 20h6" />,
  akshara: <path d="M5 4h14M9 4v3M15 4v3M6.5 7h11M12 7c-2.6 1.5-4 3.6-4 5.5 0 1.8 1.3 3 3 3 1.2 0 2.2-.6 3-1.5M12 7c2 1.2 3.4 2.6 4 4.5M16.5 12.5V19M16.5 19c-1.5 1.6-3.4 2.4-5.5 2" />,
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    </>
  ),
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  ledger: <path d="M5 3h13a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 3v18M12 8h4M12 12h4M12 16h2" />,
  case: <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8zM4 8l2-4h12l2 4M9 12h6" />,
  chart: <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3M20 16V6" />,
  scale: <path d="M12 3v18M8 21h8M12 6l-5 2M12 6l5-2M4.5 13.5L7 8l2.5 5.5a2.8 2.8 0 0 1-5 0zM14.5 11.5L17 6l2.5 5.5a2.8 2.8 0 0 1-5 0z" />,
  leaf: <path d="M5 19C5 10 11 5 20 4c-.5 9-5.5 15-13 15h-2zM5 19c2-5 5-8 9-10" />,
  mind: <path d="M9 4a4 4 0 0 0-4 4c0 1-.5 1.6-1.3 2.4A2.2 2.2 0 0 0 5 14a3.5 3.5 0 0 0 3.5 3.5c.3 2 1.5 3.5 3.5 3.5s3.2-1.5 3.5-3.5A3.5 3.5 0 0 0 19 14a2.2 2.2 0 0 0 1.3-3.6C19.5 9.6 19 9 19 8a4 4 0 0 0-4-4 4.4 4.4 0 0 0-3 1A4.4 4.4 0 0 0 9 4zM12 9v6M9.5 12h5" />,
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5M9 8h7M9 12h5" />,
  play: <path d="M7 4.5l13 7.5-13 7.5v-15z" />,
  chat: <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6zM8.5 9h7M8.5 12.5h4" />,
  spark: <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2zM19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8L19 3z" />,
  flame: <path d="M12 2c1 3-1.5 4.5-1.5 7a3.5 3.5 0 0 0 7 .3C19.5 12 21 14.5 21 16.5A9 9 0 0 1 3 16.5C3 11 8 9.5 8 5c2 .5 3.4 1.7 4-3z" />,
  arrow: <path d="M7 17L17 7M9 7h8v8" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4" />,
  check: <path d="M4.5 12.5l5 5 10-11" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  send: <path d="M3.5 11L21 3.5 13.5 21l-2.8-7.2L3.5 11zM10.7 13.8L21 3.5" />,
  close: <path d="M5 5l14 14M19 5L5 19" />,
  search: <path d="M4 10.5a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zM15.3 15.3L21 21" />,
  doc: <path d="M6 2.5h8l4 4V21a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 21V2.5zM14 2.5v4h4M9 12h6M9 16h6" />,
  calc: <path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM7.5 6.5h9M8 12h.01M12 12h.01M16 12h.01M8 15.5h.01M12 15.5h.01M16 15.5h.01M8 19h.01M12 19h.01M16 19h.01" />,
  wheel: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 2.8v6.6M12 14.6v6.6M2.8 12h6.6M14.6 12h6.6M5.5 5.5l4.7 4.7M13.8 13.8l4.7 4.7M18.5 5.5l-4.7 4.7M10.2 13.8l-4.7 4.7" />
    </>
  ),
  plane: <path d="M21 3L3 10.5l6.5 2.5L12 20l3-6.5L21 3zM9.5 13L21 3" />,
  cap: <path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9zM6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />,
  clock: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7.5V12l3 2" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 5H4.5v1.5A3.5 3.5 0 0 0 8 10M16 5h3.5v1.5A3.5 3.5 0 0 1 16 10M12 13v3M8.5 21h7M10 21v-2.5a2 2 0 0 1 4 0V21" />,
  edit: <path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17l-1 3zM13.5 6.5l3 3" />,
  star: <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9L12 2.5z" />,
};

export function Icon({ name, size = 20, className = "", sw = 1.7, style }: { name: string; size?: number; className?: string; sw?: number; style?: CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.spark}
    </svg>
  );
}

export function Wheel({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <Icon name="wheel" size={size} className={className} sw={1.5} />;
}

/* ---------------- scramble-decode text ---------------- */

const GLYPHS = "अआकखगचछजझटठडढणतथदधनपफबभमयरलवशषसह+×=∑π#";

export function Scramble({ text, className = "", delay = 0, speed = 28 }: { text: string; className?: string; delay?: number; speed?: number }) {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t + delay;
      if (t >= start) {
        frame++;
        const revealed = Math.floor((frame * speed) / 60);
        const s = text
          .split("")
          .map((ch, i) => (i < revealed ? ch : ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("");
        setOut(s);
        if (revealed >= text.length) {
          setOut(text);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduced, delay, speed]);
  return <span className={className}>{out || "\u00A0"}</span>;
}

/* ---------------- scroll reveal ---------------- */

export function Reveal({ children, delay = 0, y = 26, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- marquee ---------------- */

export function Marquee({ items, className = "", speed = 36 }: { items: string[]; className?: string; speed?: number }) {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-6 pr-6">
          <span className="whitespace-nowrap">{it}</span>
          <Wheel size={12} className="opacity-40" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee overflow-hidden ${className}`} style={{ ["--speed" as string]: `${speed}s` }}>
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}

/* ---------------- misc ---------------- */

export function useTyping(full: string, active: boolean, cps = 42) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced || !active ? full.length : 0);
  useEffect(() => {
    if (reduced || !active) {
      setN(full.length);
      return;
    }
    setN(0);
    const iv = setInterval(() => setN((v) => Math.min(v + 1, full.length)), 1000 / cps);
    return () => clearInterval(iv);
  }, [full, active, reduced, cps]);
  return { text: full.slice(0, n), done: n >= full.length };
}

export function useCountUp(target: number, ms = 900) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? target : 0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        ob.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / ms);
          setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [target, ms, reduced]);
  return { ref, value: v };
}
