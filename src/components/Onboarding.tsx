import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GRADE_SUBJECTS, STREAMS, SUBJECTS, subjectsForProfile,
  type Grade, type Profile, type SubjectId,
} from "../data/curriculum";
import { Icon, Scramble, Wheel } from "./kit";

export default function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [stream, setStream] = useState<string | null>(null);
  const [picked, setPicked] = useState<SubjectId[]>([]);
  const [shake, setShake] = useState(false);

  const needsStream = grade === 11 || grade === 12;
  const activeStream = STREAMS.find((s) => s.id === stream);

  const optionsForStep: SubjectId[] = useMemo(() => {
    if (!grade) return [];
    if (grade === 9 || grade === 10) return GRADE_SUBJECTS[grade];
    return activeStream ? activeStream.subjects : [];
  }, [grade, activeStream]);

  const fail = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const next = () => {
    if (step === 0 && name.trim().length < 2) return fail();
    if (step === 1 && !grade) return fail();
    if (step === 2 && needsStream && !stream) return fail();
    if (step === (needsStream ? 3 : 2) && picked.length < 3) return fail();
    if (step === (needsStream ? 4 : 3)) {
      if (!grade) return fail();
      onDone({
        name: name.trim(),
        grade,
        stream: needsStream ? stream ?? undefined : undefined,
        subjects: picked,
        createdAt: Date.now(),
      });
      return;
    }
    setStep((s) => s + 1);
  };

  // steps always advance 0 → 1 → (stream?) → subjects → review, so the raw index tracks progress
  const progress = step;

  return (
    <div className="night-bg relative min-h-screen overflow-hidden text-paper-50">
      <div className="stars" />
      <div className="dotted absolute inset-0 opacity-30" />

      {/* drifting study doodles */}
      <Icon name="sigma" size={46} className="anim-floaty absolute left-[7%] top-[18%] text-marigold-400/50" />
      <Icon name="flask" size={40} className="anim-floaty absolute right-[9%] top-[24%] text-teal-400/50" />
      <Icon name="book" size={44} className="anim-floaty absolute bottom-[16%] left-[12%] text-cobalt-400/50" />
      <Icon name="cap" size={40} className="anim-floaty absolute bottom-[22%] right-[14%] text-flame-400/50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8 md:px-10">
        {/* brand */}
        <div className="flex items-center gap-3">
          <span className="anim-spin-slow text-marigold-400"><Wheel size={34} /></span>
          <div className="leading-tight">
            <div className="font-display text-xl font-bold tracking-wide">STUDY HAVEN</div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-paper-50/50">सीबीएसई स्टडी स्टूडियो</div>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-10 md:grid-cols-[1.1fr_1fr]">
          {/* left pitch */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-marigold-500/40 bg-marigold-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-marigold-300">
              <Icon name="spark" size={14} /> CLASS 9 – 12 · NCERT ALIGNED
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              <Scramble text="Your study" /><br />
              <Scramble text="haven," delay={350} />
              <span className="text-marigold-400"><Scramble text=" ready." delay={700} /></span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper-50/70">
              Tell Study Haven once — your name, your class, your subjects — and it builds your personal
              shelf: <span className="text-paper-50">NCERT textbooks, curated video lessons, chapter quizzes that regenerate every time, and an AI doubt-buddy.</span>
            </p>
            <ul className="mt-7 space-y-3 text-sm text-paper-50/80">
              {[
                ["book", "Every NCERT textbook, class 9 → 12"],
                ["play", "Video lessons straight from YouTube, zero clutter"],
                ["calc", "AI-fresh quizzes on any chapter, anytime"],
                ["chat", "A study buddy that only speaks syllabus"],
              ].map(([ic, txt]) => (
                <li key={txt} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-paper-50/15 bg-ink-800 text-marigold-300">
                    <Icon name={ic} size={16} />
                  </span>
                  {txt}
                </li>
              ))}
            </ul>
          </div>

          {/* stepper card */}
          <motion.div
            animate={shake ? { x: [0, -10, 10, -7, 7, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-paper-50/12 bg-ink-900/80 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {Array.from({ length: needsStream ? 5 : 4 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i <= progress ? "w-7 bg-marigold-400" : "w-3.5 bg-paper-50/15"}`}
                  />
                ))}
              </div>
              <span className="font-display text-sm font-bold text-marigold-300">{progress + 1}/{needsStream ? 5 : 4}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 44 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -44 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold">First things first —<br />what should we call you?</h2>
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && next()}
                      maxLength={24}
                      placeholder="e.g. Aarav, Diya, Kabir…"
                      className="mt-6 w-full rounded-xl border border-paper-50/15 bg-ink-950/70 px-4 py-3.5 font-display text-lg text-paper-50 placeholder:text-paper-50/25 focus:border-marigold-400"
                    />
                    <p className="mt-3 text-xs text-paper-50/40">This stays on your device. We like privacy as much as full marks.</p>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold">Which class, {name || "scholar"}?</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {([9, 10, 11, 12] as Grade[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${grade === g ? "border-marigold-400 bg-marigold-500/15" : "border-paper-50/12 bg-ink-950/60 hover:border-paper-50/30"}`}
                        >
                          <div className="font-display text-4xl font-extrabold text-paper-50">{g}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-paper-50/45">Class {g}</div>
                          {g >= 11 && (
                            <div className="mt-2 inline-block rounded-full bg-cobalt-500/25 px-2 py-0.5 text-[10px] font-semibold text-cobalt-400">Streams apply</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && needsStream && (
                  <div>
                    <h2 className="font-display text-2xl font-bold">Pick your stream.</h2>
                    <p className="mt-1 text-sm text-paper-50/55">Class {grade} runs in tracks — choose yours.</p>
                    <div className="mt-5 grid gap-2.5">
                      {STREAMS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setStream(s.id)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300 ${stream === s.id ? "border-marigold-400 bg-marigold-500/15" : "border-paper-50/12 bg-ink-950/60 hover:border-paper-50/30"}`}
                        >
                          <span>
                            <span className="font-display text-lg font-bold">{s.name}</span>
                            <span className="ml-2 text-xs text-paper-50/50">{s.tag}</span>
                          </span>
                          <span className="hidden text-xs text-paper-50/45 sm:block">
                            {s.subjects.slice(0, 4).map((x) => SUBJECTS[x].name.split(" ")[0]).join(" · ")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === (needsStream ? 3 : 2) && (
                  <div>
                    <h2 className="font-display text-2xl font-bold">Your subjects.</h2>
                    <p className="mt-1 text-sm text-paper-50/55">
                      Study Haven unlocks books, videos & quizzes for these. Keep at least 3.
                      <span className="ml-1 font-semibold text-marigold-300">{picked.length} selected</span>
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-2.5">
                      {optionsForStep.map((id) => {
                        const s = SUBJECTS[id];
                        const on = picked.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => setPicked((p) => (on ? p.filter((x) => x !== id) : [...p, id]))}
                            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-300 ${on ? "border-transparent" : "border-paper-50/12 bg-ink-950/60 hover:border-paper-50/30"}`}
                            style={on ? { background: `${s.color}22`, borderColor: s.color } : undefined}
                          >
                            <span
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                              style={{ background: on ? s.color : "rgba(255,255,255,0.06)", color: on ? "#fff" : "#aab1cf" }}
                            >
                              <Icon name={s.icon} size={18} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-semibold">{s.name}</span>
                              <span className="block text-xs text-paper-50/45">{s.hindi}</span>
                            </span>
                            {on && <Icon name="check" size={16} className="ml-auto shrink-0 text-marigold-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === (needsStream ? 4 : 3) && grade && (
                  <div>
                    <h2 className="font-display text-2xl font-bold">Your desk is set.</h2>
                    <div className="mt-5 rounded-xl border border-marigold-500/30 bg-ink-950/70 p-5">
                      <div className="flex items-center gap-4">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-marigold-500 font-display text-2xl font-extrabold text-ink-950">
                          {name.trim().charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-display text-xl font-bold">{name.trim()}</div>
                          <div className="text-sm text-paper-50/55">
                            Class {grade}{needsStream && stream ? ` · ${STREAMS.find((s) => s.id === stream)?.name}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {picked.map((id) => (
                          <span key={id} className="rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: `${SUBJECTS[id].color}66`, color: "#fff", background: `${SUBJECTS[id].color}1f` }}>
                            {SUBJECTS[id].name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-paper-50/45">
                      Saved on this device — Study Haven will remember you next time and take you straight to your desk.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`text-sm font-semibold text-paper-50/50 transition hover:text-paper-50 ${step === 0 ? "pointer-events-none opacity-0" : ""}`}
              >
                ← Back
              </button>
              <button
                onClick={next}
                className="group inline-flex items-center gap-2 rounded-xl bg-marigold-500 px-6 py-3 font-display text-base font-bold text-ink-950 shadow-[0_10px_30px_-10px_rgba(247,165,29,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-marigold-400 active:translate-y-0"
              >
                {step === (needsStream ? 4 : 3) ? "Enter my desk" : "Continue"}
                <Icon name="arrow" size={17} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-paper-50/30">
          <span>स्टडी हेवन · Class 9–12</span>
          <span>NCERT · CBSE pattern</span>
        </div>
      </div>
    </div>
  );
}

// helper used in onboarding to resolve default subjects on stream change
export { subjectsForProfile };
