import type { SubjectId } from "../data/curriculum";

/* ------------------------------------------------------------------ */
/*  Long-answer (5 × 5 marks) question bank — chapter-tagged           */
/* ------------------------------------------------------------------ */

export interface EssayQ {
  q: string;
  key: string[]; // expected key points (AI grader looks for these)
  why: string; // model answer shown after grading
}

const E: Partial<Record<SubjectId, EssayQ[]>> = {
  math: [
    { q: "Prove that √5 is an irrational number.", key: ["assume", "rational", "p/q", "coprime", "square", "contradiction", "divisible"], why: "Assume √5 = p/q in lowest terms ⇒ 5q² = p² ⇒ 5 | p ⇒ p = 5k ⇒ q² = 5k² ⇒ 5 | q too — contradicting coprimality. Hence √5 is irrational. (Real Numbers)" },
    { q: "Explain the Euclidean division algorithm with an example.", key: ["dividend", "divisor", "quotient", "remainder", "lemma", "hcf"], why: "For positive integers a and b, there exist unique q, r with a = bq + r, 0 ≤ r < b. Repeated application (a = bq + r, then b = cr₁ + r₂ …) gives HCF as the last non-zero remainder. (Real Numbers)" },
    { q: "Derive the quadratic formula for ax² + bx + c = 0.", key: ["complete", "square", "discriminant", "b2", "roots"], why: "Divide by a, move c/a, add (b/2a)² to complete the square ⇒ (x + b/2a)² = (b² − 4ac)/4a² ⇒ x = (−b ± √(b² − 4ac))/2a. The term b² − 4ac is the discriminant. (Quadratic Equations)" },
    { q: "State and prove the Basic Proportionality (Thales) theorem.", key: ["area", "ratio", "parallel", "similar", "de"], why: "A line DE ∥ BC cutting AB, AC divides them proportionally: AD/DB = AE/EC. Proof via equal-height triangles: ar(ADE)/ar(DBE) = AD/DB and ar(ADE)/ar(DCE) = AE/EC; since △DBC and △EBC share base BC and lie between same parallels, ar(DBE) = ar(DCE). (Triangles)" },
    { q: "How do you find the sum of first n terms of an AP? Derive the formula.", key: ["sn", "reverse", "add", "first", "last", "d"], why: "Write Sₙ = a + (a+d) + … + [a+(n−1)d] and add it to the same sum reversed; every pair equals 2a+(n−1)d, giving 2Sₙ = n[2a+(n−1)d], so Sₙ = n/2[2a+(n−1)d]. (Arithmetic Progressions)" },
    { q: "Explain why the tangent at any point of a circle is perpendicular to the radius through that point.", key: ["shortest", "distance", "point", "inside", "perpendicular"], why: "Every other point on the tangent lies outside the circle, so its distance from the centre exceeds the radius. The radius to the point of contact is therefore the shortest distance from the centre to the line — and the shortest segment from a point to a line is the perpendicular one. (Circles)" },
    { q: "Prove that the lengths of tangents drawn from an external point to a circle are equal.", key: ["congruent", "right angle", "hypotenuse", "radius", "otp"], why: "In △OTP and △OTQ: OT common (hypotenuse), OP = OQ (radii), ∠P = ∠Q = 90° (tangent ⊥ radius). By RHS congruence TP = TQ. (Circles)" },
    { q: "Derive the empirical relationship between Mean, Median and Mode.", key: ["3 median", "mode", "mean", "frequency"], why: "From frequency-curve geometry, mode ≈ 3·median − 2·mean, i.e. 3M = L + F. It follows because the modal triangle's vertex projection divides the interval around median/mean asymmetrically in a moderately skewed distribution. (Statistics)" },
  ],
  sci: [
    { q: "Explain the process of photosynthesis with the balanced chemical equation.", key: ["chlorophyll", "sunlight", "carbon dioxide", "water", "glucose", "oxygen", "stomata"], why: "6CO₂ + 6H₂O —(sunlight, chlorophyll)→ C₆H₁₂O₆ + 6O₂. Light energy is trapped by chlorophyll, water is split (photolysis), CO₂ is fixed in the dark reaction into glucose; exchange occurs through stomata. (Life Processes)" },
    { q: "Differentiate between metals and non-metrients on the basis of physical and chemical properties.", key: ["lustre", "conduct", "malleable", "ductile", "oxide", "basic", "acidic"], why: "Metals: lustrous, malleable, ductile, good conductors, oxides basic, lose electrons (electropositive). Non-metals: dull, brittle, insulators (except graphite), oxides acidic, gain/share electrons. (Metals and Non-metals)" },
    { q: "Describe the human digestive system and the role of each gland.", key: ["salivary", "gastric", "liver", "bile", "pancreas", "enzymes", "villi", "absorption"], why: "Food path: buccal cavity (salivary amylase) → oesophagus → stomach (gastric HCl + pepsin) → small intestine (bile emulsifies fats; pancreatic enzymes digest carbs/proteins/fats) → absorption by villi → large intestine absorbs water. (Life Processes)" },
    { q: "Explain Ohm's law and derive the expression for equivalent resistance in series and parallel.", key: ["voltage", "current", "proportional", "r1", "sum", "reciprocal"], why: "V ∝ I at constant temperature, V = IR. Series: same current flows, voltages add ⇒ R = R₁+R₂+R₃. Parallel: same voltage, currents add ⇒ 1/R = 1/R₁ + 1/R₂ + 1/R₃. (Electricity)" },
    { q: "What is a decomposition reaction? Give thermal, electrolytic and photolytic examples with equations.", key: ["breaks", "single", "simpler", "heat", "electricity", "light", "caco3"], why: "One reactant splits into simpler products. Thermal: CaCO₃ →(heat) CaO + CO₂. Electrolytic: 2H₂O →(electricity) 2H₂ + O₂. Photolytic: 2AgCl →(sunlight) 2Ag + Cl₂. (Chemical Reactions)" },
    { q: "Explain how the human eye sees near and distant objects (accommodation).", key: ["ciliary", "lens", "focal length", "relaxed", "power", "near point"], why: "Ciliary muscles change lens curvature: for distant objects muscles relax, lens thins, focal length increases; for near objects they contract, lens thickens, power increases — keeping the image on the retina. This ability is accommodation; least distance of distinct vision ≈ 25 cm. (Human Eye)" },
    { q: "Describe Newton's three laws of motion with real-life examples.", key: ["inertia", "f ma", "action", "reaction", "momentum"], why: "1st (inertia): passenger jerks forward when a bus stops. 2nd: F = ma / rate of change of momentum — a cricket player lowers hands while catching. 3rd: action–reaction pairs act on different bodies — swimming, rocket launch. (Force and Laws of Motion)" },
    { q: "Explain the process of double circulation in humans and why it is essential.", key: ["heart", "twice", "auricle", "ventricle", "oxygenated", "deoxygenated", "warm blooded"], why: "Blood passes through the heart twice per cycle: pulmonary circuit (right ventricle → lungs → left atrium) and systemic circuit (left ventricle → body → right atrium). Separation keeps oxygenated and deoxygenated blood apart, delivering high-energy oxygen efficiently — essential for warm-blooded birds and mammals. (Life Processes)" },
  ],
  sst: [
    { q: "Explain the causes and consequences of the French Revolution.", key: ["estate", "taxes", "rousseau", "bread", "bastille", "napoleon", "liberty"], why: "Causes: absolute monarchy, privileged First/Second Estates taxing the Third, Enlightenment ideas (Rousseau, Montesquieu), famine and debt. Consequences: end of feudalism, Declaration of the Rights of Man, rise of Napoleon, and the spread of modern nationalism and democratic ideals. (The French Revolution)" },
    { q: "Describe the features of the Indian Constitution.", key: ["preamble", "fundamental rights", "directive", "federal", "secular", "franchise", "independent judiciary"], why: "Lengthiest written constitution; Preamble (justice, liberty, equality, fraternity); Fundamental Rights & Duties; Directive Principles; quasi-federal structure with unitary bias; secular, democratic republic; universal adult franchise; independent three-tier judiciary; single citizenship. (Constitutional Design)" },
    { q: "Explain the non-cooperation movement and why it was withdrawn.", key: ["khilafat", "salt", "charkha", "swaraj", "chauri chaura", "violence", "withdraw"], why: "Launched 1920: boycott of schools, courts, foreign cloth; promotion of khadi and national schools; aimed at Swaraj through constitutional means. Withdrawn February 1922 after the Chauri Chaura incident where a mob burnt 22 policemen — Gandhi halted the mass movement to keep it non-violent. (Nationalism in India)" },
    { q: "Distinguish between renewable and non-renewable resources with examples and conservation measures.", key: ["exhaustible", "solar", "coal", "recycle", "reduce", "afforestation"], why: "Renewables replenish quickly (solar, wind, water, forests if managed); non-renewables take millions of years and exhaust (coal, petroleum, minerals). Conservation: Reduce–Reuse–Recycle, rainwater harvesting, afforestation, alternate energy, planned mining. (Resources and Development)" },
    { q: "Why does India have a diversity of climates? Explain the controlling factors.", key: ["latitude", "altitude", "distance from sea", "monsoon", "jet stream", "el nino"], why: "Latitude (Tropic of Cancer splits the country), altitude (Himalayan coolness), differential heating land/sea (land breezes), the Himalaya blocking cold winds, monsoon wind system with advancing/retreating branches, upper-air troughs/jet streams, and El Niño effects on cyclonic activity. (Climate)" },
    { q: "Explain the importance of agriculture in India and problems faced by farmers.", key: ["employment", "food security", "monsoon", "small holdings", "debt", "irrigation"], why: "Agriculture employs nearly half the workforce, supplies raw materials and ensures food security. Problems: dependence on erratic monsoon, fragmented small holdings, outdated inputs, rural indebtedness, poor storage/marketing. Measures: MSP, KCC loans, micro-irrigation, e-NAM, crop diversification. (Farming)" },
  ],
  eng: [
    { q: "What lesson about choices does 'The Road Not Taken' convey? Support with lines.", key: ["diverged", "choice", "less traveled", "difference", "regret", "metaphor"], why: "Frost uses two roads as a metaphor for life's decisions: the traveller picks 'the one less travelled by' and knows 'that has made all the difference.' The poem gently mocks our tendency to romanticise choices afterwards while stressing that decisions are irreversible. (First Flight)" },
    { q: "Compare Lencho's faith in God with Postmaster General's character in 'A Letter to God'.", key: ["faith", "harvest", "hailstorm", "generosity", "compassion", "irony"], why: "Lencho's unshakeable faith writes to God demanding 100 pesos; the postmaster, touched, collects money from staff — showing human kindness mirrors divine answers. The dramatic irony: Lencho blames 'bunch of crooks' for the shortfall, never seeing the humans who answered him. (First Flight)" },
    { q: "Discuss Anne Frank's view that 'people are truly good at heart.'", key: ["optimism", "war", "hatred", "believe", "diary", "hope"], why: "Despite two years in hiding and the horrors of Nazi persecution, Anne refuses to abandon hope: she 'believes people are truly good at heart,' seeing war as a self-inflicted madness of grown-ups. Her optimism, written amid fear, remains the diary's moral core. (First Flight)" },
    { q: "What values does Nelson Mandela highlight in 'Long Walk to Freedom'?", key: ["courage", "freedom", "apartheid", "equality", "sacrifice", "democracy"], why: "Mandela redefines courage as triumph over fear, not absence of it; describes both his own and apartheid's distorted freedom — the oppressor chained by prejudice, the oppressed by dehumanisation — and commits to a democratic, colourless South Africa built on equality and reconciliation. (First Flight)" },
    { q: "Explain the central idea of 'The Sermon at Benares' about death and grief.", key: ["death", "common", "wisdom", "grief", "immortal", "acceptance"], why: "Through Kisa Gotami's loss of her son, the Buddha teaches that death is the one law common to all — young and old, wise and foolish. Grief is natural but mourning cannot restore life; accepting this truth transforms sorrow into peace and wisdom. (First Flight)" },
  ],
  hin: [
    { q: "『दो बैलों की कथा』 से हमें क्या शिक्षा मिलती है ? समीक्षा कीजिए।", key: ["शिक्षा", "मित्रता", "लालच", "किसान", "प्रेम", "त्याग"], why: "जयशंकर प्रसाद ने दो बैलों की अटूट मित्रता का चित्रण किया है। एक बैल के मरने पर दूसरा दुःख से प्राण त्याग देता है। रचना में मित्रता, प्रेम और त्याग की परम्परागत शिक्षा के साथ-साथ लालच और हिंसा की निन्दा की गई है। (पाठ्यक्रम)" },
    { q: "『ल्हासा की ओर』 में यात्रा के कठिन पर्वतीय परिदृश्य का वर्णन कीजिए।", key: ["हिमालय", "यात्रा", "कठिनाई", "प्रकृति", "बर्फ", "आनन्द"], why: "उपेंद्रनाथ अश्क ने हिमालय की यात्रा को जीवंत बनाया है — बर्फ की चोटियाँ, संकरी घाटियाँ, ठंडी हवाएँ और रास्ते की कठिनाइयाँ; फिर भी हर कठिनाई में यात्री का उत्साह और प्रकृति-प्रेम दिखता है। (पाठ्यक्रम)" },
    { q: "『साँवले सपनों की याद』 शीर्षक की सार्थकता बताइए।", key: ["सपने", "बचपन", "गाँव", "यादें", "भविष्य", "कवि"], why: "कुवल्याराम जी का यह काव्य बचपन के गाँव, प्रकृति और स्वप्नों की कोमल यादों से भरा है। 'साँवले सपने' मासूम आकांक्षाओं का प्रतीक हैं जो स्मृतियों में आज भी जीवंत हैं। (पाठ्यक्रम)" },
    { q: "『प्रेमचंद के फटे जूते』 में आचार्य विनोबा भावे के व्यक्तित्व का चित्रण कीजिए।", key: ["सरलता", "त्याग", "जूते", "भूदान", "विनम्रता", "सेवा"], why: "फटे जूते पहनकर भी आचार्य विनोबा में असीम आत्मविश्वास, सरलता और लोकसेवा की भावना थी। वे धन-ऐश्वर्य के स्थान पर त्याग और भूदान आंदोलन के माध्यम से जन-जन को जागृत करते थे। (पाठ्यक्रम)" },
  ],
  phy: [
    { q: "Derive the three equations of motion graphically for uniformly accelerated motion.", key: ["velocity", "time", "slope", "area", "displacement", "acceleration"], why: "From v-t graph: slope = a gives v = u + at; area under curve gives s = ut + ½at²; eliminating t between the first two yields v² = u² + 2as. (Motion)" },
    { q: "State Gauss's law and derive the electric field due to an infinitely long straight charged wire.", key: ["flux", "closed surface", "cylinder", "enclosed charge", "permittivity", "lambda"], why: "Φ = q_enc/ε₀. Choose a cylindrical Gaussian surface of radius r, length l around the wire: flux = E·2πrl, enclosed charge λl ⇒ E = λ/(2πε₀r), directed radially. (Electrostatics)" },
    { q: "Derive an expression for the magnetic force on a moving charge and explain the direction rule.", key: ["qvB", "cross product", "perpendicular", "fleming", "circle", "cyclotron"], why: "F = qv × B; magnitude qvB sinθ. Direction by right-hand rule (for +q). When v ⊥ B the charge moves in a circle of radius mv/qB with cyclotron frequency qB/2πm — the basis of velocity selectors and mass spectrometers. (Moving Charges and Magnetism)" },
    { q: "Expose Huygens' principle and derive the laws of reflection.", key: ["wavefront", "secondary", "envelope", "angle", "equal", "normal"], why: "Every point of a wavefront acts as a source of secondary wavelets; the new front is their envelope. Applying this to a plane reflector, the reflected wavefront makes equal angles with the mirror on opposite sides of the normal ⇒ ∠i = ∠r, and both rays lie in the plane of incidence. (Wave Optics)" },
    { q: "Derive the lens maker's formula and define power of a lens.", key: ["refraction", "radius", "refractive index", "focal length", "dioptre", "1f"], why: "Applying refraction at both spherical surfaces and adding: 1/f = (μ−1)(1/R₁ − 1/R₂). Power P = 1/f (metres), measured in dioptres; powers of thin lenses in contact add. (Ray Optics)" },
    { q: "Explain Bohr's postulates and derive the radius and energy of hydrogen orbits.", key: ["stationary", "angular momentum", "quantum", "centripetal", "ground state", "13.6"], why: "Electrons revolve in stationary orbits without radiating; angular momentum is quantised mvr = nh/2π. Balancing Coulomb and centripetal forces gives rₙ = 0.529n² Å and Eₙ = −13.6/n² eV; photon emission during jumps explains the spectral lines. (Atoms)" },
  ],
  chem: [
    { q: "State Raoult's law and explain deviations from ideal solutions with examples.", key: ["vapour pressure", "mole fraction", "positive deviation", "negative deviation", "azeotrope"], why: "For volatile solutes, pᵢ = pᵢ°·xᵢ; total pressure is the mole-fraction-weighted sum. Positive deviations (weaker A–B forces, e.g. ethanol + acetone) give higher vapour pressure; negative deviations (stronger A–B, e.g. chloroform + acetone) give lower. Extreme cases form azeotropes. (Solutions)" },
    { q: "Explain electrochemical extraction of metals with the example of metallurgy of aluminium.", key: ["froth floatation", "calcination", "reduction", "electrolysis", "cryolite", "hall"], why: "Concentration (froth floatation) → calcination/roasting to oxide → reduction. Aluminium (Hall–Héroult): alumina dissolved in molten cryolite at ~950 °C is electrolysed; Al³⁺ reduced at the carbon cathode, O²⁻ oxidised at anodes (consumed as CO₂). Highly electropositive metals need electrolytic routes. (General Principles)" },
    { q: "Derive the integrated rate equation for a first-order reaction and define half-life.", key: ["ln", "concentration", "time", "rate constant", "half life", "693"], why: "For rate = k[A]: d[A]/[A] = −kt dt integrating gives ln([A]₀/[A]) = kt, i.e. [A] = [A]₀e^(−kt). Half-life t½ = 0.693/k, independent of initial concentration — proven by radioactive decay and acid hydrolysis of sucrose. (Chemical Kinetics)" },
    { q: "Explain crystal field splitting in octahedral complexes and its effect on colour.", key: ["d orbitals", "t2g", "eg", "splitting", "ligands", "transition metal"], why: "Approaching ligands raise eg orbitals (dz², dx²−y²) and lower t2g (dxy, dyz, dzx) by Δo. d–d transitions absorbing visible light of energy Δo give complexes their colour; strong-field ligands cause pairing (low spin), weak-field give high spin. (Coordination Compounds)" },
    { q: "Differentiate SN1 and SN2 mechanisms with examples.", key: ["carbocation", "backside attack", "inversion", "rate", "tertiary", "primary"], why: "SN1: two steps, rate depends only on substrate (tertiary favoured), planar carbocation intermediate gives racemisation. SN2: single concerted step, backside attack, rate depends on both substrate and nucleophile (methyl/primary favoured), Walden inversion of configuration. (Haloalkanes)" },
    { q: "Explain the mechanism of electrophilic substitution in benzene (nitration).", key: ["electrophile", "nitronium", "sigma complex", "aromatic", "regen", "nitrobenzene"], why: "HNO₃ + H₂SO₄ generates NO₂⁺. Benzene π electrons attack NO₂⁺ forming a resonance-stabilised arenium (sigma) ion; loss of H⁺ restores aromaticity giving nitrobenzene. Aromatic stability explains why benzene prefers substitution over addition. (Hydrocarbons)" },
  ],
  bio: [
    { q: "Describe the stages of meiosis and its significance.", key: ["homologous", "crossing over", "reduction", "haploid", "two divisions", "variation"], why: "Meiosis I (reductional): prophase I with synapsis and crossing over, metaphase I, anaphase I separating homologues; Meiosis II (equational): sister chromatids separate. Four haploid cells result; crossing over and independent assortment generate genetic variation and maintain chromosome number across generations. (Reproduction)" },
    { q: "Explain the mechanism of transcription and translation in protein synthesis.", key: ["mrna", "rna polymerase", "codon", "ribosome", "trna", "anticodon", "polypeptide"], why: "Transcription: RNA polymerase copies the template DNA strand into mRNA (5'→3'). Translation: ribosome reads codons; charged tRNAs bring amino acids matching anticodons; peptide bonds form a polynucleotide chain until a stop codon releases the folded protein. (Molecular Basis)" },
    { q: "Describe the nitrogen cycle with all major steps.", key: ["fixation", "nitrification", "assimilation", "ammonification", "denitrification", "rhizobium"], why: "N₂ → fixation (industrial/electric/Rhizobium-Azotobacter) → NH₄⁺ → ammonification from dead matter → nitrification (Nitrosomonas: NH₄⁺→NO₂⁻; Nitrobacter: NO₂⁻→NO₃⁻) → assimilation by plants → denitrification (Pseudomonas) returns N₂ to air. (Ecosystem)" },
    { q: "Explain double fertilisation in flowering plants.", key: ["synergid", "egg", "endosperm", "triploid", "zygote", "pollen tube"], why: "The pollen tube discharges two male gametes: one fuses with the egg forming the diploid zygote (embryo); the other fuses with two polar nuclei forming the triploid primary endosperm nucleus (nutritive tissue). This simultaneous event is double fertilisation, unique to angiosperms. (Reproduction)" },
    { q: "Describe the structure of a neuron and the transmission of a nerve impulse.", key: ["dendrite", "axon", "myelin", "synapse", "depolarisation", "neurotransmitter"], why: "Cell body with dendrites receives signals; the myelinated axon conducts impulses saltatorily at nodes of Ranvier. Resting potential −70 mV reverses via Na⁺ influx (depolarisation) then repolarises by K⁺ efflux; at the synapse acetylcholine carries the message to the next cell. (Neural Control)" },
  ],
  cs: [
    { q: "Explain recursion with an example, and compare it with iteration.", key: ["base case", "recursive call", "stack", "factorial", "termination"], why: "Recursion solves a problem by calling itself on smaller inputs until a base case stops it (e.g. factorial(n) = n×factorial(n−1), base n≤1). Each call consumes stack space; iteration uses loops with explicit counters — usually faster and lighter, while recursion is clearer for tree/divide-and-conquer problems." },
    { q: "Differentiate between list, tuple, dictionary and set in Python with use cases.", key: ["mutable", "ordered", "key value", "unique", "immutable", "indexed"], why: "List: ordered, mutable, indexed. Tuple: ordered, immutable — safe constants/dictionary keys. Dict: unordered key→value mapping — fast lookups. Set: unordered unique elements — membership tests, deduplication. Choice depends on mutability and lookup needs." },
    { q: "Explain object-oriented programming concepts with Python examples.", key: ["class", "inheritance", "encapsulation", "polymorphism", "object", "self"], why: "A class is a blueprint; objects are instances. Encapsulation bundles data with methods (private via _/_ _ naming); inheritance lets subclasses reuse parent code; polymorphism allows same method names behaving differently (method overriding). Example: Animal.speak() overridden by Dog/Cat." },
    { q: "Explain database normalisation up to 3NF with an example.", key: ["redundancy", "functional dependency", "atomic", "candidate key", "transitive", "anomaly"], why: "1NF: atomic values, no repeating groups. 2NF: no partial dependency of non-keys on composite keys. 3NF: no transitive dependency (non-key depending on another non-key). Normalising a Student-Subjects table removes update/insert/delete anomalies and redundancy." },
  ],
  acc: [
    { q: "Distinguish between capital expenditure and revenue expenditure with examples.", key: ["asset", "permanent", "income statement", "recurring", "balance sheet"], why: "Capital expenditure buys/assets or improves long-term capacity (machine purchase, building construction) — appears in Balance Sheet, benefits several periods. Revenue expenditure keeps business running (salaries, repairs, rent) — charged to P&L each period. Carriage inward may be capital if for installing machinery." },
    { q: "Explain the preparation of a Manufacturing Account with its components.", key: ["raw material", "direct labour", "prime cost", "factory overhead", "works cost"], why: "Debit: raw material consumed (opening + purchases − closing), direct wages, direct expenses, factory/power costs; Credit: factory overheads incurred, closing WIP adjustments. Result: cost of production (works cost), which transfers to Trading A/c. (Cost Accounts)" },
    { q: "What are the objectives of Financial Statements? Explain any five.", key: ["true and fair", "profitability", "liquidity", "solvency", "decision", "stakeholders"], why: "To show true & fair profit/loss (P&L), financial position (Balance Sheet), cash flows; help management planning, investors' decisions, creditors assessing liquidity/solvency, government compliance, and comparison across periods. (Financial Statement Analysis)" },
    { q: "Explain the accounting treatment of goodwill under the write-off method.", key: ["creation", "old partners", "new profit sharing", "sacrifice ratio", "capital"], why: "When goodwill appears in books (raised for new partner's share), it must be written off among old partners in their old profit-sharing ratio at the time of admission/change, debiting their capitals — because goodwill was originally created by them, not the newcomer. (Partnership Accounts)" },
  ],
  bst: [
    { q: "Explain the principles of management given by Henri Fayol.", key: ["division of work", "authority", "discipline", "unity of command", "espirit de corps", "scalar"], why: "Fayol's 14 principles include division of work (efficiency via specialisation), authority-responsibility pair, discipline, unity of command (one boss), unity of direction, subordination of individual to general interest, remuneration, centralisation, scalar chain, order, equity, stability of tenure, initiative and esprit de corps. (Principles of Management)" },
    { q: "Differentiate between Direct and Indirect taxes with examples and merits.", key: ["incidence", "burden", "gst", "income tax", "progressive", "evasion"], why: "Direct taxes (income tax, corporate tax): incidence and impact on the same person, progressive, hard to evade but reduce saving incentives. Indirect (GST, customs): burden shifts to consumers, convenient and broad-based, but regressive — hit the poor proportionally harder. (Financial Markets)" },
    { q: "Explain the functions of marketing with reference to goods.", key: ["clustering", "standardisation", "storage", "transportation", "promotion", "distribution"], why: "Marketing functions: assembling/buying, storing warehousing, standardisation & grading, transportation, selling & advertising, financing, risk-bearing and market information. Together they bridge producers and consumers and create place, time, possession and utility." },
    { q: "What is delegation? Explain its elements and barriers to effective delegation.", key: ["authority", "responsibility", "accountability", "task", "power", "trust"], why: "Delegation = assigning tasks (authority) downward while accountability stays upward. Elements: responsibility, authority, accountability. Barriers: delegator fears losing control/mistakes, delegate lacks confidence/skills, poor communication, unclear expectations. (Organising)" },
  ],
  eco: [
    { q: "Explain the determination of equilibrium price with demand and supply.", key: ["intersection", "demand equals supply", "surplus", "shortage", "price mechanism", "ceteris paribus"], why: "Equilibrium is where quantity demanded equals quantity supplied. Above it, excess supply pushes price down; below, shortage pulls it up. The price mechanism (invisible hand) restores balance ceteris paribus; shifts in curves move equilibrium. (Price Determination)" },
    { q: "Describe the functions of the Central Bank (RBI).", key: ["banker", "currency", "lender of last resort", "credit control", "foreign exchange", "monetary policy"], why: "RBI issues currency, acts as banker/government's agent, lender of last resort to banks, controls credit via repo/CRR/open market operations, manages forex reserves and exchange rate, regulates payment systems, and conducts monetary policy for price stability and growth. (Money & Banking)" },
    { q: "Explain the types of elasticity of demand with examples.", key: ["price", "income", "cross", "percentage", "necessity", "luxury"], why: "Price elasticity: %ΔQ/%ΔP (necessities inelastic, luxuries elastic). Income elasticity: response to income (+ for normal/luxury, − for inferior). Cross elasticity: substitutes positive, complements negative. Degrees range from perfectly inelastic (life-saving drugs) to perfectly elastic (theoretical)." },
    { q: "What are government budgets? Explain types and the effects of a deficit budget.", key: ["revenue", "capital", "surplus", "deficit", "borrowing", "inflation"], why: "A budget estimates receipts (revenue + capital) and expenditure. Balanced/surplus/deficit types. Deficit spending boosts aggregate demand and infrastructure but risks inflation, crowding out private investment, and rising debt-servicing unless deficits finance productive assets. (Government Budget)" },
  ],
  hist: [
    { q: "Analyse the causes of the Revolt of 1857 and why it failed.", key: ["doctrine of lapse", "greased cartridges", "taxes", "east india", "leadership", "limited"], why: "Causes: annexations (Doctrine of Lapse, Awadh), heavy taxation, economic ruin of artisans, missionary activity, and the immediate spark — Enfield greased cartridges. Failure: limited geographic/social spread, no unified leadership, superior British communications/resources, and loyalist support from some princes. (Indian Modern History)" },
    { q: "Discuss the significance of the Indus Valley Civilisation's urban planning.", key: ["grid", "drainage", "citadel", "baked bricks", "granary", "mohenjo daro"], why: "Cities like Mohenjo-daro show grid streets, covered drains with manholes, standardized baked-brick sizes, a raised citadel (granary, Great Bath) and lower town housing — indicating civic authority, hygiene awareness and long-distance trade. Yet no temples/palaces found, leaving political structure debated. (Ancient India)" },
    { q: "Evaluate the reforms of Raja Ram Mohan Roy and the Brahmo Samaj.", key: ["sati", "widow remarriage", "monotheism", "education", "press", "social reform"], why: "Ram Mohan campaigned against sati (banned 1829), promoted women's education, widow remarriage and English/scientific learning; founded Brahmo Samaj (1828) preaching monotheism and opposing idolatry and caste rigidity — seeding the Bengal Renaissance and later reform movements. (Modern India)" },
  ],
  polsci: [
    { q: "Explain the doctrine of separation of powers and its relevance in India.", key: ["legislature", "executive", "judiciary", "checks", "montesquieu", "not rigid"], why: "Montesquieu argued dividing state power among legislature, executive and judiciary protects liberty. India adopts it softly (no strict US-style separation): the Council of Ministers sits within Parliament, yet judicial independence, basic structure doctrine and impeachment checks preserve functional autonomy. (Political Theory)" },
    { q: "What makes a State sovereign? Distinguish internal and external sovereignty.", key: ["territory", "population", "government", "sovereignty", "recognition", "supremacy"], why: "A State needs defined territory, permanent population, government and sovereignty. Internal sovereignty = supreme authority over all individuals/groups within borders; external sovereignty = independence from foreign control, free to make treaties/war/peace. Without either, statehood is incomplete (e.g. colonial dominions). (Political Theory)" },
    { q: "Analyse the challenges facing democracy in India.", key: ["caste", "money power", "criminalisation", "illiteracy", "centralisation", "participation"], why: "Challenges: vote-bank caste/communal politics, criminalisation and money in elections, weak party internal democracy, illiteracy and apathy, centralising tendencies vis-à-vis states, gender imbalance in representation. Deepening democracy needs electoral reforms, grassroots participation and judicial vigilance. (Constitution at Work)" },
  ],
  geo: [
    { q: "Explain the mechanism of the Indian monsoon and its variability.", key: ["differential heating", "itcz", "jet stream", "el nino", "burst", "rain shadow"], why: "Summer heating of the Tibetan Plateau creates low pressure pulling moisture-laden south-west trades; the ITCZ shifts north, the tropical easterly jet aids flow. Onset comes in bursts; variability from ENSO, Madden-Julian oscillation and track of depressions causes floods/droughts; the Western Ghats cast a rain shadow. (India Climate)" },
    { q: "Describe the factors influencing industrial location with examples.", key: ["raw material", "power", "labour", "market", "transport", "agglomeration"], why: "Weber's least-cost logic plus real-world pullers: weight-losing industries locate near raw materials (sugar, cement), perishables near markets (dairy), bulk users near ports (petrochemicals), skilled pools (Silicon Valley/Bengaluru IT), cheap power (aluminium), plus government policy and agglomeration economies. (Industrial Distribution)" },
    { q: "Explain the causes and remedies of soil erosion in India.", key: ["water", "wind", "deforestation", "overgrazing", "terracing", "afforestation"], why: "Causes: running water on slopes (gullies, badlands), wind in arid tracts, deforestation, overgrazing, faulty irrigation (salinity/alkalinity). Remedies: contour bunding & terracing, shelterbelts, afforestation, controlled grazing, gully plugging, strip cropping and watershed management programmes. (Soil-Water Resources)" },
  ],
  psy: [
    { q: "Explain Piaget's stages of cognitive development with examples.", key: ["sensorimotor", "preoperational", "concrete", "formal", "schema", "conservation"], why: "Sensorimotor (0–2): learning through senses/actions, object permanence; Preoperational (2–7): symbolic thought, egocentrism, no conservation; Concrete operational (7–11): logical reasoning on concrete problems, conservation achieved; Formal operational (11+): abstract/hypothetical thinking. Assimilation and accommodation drive schema change. (Developmental Psychology)" },
    { q: "Describe the classical conditioning experiments of Pavlin and apply the principles.", key: ["unconditioned", "conditioned stimulus", "association", "extinction", "generalisation", "salivation"], why: "Pavlov paired neutral bell (CS) with food (UCS) producing salivation (UCR); eventually the bell alone elicited conditioned salivation (CR). Principles: acquisition, extinction (CS without UCS), spontaneous recovery, generalisation and discrimination. Used in phobia therapy (counter-conditioning) and advertising. (Learning)" },
    { q: "Explain Maslow's hierarchy of needs and its educational implications.", key: ["physiological", "safety", "belonging", "esteem", "self actualisation", "deficiency"], why: "Needs ascend from physiological → safety → love/belonging → esteem → self-actualisation; lower deficiency needs must be reasonably met before growth motives emerge. In classrooms: hunger/safety first, inclusive climate, recognition, then creativity and mastery-focused learning. (Motivation)" },
  ],
};

