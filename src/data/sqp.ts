// CBSE Class X Sample Question Papers (SQP) + Marking Schemes (MS), 2025-26.
// Source: https://cbseacademic.nic.in/sqp_classx_2025-26.html
// All PDFs are downloaded locally into /public/sqp so they open & download instantly.

export type SqpGroup = "core" | "language" | "skill" | "arts" | "other";

export interface SqpDoc {
  label: string; // "Sample Paper", "Marking Scheme", "Previous Year Paper", "Hindi version"
  file: string; // filename inside public/sqp
}

export interface SqpSubject {
  name: string;
  group: SqpGroup;
  docs: SqpDoc[];
}

export const SQP_SOURCE_URL = "https://cbseacademic.nic.in/sqp_classx_2025-26.html";

const sqp = (file: string): SqpDoc => ({ label: "Sample Paper", file });
const ms = (file: string): SqpDoc => ({ label: "Marking Scheme", file });

export const SQP_SUBJECTS: SqpSubject[] = [
  // ---------------- Core subjects ----------------
  {
    name: "Science",
    group: "core",
    docs: [
      sqp("Science-SQP.pdf"),
      ms("Science-MS.pdf"),
      sqp("Science-SQP_hi.pdf"),
      ms("Science-MS_hi.pdf"),
    ],
  },
  {
    name: "Mathematics — Basic",
    group: "core",
    docs: [sqp("MathsBasic-SQP.pdf"), ms("MathsBasic-MS.pdf"), sqp("MathsBasic-SQP_hi.pdf")],
  },
  {
    name: "Mathematics — Standard",
    group: "core",
    docs: [sqp("MathsStandard-SQP.pdf"), ms("MathsStandard-MS.pdf"), sqp("MathsStandard-SQP_hi.pdf")],
  },
  {
    name: "Social Science",
    group: "core",
    docs: [
      sqp("SocialScience-SQP.pdf"),
      ms("SocialScience-MS.pdf"),
      sqp("SocialScience-SQP_hi.pdf"),
      ms("SocialScience-MS_hi.pdf"),
    ],
  },
  {
    name: "English — Language & Literature",
    group: "core",
    docs: [sqp("EnglishL-SQP.pdf"), ms("EnglishL-MS.pdf")],
  },
  {
    name: "English — Communicative",
    group: "core",
    docs: [sqp("EnglishComm-SQP.pdf"), ms("EnglishComm-MS.pdf")],
  },
  {
    name: "Hindi — Course A",
    group: "core",
    docs: [sqp("HindiCourseA-SQP.pdf"), ms("HindiCourseA-MS.pdf")],
  },
  {
    name: "Hindi — Course B",
    group: "core",
    docs: [sqp("HindiCourseB-SQP.pdf"), ms("HindiCourseB-MS.pdf")],
  },
  {
    name: "Home Science",
    group: "core",
    docs: [
      sqp("HomeScience-SQP.pdf"),
      ms("HomeScience-MS.pdf"),
      sqp("HomeScience-SQP_hi.pdf"),
      ms("HomeScience-MS_hi.pdf"),
    ],
  },
  {
    name: "Sanskrit",
    group: "core",
    docs: [sqp("Sanskrit-SQP.pdf"), ms("Sanskrit-MS.pdf")],
  },
  {
    name: "Sanskrit — Non-Published (Communicative)",
    group: "core",
    docs: [sqp("Sanskrit-Comm-SQP.pdf"), ms("Sanskrit-Comm-MS.pdf")],
  },

  // ---------------- Other languages ----------------
  { name: "Urdu — Course A", group: "language", docs: [sqp("UrduA-SQP.pdf"), ms("UrduA-MS.pdf")] },
  { name: "Urdu — Course B", group: "language", docs: [sqp("UrduB-SQP.pdf"), ms("UrduB-MS.pdf")] },
  { name: "Bengali", group: "language", docs: [sqp("Bengali-SQP.pdf"), ms("Bengali-MS.pdf")] },
  { name: "Tamil", group: "language", docs: [sqp("Tamil-SQP.pdf"), ms("Tamil-MS.pdf")] },
  { name: "Telugu (Andhra Pradesh)", group: "language", docs: [sqp("TeluguAndhra-SQP.pdf")] },
  { name: "Telugu (Telangana)", group: "language", docs: [sqp("TeluguTelangana-SQP.pdf"), ms("TeluguTelengana-MS.pdf")] },
  { name: "Kannada", group: "language", docs: [sqp("Kannada-SQP.pdf"), ms("Kannada-MS.pdf")] },
  { name: "Malayalam", group: "language", docs: [sqp("Malayalam-SQP.pdf"), ms("Malayalam-MS.pdf")] },
  { name: "Marathi", group: "language", docs: [sqp("Marathi-SQP.pdf"), ms("Marathi-MS.pdf")] },
  { name: "Gujarati", group: "language", docs: [sqp("Gujarati-SQP.pdf"), ms("Gujarati-MS.pdf")] },
  { name: "Odia", group: "language", docs: [sqp("Odia-SQP.pdf"), ms("Odia-MS.pdf")] },
  { name: "Punjabi", group: "language", docs: [sqp("Punjabi-SQP.pdf"), ms("Punjabi-MS.pdf")] },
  { name: "Assamese", group: "language", docs: [sqp("Assamese-SQP.pdf"), ms("Assamese-MS.pdf")] },
  { name: "Bodo", group: "language", docs: [sqp("Bodo-SQP.pdf"), ms("Bodo-MS.pdf")] },
  { name: "Manipuri", group: "language", docs: [sqp("Manipuri-SQP.pdf"), ms("Manipuri-MS.pdf")] },
  { name: "Nepali", group: "language", docs: [sqp("Nepali-SQP.pdf"), ms("Nepali-MS.pdf")] },
  { name: "Sindhi", group: "language", docs: [sqp("Sindhi-SQP.pdf"), ms("Sindhi-MS.pdf")] },
  { name: "Kashmiri", group: "language", docs: [sqp("Kashmiri-SQP.pdf"), ms("Kashmiri-MS.pdf")] },
  { name: "Bhasha Malyeu", group: "language", docs: [sqp("BhashaMalyeu-SQP.pdf"), ms("BhashaMalyeu-MS.pdf")] },
  { name: "Tibetan", group: "language", docs: [sqp("Tibetan-SQP.pdf"), ms("Tibetan-MS.pdf")] },
  { name: "Lepcha", group: "language", docs: [sqp("Lepcha-SQP.pdf"), ms("Lepcha-MS.pdf")] },
  { name: "Limboo", group: "language", docs: [sqp("Limboo-SQP.pdf"), ms("Limboo-MS.pdf")] },
  { name: "Sherpa", group: "language", docs: [sqp("Sherpa-SQP.pdf"), ms("Sherpa-MS.pdf")] },
  { name: "Tamang", group: "language", docs: [sqp("Tamang-SQP.pdf"), ms("Tamang-MS.pdf")] },
  { name: "Gurung", group: "language", docs: [sqp("Gurung-SQP.pdf"), ms("Gurung-MS.pdf")] },
  { name: "Tangkhul", group: "language", docs: [sqp("Tangkhul-SQP.pdf"), ms("Tangkhul-MS.pdf")] },
  { name: "Mizo", group: "language", docs: [sqp("Mizo-SQP.pdf"), ms("Mizo-MS.pdf")] },
  { name: "Kokborok", group: "language", docs: [sqp("Kokborok_SQP.pdf"), ms("Kokborok_MS.pdf")] },
  { name: "Bhoti", group: "language", docs: [sqp("Bhoti_SQP.pdf"), ms("Bhoti_MS.pdf")] },
  { name: "Bhutia", group: "language", docs: [sqp("Bhutia-SQP.pdf"), ms("Bhutia-MS.pdf")] },
  { name: "Arabic", group: "language", docs: [sqp("Arabic-SQP.pdf"), ms("Arabic-MS.pdf")] },
  { name: "Persian", group: "language", docs: [sqp("Persian-SQP.pdf"), ms("Persian-MS.pdf")] },
  { name: "French", group: "language", docs: [sqp("French-SQP.pdf"), ms("French-MS.pdf")] },
  { name: "German", group: "language", docs: [sqp("German-SQP.pdf"), ms("German-MS.pdf")] },
  { name: "Japanese", group: "language", docs: [sqp("Japanese-SQP.pdf"), ms("Japanese-MS.pdf")] },
  { name: "Russian", group: "language", docs: [sqp("Russian-SQP.pdf"), ms("Russian-MS.pdf")] },
  { name: "Spanish", group: "language", docs: [sqp("Spanish-SQP.pdf"), ms("Spanish-MS.pdf")] },
  { name: "Thai", group: "language", docs: [sqp("Thai-SQP.pdf"), ms("Thai-MS.pdf")] },

  // ---------------- Skill subjects ----------------
  {
    name: "Elements of Book-keeping & Accountancy",
    group: "skill",
    docs: [sqp("ElementsBookKeepingAccountancy-SQP.pdf"), ms("ElementsBookKeepingAccountancy-MS.pdf")],
  },
  {
    name: "Elements of Business",
    group: "skill",
    docs: [sqp("ElementsBusiness-SQP.pdf"), ms("ElementsBusiness-MS.pdf")],
  },
  {
    name: "Computer Applications",
    group: "skill",
    docs: [sqp("ComputerApplication-SQP.pdf"), ms("ComputerApplication-MS.pdf")],
  },

  // ---------------- Arts / music ----------------
  {
    name: "Painting",
    group: "arts",
    docs: [
      sqp("Painting-SQP.pdf"),
      ms("Painting-MS.pdf"),
      sqp("Painting-SQP_hi.pdf"),
      ms("Painting-MS_hi.pdf"),
    ],
  },
  { name: "Hindustani Vocal", group: "arts", docs: [sqp("HindustaniVocal-SQP.pdf"), ms("HindustaniVocal-MS.pdf")] },
  { name: "Hindustani Melodic Instrument", group: "arts", docs: [sqp("HindustaniMelodic-SQP.pdf"), ms("HindustaniMelodic-MS.pdf")] },
  { name: "Hindustani Music — Percussion", group: "arts", docs: [sqp("HindustaniMusicPercussion-SQP.pdf"), ms("HindustaniMusicPercussion-MS.pdf")] },
  { name: "Carnatic Music — Vocal", group: "arts", docs: [sqp("CarnaticMusicVocal-SQP.pdf"), ms("CarnaticMusicVocal-MS.pdf")] },
  { name: "Carnatic Melodic Instrument", group: "arts", docs: [sqp("CarnaticMelodicInstrument-SQP.pdf"), ms("CarnaticMelodicInstrument-MS.pdf")] },
  { name: "Carnatic Music — Percussion", group: "arts", docs: [sqp("CarnaticMusicPercussion-SQP.pdf"), ms("CarnaticMusicPercussion-MS.pdf")] },

  // ---------------- Additional / other ----------------
  { name: "NCC", group: "other", docs: [sqp("NCC-SQP.pdf"), ms("NCC-MS.pdf")] },
  {
    name: "Artificial Intelligence (RAI)",
    group: "other",
    docs: [sqp("RAI-SQP.pdf"), ms("RAI-MS.pdf")],
  },
];

