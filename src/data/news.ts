/* ------------------------------------------------------------------
   CBSE news board — live data sources + curated fallback.

   The News tab pulls real headlines from CBSE's official "What's New"
   RSS feeds (via public CORS proxies, tried in order). If every fetch
   fails (offline / blocked), the board falls back to the curated items
   below so students always see something useful.
------------------------------------------------------------------- */

export type NewsCategory = "board" | "result" | "exam" | "circular" | "event" | "other";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string; // ISO-ish date string from the source (may be empty)
  link: string;
  source: string;
  category: NewsCategory;
}

export interface NewsFeed {
  url: string;
  source: string;
}

/** Official CBSE RSS feeds — these update whenever CBSE posts something new. */
export const CBSE_FEEDS: NewsFeed[] = [
  { url: "https://cbse.gov.in/en/web/guest/whats-new", source: "CBSE What's New" },
  { url: "https://www.cbse.gov.in/cbsenew/whats-new-en.xml", source: "CBSE What's New" },
  { url: "https://www.cbse.gov.in/ojs/rss", source: "CBSE Journals" },
];

/** Public CORS proxies, tried in order until one works. */
export const CORS_PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
];

const CATEGORY_RULES: Array<[NewsCategory, RegExp]> = [
  ["result", /\b(result|results|marks|scorecard|merit)\b/i],
  ["exam", /\b(exam|examination|date[sd]?sheet|syllabus|pattern|practical|pre-?board|mid-?term|question paper|sample paper)\b/i],
  ["board", /\b(board|cbse|regulation|circular|notification|notice|order|guideline|policy|affiliation|correction|revised)\b/i],
  ["event", /\b(event|olympiad|competition|workshop|training|seminar|webinar|festival|celebration|programme|program)\b/i],
];

export function categorise(text: string): NewsCategory {
  for (const [cat, re] of CATEGORY_RULES) if (re.test(text)) return cat;
  return "other";
}

export const CATEGORY_META: Record<NewsCategory, { label: string; color: string }> = {
  board: { label: "Board · Circulars", color: "#2742c9" },   // cobalt
  result: { label: "Results", color: "#0f9d8a" },            // teal
  exam: { label: "Exams · Datesheets", color: "#e0562c" },   // flame
  circular: { label: "Circulars", color: "#7a3fc9" },        // plum
  event: { label: "Events", color: "#c9a227" },              // marigold
  other: { label: "Updates", color: "#111631" },             // ink
};

/** Curated fallback notices (shown when live feeds can't be reached). */
export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "fb-1",
    title: "CBSE Term-II Examination 2026 datesheet for Classes 10 & 12 released",
    summary:
      "The Board has published the annual Term-II examination timetable for Classes X and XII on cbse.gov.in. Students should verify exam-day subjects and reporting times with their schools.",
    date: "",
    link: "https://www.cbse.gov.in/",
    source: "CBSE (curated notice)",
    category: "exam",
  },
  {
    id: "fb-2",
    title: "Practical / Internal assessment guidelines for Classes 9–12 updated",
    summary:
      "CBSE circulated revised instructions for practical exams, project work and internal assessment. Schools must complete record verification before the main board exam window.",
    date: "",
    link: "https://www.cbse.gov.in/",
    source: "CBSE (curated notice)",
    category: "board",
  },
  {
    id: "fb-3",
    title: "Olympiad & competition registration window open",
    summary:
      "Registration is underway for CBSE-endorsed Science, Mathematics and Information Technology Olympiads. Class 9–12 students can apply through their schools.",
    date: "",
    link: "https://www.cbse.gov.in/",
    source: "CBSE (curated notice)",
    category: "event",
  },
  {
    id: "fb-4",
    title: "NCERT exemplar problems & sample papers refreshed for the session",
    summary:
      "Latest sample papers and solution key aligned to the current syllabus are available on the CBSE Academic site — a good mock-exam source before boards.",
    date: "",
    link: "https://ncert.nic.in/exemplar-problems.php",
    source: "CBSE Academic (curated notice)",
    category: "exam",
  },
  {
    id: "fb-5",
    title: "DPS / competency-based education questions now 50%+ of paper weightage",
    summary:
      "Reminder from the academic calendar: more than half of every question paper must test application and competency-based skills, not rote recall.",
    date: "",
    link: "https://www.cbse.gov.in/",
    source: "CBSE (curated notice)",
    category: "board",
  },
];

