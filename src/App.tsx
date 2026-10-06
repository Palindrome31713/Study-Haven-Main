import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CBSE_URL, DIKSHA_URL, NCERT_LIBRARY_URL, STREAMS, type Profile, type SubjectId } from "./data/curriculum";
import Onboarding from "./components/Onboarding";
import Home from "./components/Home";
import Library from "./components/Library";
import Videos from "./components/Videos";
import Quizzes, { type QuizSeed } from "./components/Quizzes";
import StudyTimer from "./components/StudyTimer";
import News from "./components/News";
import SamplePapers from "./components/SamplePapers";
import Chatbot from "./components/Chatbot";
import Background3D from "./components/Background3D";
import { Icon, Wheel } from "./components/kit";
import {
  bumpVisit, clearProfile, loadProfile, loadStats, saveProfile,
  loadTheme, saveTheme, type Theme,
  type Stats, type Tab,
} from "./lib/store";

const TABS: Array<{ id: Tab; label: string; icon: string }> = [
  { id: "home", label: "My Desk", icon: "book" },
  { id: "library", label: "Library", icon: "doc" },
  { id: "videos", label: "Videos", icon: "play" },
  { id: "quiz", label: "Quizzes", icon: "calc" },
  { id: "timer", label: "Study Timer", icon: "clock" },
  { id: "news", label: "News", icon: "news" },
  { id: "papers", label: "Sample Papers", icon: "paperclip" },
];

