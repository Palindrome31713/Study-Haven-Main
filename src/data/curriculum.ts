export type Grade = 9 | 10 | 11 | 12;

export type SubjectId =
  | "math" | "sci" | "sst" | "eng" | "hin" | "it" | "ai"
  | "phy" | "chem" | "bio" | "cs"
  | "acc" | "bst" | "eco"
  | "hist" | "polsci" | "geo" | "psy";

export interface SubjectDef {
  id: SubjectId;
  name: string;
  hindi: string;
  icon: string;
  color: string; // hex accent
}

export interface StreamDef {
  id: string;
  name: string;
  tag: string;
  subjects: SubjectId[];
}

export interface Profile {
  name: string;
  grade: Grade;
  stream?: string;
  subjects: SubjectId[];
  createdAt: number;
}

export const SUBJECTS: Record<SubjectId, SubjectDef> = {
  math:   { id: "math",   name: "Mathematics",        hindi: "गणित",          icon: "sigma",   color: "#2b50e0" },
  sci:    { id: "sci",    name: "Science",            hindi: "विज्ञान",        icon: "atom",    color: "#0e8a7b" },
  sst:    { id: "sst",    name: "Social Science",     hindi: "सामाजिक विज्ञान", icon: "globe",   color: "#e4572e" },
  eng:    { id: "eng",    name: "English",            hindi: "अंग्रेज़ी",       icon: "pen",     color: "#8544c2" },
  hin:    { id: "hin",    name: "Hindi",              hindi: "हिन्दी",          icon: "akshara", color: "#d94f70" },
  it:     { id: "it",     name: "IT / AI (402)",      hindi: "सूचना प्रौद्योगिकी", icon: "chip",    color: "#579c33" },
  ai:     { id: "ai",     name: "Artificial Intelligence", hindi: "कृत्रिम बुद्धिमत्ता", icon: "chip", color: "#579c33" },
  phy:    { id: "phy",    name: "Physics",            hindi: "भौतिकी",         icon: "atom",    color: "#2b50e0" },
  chem:   { id: "chem",   name: "Chemistry",          hindi: "रसायन",          icon: "flask",   color: "#0e8a7b" },
  bio:    { id: "bio",    name: "Biology",            hindi: "जीव विज्ञान",     icon: "leaf",    color: "#579c33" },
  cs:     { id: "cs",     name: "Computer Science",   hindi: "कंप्यूटर",        icon: "code",    color: "#e4572e" },
  acc:    { id: "acc",    name: "Accountancy",        hindi: "लेखाशास्त्र",     icon: "ledger",  color: "#2b50e0" },
  bst:    { id: "bst",    name: "Business Studies",   hindi: "व्यवसाय अध्ययन",  icon: "case",    color: "#e4572e" },
  eco:    { id: "eco",    name: "Economics",          hindi: "अर्थशास्त्र",     icon: "chart",   color: "#0e8a7b" },
  hist:   { id: "hist",   name: "History",            hindi: "इतिहास",         icon: "globe",   color: "#8544c2" },
  polsci: { id: "polsci", name: "Political Science",  hindi: "राजनीति विज्ञान", icon: "scale",   color: "#e4572e" },
  geo:    { id: "geo",    name: "Geography",          hindi: "भूगोल",          icon: "globe",   color: "#2b50e0" },
  psy:    { id: "psy",    name: "Psychology",         hindi: "मनोविज्ञान",      icon: "mind",    color: "#d94f70" },
};

export const GRADE_SUBJECTS: Record<9 | 10, SubjectId[]> = {
  9:  ["math", "sci", "sst", "eng", "hin", "it"],
  10: ["math", "sci", "sst", "eng", "hin", "ai"],
};

export const STREAMS: StreamDef[] = [
  { id: "pcm",  name: "PCM",  tag: "Engineering track", subjects: ["phy", "chem", "math", "eng", "cs"] },
  { id: "pcb",  name: "PCB",  tag: "Medical track",     subjects: ["phy", "chem", "bio", "eng", "psy"] },
  { id: "pcmb", name: "PCMB", tag: "The all-rounder",   subjects: ["phy", "chem", "math", "bio", "eng"] },
  { id: "com",  name: "Commerce", tag: "Business track", subjects: ["acc", "bst", "eco", "eng", "cs"] },
  { id: "hum",  name: "Humanities", tag: "Liberal arts", subjects: ["hist", "polsci", "geo", "psy", "eng"] },
];

export function subjectsForProfile(grade: Grade, stream?: string): SubjectId[] {
  if (grade === 9 || grade === 10) return GRADE_SUBJECTS[grade];
  const s = STREAMS.find((x) => x.id === stream) ?? STREAMS[0];
  return s.subjects;
}

