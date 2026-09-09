import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STREAMS, SUBJECTS, chaptersOf, type Profile, type SubjectId } from "../data/curriculum";
import { QUOTES, randomQuote } from "../data/quotes";
import { greeting, loadMission, saveMission, type Stats, type Tab } from "../lib/store";
import { Icon, Marquee, Reveal, useCountUp, Wheel } from "./kit";

const MISSIONS = [
  { label: "Read one NCERT chapter", icon: "book", tab: "library" as Tab },
  { label: "Watch one video lesson", icon: "play", tab: "videos" as Tab },
  { label: "Finish a 6-question quiz", icon: "calc", tab: "quiz" as Tab },
];

export default function Home({ profile, stats, goTo, startQuiz }: {
  profile: Profile;
  stats: Stats;
  goTo: (t: Tab) => void;
  startQuiz: (s: SubjectId, chapter?: string) => void;
}) {
  const [{ quote, index }, setQuote] = useState(() => randomQuote());
  const [shuffleKey, setShuffleKey] = useState(0);
  const [mission, setMission] = useState<boolean[]>(() => loadMission());

  const subjects = profile.subjects;
  const dateLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  const totalChapters = useMemo(
    () => subjects.reduce((n, id) => n + chaptersOf(id, profile.grade).length, 0),
    [subjects, profile.grade]
  );

  const shuffle = () => {
    setQuote(randomQuote(index));
    setShuffleKey((k) => k + 1);
  };

  const toggleMission = (i: number) => {
    const next = mission.map((m, j) => (j === i ? !m : m));
    setMission(next);
    saveMission(next);
  };

  const words = quote.text.split(" ");
  const bestAvg = Object.values(stats.best);
  const avgBest = bestAvg.length ? Math.round(bestAvg.reduce((a, b) => a + (b ?? 0), 0) / bestAvg.length) : 0;

  return (
    <div className="space-y-14 pb-10">
      {/* ------- desk header ------- */}
      <section className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Reveal>
            <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-ink-600">
              <span className="h-px w-10 bg-flame-500" /> Study desk · {dateLabel}
            </p>
            <h1 className="font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-ink-900 sm:text-6xl xl:text-7xl">
              {greeting()},<br />
              <span className="relative inline-block text-flame-500">
                {profile.name}.
                <svg viewBox="0 0 220 12" className="absolute -bottom-2 left-0 w-full text-marigold-500" preserveAspectRatio="none">
                  <path d="M3 9c40-6 120-8 214-3" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-600">
              Class <b className="text-ink-900">{profile.grade}</b>
              {profile.stream ? ` · ${STREAMS.find((s) => s.id === profile.stream)?.name ?? ""}` : ""} · {subjects.length} subjects · {totalChapters} chapters on your shelf.
              The syllabus hasn't shrunk — but your study haven has arrived.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Reveal delay={0.08}>
            <div className="group relative overflow-hidden rounded-2xl border-2 border-ink-900 bg-marigold-400 p-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="relative">
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-flame-500">
                  <span className="absolute inset-0 rounded-full bg-flame-500 [animation:pulse-ring_2.2s_ease-out_infinite]" />
                </span>
                <div className="flex items-center gap-2 text-ink-900/70">
                  <Icon name="flame" size={17} className="text-flame-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]">Streak</span>
                </div>
                <div className="mt-1 font-display text-4xl font-extrabold text-ink-900">
                  {stats.streak} <span className="text-base font-bold">day{stats.streak === 1 ? "" : "s"}</span>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="rounded-2xl border-2 border-ink-900 bg-paper-50 p-5 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2 text-ink-600">
                <Icon name="trophy" size={17} className="text-teal-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em]">Best avg</span>
              </div>
              <div className="mt-1 font-display text-4xl font-extrabold text-ink-900">{avgBest || "–"}%</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------- quote of the moment ------- */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border-2 border-ink-900 bg-ink-900 p-8 text-paper-50 shadow-lift md:p-12">
          <div className="dotted absolute inset-0 opacity-20" />
          <div className="absolute -right-10 -top-10 text-marigold-500/25"><Wheel size={210} className="anim-spin-slow" /></div>
          <span className="absolute left-8 top-0 h-8 w-24 -translate-y-2 rotate-2 bg-marigold-400/90" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-marigold-300">Fuel for today · changes every reload</p>
              <button
                onClick={shuffle}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-paper-50/20 px-4 py-2 text-xs font-semibold text-paper-50/80 transition-all duration-300 hover:border-marigold-400 hover:text-marigold-300"
              >
                <Icon name="refresh" size={14} className="transition-transform duration-500 group-hover:rotate-180" />
                Another one
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={shuffleKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-7 max-w-4xl font-display text-2xl font-bold leading-snug md:text-[2.1rem] md:leading-[1.25]"
              >
                <span className="mr-2 text-marigold-400">“</span>
                {words.map((w, i) => (
                  <span key={`${shuffleKey}-${i}`} className="line-mask mr-[0.28em] inline-block align-bottom">
                    <motion.span
                      initial={{ y: "112%" }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.08 + i * 0.03, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
                <span className="ml-1 text-marigold-400">”</span>
              </motion.blockquote>
            </AnimatePresence>
            <p className="mt-6 text-sm font-semibold text-paper-50/60">— {quote.author} <span className="ml-2 text-paper-50/30">· {index + 1}/{QUOTES.length} in the tank</span></p>
          </div>
        </section>
      </Reveal>

      {/* ------- ticker ------- */}
      <Reveal y={14}>
        <div className="border-y-2 border-ink-900 py-3.5">
          <Marquee
            className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-900"
            items={subjects.map((id) => `${SUBJECTS[id].name} ${SUBJECTS[id].hindi}`)}
          />
        </div>
      </Reveal>

      {/* ------- your shelf ------- */}
      <section>
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">Unlocked by your pass</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-ink-900 md:text-4xl">Your shelf, {profile.name}.</h2>
          </div>
          <button onClick={() => goTo("library")} className="group flex items-center gap-2 rounded-full border-2 border-ink-900 px-5 py-2.5 text-sm font-bold text-ink-900 transition-all duration-300 hover:bg-ink-900 hover:text-paper-50">
            Open library <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((id, i) => {
            const s = SUBJECTS[id];
            const ch = chaptersOf(id, profile.grade);
            const big = i === 0;
            return (
              <Reveal key={id} delay={i * 0.06} className={big ? "sm:col-span-2 xl:col-span-2" : ""}>
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border-2 border-ink-900 bg-paper-50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift ${big ? "md:p-8" : ""}`}
                >
                  <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: s.color }} />
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: s.color }}>
                      <Icon name={s.icon} size={24} />
                    </span>
                    <span className="rounded-full border border-ink-900/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-600">
                      {ch.length} chapters
                    </span>
                  </div>
                  <h3 className={`mt-4 font-display font-extrabold text-ink-900 ${big ? "text-3xl" : "text-xl"}`}>{s.name}</h3>
                  <p className="text-sm text-ink-600">{s.hindi} · Class {profile.grade}{big && ch.length > 0 ? ` · starts with “${ch[0]}”` : ""}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button onClick={() => goTo("library")} className="rounded-lg border-2 border-ink-900 px-3.5 py-2 text-xs font-bold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-paper-50">
                      Read
                    </button>
                    <button onClick={() => goTo("videos")} className="rounded-lg border-2 border-ink-900 px-3.5 py-2 text-xs font-bold text-ink-900 transition-colors duration-200 hover:bg-ink-900 hover:text-paper-50">
                      Watch
                    </button>
                    <button
                      onClick={() => startQuiz(id)}
                      className="rounded-lg px-3.5 py-2 text-xs font-bold text-white transition-all duration-200 hover:brightness-110"
                      style={{ background: s.color }}
                    >
                      Quiz me →
                    </button>
                  </div>
                  {stats.best[id] !== undefined && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-teal-600">
                      <Icon name="trophy" size={14} /> Personal best: {stats.best[id]}%
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ------- mission + continue ------- */}
      <section className="grid gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="h-full rounded-2xl border-2 border-ink-900 bg-paper-100 p-6 md:p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-extrabold text-ink-900">Today's mission</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${mission.every(Boolean) ? "bg-teal-500 text-white" : "bg-ink-900 text-paper-50"}`}>
                {mission.filter(Boolean).length}/3 done
              </span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {MISSIONS.map((m, i) => (
                <li key={m.label}>
                  <button
                    onClick={() => { toggleMission(i); if (!mission[i]) goTo(m.tab); }}
                    className={`flex w-full items-center gap-3.5 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-300 ${mission[i] ? "border-teal-500/50 bg-teal-500/10" : "border-ink-900/15 bg-paper-50 hover:-translate-y-0.5 hover:border-ink-900"}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors ${mission[i] ? "border-teal-500 bg-teal-500 text-white" : "border-ink-900/30 text-transparent"}`}>
                      <Icon name="check" size={14} sw={2.6} />
                    </span>
                    <span className={`text-sm font-semibold ${mission[i] ? "text-ink-600 line-through decoration-teal-500/60" : "text-ink-900"}`}>{m.label}</span>
                    <Icon name={m.icon} size={17} className="ml-auto text-ink-400" />
                  </button>
                </li>
              ))}
            </ul>
            {mission.every(Boolean) && (
              <p className="anim-pop mt-4 flex items-center gap-2 text-sm font-bold text-teal-600">
                <Icon name="spark" size={16} /> Mission complete! Aaj ka din, aapke naam.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-ink-900 bg-flame-500 p-6 text-white md:p-7">
            <Icon name="plane" size={120} className="absolute -bottom-6 -right-6 text-white/15" />
            <div>
              <h3 className="font-display text-xl font-extrabold">Pick up where you left off</h3>
              {stats.lastQuiz ? (
                <div className="mt-4 rounded-xl bg-ink-950/25 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Last quiz</p>
                  <p className="mt-1 font-display text-lg font-bold">{SUBJECTS[stats.lastQuiz.subject].name}</p>
                  <p className="text-sm text-white/80">{stats.lastQuiz.chapter}</p>
                  <p className="mt-2 font-display text-2xl font-extrabold">{stats.lastQuiz.score}/{stats.lastQuiz.total} <span className="text-sm font-bold text-white/70">correct</span></p>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-white/85">
                  No quiz yet — that's the only empty page in your story. Six fresh AI-mixed questions take under four minutes.
                </p>
              )}
            </div>
            <button
              onClick={() => (stats.lastQuiz ? startQuiz(stats.lastQuiz.subject, stats.lastQuiz.chapter) : startQuiz(profile.subjects[0]))}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-5 py-3.5 text-sm font-bold text-paper-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink-900"
            >
              {stats.lastQuiz ? "Fresh questions, same chapter" : "Start my first quiz"}
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </Reveal>
      </section>

      {/* ------- numbers band ------- */}
      <Reveal>
        <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border-2 border-ink-900 bg-ink-900 md:grid-cols-4">
          {[
            { label: "Quizzes taken", value: stats.quizzesTaken, icon: "calc" },
            { label: "Questions solved", value: stats.questionsSolved, icon: "check" },
            { label: "Subjects on shelf", value: subjects.length, icon: "book" },
            { label: "Chapters available", value: totalChapters, icon: "doc" },
          ].map((s) => (
            <StatCell key={s.label} label={s.label} value={s.value} icon={s.icon} />
          ))}
        </section>
      </Reveal>
    </div>
  );
}

function StatCell({ label, value, icon }: { label: string; value: number; icon: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div ref={ref} className="group bg-paper-50 p-6 transition-colors duration-300 hover:bg-marigold-300/40">
      <Icon name={icon} size={20} className="text-flame-500 transition-transform duration-300 group-hover:-translate-y-1" />
      <div className="mt-2 font-display text-4xl font-extrabold text-ink-900">{v}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ink-600">{label}</div>
    </div>
  );
}
