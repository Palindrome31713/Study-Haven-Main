export interface BotCtx {
  name: string;
  grade: number;
  stream?: string;
}

/* ---------- safe arithmetic parser (+ - * / ^ % parentheses) ---------- */

export function tryMath(input: string): string | null {
  const s = input.replace(/×|x/gi, "*").replace(/÷/g, "/").replace(/\^/g, "**").replace(/\s+/g, "");
  const clean = s.replace(/^(solve|calculate|compute|what\s*is|=)/i, "").replace(/=.*$/, "");
  if (!/^[\d+\-*/().%*]+$/.test(clean) || !/\d/.test(clean) || !/[+\-*/%]/.test(clean)) return null;
  try {
    // tokenise then evaluate with two stacks (no eval)
    const val = evaluate(clean.replace(/\*\*/g, "^"));
    if (val === null || !isFinite(val)) return null;
    const shown = Number.isInteger(val) ? val.toString() : parseFloat(val.toFixed(6)).toString();
    return `Done in a flash: the answer is ${shown}. Show the steps in your notebook too — boards award method marks, ${"!".repeat(0)}and future-you will thank you.`;
  } catch {
    return null;
  }
}

function evaluate(expr: string): number | null {
  const nums: number[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 };
  let i = 0;
  const apply = () => {
    const op = ops.pop()!;
    const b = nums.pop()!;
    const a = nums.pop()!;
    if (op === "+") nums.push(a + b);
    else if (op === "-") nums.push(a - b);
    else if (op === "*") nums.push(a * b);
    else if (op === "/") nums.push(a / b);
    else if (op === "%") nums.push(a % b);
    else nums.push(Math.pow(a, b));
  };
  while (i < expr.length) {
    const c = expr[i];
    if (c >= "0" && c <= "9" || c === ".") {
      let j = i;
      while (j < expr.length && (expr[j] >= "0" && expr[j] <= "9" || expr[j] === ".")) j++;
      nums.push(parseFloat(expr.slice(i, j)));
      i = j;
    } else if (c === "(") {
      ops.push(c);
      i++;
    } else if (c === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") apply();
      if (!ops.length) return null;
      ops.pop();
      i++;
    } else if (c in prec) {
      if (c === "-" && (nums.length === 0 || "+-*/^( ".includes(expr[i - 1] ?? "("))) {
        // unary minus
        let j = i + 1;
        while (j < expr.length && (expr[j] >= "0" && expr[j] <= "9" || expr[j] === ".")) j++;
        if (j === i + 1) return null;
        nums.push(-parseFloat(expr.slice(i + 1, j)));
        i = j;
      } else {
        while (ops.length && prec[ops[ops.length - 1]] >= prec[c] && ops[ops.length - 1] !== "(") apply();
        ops.push(c);
        i++;
      }
    } else {
      return null;
    }
  }
  while (ops.length) {
    if (ops[ops.length - 1] === "(") return null;
    apply();
  }
  return nums.length === 1 ? nums[0] : null;
}

/* ---------- knowledge base ---------- */

interface KB { keys: string[]; topic: string; body: string; }

