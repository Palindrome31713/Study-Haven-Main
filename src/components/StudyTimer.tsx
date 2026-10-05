import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { SUBJECTS, chaptersOf, type Profile, type SubjectId } from "../data/curriculum";
import { buildQuiz, GEN_STEPS, type Q } from "../engine/quiz";
import { buildEssaySet, gradeAnswer, type EssayQ, type GradeResult } from "../engine/essay";
import { recordQuiz } from "../lib/store";
import { Icon, Reveal } from "./kit";

/* ------------------------------------------------------------------ */
/*  Study Timer — pick subject + chapter (or whole subject for boards) */
/*  → run a timer with hourly break nudges → on finish: 20 fresh MCQs  */
/*  + 5 long questions you can type or photograph for AI marking.      */
/* ------------------------------------------------------------------ */

type Phase = "setup" | "focus" | "mcq" | "essay" | "done";

const BREAK_SUGGESTIONS = [
  "Stand up, roll your shoulders and stretch your spine for 60 seconds.",
  "Walk around the room / balcony for 5 minutes — let your eyes look past 6 m.",
  "Do 10 slow squats + 10 calf raises; sip some water while you're at it.",
  "Neck tilts left/right (10 s each), then 20 jumping jacks to wake the brain.",
  "Step outside for sunlight and 3 deep breaths — no phone for 5 minutes.",
];

