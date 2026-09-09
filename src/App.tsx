import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CBSE_URL, DIKSHA_URL, NCERT_LIBRARY_URL, STREAMS, type Profile, type SubjectId } from "./data/curriculum";
import Onboarding from "./components/Onboarding";
import Home from "./components/Home";
import Library from "./components/Library";
import Videos from "./components/Videos";
import Quizzes, { type QuizSeed } from "./components/Quizzes";
import Chatbot from "./components/Chatbot";
import { Icon, Wheel } from "./components/kit";
import {
  bumpVisit, clearProfile, loadProfile, loadStats, saveProfile,
  type Stats, type Tab,
} from "./lib/store";

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "home", label: "My Desk", icon: "book" },
  { id: "library", label: "Library", icon: "doc" },
  { id: "videos", label: "Videos", icon: "play" },
  { id: "quiz", label: "Quizzes", icon: "calc" },
];

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [tab, setTab] = useState<Tab>("home");
  const [quizSeed, setQuizSeed] = useState<QuizSeed | null>(null);

  // returning visitors: count the visit (streak) exactly once per day
  useEffect(() => {
    if (profile) setStats(bumpVisit());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!profile) {
    return (
      <>
        <Onboarding
          onDone={(p) => {
            saveProfile(p);
            setProfile(p);
            setStats(bumpVisit());
          }}
        />
        <div className="noise" />
      </>
    );
  }

  const goTo = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startQuiz = (subject: SubjectId, chapter?: string) => {
    setQuizSeed({ subject, chapter, nonce: Date.now() });
    goTo("quiz");
  };

  const resetProfile = () => {
    clearProfile();
    setProfile(null);
    setTab("home");
    setQuizSeed(null);
  };

  const streamName = profile.stream ? STREAMS.find((s) => s.id === profile.stream)?.name : null;

  return (
    <div className="paper-bg relative min-h-screen overflow-x-clip">
      {/* ambient floating stationery */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Icon name="sigma" size={54} className="anim-floaty absolute left-[3%] top-[220px] text-cobalt-500/12" />
        <Icon name="flask" size={46} className="anim-floaty absolute right-[4%] top-[340px] text-teal-500/15" style={{ ["--tilt" as string]: "12deg", animationDelay: "1.2s" }} />
        <Icon name="plane" size={50} className="anim-floaty absolute left-[6%] top-[900px] text-flame-500/12" style={{ ["--tilt" as string]: "-10deg", animationDelay: "2s" }} />
        <Icon name="atom" size={60} className="anim-floaty absolute right-[5%] top-[1150px] text-plum-500/12" style={{ ["--tilt" as string]: "6deg", animationDelay: "0.6s" }} />
      </div>

      {/* ---------- header ---------- */}
      <header className="sticky top-0 z-30 border-b-2 border-ink-900 bg-paper-50/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3.5 md:px-10">
          <button onClick={() => goTo("home")} className="group flex items-center gap-2.5" aria-label="Study Haven home">
            <span className="text-flame-500 transition-transform duration-700 group-hover:rotate-90"><Wheel size={30} /></span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-extrabold tracking-[0.08em] text-ink-900">STUDY HAVEN</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-ink-600">सीबीएसई · क्लास 9–12</span>
            </span>
          </button>

          {/* tabs */}
          <nav className="ml-auto flex items-center gap-1 rounded-full border-2 border-ink-900/10 bg-paper-100 p-1 sm:ml-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => goTo(t.id)}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors duration-300 sm:px-4 sm:text-[13px] ${tab === t.id ? "text-paper-50" : "text-ink-600 hover:text-ink-900"}`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-ink-900"
                    transition={{ type: "spring", damping: 26, stiffness: 380 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon name={t.icon} size={14} />
                  <span className="hidden md:inline">{t.label}</span>
                </span>
              </button>
            ))}
          </nav>

          {/* identity */}
          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink-900 px-3 py-1.5 text-[11px] font-extrabold text-ink-900 lg:flex">
              <Icon name="cap" size={13} className="text-flame-500" />
              Class {profile.grade}{streamName ? ` · ${streamName}` : ""}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-marigold-400 font-display text-base font-extrabold text-ink-900 ring-2 ring-ink-900">
              {profile.name.charAt(0).toUpperCase()}
            </span>
            <button
              onClick={resetProfile}
              title="Change my details"
              aria-label="Change my details"
              className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-900/15 text-ink-600 transition-all duration-300 hover:rotate-12 hover:border-ink-900 hover:text-ink-900"
            >
              <Icon name="edit" size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ---------- content ---------- */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 pt-10 md:px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "home" && <Home profile={profile} stats={stats} goTo={goTo} startQuiz={startQuiz} />}
            {tab === "library" && <Library profile={profile} startQuiz={startQuiz} />}
            {tab === "videos" && <Videos profile={profile} />}
            {tab === "quiz" && <Quizzes profile={profile} seed={quizSeed} onStatsChanged={() => setStats(loadStats())} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ---------- footer ---------- */}
      <footer className="relative z-10 mt-16 border-t-2 border-ink-900 bg-ink-900 text-paper-50">
        <div className="dotted absolute inset-0 opacity-15" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-marigold-400"><Wheel size={34} /></span>
                <div>
                  <p className="font-display text-2xl font-extrabold tracking-wide">STUDY HAVEN</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-paper-50/45">स्टडी हेवन · your CBSE study haven</p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper-50/60">
                A personal study studio for CBSE Class 9–12: your NCERT shelf, a clean video classroom,
                quizzes that regenerate on demand, and an AI buddy that only speaks syllabus.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-marigold-500/35 bg-marigold-500/10 px-4 py-2 text-xs font-semibold text-marigold-300">
                <Icon name="flame" size={14} /> Made for the 2 a.m. revision squad.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper-50/40">Official resources</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  ["NCERT e-Textbooks", NCERT_LIBRARY_URL],
                  ["CBSE | cbse.gov.in", CBSE_URL],
                  ["DIKSHA Learning", DIKSHA_URL],
                ].map(([label, url]) => (
                  <li key={label}>
                    <a href={url} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-paper-50/70 transition hover:text-marigold-300">
                      {label}
                      <Icon name="arrow" size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-paper-50/40">Your desk</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {TABS.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => goTo(t.id)} className="group flex items-center gap-2 text-paper-50/70 transition hover:text-marigold-300">
                      <Icon name={t.icon} size={14} /> {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-paper-50/10 pt-6 text-xs text-paper-50/40">
            <span>© {new Date().getFullYear()} Study Haven Studio · Not affiliated with CBSE/NCERT — a student-made study companion.</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Profile saved on this device
            </span>
          </div>
        </div>
      </footer>

      <Chatbot profile={profile} />
      <div className="noise" />
    </div>
  );
}
