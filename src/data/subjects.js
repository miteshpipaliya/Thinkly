export const SUBJECTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "∑",
    color: "#4f8ef7",
    chapters: [
      "Determinant & Matrices",
      "Trigonometry",
      "Vectors",
      "Coordinate Geometry",
      "Limit & Function",
      "Integration",
      "Differentiation & Applications",
      "Logarithm",
      "Statistics",
    ],
  },
  {
    id: "physics",
    name: "Physics",
    icon: "⚛",
    color: "#22d3ee",
    chapters: [
      "Units & Measurement",
      "Classical Mechanics",
      "Electric Current",
      "Heat & Thermometry",
      "Wave Motion, Optics & Acoustics",
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "⚗",
    color: "#fb923c",
    chapters: [
      "Chemical Reactions & Equations",
      "Acids, Bases & Salts",
      "Metals & Non-metals",
    ],
  },
  {
    id: "environment",
    name: "Environment",
    icon: "🌿",
    color: "#4ade80",
    chapters: [
      "Ecosystem & Pollution (Types)",
      "Climate Change",
      "Hydro / Solar / Wind / Bio-mass Energy",
    ],
  },
  {
    id: "computer",
    name: "Computer",
    icon: "💻",
    color: "#a78bfa",
    chapters: [
      "Computer Generations (1 to 5)",
      "HTML-5",
      "MS Word / MS Excel / MS PowerPoint",
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "Aa",
    color: "#f472b6",
    chapters: [
      "Letter Writing",
      "Passage",
      "Theory of Communication",
      "Grammar",
      "Correction of Words",
    ],
  },
];

export const QUESTION_BANK = [
  { id: "q1",  subject: "Mathematics", chapter: "Trigonometry",                   q: "sin2 + cos2 = ?",                            opts: ["0", "1", "2", "-1"],                                                              ans: "1",                          sol: "Pythagorean identity." },
  { id: "q2",  subject: "Mathematics", chapter: "Trigonometry",                   q: "cos 60 degrees = ?",                         opts: ["1/2", "root3/2", "1", "0"],                                                       ans: "1/2",                        sol: "Standard value." },
  { id: "q3",  subject: "Mathematics", chapter: "Trigonometry",                   q: "tan 45 degrees = ?",                         opts: ["0", "1", "root3", "undefined"],                                                   ans: "1",                          sol: "tan45 = sin45/cos45 = 1." },
  { id: "q4",  subject: "Mathematics", chapter: "Trigonometry",                   q: "sec2 - tan2 = ?",                            opts: ["1", "0", "2", "-1"],                                                              ans: "1",                          sol: "Identity: sec2 - tan2 = 1." },
  { id: "q5",  subject: "Mathematics", chapter: "Trigonometry",                   q: "sin(A+B) = ?",                               opts: ["sinA cosB + cosA sinB", "sinA sinB - cosA cosB", "cosA cosB", "None"],            ans: "sinA cosB + cosA sinB",      sol: "Addition formula." },
  { id: "q6",  subject: "Mathematics", chapter: "Trigonometry",                   q: "cos(90 - theta) = ?",                        opts: ["cosθ", "sinθ", "tanθ", "-sinθ"],                                                  ans: "sinθ",                       sol: "Complementary identity." },
  { id: "q7",  subject: "Mathematics", chapter: "Trigonometry",                   q: "sin 0 degrees = ?",                          opts: ["0", "1", "-1", "infinity"],                                                       ans: "0",                          sol: "sin0 = 0 by definition." },
  { id: "q8",  subject: "Mathematics", chapter: "Trigonometry",                   q: "tan(90 degrees) is:",                        opts: ["0", "1", "undefined", "root3"],                                                   ans: "undefined",                  sol: "tan90 = sin90/cos90 = 1/0 = undefined." },
  { id: "q9",  subject: "Mathematics", chapter: "Determinant & Matrices",         q: "|1 2; 3 4| = ?",                             opts: ["-2", "2", "10", "-10"],                                                           ans: "-2",                         sol: "(1x4) - (2x3) = -2." },
  { id: "q10", subject: "Mathematics", chapter: "Determinant & Matrices",         q: "If det(A) = 0, A is:",                       opts: ["Singular", "Non-singular", "Identity", "None"],                                   ans: "Singular",                   sol: "det = 0 means no inverse." },
  { id: "q11", subject: "Mathematics", chapter: "Determinant & Matrices",         q: "Order of matrix with 3 rows, 2 cols:",       opts: ["3x2", "2x3", "6x1", "1x6"],                                                       ans: "3x2",                        sol: "Rows x Columns notation." },
  { id: "q12", subject: "Mathematics", chapter: "Determinant & Matrices",         q: "det(I) where I is identity matrix:",         opts: ["0", "1", "-1", "2"],                                                              ans: "1",                          sol: "Determinant of identity matrix is always 1." },
  { id: "q13", subject: "Mathematics", chapter: "Integration",                    q: "Integral of x dx = ?",                       opts: ["x2/2 + C", "x2 + C", "2x + C", "x/2"],                                           ans: "x2/2 + C",                   sol: "Power rule." },
  { id: "q14", subject: "Mathematics", chapter: "Integration",                    q: "Integral of e^x dx = ?",                     opts: ["e^x + C", "xe^x + C", "e + C", "e^x/x"],                                         ans: "e^x + C",                    sol: "e^x is its own integral." },
  { id: "q15", subject: "Mathematics", chapter: "Integration",                    q: "Integral of cos x dx = ?",                   opts: ["sin x + C", "-sin x + C", "tan x + C", "cos x"],                                  ans: "sin x + C",                  sol: "Standard integral." },
  { id: "q16", subject: "Mathematics", chapter: "Integration",                    q: "Integral of 1/x dx = ?",                     opts: ["ln|x| + C", "1/x2 + C", "x^-1 + C", "-ln x"],                                   ans: "ln|x| + C",                  sol: "Standard result." },
  { id: "q17", subject: "Mathematics", chapter: "Statistics",                     q: "Mean of 2, 4, 6, 8, 10 = ?",                opts: ["5", "6", "7", "4"],                                                               ans: "6",                          sol: "30/5 = 6." },
  { id: "q18", subject: "Mathematics", chapter: "Statistics",                     q: "Median of 3, 5, 7, 9, 11 = ?",              opts: ["7", "5", "9", "6"],                                                               ans: "7",                          sol: "Middle of sorted set." },
  { id: "q19", subject: "Mathematics", chapter: "Statistics",                     q: "Mode is:",                                   opts: ["Most frequent", "Middle value", "Sum/n", "Square root of variance"],               ans: "Most frequent",              sol: "Mode = most common value." },
  { id: "q20", subject: "Mathematics", chapter: "Vectors",                        q: "A vector has:",                              opts: ["Magnitude only", "Direction only", "Both magnitude and direction", "Neither"],    ans: "Both magnitude and direction", sol: "Definition of vector." },
  { id: "q21", subject: "Mathematics", chapter: "Vectors",                        q: "Unit vector magnitude = ?",                  opts: ["0", "1", "2", "Variable"],                                                        ans: "1",                          sol: "Unit vector has magnitude 1." },
  { id: "q22", subject: "Mathematics", chapter: "Logarithm",                      q: "log base 10 of 1000 = ?",                    opts: ["2", "3", "4", "10"],                                                              ans: "3",                          sol: "10^3 = 1000, so log = 3." },
  { id: "q23", subject: "Mathematics", chapter: "Logarithm",                      q: "log(AB) = ?",                                opts: ["logA + logB", "logA - logB", "logA x logB", "logA / logB"],                      ans: "logA + logB",                sol: "Product rule of logarithm." },
  { id: "q24", subject: "Mathematics", chapter: "Coordinate Geometry",            q: "Distance between (0,0) and (3,4) = ?",       opts: ["5", "7", "4", "3"],                                                               ans: "5",                          sol: "sqrt(9+16) = 5." },
  { id: "q25", subject: "Mathematics", chapter: "Coordinate Geometry",            q: "Slope of line y = 2x + 3 is:",               opts: ["3", "2", "1", "0"],                                                               ans: "2",                          sol: "y = mx + c; m = 2." },
  { id: "q26", subject: "Mathematics", chapter: "Differentiation & Applications", q: "d/dx(x^n) = ?",                              opts: ["nx^(n-1)", "x^(n+1)", "nx", "x^n/n"],                                             ans: "nx^(n-1)",                   sol: "Power rule of differentiation." },
  { id: "q27", subject: "Mathematics", chapter: "Differentiation & Applications", q: "d/dx(sin x) = ?",                            opts: ["cos x", "-cos x", "sin x", "tan x"],                                              ans: "cos x",                      sol: "Standard derivative." },
  { id: "q28", subject: "Mathematics", chapter: "Limit & Function",               q: "lim x to 0 of (sin x / x) = ?",             opts: ["0", "1", "infinity", "undefined"],                                                ans: "1",                          sol: "Standard limit result." },
  { id: "q29", subject: "Physics",     chapter: "Classical Mechanics",            q: "F = ?",                                      opts: ["ma", "mv", "m/a", "a/m"],                                                         ans: "ma",                         sol: "Newton's 2nd law." },
  { id: "q30", subject: "Physics",     chapter: "Classical Mechanics",            q: "Unit of force:",                             opts: ["Newton", "Joule", "Watt", "Pascal"],                                               ans: "Newton",                     sol: "SI unit = Newton." },
  { id: "q31", subject: "Physics",     chapter: "Classical Mechanics",            q: "KE = ?",                                     opts: ["1/2 mv2", "mv2", "mgh", "Fd"],                                                    ans: "1/2 mv2",                    sol: "Kinetic energy formula." },
  { id: "q32", subject: "Physics",     chapter: "Classical Mechanics",            q: "g on Earth = ?",                             opts: ["9.8 m/s2", "8.9 m/s2", "10.8 m/s2", "6.7 m/s2"],                                ans: "9.8 m/s2",                   sol: "Standard gravitational acc." },
  { id: "q33", subject: "Physics",     chapter: "Classical Mechanics",            q: "Momentum = ?",                               opts: ["mv", "m/v", "ma", "FxT"],                                                         ans: "mv",                         sol: "p = mass x velocity." },
  { id: "q34", subject: "Physics",     chapter: "Units & Measurement",            q: "SI unit of length:",                         opts: ["Meter", "Centimeter", "Foot", "Inch"],                                             ans: "Meter",                      sol: "SI unit of length is metre." },
  { id: "q35", subject: "Physics",     chapter: "Units & Measurement",            q: "SI unit of mass:",                           opts: ["Kilogram", "Gram", "Pound", "Ton"],                                                ans: "Kilogram",                   sol: "SI unit of mass = kg." },
  { id: "q36", subject: "Physics",     chapter: "Electric Current",               q: "Ohm's law: V = ?",                           opts: ["IR", "I/R", "R/I", "I2R"],                                                        ans: "IR",                         sol: "V = Current x Resistance." },
  { id: "q37", subject: "Physics",     chapter: "Electric Current",               q: "Unit of resistance:",                        opts: ["Ohm", "Volt", "Ampere", "Watt"],                                                   ans: "Ohm",                        sol: "Resistance unit = Ohm." },
  { id: "q38", subject: "Physics",     chapter: "Electric Current",               q: "Power P = ?",                                opts: ["VI", "V/I", "V+I", "V-I"],                                                        ans: "VI",                         sol: "P = Voltage x Current." },
  { id: "q39", subject: "Physics",     chapter: "Heat & Thermometry",             q: "Absolute zero = ?",                          opts: ["0 K", "-273 C", "Both A and B", "273 K"],                                         ans: "Both A and B",               sol: "0K = -273.15 C." },
  { id: "q40", subject: "Physics",     chapter: "Heat & Thermometry",             q: "Water boils at:",                            opts: ["100 C", "0 C", "37 C", "212 F only"],                                             ans: "100 C",                      sol: "At 1 atm, water boils at 100 C." },
  { id: "q41", subject: "Physics",     chapter: "Wave Motion, Optics & Acoustics",q: "Speed of sound in air = ?",                  opts: ["343 m/s", "243 m/s", "443 m/s", "143 m/s"],                                       ans: "343 m/s",                    sol: "At 20 C." },
  { id: "q42", subject: "Physics",     chapter: "Wave Motion, Optics & Acoustics",q: "Speed of light = ?",                         opts: ["3x10^8 m/s", "3x10^6 m/s", "3x10^10 m/s", "3x10^4 m/s"],                        ans: "3x10^8 m/s",                 sol: "In vacuum." },
  { id: "q43", subject: "Chemistry",   chapter: "Chemical Reactions & Equations", q: "Chemical formula of water:",                 opts: ["H2O", "HO2", "H2O2", "HO"],                                                       ans: "H2O",                        sol: "Two hydrogen, one oxygen." },
  { id: "q44", subject: "Chemistry",   chapter: "Chemical Reactions & Equations", q: "Photosynthesis produces:",                   opts: ["Glucose and O2", "CO2 and water", "NaCl", "NH3"],                                 ans: "Glucose and O2",            sol: "6CO2 + 6H2O gives C6H12O6 + 6O2." },
  { id: "q45", subject: "Chemistry",   chapter: "Acids, Bases & Salts",           q: "pH of pure water:",                          opts: ["7", "0", "14", "1"],                                                              ans: "7",                          sol: "Pure water is neutral, pH = 7." },
  { id: "q46", subject: "Chemistry",   chapter: "Acids, Bases & Salts",           q: "HCl is a _____ acid:",                       opts: ["Strong", "Weak", "Neutral", "Salt"],                                              ans: "Strong",                     sol: "HCl is a strong acid." },
  { id: "q47", subject: "Chemistry",   chapter: "Acids, Bases & Salts",           q: "NaOH is a:",                                 opts: ["Strong base", "Weak acid", "Salt", "Neutral"],                                    ans: "Strong base",                sol: "NaOH = sodium hydroxide = strong base." },
  { id: "q48", subject: "Chemistry",   chapter: "Metals & Non-metals",            q: "Most abundant metal in Earth crust:",        opts: ["Aluminium", "Iron", "Copper", "Gold"],                                             ans: "Aluminium",                  sol: "Al is most abundant metal." },
  { id: "q49", subject: "Chemistry",   chapter: "Metals & Non-metals",            q: "Non-metals are generally:",                  opts: ["Poor conductors", "Good conductors", "Magnetic", "Malleable"],                    ans: "Poor conductors",            sol: "Non-metals do not conduct electricity well." },
  { id: "q50", subject: "Chemistry",   chapter: "Metals & Non-metals",            q: "Atomic number of Iron (Fe):",                opts: ["26", "28", "24", "30"],                                                           ans: "26",                         sol: "Fe has Z = 26." },
  { id: "q51", subject: "Environment", chapter: "Ecosystem & Pollution (Types)",  q: "Greenhouse gas causing most warming:",       opts: ["CO2", "O2", "N2", "Ar"],                                                          ans: "CO2",                        sol: "Carbon dioxide is primary greenhouse gas." },
  { id: "q52", subject: "Environment", chapter: "Ecosystem & Pollution (Types)",  q: "Ozone layer is in:",                         opts: ["Stratosphere", "Troposphere", "Mesosphere", "Exosphere"],                         ans: "Stratosphere",               sol: "Ozone layer is in the stratosphere." },
  { id: "q53", subject: "Environment", chapter: "Climate Change",                 q: "Paris Agreement target temperature rise:",   opts: ["1.5 C", "2.5 C", "3 C", "0.5 C"],                                                ans: "1.5 C",                      sol: "Paris Agreement aims for max 1.5 C rise." },
  { id: "q54", subject: "Environment", chapter: "Hydro / Solar / Wind / Bio-mass Energy", q: "Solar energy source:",              opts: ["Sun", "Wind", "Water", "Biomass"],                                                 ans: "Sun",                        sol: "Solar energy comes from the sun." },
  { id: "q55", subject: "Environment", chapter: "Hydro / Solar / Wind / Bio-mass Energy", q: "Hydropower uses:",                  opts: ["Flowing water", "Wind", "Sun", "Biomass"],                                        ans: "Flowing water",              sol: "Hydro = water-based power generation." },
  { id: "q56", subject: "Computer",    chapter: "Computer Generations (1 to 5)",  q: "1st generation computers used:",             opts: ["Vacuum tubes", "Transistors", "ICs", "Microprocessors"],                          ans: "Vacuum tubes",               sol: "First gen (1940-1956) used vacuum tubes." },
  { id: "q57", subject: "Computer",    chapter: "Computer Generations (1 to 5)",  q: "2nd generation computers used:",             opts: ["Transistors", "Vacuum tubes", "ICs", "Chips"],                                    ans: "Transistors",                sol: "Second gen (1956-1963) used transistors." },
  { id: "q58", subject: "Computer",    chapter: "Computer Generations (1 to 5)",  q: "4th generation used:",                       opts: ["Microprocessors", "ICs", "Transistors", "Vacuum tubes"],                          ans: "Microprocessors",            sol: "4th gen introduced microprocessors." },
  { id: "q59", subject: "Computer",    chapter: "HTML-5",                         q: "HTML stands for:",                           opts: ["HyperText Markup Language", "High Text Markup Language", "HyperText Management Language", "None"], ans: "HyperText Markup Language", sol: "HTML = HyperText Markup Language." },
  { id: "q60", subject: "Computer",    chapter: "HTML-5",                         q: "br tag is used for:",                        opts: ["Line break", "Bold text", "Border", "Background"],                                ans: "Line break",                 sol: "br tag inserts a line break." },
  { id: "q61", subject: "Computer",    chapter: "MS Word / MS Excel / MS PowerPoint", q: "File extension for MS Word:",           opts: [".docx", ".xlsx", ".pptx", ".pdf"],                                                ans: ".docx",                      sol: ".docx is the MS Word format." },
  { id: "q62", subject: "Computer",    chapter: "MS Word / MS Excel / MS PowerPoint", q: "Shortcut to save a file:",              opts: ["Ctrl+S", "Ctrl+P", "Ctrl+C", "Ctrl+X"],                                           ans: "Ctrl+S",                     sol: "Ctrl+S saves the file." },
  { id: "q63", subject: "English",     chapter: "Grammar",                        q: "She ___ to school. Fill in the blank:",      opts: ["goes", "go", "going", "gone"],                                                    ans: "goes",                       sol: "3rd person singular present." },
  { id: "q64", subject: "English",     chapter: "Grammar",                        q: "Plural of Child:",                           opts: ["Children", "Childs", "Childes", "Childrens"],                                     ans: "Children",                   sol: "Irregular plural." },
  { id: "q65", subject: "English",     chapter: "Grammar",                        q: "Antonym of Brave:",                          opts: ["Coward", "Bold", "Fearless", "Daring"],                                           ans: "Coward",                     sol: "Opposite = coward." },
  { id: "q66", subject: "English",     chapter: "Grammar",                        q: "Synonym of Happy:",                          opts: ["Joyful", "Sad", "Angry", "Tired"],                                                ans: "Joyful",                     sol: "Joyful = synonym of happy." },
  { id: "q67", subject: "English",     chapter: "Grammar",                        q: "Passive voice: She writes a letter:",        opts: ["A letter is written by her", "A letter was written", "She is writing", "None"],  ans: "A letter is written by her", sol: "Active to Passive rule." },
  { id: "q68", subject: "English",     chapter: "Theory of Communication",        q: "Communication involves:",                    opts: ["Sender and Receiver", "Only Sender", "Only Receiver", "Machine only"],            ans: "Sender and Receiver",        sol: "Communication = transfer between sender and receiver." },
  { id: "q69", subject: "English",     chapter: "Theory of Communication",        q: "Barrier in communication:",                  opts: ["Noise", "Clarity", "Feedback", "Channel"],                                        ans: "Noise",                      sol: "Noise disrupts communication." },
  { id: "q70", subject: "English",     chapter: "Passage",                        q: "Reading comprehension tests your:",          opts: ["Understanding of text", "Writing skill", "Grammar only", "Vocabulary only"],     ans: "Understanding of text",      sol: "Passage = understanding and inference." },
  { id: "q71", subject: "English",     chapter: "Letter Writing",                 q: "Formal letter ends with:",                   opts: ["Yours faithfully", "Yours lovingly", "See you", "Bye"],                           ans: "Yours faithfully",           sol: "Formal letters close with Yours faithfully." },
  { id: "q72", subject: "English",     chapter: "Correction of Words",            q: "Correct spelling:",                          opts: ["Received", "Recieved", "Recevied", "Recived"],                                    ans: "Received",                   sol: "i before e except after c rule." },
];

export const LEADERBOARD_DATA = [
  { name: "Rahul Patel",  branch: "Computer",   score: 320, accuracy: 88, tests: 12, badge: "🥇" },
  { name: "Mehul Shah",   branch: "Mechanical", score: 305, accuracy: 84, tests: 10, badge: "🥈" },
  { name: "Aryan Joshi",  branch: "Civil",      score: 290, accuracy: 80, tests: 9,  badge: "🥉" },
  { name: "Priya Desai",  branch: "Electrical", score: 275, accuracy: 76, tests: 11, badge: ""   },
  { name: "Sneha Modi",   branch: "Computer",   score: 260, accuracy: 72, tests: 8,  badge: ""   },
  { name: "Dev Trivedi",  branch: "Civil",      score: 245, accuracy: 68, tests: 7,  badge: ""   },
  { name: "Krisha Bhatt", branch: "Mechanical", score: 230, accuracy: 64, tests: 9,  badge: ""   },
  { name: "Rohan Kapoor", branch: "Electrical", score: 215, accuracy: 60, tests: 6,  badge: ""   },
];

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getDaysRemaining() {
  const now = new Date();
  let target = new Date(now.getFullYear(), 4, 15);
  if (now > target) target = new Date(now.getFullYear() + 1, 4, 15);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}