/** Real NCERT chapter lists per subject-class. Key = subjectId + grade. */
export const CHAPTERS: Record<string, string[]> = {
  math9: ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Lines and Angles", "Triangles", "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
  sci9: ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound"],
  sst9: ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Climate", "Physical Features of India", "What is Democracy? Why Democracy?", "Constitutional Design", "The Story of Village Palampur", "People as Resource"],
  eng9: ["The Road Not Taken", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "My Childhood", "The Bond of Love", "Kathmandu", "If I Were You", "The Lake Isle of Innisfree"],
  hin9: ["दो बैलों की कथा", "ल्हासा की ओर", "साँवले सपनों की याद", "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया", "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना"],
  it9: ["Basics of Information Technology", "Computer System & Organisation", "Ethical Hacking & Cyber Security", "Introduction to Internet", "Word Processing", "Spreadsheets", "Basics of Web Designing & HTML"],
  math10: ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
  sci10: ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"],
  sst10: ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Power Sharing", "Federalism", "Gender, Religion and Caste", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy"],
  eng10: ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses – I", "A Tiger in the Zoo", "Fire and Ice", "The Road Not Taken", "Dust of Snow", "The Sermon at Benares", "The Proposal"],
  hin10: ["सूर के पद", "राम–लक्ष्मण–परशुराम संवाद", "आत्मकथा", "उत्साह और अट नहीं रही", "यह दंतुरित मुस्कान", "फसल", "छाया मत छूना", "कन्यादान", "संगतकार", "नेताजी का चश्मा", "बालगोबिन भगत", "लखनवी अंदाज़"],
  ai10: ["Introduction to AI", "AI Project Cycle", "Intro to Data Sciences", "Intro to Computer Vision", "Intro to NLP", "Evaluation of Models", "AI Ethics"],
  math11: ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three-dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"],
  phy11: ["Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"],
  chem11: ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity", "Chemical Bonding and Molecular Structure", "Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry: Some Basic Principles", "Hydrocarbons"],
  bio11: ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Photosynthesis in Higher Plants", "Respiration in Plants", "Breathing and Exchange of Gases"],
  eng11: ["The Portrait of a Lady", "We're Not Afraid to Die, if We Can All Be Together", "Discovering Tut: The Saga Continues", "Landscape of the Soul", "The Ailing Planet", "The Browning Version", "Adventure", "Silk Road"],
  cs11: ["Computer Systems Overview", "Boolean Logic", "Number Systems & Encoding", "Python: Variables & Data Types", "Operators & Expressions", "Flow of Control", "Lists, Tuples & Dictionaries", "Strings in Python", "Introduction to Functions", "Societal Impacts of Computing"],
  math12: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"],
  phy12: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"],
  chem12: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d- and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"],
  bio12: ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Organisms and Populations", "Ecosystem"],
  eng12: ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Poets and Pancakes", "The Interview", "My Mother at Sixty-six", "Keeping Quiet", "A Thing of Beauty", "The Tiger King", "Journey to the End of the Earth"],
  cs12: ["Exception Handling in Python", "File Handling", "Stack", "Computer Networks", "Data Communication", "SQL: Introduction & DDL", "Data Query & DML in SQL", "Interface Python with SQL", "Societal Impacts"],
  acc12: ["Accounting for Share Capital", "Issue and Redemption of Debentures", "Financial Statements of a Company", "Analysis of Financial Statements", "Accounting Ratios", "Cash Flow Statement", "Accounting for Partnership: Basics", "Goodwill", "Admission of a Partner", "Retirement and Death of a Partner"],
  bst12: ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Financial Markets", "Marketing", "Consumer Protection"],
  eco12: ["National Income and Related Aggregates", "Money and Banking", "Determination of Income and Employment", "Government Budget and the Economy", "Balance of Payments"],
  acc11: ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions – I", "Recording of Transactions – II", "Bank Reconciliation Statement", "Depreciation, Provisions and Reserves", "Trial Balance and Rectification of Errors", "Financial Statements of Sole Proprietorship", "Bills of Exchange"],
  bst11: ["Nature and Purpose of Business", "Forms of Business Organisation", "Private, Public and Multinational Companies", "Business Services", "Sources of Business Finance", "Small Business and MSME", "Internal Trade", "International Business"],
  eco11: ["Introduction to Statistics for Economics", "Collection of Data", "Organisation of Data", "Presentation of Data", "Measures of Central Tendency", "Measures of Dispersion", "Correlation", "Indian Economy at the Eve of Independence", "Liberalisation, Privatisation and Globalisation", "Poverty", "Human Capital Formation", "Rural Development", "Employment", "Sustainable Development"],
  hist11: ["Bricks, Beads and Bones: The Harappan Civilisation", "Political and Economic History: The Mauryan Empire", "Social Histories: The Mahabharata", "Thinkers, Beliefs and Buildings", "Through the Eyes of Travellers", "Bhakti–Sufi Traditions"],
  polsci11: ["Constitution: Why and How?", "Election and Representation", "Political Executive", "Legislature", "Judiciary"],
  geo11: ["Fundamentals of Physical Geography", "The Origin and Evolution of the Earth", "Interior of the Earth", "Distribution of Oceans and Continents", "Climate", "Natural Vegetation"],
  psy11: ["What is Psychology?", "Methods of Enquiry in Psychology", "Human Development", "Sensory, Attentional and Perceptual Processes", "Learning", "Memory", "Motivation and Emotion"],
  hist12: ["Kings, Kingship and Caste: The Mahabharata", "Kings and Chronicles: The Mughal Courts", "New Architecture: Hampi, Vijayanagara", "Bhakti–Sufi Traditions", "The Revolt of 1857", "Mahatma Gandhi and the Nationalist Movement"],
  polsci12: ["Challenges of Nation Building", "Era of One-Party Dominance", "Politics of Planned Development", "Political Parties and the Party System", "Democracy and Dissent"],
  geo12: ["Human Geography: Nature and Scope", "The World Population", "Human Development", "Primary Activities", "Manufacturing Industries", "Planning and Sustainable Development in India"],
  psy12: ["Variations in Psychological Attributes", "Self and Personality", "Meeting Life Challenges", "Psychological Disorders", "Therapeutic Approaches", "Attitude and Social Cognition"],
};

export function chapterKey(id: SubjectId, grade: Grade) {
  return `${id}${grade}`;
}

export function chaptersOf(id: SubjectId, grade: Grade): string[] {
  return CHAPTERS[chapterKey(id, grade)] ?? [];
}

export const NCERT_LIBRARY_URL = "https://ncert.nic.in/textbook/index.php";
export const CBSE_URL = "https://www.cbse.gov.in";
export const DIKSHA_URL = "https://diksha.gov.in";
