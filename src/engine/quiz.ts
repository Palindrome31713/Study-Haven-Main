import type { SubjectId } from "../data/curriculum";

export interface Q {
  q: string;
  opts: string[];
  a: number;
  why: string;
}

/* ---------------- curated banks (chapter-tagged) ---------------- */

const B: Record<string, Q[]> = {
  math: [
    { q: "If one zero of the polynomial x² − 3x + k is 2, the value of k is:", opts: ["2", "−2", "3", "−3"], a: 0, why: "p(2) = 4 − 6 + k = 0 ⇒ k = 2. (Polynomials)" },
    { q: "The sum of first 10 natural numbers is:", opts: ["45", "50", "55", "60"], a: 2, why: "Sₙ = n(n+1)/2 = 10×11/2 = 55. (Arithmetic Progressions)" },
    { q: "HCF of 8 and 12 is:", opts: ["2", "4", "6", "8"], a: 1, why: "8 = 2³, 12 = 2²×3 → common part 2² = 4. (Real Numbers)" },
    { q: "The distance of point (3, 4) from the origin is:", opts: ["5", "7", "25", "12"], a: 0, why: "√(3² + 4²) = √25 = 5. (Coordinate Geometry)" },
    { q: "sin 30° + cos 60° equals:", opts: ["0", "1", "½", "√3"], a: 1, why: "½ + ½ = 1. (Introduction to Trigonometry)" },
    { q: "A tangent to a circle is ____ to the radius at the point of contact.", opts: ["parallel", "perpendicular", "equal", "inclined at 45°"], a: 1, why: "The tangent is perpendicular to the radius through the point of contact. (Circles)" },
    { q: "The probability of getting a head in a single toss of a fair coin is:", opts: ["0", "1", "½", "2"], a: 2, why: "1 favourable outcome out of 2 equally likely outcomes. (Probability)" },
    { q: "In an AP with a = 2, d = 3, the 10th term is:", opts: ["27", "29", "32", "30"], a: 1, why: "aₙ = a + (n−1)d = 2 + 9×3 = 29. (Arithmetic Progressions)" },
    { q: "If sin θ = 3/5, then cos θ equals (θ acute):", opts: ["4/5", "5/4", "3/4", "5/3"], a: 0, why: "cos θ = √(1 − 9/25) = 4/5. (Trigonometry)" },
    { q: "The pair of equations x + y = 5 and 2x + 2y = 10 has:", opts: ["one solution", "no solution", "infinitely many solutions", "two solutions"], a: 2, why: "The second is just 2× the first — coincident lines. (Linear Equations)" },
    { q: "Area of a triangle with base 12 cm and height 5 cm:", opts: ["60 cm²", "30 cm²", "17 cm²", "120 cm²"], a: 1, why: "½ × base × height = ½ × 12 × 5 = 30 cm². (Triangles / Mensuration)" },
    { q: "The graph of y = 2x + 1 cuts the y-axis at:", opts: ["(0, 1)", "(1, 0)", "(0, 2)", "(2, 0)"], a: 0, why: "Put x = 0 → y = 1. (Coordinate Geometry)" },
  ],
  sci: [
    { q: "Which gas is released when dilute HCl reacts with zinc metal?", opts: ["Oxygen", "Hydrogen", "Chlorine", "Carbon dioxide"], a: 1, why: "Zn + 2HCl → ZnCl₂ + H₂↑. (Acids, Bases and Salts)" },
    { q: "The SI unit of electric current is:", opts: ["Volt", "Ohm", "Ampere", "Watt"], a: 2, why: "Current is measured in amperes (A). (Electricity)" },
    { q: "Photosynthesis takes place in the:", opts: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], a: 1, why: "Chloroplasts contain chlorophyll which traps sunlight. (Life Processes)" },
    { q: "A concave mirror forms a real image when the object is:", opts: ["at the focus", "beyond the focus", "between pole and focus", "at the pole"], a: 1, why: "Beyond F, reflected rays actually meet → real image. (Light)" },
    { q: "The functional unit of the kidney is the:", opts: ["Neuron", "Nephron", "Alveoli", "Villus"], a: 1, why: "Each kidney has ~1 million nephrons filtering blood. (Life Processes)" },
    { q: "pH of a neutral solution at 25°C is:", opts: ["0", "7", "14", "1"], a: 1, why: "Neutral: [H⁺] = [OH⁻] → pH 7. (Acids, Bases and Salts)" },
    { q: "Which law states F = ma?", opts: ["Newton's first law", "Newton's second law", "Newton's third law", "Law of gravitation"], a: 1, why: "Force equals rate of change of momentum = m×a. (Force and Laws of Motion)" },
    { q: "Covalent bonds are formed by:", opts: ["transfer of electrons", "sharing of electrons", "loss of protons", "gain of neutrons"], a: 1, why: "Atoms share electron pairs to complete octets. (Carbon and its Compounds)" },
    { q: "The twinkling of stars is due to:", opts: ["reflection", "atmospheric refraction", "dispersion only", "scattering by dust"], a: 1, why: "Starlight bends repeatedly through air layers of varying density. (Human Eye)" },
    { q: "1 kWh equals:", opts: ["3.6 × 10⁶ J", "3.6 × 10³ J", "36 × 10⁵ J", "3.6 J"], a: 0, why: "1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J. (Electricity)" },
    { q: "Which part of the brain maintains posture and balance?", opts: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], a: 1, why: "The cerebellum coordinates precision and balance. (Control and Coordination)" },
    { q: "An element with atomic number 11 has valency:", opts: ["1", "2", "3", "7"], a: 0, why: "Na (2,8,1) loses 1 electron → valency 1. (Atoms / Periodic trends)" },
  ],
  sst: [
    { q: "The French Revolution began in the year:", opts: ["1776", "1789", "1804", "1799"], a: 1, why: "Storming of the Bastille, 14 July 1789. (Rise of Nationalism)" },
    { q: "Who led the Salt March (Dandi March) in 1930?", opts: ["Jawaharlal Nehru", "Sardar Patel", "Mahatma Gandhi", "Subhas Chandra Bose"], a: 2, why: "Gandhi walked 240 miles to break the salt law. (Nationalism in India)" },
    { q: "India adopted a federal system with how many levels of government?", opts: ["One", "Two", "Three", "Four"], a: 2, why: "Centre, State and Local (Panchayati Raj added in 1992). (Federalism)" },
    { q: "The 'Black Gold' of India refers to:", opts: ["Coal", "Petroleum", "Iron ore", "Manganese"], a: 1, why: "Petroleum — valuable and dark, like gold to the economy. (Resources)" },
    { q: "Which sector contributes most to India's GDP today?", opts: ["Primary", "Secondary", "Tertiary", "None"], a: 2, why: "Services (tertiary) contribute over 50% of GDP. (Sectors of Indian Economy)" },
    { q: "The Tropic of Cancer does NOT pass through:", opts: ["Rajasthan", "Odisha", "Kerala", "Tripura"], a: 2, why: "It crosses 8 states — Kerala lies well south of it. (Resources / Maps)" },
    { q: "Universal Adult Franchise means:", opts: ["educated voters only", "all adults can vote", "men vote first", "voting by property owners"], a: 1, why: "Every citizen 18+ can vote, without discrimination. (Constitutional Design)" },
    { q: "NREGA guarantees how many days of wage employment per year?", opts: ["50", "75", "100", "150"], a: 2, why: "100 days of guaranteed rural employment. (Development)" },
    { q: "The Treaty of Vienna (1815) was hosted by:", opts: ["Napoleon", "Metternich", "Bismarck", "Louis XVI"], a: 1, why: "Duke Metternich hosted the congress to undo Napoleonic changes. (Nationalism in Europe)" },
    { q: "Which river is called the 'Sorrow of Bengal'?", opts: ["Ganga", "Damodar", "Kosi", "Brahmaputra"], a: 1, why: "Damodar's frequent floods devastated the Hooghly basin. (Water Resources)" },
  ],
  eng: [
    { q: "In 'A Letter to God', Lencho wrote to God asking for:", opts: ["a new house", "100 pesos", "a bicycle", "rain to stop"], a: 1, why: "After the hailstorm, Lencho asked God for 100 pesos to restart. (First Flight)" },
    { q: "'The Road Not Taken' is written by:", opts: ["Robert Frost", "W.B. Yeats", "Amanda Gorman", "Leslie Norris"], a: 0, why: "Frost wrote it in 1915 about choices in life. (First Flight)" },
    { q: "In 'Dust of Snow', the bird that shakes the hemlock is a:", opts: ["sparrow", "crow", "robin", "parrot"], a: 1, why: "A crow shakes snow dust onto the poet, lifting his mood. (First Flight)" },
    { q: "Anne Frank wrote her diary while hiding in:", opts: ["Berlin", "Amsterdam", "Paris", "Vienna"], a: 1, why: "The Secret Annex in Amsterdam, 1942–44. (First Flight)" },
    { q: "The synonym of 'elated' is:", opts: ["sad", "overjoyed", "confused", "angry"], a: 1, why: "Elated means extremely happy and proud. (Vocabulary)" },
    { q: "In 'The Sermon at Benares', the Buddha teaches about:", opts: ["winning wars", "accepting loss and grief", "collecting wealth", "building temples"], a: 1, why: "Kisa Gotami learns that death is common to all. (First Flight)" },
    { q: "Choose the correct passive: 'She writes a letter.'", opts: ["A letter is written by her.", "A letter was written by her.", "A letter has written by her.", "A letter is writing by her."], a: 0, why: "Simple present passive = is/am/are + V3. (Grammar)" },
    { q: "'Two Stories about Flying' — the young seagull was afraid of:", opts: ["the sea", "flying over the great expanse", "his family", "the sun"], a: 1, why: "The vast expanse of sea below terrified him until hunger pushed him. (First Flight)" },
  ],
  hin: [
    { q: "'दो बैलों की कथा' के लेखक कौन हैं?", opts: ["प्रेमचंद", "हरिवंशराय बच्चन", "रामधारी सिंह दिनकर", "हजारी प्रसाद द्विवेदी"], a: 0, why: "प्रेमचंद ने हीरा-मोती की मार्मिक कथा लिखी। (क्षितिज)" },
    { q: "'उत्साह' कविता में किसका वर्णन है?", opts: ["फागुन की रात", "वर्षा ऋतु की रात", "शरद की सुबह", "ग्रीष्म की दोपहर"], a: 1, why: "रामधारी सिंह दिनकर ने मेघों और धरा का संवाद दिखाया। (क्षितिज)" },
    { q: "'अट नहीं रही' कविता किसने लिखी?", opts: ["सुमित्रानंदन पंत", "महावीर प्रसाद द्विवेदी", "मैथिलीशरण गुप्त", "निराला"], a: 0, why: "पंत जी की यह कविता प्रकृति-प्रेम से भरी है। (क्षितिज)" },
    { q: "संज्ञा के कितने भेद होते हैं?", opts: ["दो", "तीन", "चार", "पाँच"], a: 1, why: "व्यक्तिवाचक, जातिवाचक और भाववाचक। (व्याकरण)" },
    { q: "'क्षितिज' पाठ्यपुस्तक की शुरुआत किस प्रकरण से होती है?", opts: ["काव्य", "गीत", "गद्य", "निबंध"], a: 0, why: "पहला प्रकरण 'काव्य' है — सूर के पद आदि। (क्षितिज)" },
    { q: "'नेताजी का चश्मा' कहानी का लेखक है:", opts: ["स्वयं प्रकाश", "यशपाल", "अज्ञेय", "शिवानी"], a: 0, why: "स्वयं प्रकाश — एक टोल प्लाज़ा की देशभक्ति भरी कथा। (क्षितिज)" },
  ],
  it: [
    { q: "HTML stands for:", opts: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], a: 0, why: "HTML structures web pages. (Basics of Web Designing)" },
    { q: "Which of these is an input device?", opts: ["Monitor", "Printer", "Scanner", "Speaker"], a: 2, why: "A scanner sends data INTO the computer. (Computer System)" },
    { q: "In a spreadsheet, every formula starts with:", opts: ["#", "=", "@", "$"], a: 1, why: "e.g., =SUM(A1:A5). (Spreadsheets)" },
    { q: "Phishing is a type of:", opts: ["game", "cyber fraud", "backup", "browser"], a: 1, why: "Fake messages trick you into revealing private data. (Cyber Safety)" },
    { q: "1 KB equals:", opts: ["1000 bits", "1024 bytes", "1024 bits", "100 bytes"], a: 1, why: "1 KB = 2¹⁰ bytes = 1024 bytes. (IT Basics)" },
    { q: "Which tag creates a hyperlink in HTML?", opts: ["<link>", "<a>", "<href>", "<url>"], a: 1, why: "<a href=\"...\">text</a> creates anchors. (HTML)" },
  ],
  ai: [
    { q: "The first stage of the AI Project Cycle is:", opts: ["Data acquisition", "Problem scoping", "Modelling", "Evaluation"], a: 1, why: "Define the problem (4Ws) before anything else. (AI Project Cycle)" },
    { q: "Which is NOT a domain of AI?", opts: ["Computer Vision", "NLP", "Data Science", "Word Processing"], a: 3, why: "AI domains: Data, CV and NLP. (Intro to AI)" },
    { q: "The 4Ws of problem scoping are Who, What, Where and:", opts: ["When", "Why", "Which", "How"], a: 2, why: "Who, What, Where, Which — the problem statement canvas. (AI Project Cycle)" },
    { q: "Siri and Alexa are examples of:", opts: ["Computer Vision", "Natural Language Processing", "Robotics", "Databases"], a: 1, why: "They understand and generate human language. (Intro to NLP)" },
    { q: "A trained AI model that gives wrong outputs on new data may suffer from:", opts: ["overfitting", "under-coding", "over-voltage", "under-age"], a: 0, why: "Overfitting: memorised training data, fails on new data. (Evaluation)" },
    { q: "Using AI to spread fake news violates:", opts: ["AI ethics", "AI speed", "AI storage", "AI design"], a: 0, why: "Ethics asks us to use AI responsibly. (AI Ethics)" },
  ],
  phy: [
    { q: "The SI unit of electric charge is:", opts: ["Ampere", "Coulomb", "Volt", "Farad"], a: 1, why: "1 C = 1 A × 1 s. (Electric Charges and Fields)" },
    { q: "According to Ohm's law, V = IR holds when:", opts: ["temperature varies", "temperature is constant", "current is AC", "resistance is zero"], a: 1, why: "Ohm's law is valid at constant physical conditions. (Current Electricity)" },
    { q: "The phenomenon of electromagnetic induction was discovered by:", opts: ["Newton", "Faraday", "Ampere", "Coulomb"], a: 1, why: "Faraday (1831): changing flux induces emf. (Electromagnetic Induction)" },
    { q: "The power of a lens is measured in:", opts: ["Watt", "Dioptre", "Metre", "Lumen"], a: 1, why: "P = 1/f (f in metres). (Ray Optics)" },
    { q: "In an intrinsic semiconductor, current is carried by:", opts: ["electrons only", "holes only", "both electrons and holes", "protons"], a: 2, why: "Thermal pairs create equal electrons and holes. (Semiconductors)" },
    { q: "The dimensional formula of force is:", opts: ["[MLT⁻²]", "[ML²T⁻²]", "[MLT⁻¹]", "[ML⁻¹T²]"], a: 0, why: "F = ma → kg·m/s². (Units and Measurements)" },
    { q: "Work done by a centripetal force in one full revolution is:", opts: ["maximum", "zero", "negative", "mv²/r"], a: 1, why: "Force ⊥ displacement at every instant. (Work, Energy and Power)" },
    { q: "The time period of a simple pendulum depends on:", opts: ["mass", "amplitude (small)", "length and g", "colour"], a: 2, why: "T = 2π√(L/g). (Oscillations)" },
    { q: "A p-n junction diode conducts when:", opts: ["reverse biased", "forward biased", "unbiased", "heated"], a: 1, why: "Forward bias lowers the barrier potential. (Semiconductors)" },
    { q: "Lenz's law is a consequence of conservation of:", opts: ["charge", "energy", "momentum", "mass"], a: 1, why: "Induced current opposes the change that created it. (Electromagnetic Induction)" },
  ],
  chem: [
    { q: "The IUPAC name of CH₃–CH₂–OH is:", opts: ["Methanol", "Ethanol", "Propanol", "Ethanal"], a: 1, why: "2-carbon chain + -ol suffix. (Alcohols / Organic basics)" },
    { q: "Avogadro's number is approximately:", opts: ["6.022 × 10²³", "3.14 × 10²³", "6.022 × 10²²", "9.1 × 10²³"], a: 0, why: "Particles in one mole of a substance. (Mole Concept)" },
    { q: "The oxidation state of Mn in KMnO₄ is:", opts: ["+5", "+6", "+7", "+4"], a: 2, why: "K(+1) + Mn + 4×(−2) = 0 ⇒ Mn = +7. (Redox Reactions)" },
    { q: "Which quantum number describes the shape of an orbital?", opts: ["n", "l", "m", "s"], a: 1, why: "Azimuthal (l): s, p, d, f shapes. (Structure of Atom)" },
    { q: "Le Chatelier's principle applies to:", opts: ["irreversible reactions", "equilibrium systems", "nuclear reactions", "combustion only"], a: 1, why: "Equilibrium shifts to oppose any disturbance. (Equilibrium)" },
    { q: "The hybridisation of carbon in methane is:", opts: ["sp", "sp²", "sp³", "dsp²"], a: 2, why: "4 σ-bonds → tetrahedral sp³. (Chemical Bonding)" },
    { q: "pH of 0.001 M HCl is:", opts: ["1", "2", "3", "11"], a: 2, why: "[H⁺] = 10⁻³ → pH = 3. (Equilibrium)" },
    { q: "Markovnikov's rule is used to predict products of addition to:", opts: ["alkanes", "unsymmetrical alkenes", "benzene", "alcohols"], a: 1, why: "H adds to the carbon with more hydrogens. (Organic Chemistry)" },
  ],
  bio: [
    { q: "The powerhouse of the cell is the:", opts: ["Ribosome", "Mitochondrion", "Golgi body", "Nucleus"], a: 1, why: "Mitochondria produce ATP via respiration. (Cell Biology)" },
    { q: "In which phase of the cell cycle does DNA replicate?", opts: ["G1", "S", "G2", "M"], a: 1, why: "S phase = synthesis of DNA. (Cell Cycle)" },
    { q: "The pigment essential for photosynthesis is:", opts: ["Carotene", "Chlorophyll a", "Xanthophyll", "Melanin"], a: 1, why: "Chlorophyll a is the primary reaction-centre pigment. (Photosynthesis)" },
    { q: "Exchange of gases in the lungs occurs at the:", opts: ["Trachea", "Bronchi", "Alveoli", "Larynx"], a: 2, why: "Alveolar walls are one cell thick — ideal for diffusion. (Breathing)" },
    { q: "Mendel's law that explains the 3:1 ratio in F2 is the law of:", opts: ["Dominance", "Segregation", "Independent assortment", "Purity"], a: 1, why: "Alleles separate during gamete formation. (Inheritance)" },
    { q: "Insulin is secreted by the:", opts: ["Liver", "β-cells of pancreas", "Adrenal gland", "Thyroid"], a: 1, why: "β-cells of the Islets of Langerhans. (Control & Human Physiology)" },
    { q: "Which molecule carries genetic information?", opts: ["ATP", "DNA", "Glucose", "Haemoglobin"], a: 1, why: "DNA stores the blueprint of life. (Molecular Basis of Inheritance)" },
    { q: "Krebs cycle occurs in the:", opts: ["Cytoplasm", "Mitochondrial matrix", "Nucleus", "Chloroplast"], a: 1, why: "The matrix hosts the citric acid cycle. (Respiration in Plants)" },
  ],
  cs: [
    { q: "What is the output of: print(type(5/2)) in Python 3?", opts: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "Error"], a: 1, why: "/ always performs true division → float (2.5). (Python Basics)" },
    { q: "Which data type is immutable?", opts: ["list", "dictionary", "tuple", "set"], a: 2, why: "Tuples cannot be modified after creation. (Python Data Types)" },
    { q: "Boolean expression: True and False evaluates to:", opts: ["True", "False", "None", "Error"], a: 1, why: "AND needs both to be true. (Boolean Logic)" },
    { q: "Which keyword defines a function in Python?", opts: ["func", "define", "def", "lambda def"], a: 2, why: "def name(params): body. (Functions)" },
    { q: "Binary of decimal 10 is:", opts: ["1010", "1001", "1100", "1110"], a: 0, why: "8 + 2 = 1001… wait: 8+2 → 1010. (Number Systems)" },
    { q: "Which SQL command is DDL?", opts: ["SELECT", "UPDATE", "CREATE", "INSERT"], a: 2, why: "CREATE defines structure — Data Definition Language. (SQL)" },
    { q: "A stack works on the principle of:", opts: ["FIFO", "LIFO", "LILO", "Random"], a: 1, why: "Last In, First Out — like a pile of books. (Stack)" },
    { q: "Which of these is an output device?", opts: ["Keyboard", "Mouse", "Plotter", "Webcam"], a: 2, why: "A plotter prints large-format graphics. (Computer Systems)" },
  ],
  acc: [
    { q: "The basic accounting equation is:", opts: ["Assets = Liabilities + Capital", "Assets = Capital − Liabilities", "Capital = Assets + Liabilities", "Liabilities = Assets + Capital"], a: 0, why: "Every transaction keeps this balanced. (Introduction to Accounting)" },
    { q: "Purchase of machinery for cash affects:", opts: ["one account", "two accounts", "three accounts", "no account"], a: 1, why: "Machinery A/c debited, Cash A/c credited. (Recording Transactions)" },
    { q: "Depreciation is charged on:", opts: ["current assets", "fixed assets", "liabilities", "cash"], a: 1, why: "Fixed assets lose value with use and time. (Depreciation)" },
    { q: "BRS is prepared to reconcile:", opts: ["sales book", "cash book with pass book", "purchase book", "journal"], a: 1, why: "It explains differences between the two books. (Bank Reconciliation)" },
    { q: "In a company, shareholders are the:", opts: ["creditors", "owners", "debtors", "employees"], a: 1, why: "Shares represent ownership. (Accounting for Share Capital)" },
    { q: "A trial balance checks:", opts: ["profit", "arithmetical accuracy", "liquidity", "solvency"], a: 1, why: "Total debits must equal total credits. (Trial Balance)" },
  ],
  bst: [
    { q: "The first function of management is:", opts: ["Staffing", "Planning", "Directing", "Controlling"], a: 1, why: "Planning decides objectives and how to reach them. (Planning)" },
    { q: "ESOP stands for:", opts: ["Employee Stock Option Plan", "Executive Sales Operation Plan", "Enterprise System of Planning", "None"], a: 0, why: "Staff get options to buy shares. (Directing / Motivation)" },
    { q: "Which is NOT an element of directing?", opts: ["Supervision", "Motivation", "Leadership", "Budgeting"], a: 3, why: "Budgeting belongs to planning/financial management. (Directing)" },
    { q: "The marketing mix (4Ps) includes Product, Price, Place and:", opts: ["Profit", "Promotion", "People", "Power"], a: 1, why: "Promotion communicates value. (Marketing)" },
    { q: "SEBI regulates:", opts: ["banks", "securities market", "insurance only", "foreign trade"], a: 1, why: "Securities and Exchange Board of India. (Financial Markets)" },
    { q: "An entrepreneur bears:", opts: ["no risk", "risk and uncertainty", "only profit", "fixed salary"], a: 1, why: "Risk-bearing is the entrepreneur's reward claim. (Forms of Business)" },
  ],
  eco: [
    { q: "GDP measures:", opts: ["total population", "value of final goods & services within a country", "imports only", "government debt"], a: 1, why: "Domestic product within territorial boundaries. (National Income)" },
    { q: "The central bank of India is:", opts: ["SBI", "RBI", "NABARD", "SEBI"], a: 1, why: "Reserve Bank of India controls money supply. (Money and Banking)" },
    { q: "CPI stands for:", opts: ["Consumer Price Index", "Central Planning Institute", "Capital Price Index", "None"], a: 0, why: "CPI tracks retail inflation. (Money & Inflation)" },
    { q: "Which is a direct tax?", opts: ["GST", "Income tax", "Excise duty", "Customs duty"], a: 1, why: "Paid directly by the person on whom it is levied. (Budget)" },
    { q: "Disguised unemployment is common in:", opts: ["IT sector", "agriculture", "banking", "aviation"], a: 1, why: "More people work than needed — marginal productivity ≈ 0. (Employment)" },
    { q: "The year of India's Great Divide in population is:", opts: ["1911", "1921", "1931", "1947"], a: 1, why: "After 1921, population rose steadily. (Indian Economy)" },
  ],
  hist: [
    { q: "The Harappan city known for its Great Bath is:", opts: ["Harappa", "Mohenjodaro", "Lothal", "Kalibangan"], a: 1, why: "Mohenjodaro's tank may have been used for ritual bathing. (Bricks, Beads and Bones)" },
    { q: "Akbar's court chronicler Abul Fazl wrote the:", opts: ["Ain-i-Akbari", "Baburnama", "Humayunnama", "Rajatarangini"], a: 0, why: "Ain-i-Akbari records Akbar's administration. (Kings and Chronicles)" },
    { q: "The Revolt of 1857 began at:", opts: ["Delhi", "Meerut", "Kanpur", "Lucknow"], a: 1, why: "Sepoys at Meerut rose on 10 May 1857. (The Revolt of 1857)" },
    { q: "The Dandi March was a protest against the:", opts: ["land tax", "salt tax", "income tax", "water tax"], a: 1, why: "Gandhi chose salt as it touched every life. (Gandhi and the Movement)" },
    { q: "The capital of the Vijayanagara empire was at:", opts: ["Hampi", "Madurai", "Tanjore", "Warangal"], a: 0, why: "Hampi's ruins mark the glorious capital. (New Architecture)" },
    { q: "Ashoka's messages to his subjects were inscribed on:", opts: ["coins", "rocks and pillars", "palm leaves", "cloth"], a: 1, why: "Edicts on rocks and pillars spread Dhamma. (Mauryan Empire)" },
  ],
  polsci: [
    { q: "The Indian Constitution came into force on:", opts: ["26 Jan 1950", "15 Aug 1947", "26 Nov 1949", "2 Oct 1950"], a: 0, why: "Republic Day — the Constitution was adopted 26 Nov 1949, enforced 26 Jan 1950. (Constitution)" },
    { q: "India is a ___ type of federation.", opts: ["coming together", "holding together", "confederation", "unitary"], a: 1, why: "A strong centre held diverse states together. (Political Science)" },
    { q: "The maximum gap between two sessions of Parliament cannot exceed:", opts: ["3 months", "6 months", "9 months", "1 year"], a: 1, why: "Article 85 of the Constitution. (Legislature)" },
    { q: "Judicial review means the judiciary can:", opts: ["make laws", "strike down unconstitutional laws", "appoint ministers", "dissolve the house"], a: 1, why: "Courts guard the Constitution. (Judiciary)" },
    { q: "Which body conducts elections in India?", opts: ["UPSC", "Election Commission", "Parliament", "Cabinet"], a: 1, why: "An independent Election Commission. (Elections)" },
  ],
  geo: [
    { q: "The layer of the Earth we live on is the:", opts: ["Mantle", "Crust", "Outer core", "Inner core"], a: 1, why: "The crust — thinnest, outermost layer. (Interior of the Earth)" },
    { q: "Köppen's classification of climate is based on:", opts: ["soil", "vegetation and climate data", "population", "latitude only"], a: 1, why: "He used temperature & precipitation with vegetation. (Climate)" },
    { q: "The science of population study is called:", opts: ["Demography", "Geology", "Pedology", "Cosmology"], a: 0, why: "Demography = census of people. (World Population)" },
    { q: "Which activity belongs to the primary sector?", opts: ["Banking", "Mining", "Teaching", "Manufacturing"], a: 1, why: "Primary = extraction from nature. (Primary Activities)" },
    { q: "The Himalayas were formed by:", opts: ["volcanic action", "collision of plates", "glaciers", "wind erosion"], a: 1, why: "Indian plate colliding with the Eurasian plate. (Physical Geography)" },
  ],
  psy: [
    { q: "The father of psychoanalysis is:", opts: ["Freud", "Pavlov", "Skinner", "Piaget"], a: 0, why: "Sigmund Freud proposed the unconscious mind. (Self and Personality)" },
    { q: "Classical conditioning was demonstrated by:", opts: ["Pavlov's dogs", "Freud's dreams", "Kohler's apes", "Bandura's dolls"], a: 0, why: "Dogs salivated at a bell paired with food. (Learning)" },
    { q: "IQ is calculated as:", opts: ["MA/CA × 100", "CA/MA × 100", "MA × CA", "CA − MA"], a: 0, why: "Mental Age ÷ Chronological Age × 100. (Psychological Attributes)" },
    { q: "Maslow's hierarchy begins with which needs?", opts: ["Safety", "Esteem", "Physiological", "Belongingness"], a: 2, why: "Food, water, sleep come first. (Motivation)" },
    { q: "The forgetting curve was proposed by:", opts: ["Ebbinghaus", "Watson", "Jung", "Rogers"], a: 0, why: "Ebbinghaus showed memory fades fastest just after learning. (Memory)" },
  ],
};