const KB: KB[] = [
  {
    keys: ["photosynthesis"],
    topic: "Photosynthesis",
    body: "Plants cook their own food: 6CO₂ + 6H₂O —(sunlight, chlorophyll)→ C₆H₁₂O₆ + 6O₂. It happens in the chloroplast. Light reaction makes ATP & NADPH in the thylakoid; the Calvin cycle (dark reaction) fixes CO₂ in the stroma. Exam tip: always draw the chloroplast diagram with labels — it's almost a free 3 marks.",
  },
  {
    keys: ["trigonometry", "trigonometric", "sin cos", "sinθ"],
    topic: "Trigonometry",
    body: "Remember the table trio: at 0°, 30°, 45°, 60°, 90° — sin goes 0, ½, 1/√2, √3/2, 1 and cos runs the same list backwards. tan = sin/cos. Identities that save lives: sin²θ + cos²θ = 1 and 1 + tan²θ = sec²θ. Try writing the table from memory every morning for 3 days — it sticks for boards.",
  },
  {
    keys: ["newton", "laws of motion", "law of motion"],
    topic: "Newton's Laws of Motion",
    body: "1st: a body stays at rest or in uniform motion unless an external force acts (inertia). 2nd: F = ma — force equals rate of change of momentum. 3rd: every action has an equal and opposite reaction. Trick: for numericals, always draw the free-body diagram first — 80% of mistakes vanish.",
  },
  {
    keys: ["ohm", "current electricity", "resistor"],
    topic: "Ohm's Law & Circuits",
    body: "V = IR at constant temperature. Series: R_total = R₁ + R₂ + … (same current). Parallel: 1/R = 1/R₁ + 1/R₂ + … (same voltage). Power: P = VI = I²R = V²/R. Board favourite: 'why does the filament of a bulb not obey Ohm's law?' — because its temperature (and hence resistance) changes.",
  },
  {
    keys: ["periodic table", "periodic", "valency"],
    topic: "Periodic Trends",
    body: "Across a period (left→right): atomic radius ↓, electronegativity ↑, metallic character ↓. Down a group: radius ↑, metallic character ↑. Valency of an element = electrons needed to complete the octet (or the outer electrons if ≤ 4). Sodium (2,8,1) → valency 1; oxygen (2,6) → valency 2.",
  },
  {
    keys: ["quadratic", "discriminant", "roots of"],
    topic: "Quadratic Equations",
    body: "For ax² + bx + c = 0: discriminant D = b² − 4ac. D > 0 → two distinct real roots, D = 0 → equal roots, D < 0 → no real roots. Sum of roots = −b/a, product = c/a. Most board questions hide in word problems — translate the sentence into the equation first, then apply the formula.",
  },
  {
    keys: ["nationalism", "1857", "gandhi", "salt march"],
    topic: "Nationalism in India",
    body: "Timeline anchors: 1915 Gandhi returns → 1919 Rowlatt Act & Jallianwala Bagh → 1920 Non-Cooperation → 1922 Chauri Chaura (called off) → 1928 Simon Commission → 1930 Salt March & Dandi → 1942 Quit India. Connect each event to WHY it happened — examiners reward cause-and-effect, not just dates.",
  },
  {
    keys: ["french revolution", "bastille"],
    topic: "The French Revolution",
    body: "1789: France's treasury is empty, bread prices soar. The Third Estate (commoners) is ignored in the Estates General, forms the National Assembly, and on 14 July the Bastille falls. August 1789: feudal privileges abolished; 1791: constitutional monarchy; 1792: republic; 1793–94: Reign of Terror under Robespierre. Think of it as: crisis → revolt → reform → radical phase.",
  },
  {
    keys: ["mitochondria", "cell", "organelle"],
    topic: "Cell Organelles",
    body: "Mitochondrion = powerhouse (aerobic respiration, ATP). Ribosome = protein factory. Nucleus = control room with DNA. Golgi = packaging & dispatch. Lysosome = waste disposal ('suicide bags'). Chloroplast (plants only) = solar kitchen. Mnemonic: 'Mr. RNG-LC packs lunch'.",
  },
  {
    keys: ["carbon", "covalent", "organic"],
    topic: "Carbon & Covalency",
    body: "Carbon forms covalent bonds by sharing electrons — it can't lose or gain 4 electrons easily (too costly energetically). Tetravalency + small size let it form long chains, branches and rings (catenation). Homologous series: each next member adds −CH₂−. Functional groups decide properties: −OH alcohol, −CHO aldehyde, −COOH acid.",
  },
  {
    keys: ["light", "reflection", "refraction", "mirror", "lens"],
    topic: "Light — Mirrors & Lenses",
    body: "Mirror formula: 1/v + 1/u = 1/f; lens formula: 1/v − 1/u = 1/f. Magnification m = −v/u (mirror), +v/u (lens). Sign convention: distances against incident light are negative. Concave mirror → real & inverted (except very close); convex mirror → always virtual, small, used as rear-view mirror.",
  },
  {
    keys: ["semiconductor", "diode", "p-n"],
    topic: "Semiconductors",
    body: "Intrinsic Si/Ge: equal electrons & holes. Doping with P (pentavalent) → n-type (extra electrons); with B (trivalent) → p-type (holes). p-n junction: forward bias = p at + terminal → conducts; reverse bias → blocks. That one-way behaviour IS the diode. Boards love: draw the forward/reverse bias circuits.",
  },
  {
    keys: ["share", "debenture", "partnership", "accounting equation", "journal"],
    topic: "Accountancy Core",
    body: "Golden rules: Personal — debit the receiver, credit the giver. Real — debit what comes in, credit what goes out. Nominal — debit expenses/losses, credit incomes/gains. Shares: ownership, dividend not guaranteed. Debentures: loan, fixed interest, debenture-holder is a creditor. Always: Assets = Liabilities + Capital.",
  },
  {
    keys: ["gdp", "national income", "inflation", "rbi"],
    topic: "Economics Essentials",
    body: "GDP at market price = value of final goods & services within the domestic territory in a year. GDP + NFIA = GNP. Inflation = sustained rise in general price level; CPI measures retail inflation. RBI uses repo rate: repo ↑ → money costlier → inflation cools. Link every concept to a current example — that's topper writing.",
  },
  {
    keys: ["management", "planning", "marketing", "4ps", "directing"],
    topic: "Business Studies Quick Map",
    body: "Functions of management: Planning → Organising → Staffing → Directing → Controlling (POSDC). 4Ps of marketing: Product, Price, Place, Promotion. Henry Fayol gave 14 principles of management; Taylor gave Scientific Management ('father of scientific management'). Remember: Fayol = top-down principles, Taylor = shop-floor efficiency.",
  },
  {
    keys: ["python", "programming", "code", "function"],
    topic: "Python Refresher",
    body: "Indentation IS the syntax — 4 spaces per block. Lists are mutable [ ], tuples immutable ( ), dicts are key:value { }. `def fn(a, b=0): return a+b` — default args go last. `for i in range(5)` gives 0..4. Common bug: `input()` returns a string — wrap with int() before maths. Practise 2 programs daily; CS rewards hands over theory.",
  },
  {
    keys: ["mughal", "maurya", "harappan", "revolt of 1857", "ashoka"],
    topic: "History Anchor Points",
    body: "Harappa (~2600 BCE): planned grids, Great Bath at Mohenjodaro. Mauryas: Ashoka's Dhamma on rocks & pillars after Kalinga (261 BCE). Mughals: Akbar's Sulh-i-kul, Ain-i-Akbari by Abul Fazl. 1857: began at Meerut (10 May), Bahadur Shah II symbolic leader. For long answers: intro → 3 sub-points with evidence → conclusion.",
  },
  {
    keys: ["constitution", "federalism", "democracy", "election"],
    topic: "Civics Compass",
    body: "India: sovereign, socialist, secular, democratic republic — 'we the people' adopted it on 26 Nov 1949, enforced 26 Jan 1950. Federal features: written constitution, division of powers (Union/State/Concurrent lists), independent judiciary, bicameral legislature. Elections run by the independent Election Commission; universal adult franchise since day one.",
  },
];