const PRESETS = [15, 25, 45, 60, 90, 120]; // minutes

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function StudyTimer({ profile, onStatsChanged }: {
  profile: Profile;
  onStatsChanged: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [subject, setSubject] = useState<SubjectId>(profile.subjects[0] ?? "math");
  const [chapter, setChapter] = useState<string | null>(null); // null = whole subject
  const [minutes, setMinutes] = useState(45);
  const [remaining, setRemaining] = useState(0);
  const [totalSec, setTotalSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [breakNudge, setBreakNudge] = useState<string | null>(null);
  const [showBreak, setShowBreak] = useState(false);
  const lastBreakAt = useRef(0);

  const chapters = useMemo(() => chaptersOf(subject, profile.grade), [subject, profile.grade]);
  const subj = SUBJECTS[subject];

  /* ---------------- timer loop ---------------- */
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        return next < 0 ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining]);

  // hourly break nudge: every 60 min of elapsed focus time
  useEffect(() => {
    if (phase !== "focus") return;
    const elapsed = totalSec - remaining;
    const hourBlock = Math.floor(elapsed / 3600);
    if (hourBlock > 0 && hourBlock > lastBreakAt.current) {
      lastBreakAt.current = hourBlock;
      setBreakNudge(BREAK_SUGGESTIONS[(hourBlock - 1) % BREAK_SUGGESTIONS.length]);
    }
  }, [remaining, phase, totalSec]);

  // timer finished naturally
  useEffect(() => {
    if (phase === "focus" && running && remaining === 0 && totalSec > 0) {
      setRunning(false);
      beginQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase, running]);

  /* ---------------- quiz state ---------------- */
  const [questions, setQuestions] = useState<Q[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [genStep, setGenStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  /* ---------------- essay state ---------------- */
  const [essays, setEssays] = useState<EssayQ[]>([]);
  const [eIndex, setEIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [grading, setGrading] = useState(false);
  const [results, setResults] = useState<GradeResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const scopeLabel = chapter ?? `Whole subject · Boards practice`;

  function startFocus() {
    setTotalSec(minutes * 60);
    setRemaining(minutes * 60);
    lastBreakAt.current = 0;
    setBreakNudge(null);
    setRunning(true);
    setPhase("focus");
  }

  function stopEarly() {
    setRunning(false);
    beginQuiz();
  }

  function beginQuiz() {
    setGenerating(true);
    setPhase("mcq");
    setGenStep(0);
    setQIndex(0);
    setScore(0);
    setPicked(null);
    setResults([]);
    setEIndex(0);
    setAnswerText("");
    clearPhoto();

    // simulated "AI generating" steps for polish, then build
    let i = 0;
    const stepId = setInterval(() => {
      i += 1;
      setGenStep(i);
      if (i >= GEN_STEPS.length) clearInterval(stepId);
    }, 380);

    window.setTimeout(() => {
      const qs = buildQuiz(subject, chapter ?? "", 20);
      const es = buildEssaySet(subject, 5);
      setQuestions(qs);
      setEssays(es);
      clearInterval(stepId);
      setGenerating(false);
    }, GEN_STEPS.length * 380 + 350);
  }

  function pick(i: number) {
    if (picked !== null || generating) return;
    setPicked(i);
    if (i === questions[qIndex].a) setScore((s) => s + 1);
    window.setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        recordQuiz(subject, chapter ?? "Full syllabus", score + (i === questions[qIndex].a ? 1 : 0), questions.length);
        onStatsChanged();
        setPhase("essay");
      } else {
        setQIndex((n) => n + 1);
        setPicked(null);
      }
    }, 1100);
  }

  function clearPhoto() {
    setPhoto(null);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
  }

  function onFile(f: File | null) {
    if (!f) return clearPhoto();
    setPhoto(f);
    const url = URL.createObjectURL(f);
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(url);
  }

  async function submitEssay() {
    if (!answerText.trim() && !photo) return;
    setGrading(true);
    const res = await gradeAnswer({ answer: answerText, file: photo, key: essays[eIndex].key });
    setResults((r) => [...r, res]);
    setGrading(false);
    setAnswerText("");
    clearPhoto();
    if (eIndex + 1 >= essays.length) {
      const gained = results.reduce((a, x) => a + x.marks, 0) + res.marks;
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
      recordQuiz(subject, `${chapter ?? "Full syllabus"} (+ ${gained}/25 written)`, gained, 25);
      onStatsChanged();
      window.setTimeout(() => setPhase("done"), 400);
    } else {
      setEIndex((n) => n + 1);
    }
  }

  const essayMarks = results.reduce((a, x) => a + x.marks, 0);

  /* ================= render ================= */
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10">
      {/* header */}
      <Reveal className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-black uppercase tracking-[0.2em]" style={{ color: subj.color }}>
            Focus mode
          </p>
          <h1 className="font-display text-3xl font-black text-ink-900 sm:text-4xl">Study Timer</h1>
          <p className="mt-1 text-sm text-ink-600">
            Class {profile.grade} · {subj.name} — finish or stop the timer and get 20 fresh MCQs + 5 written answers marked by AI.
          </p>
        </div>
        <span className="hidden rounded-full border border-ink-200 bg-paper-50 px-3 py-1 text-xs font-bold text-ink-600 sm:block">
          Grade {profile.grade} ready
        </span>
      </Reveal>

      <AnimatePresence mode="wait">
        {/* ---------------- SETUP ---------------- */}
        {phase === "setup" && (
          <motion.div key="setup" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="space-y-8">
            {/* subject */}
            <section>
              <h2 className="mb-3 font-display text-sm font-black uppercase tracking-wider text-ink-700">1 · Pick a subject</h2>
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((sid) => {
                  const s = SUBJECTS[sid];
                  const on = sid === subject;
                  return (
                    <button
                      key={sid}
                      onClick={() => { setSubject(sid); setChapter(null); }}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${on ? "text-paper-50 shadow-md" : "border-ink-200 bg-paper-50 text-ink-700 hover:border-ink-400"}`}
                      style={on ? { background: s.color, borderColor: s.color } : undefined}
                    >
                      <Icon name={s.icon} size={16} /> {s.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* chapter */}
            <section>
              <h2 className="mb-3 font-display text-sm font-black uppercase tracking-wider text-ink-700">2 · What are you studying?</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  onClick={() => setChapter(null)}
                  className={`col-span-full rounded-xl border-2 p-3 text-left transition-all sm:col-span-1 ${chapter === null ? "shadow-md" : "border-dashed"}`}
                  style={chapter === null ? { borderColor: subj.color, background: `${subj.color}12` } : { borderColor: "#d8cfc0", background: "transparent" }}
                >
                  <p className="font-display text-sm font-black" style={{ color: chapter === null ? subj.color : undefined }}>
                    🎯 Whole subject
                  </p>
                  <p className="text-xs text-ink-600">Boards practice — mixed chapters across the syllabus.</p>
                </button>
                {chapters.map((c) => {
                  const on = c === chapter;
                  return (
                    <button
                      key={c}
                      onClick={() => setChapter(c)}
                      className={`rounded-xl border p-3 text-left text-sm font-semibold transition-all ${on ? "text-paper-50 shadow-md" : "border-ink-200 bg-paper-50 text-ink-800 hover:border-ink-400"}`}
                      style={on ? { background: subj.color, borderColor: subj.color } : undefined}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* duration */}
            <section>
              <h2 className="mb-3 font-display text-sm font-black uppercase tracking-wider text-ink-700">3 · Set your timer</h2>
              <div className="flex flex-wrap items-center gap-2">
                {PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMinutes(m)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${minutes === m ? "text-paper-50 shadow-md" : "border-ink-200 bg-paper-50 text-ink-700 hover:border-ink-400"}`}
                    style={minutes === m ? { background: subj.color, borderColor: subj.color } : undefined}
                  >
                    {m} min
                  </button>
                ))}
                <label className="ml-2 flex items-center gap-2 text-sm font-bold text-ink-700">
                  Custom
                  <input
                    type="number" min={1} max={480} value={minutes}
                    onChange={(e) => setMinutes(Math.max(1, Math.min(480, Number(e.target.value) || 1)))}
                    className="w-20 rounded-lg border border-ink-200 bg-paper-50 px-2 py-1.5 text-center font-display font-black outline-none focus:border-ink-500"
                  />
                  min
                </label>
              </div>
              <p className="mt-2 text-xs text-ink-500">💡 After every full hour of focus, you'll get a gentle break + movement suggestion.</p>
            </section>

            <button
              onClick={startFocus}
              className="w-full rounded-2xl py-4 font-display text-lg font-black text-paper-50 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: subj.color }}
            >
              ▶ Start {minutes}-minute session{chapter ? ` · ${chapter}` : " · Full subject"}
            </button>
          </motion.div>
        )}

        {/* ---------------- FOCUS ---------------- */}
        {phase === "focus" && (
          <motion.div key="focus" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="text-center">
            <p className="font-display text-xs font-black uppercase tracking-[0.25em] text-ink-500">
              {SUBJECTS[subject].name} · {scopeLabel}
            </p>

            <div className="relative mx-auto my-8 flex h-64 w-64 items-center justify-center">
              {/* progress ring */}
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5dccd" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="52" fill="none" stroke={subj.color} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (remaining / Math.max(1, totalSec)) }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </svg>
              <div>
                <p className="font-display text-5xl font-black tabular-nums text-ink-900">{fmt(remaining)}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-ink-500">{running ? "deep work…" : "paused"}</p>
              </div>
            </div>

            <div className="mx-auto mb-6 h-2 w-72 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${100 - (remaining / Math.max(1, totalSec)) * 100}%`, background: subj.color }} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setRunning((r) => !r)}
                className="rounded-full border-2 border-ink-300 bg-paper-50 px-6 py-2.5 font-display text-sm font-black text-ink-800 hover:border-ink-500"
              >
                {running ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button
                onClick={stopEarly}
                className="rounded-full px-6 py-2.5 font-display text-sm font-black text-paper-50 shadow-md"
                style={{ background: subj.color }}
              >
                ✓ Done — test me now
              </button>
            </div>

            <AnimatePresence>
              {breakNudge && !showBreak && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
                  className="fixed bottom-6 left-1/2 z-40 w-[min(92vw,480px)] -translate-x-1/2 rounded-2xl border border-marigold-400 bg-marigold-50 p-4 shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🤸</span>
                    <div className="flex-1 text-left">
                      <p className="font-display text-sm font-black text-ink-900">Hour {lastBreakAt.current} done — quick break!</p>
                      <p className="mt-0.5 text-sm text-ink-700">{breakNudge}</p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => { setRunning(false); setShowBreak(true); }} className="rounded-full bg-flame-500 px-3 py-1 text-xs font-black text-paper-50">Take 5-min break</button>
                        <button onClick={() => { setBreakNudge(null); setRunning(true); }} className="rounded-full border border-ink-300 px-3 py-1 text-xs font-black text-ink-700">Push on</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {showBreak && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4" onClick={() => setShowBreak(false)}>
                  <div className="w-[min(92vw,420px)] rounded-3xl bg-paper-50 p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <p className="text-4xl">🧘‍♂️</p>
                    <h3 className="mt-2 font-display text-xl font-black text-ink-900">Break time</h3>
                    <p className="mt-1 text-sm text-ink-700">{breakNudge}</p>
                    <p className="mt-3 text-xs text-ink-500">Your timer is paused. Stretch, hydrate, look far away — then jump back in.</p>
                    <button onClick={() => { setShowBreak(false); setRunning(true); }} className="mt-4 w-full rounded-full py-2.5 font-display text-sm font-black text-paper-50" style={{ background: subj.color }}>
                      Back to focus ▶
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ---------------- MCQ ---------------- */}
        {phase === "mcq" && (
          <motion.div key="mcq" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            {generating ? (
              <div className="py-20 text-center">
                <WheelLike color={subj.color} />
                <p className="mt-4 font-display text-sm font-black text-ink-700">{GEN_STEPS[Math.min(genStep, GEN_STEPS.length - 1)]}</p>
                <p className="mt-1 text-xs text-ink-500">Crafting 20 unique MCQs for {SUBJECTS[subject].name} · {scopeLabel}</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-300 p-10 text-center text-sm text-ink-600">
                No question bank found for this combo yet — try another subject.
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-display text-xs font-black uppercase tracking-widest text-ink-500">MCQ {qIndex + 1} / {questions.length}</p>
                  <p className="font-display text-xs font-black text-ink-700">Score: {score}</p>
                </div>
                <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full transition-all" style={{ width: `${((qIndex + 1) / questions.length) * 100}%`, background: subj.color }} />
                </div>
                <motion.div key={qIndex} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-ink-200 bg-paper-50 p-6 shadow-sm">
                  <p className="font-display text-lg font-black leading-snug text-ink-900">{questions[qIndex].q}</p>
                  <div className="mt-4 grid gap-2">
                    {questions[qIndex].opts.map((o, i) => {
                      const correct = i === questions[qIndex].a;
                      const chosen = picked === i;
                      let cls = "border-ink-200 bg-paper-100 text-ink-800 hover:border-ink-400";
                      if (picked !== null) {
                        if (correct) cls = "border-teal-500 bg-teal-50 text-teal-900";
                        else if (chosen) cls = "border-flame-500 bg-flame-50 text-flame-700";
                        else cls = "border-ink-100 text-ink-400";
                      }
                      return (
                        <button key={i} onClick={() => pick(i)} disabled={picked !== null} className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all ${cls}`}>
                          {String.fromCharCode(65 + i)}. {o}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {picked !== null && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 text-xs text-ink-600">
                        💡 {questions[qIndex].why}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* ---------------- ESSAY + AI MARKING ---------------- */}
        {phase === "essay" && (
          <motion.div key="essay" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xs font-black uppercase tracking-widest text-ink-500">Written answer {eIndex + 1} / {essays.length} · 5 marks</p>
              <p className="font-display text-xs font-black text-ink-700">Marks so far: {essayMarks}/{results.length * 5}</p>
            </div>

            <div className="rounded-3xl border border-ink-200 bg-paper-50 p-6 shadow-sm">
              <p className="font-display text-lg font-black leading-snug text-ink-900">{essays[eIndex]?.q}</p>
              <p className="mt-1 text-xs text-ink-500">Write 4–6 lines below, or snap a photo of your notebook page — the AI checks it against CBSE key points.</p>

              <textarea
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={5}
                placeholder="Type your answer here… (or attach a photo below)"
                className="mt-4 w-full resize-y rounded-xl border border-ink-200 bg-paper-100 p-3 text-sm text-ink-900 outline-none focus:border-ink-500"
              />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-full border-2 border-dashed border-ink-300 px-4 py-2 text-xs font-black text-ink-700 hover:border-ink-500">
                  <Icon name="camera" size={15} /> 📷 Attach photo of answer
                </button>
                {photoUrl && (
                  <div className="flex items-center gap-2">
                    <img src={photoUrl} alt="your answer" className="h-12 w-12 rounded-lg border border-ink-200 object-cover" />
                    <button onClick={clearPhoto} className="text-xs font-bold text-flame-500 underline">remove</button>
                  </div>
                )}
                <button
                  onClick={submitEssay}
                  disabled={grading || (!answerText.trim() && !photo)}
                  className="ml-auto rounded-full px-6 py-2.5 font-display text-sm font-black text-paper-50 shadow-md disabled:opacity-40"
                  style={{ background: subj.color }}
                >
                  {grading ? "AI scanning…" : "Submit for AI marking ✨"}
                </button>
              </div>

              <AnimatePresence>
                {results.length > eIndex && (() => {
                  const r = results[eIndex];
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 rounded-2xl border-2 p-4"
                      style={{
                        borderColor: r.verdict === "correct" ? "var(--color-teal-500)" : r.verdict === "partial" ? "var(--color-marigold-500)" : "var(--color-flame-500)",
                        background: r.verdict === "correct" ? "rgba(14,138,123,0.08)" : r.verdict === "partial" ? "rgba(247,165,29,0.10)" : "rgba(228,87,46,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-display text-sm font-black" style={{ color: r.verdict === "correct" ? "var(--color-teal-600)" : r.verdict === "partial" ? "var(--color-marigold-600)" : "var(--color-flame-600)" }}>
                          {r.verdict === "correct" ? "✅ Correct" : r.verdict === "partial" ? "◐ Partially correct" : r.verdict === "incorrect" ? "✗ Needs work" : "👻 Unreadable"}
                        </p>
                        <p className="font-display text-lg font-black text-ink-900">{r.marks}/5</p>
                      </div>
                      <p className="mt-1 text-xs text-ink-700">{r.feedback}{!r.ocrUsed && photo ? " (Photo OCR unavailable offline — typed text was graded.)" : ""}</p>
                      <p className="mt-2 text-xs text-ink-600"><b>Model answer:</b> {essays[eIndex]?.why}</p>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---------------- DONE ---------------- */}
        {phase === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
            <p className="text-5xl">🏆</p>
            <h2 className="mt-3 font-display text-3xl font-black text-ink-900">Session complete!</h2>
            <p className="mt-1 text-sm text-ink-600">{SUBJECTS[subject].name} · {scopeLabel}</p>
            <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-ink-200 bg-paper-50 p-4">
                <p className="font-display text-2xl font-black" style={{ color: subj.color }}>{score}/{questions.length}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">MCQs</p>
              </div>
              <div className="rounded-2xl border border-ink-200 bg-paper-50 p-4">
                <p className="font-display text-2xl font-black" style={{ color: subj.color }}>{essayMarks}/{essays.length * 5}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Written (AI-marked)</p>
              </div>
            </div>
            <button
              onClick={() => { setPhase("setup"); setQuestions([]); setEssays([]); }}
              className="mt-8 rounded-full px-8 py-3 font-display text-sm font-black text-paper-50 shadow-lg"
              style={{ background: subj.color }}
            >
              Start another session ↺
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** small spinning wheel using existing palette */
function WheelLike({ color }: { color: string }) {
  return (
    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-ink-100" style={{ borderTopColor: color }} />
  );
}