const GENERIC: EssayQ[] = [
  { q: "Explain the importance of time management during board examinations.", key: ["planning", "revision", "strategy", "stress", "practice", "sleep"], why: "Plan subject-wise slots, prioritise high-weightage chapters, practise full-length papers under exam conditions, sleep well, and reserve buffer time for revision — consistency beats cramming." },
  { q: "Describe effective note-making techniques and how they aid revision.", key: ["outline", "keywords", "summary", "flowchart", "review", "active recall"], why: "Use headings, indentation, abbreviations and keywords; convert notes into flowcharts/mind maps; review with active recall rather than passive re-reading — retrieval practice strengthens memory." },
];

/* ------------------------------------------------------------------ */
/*  Local AI grader — scans a photo/PDF mark scheme vs key points      */
/* ------------------------------------------------------------------ */

export interface GradeResult {
  marks: number; // out of 5
  verdict: "correct" | "partial" | "incorrect" | "unreadable";
  matched: string[];
  missed: string[];
  feedback: string;
  ocrUsed: boolean;
}

/** lightweight OCR fallback: try window.Tesseract if present */
async function runOCR(file: File): Promise<string | null> {
  const w = window as any;
  if (!w.Tesseract) return null;
  try {
    const worker = await w.Tesseract.createWorker("eng");
    const { data } = await worker.recognize(file);
    await worker.terminate();
    return (data?.text ?? "").trim() || null;
  } catch {
    return null;
  }
}

