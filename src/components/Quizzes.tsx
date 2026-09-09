import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { SUBJECTS, chaptersOf, type Profile, type SubjectId } from "../data/curriculum";
import { buildQuiz, GEN_STEPS, type Q } from "../engine/quiz";
import { recordQuiz } from "../lib/store";
import { Icon, Reveal } from "./kit";

export interface QuizSeed { subject: SubjectId; chapter?: string; nonce: number }

type Phase = "subject" | "chapter" | "generating" | "quiz" | "result";

export default function Quizzes({ profile, seed, onStatsChanged }: {
  profile: Profile;
  seed: QuizSeed | null;
  onStatsChanged: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("subject");
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const consumedSeed = useRef<number | null>(null);

  const chapters = subject ? chaptersOf(subject, profile.grade) : [];

  // react to seed from other tabs (e.g. "Quiz this chapter")
  useEffect(() => {
    if (!seed || consumedSeed.current === seed.nonce) return;
    consumedSeed.current = seed.nonce;
    setSubject(seed.subject);
    if (seed.chapter) {
      setChapter(seed.chapter);
      begin(seed.subject, seed.chapter);
    } else {
      setPhase("chapter");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  // live timer during quiz
  useEffect(() => {
    if (phase !== "quiz") return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(iv);
  }, [phase, startedAt]);

  const begin = (s: SubjectId, c: string) => {
    setPhase("generating");
    setPicked(null);
    setQIndex(0);
    setScore(0);
    setTimeout(() => {
      setQuestions(buildQuiz(s, c, 6));
      setStartedAt(Date.now());
      setElapsed(0);
      setPhase("quiz");
    }, 2300);
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === questions[qIndex].a) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      setPicked(null);
      return;
    }
    // finished
    if (subject && chapter) {
      recordQuiz(subject, chapter, score, questions.length);
      onStatsChanged();
      if (score / questions.length >= 0.6) {
        confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 }, colors: ["#f7a51d", "#e4572e", "#0e8a7b", "#2b50e0", "#ffffff"] });
      }
    }
    setPhase("result");
  };

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="space-y-8 pb-10">
      <Reveal>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">The quiz arena</p>
          <h2 className="mt-1 font-display text-4xl font-extrabold text-ink-900 md:text-5xl">Fresh questions. Every single time.</h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-600">
            Study Haven's quiz engine re-mixes concept banks and generates fresh numericals on the spot — no two attempts look the same.
          </p>
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        {/* ---------- subject picker ---------- */}
        {phase === "subject" && (
          <motion.div key="subject" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {profile.subjects.map((id, i) => {
                const s = SUBJECTS[id];
                const n = chaptersOf(id, profile.grade).length;
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setSubject(id); setPhase("chapter"); }}
                    className="group flex items-center gap-4 rounded-2xl border-2 border-ink-900 bg-paper-50 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl p-3 text-white transition-transform duration-300 group-hover:-rotate-6" style={{ background: s.color }}>
                      <Icon name={s.icon} size={26} />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-extrabold text-ink-900">{s.name}</span>
                      <span className="text-xs font-semibold text-ink-600">{n} chapters · {s.hindi}</span>
                    </span>
                    <Icon name="arrow" size={18} className="ml-auto text-ink-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink-900" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ---------- chapter picker ---------- */}
        {phase === "chapter" && subject && (
          <motion.div key="chapter" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            <button onClick={() => setPhase("subject")} className="mb-4 flex items-center gap-2 text-sm font-bold text-ink-600 transition hover:text-ink-900">
              ← All subjects
            </button>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: SUBJECTS[subject].color }}>
                <Icon name={SUBJECTS[subject].icon} size={22} />
              </span>
              <div>
                <h3 className="font-display text-2xl font-extrabold text-ink-900">{SUBJECTS[subject].name} · Class {profile.grade}</h3>
                <p className="text-sm text-ink-600">Choose a chapter — the forge will shape 6 questions for it.</p>
              </div>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {chapters.map((c, i) => (
                <motion.button
                  key={c}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035 }}
                  onClick={() => { setChapter(c); begin(subject, c); }}
                  className="group flex items-center gap-3 rounded-xl border-2 border-ink-900/12 bg-white px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-900"
                >
                  <span className="font-display text-xs font-extrabold text-ink-400">CH {String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm font-semibold leading-snug text-ink-900">{c}</span>
                  <Icon name="spark" size={15} className="shrink-0 text-ink-400 transition-colors group-hover:text-flame-500" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------- AI generation theatre ---------- */}
        {phase === "generating" && subject && chapter && (
          <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid place-items-center py-16">
            <GenerationTheatre subject={subject} chapter={chapter} grade={profile.grade} />
          </motion.div>
        )}

        {/* ---------- quiz runner ---------- */}
        {phase === "quiz" && questions[qIndex] && (
          <motion.div key={`q-${qIndex}`} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-ink-600">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: subject ? SUBJECTS[subject].color : "#000" }} />
                {subject ? SUBJECTS[subject].name : ""} · {chapter}
              </span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><Icon name="clock" size={13} /> {mm}:{ss}</span>
                <span>Q {qIndex + 1}/{questions.length}</span>
              </span>
            </div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-ink-900/10">
              <motion.div
                className="h-full rounded-full bg-flame-500"
                animate={{ width: `${((qIndex + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <div className="rounded-2xl border-2 border-ink-900 bg-white p-6 shadow-card md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-flame-500">AI-mixed question</p>
              <h3 className="mt-2 font-display text-xl font-bold leading-snug text-ink-900 md:text-2xl">{questions[qIndex].q}</h3>
              <div className="mt-6 grid gap-2.5">
                {questions[qIndex].opts.map((opt, i) => {
                  const isAns = i === questions[qIndex].a;
                  const isPick = i === picked;
                  let cls = "border-ink-900/15 bg-paper-50 hover:border-ink-900 hover:-translate-y-0.5";
                  if (picked !== null) {
                    if (isAns) cls = "border-teal-500 bg-teal-500/12";
                    else if (isPick) cls = "border-flame-500 bg-flame-500/12";
                    else cls = "border-ink-900/10 opacity-50";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={picked !== null}
                      className={`flex items-center gap-3.5 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold text-ink-900 transition-all duration-200 ${cls}`}
                    >
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 font-display text-xs font-extrabold ${picked !== null && isAns ? "border-teal-500 bg-teal-500 text-white" : picked !== null && isPick ? "border-flame-500 bg-flame-500 text-white" : "border-ink-900/25 text-ink-600"}`}>
                        {picked !== null && isAns ? <Icon name="check" size={15} sw={2.6} /> : picked !== null && isPick ? <Icon name="cross" size={15} sw={2.6} /> : "ABCD"[i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {picked !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-5 rounded-xl border-2 p-4 ${picked === questions[qIndex].a ? "border-teal-500/50 bg-teal-500/10" : "border-flame-500/50 bg-flame-500/10"}`}>
                      <p className={`font-display text-sm font-extrabold ${picked === questions[qIndex].a ? "text-teal-600" : "text-flame-600"}`}>
                        {picked === questions[qIndex].a ? "Shabash! Correct." : "Not quite — that's how we learn."}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-600">{questions[qIndex].why}</p>
                    </div>
                    <button
                      onClick={nextQuestion}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3.5 text-sm font-bold text-paper-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-800"
                    >
                      {qIndex + 1 < questions.length ? "Next question" : "See my result"} <Icon name="arrow" size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---------- result ---------- */}
        {phase === "result" && subject && chapter && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl">
            <ResultCard
              score={score} total={questions.length} pct={pct} subject={subject} chapter={chapter} time={`${mm}:${ss}`}
              onRetry={() => begin(subject, chapter)}
              onChapter={() => setPhase("chapter")}
              onSubjects={() => setPhase("subject")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- generation theatre ---------- */

function GenerationTheatre({ subject, chapter, grade }: { subject: SubjectId; chapter: string; grade: number }) {
  const reduced = useReducedMotion();
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const iv = setInterval(() => setStepIdx((i) => (i + 1) % GEN_STEPS.length), 480);
    return () => clearInterval(iv);
  }, [reduced]);

  const s = SUBJECTS[subject];
  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-ink-900 bg-ink-900 p-8 text-center text-paper-50 shadow-lift">
      <div className="relative mx-auto grid h-20 w-20 place-items-center">
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-marigold-400/60 anim-spin-slow" />
        <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: s.color }}>
          <Icon name={s.icon} size={28} />
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-extrabold">Forging your quiz…</h3>
      <p className="mt-1 text-sm text-paper-50/60">{s.name} · {chapter} · Class {grade}</p>
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-paper-50/10">
        <div className="shimmer h-full w-full rounded-full bg-marigold-500/70" />
      </div>
      <p key={stepIdx} className="anim-pop mt-4 font-mono text-xs tracking-wide text-marigold-300">
        {reduced ? "Preparing questions…" : GEN_STEPS[stepIdx]}
      </p>
    </div>
  );
}

/* ---------- result card ---------- */

function ResultCard({ score, total, pct, subject, chapter, time, onRetry, onChapter, onSubjects }: {
  score: number; total: number; pct: number; subject: SubjectId; chapter: string; time: string;
  onRetry: () => void; onChapter: () => void; onSubjects: () => void;
}) {
  const reduced = useReducedMotion();
  const s = SUBJECTS[subject];
  const R = 52, C = 2 * Math.PI * R;
  const msg =
    pct >= 90 ? "Outstanding! Board-examiner level answers." :
    pct >= 70 ? "Strong showing — polish the misses and you're golden." :
    pct >= 40 ? "Solid start. The explanations above are your free coaching." :
    "Every topper has this exact screen somewhere in their story. Again — fresh questions await.";

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink-900 bg-white shadow-lift">
      <div className="p-6 text-white md:p-8" style={{ background: s.color }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Result · saved to your desk</p>
            <h3 className="mt-1 font-display text-2xl font-extrabold">{s.name}</h3>
            <p className="text-sm text-white/85">{chapter}</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-ink-950/25 px-3 py-1.5 text-xs font-bold"><Icon name="clock" size={13} /> {time}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={R} fill="none" stroke="#e2e5d8" strokeWidth="11" />
            <motion.circle
              cx="65" cy="65" r={R} fill="none" stroke={s.color} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: reduced ? C - (C * pct) / 100 : C }}
              animate={{ strokeDashoffset: C - (C * pct) / 100 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
              transform="rotate(-90 65 65)"
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold text-ink-900">{pct}%</div>
              <div className="text-xs font-bold text-ink-600">{score}/{total} correct</div>
            </div>
          </div>
        </div>
        <div>
          <p className="font-display text-xl font-extrabold leading-snug text-ink-900">{msg}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Score saved. Hit “fresh questions” and the engine will hand you a different paper — because repetition with variety is how concepts stick.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t-2 border-ink-900/10 p-5">
        <button onClick={onRetry} className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110" style={{ background: s.color }}>
          <Icon name="refresh" size={15} /> Fresh questions
        </button>
        <button onClick={onChapter} className="rounded-xl border-2 border-ink-900 px-5 py-3 text-sm font-bold text-ink-900 transition hover:bg-ink-900 hover:text-paper-50">
          Change chapter
        </button>
        <button onClick={onSubjects} className="rounded-xl border-2 border-ink-900/15 px-5 py-3 text-sm font-bold text-ink-600 transition hover:border-ink-900 hover:text-ink-900">
          All subjects
        </button>
      </div>
    </div>
  );
}