/* ---------- intents ---------- */

const MOTIVATION = [
  "You didn't come this far to only come this far. Ten focused minutes from now — go.",
  "Every topper you admire once sat exactly where you're sitting, confused by the same chapter. What changed? They started. You can too.",
  "Boards don't ask if you're perfect. They ask if you're prepared. One chapter today is one chapter lighter tomorrow.",
  "Kalam sahab said it best — dreams are what don't let you sleep. Yours is still alive. Feed it a small win today.",
  "The syllabus looks big because you're looking at all of it at once. Shrink the frame: one section, 25 minutes, timer on.",
  "Tired is fine. Quitting is expensive. Rest for 10 minutes, drink water, then do one question. Just one.",
  "Your future self is quietly watching today's you. Make them proud with a single solved problem.",
  "Marks are a mirror of method, not of talent. Fix the method — 25 min study, 5 min break, notes in your own words — and the mirror changes.",
];

const TIPS = [
  "Here's a revision loop that works: read the NCERT chapter → close the book → write everything you remember → open and check the gaps. Gaps are your actual syllabus.",
  "Try the 25-5 method (Pomodoro): 25 minutes of full-focus study, 5 minutes completely off-screen. Four cycles = one powerful study block.",
  "For boards, NCERT is the bible: 80% of the paper is straight NCERT. Solve every in-text and exercise question before touching any reference book.",
  "Make a 'mistake notebook': every question you get wrong goes in with the right method. Revise ONLY that book the night before the exam.",
  "Active recall beats re-reading by miles. After a chapter, write 5 questions on it and answer them tomorrow morning.",
  "Sleep is study too — your brain files the day's learning during deep sleep. 7+ hours before an exam beats one all-nighter.",
];

