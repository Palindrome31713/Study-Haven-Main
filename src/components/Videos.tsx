import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SUBJECTS, type Profile, type SubjectId } from "../data/curriculum";
import { VIDEOS, ytEmbed, ytSearchUrl, ytThumb, ytWatch, type Video } from "../data/videos";
import { Icon, Reveal } from "./kit";

export default function Videos({ profile }: { profile: Profile }) {
  const [filter, setFilter] = useState<SubjectId | "all">("all");
  const [active, setActive] = useState<Video | null>(null);
  const [query, setQuery] = useState("");

  const filters = useMemo(() => {
    const ids = new Set<SubjectId>(VIDEOS.map((v) => v.subject));
    const mine = profile.subjects.filter((s) => ids.has(s));
    const others = [...ids].filter((s) => !mine.includes(s));
    return [...mine, ...others];
  }, [profile.subjects]);

  const list = VIDEOS.filter((v) => filter === "all" || v.subject === filter);

  return (
    <div className="space-y-8 pb-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">The video classroom</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-ink-900 md:text-5xl">Watch. Learn. Repeat.</h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-600">
              Curated one-shot lessons straight from YouTube, played in a clean embedded player — no feed, no rabbit holes.
              Every video stays linked to its YouTube home.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="flex flex-wrap gap-2">
        <FilterChip on={filter === "all"} onClick={() => setFilter("all")} label="All lessons" color="#111631" />
        {filters.map((id) => (
          <FilterChip
            key={id}
            on={filter === id}
            onClick={() => setFilter(id)}
            label={SUBJECTS[id].name}
            color={SUBJECTS[id].color}
            icon={SUBJECTS[id].icon}
            mine={profile.subjects.includes(id)}
          />
        ))}
      </div>

      {/* search-the-tube card */}
      <Reveal>
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-ink-900 bg-cobalt-500 p-5 text-white sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold">Can't find your chapter? Search the whole of YouTube.</h3>
            <p className="text-sm text-white/75">Type any topic — Study Haven builds a focused CBSE search for Class {profile.grade}.</p>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) window.open(ytSearchUrl(`CBSE class ${profile.grade} ${query.trim()} one shot`), "_blank", "noopener");
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. carbon compounds"
              className="w-52 rounded-xl border-2 border-white/25 bg-ink-950/25 px-4 py-3 text-sm font-semibold text-white placeholder:text-white/45 focus:border-marigold-400"
            />
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-marigold-400 px-5 py-3 text-sm font-bold text-ink-950 transition hover:bg-marigold-300">
              <Icon name="search" size={16} /> Search
            </button>
          </form>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((v, i) => (
          <Reveal key={v.yt + i} delay={(i % 3) * 0.07}>
            <button onClick={() => setActive(v)} className="group block h-full w-full overflow-hidden rounded-2xl border-2 border-ink-900 bg-paper-50 text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
              <div className="relative aspect-video overflow-hidden bg-ink-900">
                <img src={ytThumb(v.yt)} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink-950/85 px-2 py-0.5 text-[11px] font-bold text-paper-50">{v.minutes}</span>
                <span
                  className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: SUBJECTS[v.subject].color }}
                >
                  {SUBJECTS[v.subject].name}
                </span>
                <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-flame-500 text-white opacity-90 shadow-lift transition-all duration-300 group-hover:scale-110 group-hover:bg-flame-400">
                  <Icon name="play" size={22} className="ml-0.5" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-900">{v.title}</h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-600">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-ink-900/25 font-display text-[10px]">{v.grade}</span>
                  {v.source}
                </p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* ------- player modal ------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink-950/80 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-paper-50/20 bg-ink-900 shadow-lift"
            >
              <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-paper-50">{active.title}</p>
                  <p className="text-xs text-paper-50/50">Class {active.grade} · {SUBJECTS[active.subject].name} · {active.chapter}</p>
                </div>
                <a
                  href={ytWatch(active.yt)} target="_blank" rel="noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-paper-50/25 px-3.5 py-1.5 text-xs font-bold text-paper-50 transition hover:border-marigold-400 hover:text-marigold-300"
                >
                  Watch on YouTube <Icon name="arrow" size={13} />
                </a>
                <button onClick={() => setActive(null)} className="shrink-0 rounded-full bg-paper-50/10 p-2 text-paper-50 transition hover:bg-flame-500" aria-label="Close player">
                  <Icon name="close" size={15} />
                </button>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  key={active.yt}
                  src={ytEmbed(active.yt)}
                  title={active.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ on, onClick, label, color, icon, mine }: { on: boolean; onClick: () => void; label: string; color: string; icon?: string; mine?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${on ? "-translate-y-0.5 text-white" : "border-ink-900/15 bg-paper-50 text-ink-600 hover:border-ink-900 hover:text-ink-900"}`}
      style={on ? { background: color, borderColor: color } : undefined}
    >
      {icon && <Icon name={icon} size={14} />}
      {label}
      {mine && !on && <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />}
    </button>
  );
}
