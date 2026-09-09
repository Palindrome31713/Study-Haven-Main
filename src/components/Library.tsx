import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GRADE_SUBJECTS, NCERT_LIBRARY_URL, STREAMS, SUBJECTS, chaptersOf,
  type Grade, type Profile, type SubjectId,
} from "../data/curriculum";
import { Icon, Reveal } from "./kit";

const GRADES: Grade[] = [9, 10, 11, 12];

export default function Library({ profile, startQuiz }: { profile: Profile; startQuiz: (s: SubjectId, c?: string) => void }) {
  const [grade, setGrade] = useState<Grade>(profile.grade);
  const [stream, setStream] = useState<string>("all");
  const [open, setOpen] = useState<SubjectId | null>(null);

  const books: SubjectId[] = useMemo(() => {
    if (grade === 9 || grade === 10) return GRADE_SUBJECTS[grade];
    const ids = new Set<SubjectId>();
    for (const s of STREAMS) {
      if (stream === "all" || s.id === stream) s.subjects.forEach((x) => ids.add(x));
    }
    return STREAMS.flatMap((s) => s.subjects).filter((x, i, arr) => arr.indexOf(x) === i && ids.has(x));
  }, [grade, stream]);

  const openChapters = open ? chaptersOf(open, grade) : [];

  return (
    <div className="space-y-8 pb-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">The textbook library</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-ink-900 md:text-5xl">Every NCERT book, shelf-ready.</h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-600">
              Your pass unlocks <b className="text-ink-900">Class {profile.grade}</b>. Browse any class below — chapter lists open right here, official PDFs open at NCERT.
            </p>
          </div>
          <div className="flex gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => { setGrade(g); setStream("all"); }}
                className={`relative rounded-xl border-2 px-5 py-3 font-display text-lg font-extrabold transition-all duration-300 ${grade === g ? "border-ink-900 bg-ink-900 text-paper-50 -translate-y-0.5 shadow-card" : "border-ink-900/15 bg-paper-50 text-ink-600 hover:border-ink-900 hover:text-ink-900"}`}
              >
                {g}
                {g === profile.grade && (
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-flame-500 text-[9px] text-white"><Icon name="check" size={10} sw={3} /></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {grade !== profile.grade && (
        <Reveal y={10}>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-dashed border-marigold-500 bg-marigold-400/20 px-5 py-3.5 text-sm font-semibold text-ink-900">
            <span className="flex items-center gap-2.5">
              <Icon name="cap" size={18} className="text-flame-600" />
              You're peeking into Class {grade} — your registered shelf is Class {profile.grade}.
            </span>
            <button onClick={() => { setGrade(profile.grade); setStream("all"); }} className="rounded-full bg-ink-900 px-4 py-1.5 text-xs font-bold text-paper-50 transition hover:bg-ink-800">
              Back to my shelf
            </button>
          </div>
        </Reveal>
      )}

      {(grade === 11 || grade === 12) && (
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", name: "All streams" }, ...STREAMS].map((s) => (
            <button
              key={s.id}
              onClick={() => setStream(s.id)}
              className={`rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${stream === s.id ? "border-ink-900 bg-cobalt-500 text-white" : "border-ink-900/15 bg-paper-50 text-ink-600 hover:border-ink-900"}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {books.map((id, i) => {
          const s = SUBJECTS[id];
          const ch = chaptersOf(id, grade);
          const mine = profile.subjects.includes(id) && grade === profile.grade;
          return (
            <Reveal key={`${grade}-${id}`} delay={(i % 3) * 0.07}>
              <button
                onClick={() => setOpen(id)}
                className={`group relative block h-full w-full overflow-hidden rounded-2xl border-2 border-ink-900 bg-paper-50 text-left transition-all duration-300 hover:-translate-y-1.5 hover:-rotate-[0.6deg] hover:shadow-lift ${mine ? "" : "opacity-90"}`}
              >
                {/* cover band */}
                <div className="relative h-28 overflow-hidden" style={{ background: s.color }}>
                  <div className="dotted absolute inset-0 opacity-25" />
                  <span className="absolute left-4 top-4 font-display text-[11px] font-bold uppercase tracking-[0.24em] text-white/85">NCERT · Class {grade}</span>
                  <span className="absolute bottom-3 left-4 font-display text-xl font-extrabold leading-tight text-white">{s.name}</span>
                  <Icon name={s.icon} size={86} className="absolute -bottom-5 -right-3 text-white/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" sw={1.2} />
                  {mine && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-marigold-300">
                      <Icon name="star" size={11} /> Your shelf
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-sm font-semibold text-ink-600">{s.hindi} · {ch.length} chapters</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-ink-900">
                    Open <Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
                {/* spine */}
                <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: s.color, filter: "brightness(0.75)" }} />
              </button>
            </Reveal>
          );
        })}
      </div>

      <p className="text-xs text-ink-600">
        * Chapter PDFs are served by the official NCERT portal ({NCERT_LIBRARY_URL.split("//")[1]}) — Study Haven only shows you the way.
      </p>

      {/* ------- chapter drawer ------- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-950/55"
              onClick={() => setOpen(null)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l-2 border-ink-900 bg-paper-50"
            >
              <div className="p-6 text-white" style={{ background: SUBJECTS[open].color }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Class {grade} · NCERT</p>
                    <h3 className="mt-1 font-display text-2xl font-extrabold">{SUBJECTS[open].name}</h3>
                    <p className="text-sm text-white/80">{SUBJECTS[open].hindi} · {openChapters.length} chapters</p>
                  </div>
                  <button onClick={() => setOpen(null)} className="rounded-full bg-white/20 p-2 transition hover:bg-white/35" aria-label="Close">
                    <Icon name="close" size={16} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {openChapters.length === 0 && <p className="text-sm text-ink-600">Chapters for this edition are being inked in.</p>}
                <ul className="space-y-2">
                  {openChapters.map((c, i) => (
                    <motion.li
                      key={c}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      className="group flex items-center gap-3 rounded-xl border-2 border-ink-900/10 bg-white px-3.5 py-3 transition-all duration-200 hover:border-ink-900 hover:-translate-y-0.5"
                    >
                      <span className="font-display text-sm font-extrabold text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-sm font-semibold text-ink-900">{c}</span>
                      <a
                        href={NCERT_LIBRARY_URL}
                        target="_blank" rel="noreferrer"
                        title="Open NCERT textbook portal"
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-marigold-400/25 hover:text-ink-900"
                      >
                        <Icon name="doc" size={16} />
                      </a>
                      <button
                        onClick={() => startQuiz(open, c)}
                        title="Quiz this chapter"
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-teal-500/15 hover:text-teal-600"
                      >
                        <Icon name="calc" size={16} />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t-2 border-ink-900 p-4">
                <a
                  href={NCERT_LIBRARY_URL} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-ink-900 px-4 py-3 text-sm font-bold text-ink-900 transition hover:bg-ink-900 hover:text-paper-50"
                >
                  Official PDFs <Icon name="arrow" size={15} />
                </a>
                <button
                  onClick={() => startQuiz(open)}
                  className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:brightness-110"
                  style={{ background: SUBJECTS[open].color }}
                >
                  <Icon name="calc" size={15} /> Quiz this book
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