export default function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [tab, setTab] = useState<Tab>("home");
  const [quizSeed, setQuizSeed] = useState<QuizSeed | null>(null);
  const [theme, setTheme] = useState<Theme>(() => loadTheme());

  // keep <html> class + colour-scheme in sync with the chosen theme
  useEffect(() => {
    saveTheme(theme);
    window.dispatchEvent(new Event("studyhaven:theme"));
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
    <div className="theme-anim paper-bg relative min-h-screen overflow-x-clip">
      {/* interactive Three.js cursor-responsive background layer */}
      <Background3D />

      {/* ambient floating stationery */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Icon name="sigma" size={54} className="anim-floaty absolute left-[3%] top-[220px] text-cobalt-500/12 dark:text-cobalt-400/20" />
        <Icon name="flask" size={46} className="anim-floaty absolute right-[4%] top-[340px] text-teal-500/15 dark:text-teal-400/25" style={{ ["--tilt" as string]: "12deg", animationDelay: "1.2s" }} />
        <Icon name="plane" size={50} className="anim-floaty absolute left-[6%] top-[900px] text-flame-500/12 dark:text-flame-400/20" style={{ ["--tilt" as string]: "-10deg", animationDelay: "2s" }} />
        <Icon name="atom" size={60} className="anim-floaty absolute right-[5%] top-[1150px] text-plum-500/12 dark:text-plum-400/20" style={{ ["--tilt" as string]: "6deg", animationDelay: "0.6s" }} />
      </div>

      {/* ---------- CRAZY NAVBAR: single-line sticker-dock with a rainbow runner ---------- */}
      <header className="sticky top-0 z-30">
        {/* rainbow energy rail riding along the top edge */}
        <div className="h-[3px] w-full bg-[linear-gradient(90deg,#ff5d3a,#ffb020,#2ec4b6,#3a6df0,#a06cd5,#ff5d3a)] bg-[length:200%_100%] anim-rail" aria-hidden />

        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-5 md:px-10">
          {/* floating candy dock — one line, everything inside */}
          <div className="anim-dock relative flex w-full items-center gap-2 rounded-[26px] border border-white/70 bg-white/55 p-2 shadow-[0_18px_40px_-18px_rgba(26,26,46,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-colors duration-300 dark:border-paper-50/15 dark:bg-ink-900/55 dark:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {/* brand sticker */}
            <button
              onClick={() => goTo("home")}
              className="group relative flex shrink-0 items-center gap-2 rounded-2xl px-2 py-1.5"
              aria-label="Study Haven home"
            >
              <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-[conic-gradient(from_120deg,#ff5d3a,#ffb020,#2ec4b6,#3a6df0,#ff5d3a)] text-white shadow-[0_6px_16px_-6px_rgba(255,93,58,0.7)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <span className="grid h-[26px] w-[26px] place-items-center rounded-[9px] bg-white text-flame-500 dark:bg-ink-900 dark:text-marigold-400">
                  <Wheel size={17} className="anim-spin-slow" />
                </span>
              </span>
              <span className="brand-jiggle hidden whitespace-nowrap font-display text-[15px] font-extrabold leading-none sm:block">
                {"STUDY HAVEN".split("").map((ch, i) => (
                  <span
                    key={i}
                    className="inline-block bg-[linear-gradient(120deg,#ff5d3a,#ffb020,#2ec4b6,#3a6df0,#a06cd5,#ff5d3a)] bg-[length:300%_100%] bg-clip-text text-transparent anim-brandflow"
                    style={{ animationDelay: `${i * 0.12}s`, transform: `rotate(${(i % 3) - 1}deg)` }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </span>
            </button>

            {/* tabs — playful sticker pills that pop & tilt */}
            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((t, i) => {
                const active = tab === t.id;
                const accents = ["#ff5d3a", "#ffb020", "#2ec4b6", "#3a6df0", "#a06cd5", "#e5533d", "#1f9e8e"];
                const c = accents[i % accents.length];
                return (
                  <button
                    key={t.id}
                    onClick={() => goTo(t.id)}
                    className={`sticker-btn group relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold tracking-wide transition-all duration-300 lg:px-3.5 ${
                      active
                        ? "text-white shadow-[0_10px_22px_-10px_rgba(26,26,46,0.6)] dark:text-ink-900"
                        : "text-ink-900/80 hover:text-ink-900 dark:text-paper-50/80 dark:hover:text-paper-50"
                    }`}
                    style={active ? { background: theme === "dark" ? "#ffc247" : c, transform: "translateY(-2px) scale(1.04)" } : undefined}
                  >
                    {!active && (
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ background: `${c}1f`, boxShadow: `inset 0 0 0 1.5px ${c}55` }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon name={t.icon} size={14} className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                      <span className="hidden md:inline">{t.label}</span>
                    </span>
                    {active && (
                      <motion.span
                        layoutId="tab-spark"
                        className="absolute -right-1 -top-1 z-20 grid h-4 w-4 place-items-center rounded-full bg-white text-[9px] shadow"
                        transition={{ type: "spring", damping: 18, stiffness: 320 }}
                      >
                        ✦
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* identity cluster — everything on one line */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-ink-900/20 text-black transition-all duration-300 hover:rotate-12 hover:border-black dark:border-paper-50/20 dark:text-white dark:hover:border-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ y: 14, opacity: 0, rotate: -60 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -14, opacity: 0, rotate: 60 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <Icon name={theme === "dark" ? "sun" : "moon"} size={15} className={theme === "dark" ? "text-marigold-500" : ""} />
                </motion.span>
              </AnimatePresence>
            </button>
            <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-ink-900/20 px-2.5 py-1 text-[10px] font-extrabold text-black xl:flex dark:border-paper-50/20 dark:text-white">
              <Icon name="cap" size={12} className="text-flame-500" />
              Class {profile.grade}{streamName ? ` · ${streamName}` : ""}
            </span>
            <button
              onClick={resetProfile}
              title="Change my details"
              aria-label="Change my details"
              className="relative grid h-8 w-8 place-items-center rounded-full bg-marigold-400 font-display text-sm font-extrabold text-ink-900 ring-2 ring-ink-900/80 transition-transform duration-300 hover:-translate-y-0.5 dark:ring-paper-50/70"
            >
              <span className="transition-opacity duration-200 group-hover:opacity-0">{profile.name.charAt(0).toUpperCase()}</span>
              <Icon name="edit" size={13} className="absolute opacity-0 transition-opacity duration-200 hover:opacity-100" />
            </button>
          </div>
          </div>{/* /candy dock */}
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
            {tab === "timer" && <StudyTimer profile={profile} onStatsChanged={() => setStats(loadStats())} />}
            {tab === "news" && <News profile={profile} />}
            {tab === "papers" && <SamplePapers profile={profile} />}
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