/* ---------------- procedural generators (fresh numbers every run) ---------------- */

const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQ(q: string, answer: string, wrong: string[], why: string): Q {
  const opts = shuffled([answer, ...wrong]);
  return { q, opts, a: opts.indexOf(answer), why };
}

const MATH_GEN: Array<(chapter: string) => Q> = [
  (ch) => {
    const r1 = ri(1, 9), r2 = ri(1, 9);
    const b = r1 + r2, c = r1 * r2;
    return makeQ(
      `If the roots of x² − ${b}x + ${c} = 0 are α and β, then α + β equals:`,
      `${b}`, [`${c}`, `${b + ri(1, 3)}`, `${Math.abs(b - c) || b + 5}`],
      `Sum of roots = −(coefficient of x)/1 = ${b}. (${ch})`
    );
  },
  (ch) => {
    const a = ri(1, 9), d = ri(2, 9), n = ri(6, 15);
    const an = a + (n - 1) * d;
    return makeQ(
      `The ${n}th term of the AP ${a}, ${a + d}, ${a + 2 * d}, … is:`,
      `${an}`, [`${an + d}`, `${an - d}`, `${a * n}`],
      `aₙ = a + (n−1)d = ${a} + ${n - 1}×${d} = ${an}. (${ch})`
    );
  },
  (ch) => {
    const x = ri(2, 12), y = ri(2, 12);
    const dist = Math.hypot(x, y);
    const clean = Number.isInteger(dist);
    const ans = clean ? `${dist}` : `√${x * x + y * y}`;
    return makeQ(
      `The distance of the point (${x}, ${y}) from the origin is:`,
      ans, [`√${x * x + y * y + ri(2, 6)}`, `${x + y}`, `√${Math.abs(x * x - y * y) + 1}`],
      `√(${x}² + ${y}²) = ${ans}. (${ch})`
    );
  },
  (ch) => {
    const pairs: Array<[string, number, number]> = [["sin", 30, 0.5], ["cos", 60, 0.5], ["tan", 45, 1], ["sin", 90, 1], ["cos", 0, 1], ["tan", 30, 0.577]];
    const [fn, ang, val] = pairs[ri(0, pairs.length - 1)];
    const label = val === 0.577 ? "1/√3" : val === 0.5 ? "1/2" : "1";
    return makeQ(
      `The value of ${fn} ${ang}° is:`,
      label, ["√3/2", fn === "cos" ? "1/3" : "1/√2", "0"],
      `From the standard trigonometric table, ${fn} ${ang}° = ${label}. (${ch})`
    );
  },
  (ch) => {
    const a = ri(2, 9), b = ri(2, 9);
    const h = (a * b) / gcd(a, b), l = gcd(a, b);
    return makeQ(
      `The LCM of ${a * l} and ${b * l} is:`,
      `${a * b * l}`, [`${h}`, `${l}`, `${a * b * l + l}`],
      `LCM = product / HCF. HCF(${a * l}, ${b * l}) = ${l}, so LCM = ${a * b * l}. (${ch})`
    );
  },
  (ch) => {
    const s = ri(3, 12);
    return makeQ(
      `A die is rolled once. The probability of getting a number greater than ${Math.min(s, 5)} is:`,
      s >= 5 ? `${(6 - s)}/6` : `${(6 - s)}/6`,
      [`${s}/6`, `${Math.min(s + 1, 6)}/6`, "1/6"],
      `Favourable outcomes: ${6 - s} out of 6. (${ch})`
    );
  },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const PHY_GEN: Array<(chapter: string) => Q> = [
  (ch) => {
    const u = ri(0, 10), a = ri(1, 5), t = ri(2, 10);
    const v = u + a * t;
    return makeQ(
      `A body starts with u = ${u} m/s and accelerates at ${a} m/s² for ${t} s. Its final velocity is:`,
      `${v} m/s`, [`${u + a * t + ri(1, 4)} m/s`, `${a * t} m/s`, `${u * t} m/s`],
      `v = u + at = ${u} + ${a}×${t} = ${v} m/s. (${ch})`
    );
  },
  (ch) => {
    const m = ri(2, 20), a = ri(1, 9);
    return makeQ(
      `Force needed to accelerate a ${m} kg mass at ${a} m/s² is:`,
      `${m * a} N`, [`${m + a} N`, `${m * a + 10} N`, `${Math.abs(m - a) || 5} N`],
      `F = ma = ${m} × ${a} = ${m * a} N. (${ch})`
    );
  },
  (ch) => {
    const V = ri(2, 24), R = ri(1, 12);
    const I = V / R;
    const nice = Number.isInteger(I * 1000);
    const ans = Number.isInteger(I) ? `${I} A` : `${(V * 1000) / R} mA`;
    return makeQ(
      `A ${V} V battery is connected across a ${R} Ω resistor. The current is:`,
      ans, [`${V * R} A`, `${R} A`, `${V + R} A`],
      `I = V/R = ${V}/${R}${nice && Number.isInteger(I) ? "" : " A"} (${(V / R).toFixed(2)} A). (${ch})`
    );
  },
  (ch) => {
    const m = ri(2, 30), v = ri(2, 15);
    return makeQ(
      `Kinetic energy of a ${m} kg body moving at ${v} m/s is:`,
      `${(m * v * v) / 2} J`, [`${m * v} J`, `${m * v * v} J`, `${(m * v * v) / 2 + 5} J`],
      `KE = ½mv² = ½×${m}×${v}² = ${(m * v * v) / 2} J. (${ch})`
    );
  },
  (ch) => {
    const m = ri(20, 200), g = 10;
    return makeQ(
      `Weight of a ${m} kg object on Earth (g = ${g} m/s²) is:`,
      `${m * g} N`, [`${m} N`, `${m + g} N`, `${m * g / 2} N`],
      `W = mg = ${m} × ${g} = ${m * g} N. (${ch})`
    );
  },
];

const CHEM_GEN: Array<(chapter: string) => Q> = [
  (ch) => {
    const el: Array<[string, number]> = [["Na", 11], ["Mg", 12], ["Al", 13], ["Cl", 17], ["K", 19], ["Ca", 20], ["N", 7], ["O", 8]];
    const [sym, z] = el[ri(0, el.length - 1)];
    const config = z <= 10 ? `2, ${z - 2}` : `2, 8, ${z - 10}`;
    const val = z - 10 > 4 && z > 10 ? `${18 - z}` : z <= 10 ? `${z - 2 <= 4 ? z - 2 : 10 - z}` : `${z - 10}`;
    return makeQ(
      `Element ${sym} (Z = ${z}) has electronic configuration:`,
      config, [`2, 8, ${Math.max(1, z - 11)}`, `2, 7, ${Math.max(1, z - 9)}`, `2, 8, ${z - 9}`],
      `Fill shells 2, 8, … → ${config}; typical valency ${val}. (${ch})`
    );
  },
  (ch) => {
    const n = ri(2, 5);
    return makeQ(
      `How many molecules are in ${n} moles of water?`,
      `${n} × 6.022 × 10²³`, [`6.022 × 10²³`, `${n * 2} × 6.022 × 10²³`, `${n} × 10²³`],
      `Molecules = moles × Avogadro's number. (${ch})`
    );
  },
  (ch) => {
    const items: Array<[string, string]> = [["Lemon juice", "acidic"], ["Baking soda solution", "basic"], ["Pure water", "neutral"], ["Vinegar", "acidic"], ["Soap solution", "basic"]];
    const [name, kind] = items[ri(0, items.length - 1)];
    return makeQ(
      `${name} turns blue litmus paper:`,
      kind === "acidic" ? "red" : kind === "basic" ? "stays blue" : "stays blue",
      kind === "acidic" ? ["stays blue", "green", "colourless"] : ["red", "green", "yellow"],
      `${name} is ${kind}. Acids turn blue litmus red; bases don't change it. (${ch})`
    );
  },
  (ch) => {
    const masses: Array<[string, number]> = [["H₂O", 18], ["CO₂", 44], ["NaCl", 58.5], ["O₂", 32], ["N₂", 28]];
    const [f, mm] = masses[ri(0, masses.length - 1)];
    const m = mm * ri(2, 5);
    return makeQ(
      `Number of moles in ${m} g of ${f} (molar mass ${mm} g/mol):`,
      `${m / mm}`, [`${m * mm}`, `${mm / m}`, `${m}`],
      `n = m/M = ${m}/${mm} = ${m / mm} mol. (${ch})`
    );
  },
];

const GENERATORS: Partial<Record<SubjectId, Array<(ch: string) => Q>>> = {
  math: MATH_GEN,
  sci: [...PHY_GEN, ...CHEM_GEN],
  phy: PHY_GEN,
  chem: CHEM_GEN,
};

/* ---------------- assembly ---------------- */

export function buildQuiz(subject: SubjectId, chapter: string, count = 6): Q[] {
  const bank = B[subject] ?? [];
  const exact = shuffled(bank.filter((q) => q.why.includes(chapter.split(" ")[0])));
  const gens = GENERATORS[subject] ?? [];
  const pool: Q[] = [...exact];

  let guard = 0;
  while (pool.length < count && gens.length && guard < 40) {
    guard++;
    pool.push(gens[ri(0, gens.length - 1)](chapter));
  }
  const rest = shuffled(bank.filter((q) => !pool.includes(q)));
  for (const q of rest) if (pool.length < count) pool.push(q);

  return pool.slice(0, count).map((q) => {
    const order = q.opts.map((_, i) => i);
    const so = shuffled(order);
    return {
      q: q.q,
      opts: so.map((i) => q.opts[i]),
      a: so.indexOf(q.a),
      why: q.why,
    };
  });
}

export const GEN_STEPS = [
  "Consulting NCERT line by line…",
  "Inking fresh options…",
  "Balancing the difficulty curve…",
  "Cross-checking with the syllabus…",
  "Polishing explanations…",
];