// Subjects listed on the CBSE page whose PDFs are currently 404 on their server.
export const SQP_UNAVAILABLE: Array<{ name: string; files: string[] }> = [
  { name: "Foundation of Information Technology", files: ["FoundationInformationTechnology-SQP.pdf", "FoundationInformationTechnology-PQ.pdf"] },
  { name: "Information & Communication Technology (ICT)", files: ["ICT-SQP.pdf", "ICT-PQ.pdf"] },
  { name: "Mathematics Basic — VIC", files: ["MathsBasicVIC-SQP.pdf", "MathsBasicVIC-MS.pdf"] },
  { name: "Mathematics Standard — VIC", files: ["MathsStandardVIC-SQP.pdf", "MathsStandardVIC-MS.pdf"] },
  { name: "Telugu (Andhra Pradesh) — Marking Scheme", files: ["Telgu-MS.pdf"] },
];

export const SQP_GROUPS: Array<{ id: SqpGroup; label: string; blurb: string }> = [
  { id: "core", label: "Core Subjects", blurb: "Science, Maths, Social Science, English, Hindi & more" },
  { id: "language", label: "Other Languages", blurb: "37 regional & foreign languages" },
  { id: "skill", label: "Skill Subjects", blurb: "Book-keeping, Business, Computer Applications" },
  { id: "arts", label: "Arts & Music", blurb: "Painting, Hindustani & Carnatic music" },
  { id: "other", label: "Additional", blurb: "NCC, Artificial Intelligence" },
];

export type SqpClass = "x" | "xii";

export function sqpUrl(file: string, cls: SqpClass = "x") {
  // relative to the deployed base (works on GitHub Pages project sites too)
  return `./${cls === "xii" ? "sqp12" : "sqp"}/${encodeURIComponent(file)}`;
}

export function cbseUrl(file: string, cls: SqpClass = "x") {
  const dir = cls === "xii" ? "ClassXII_2026_27" : "ClassX_2025_26";
  return `https://cbseacademic.nic.in/web_material/SQP/${dir}/${encodeURIComponent(file)}`;
}