const STOPWORDS = new Set(["the", "and", "with", "from", "that", "this", "are", "was", "for", "has", "have", "when", "which", "their", "there"]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Hindi-aware similarity: shared Devanagari stems count too */
function similarity(text: string, key: string): boolean {
  const tt = tokens(text);
  const kk = tokens(key);
  if (!kk.length) return false;
  const joined = tt.join(" ");
  return kk.some((k) =>
    joined.includes(k) ||
    tt.some((t) => (t.startsWith(k.slice(0, Math.max(3, k.length - 2))) || k.startsWith(t.slice(0, Math.max(3, t.length - 2)))))
  );
}

export async function gradeAnswer(params: {
  answer: string;
  file?: File | null;
  key: string[];
}): Promise<GradeResult> {
  let text = params.answer.trim();
  let ocrUsed = false;

  if (params.file) {
    const ocr = await runOCR(params.file);
    if (ocr) {
      text = (text + "\n" + ocr).trim();
      ocrUsed = true;
    }
  }

  if (!text) {
    return {
      marks: 0,
      verdict: "unreadable",
      matched: [],
      missed: params.key,
      feedback: "No readable content found. Type your answer or upload a clearer, well-lit photo of your handwritten page.",
      ocrUsed,
    };
  }

  const matched: string[] = [];
  const missed: string[] = [];
  for (const k of params.key) (similarity(text, k) ? matched : missed).push(k);

  const ratio = matched.length / Math.max(1, params.key.length);
  const words = text.split(/\s+/).length;
  const lengthBonus = words >= 40 ? 0.5 : words >= 20 ? 0.25 : 0;
  const raw = ratio * 4.5 + lengthBonus;
  const marks = Math.min(5, Math.max(ratio > 0 ? 1 : 0, Math.round(raw)));

  const verdict: GradeResult["verdict"] = ratio >= 0.7 ? "correct" : ratio >= 0.3 ? "partial" : "incorrect";

  const fb =
    verdict === "correct"
      ? `Strong answer! You covered ${matched.length}/${params.key.length} key points${ocrUsed ? " (scanned from your photo)" : ""}.`
      : verdict === "partial"
        ? `Partially correct — you mentioned ${matched.length}/${params.key.length} key points. Add: ${missed.slice(0, 3).join(", ")}.`
        : `This doesn't touch the expected key points yet. Focus on: ${params.key.slice(0, 4).join(", ")}.`;

  return { marks, verdict, matched, missed, feedback: fb, ocrUsed };
}

/* ------------------------------------------------------------------ */
/*  Assembly: pick 5 fresh long questions, shuffled options-free       */
/* ------------------------------------------------------------------ */

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildEssaySet(subject: SubjectId, count = 5): EssayQ[] {
  const bank = E[subject] ?? [];
  const picked = shuffled(bank).slice(0, count);
  let guard = 0;
  while (picked.length < count && guard < 20) {
    guard++;
    const g = shuffled(GENERIC);
    for (const q of g) {
      if (picked.length >= count) break;
      if (!picked.includes(q)) picked.push(q);
    }
  }
  return picked;
}
