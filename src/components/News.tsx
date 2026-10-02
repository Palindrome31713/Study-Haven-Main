import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Profile } from "../data/curriculum";
import { CBSE_URL } from "../data/curriculum";
import {
  CATEGORY_META,
  fetchCbseNews,
  timeAgo,
  type NewsCategory,
  type NewsItem,
} from "../data/news";
import { Icon, Reveal } from "./kit";

const SEEN_KEY = "studyhaven.news.seen.v1";
const REFRESH_MS = 5 * 60 * 1000; // auto-refresh every 5 minutes while the tab is open

function loadSeen(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveSeen(ids: string[]) {
  localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
}

export default function News({ profile }: { profile: Profile }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [live, setLive] = useState<boolean | null>(null); // null = loading
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState<NewsCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [seen, setSeen] = useState<string[]>(loadSeen);
  const firstLoad = useRef(true);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else if (!firstLoad.current) setRefreshing(true);
      setError(false);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      try {
        const res = await fetchCbseNews(ctrl.signal);
        setItems(res.items);
        setLive(res.live);
        setUpdatedAt(Date.now());
        // mark everything as seen shortly after it's been displayed once
        const freshIds = res.items.map((i) => i.id);
        if (firstLoad.current) {
          // items never seen before are "NEW" — keep them unmarked for this session
          setSeen(loadSeen().filter((id) => !freshIds.includes(id)));
        }
        firstLoad.current = false;
      } catch {
        setError(true);
        setLive(false);
      } finally {
        clearTimeout(timer);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    load();
    const iv = setInterval(load, REFRESH_MS);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNew = (item: NewsItem) => !seen.includes(item.id);

  const markAllSeen = () => {
    const ids = items.map((i) => i.id);
    saveSeen(ids);
    setSeen(ids);
  };

  const categories = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    return [...present].sort((a, b) => (a === "other" ? 1 : b === "other" ? -1 : 0));
  }, [items]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (filter === "all" || i.category === filter) &&
        (!q || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q))
    );
  }, [items, filter, query]);

  const newCount = items.filter(isNew).length;

  return (
    <div className="space-y-8 pb-10">
      {/* ------- header ------- */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">The CBSE notice board</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-ink-900 md:text-5xl">
              News<span className="text-flame-500">.</span> straight from the Board.
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-600">
              Live circulars, datesheets and result notices from cbse.gov.in — refreshed automatically every few minutes,
              so nothing slips past you between classes, {profile.name}.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink-900 px-5 py-2.5 text-sm font-bold text-ink-900 transition-all duration-300 hover:bg-ink-900 hover:text-paper-50 disabled:opacity-60"
            >
              <Icon name="refresh" size={15} className={`transition-transform duration-700 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`} />
              {refreshing ? "Checking the Board…" : "Check for updates"}
            </button>
            <p className="flex items-center gap-2 text-[11px] font-semibold text-ink-600">
              <span className={`h-1.5 w-1.5 rounded-full ${live ? "bg-teal-500" : error ? "bg-flame-500" : "bg-ink-400"}`} />
              {live === null
                ? "Fetching latest news…"
                : live
                  ? `LIVE from CBSE · updated ${updatedAt ? new Date(updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}`
                  : "Offline / curated notices"}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ------- status + filters row ------- */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-marigold-400 px-4 py-1.5 text-xs font-extrabold text-ink-900">
          <Icon name="bell" size={14} className={newCount ? "anim-pop" : ""} />
          {newCount > 0 ? `${newCount} new since your last visit` : "All caught up"}
        </span>
        {newCount > 0 && (
          <button onClick={markAllSeen} className="text-xs font-bold text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline">
            Mark all as read
          </button>
        )}

        <div className="ml-auto flex flex-wrap gap-2">
          <Chip on={filter === "all"} onClick={() => setFilter("all")} label="Everything" color="#111631" />
          {categories.map((c) => (
            <Chip key={c} on={filter === c} onClick={() => setFilter(c)} label={CATEGORY_META[c].label} color={CATEGORY_META[c].color} />
          ))}
        </div>
      </div>

      <div className="relative">
        <Icon name="search" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notices — e.g. datesheet, result, practical…"
          className="w-full rounded-full border-2 border-ink-900/15 bg-paper-50 py-3 pl-11 pr-4 text-sm font-medium text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-900"
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border-2 border-flame-500/40 bg-flame-500/10 p-4 text-sm text-ink-900">
          <Icon name="cross" size={17} className="mt-0.5 shrink-0 text-flame-600" />
          <p>
            Couldn't reach the CBSE servers right now (they're sometimes slow or block browser fetches).
            Showing curated notices instead — you can also{" "}
            <a href={CBSE_URL} target="_blank" rel="noreferrer" className="font-bold underline decoration-flame-500 underline-offset-2">
              check cbse.gov.in directly
            </a>
            .
          </p>
        </div>
      )}

      {/* ------- ticker of latest headlines ------- */}
      {list.length > 0 && (
        <div className="overflow-hidden rounded-full border-2 border-ink-900 bg-ink-900 py-2">
          <div className="marquee">
            <div className="marquee-track">
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center">
                  {list.slice(0, 8).map((n) => (
                    <span key={`${k}-${n.id}`} className="flex items-center gap-3 whitespace-nowrap px-5 text-xs font-bold uppercase tracking-[0.14em] text-paper-50/85">
                      <span style={{ color: CATEGORY_META[n.category].color }}>●</span>
                      {n.title}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------- news cards ------- */}
      {live === null ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border-2 border-ink-900/10 bg-paper-100" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink-900/25 p-10 text-center">
          <Icon name="news" size={34} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-lg font-bold text-ink-900">No notices match that search.</p>
          <p className="mt-1 text-sm text-ink-600">Try another keyword, or clear the filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {list.map((n, i) => {
              const meta = CATEGORY_META[n.category];
              return (
                <motion.article
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink-900 bg-paper-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: meta.color }} />
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white"
                      style={{ background: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {isNew(n) && (
                      <span className="anim-pop rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
                        New
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
                      <Icon name="clock" size={12} />
                      {timeAgo(n.date) || n.source}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-ink-900">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{n.summary}</p>
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 self-start rounded-lg border-2 border-ink-900 px-3.5 py-2 text-xs font-bold text-ink-900 transition-colors duration-200 group-hover:bg-ink-900 group-hover:text-paper-50"
                  >
                    Read the official notice
                    <Icon name="arrow" size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ------- official links strip ------- */}
      <Reveal y={14}>
        <div className="grid gap-3 rounded-2xl border-2 border-ink-900 bg-paper-100 p-5 sm:grid-cols-3">
          {[
            { label: "CBSE main site", hint: "Notices · circulars · results", url: "https://www.cbse.gov.in", icon: "globe" },
            { label: "CBSE Academic", hint: "Syllabus · sample papers", url: "https://cbseacademic.nic.in", icon: "doc" },
            { label: "Pariksha Sangam", hint: "Results · verification", url: "https://parikshasangam.cbse.gov.in", icon: "trophy" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border-2 border-ink-900/10 bg-paper-50 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-900"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-900 text-paper-50">
                <Icon name={l.icon} size={18} />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-ink-900">{l.label}</span>
                <span className="block text-xs text-ink-600">{l.hint}</span>
              </span>
              <Icon name="arrow" size={14} className="ml-auto text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function Chip({ on, onClick, label, color }: { on: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${on ? "text-white" : "border-ink-900/15 text-ink-600 hover:border-ink-900 hover:text-ink-900"}`}
      style={on ? { background: color, borderColor: color } : undefined}
    >
      {label}
    </button>
  );
}