const GREET = [
  "Namaste, {name}! Ready for some serious (but friendly) studying? Ask me a concept, throw a sum at me, or just say 'motivate me'.",
  "Hey {name}! Haven at your service. Type a topic like 'photosynthesis' or 'trigonometry' and I'll unpack it.",
  "Welcome back, {name}! Shall we crack a chapter today? Ask away.",
];

const GUARD = [
  "I live inside Study Haven — and I only drive toward education. Try me with a concept ('explain Ohm's law'), a sum ('what is 47×13'), or 'motivate me'.",
  "That one's outside my classroom. But here's a better question: which chapter is scaring you this week? Let's tame it together.",
  "Haven speaks fluent syllabus only — and I'm fluent in it! Ask me anything from your {grade}th grade books.",
];

const THANKS = [
  "Anytime, {name}! Ab padhai pe lag ja — you've got this.",
  "That's what a study haven is for. Now go earn those marks — one question at a time.",
];

const WHO = [
  "I'm Haven — Study Haven's resident brain. I live in your browser, I know your CBSE shelf inside out, and my only job is to make you understand (and smile while doing it). Ask me any concept, a calculation, or for a push of motivation.",
];

export function botReply(raw: string, ctx: BotCtx): string {
  const input = raw.trim().toLowerCase();

  const math = tryMath(input);
  if (math) return math;

  if (/(hello|hi|hey|namaste|namaskar|hola)\b/.test(input) && input.length < 30)
    return pick(GREET).replace("{name}", ctx.name || "friend");

  if (/(thank|thanks|shukriya|dhanyavad)/.test(input))
    return pick(THANKS).replace("{name}", ctx.name || "friend");

  if (/(who are you|what are you|your name|about you)/.test(input))
    return pick(WHO);

  if (/(motivat|inspire|sad|depress|give up|giving up|can'?t do|cant do|failing|failed|tired|bored|scared|anxious|nervous|stress|fear|hopeless|lonely)/.test(input))
    return pick(MOTIVATION);

  if (/(study tip|tips|plan|schedule|revise|revision|time table|timetable|strategy|how to (study|prepare)|prepare for)/.test(input))
    return pick(TIPS);

  for (const kb of KB) {
    if (kb.keys.some((k) => input.includes(k)))
      return `${kb.topic} — good pick. ${kb.body}${maybeMotivate()}`;
  }

  // subject nudge: if they mention a subject, point to resources
  const subjectHits: Array<[RegExp, string]> = [
    [/\bmath(s|ematics)?\b/, "Mathematics"],
    [/\bphysics\b|\bchemistry\b|\bbiology\b|\bscience\b/, "Science"],
    [/\bsst\b|history|civics|geography/, "Social Science"],
    [/\benglish\b/, "English"],
    [/account|business|economics/, "Commerce"],
  ];
  for (const [re, name] of subjectHits) {
    if (re.test(input))
      return `I can help with ${name}! Give me a specific topic — like "quadratic equations" or "Ohm's law" — or jump into the Quizzes tab and let me test you on it. ${maybeMotivate()}`;
  }

  if (/\?$/.test(input) || /what|why|how|when|define|explain|meaning|formula/.test(input))
    return `Great question! I want to be precise, so give me a chapter-level topic (e.g. "semiconductors", "nationalism in India", "carbon compounds") and I'll break it down. Until then — ${pick(MOTIVATION).toLowerCase()}`;

  return pick(GUARD).replace("{name}", ctx.name || "friend").replace("{grade}", String(ctx.grade));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybeMotivate(): string {
  return Math.random() < 0.4 ? " And remember: small steps, daily. You're building something big." : "";
}

export const SUGGESTIONS = [
  "Explain photosynthesis",
  "Trigonometry table trick",
  "Solve 47 × 13",
  "Study tips for boards",
  "Motivate me",
  "Newton's laws",
  "Semiconductors",
  "Nationalism in India",
];
