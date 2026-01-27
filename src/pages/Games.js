import React, { useState, useEffect } from "react";
import MatchingGame from "../components/games/MatchingGame";
import QuizGame from "../components/games/QuizGame";
import PuzzleGame from "../components/games/PuzzleGame";
import MemoryGame from "../components/games/MemoryGame";
import DragDropGame from "../components/games/DragDropGame";
import BuilderGame from "../components/games/BuilderGame";
import ReactionGame from "../components/games/ReactionGame";
import "./Games.css";
import { addGameScore, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

function Games({ onGameWin }) {
  const [user, setUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("Biology");
  const [isLoading, setIsLoading] = useState(true);
  const [playerCoins, setPlayerCoins] = useState(0);
  const [activeGame, setActiveGame] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [unlockedGames, setUnlockedGames] = useState(new Set());

  useEffect(() => {
    console.log("🎮 Games component mounted");
    const savedUser = localStorage.getItem("user");
    console.log("🎮 User from localStorage:", savedUser);
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("🎮 Parsed user:", parsedUser);
        setUser(parsedUser);
        setPlayerCoins(parsedUser.coins || 0);
      } catch (e) {
        console.error("🎮 Error parsing user:", e);
      }
    }

    // Load unlocked games from localStorage
    const savedUnlocked = localStorage.getItem("unlockedGames");
    if (savedUnlocked) {
      try {
        const unlockedArray = JSON.parse(savedUnlocked);
        setUnlockedGames(new Set(unlockedArray));
      } catch (e) {
        console.error("🎮 Error loading unlocked games:", e);
      }
    } else {
      // First time - only unlock the first game of each topic (game_number: 1)
      // IDs: 1 (Biology), 11 (Chemistry), 21 (Physics), 31 (Env Sci), 41 (Economics), 51 (History), 61 (Geography), 71 (Psychology)
      const initialUnlocked = new Set([1, 11, 21, 31, 41, 51, 61, 71]);
      setUnlockedGames(initialUnlocked);
      localStorage.setItem("unlockedGames", JSON.stringify(Array.from(initialUnlocked)));
    }

    setIsLoading(false);
  }, []);

  // Comprehensive game data - 10 games per science topic
  // First game of each lesson is FREE (coin_cost: 0)
  // Other games cost coins and reward more based on difficulty
  const gamesByTopic = {
    Biology: [
      { id: 1, game_number: 1, title: "Cell Structure Master", description: "Identify cell organelles and their functions. Match organelles to their descriptions.", lesson: "Introduction to Biology", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 2, game_number: 2, title: "Photosynthesis Puzzle", description: "Guide plants through photosynthesis. Learn light and dark reactions.", lesson: "Photosynthesis & Cellular Respiration", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 3, game_number: 3, title: "Evolution Match", description: "Connect species to their evolutionary adaptations. Understand natural selection.", lesson: "Evolution & Natural Selection", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 4, game_number: 4, title: "Genetics Inheritance", description: "Create Punnett squares to predict offspring traits.", lesson: "Genetics & Heredity", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 5, game_number: 5, title: "DNA Sequencer", description: "Arrange DNA bases in correct order. Learn genetic coding.", lesson: "DNA & Molecular Biology", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 6, game_number: 6, title: "Ecosystem Builder", description: "Create balanced ecosystems with food chains and energy flow.", lesson: "Ecology & Ecosystems", base_reward: 480, coin_cost: 160, difficulty: "Medium" },
      { id: 7, game_number: 7, title: "Population Simulator", description: "Manage population growth and limiting factors.", lesson: "Population Dynamics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 8, game_number: 8, title: "Anatomy Labeler", description: "Label human body systems and organs correctly.", lesson: "Human Body Systems", base_reward: 1920, coin_cost: 640, difficulty: "Medium" },
      { id: 9, game_number: 9, title: "Immune Response", description: "Learn how immune cells fight infections and disease.", lesson: "Immune System & Disease", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 10, game_number: 10, title: "Taxonomy Challenge", description: "Classify organisms using the binomial nomenclature system.", lesson: "Classification & Taxonomy", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    Chemistry: [
      { id: 11, game_number: 1, title: "Periodic Table Master", description: "Learn elements, symbols, and periodic trends.", lesson: "Atomic Structure & Periodic Table", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 12, game_number: 2, title: "Electron Configuration", description: "Fill electron shells with correct orbital arrangement.", lesson: "Electrons & Energy Levels", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 13, game_number: 3, title: "Bonding Builder", description: "Form ionic, covalent, and metallic bonds.", lesson: "Chemical Bonding", base_reward: 60, coin_cost: 20, difficulty: "Hard" },
      { id: 14, game_number: 4, title: "Molecule Constructor", description: "Build molecules from atoms. Learn molecular structures.", lesson: "Molecular Geometry", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 15, game_number: 5, title: "Reaction Balancer", description: "Balance chemical equations and identify reaction types.", lesson: "Chemical Reactions", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 16, game_number: 6, title: "Stoichiometry Solver", description: "Calculate molar relationships in chemical reactions.", lesson: "Stoichiometry & Moles", base_reward: 480, coin_cost: 160, difficulty: "Expert" },
      { id: 17, game_number: 7, title: "Acid-Base Analyzer", description: "Determine pH and classify acids, bases, and salts.", lesson: "Acids, Bases & pH", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 18, game_number: 8, title: "Oxidation Redux", description: "Identify oxidation and reduction reactions.", lesson: "Redox & Electrochemistry", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 19, game_number: 9, title: "Thermochemistry Lab", description: "Calculate enthalpy and predict reaction energy changes.", lesson: "Thermochemistry & Energy", base_reward: 3840, coin_cost: 1280, difficulty: "Expert" },
      { id: 20, game_number: 10, title: "Kinetics Inspector", description: "Understand reaction rates and activation energy.", lesson: "Reaction Kinetics", base_reward: 7680, coin_cost: 2560, difficulty: "Hard" },
    ],
    Physics: [
      { id: 21, game_number: 1, title: "Force & Motion", description: "Apply Newton's laws to solve physics problems.", lesson: "Forces & Newton's Laws", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 22, game_number: 2, title: "Kinematics Calculator", description: "Calculate distance, velocity, and acceleration.", lesson: "Motion & Kinematics", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 23, game_number: 3, title: "Energy Transformer", description: "Convert between kinetic and potential energy.", lesson: "Work & Energy", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 24, game_number: 4, title: "Momentum Master", description: "Calculate momentum and collisions.", lesson: "Momentum & Impulse", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 25, game_number: 5, title: "Circular Motion", description: "Solve centripetal force and rotational problems.", lesson: "Circular Motion & Gravity", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 26, game_number: 6, title: "Wave Simulator", description: "Create and analyze waves, frequency, and wavelength.", lesson: "Waves & Sound", base_reward: 480, coin_cost: 160, difficulty: "Medium" },
      { id: 27, game_number: 7, title: "Optics Explorer", description: "Learn reflection, refraction, and light properties.", lesson: "Light & Optics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 28, game_number: 8, title: "Electricity Circuits", description: "Build circuits and calculate current, voltage, resistance.", lesson: "Electricity & Circuits", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 29, game_number: 9, title: "Magnetism Field", description: "Visualize magnetic fields and electromagnetic forces.", lesson: "Magnetism & Electromagnetism", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 30, game_number: 10, title: "Quantum Quest", description: "Explore quantum mechanics and atomic models.", lesson: "Modern Physics & Quantum", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "Environmental Science": [
      { id: 31, game_number: 1, title: "Biome Explorer", description: "Identify biomes and their characteristics worldwide.", lesson: "Earth's Biomes", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 32, game_number: 2, title: "Water Cycle Tracker", description: "Follow water through evaporation, condensation, precipitation.", lesson: "Water Cycle & Hydrosphere", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 33, game_number: 3, title: "Nutrient Cycling", description: "Track nitrogen, phosphorus, and carbon cycles.", lesson: "Nutrient Cycles", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 34, game_number: 4, title: "Weathering & Erosion", description: "Understand rock formation and soil development.", lesson: "Rocks, Minerals & Weathering", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 35, game_number: 5, title: "Weather Predictor", description: "Analyze weather patterns and atmospheric conditions.", lesson: "Weather & Atmosphere", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 36, game_number: 6, title: "Climate Modeler", description: "Simulate climate scenarios and predict changes.", lesson: "Climate & Climate Change", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 37, game_number: 7, title: "Conservation Hero", description: "Make decisions to protect endangered species and habitats.", lesson: "Biodiversity & Conservation", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 38, game_number: 8, title: "Pollution Fighter", description: "Identify pollution types and environmental solutions.", lesson: "Pollution & Environmental Issues", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 39, game_number: 9, title: "Renewable Energy", description: "Learn about solar, wind, and sustainable energy sources.", lesson: "Renewable & Sustainable Resources", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 40, game_number: 10, title: "Ecosystem Manager", description: "Balance human needs with ecosystem health.", lesson: "Human Impact & Sustainability", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    Economics: [
      { id: 41, game_number: 1, title: "Supply & Demand", description: "Balance markets and find equilibrium prices.", lesson: "Supply, Demand & Markets", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 42, game_number: 2, title: "Business Tycoon", description: "Run a virtual business with profit and loss.", lesson: "Business & Entrepreneurship", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 43, game_number: 3, title: "Budget Manager", description: "Create household and government budgets.", lesson: "Personal & Government Finance", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 44, game_number: 4, title: "Investment Trader", description: "Buy and sell stocks and build a portfolio.", lesson: "Stocks & Investments", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 45, game_number: 5, title: "GDP Calculator", description: "Measure economic growth and productivity.", lesson: "Macroeconomics & GDP", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 46, game_number: 6, title: "Inflation Monitor", description: "Manage inflation, unemployment, and interest rates.", lesson: "Inflation & Monetary Policy", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 47, game_number: 7, title: "Trade Navigator", description: "Understand international trade and tariffs.", lesson: "International Trade", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 48, game_number: 8, title: "Tax Planner", description: "Calculate taxes and optimize financial strategy.", lesson: "Taxation & Tax Planning", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 49, game_number: 9, title: "Labor Economics", description: "Understand wages, employment, and worker rights.", lesson: "Labor Economics", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 50, game_number: 10, title: "Economic Systems", description: "Compare capitalism, socialism, and mixed economies.", lesson: "Economic Systems & Theory", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    History: [
      { id: 51, game_number: 1, title: "Timeline Constructor", description: "Arrange historical events in correct order.", lesson: "Ancient Civilizations", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 52, game_number: 2, title: "Medieval Kingdoms", description: "Learn about feudalism and medieval society.", lesson: "Medieval Period", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 53, game_number: 3, title: "Renaissance Trivia", description: "Explore art, science, and culture rebirth.", lesson: "Renaissance & Reformation", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 54, game_number: 4, title: "Age of Exploration", description: "Track explorers and discovery of new lands.", lesson: "Age of Exploration", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 55, game_number: 5, title: "Revolution Puzzle", description: "Understand causes and effects of major revolutions.", lesson: "Revolutionary Movements", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 56, game_number: 6, title: "Industrial Era", description: "Learn about industrialization and social changes.", lesson: "Industrial Revolution", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 57, game_number: 7, title: "World War Historian", description: "Study major conflicts and their impacts.", lesson: "20th Century Wars", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 58, game_number: 8, title: "Cold War Strategies", description: "Understand geopolitical tensions and diplomacy.", lesson: "Cold War Period", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 59, game_number: 9, title: "Modern History Map", description: "Trace contemporary historical movements and events.", lesson: "Modern History & Globalization", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 60, game_number: 10, title: "Historical Figures", description: "Match leaders and thinkers with their achievements.", lesson: "Key Historical Figures", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "Human Geography": [
      { id: 61, game_number: 1, title: "Map Master", description: "Identify countries, capitals, and geographic features.", lesson: "World Geography & Maps", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 62, game_number: 2, title: "Culture Explorer", description: "Learn about different cultures and traditions worldwide.", lesson: "Cultural Geography", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 63, game_number: 3, title: "Population Analyzer", description: "Study population distribution and demographics.", lesson: "Population & Demographics", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 64, game_number: 4, title: "Urban Planner", description: "Design sustainable cities and urban spaces.", lesson: "Urban Geography", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 65, game_number: 5, title: "Economic Regions", description: "Understand global economic zones and trade.", lesson: "Economic Geography", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 66, game_number: 6, title: "Political Boundaries", description: "Learn geopolitics and international borders.", lesson: "Political Geography", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 67, game_number: 7, title: "Resource Manager", description: "Manage natural resources sustainably.", lesson: "Natural Resources & Environment", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 68, game_number: 8, title: "Migration Tracker", description: "Understand human migration and diaspora.", lesson: "Migration & Diaspora", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 69, game_number: 9, title: "Climate & Landscape", description: "Explore climate zones and landforms.", lesson: "Climate & Landforms", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 70, game_number: 10, title: "Development Compass", description: "Compare economic development across regions.", lesson: "Development & Inequality", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    Psychology: [
      { id: 71, game_number: 1, title: "Cognitive Bias Detector", description: "Identify common thinking patterns and biases.", lesson: "Introduction to Psychology", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 72, game_number: 2, title: "Memory Mastermind", description: "Learn and test different types of memory.", lesson: "Sensation & Perception", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 73, game_number: 3, title: "Learning Pathways", description: "Understand classical and operant conditioning.", lesson: "Learning & Conditioning", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 74, game_number: 4, title: "Motivation Motivator", description: "Explore needs, drives, and motivation theories.", lesson: "Motivation & Emotion", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 75, game_number: 5, title: "Personality Puzzle", description: "Learn personality theories and assessment.", lesson: "Personality & Development", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 76, game_number: 6, title: "Social Dynamics", description: "Understand group behavior and social influence.", lesson: "Social Psychology", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 77, game_number: 7, title: "Mental Health Guide", description: "Learn about disorders and mental wellness.", lesson: "Mental Health & Disorders", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 78, game_number: 8, title: "Therapy Techniques", description: "Understand psychological treatments and therapy.", lesson: "Therapies & Interventions", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 79, game_number: 9, title: "Neuroscience Quest", description: "Explore brain structure and neurotransmitters.", lesson: "Biopsychology & Neuroscience", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 80, game_number: 10, title: "Research Methods", description: "Learn experimental design and statistical analysis.", lesson: "Research Methods & Statistics", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
  };

  const topicGames = gamesByTopic[selectedTopic] || [];

  // Game content library - maps game IDs to actual game data
  const gameContentLibrary = {
    // BIOLOGY GAMES (1-10)
    1: {
      type: "matching",
      title: "Cell Structure Master",
      description: "Match cell organelles to their functions",
      matchPairs: [
        { answer: "organelle1", term: "Mitochondria", definition: "Powerhouse of the cell, produces ATP energy" },
        { answer: "organelle2", term: "Nucleus", definition: "Contains DNA and controls cellular functions" },
        { answer: "organelle3", term: "Chloroplast", definition: "Site of photosynthesis in plant cells" },
        { answer: "organelle4", term: "Ribosome", definition: "Site of protein synthesis" },
        { answer: "organelle5", term: "Golgi Apparatus", definition: "Modifies and packages proteins" },
      ]
    },
    2: {
      type: "memory",
      title: "Photosynthesis Puzzle",
      description: "Match light and dark reaction components",
      pairs: [
        { term: "Light Reaction", answer: "light1" },
        { term: "Produces ATP & NADPH", answer: "light1" },
        { term: "Dark Reaction (Calvin Cycle)", answer: "dark1" },
        { term: "Produces Glucose", answer: "dark1" },
        { term: "CO₂ is used", answer: "dark1" },
        { term: "O₂ is released", answer: "light1" },
      ]
    },
    3: {
      type: "matching",
      title: "Evolution Match",
      description: "Connect species to their evolutionary adaptations",
      matchPairs: [
        { answer: "adapt1", term: "Giraffe", definition: "Long neck adapted for browsing high leaves" },
        { answer: "adapt2", term: "Camels", definition: "Humps store fat for desert survival" },
        { answer: "adapt3", term: "Arctic Foxes", definition: "White fur provides camouflage in snow" },
        { answer: "adapt4", term: "Cheetahs", definition: "High speed for hunting in open plains" },
        { answer: "adapt5", term: "Chameleons", definition: "Color change for camouflage and communication" },
      ]
    },
    4: {
      type: "quiz",
      title: "Genetics Inheritance",
      description: "Master Mendelian genetics and heredity patterns",
      questions: [
        {
          question: "What is a gene?",
          options: ["A type of protein", "A segment of DNA that codes for a trait", "A chromosome", "An amino acid"],
          correct: 1,
          explanation: "A gene is a specific DNA sequence that codes for a protein or trait"
        },
        {
          question: "What are alleles?",
          options: ["Different versions of a gene", "Mutations only", "Dominant traits", "Recessive traits"],
          correct: 0,
          explanation: "Alleles are different versions of the same gene at a locus"
        },
        {
          question: "If both parents are heterozygous (Aa) for a trait, what percentage of offspring will be homozygous?",
          options: ["25%", "50%", "75%", "100%"],
          correct: 0,
          explanation: "In Aa × Aa cross: 25% AA, 50% Aa, 25% aa = 50% homozygous"
        },
        {
          question: "What is the phenotype?",
          options: ["The genetic makeup", "The observable characteristics", "The DNA sequence", "The protein structure"],
          correct: 1,
          explanation: "Phenotype is the observable physical or biochemical characteristics"
        },
        {
          question: "What is codominance?",
          options: ["One allele masks another", "Both alleles are fully expressed", "A recessive allele expressing", "Mutation in both alleles"],
          correct: 1,
          explanation: "Codominance occurs when both alleles are fully expressed in the heterozygote"
        }
      ]
    },
    5: {
      type: "dragdrop",
      title: "DNA Sequencer",
      description: "Arrange DNA bases in correct order - A pairs with T, C pairs with G",
      items: [
        { id: "item1", name: "Adenine (A)", correctZone: "A_pair" },
        { id: "item2", name: "Thymine (T)", correctZone: "A_pair" },
        { id: "item3", name: "Cytosine (C)", correctZone: "C_pair" },
        { id: "item4", name: "Guanine (G)", correctZone: "C_pair" },
      ],
      zones: [
        { id: "A_pair", label: "A-T Base Pair" },
        { id: "C_pair", label: "C-G Base Pair" },
      ]
    },
    6: {
      type: "memory",
      title: "Ecosystem Builder",
      description: "Match organisms to their ecosystem roles",
      pairs: [
        { term: "Producer", answer: "eco1" },
        { term: "Green plants that make food", answer: "eco1" },
        { term: "Primary Consumer", answer: "eco2" },
        { term: "Herbivores eating plants", answer: "eco2" },
        { term: "Decomposer", answer: "eco3" },
        { term: "Bacteria breaking down dead matter", answer: "eco3" },
      ]
    },
    7: {
      type: "puzzle",
      title: "Population Simulator",
      description: "Balance population factors - birth rate, death rate, and carrying capacity",
      puzzleElements: [
        { id: "p1", content: "High birth rate", category: "increase" },
        { id: "p2", content: "Food scarcity", category: "decrease" },
        { id: "p3", content: "Disease outbreak", category: "decrease" },
        { id: "p4", content: "Immigration", category: "increase" },
        { id: "p5", content: "Predators hunting", category: "decrease" },
      ],
      goal: "Match factors to their population effects"
    },
    8: {
      type: "dragdrop",
      title: "Anatomy Labeler",
      description: "Drag human body system organs to correct locations",
      items: [
        { id: "item1", name: "Heart", correctZone: "chest" },
        { id: "item2", name: "Lungs", correctZone: "chest" },
        { id: "item3", name: "Brain", correctZone: "head" },
        { id: "item4", name: "Liver", correctZone: "abdomen" },
        { id: "item5", name: "Stomach", correctZone: "abdomen" },
      ],
      zones: [
        { id: "head", label: "Head" },
        { id: "chest", label: "Chest" },
        { id: "abdomen", label: "Abdomen" },
      ]
    },
    9: {
      type: "reaction",
      title: "Immune Response",
      description: "Test your reaction time against spreading pathogens"
    },
    10: {
      type: "builder",
      title: "Taxonomy Challenge",
      description: "Build the correct classification order for organisms",
      levels: [
        { level: 1, items: ["Kingdom", "Phylum", "Class"], correct: ["Kingdom", "Phylum", "Class"] },
        { level: 2, items: ["Order", "Family", "Genus"], correct: ["Order", "Family", "Genus"] },
        { level: 3, items: ["Species"], correct: ["Species"] },
      ]
    },

    // CHEMISTRY GAMES (11-20)
    11: {
      type: "memory",
      title: "Periodic Table Master",
      description: "Match elements to their properties",
      pairs: [
        { term: "Hydrogen", answer: "chem1" },
        { term: "Lightest element, atomic # 1", answer: "chem1" },
        { term: "Oxygen", answer: "chem2" },
        { term: "Life-sustaining gas, atomic # 8", answer: "chem2" },
        { term: "Carbon", answer: "chem3" },
        { term: "Foundation of organic life, atomic # 6", answer: "chem3" },
      ]
    },
    12: {
      type: "matching",
      title: "Electron Configuration",
      description: "Match atoms to their electron configurations",
      matchPairs: [
        { answer: "conf1", term: "Hydrogen (H)", definition: "1s¹" },
        { answer: "conf2", term: "Helium (He)", definition: "1s²" },
        { answer: "conf3", term: "Lithium (Li)", definition: "1s² 2s¹" },
        { answer: "conf4", term: "Carbon (C)", definition: "1s² 2s² 2p²" },
        { answer: "conf5", term: "Oxygen (O)", definition: "1s² 2s² 2p⁴" },
      ]
    },
    13: {
      type: "dragdrop",
      title: "Bonding Builder",
      description: "Drag electrons to form ionic and covalent bonds",
      items: [
        { id: "item1", name: "Electron", correctZone: "covalent" },
        { id: "item2", name: "Electron", correctZone: "covalent" },
        { id: "item3", name: "Electron Transfer", correctZone: "ionic" },
      ],
      zones: [
        { id: "covalent", label: "Covalent Bond (Sharing)" },
        { id: "ionic", label: "Ionic Bond (Transfer)" },
      ]
    },
    14: {
      type: "puzzle",
      title: "Molecule Constructor",
      description: "Arrange atoms to build correct molecular structures",
      puzzleElements: [
        { id: "m1", content: "2 Hydrogen", category: "H" },
        { id: "m2", content: "1 Oxygen", category: "O" },
        { id: "m3", content: "1 Carbon", category: "C" },
        { id: "m4", content: "2 Oxygen", category: "O" },
      ],
      goal: "Build H₂O and CO₂ molecules"
    },
    15: {
      type: "matching",
      title: "Reaction Balancer",
      description: "Match reactants to balanced equations",
      matchPairs: [
        { answer: "rxn1", term: "Hydrogen + Oxygen", definition: "2H₂ + O₂ → 2H₂O" },
        { answer: "rxn2", term: "Carbon + Oxygen", definition: "2C + O₂ → 2CO" },
        { answer: "rxn3", term: "Iron + Chlorine", definition: "2Fe + 3Cl₂ → 2FeCl₃" },
        { answer: "rxn4", term: "Methane + Oxygen", definition: "CH₄ + 2O₂ → CO₂ + 2H₂O" },
        { answer: "rxn5", term: "Sodium + Chlorine", definition: "2Na + Cl₂ → 2NaCl" },
      ]
    },
    16: {
      type: "memory",
      title: "Stoichiometry Solver",
      description: "Match mole ratios from balanced equations",
      pairs: [
        { term: "Avogadro's Number", answer: "moles1" },
        { term: "6.02 × 10²³ particles per mole", answer: "moles1" },
        { term: "Molar Mass of H₂O", answer: "moles2" },
        { term: "18 g/mol", answer: "moles2" },
        { term: "Molar Mass of CO₂", answer: "moles3" },
        { term: "44 g/mol", answer: "moles3" },
      ]
    },
    17: {
      type: "quiz",
      title: "Acid-Base Analyzer",
      description: "Determine pH and classify acids and bases",
      questions: [
        {
          question: "What is pH?",
          options: ["Percentage of hydrogen", "Power of hydrogen concentration", "Potential hydride", "Proton hydrogen"],
          correct: 1,
          explanation: "pH = -log[H⁺], measuring hydrogen ion concentration"
        },
        {
          question: "What is the pH range of neutral solutions?",
          options: ["0-5", "6-8", "7", "8-14"],
          correct: 2,
          explanation: "pH 7 is neutral (pure water at 25°C)"
        },
        {
          question: "What pH range indicates acidic solutions?",
          options: ["pH < 7", "pH = 7", "pH > 7", "pH > 14"],
          correct: 0,
          explanation: "Acidic solutions have pH less than 7"
        },
        {
          question: "What are strong acids?",
          options: ["Acids that taste sour", "Acids that completely dissociate in water", "Organic acids", "Weak acids with low pH"],
          correct: 1,
          explanation: "Strong acids completely dissociate into H⁺ and anions"
        },
        {
          question: "What occurs during neutralization?",
          options: ["Acid increases", "Acid and base react to form salt and water", "Base is removed", "pH increases"],
          correct: 1,
          explanation: "Neutralization: Acid + Base → Salt + Water"
        }
      ]
    },
    18: {
      type: "dragdrop",
      title: "Oxidation Redux",
      description: "Drag electrons to show oxidation and reduction",
      items: [
        { id: "item1", name: "Electron (Oxidation)", correctZone: "loss" },
        { id: "item2", name: "Electron (Oxidation)", correctZone: "loss" },
        { id: "item3", name: "Electron (Reduction)", correctZone: "gain" },
      ],
      zones: [
        { id: "loss", label: "Oxidation (Loss)" },
        { id: "gain", label: "Reduction (Gain)" },
      ]
    },
    19: {
      type: "reaction",
      title: "Thermochemistry Lab",
      description: "Quickly classify reactions as exothermic or endothermic"
    },
    20: {
      type: "memory",
      title: "Kinetics Inspector",
      description: "Match reaction rate factors to their effects",
      pairs: [
        { term: "Increased Temperature", answer: "kin1" },
        { term: "Increases reaction rate", answer: "kin1" },
        { term: "Catalyst", answer: "kin2" },
        { term: "Lowers activation energy", answer: "kin2" },
        { term: "Decreased Surface Area", answer: "kin3" },
        { term: "Decreases reaction rate", answer: "kin3" },
      ]
    },

    // PHYSICS GAMES (21-30)
    21: {
      type: "matching",
      title: "Force & Motion",
      description: "Match Newton's laws to their descriptions",
      matchPairs: [
        { answer: "law1", term: "First Law", definition: "Object in motion stays in motion unless acted upon" },
        { answer: "law2", term: "Second Law", definition: "F = ma (Force equals mass times acceleration)" },
        { answer: "law3", term: "Third Law", definition: "For every action there is equal opposite reaction" },
        { answer: "law4", term: "Friction", definition: "Force opposing motion between surfaces" },
        { answer: "law5", term: "Gravity", definition: "Attractive force between masses pulling toward Earth" },
      ]
    },
    22: {
      type: "puzzle",
      title: "Kinematics Calculator",
      description: "Arrange motion equations in correct order",
      puzzleElements: [
        { id: "kin1", content: "v = u + at", category: "velocity" },
        { id: "kin2", content: "s = ut + ½at²", category: "displacement" },
        { id: "kin3", content: "v² = u² + 2as", category: "velocity" },
      ],
      goal: "Match equations to their applications"
    },
    23: {
      type: "dragdrop",
      title: "Energy Transformer",
      description: "Drag energy types to show transformations",
      items: [
        { id: "item1", name: "Kinetic Energy", correctZone: "kinetic" },
        { id: "item2", name: "Potential Energy", correctZone: "potential" },
        { id: "item3", name: "Thermal Energy", correctZone: "thermal" },
      ],
      zones: [
        { id: "kinetic", label: "Motion Energy" },
        { id: "potential", label: "Stored Energy" },
        { id: "thermal", label: "Heat Energy" },
      ]
    },
    24: {
      type: "memory",
      title: "Waves & Sound",
      description: "Match wave properties to their definitions",
      pairs: [
        { term: "Wavelength", answer: "wave1" },
        { term: "Distance between two consecutive crests", answer: "wave1" },
        { term: "Frequency", answer: "wave2" },
        { term: "Number of waves per second", answer: "wave2" },
        { term: "Amplitude", answer: "wave3" },
        { term: "Maximum displacement from equilibrium", answer: "wave3" },
      ]
    },
    25: {
      type: "matching",
      title: "Electricity Explorer",
      description: "Match electrical concepts to their definitions",
      matchPairs: [
        { answer: "elec1", term: "Current", definition: "Flow of electric charge, measured in Amperes" },
        { answer: "elec2", term: "Voltage", definition: "Electric potential difference, measured in Volts" },
        { answer: "elec3", term: "Resistance", definition: "Opposition to current flow, measured in Ohms" },
        { answer: "elec4", term: "Ohm's Law", definition: "V = IR" },
        { answer: "elec5", term: "Power", definition: "Rate of energy transfer, measured in Watts" },
      ]
    },
    26: {
      type: "reaction",
      title: "Optics Speed Game",
      description: "Test your reaction identifying angles of incidence and reflection"
    },
    27: {
      type: "builder",
      title: "Quantum Leap",
      description: "Build correct electron orbital diagrams",
      levels: [
        { level: 1, items: ["1s"], correct: ["1s"] },
        { level: 2, items: ["1s", "2s", "2p"], correct: ["1s", "2s", "2p"] },
      ]
    },
    28: {
      type: "puzzle",
      title: "Thermodynamics",
      description: "Arrange thermodynamic concepts in correct relationships",
      puzzleElements: [
        { id: "therm1", content: "Heat input", category: "process" },
        { id: "therm2", content: "Work output", category: "process" },
        { id: "therm3", content: "Internal energy change", category: "outcome" },
      ],
      goal: "Understand first law of thermodynamics"
    },
    29: {
      type: "matching",
      title: "Relativity Basics",
      description: "Match Einstein's concepts to explanations",
      matchPairs: [
        { answer: "rel1", term: "Special Relativity", definition: "Laws of physics same for all observers" },
        { answer: "rel2", term: "General Relativity", definition: "Gravity as curvature of spacetime" },
        { answer: "rel3", term: "E = mc²", definition: "Energy and mass are interchangeable" },
        { answer: "rel4", term: "Time Dilation", definition: "Time passes differently at different speeds" },
        { answer: "rel5", term: "Rest Mass", definition: "Mass of object at rest" },
      ]
    },
    30: {
      type: "memory",
      title: "Modern Physics",
      description: "Match quantum and nuclear concepts",
      pairs: [
        { term: "Photon", answer: "modern1" },
        { term: "Particle of light with energy", answer: "modern1" },
        { term: "Nucleus", answer: "modern2" },
        { term: "Center of atom with protons and neutrons", answer: "modern2" },
        { term: "Electron", answer: "modern3" },
        { term: "Negatively charged subatomic particle", answer: "modern3" },
      ]
    },
  };

  const getGameContent = (gameId) => {
    return gameContentLibrary[gameId] || { type: "memory", pairs: [] };
  };

  const playGame = (game) => {
    // Check if game is already unlocked
    const isUnlocked = unlockedGames.has(game.id);

    // Check if game requires coins and purchase/play
    if (game.coin_cost > 0 && !isUnlocked) {
      if (playerCoins < game.coin_cost) {
        alert(`❌ Not enough coins! You need ${game.coin_cost} coins but only have ${playerCoins}`);
        return;
      }
      
      // Confirm purchase
      if (!window.confirm(`🔒 This game costs ${game.coin_cost} coins to unlock. Proceed?`)) {
        return;
      }

      // Deduct coins for purchase
      const newCoins = playerCoins - game.coin_cost;
      setPlayerCoins(newCoins);

      // Add to unlocked games
      const newUnlocked = new Set(unlockedGames);
      newUnlocked.add(game.id);
      setUnlockedGames(newUnlocked);
      localStorage.setItem("unlockedGames", JSON.stringify(Array.from(newUnlocked)));

      // Update user coins
      if (user) {
        const updatedUser = { ...user, coins: newCoins };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      alert(`✅ Game unlocked! You now own "${game.title}"`);
    }

    // Load game content and start playing
    const gameContent = getGameContent(game.id);
    setActiveGame(game);
    setGameType(gameContent.type);
  };

  const handleGameComplete = (scoreEarned) => {
    if (!activeGame || !user) return;

    try {
      // Deduct coins if paid game
      let newCoins = playerCoins;
      if (activeGame.coin_cost > 0) {
        newCoins = playerCoins - activeGame.coin_cost;
      }

      // Add reward coins
      newCoins += activeGame.base_reward;
      setPlayerCoins(newCoins);

      // Update user in localStorage
      const updatedUser = { ...user, coins: newCoins };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Save game score to dashboard stats using storageManager
      addGameScore(user.id, activeGame.base_reward);

      // Log activity
      const topic = Object.keys(gamesByTopic).find(topic => 
        gamesByTopic[topic].some(g => g.id === activeGame.id)
      ) || "Games";
      
      logActivity(user.id, {
        type: "Game Won",
        description: `Completed ${activeGame.title}`,
        subject: topic,
      });

      // Check and unlock any new achievements
      const newlyUnlocked = checkAndUnlockAchievements(user.id);
      if (newlyUnlocked.length > 0) {
        console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked from game completion!`);
      }

      // Notify parent
      if (onGameWin) onGameWin(activeGame.id, activeGame.base_reward);

      // Show completion modal
      alert(`🎉 Great job! You earned ${activeGame.base_reward} coins!`);
      
      // Dispatch event to update dashboard
      window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
      
      setActiveGame(null);
    } catch (error) {
      console.error("❌ Error completing game:", error);
    }
  };

  const handleExitGame = () => {
    if (window.confirm("Are you sure you want to exit? Your game progress has been automatically saved and you can resume where you left off.")) {
      setActiveGame(null);
    }
  };

  if (isLoading) {
    return <div style={{ padding: "60px 20px", textAlign: "center", color: "#f9fafb", background: "radial-gradient(circle at top, #0b1120 0, #020617 100%)", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>Loading games...</h1>
    </div>;
  }

  if (!user) {
    return <div style={{ padding: "60px 20px", textAlign: "center", color: "#f9fafb", background: "radial-gradient(circle at top, #0b1120 0, #020617 100%)", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>⚠️ Please log in to play games</h1>
      <p style={{ color: "#9ca3af" }}>Redirect to login...</p>
    </div>;
  }

  // If a game is active, show the game interface
  if (activeGame && gameType) {
    const gameContent = getGameContent(activeGame.id);

    return (
      <section style={{ padding: "40px 20px", minHeight: "100vh", background: "radial-gradient(circle at top, #0b1120 0, #020617 100%)", color: "#f9fafb" }}>
        {gameType === "matching" && (
          <MatchingGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "quiz" && (
          <QuizGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "puzzle" && (
          <PuzzleGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "memory" && (
          <MemoryGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "dragdrop" && (
          <DragDropGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "builder" && (
          <BuilderGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
        {gameType === "reaction" && (
          <ReactionGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
            userId={user?.id}
          />
        )}
      </section>
    );
  }

  return (
    <section className="page fade-in">
      <div style={{ marginBottom: "3rem", animation: "slideUp 0.8s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ animation: "slideUp 0.8s ease-out 0.1s both" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: "700", color: "#f9fafb" }}>🎮 Games by Subject</h1>
            <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginBottom: "2rem" }}>Play interactive games, earn coins, and master each topic</p>
          </div>
          <div style={{ 
            padding: "15px 25px", 
            backgroundColor: "rgba(252, 211, 77, 0.1)",
            border: "2px solid rgba(252, 211, 77, 0.5)",
            borderRadius: "12px",
            textAlign: "center",
            minWidth: "150px",
            animation: "slideUp 0.8s ease-out 0.2s both"
          }}>
            <div style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "5px" }}>💰 Coins</div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: "#fcd34d" }}>{playerCoins}</div>
          </div>
        </div>

        {/* Topic Selection */}
        <div style={{ marginBottom: "2.5rem", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {Object.keys(gamesByTopic).map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: selectedTopic === topic ? "2px solid #38bdf8" : "1px solid rgba(148, 163, 184, 0.35)",
                backgroundColor: selectedTopic === topic ? "rgba(56, 189, 248, 0.15)" : "transparent",
                color: selectedTopic === topic ? "#38bdf8" : "#9ca3af",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: selectedTopic === topic ? "600" : "400",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedTopic !== topic) {
                  e.target.style.color = "#f9fafb";
                  e.target.style.borderColor = "rgba(56, 189, 248, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTopic !== topic) {
                  e.target.style.color = "#9ca3af";
                  e.target.style.borderColor = "rgba(148, 163, 184, 0.35)";
                }
              }}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Games Grid - using card styling */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", animation: "slideUp 0.8s ease-out 0.3s both" }}>
        {topicGames.map((game, index) => {
          const isFree = game.coin_cost === 0;
          const isOwned = unlockedGames.has(game.id);
          const canPlay = isFree || isOwned;
          const hasEnoughCoins = playerCoins >= game.coin_cost;
          
          return (
            <div 
              key={game.id}
              className="card"
              style={{ 
                borderColor: isFree ? "rgba(16, 185, 129, 0.4)" : isOwned ? "rgba(56, 189, 248, 0.4)" : hasEnoughCoins ? "rgba(148, 163, 184, 0.4)" : "rgba(148, 163, 184, 0.2)",
                position: "relative",
                animation: `slideUp 0.6s ease-out ${0.35 + index * 0.05}s both`
              }}
            >
              {/* Lock icon overlay for locked games */}
              {!canPlay && (
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  fontSize: "1.5rem",
                  opacity: 0.6
                }}>
                  🔒
                </div>
              )}
              
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", color: "#f9fafb", fontWeight: "600" }}>{game.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: "0 0 1rem 0" }}>{game.lesson}</p>
              
              <p style={{ fontSize: "0.95rem", color: "#cbd5e1", margin: "0 0 1.25rem 0", lineHeight: "1.5" }}>{game.description}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", gap: "0.75rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
                  {game.coin_cost > 0 && !isOwned && (
                    <div style={{ color: "#fbbf24", fontWeight: "600", fontSize: "0.9rem" }}>
                      💰 {game.coin_cost}
                    </div>
                  )}
                  <div style={{ color: "#10b981", fontWeight: "600", fontSize: "0.9rem" }}>
                    ⭐ +{game.base_reward}
                  </div>
                </div>
                <button
                  onClick={() => playGame(game)}
                  disabled={!canPlay && !hasEnoughCoins}
                  className="primary-btn"
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    backgroundColor: canPlay ? "#38bdf8" : hasEnoughCoins ? "#a855f7" : "rgba(107, 114, 128, 0.3)",
                    opacity: canPlay || hasEnoughCoins ? 1 : 0.5,
                    cursor: canPlay || hasEnoughCoins ? "pointer" : "not-allowed",
                  }}
                >
                  {!canPlay && !hasEnoughCoins ? `Need ${game.coin_cost - playerCoins}` : "Play"}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

export default Games;

