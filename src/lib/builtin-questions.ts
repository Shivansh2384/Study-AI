/* ═══════════════════════════════════════════════════════════════════════════
   Built-in Question Bank
   These questions are bundled in the app code — they work offline,
   without a database, and without an AI API key.
   ═══════════════════════════════════════════════════════════════════════════ */

interface BuiltinQ {
  questionText: string;
  correctAnswer: string;
  options: { letter: string; text: string }[] | null;
  difficulty: number;
}

const BANK: Record<string, BuiltinQ[]> = {
  "Cell Energy": [
    { questionText: "What is the primary role of cellular respiration?", correctAnswer: "To break down glucose and release ATP for cellular work", options: [{ letter: "A", text: "To break down glucose and release ATP for cellular work" }, { letter: "B", text: "To create new energy from sunlight and water" }, { letter: "C", text: "To store energy in glucose molecules" }, { letter: "D", text: "To transport oxygen throughout the cell" }], difficulty: 2 },
    { questionText: "Where does cellular respiration primarily take place?", correctAnswer: "In the mitochondria", options: [{ letter: "A", text: "In the mitochondria" }, { letter: "B", text: "In the chloroplast" }, { letter: "C", text: "In the nucleus" }, { letter: "D", text: "In the cell membrane" }], difficulty: 2 },
    { questionText: "What is the relationship between photosynthesis and cellular respiration?", correctAnswer: "They are complementary: photosynthesis stores energy in glucose, respiration releases it as ATP", options: [{ letter: "A", text: "They are complementary: photosynthesis stores energy, respiration releases it" }, { letter: "B", text: "They are the same process in different organelles" }, { letter: "C", text: "Photosynthesis creates energy, respiration destroys it" }, { letter: "D", text: "They both produce oxygen" }], difficulty: 3 },
    { questionText: "What is the primary purpose of photosynthesis?", correctAnswer: "To convert light energy into chemical energy stored in glucose", options: [{ letter: "A", text: "To convert light energy into chemical energy stored in glucose" }, { letter: "B", text: "To produce oxygen for animals to breathe" }, { letter: "C", text: "To break down carbon dioxide" }, { letter: "D", text: "To create ATP directly from sunlight" }], difficulty: 2 },
    { questionText: "What is ATP and why is it important?", correctAnswer: "ATP is adenosine triphosphate, the cell's immediate energy currency used for all cellular work", options: null, difficulty: 3 },
    { questionText: "How is ATP different from glucose in terms of energy?", correctAnswer: "Glucose is long-term energy storage; ATP is the immediate usable form of energy that cells need to function", options: null, difficulty: 4 },
    { questionText: "What happens to glucose during cellular respiration?", correctAnswer: "Glucose is broken down into carbon dioxide and water, releasing energy that is captured as ATP", options: [{ letter: "A", text: "It is broken down, releasing energy captured as ATP" }, { letter: "B", text: "It is created from carbon dioxide and water" }, { letter: "C", text: "It is stored in the chloroplast for later use" }, { letter: "D", text: "It is converted directly into oxygen" }], difficulty: 3 },
    { questionText: "Why can't cells use glucose directly for energy?", correctAnswer: "Glucose contains too much energy to use safely in one step — cells must break it down gradually into ATP", options: null, difficulty: 4 },
    { questionText: "What is the role of oxygen in cellular respiration?", correctAnswer: "Oxygen is the final electron acceptor in the electron transport chain, enabling maximum ATP production", options: [{ letter: "A", text: "It is the final electron acceptor, enabling maximum ATP production" }, { letter: "B", text: "It is broken down to provide energy" }, { letter: "C", text: "It combines with glucose to create new cells" }, { letter: "D", text: "It is not needed for cellular respiration" }], difficulty: 3 },
    { questionText: "Do plants perform cellular respiration?", correctAnswer: "Yes, plants perform both photosynthesis and cellular respiration — they need ATP for cellular work just like animals", options: [{ letter: "A", text: "Yes, they do both photosynthesis and cellular respiration" }, { letter: "B", text: "No, only animals do cellular respiration" }, { letter: "C", text: "Only during the night" }, { letter: "D", text: "Only when they cannot photosynthesize" }], difficulty: 3 },
    { questionText: "What are the products of cellular respiration?", correctAnswer: "Carbon dioxide, water, and ATP", options: [{ letter: "A", text: "Carbon dioxide, water, and ATP" }, { letter: "B", text: "Glucose, oxygen, and water" }, { letter: "C", text: "Oxygen, glucose, and ATP" }, { letter: "D", text: "Sunlight, water, and carbon dioxide" }], difficulty: 2 },
    { questionText: "Explain the energy flow from sunlight to cellular work.", correctAnswer: "Sunlight is captured by photosynthesis and stored in glucose, then cellular respiration breaks glucose down into ATP, which powers all cellular activities", options: null, difficulty: 4 },
  ],
  "Photosynthesis": [
    { questionText: "Where does photosynthesis take place?", correctAnswer: "In the chloroplasts of plant cells", options: [{ letter: "A", text: "In the chloroplasts" }, { letter: "B", text: "In the mitochondria" }, { letter: "C", text: "In the nucleus" }, { letter: "D", text: "In the cell wall" }], difficulty: 2 },
    { questionText: "What are the reactants of photosynthesis?", correctAnswer: "Carbon dioxide, water, and light energy", options: [{ letter: "A", text: "Carbon dioxide, water, and light energy" }, { letter: "B", text: "Glucose and oxygen" }, { letter: "C", text: "ATP and glucose" }, { letter: "D", text: "Oxygen and water" }], difficulty: 2 },
    { questionText: "What is the main product of photosynthesis?", correctAnswer: "Glucose (a sugar that stores chemical energy)", options: [{ letter: "A", text: "Glucose" }, { letter: "B", text: "Oxygen" }, { letter: "C", text: "Carbon dioxide" }, { letter: "D", text: "ATP" }], difficulty: 2 },
    { questionText: "Is oxygen a product or byproduct of photosynthesis?", correctAnswer: "Oxygen is a byproduct — the main purpose is to produce glucose for energy storage", options: [{ letter: "A", text: "It is a byproduct — glucose is the main product" }, { letter: "B", text: "It is the main product" }, { letter: "C", text: "It is a reactant, not a product" }, { letter: "D", text: "It is neither — it is not involved" }], difficulty: 3 },
    { questionText: "What role does chlorophyll play in photosynthesis?", correctAnswer: "Chlorophyll absorbs light energy (mainly red and blue wavelengths) and converts it into chemical energy", options: null, difficulty: 3 },
    { questionText: "Why are plants green?", correctAnswer: "Plants are green because chlorophyll reflects green light while absorbing red and blue light for photosynthesis", options: [{ letter: "A", text: "Chlorophyll reflects green light and absorbs other colors" }, { letter: "B", text: "Plants absorb green light for energy" }, { letter: "C", text: "Green is the color of glucose" }, { letter: "D", text: "Oxygen is green in color" }], difficulty: 3 },
    { questionText: "Can photosynthesis occur without light?", correctAnswer: "The light-dependent reactions require light, but the Calvin cycle (light-independent reactions) does not directly need light, though it needs products from the light reactions", options: null, difficulty: 4 },
    { questionText: "What is the chemical equation for photosynthesis?", correctAnswer: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂", options: null, difficulty: 3 },
  ],
  "Cellular Respiration": [
    { questionText: "What is the chemical equation for cellular respiration?", correctAnswer: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP", options: null, difficulty: 3 },
    { questionText: "What are the three main stages of cellular respiration?", correctAnswer: "Glycolysis, the Krebs cycle, and the electron transport chain", options: [{ letter: "A", text: "Glycolysis, Krebs cycle, and electron transport chain" }, { letter: "B", text: "Photosynthesis, digestion, and absorption" }, { letter: "C", text: "Light reactions, Calvin cycle, and ATP synthesis" }, { letter: "D", text: "Mitosis, meiosis, and cytokinesis" }], difficulty: 3 },
    { questionText: "Where does glycolysis occur?", correctAnswer: "In the cytoplasm of the cell", options: [{ letter: "A", text: "In the cytoplasm" }, { letter: "B", text: "In the mitochondria" }, { letter: "C", text: "In the nucleus" }, { letter: "D", text: "In the chloroplast" }], difficulty: 2 },
    { questionText: "What is the difference between aerobic and anaerobic respiration?", correctAnswer: "Aerobic respiration requires oxygen and produces much more ATP; anaerobic respiration does not use oxygen and produces less ATP", options: null, difficulty: 3 },
    { questionText: "How many ATP molecules does cellular respiration produce from one glucose molecule?", correctAnswer: "Approximately 36-38 ATP molecules", options: [{ letter: "A", text: "36-38 ATP" }, { letter: "B", text: "2 ATP" }, { letter: "C", text: "100 ATP" }, { letter: "D", text: "10 ATP" }], difficulty: 3 },
    { questionText: "What happens during the Krebs cycle?", correctAnswer: "Acetyl-CoA is broken down, releasing CO₂ and transferring energy to electron carriers (NADH and FADH₂)", options: null, difficulty: 4 },
  ],
  "ATP": [
    { questionText: "What does ATP stand for?", correctAnswer: "Adenosine triphosphate", options: [{ letter: "A", text: "Adenosine triphosphate" }, { letter: "B", text: "Amino tri-protein" }, { letter: "C", text: "Active transport pathway" }, { letter: "D", text: "Adenine triple phosphorus" }], difficulty: 1 },
    { questionText: "How does ATP release energy?", correctAnswer: "By breaking the bond between the second and third phosphate groups, converting ATP to ADP", options: [{ letter: "A", text: "By breaking a phosphate bond, converting ATP to ADP" }, { letter: "B", text: "By absorbing heat from the environment" }, { letter: "C", text: "By combining with oxygen" }, { letter: "D", text: "By breaking down into glucose" }], difficulty: 3 },
    { questionText: "Why is ATP called the energy currency of the cell?", correctAnswer: "Because ATP is the universal molecule that directly powers all cellular activities, similar to how money is used for all purchases", options: null, difficulty: 3 },
    { questionText: "How is ATP recycled in cells?", correctAnswer: "ADP is converted back to ATP by adding a phosphate group, using energy from cellular respiration", options: [{ letter: "A", text: "ADP gains a phosphate group using energy from respiration" }, { letter: "B", text: "ATP is not recycled — new ATP is always created" }, { letter: "C", text: "ATP breaks down into amino acids and is rebuilt" }, { letter: "D", text: "Cells import ATP from food directly" }], difficulty: 3 },
    { questionText: "What would happen if a cell ran out of ATP?", correctAnswer: "The cell would die because it could not perform any cellular work — no movement, no protein synthesis, no active transport", options: null, difficulty: 3 },
    { questionText: "Where in the cell is most ATP produced?", correctAnswer: "In the mitochondria, specifically at the inner membrane during the electron transport chain", options: [{ letter: "A", text: "In the mitochondria" }, { letter: "B", text: "In the chloroplast" }, { letter: "C", text: "In the nucleus" }, { letter: "D", text: "In the ribosome" }], difficulty: 2 },
  ],
};

/** Generic science questions for custom topics */
const GENERIC: BuiltinQ[] = [
  { questionText: "What is the scientific method?", correctAnswer: "A systematic process of observation, hypothesis, experimentation, and conclusion used to understand natural phenomena", options: [{ letter: "A", text: "A systematic process of observation, hypothesis, experimentation, and conclusion" }, { letter: "B", text: "A way to memorize scientific facts" }, { letter: "C", text: "A mathematical formula" }, { letter: "D", text: "A type of laboratory equipment" }], difficulty: 2 },
  { questionText: "What is the difference between a hypothesis and a theory?", correctAnswer: "A hypothesis is a testable prediction; a theory is a well-tested explanation supported by extensive evidence", options: null, difficulty: 3 },
  { questionText: "Why is it important to have a control group in an experiment?", correctAnswer: "The control group provides a baseline for comparison, allowing scientists to determine if the variable being tested actually caused the observed effect", options: null, difficulty: 3 },
];

export function getBuiltinQuestions(topic: string, count: number): BuiltinQ[] {
  // Exact match
  if (BANK[topic]) {
    const pool = [...BANK[topic]];
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    return pool.slice(0, count);
  }

  // Partial match
  const lower = topic.toLowerCase();
  for (const [key, qs] of Object.entries(BANK)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      const pool = [...qs];
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      return pool.slice(0, count);
    }
  }

  // Fallback: mix from all banks + generic
  const all = [...Object.values(BANK).flat(), ...GENERIC];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all.slice(0, count);
}
