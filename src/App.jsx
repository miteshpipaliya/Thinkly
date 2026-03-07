import { useState, useEffect, useRef } from "react";

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
const QUESTION_BANK = {
  Mathematics: {
    Trigonometry: [
      { id: "m1",  q: "If sinθ = 1/2, then θ = ?",           opts: ["30°","45°","60°","90°"],                                        ans: "30°",                       diff: "easy",   sol: "sin30° = 1/2, so θ = 30°." },
      { id: "m2",  q: "cos60° = ?",                           opts: ["1/2","√3/2","1/√2","0"],                                        ans: "1/2",                       diff: "easy",   sol: "cos60° = 1/2 by standard values." },
      { id: "m3",  q: "tan45° = ?",                           opts: ["0","1","√3","1/√3"],                                            ans: "1",                         diff: "easy",   sol: "tan45° = sin45°/cos45° = 1." },
      { id: "m4",  q: "sin²θ + cos²θ = ?",                   opts: ["0","1","2","−1"],                                               ans: "1",                         diff: "easy",   sol: "Fundamental Pythagorean identity." },
      { id: "m5",  q: "sec²θ − tan²θ = ?",                   opts: ["1","0","−1","2"],                                               ans: "1",                         diff: "medium", sol: "Identity: sec²θ − tan²θ = 1." },
      { id: "m6",  q: "sin(A+B) = ?",                         opts: ["sinA cosB + cosA sinB","sinA sinB − cosA cosB","cosA cosB − sinA sinB","None"], ans: "sinA cosB + cosA sinB", diff: "medium", sol: "Standard addition formula." },
      { id: "m7",  q: "cos(90°−θ) = ?",                      opts: ["cosθ","sinθ","tanθ","−cosθ"],                                  ans: "sinθ",                      diff: "easy",   sol: "Complementary angle identity." },
      { id: "m8",  q: "Value of sin0° is:",                   opts: ["0","1","−1","undefined"],                                       ans: "0",                         diff: "easy",   sol: "sin0° = 0 by definition." },
      { id: "m17", q: "tan(90°) is:",                         opts: ["0","1","undefined","√3"],                                       ans: "undefined",                 diff: "easy",   sol: "tan90° = sin90°/cos90° = 1/0 = undefined." },
      { id: "m18", q: "2sin45°·cos45° = ?",                   opts: ["1","√2","1/2","2"],                                             ans: "1",                         diff: "medium", sol: "2sin45°cos45° = sin90° = 1." },
    ],
    Determinants: [
      { id: "m9",  q: "|1 2; 3 4| = ?",                      opts: ["−2","2","10","−10"],                                            ans: "−2",                        diff: "easy",   sol: "(1×4) − (2×3) = 4−6 = −2." },
      { id: "m10", q: "If det(A) = 0, matrix A is:",          opts: ["Singular","Non-singular","Identity","Symmetric"],               ans: "Singular",                  diff: "easy",   sol: "A matrix with det=0 is singular (no inverse)." },
      { id: "m11", q: "|a 0; 0 b| = ?",                      opts: ["ab","a+b","0","a−b"],                                           ans: "ab",                        diff: "easy",   sol: "Diagonal matrix determinant = product of diagonal." },
      { id: "m12", q: "Cramer's rule is used to solve:",      opts: ["Linear equations","Quadratic equations","Integrals","Derivatives"], ans: "Linear equations",      diff: "medium", sol: "Cramer's rule uses determinants to solve linear systems." },
      { id: "m19", q: "det(I) where I is identity matrix:",   opts: ["0","1","−1","2"],                                               ans: "1",                         diff: "easy",   sol: "Determinant of identity matrix is always 1." },
      { id: "m20", q: "If two rows of a matrix are equal, det = ?", opts: ["0","1","−1","undefined"],                                 ans: "0",                         diff: "medium", sol: "Equal rows make determinant = 0." },
    ],
    Integration: [
      { id: "m13", q: "∫x dx = ?",                            opts: ["x²/2 + C","x² + C","2x + C","x/2 + C"],                       ans: "x²/2 + C",                  diff: "easy",   sol: "Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C." },
      { id: "m14", q: "∫cos x dx = ?",                        opts: ["sin x + C","−sin x + C","cos x + C","tan x + C"],               ans: "sin x + C",                 diff: "easy",   sol: "Standard integral." },
      { id: "m15", q: "∫eˣ dx = ?",                           opts: ["eˣ + C","eˣ/x + C","xeˣ + C","e + C"],                        ans: "eˣ + C",                    diff: "easy",   sol: "eˣ is its own integral." },
      { id: "m16", q: "∫1/x dx = ?",                          opts: ["ln|x| + C","1/x² + C","x⁻¹ + C","−1/x + C"],                  ans: "ln|x| + C",                 diff: "medium", sol: "Standard result." },
      { id: "m21", q: "∫sin x dx = ?",                        opts: ["−cos x + C","cos x + C","sin x + C","tan x + C"],              ans: "−cos x + C",                diff: "easy",   sol: "Standard integral." },
      { id: "m22", q: "∫x² dx = ?",                           opts: ["x³/3 + C","x³ + C","2x + C","3x³ + C"],                       ans: "x³/3 + C",                  diff: "easy",   sol: "Power rule: n=2, so x³/3 + C." },
    ],
    Statistics: [
      { id: "m23", q: "Mean of 2, 4, 6, 8, 10 is:",          opts: ["5","6","7","4"],                                                ans: "6",                         diff: "easy",   sol: "(2+4+6+8+10)/5 = 30/5 = 6." },
      { id: "m24", q: "Median of 3, 5, 7, 9, 11 is:",        opts: ["7","5","9","6"],                                                ans: "7",                         diff: "easy",   sol: "Middle value of ordered set = 7." },
      { id: "m25", q: "Mode is the value that appears:",      opts: ["Most frequently","Least frequently","In the middle","First"],   ans: "Most frequently",           diff: "easy",   sol: "Mode = most frequent value in dataset." },
      { id: "m26", q: "Variance = ?",                         opts: ["Mean of squared deviations","Square root of SD","Sum of values","Mean × SD"], ans: "Mean of squared deviations", diff: "medium", sol: "Variance = Σ(x−x̄)²/n." },
    ],
  },
  Physics: {
    Mechanics: [
      { id: "p1",  q: "Newton's second law: F = ?",           opts: ["ma","mv","m/a","a/m"],                                         ans: "ma",                        diff: "easy",   sol: "Force = mass × acceleration." },
      { id: "p2",  q: "Unit of force is:",                    opts: ["Newton","Joule","Watt","Pascal"],                               ans: "Newton",                    diff: "easy",   sol: "SI unit of force is Newton (N)." },
      { id: "p3",  q: "g on Earth ≈ ?",                       opts: ["9.8 m/s²","8.9 m/s²","10.8 m/s²","6.7 m/s²"],                 ans: "9.8 m/s²",                  diff: "easy",   sol: "Standard gravitational acceleration." },
      { id: "p4",  q: "Momentum = ?",                         opts: ["mv","m/v","ma","F×t"],                                         ans: "mv",                        diff: "easy",   sol: "p = mass × velocity." },
      { id: "p5",  q: "Work done = ?",                        opts: ["F·d·cosθ","F/d","F+d","F·d²"],                                 ans: "F·d·cosθ",                  diff: "medium", sol: "W = F × d × cosθ." },
      { id: "p6",  q: "Kinetic energy = ?",                   opts: ["½mv²","mv²","m²v","2mv"],                                      ans: "½mv²",                      diff: "easy",   sol: "KE = ½mv²." },
      { id: "p7",  q: "Law of conservation of energy:",       opts: ["Energy cannot be created or destroyed","Energy = mass × c²","PE is always zero","KE is conserved alone"], ans: "Energy cannot be created or destroyed", diff: "easy", sol: "First law of thermodynamics." },
      { id: "p8",  q: "Velocity of light c ≈ ?",             opts: ["3×10⁸ m/s","3×10⁶ m/s","3×10¹⁰ m/s","3×10⁴ m/s"],             ans: "3×10⁸ m/s",                 diff: "easy",   sol: "Speed of light in vacuum." },
      { id: "p12", q: "Unit of pressure is:",                 opts: ["Pascal","Newton","Watt","Joule"],                               ans: "Pascal",                    diff: "easy",   sol: "Pressure = Force/Area, unit = Pascal (Pa)." },
      { id: "p13", q: "Newton's first law is also called:",   opts: ["Law of Inertia","Law of Momentum","Law of Gravity","Law of Action"], ans: "Law of Inertia",       diff: "easy",   sol: "First law states body stays at rest unless acted on by a force." },
    ],
    Waves: [
      { id: "p9",  q: "Speed of sound in air ≈ ?",           opts: ["343 m/s","243 m/s","443 m/s","143 m/s"],                       ans: "343 m/s",                   diff: "easy",   sol: "At ~20°C, speed of sound ≈ 343 m/s." },
      { id: "p10", q: "Frequency × wavelength = ?",          opts: ["Speed","Amplitude","Energy","Period"],                          ans: "Speed",                     diff: "easy",   sol: "v = f × λ." },
      { id: "p11", q: "Unit of frequency is:",                opts: ["Hertz","Meter","Second","Newton"],                              ans: "Hertz",                     diff: "easy",   sol: "Hz = cycles per second." },
      { id: "p14", q: "Sound is a _____ wave:",               opts: ["Longitudinal","Transverse","Electromagnetic","Surface"],        ans: "Longitudinal",              diff: "medium", sol: "Sound travels as compression/rarefaction = longitudinal." },
      { id: "p15", q: "Pitch of sound depends on:",           opts: ["Frequency","Amplitude","Wavelength","Speed"],                   ans: "Frequency",                 diff: "easy",   sol: "Higher frequency = higher pitch." },
    ],
    Electricity: [
      { id: "p16", q: "Ohm's law: V = ?",                    opts: ["IR","I/R","R/I","I²R"],                                        ans: "IR",                        diff: "easy",   sol: "Voltage = Current × Resistance." },
      { id: "p17", q: "Unit of resistance is:",              opts: ["Ohm","Volt","Ampere","Watt"],                                   ans: "Ohm",                       diff: "easy",   sol: "Resistance is measured in Ohm (Ω)." },
      { id: "p18", q: "Power = ?",                           opts: ["VI","V/I","V+I","V²I"],                                        ans: "VI",                        diff: "easy",   sol: "P = Voltage × Current." },
      { id: "p19", q: "Resistors in series: total R = ?",    opts: ["R1+R2","R1×R2","R1/R2","R1−R2"],                               ans: "R1+R2",                     diff: "easy",   sol: "Series: total resistance = sum of all resistors." },
    ],
  },
  Chemistry: {
    "Atomic Structure": [
      { id: "c1",  q: "Atomic number = number of ?",          opts: ["Protons","Neutrons","Electrons","Nucleons"],                    ans: "Protons",                   diff: "easy",   sol: "Atomic number Z = number of protons." },
      { id: "c2",  q: "Mass number = protons + ?",            opts: ["Neutrons","Electrons","Quarks","Positrons"],                    ans: "Neutrons",                  diff: "easy",   sol: "A = Z + N." },
      { id: "c3",  q: "Electrons discovered by:",             opts: ["J.J. Thomson","Rutherford","Bohr","Chadwick"],                  ans: "J.J. Thomson",              diff: "medium", sol: "J.J. Thomson discovered electron in 1897." },
      { id: "c4",  q: "Neutron was discovered by:",           opts: ["Chadwick","Thomson","Rutherford","Bohr"],                       ans: "Chadwick",                  diff: "medium", sol: "James Chadwick discovered neutron in 1932." },
      { id: "c5",  q: "Maximum electrons in shell n = ?",     opts: ["2n²","n²","2n","n³"],                                          ans: "2n²",                       diff: "medium", sol: "Max electrons = 2n² per shell." },
      { id: "c6",  q: "Valence electrons of Carbon (Z=6):",   opts: ["4","2","6","3"],                                                ans: "4",                         diff: "easy",   sol: "Carbon config: 2,4 → 4 valence electrons." },
      { id: "c10", q: "Which particle has no charge?",        opts: ["Neutron","Proton","Electron","Positron"],                       ans: "Neutron",                   diff: "easy",   sol: "Neutron is electrically neutral." },
      { id: "c11", q: "Bohr's model is for which element?",   opts: ["Hydrogen","Helium","Carbon","Oxygen"],                          ans: "Hydrogen",                  diff: "medium", sol: "Bohr's model accurately describes hydrogen (1 electron)." },
    ],
    "Chemical Bonding": [
      { id: "c7",  q: "NaCl bond type is:",                   opts: ["Ionic","Covalent","Metallic","Hydrogen"],                       ans: "Ionic",                     diff: "easy",   sol: "Na donates e⁻ to Cl → ionic bond." },
      { id: "c8",  q: "H₂O has how many lone pairs on O?",    opts: ["2","1","3","0"],                                                ans: "2",                         diff: "medium", sol: "Oxygen has 2 bonding pairs + 2 lone pairs." },
      { id: "c9",  q: "Electronegativity decreases going:",   opts: ["Down a group","Across a period","None","Both"],                 ans: "Down a group",              diff: "medium", sol: "Electronegativity decreases down a group (larger atoms)." },
      { id: "c12", q: "H₂ molecule has which bond?",          opts: ["Covalent","Ionic","Metallic","Van der Waals"],                  ans: "Covalent",                  diff: "easy",   sol: "Two H atoms share electrons → covalent bond." },
      { id: "c13", q: "Ionic bonds form between:",            opts: ["Metal and non-metal","Two metals","Two non-metals","Two noble gases"], ans: "Metal and non-metal", diff: "easy",   sol: "Metal gives e⁻ to non-metal → ionic bond." },
    ],
    "Periodic Table": [
      { id: "c14", q: "Noble gases are in group:",            opts: ["18","1","17","2"],                                              ans: "18",                        diff: "easy",   sol: "Group 18 = noble gases (He, Ne, Ar, Kr, Xe, Rn)." },
      { id: "c15", q: "Halogens are in group:",               opts: ["17","18","1","16"],                                             ans: "17",                        diff: "easy",   sol: "Group 17 = halogens (F, Cl, Br, I)." },
      { id: "c16", q: "Atomic radius increases going:",       opts: ["Down a group","Across a period left to right","Up a group","None"], ans: "Down a group",          diff: "medium", sol: "More shells → larger radius going down." },
      { id: "c17", q: "Most electronegative element is:",     opts: ["Fluorine","Oxygen","Chlorine","Nitrogen"],                      ans: "Fluorine",                  diff: "medium", sol: "Fluorine (F) has highest electronegativity = 4.0." },
    ],
  },
  English: {
    Grammar: [
      { id: "e1",  q: "'She ____ to school every day.' Fill:", opts: ["goes","go","going","gone"],                                     ans: "goes",                      diff: "easy",   sol: "Third person singular + simple present → 'goes'." },
      { id: "e2",  q: "Synonym of 'Happy':",                  opts: ["Joyful","Sad","Angry","Tired"],                                 ans: "Joyful",                    diff: "easy",   sol: "Joyful is a synonym of happy." },
      { id: "e3",  q: "Antonym of 'Brave':",                  opts: ["Coward","Bold","Daring","Fearless"],                            ans: "Coward",                    diff: "easy",   sol: "Opposite of brave = coward." },
      { id: "e4",  q: "Plural of 'Child':",                   opts: ["Children","Childs","Childes","Child"],                          ans: "Children",                  diff: "easy",   sol: "Irregular plural: child → children." },
      { id: "e5",  q: "Passive voice of 'She writes a letter':", opts: ["A letter is written by her","A letter was written","She is writing","Letter she writes"], ans: "A letter is written by her", diff: "medium", sol: "Active → Passive: Object + is/are + V3 + by + subject." },
      { id: "e6",  q: "'The children played in the garden.' Tense?", opts: ["Simple Past","Simple Present","Present Continuous","Past Continuous"], ans: "Simple Past", diff: "easy", sol: "Played = V2 → Simple Past tense." },
      { id: "e7",  q: "Synonym of 'Beautiful':",             opts: ["Gorgeous","Ugly","Plain","Dull"],                                ans: "Gorgeous",                  diff: "easy",   sol: "Gorgeous means extremely beautiful." },
      { id: "e8",  q: "Article used before vowel sounds:",    opts: ["an","a","the","no article"],                                    ans: "an",                        diff: "easy",   sol: "'an' is used before words starting with vowel sounds." },
    ],
    Vocabulary: [
      { id: "e9",  q: "Antonym of 'Ancient':",               opts: ["Modern","Old","Aged","Historic"],                               ans: "Modern",                    diff: "easy",   sol: "Ancient = very old; Modern = current/new." },
      { id: "e10", q: "Synonym of 'Difficult':",             opts: ["Challenging","Easy","Simple","Smooth"],                         ans: "Challenging",               diff: "easy",   sol: "Challenging is a synonym of difficult." },
      { id: "e11", q: "One word for 'Fear of water':",       opts: ["Hydrophobia","Claustrophobia","Agoraphobia","Acrophobia"],       ans: "Hydrophobia",               diff: "medium", sol: "Hydrophobia = fear of water (hydro = water, phobia = fear)." },
      { id: "e12", q: "'Omnivore' means an animal that eats:", opts: ["Both plants and animals","Only plants","Only animals","Nothing"], ans: "Both plants and animals", diff: "medium", sol: "Omni = all; omnivore eats both plants and animals." },
    ],
  },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getAllQuestions() {
  const all = [];
  Object.entries(QUESTION_BANK).forEach(([subj, chapters]) => {
    Object.entries(chapters).forEach(([chap, qs]) => {
      qs.forEach(q => all.push({ ...q, subject: subj, chapter: chap }));
    });
  });
  return all;
}

function getChapterQuestions(subject, chapter) {
  return (QUESTION_BANK[subject]?.[chapter] || []).map(q => ({ ...q, subject, chapter }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── SUBJECTS CONFIG ─────────────────────────────────────────────────────────
const SUBJECTS_CONFIG = {
  Mathematics: { color: "#7c6ff7", icon: "∑", chapters: Object.keys(QUESTION_BANK.Mathematics) },
  Physics:     { color: "#38bdf8", icon: "⚛", chapters: Object.keys(QUESTION_BANK.Physics) },
  Chemistry:   { color: "#fb923c", icon: "⚗", chapters: Object.keys(QUESTION_BANK.Chemistry) },
  English:     { color: "#4ade80", icon: "Aa", chapters: Object.keys(QUESTION_BANK.English) },
};

// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
const LEADERBOARD = [
  { name: "Rahul Patel",   score: 65, badge: "🥇" },
  { name: "Mehul Shah",    score: 62, badge: "🥈" },
  { name: "Aryan Joshi",   score: 59, badge: "🥉" },
  { name: "Priya Desai",   score: 57, badge: "" },
  { name: "Sneha Modi",    score: 54, badge: "" },
  { name: "Dev Trivedi",   score: 51, badge: "" },
  { name: "Krisha Bhatt",  score: 48, badge: "" },
  { name: "Rohan Kapoor",  score: 45, badge: "" },
];

// ─── SVG ICON ────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    home:      "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    quiz:      "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M12 12h.01 M12 16h.01",
    chart:     "M18 20V10 M12 20V4 M6 20v-6",
    brain:     "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.73A3 3 0 0 1 3.1 10.85 3 3 0 0 1 5.5 7.5a2.5 2.5 0 0 1 4-2z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.73A3 3 0 0 0 20.9 10.85 3 3 0 0 0 18.5 7.5a2.5 2.5 0 0 0-4-2z",
    trophy:    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2z",
    check:     "M20 6L9 17l-5-5",
    x:         "M18 6L6 18 M6 6l12 12",
    clock:     "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
    book:      "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
    send:      "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
    target:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z M12 14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z",
    list:      "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
    mock:      "M9 12l2 2 4-4 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    lightning: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(icons[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex", flexDirection: "column" },
  header: { background: "linear-gradient(135deg,#12121a 0%,#1a1a2e 100%)", borderBottom: "1px solid #2a2a3e", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#7c6ff7,#e96cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.5px", cursor: "pointer" },
  nav: { display: "flex", gap: 4, flexWrap: "wrap" },
  navBtn: (active) => ({ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: active ? "rgba(124,111,247,0.2)" : "transparent", color: active ? "#a89cf7" : "#888", transition: "all 0.2s" }),
  main: { flex: 1, padding: "24px", maxWidth: 1100, margin: "0 auto", width: "100%" },
  card: { background: "linear-gradient(135deg,#13131f 0%,#1a1a28 100%)", border: "1px solid #2a2a3e", borderRadius: 16, padding: 24, marginBottom: 20 },
  h1: { fontSize: 28, fontWeight: 800, background: "linear-gradient(135deg,#fff 0%,#a89cf7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 },
  h2: { fontSize: 20, fontWeight: 700, color: "#e8e8f0", marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 },
  subjectCard: (color) => ({ background: `linear-gradient(135deg,${color}22 0%,${color}11 100%)`, border: `1px solid ${color}44`, borderRadius: 14, padding: 20, cursor: "pointer", transition: "all 0.25s" }),
  btn: (variant = "primary") => ({
    padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
    background: variant === "primary" ? "linear-gradient(135deg,#7c6ff7,#e96cff)" : variant === "success" ? "linear-gradient(135deg,#22c55e,#16a34a)" : variant === "danger" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "rgba(255,255,255,0.08)",
    color: "#fff", transition: "all 0.2s",
  }),
  tag: (color) => ({ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }),
  progress: { height: 6, borderRadius: 3, background: "#2a2a3e", overflow: "hidden" },
  progressFill: (pct, color = "#7c6ff7") => ({ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},#e96cff)`, borderRadius: 3, transition: "width 0.5s ease" }),
  optionBtn: (state) => ({
    width: "100%", textAlign: "left", padding: "14px 18px", borderRadius: 10,
    border: `1.5px solid ${state === "correct" ? "#22c55e" : state === "wrong" ? "#ef4444" : state === "selected" ? "#7c6ff7" : "#2a2a3e"}`,
    background: state === "correct" ? "rgba(34,197,94,0.12)" : state === "wrong" ? "rgba(239,68,68,0.12)" : state === "selected" ? "rgba(124,111,247,0.15)" : "rgba(255,255,255,0.03)",
    color: "#e8e8f0", cursor: state ? "default" : "pointer", fontSize: 14, fontWeight: 500, marginBottom: 10, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10,
  }),
  statBox: (color) => ({ background: `linear-gradient(135deg,${color}22,${color}11)`, border: `1px solid ${color}33`, borderRadius: 12, padding: "16px 20px", textAlign: "center" }),
  leaderRow: (rank) => ({
    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, marginBottom: 8,
    background: rank === 1 ? "rgba(255,215,0,0.08)" : rank === 2 ? "rgba(192,192,192,0.08)" : rank === 3 ? "rgba(205,127,50,0.08)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${rank === 1 ? "rgba(255,215,0,0.2)" : rank === 2 ? "rgba(192,192,192,0.2)" : rank === 3 ? "rgba(205,127,50,0.2)" : "#2a2a3e"}`,
  }),
};

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState("home");
  const [quizState, setQuizState]   = useState(null);
  const [results, setResults]       = useState([]);
  const [aiHistory, setAiHistory]   = useState([]);
  const [aiInput, setAiInput]       = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [activeTab, setActiveTab]   = useState("Weekly");
  const [checklist, setChecklist]   = useState(() => {
    const init = {};
    Object.entries(SUBJECTS_CONFIG).forEach(([subj, cfg]) => {
      cfg.chapters.forEach(ch => { init[`${subj}-${ch}`] = false; });
    });
    return init;
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiHistory]);

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  function startQuiz(subject, chapter, isMock = false) {
    const pool = isMock
      ? shuffle(getAllQuestions()).slice(0, 20)
      : shuffle(getChapterQuestions(subject, chapter)).slice(0, Math.min(8, getChapterQuestions(subject, chapter).length));
    if (pool.length === 0) return;
    setQuizState({ questions: pool, current: 0, answers: {}, timeLeft: isMock ? 30 * 60 : 10 * 60, isMock, subject, chapter, started: Date.now(), finished: false });
    setScreen("quiz");
  }

  function handleAnswer(qid, opt) {
    if (quizState.answers[qid] !== undefined) return;
    const newAnswers = { ...quizState.answers, [qid]: opt };
    setQuizState(s => ({ ...s, answers: newAnswers }));
    setTimeout(() => {
      setQuizState(s => {
        if (!s) return s;
        const next = s.current + 1;
        if (next >= s.questions.length) {
          const scored = s.questions.map(q => ({ ...q, userAnswer: newAnswers[q.id], correct: newAnswers[q.id] === q.ans }));
          const score = scored.filter(q => q.correct).length;
          const result = { id: Date.now(), subject: s.isMock ? "Mock Test" : s.subject, chapter: s.isMock ? "Full Syllabus" : s.chapter, score, total: s.questions.length, scored, timeTaken: Math.round((Date.now() - s.started) / 1000), isMock: s.isMock };
          setResults(r => [result, ...r]);
          return { ...s, finished: true, scored, score };
        }
        return { ...s, current: next };
      });
    }, 900);
  }

  // ── TIMER ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!quizState || quizState.finished) return;
    const t = setInterval(() => {
      setQuizState(s => {
        if (!s || s.finished) return s;
        const tl = s.timeLeft - 1;
        if (tl <= 0) {
          const scored = s.questions.map(q => ({ ...q, userAnswer: s.answers[q.id], correct: s.answers[q.id] === q.ans }));
          const score = scored.filter(q => q.correct).length;
          const result = { id: Date.now(), subject: s.isMock ? "Mock Test" : s.subject, chapter: s.isMock ? "Full Syllabus" : s.chapter, score, total: s.questions.length, scored, timeTaken: Math.round((Date.now() - s.started) / 1000), isMock: s.isMock };
          setResults(r => [result, ...r]);
          return { ...s, finished: true, timeLeft: 0, scored, score };
        }
        return { ...s, timeLeft: tl };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [quizState?.finished, quizState?.id]);

  // ── AI ─────────────────────────────────────────────────────────────────────
  async function sendAI() {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    const newHistory = [...aiHistory, { role: "user", content: userMsg }];
    setAiHistory(newHistory);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are Thinkly AI, an expert tutor for DDCET (Diploma to Degree Common Entrance Test) exam preparation in Gujarat, India. Help students understand concepts in Mathematics, Physics, Chemistry, and English. Give clear step-by-step explanations with numbered steps. Be encouraging, concise, and exam-focused. Use simple language suitable for diploma students.",
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Sorry, I couldn't process that. Please try again.";
      setAiHistory(h => [...h, { role: "assistant", content: reply }]);
    } catch {
      setAiHistory(h => [...h, { role: "assistant", content: "⚠️ Connection error. Please check your internet and try again." }]);
    }
    setAiLoading(false);
  }

  // ── NAV ────────────────────────────────────────────────────────────────────
  const nav = [
    { id: "home",        label: "Home",     icon: "home"    },
    { id: "subjects",    label: "Subjects", icon: "book"    },
    { id: "mock",        label: "Mock",     icon: "mock"    },
    { id: "results",     label: "Results",  icon: "chart"   },
    { id: "leaderboard", label: "Rank",     icon: "trophy"  },
    { id: "checklist",   label: "Progress", icon: "list"    },
    { id: "ai",          label: "AI Tutor", icon: "brain"   },
  ];

  const totalScore = results.reduce((a, r) => a + r.score, 0);

  return (
    <div style={S.app}>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={S.header}>
        <div style={S.logo} onClick={() => setScreen("home")}>⚡ Thinkly</div>
        <nav style={S.nav}>
          {nav.map(n => (
            <button key={n.id} style={S.navBtn(screen === n.id)} onClick={() => setScreen(n.id)}>
              <Icon name={n.icon} size={15} />
              <span style={{ display: "inline" }}>{n.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main style={S.main}>

        {/* ══ HOME ══════════════════════════════════════════════════════════ */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>⚡</div>
              <div style={S.h1}>Crack DDCET with Thinkly</div>
              <p style={{ color: "#888", fontSize: 15, maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.7 }}>
                Smart quizzes, timed mock tests, AI-powered explanations, and full progress tracking — built for diploma entrance success.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button style={S.btn("primary")} onClick={() => setScreen("subjects")}>Start Practicing →</button>
                <button style={S.btn("ghost")} onClick={() => startQuiz(null, null, true)}>Take Mock Test</button>
              </div>
            </div>

            {/* Stats row */}
            {results.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Tests Taken",  val: results.length,                      color: "#7c6ff7" },
                  { label: "Total Score",  val: totalScore,                           color: "#22c55e" },
                  { label: "Best Accuracy",val: Math.max(...results.map(r => Math.round(r.score/r.total*100))) + "%", color: "#fbbf24" },
                  { label: "Mock Tests",   val: results.filter(r => r.isMock).length, color: "#38bdf8" },
                ].map(s => (
                  <div key={s.label} style={S.statBox(s.color)}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Feature cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { icon: "quiz",    label: "Chapter Quizzes",  desc: "Practice by chapter",     color: "#7c6ff7", action: () => setScreen("subjects")    },
                { icon: "clock",   label: "Timed Mock Tests", desc: "Simulate real DDCET",      color: "#38bdf8", action: () => startQuiz(null,null,true) },
                { icon: "brain",   label: "AI Tutor",         desc: "Instant explanations",     color: "#e96cff", action: () => setScreen("ai")          },
                { icon: "trophy",  label: "Leaderboard",      desc: "Compete with peers",       color: "#fbbf24", action: () => setScreen("leaderboard") },
                { icon: "list",    label: "Syllabus Track",   desc: "Monitor your progress",    color: "#4ade80", action: () => setScreen("checklist")   },
                { icon: "chart",   label: "Result Analysis",  desc: "Review all attempts",      color: "#fb923c", action: () => setScreen("results")     },
              ].map(f => (
                <div key={f.label} style={{ ...S.card, textAlign: "center", cursor: "pointer" }} onClick={f.action}>
                  <div style={{ color: f.color, marginBottom: 10 }}><Icon name={f.icon} size={30} /></div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ color: "#888", fontSize: 13 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Recent results */}
            {results.length > 0 && (
              <div style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={S.h2}>Recent Results</div>
                  <button style={{ ...S.btn("ghost"), padding: "6px 12px", fontSize: 12 }} onClick={() => setScreen("results")}>View All →</button>
                </div>
                {results.slice(0, 4).map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2a3e" }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{r.subject}</span>
                      <span style={{ color: "#666", fontSize: 13 }}> · {r.chapter}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={S.tag(r.score / r.total >= 0.7 ? "#22c55e" : "#ef4444")}>{r.score}/{r.total}</span>
                      <span style={{ color: "#666", fontSize: 12 }}>{Math.round(r.score / r.total * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ SUBJECTS ══════════════════════════════════════════════════════ */}
        {screen === "subjects" && (
          <div>
            <div style={S.h1}>Choose Subject & Chapter</div>
            <p style={{ color: "#888", marginBottom: 24 }}>Select any chapter to start a practice quiz with instant feedback.</p>
            {Object.entries(SUBJECTS_CONFIG).map(([subj, cfg]) => (
              <div key={subj} style={S.card}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>{cfg.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: cfg.color }}>{subj}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>{cfg.chapters.length} chapters</div>
                  </div>
                </div>
                <div style={S.grid2}>
                  {cfg.chapters.map(ch => {
                    const qCount = getChapterQuestions(subj, ch).length;
                    const doneKey = `${subj}-${ch}`;
                    return (
                      <div key={ch} style={S.subjectCard(cfg.color)} onClick={() => startQuiz(subj, ch)}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{ch}</div>
                        <div style={{ color: "#888", fontSize: 12, marginBottom: 10 }}>{qCount} questions</div>
                        <div style={S.progress}>
                          <div style={S.progressFill(checklist[doneKey] ? 100 : 0, cfg.color)} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                          <span style={S.tag(cfg.color)}>Practice</span>
                          {checklist[doneKey] && <span style={S.tag("#22c55e")}>✓ Done</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ QUIZ ══════════════════════════════════════════════════════════ */}
        {screen === "quiz" && quizState && !quizState.finished && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{quizState.isMock ? "Mock Test" : quizState.chapter}</span>
                <span style={{ color: "#888", fontSize: 13 }}> · Q{quizState.current + 1} of {quizState.questions.length}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: quizState.timeLeft < 60 ? "#ef4444" : "#fbbf24" }}>
                <Icon name="clock" size={16} />
                <span style={{ fontWeight: 700, fontFamily: "monospace", fontSize: 16 }}>
                  {String(Math.floor(quizState.timeLeft / 60)).padStart(2, "0")}:{String(quizState.timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div style={S.progress}>
              <div style={S.progressFill((quizState.current + 1) / quizState.questions.length * 100)} />
            </div>
            <div style={{ height: 24 }} />
            {(() => {
              const q = quizState.questions[quizState.current];
              const userAns = quizState.answers[q.id];
              const diffColors = { easy: "#22c55e", medium: "#fbbf24", hard: "#ef4444" };
              return (
                <div style={S.card}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    <span style={S.tag(SUBJECTS_CONFIG[q.subject]?.color || "#7c6ff7")}>{q.subject} · {q.chapter}</span>
                    <span style={S.tag(diffColors[q.diff] || "#888")}>{q.diff}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, lineHeight: 1.6 }}>{q.q}</div>
                  {q.opts.map((opt, idx) => {
                    let state = null;
                    if (userAns !== undefined) {
                      if (opt === q.ans) state = "correct";
                      else if (opt === userAns) state = "wrong";
                    }
                    const labels = ["A","B","C","D"];
                    return (
                      <button key={opt} style={S.optionBtn(state)} onClick={() => !userAns && handleAnswer(q.id, opt)}>
                        <span style={{ width: 24, height: 24, borderRadius: "50%", background: state === "correct" ? "#22c55e33" : state === "wrong" ? "#ef444433" : "#ffffff11", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{labels[idx]}</span>
                        {userAns !== undefined && state === "correct" && <Icon name="check" size={16} />}
                        {userAns !== undefined && state === "wrong" && <Icon name="x" size={16} />}
                        {opt}
                      </button>
                    );
                  })}
                  {userAns !== undefined && (
                    <div style={{ marginTop: 12, padding: "14px 16px", background: "rgba(124,111,247,0.08)", borderRadius: 10, borderLeft: "3px solid #7c6ff7" }}>
                      <div style={{ fontSize: 12, color: "#7c6ff7", fontWeight: 700, marginBottom: 4 }}>💡 EXPLANATION</div>
                      <div style={{ fontSize: 13, color: "#c0b8f0", lineHeight: 1.6 }}>{q.sol}</div>
                    </div>
                  )}
                </div>
              );
            })()}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <button style={S.btn("ghost")} onClick={() => setScreen("home")}>✕ Exit Quiz</button>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {quizState.questions.map((q, i) => (
                  <div key={q.id} style={{ width: 8, height: 8, borderRadius: "50%", background: quizState.answers[q.id] !== undefined ? (quizState.answers[q.id] === q.ans ? "#22c55e" : "#ef4444") : i === quizState.current ? "#7c6ff7" : "#2a2a3e", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ QUIZ RESULT ═══════════════════════════════════════════════════ */}
        {screen === "quiz" && quizState?.finished && (
          <div style={{ textAlign: "center" }}>
            <div style={S.card}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>
                {(quizState.score || 0) / quizState.questions.length >= 0.8 ? "🏆" : (quizState.score || 0) / quizState.questions.length >= 0.6 ? "🎉" : "📚"}
              </div>
              <div style={{ ...S.h1, marginBottom: 4 }}>
                {(quizState.score || 0) / quizState.questions.length >= 0.8 ? "Excellent Work!" : (quizState.score || 0) / quizState.questions.length >= 0.6 ? "Great Job!" : "Keep Practicing!"}
              </div>
              <p style={{ color: "#888", marginBottom: 24 }}>
                {(quizState.score || 0) / quizState.questions.length >= 0.7 ? "You're on track for DDCET!" : "Review the wrong answers below to improve."}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 8 }}>
                <div style={S.statBox("#7c6ff7")}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#a89cf7" }}>{quizState.score || 0}/{quizState.questions.length}</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Score</div>
                </div>
                <div style={S.statBox("#22c55e")}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#4ade80" }}>{Math.round((quizState.score || 0) / quizState.questions.length * 100)}%</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Accuracy</div>
                </div>
                <div style={S.statBox("#fbbf24")}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#fcd34d" }}>{Math.floor((Date.now() - quizState.started) / 60000)}m {Math.round(((Date.now() - quizState.started) % 60000) / 1000)}s</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Time</div>
                </div>
              </div>
            </div>

            {quizState.scored?.filter(q => !q.correct).length > 0 && (
              <div style={{ ...S.card, textAlign: "left" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 16 }}>❌ Wrong Answers — Review & Learn</div>
                {quizState.scored.filter(q => !q.correct).map(q => (
                  <div key={q.id} style={{ padding: "14px 0", borderBottom: "1px solid #2a2a3e" }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, lineHeight: 1.5 }}>{q.q}</div>
                    <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 4 }}>Your answer: {q.userAnswer || "Not answered"}</div>
                    <div style={{ fontSize: 13, color: "#22c55e", marginBottom: 8 }}>✓ Correct: {q.ans}</div>
                    <div style={{ fontSize: 12, color: "#a89cf7", background: "rgba(124,111,247,0.08)", padding: "8px 12px", borderRadius: 8, borderLeft: "2px solid #7c6ff7" }}>💡 {q.sol}</div>
                  </div>
                ))}
              </div>
            )}

            {quizState.scored?.filter(q => q.correct).length > 0 && (
              <div style={{ ...S.card, textAlign: "left" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#22c55e", marginBottom: 12 }}>✅ Correct Answers</div>
                {quizState.scored.filter(q => q.correct).map(q => (
                  <div key={q.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e1e2e", fontSize: 13 }}>
                    <span style={{ color: "#aaa", flex: 1 }}>{q.q}</span>
                    <span style={S.tag("#22c55e")}>{q.ans}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              <button style={S.btn("primary")} onClick={() => {
                if (quizState.isMock) startQuiz(null, null, true);
                else startQuiz(quizState.subject, quizState.chapter);
              }}>🔁 Retry Quiz</button>
              <button style={S.btn("ghost")} onClick={() => setScreen("ai")}>🧠 Ask AI Tutor</button>
              <button style={S.btn("ghost")} onClick={() => {
                if (!quizState.isMock) setChecklist(c => ({ ...c, [`${quizState.subject}-${quizState.chapter}`]: true }));
                setScreen("home");
              }}>← Back to Home</button>
            </div>
          </div>
        )}

        {/* ══ MOCK TEST ═════════════════════════════════════════════════════ */}
        {screen === "mock" && (
          <div>
            <div style={S.h1}>Mock Tests</div>
            <p style={{ color: "#888", marginBottom: 24 }}>Simulate the full DDCET exam with all subjects, timer, and analysis.</p>
            <div style={S.card}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ fontSize: 32 }}>🎯</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>DDCET Full Mock Test</div>
                  <div style={{ color: "#888", fontSize: 13 }}>All subjects · Mixed difficulty</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { label: "Questions", val: "20", color: "#7c6ff7" },
                  { label: "Duration",  val: "30 min", color: "#38bdf8" },
                  { label: "Subjects",  val: "All 4", color: "#fb923c" },
                  { label: "Attempts",  val: results.filter(r=>r.isMock).length, color: "#fbbf24" },
                ].map(i => (
                  <div key={i.label} style={S.statBox(i.color)}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: i.color }}>{i.val}</div>
                    <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{i.label}</div>
                  </div>
                ))}
              </div>
              <button style={{ ...S.btn("primary"), fontSize: 16, padding: "14px 32px" }} onClick={() => startQuiz(null, null, true)}>
                ⚡ Start Mock Test
              </button>
            </div>
            <div style={{ ...S.card, background: "rgba(251,191,36,0.05)", borderColor: "rgba(251,191,36,0.2)" }}>
              <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: 12, fontSize: 15 }}>📋 Instructions</div>
              <div style={{ color: "#aaa", fontSize: 14, lineHeight: 2 }}>
                • 20 randomized questions from all subjects: Math, Physics, Chemistry, English<br />
                • Each question carries 1 mark — no negative marking<br />
                • Timer: 30 minutes — quiz auto-submits when time ends<br />
                • Full answer review with solutions after submission<br />
                • Result saved in your history for tracking
              </div>
            </div>
            {results.filter(r => r.isMock).length > 0 && (
              <div style={S.card}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Past Mock Attempts</div>
                {results.filter(r => r.isMock).slice(0, 5).map(r => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #2a2a3e" }}>
                    <span style={{ color: "#888", fontSize: 13 }}>Mock Test</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={S.tag(r.score / r.total >= 0.7 ? "#22c55e" : "#ef4444")}>{r.score}/{r.total}</span>
                      <span style={{ color: "#666", fontSize: 12 }}>{Math.round(r.score/r.total*100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ RESULTS ═══════════════════════════════════════════════════════ */}
        {screen === "results" && (
          <div>
            <div style={S.h1}>Result History</div>
            {results.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", color: "#888", padding: 48 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>No results yet</div>
                <div style={{ fontSize: 14, marginBottom: 24 }}>Complete a quiz or mock test to see your performance here.</div>
                <button style={S.btn("primary")} onClick={() => setScreen("subjects")}>Start Practicing →</button>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Tests Taken",   val: results.length,                                            color: "#7c6ff7" },
                    { label: "Total Score",   val: totalScore,                                               color: "#22c55e" },
                    { label: "Avg Accuracy",  val: Math.round(results.reduce((a,r)=>a+r.score/r.total*100,0)/results.length) + "%", color: "#fbbf24" },
                    { label: "Mock Tests",    val: results.filter(r=>r.isMock).length,                       color: "#38bdf8" },
                  ].map(s => (
                    <div key={s.label} style={S.statBox(s.color)}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {results.map(r => (
                  <div key={r.id} style={S.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{r.subject}</div>
                        <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>{r.chapter}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={S.tag(r.score / r.total >= 0.7 ? "#22c55e" : "#ef4444")}>{r.score}/{r.total}</span>
                        <span style={S.tag("#fbbf24")}>{Math.round(r.score / r.total * 100)}%</span>
                        {r.isMock && <span style={S.tag("#7c6ff7")}>Mock</span>}
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={S.progress}>
                        <div style={S.progressFill(r.score / r.total * 100, r.score / r.total >= 0.7 ? "#22c55e" : "#ef4444")} />
                      </div>
                    </div>
                    <div style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
                      Time: {Math.floor(r.timeTaken/60)}m {r.timeTaken%60}s · {r.total - r.score} wrong
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ══ LEADERBOARD ════════════════════════════════════════════════════ */}
        {screen === "leaderboard" && (
          <div>
            <div style={S.h1}>🏆 Leaderboard</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["Daily", "Weekly", "All Time"].map(t => (
                <button key={t} style={S.btn(activeTab === t ? "primary" : "ghost")} onClick={() => setActiveTab(t)}>{t}</button>
              ))}
            </div>

            {/* Top 3 podium */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 24 }}>
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((s, i) => {
                const heights = [100, 130, 85];
                const colors = ["#c0c0c0", "#ffd700", "#cd7f32"];
                const ranks = [2, 1, 3];
                return (
                  <div key={s.name} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{ranks[i] === 1 ? "👑" : ranks[i] === 2 ? "🥈" : "🥉"}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{s.name.split(" ")[0]}</div>
                    <div style={{ width: 70, height: heights[i], background: `linear-gradient(180deg,${colors[i]}33,${colors[i]}11)`, border: `1px solid ${colors[i]}44`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                      <div style={{ color: colors[i], fontWeight: 800, fontSize: 18 }}>{s.score}</div>
                      <div style={{ color: "#888", fontSize: 11 }}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={S.card}>
              {LEADERBOARD.map((s, i) => (
                <div key={s.name} style={S.leaderRow(i + 1)}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "rgba(255,215,0,0.2)" : i === 1 ? "rgba(192,192,192,0.2)" : i === 2 ? "rgba(205,127,50,0.2)" : "#2a2a3e", fontWeight: 800, fontSize: i < 3 ? 16 : 13, color: i === 0 ? "#ffd700" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "#888" }}>
                    {s.badge || i + 1}
                  </div>
                  <div style={{ flex: 1, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 80, height: 4, background: "#2a2a3e", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.score / 75 * 100}%`, background: "linear-gradient(90deg,#7c6ff7,#e96cff)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontWeight: 700, color: "#a89cf7", minWidth: 36, textAlign: "right" }}>{s.score}</span>
                  </div>
                </div>
              ))}

              {/* "You" row */}
              <div style={{ ...S.leaderRow(99), background: "rgba(124,111,247,0.1)", border: "1px solid rgba(124,111,247,0.3)", marginTop: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c6ff7,#e96cff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 12 }}>
                  YOU
                </div>
                <div style={{ flex: 1, fontWeight: 700, color: "#a89cf7" }}>You (Local)</div>
                <span style={{ fontWeight: 800, color: "#7c6ff7", fontSize: 16 }}>{totalScore || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ CHECKLIST ══════════════════════════════════════════════════════ */}
        {screen === "checklist" && (
          <div>
            <div style={S.h1}>📋 Syllabus Progress</div>
            <p style={{ color: "#888", marginBottom: 24 }}>Track which chapters you've covered. Click to toggle completion.</p>

            {/* Overall progress */}
            {(() => {
              const total = Object.keys(checklist).length;
              const done = Object.values(checklist).filter(Boolean).length;
              return (
                <div style={{ ...S.card, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>Overall Completion</span>
                    <span style={{ color: "#a89cf7", fontWeight: 700 }}>{done}/{total} chapters</span>
                  </div>
                  <div style={S.progress}>
                    <div style={S.progressFill(done / total * 100)} />
                  </div>
                  <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>{Math.round(done / total * 100)}% syllabus covered</div>
                </div>
              );
            })()}

            {Object.entries(SUBJECTS_CONFIG).map(([subj, cfg]) => {
              const total = cfg.chapters.length;
              const done = cfg.chapters.filter(ch => checklist[`${subj}-${ch}`]).length;
              return (
                <div key={subj} style={S.card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 22 }}>{cfg.icon}</span>
                      <span style={{ fontWeight: 700, color: cfg.color, fontSize: 16 }}>{subj}</span>
                    </div>
                    <span style={S.tag(cfg.color)}>{done}/{total}</span>
                  </div>
                  <div style={{ ...S.progress, marginBottom: 16 }}>
                    <div style={S.progressFill(done / total * 100, cfg.color)} />
                  </div>
                  {cfg.chapters.map(ch => {
                    const key = `${subj}-${ch}`;
                    const isDone = checklist[key];
                    return (
                      <div key={ch} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #1e1e2e", cursor: "pointer" }}
                        onClick={() => setChecklist(c => ({ ...c, [key]: !c[key] }))}>
                        <div style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${isDone ? cfg.color : "#3a3a4e"}`, background: isDone ? cfg.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                          {isDone && <Icon name="check" size={13} />}
                        </div>
                        <span style={{ flex: 1, color: isDone ? "#e8e8f0" : "#888", fontWeight: isDone ? 500 : 400, fontSize: 14 }}>{ch}</span>
                        <button style={{ ...S.btn("ghost"), padding: "4px 10px", fontSize: 12 }}
                          onClick={e => { e.stopPropagation(); startQuiz(subj, ch); }}>
                          Practice
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ AI TUTOR ═══════════════════════════════════════════════════════ */}
        {screen === "ai" && (
          <div>
            <div style={S.h1}>🧠 Thinkly AI Tutor</div>
            <p style={{ color: "#888", marginBottom: 20 }}>Ask anything about DDCET — get instant step-by-step explanations powered by AI.</p>
            <div style={{ ...S.card, display: "flex", flexDirection: "column", height: 520 }}>
              <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
                {aiHistory.length === 0 && (
                  <div style={{ textAlign: "center", color: "#888", padding: "32px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Ask Thinkly AI</div>
                    <div style={{ fontSize: 13, maxWidth: 320, margin: "0 auto 24px", lineHeight: 1.6 }}>Get instant explanations for any DDCET concept in Mathematics, Physics, Chemistry, or English.</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                      {[
                        "Explain sin cos tan rules",
                        "How does Newton's 2nd law work?",
                        "What is ionic bonding?",
                        "Explain passive voice with examples",
                        "Derive kinetic energy formula",
                        "What is the periodic table?",
                      ].map(s => (
                        <button key={s} style={{ ...S.btn("ghost"), padding: "6px 14px", fontSize: 12 }} onClick={() => setAiInput(s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {aiHistory.map((m, i) => (
                  <div key={i} style={{ marginBottom: 16, display: "flex", gap: 10, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: m.role === "user" ? "linear-gradient(135deg,#7c6ff7,#e96cff)" : "linear-gradient(135deg,#38bdf8,#7c6ff7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: m.role === "user" ? 13 : 18 }}>
                      {m.role === "user" ? "U" : "🧠"}
                    </div>
                    <div style={{ maxWidth: "78%", background: m.role === "user" ? "rgba(124,111,247,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${m.role === "user" ? "rgba(124,111,247,0.3)" : "#2a2a3e"}`, borderRadius: m.role === "user" ? "12px 2px 12px 12px" : "2px 12px 12px 12px", padding: "12px 16px", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#e0e0f0" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#38bdf8,#7c6ff7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid #2a2a3e", borderRadius: "2px 12px 12px 12px", padding: "12px 16px", color: "#888", fontSize: 14 }}>
                      <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>Thinking…</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div style={{ borderTop: "1px solid #2a2a3e", paddingTop: 16, display: "flex", gap: 10 }}>
                <input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendAI()}
                  placeholder="Ask anything about DDCET…"
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1.5px solid #2a2a3e", borderRadius: 10, padding: "12px 16px", color: "#e8e8f0", fontSize: 14, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#7c6ff7"}
                  onBlur={e => e.target.style.borderColor = "#2a2a3e"}
                />
                <button style={{ ...S.btn("primary"), padding: "12px 18px", flexShrink: 0 }} onClick={sendAI} disabled={aiLoading}>
                  <Icon name="send" size={18} />
                </button>
              </div>
              {aiHistory.length > 0 && (
                <button style={{ ...S.btn("ghost"), marginTop: 8, padding: "6px 12px", fontSize: 12, alignSelf: "flex-start" }} onClick={() => setAiHistory([])}>🗑 Clear chat</button>
              )}
            </div>
          </div>
        )}

      </main>

      <footer style={{ borderTop: "1px solid #1e1e2e", padding: "14px 24px", textAlign: "center", color: "#444", fontSize: 12 }}>
        ⚡ Thinkly · DDCET Exam Prep · Built for Gujarat Diploma Students
      </footer>
    </div>
  );
}
