import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Profile } from "../data/curriculum";
import {
  SQP_GROUPS,
  SQP_SOURCE_URL,
  SQP_SUBJECTS,
  SQP_UNAVAILABLE,
  cbseUrl,
  sqpUrl,
  type SqpClass,
  type SqpGroup,
} from "../data/sqp";
import { SQP_XII_SOURCE_URL, SQP_XII_SUBJECTS, SQP_XII_UNAVAILABLE } from "../data/sqp12";
import { Icon, Reveal } from "./kit";

// Which class-sets are available for each grade. Only Class X & XII papers exist —
// grades 9 & 11 have no CBSE SQPs published on these pages, so nothing is shown for them.
const CLASS_SETS: Record<number, Array<{ id: SqpClass; label: string; session: string }>> = {
  9: [],
  10: [{ id: "x", label: "Class 10", session: "Session 2025–26" }],
  11: [],
  12: [{ id: "xii", label: "Class 12", session: "Session 2026–27" }],
};

const GROUP_COLOR: Record<SqpGroup, string> = {
  core: "#2749c9", // cobalt
  language: "#0f8b7a", // teal
  skill: "#8a4fd3", // plum
  arts: "#d9541f", // flame
  other: "#4b5573", // ink-600ish
};

export default function SamplePapers({ profile }: { profile: Profile }) {
  const sets = CLASS_SETS[profile.grade] ?? [];
  const [cls, setCls] = useState<SqpClass>(sets[0]?.id ?? "x");
  const [group, setGroup] = useState<SqpGroup | "all">("core");
  const [query, setQuery] = useState("");

  // grade-gated data: class-12 students see ONLY Class XII papers, class-10 ONLY Class X
  const active: SqpClass = sets.some((s) => s.id === cls) ? cls : sets[0]?.id ?? "x";
  const subjects = active === "xii" ? SQP_XII_SUBJECTS : SQP_SUBJECTS;
  const unavailable = active === "xii" ? SQP_XII_UNAVAILABLE : SQP_UNAVAILABLE;
  const sourceUrl = active === "xii" ? SQP_XII_SOURCE_URL : SQP_SOURCE_URL;
  const session = sets.find((s) => s.id === active)?.session ?? "";

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subjects.filter(
      (s) =>
        (group === "all" || s.group === group) &&
        (!q || s.name.toLowerCase().includes(q) || s.docs.some((d) => d.file.toLowerCase().includes(q)))
    );
  }, [subjects, group, query]);

  const totalDocs = subjects.reduce((n, s) => n + s.docs.length, 0);

  // grades 9 & 11 — CBSE publishes no SQPs for them on these pages
  if (sets.length === 0) {
    return (
      <div className="space-y-8 pb-10">
        <Reveal>
          <div className="rounded-2xl border-2 border-dashed border-ink-900/25 bg-paper-100 p-10 text-center">
            <Icon name="doc" size={34} className="mx-auto text-ink-400" />
            <h2 className="mt-3 font-display text-2xl font-extrabold text-ink-900">
              No sample papers for Class {profile.grade} yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
              CBSE only publishes official Sample Question Papers with marking schemes for
              Class 10 and Class 12. As a Class {profile.grade} student, {profile.name}, you can
              still use the Library, Videos and Quizzes tabs — they cover your syllabus fully.
            </p>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* ------- header ------- */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame-500">
              CBSE {sets.find((s) => s.id === active)?.label ?? ""} · {session}
            </p>
            <h2 className="mt-1 font-display text-4xl font-extrabold text-ink-900 md:text-5xl">
              Sample Papers<span className="text-flame-500">.</span> with answer schemes.
            </h2>
            <p className="mt-2 max-w-xl text-[15px] text-ink-600">
              Every official CBSE Sample Question Paper and Marking Scheme, downloaded straight from
              cbseacademic.nic.in and stored here — open them instantly, no buffering, {profile.name}.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 bg-marigold-400 px-4 py-2 text-sm font-extrabold text-ink-900">
              <Icon name="paperclip" size={15} />
              {subjects.length} subjects · {totalDocs} PDFs
            </span>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-600 underline-offset-4 hover:text-ink-900 hover:underline"
            >
              Official CBSE source page
              <Icon name="arrow" size={12} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* ------- class toggle (only when multiple sets exist for this grade) ------- */}
      {sets.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {sets.map((s) => (
            <Chip
              key={s.id}
              on={active === s.id}
              onClick={() => setCls(s.id)}
              label={`${s.label} (${s.session})`}
              color="#111631"
            />
          ))}
        </div>
      )}

      {/* ------- group chips ------- */}
      <div className="flex flex-wrap gap-2">
        <Chip on={group === "all"} onClick={() => setGroup("all")} label="All Subjects" color="#111631" />
        {SQP_GROUPS.map((g) => (
          <Chip key={g.id} on={group === g.id} onClick={() => setGroup(g.id)} label={g.label} color={GROUP_COLOR[g.id]} />
        ))}
      </div>

      {/* ------- search ------- */}
      <div className="relative">
        <Icon name="search" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a subject — e.g. science, hindi, painting…"
          className="w-full rounded-full border-2 border-ink-900/15 bg-paper-50 py-3 pl-11 pr-4 text-sm font-medium text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-900"
        />
      </div>

      {group !== "all" && (
        <p className="-mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
          {SQP_GROUPS.find((g) => g.id === group)?.blurb}
        </p>
      )}

      {/* ------- subject cards ------- */}
      {list.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink-900/25 p-10 text-center">
          <Icon name="doc" size={34} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-lg font-bold text-ink-900">No subject matches “{query}”.</p>
          <p className="mt-1 text-sm text-ink-600">Try a shorter keyword, or switch the category above.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {list.map((s, i) => {
              const color = GROUP_COLOR[s.group];
              return (
                <motion.article
                  key={s.name}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-2xl border-2 border-ink-900 bg-paper-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} />
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white"
                      style={{ background: color }}
                    >
                      {SQP_GROUPS.find((g) => g.id === s.group)?.label ?? s.group}
                    </span>
                    <span className="ml-auto text-[11px] font-bold text-ink-400">{s.docs.length} PDFs</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-extrabold leading-snug text-ink-900">{s.name}</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.docs.map((d) => (
                      <span key={d.file} className="inline-flex overflow-hidden rounded-lg border-2 border-ink-900/15 transition-all duration-200 hover:border-ink-900">
                        <a
                          href={sqpUrl(d.file, active)}
                          target="_blank"
                          rel="noreferrer"
                          title={`Open ${d.label} in a new tab`}
                          className="flex items-center gap-1.5 bg-paper-50 px-3 py-1.5 text-xs font-bold text-ink-900 transition-colors hover:bg-ink-900 hover:text-paper-50"
                        >
                          <Icon name="doc" size={13} />
                          {d.label}
                        </a>
                        <a
                          href={sqpUrl(d.file, active)}
                          download={d.file}
                          title={`Download ${d.label}`}
                          className="flex items-center border-l-2 border-ink-900/15 bg-paper-100 px-2.5 py-1.5 text-ink-600 transition-colors hover:bg-marigold-400 hover:text-ink-900"
                        >
                          <Icon name="download" size={13} />
                        </a>
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ------- unavailable notice ------- */}
      <Reveal y={14}>
        <div className="rounded-2xl border-2 border-dashed border-ink-900/25 bg-paper-100 p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-ink-900">
            <Icon name="cross" size={15} className="text-flame-500" />
            Listed on CBSE but currently missing from their server (404)
          </p>
          <p className="mt-1 text-xs text-ink-600">
            These files are linked on the official page but CBSE hasn't uploaded working copies yet. You can still try them directly:
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {unavailable.flatMap((u) =>
              u.files.map((f) => (
                <li key={f}>
                  <a
                    href={cbseUrl(f, active)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-900/15 bg-paper-50 px-3 py-1.5 text-[11px] font-bold text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
                  >
                    {u.name.replace(" — Marking Scheme", "")} · {f.includes("MS") ? "Scheme" : f.includes("PQ") ? "PYQ" : "Paper"}
                    <Icon name="arrow" size={11} />
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </Reveal>

      {/* ------- footer strip ------- */}
      <Reveal y={14}>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-ink-900 bg-ink-900 px-5 py-4 text-paper-50">
          <p className="text-sm font-semibold">
            <Icon name="cap" size={15} className="mr-2 inline text-marigold-400" />
            Tip: solve the Sample Paper first, then grade yourself with the Marking Scheme before your next quiz.
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-paper-50/30 px-4 py-2 text-xs font-bold transition-colors hover:border-marigold-400 hover:text-marigold-400"
          >
            View on cbseacademic.nic.in
            <Icon name="arrow" size={13} />
          </a>
        </div>
      </Reveal>
    </div>
  );
}

function Chip({ on, onClick, label, color }: { on: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
        on ? "text-white" : "border-ink-900/15 text-ink-600 hover:border-ink-900 hover:text-ink-900"
      }`}
      style={on ? { background: color, borderColor: color } : undefined}
    >
      {label}
    </button>
  );
}
