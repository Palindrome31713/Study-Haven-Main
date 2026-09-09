import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Profile } from "../data/curriculum";
import { botReply, SUGGESTIONS } from "../engine/bot";
import { Icon, Wheel } from "./kit";

interface Msg { role: "bot" | "user"; text: string; }

export default function Chatbot({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setTyping(true);
      const t = setTimeout(() => {
        setMsgs([{ role: "bot", text: `Namaste, ${profile.name}! I'm Haven — Study Haven's AI buddy for Class ${profile.grade}. Concepts, sums, plans or a push of motivation — sirf padhai, bhai. What's on your mind?` }]);
        setTyping(false);
      }, reduced ? 100 : 800);
      return () => clearTimeout(t);
    }
  }, [open, msgs.length, profile, reduced]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [msgs, typing, reduced]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setTyping(true);
    const delay = reduced ? 120 : 750 + Math.min(900, text.length * 14);
    setTimeout(() => {
      const reply = botReply(text, { name: profile.name, grade: profile.grade, stream: profile.stream });
      setMsgs((m) => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, delay);
  };

  return (
    <>
      {/* floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Haven AI" : "Open Haven AI"}
        className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border-2 border-ink-950 bg-flame-500 py-3 pl-4 pr-5 font-display text-sm font-extrabold text-white shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-flame-400"
      >
        <span className="relative">
          <Wheel size={22} className={open ? "" : "anim-spin-slow"} />
          {!open && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-marigold-300">
              <span className="absolute inset-0 rounded-full bg-marigold-300 [animation:pulse-ring_2s_ease-out_infinite]" />
            </span>
          )}
        </span>
        {open ? "Close" : "Haven AI"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="fixed bottom-24 right-5 z-40 flex h-[min(600px,70vh)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border-2 border-ink-950 bg-ink-900 text-paper-50 shadow-lift"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-paper-50/10 bg-ink-950/60 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-marigold-500 text-ink-950"><Wheel size={20} /></span>
              <div className="flex-1">
                <p className="font-display text-sm font-extrabold">Haven AI</p>
                <p className="flex items-center gap-1.5 text-[11px] text-paper-50/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> online · study mode only
                </p>
              </div>
              <span className="rounded-full border border-paper-50/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper-50/60">Class {profile.grade}</span>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-cobalt-500 text-white"
                        : "rounded-bl-md border border-paper-50/10 bg-ink-800 text-paper-50/90"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-paper-50/10 bg-ink-800 px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 rounded-full bg-marigold-300" style={{ animation: reduced ? "none" : `typing-bounce 1s ${d * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <style>{`@keyframes typing-bounce { 0%,60%,100% { transform: translateY(0); opacity:.5 } 30% { transform: translateY(-4px); opacity:1 } }`}</style>
            </div>

            {/* suggestion chips */}
            {msgs.length <= 2 && (
              <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="shrink-0 rounded-full border border-marigold-400/40 bg-marigold-500/10 px-3 py-1.5 text-[11.5px] font-semibold text-marigold-300 transition hover:bg-marigold-500/25"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-paper-50/10 bg-ink-950/60 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a doubt… e.g. explain equilibrium"
                className="min-w-0 flex-1 rounded-xl border border-paper-50/12 bg-ink-800 px-4 py-2.5 text-sm text-paper-50 placeholder:text-paper-50/30 focus:border-marigold-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-marigold-500 text-ink-950 transition hover:bg-marigold-400 disabled:opacity-40"
                aria-label="Send"
              >
                <Icon name="send" size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