/* ------------------------- RSS parsing ------------------------- */

function pickText(el: Element | null | undefined): string {
  return (el?.textContent ?? "").trim();
}

/** Parses both RSS 2.0 (<item>) and Atom (<entry>) documents. */
export function parseFeedXml(xml: Document): NewsItem[] {
  const nodes = [...xml.querySelectorAll("item"), ...xml.querySelectorAll("entry")];
  const out: NewsItem[] = [];
  nodes.forEach((n, i) => {
    const title = pickText(n.querySelector("title"));
    if (!title) return;
    let link = pickText(n.querySelector("link"));
    if (!link) {
      const href = n.querySelector("link")?.getAttribute("href");
      link = href ?? "";
    }
    const rawDate =
      pickText(n.querySelector("pubDate")) ||
      pickText(n.querySelector("updated")) ||
      pickText(n.querySelector("dc\\:date")) ||
      pickText(n.querySelector("date"));
    let description = pickText(n.querySelector("description")) || pickText(n.querySelector("summary")) || pickText(n.querySelector("content"));
    // strip html tags and collapse whitespace
    description = description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    out.push({
      id: `live-${i}-${title.slice(0, 40)}`,
      title,
      summary: description || "Open the CBSE notice for full details.",
      date: rawDate,
      link: link || "https://www.cbse.gov.in/",
      source: "CBSE.gov.in",
      category: categorise(`${title} ${description}`),
    });
  });
  return out;
}

function tryParseXml(text: string): NewsItem[] {
  const doc = new DOMParser().parseFromString(text, "text/xml");
  if (doc.querySelector("parsererror")) {
    // some feeds come back as HTML — try extracting <li>/<a> headline lists
    const holder = new DOMParser().parseFromString(text, "text/html");
    const links = [...holder.querySelectorAll("a")]
      .map((a) => ({ t: a.textContent?.trim() ?? "", href: a.getAttribute("href") ?? "" }))
      .filter((l) => l.t.length > 30 && /notice|circular|exam|result|date|pdf|new/i.test(l.t + l.href));
    return links.map((l, i) => ({
      id: `html-${i}-${l.t.slice(0, 40)}`,
      title: l.t,
      summary: "Posted on the CBSE What's New page — tap to read the full notice.",
      date: "",
      link: l.href.startsWith("http") ? l.href : `https://www.cbse.gov.in${l.href.startsWith("/") ? "" : "/"}${l.href}`,
      source: "CBSE What's New",
      category: categorise(l.t),
    }));
  }
  return parseFeedXml(doc);
}

/** Fetches all feeds through working proxies, merges, de-dupes, sorts by date. */
export async function fetchCbseNews(signal?: AbortSignal): Promise<{ items: NewsItem[]; live: boolean }> {
  const results = await Promise.allSettled(
    CBSE_FEEDS.flatMap((feed) =>
      CORS_PROXIES.map(async (proxy) => {
        const res = await fetch(proxy(feed.url), { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const items = tryParseXml(text).map((it) => ({ ...it, source: it.source === "CBSE.gov.in" ? feed.source : it.source }));
        if (items.length === 0) throw new Error("empty feed");
        return items;
      })
    )
  );

  const merged: NewsItem[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const it of r.value) {
      const key = it.title.toLowerCase().replace(/\W+/g, " ").trim().slice(0, 70);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(it);
    }
  }

  if (merged.length === 0) return { items: FALLBACK_NEWS, live: false };

  merged.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return { items: merged, live: true };
}

/** "2 days ago" style relative label. */
export function timeAgo(dateStr: string): string {
  const t = Date.parse(dateStr);
  if (!t) return "";
  const days = Math.floor((Date.now() - t) / 86400000);
  if (days <= 0) {
    const hours = Math.floor((Date.now() - t) / 3600000);
    return hours <= 0 ? "just now" : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
