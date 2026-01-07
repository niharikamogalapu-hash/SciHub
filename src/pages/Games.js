import React, { useState, useEffect } from "react";
import MatchingGame from "../components/games/MatchingGame";
import QuizGame from "../components/games/QuizGame";
import PuzzleGame from "../components/games/PuzzleGame";
import MemoryGame from "../components/games/MemoryGame";
import DragDropGame from "../components/games/DragDropGame";
import BuilderGame from "../components/games/BuilderGame";
import ReactionGame from "../components/games/ReactionGame";
import "./Games.css";

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
      type: "quiz",
      title: "Cell Structure Master",
      description: "Test your knowledge of cell organelles and their functions",
      questions: [
        {
          question: "Which organelle is responsible for producing energy in the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
          correct: 1,
          explanation: "Mitochondria are the powerhouse of the cell, producing ATP energy"
        },
        {
          question: "What is the primary function of the nucleus?",
          options: ["Protein synthesis", "Store and control genetic information", "Energy production", "Fat storage"],
          correct: 1,
          explanation: "The nucleus contains DNA and controls all cellular functions"
        },
        {
          question: "Which organelle is found ONLY in plant cells?",
          options: ["Mitochondria", "Golgi apparatus", "Chloroplast", "Ribosome"],
          correct: 2,
          explanation: "Chloroplasts are unique to plant cells and conduct photosynthesis"
        },
        {
          question: "What do ribosomes synthesize?",
          options: ["Lipids", "Carbohydrates", "Proteins", "Nucleic acids"],
          correct: 2,
          explanation: "Ribosomes are the sites of protein synthesis in all cells"
        },
        {
          question: "What is the function of the cell membrane?",
          options: ["Energy production", "Protein synthesis", "Control what enters and exits the cell", "DNA storage"],
          correct: 2,
          explanation: "The cell membrane controls transport of materials in and out of the cell"
        }
      ]
    },
    2: {
      type: "quiz",
      title: "Photosynthesis Puzzle",
      description: "Master light and dark reactions in photosynthesis",
      questions: [
        {
          question: "What is the main purpose of photosynthesis?",
          options: ["Release oxygen", "Convert light energy to chemical energy", "Produce carbon dioxide", "Break down glucose"],
          correct: 1,
          explanation: "Photosynthesis converts light energy into glucose, a usable chemical energy"
        },
        {
          question: "Where does the light-dependent reaction occur?",
          options: ["Stroma", "Thylakoid membrane", "Mitochondria", "Ribosome"],
          correct: 1,
          explanation: "Light reactions occur in the thylakoid membranes of chloroplasts"
        },
        {
          question: "What is the primary pigment that absorbs light?",
          options: ["Xanthophyll", "Chlorophyll", "Carotenoid", "Hemoglobin"],
          correct: 1,
          explanation: "Chlorophyll is the main photosynthetic pigment that absorbs light"
        },
        {
          question: "What are the products of the light-dependent reactions?",
          options: ["Glucose and oxygen", "ATP, NADPH, and oxygen", "Carbon dioxide and water", "Glucose and ATP"],
          correct: 1,
          explanation: "Light reactions produce ATP and NADPH as energy carriers, releasing oxygen"
        },
        {
          question: "The Calvin cycle (dark reaction) requires which molecule to produce glucose?",
          options: ["Light energy", "Oxygen", "Carbon dioxide", "Chlorophyll"],
          correct: 2,
          explanation: "The Calvin cycle uses CO₂, ATP, and NADPH to synthesize glucose"
        }
      ]
    },
    3: {
      type: "quiz",
      title: "Evolution Match",
      description: "Understand natural selection and evolutionary adaptation",
      questions: [
        {
          question: "Which scientist developed the theory of evolution by natural selection?",
          options: ["Jean Lamarck", "Charles Darwin", "Gregor Mendel", "Stephen Jay Gould"],
          correct: 1,
          explanation: "Charles Darwin proposed natural selection as the mechanism of evolution"
        },
        {
          question: "What is natural selection?",
          options: ["Organisms changing intentionally", "Traits making organisms better adapted survive and reproduce", "Random changes in organisms", "Divine creation of species"],
          correct: 1,
          explanation: "Natural selection favors organisms with advantageous traits"
        },
        {
          question: "Which provides evidence for evolution?",
          options: ["Fossil records only", "Homologous structures only", "Fossil records, homologous structures, and DNA similarity", "Religious texts"],
          correct: 2,
          explanation: "Fossils, comparative anatomy, and molecular evidence all support evolution"
        },
        {
          question: "What is an adaptation?",
          options: ["A random mutation", "A trait that helps an organism survive in its environment", "A learned behavior", "A disease resistance"],
          correct: 1,
          explanation: "Adaptations are heritable traits that improve survival and reproduction"
        },
        {
          question: "How long has evolution been occurring on Earth?",
          options: ["Thousands of years", "Millions of years", "Billions of years", "Hundreds of years"],
          correct: 2,
          explanation: "Evolution has been occurring for approximately 3.8 billion years"
        }
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
      type: "quiz",
      title: "DNA Sequencer",
      description: "Understand DNA structure and genetic coding",
      questions: [
        {
          question: "What does DNA stand for?",
          options: ["Deoxyribonucleic Acid", "Diribose Nucleic Acid", "Dynamic Neon Amino", "Dual Nitrogen Array"],
          correct: 0,
          explanation: "DNA = Deoxyribonucleic Acid, the molecule carrying genetic information"
        },
        {
          question: "What are the four nitrogenous bases in DNA?",
          options: ["A, T, U, G", "A, T, C, G", "A, T, C, U", "G, C, P, S"],
          correct: 1,
          explanation: "The four bases are Adenine, Thymine, Cytosine, and Guanine"
        },
        {
          question: "Which base pairs with Guanine in DNA?",
          options: ["Adenine", "Thymine", "Cytosine", "Uracil"],
          correct: 2,
          explanation: "Guanine (G) pairs with Cytosine (C) in DNA through 3 hydrogen bonds"
        },
        {
          question: "What is the shape of DNA?",
          options: ["Single helix", "Double helix", "Triple helix", "Circular"],
          correct: 1,
          explanation: "DNA has a double helix structure, discovered by Watson and Crick"
        },
        {
          question: "How many base pairs are in the human genome?",
          options: ["1 million", "100 million", "3 billion", "30 billion"],
          correct: 2,
          explanation: "The human genome contains approximately 3 billion base pairs"
        }
      ]
    },
    6: {
      type: "quiz",
      title: "Ecosystem Builder",
      description: "Understand food chains, energy flow, and ecosystem relationships",
      questions: [
        {
          question: "What are producers in an ecosystem?",
          options: ["Herbivores", "Decomposers", "Plants that make their own food", "Carnivores"],
          correct: 2,
          explanation: "Producers are autotrophs (plants) that create energy from the sun"
        },
        {
          question: "How much energy is transferred from one trophic level to the next?",
          options: ["50%", "25%", "10%", "90%"],
          correct: 2,
          explanation: "Approximately 10% of energy transfers to the next level; 90% is lost"
        },
        {
          question: "Which organisms break down dead matter and return nutrients to soil?",
          options: ["Producers", "Consumers", "Decomposers", "Herbivores"],
          correct: 2,
          explanation: "Decomposers (bacteria, fungi) break down organic matter"
        },
        {
          question: "What is the role of herbivores in a food chain?",
          options: ["Produce energy", "Primary consumers eating plants", "Decompose matter", "Control temperature"],
          correct: 1,
          explanation: "Herbivores are primary consumers that eat plants"
        },
        {
          question: "What is a food web?",
          options: ["One linear food chain", "Multiple interconnected food chains", "Only carnivores", "Decomposition only"],
          correct: 1,
          explanation: "A food web shows how multiple food chains are interconnected"
        }
      ]
    },
    7: {
      type: "quiz",
      title: "Population Simulator",
      description: "Understand population dynamics and limiting factors",
      questions: [
        {
          question: "What is carrying capacity?",
          options: ["Birth rate", "Maximum population size environment can sustain", "Death rate", "Immigration rate"],
          correct: 1,
          explanation: "Carrying capacity is the maximum population size an environment can support"
        },
        {
          question: "Which is a density-dependent limiting factor?",
          options: ["Earthquake", "Tornado", "Disease spread", "Asteroid"],
          correct: 2,
          explanation: "Disease spreads more with higher population density"
        },
        {
          question: "What is exponential population growth?",
          options: ["Growth that follows carrying capacity", "J-shaped curve with unlimited resources", "Declining population", "No population change"],
          correct: 1,
          explanation: "Exponential growth produces a J-shaped curve in ideal conditions"
        },
        {
          question: "What factors are density-independent limiting factors?",
          options: ["Competition and disease", "Weather and natural disasters", "Predation only", "Food availability"],
          correct: 1,
          explanation: "Weather and natural disasters affect populations regardless of size"
        },
        {
          question: "How does a population reach its carrying capacity?",
          options: ["Unlimited growth continues", "Growth rate equals zero at equilibrium", "Population doubles instantly", "No limiting factors exist"],
          correct: 1,
          explanation: "At carrying capacity, births = deaths and growth rate = 0"
        }
      ]
    },
    8: {
      type: "quiz",
      title: "Anatomy Labeler",
      description: "Test knowledge of human body systems and organs",
      questions: [
        {
          question: "What is the primary function of the respiratory system?",
          options: ["Circulate blood", "Exchange gases (O₂ and CO₂)", "Digest food", "Filter waste"],
          correct: 1,
          explanation: "The respiratory system exchanges oxygen and carbon dioxide"
        },
        {
          question: "How many chambers does the human heart have?",
          options: ["2", "3", "4", "6"],
          correct: 2,
          explanation: "The heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower)"
        },
        {
          question: "What is the largest organ in the human body?",
          options: ["Brain", "Heart", "Liver", "Skin"],
          correct: 3,
          explanation: "The skin is the largest organ, covering the entire body"
        },
        {
          question: "Which hormone does the pancreas produce to regulate blood sugar?",
          options: ["Adrenaline", "Insulin", "Thyroid hormone", "Testosterone"],
          correct: 1,
          explanation: "The pancreas produces insulin to lower blood glucose levels"
        },
        {
          question: "How many bones are in the adult human skeleton?",
          options: ["186", "206", "256", "300"],
          correct: 1,
          explanation: "Adults have 206 bones (babies are born with more that fuse)"
        }
      ]
    },
    9: {
      type: "quiz",
      title: "Immune Response",
      description: "Understand immune system components and disease defense",
      questions: [
        {
          question: "What are white blood cells' primary function?",
          options: ["Carry oxygen", "Fight infections and disease", "Clot blood", "Produce energy"],
          correct: 1,
          explanation: "White blood cells are key defenders against pathogens"
        },
        {
          question: "What do antibodies do?",
          options: ["Produce white cells", "Tag pathogens for destruction", "Carry oxygen", "Store nutrients"],
          correct: 1,
          explanation: "Antibodies identify and mark pathogens for immune response"
        },
        {
          question: "What is the function of the lymph nodes?",
          options: ["Produce hormones", "Filter lymph and trap pathogens", "Store blood", "Produce insulin"],
          correct: 1,
          explanation: "Lymph nodes filter lymphatic fluid and contain immune cells"
        },
        {
          question: "What is innate immunity?",
          options: ["Learned immunity from vaccines", "Inborn defenses like skin and white cells", "Only antibody response", "Memory B cells"],
          correct: 1,
          explanation: "Innate immunity includes physical barriers and general immune responses"
        },
        {
          question: "How does vaccination work?",
          options: ["Kills the disease", "Teaches immune system to recognize pathogens", "Produces cure", "Eliminates all immunity"],
          correct: 1,
          explanation: "Vaccines stimulate immune memory without causing disease"
        }
      ]
    },
    10: {
      type: "quiz",
      title: "Taxonomy Challenge",
      description: "Master organism classification and taxonomy",
      questions: [
        {
          question: "What is the correct order of taxonomic classification from largest to smallest?",
          options: ["Kingdom, Phylum, Class, Order, Family, Genus, Species", "Species, Genus, Family, Order, Class, Phylum, Kingdom", "Domain, Kingdom, Class, Phylum, Order, Family, Genus", "Kingdom, Order, Phylum, Class, Family, Genus, Species"],
          correct: 0,
          explanation: "The mnemonic is King Phillip Came Over For Good Soup"
        },
        {
          question: "What does binomial nomenclature consist of?",
          options: ["One Latin word", "Genus and species names (italicized)", "Only the family name", "Common and scientific name"],
          correct: 1,
          explanation: "Binomial nomenclature uses genus (capitalized) and species (lowercase)"
        },
        {
          question: "Which kingdom includes organisms that are mostly single-celled?",
          options: ["Plantae", "Animalia", "Fungi", "Protista"],
          correct: 3,
          explanation: "Protista includes mostly unicellular eukaryotic organisms"
        },
        {
          question: "What characteristic defines mammals?",
          options: ["Lay eggs", "Have hair/fur and produce milk", "Cold-blooded", "Have gills"],
          correct: 1,
          explanation: "Mammals have hair and mammary glands for nursing young"
        },
        {
          question: "Which phylum includes animals with backbones?",
          options: ["Arthropoda", "Mollusca", "Chordata", "Nematoda"],
          correct: 2,
          explanation: "Chordata is the phylum containing vertebrates with backbones"
        }
      ]
    },

    // CHEMISTRY GAMES (11-20)
    11: {
      type: "quiz",
      title: "Periodic Table Master",
      description: "Test knowledge of elements and periodic trends",
      questions: [
        {
          question: "What is the atomic number?",
          options: ["Number of neutrons", "Number of protons", "Total mass", "Number of electrons only"],
          correct: 1,
          explanation: "Atomic number is the number of protons, which defines the element"
        },
        {
          question: "Which element has the atomic number 1?",
          options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
          correct: 1,
          explanation: "Hydrogen is the lightest and first element on the periodic table"
        },
        {
          question: "What trend occurs moving left to right across a period?",
          options: ["Atomic radius increases", "Atomic radius decreases", "Ionization energy decreases", "Electronegativity decreases"],
          correct: 1,
          explanation: "Atomic radius decreases across a period due to increasing nuclear charge"
        },
        {
          question: "Which group contains the most reactive metals?",
          options: ["Halogens", "Alkaline earth metals", "Alkali metals", "Noble gases"],
          correct: 2,
          explanation: "Alkali metals (Group 1) are the most reactive metals"
        },
        {
          question: "What are noble gases?",
          options: ["Highly reactive metals", "Elements with full outer electron shells", "Radioactive elements", "Transition metals"],
          correct: 1,
          explanation: "Noble gases have stable, full electron configurations"
        }
      ]
    },
    12: {
      type: "quiz",
      title: "Electron Configuration",
      description: "Master electron arrangement and orbital filling",
      questions: [
        {
          question: "What is electron configuration?",
          options: ["The shape of the atom", "The arrangement of electrons in orbitals", "The nuclear charge", "The number of bonds"],
          correct: 1,
          explanation: "Electron configuration describes where electrons are located"
        },
        {
          question: "What is the Aufbau principle?",
          options: ["Electrons fill highest orbitals first", "Electrons fill lowest energy orbitals first", "All electrons are in one shell", "Electrons always pair"],
          correct: 1,
          explanation: "Aufbau principle states electrons fill lowest energy orbitals first"
        },
        {
          question: "What is the electron configuration of hydrogen (H)?",
          options: ["1s²", "1s¹", "2s¹", "1p¹"],
          correct: 1,
          explanation: "Hydrogen has 1 electron in the 1s orbital: 1s¹"
        },
        {
          question: "What does the s, p, d, f designation refer to?",
          options: ["Element names", "Orbital shapes and sizes", "Electron spins", "Energy levels"],
          correct: 1,
          explanation: "s, p, d, f describe different orbital shapes"
        },
        {
          question: "How many electrons can occupy an s orbital?",
          options: ["1", "2", "6", "10"],
          correct: 1,
          explanation: "An s orbital can hold a maximum of 2 electrons"
        }
      ]
    },
    13: {
      type: "quiz",
      title: "Bonding Builder",
      description: "Understand ionic, covalent, and metallic bonds",
      questions: [
        {
          question: "What is ionic bonding?",
          options: ["Sharing of electrons", "Transfer of electrons between atoms", "Bonding within metals", "Weak hydrogen interaction"],
          correct: 1,
          explanation: "Ionic bonds form from electron transfer between metals and nonmetals"
        },
        {
          question: "What is a covalent bond?",
          options: ["Electron transfer", "Sharing of electrons between atoms", "Metallic bond", "Hydrogen bond"],
          correct: 1,
          explanation: "Covalent bonds involve sharing of electrons"
        },
        {
          question: "Which type of bond is strongest?",
          options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
          correct: 1,
          explanation: "Covalent bonds are generally the strongest chemical bonds"
        },
        {
          question: "What is electronegativity?",
          options: ["Atomic size", "Ability to attract electrons", "Number of valence electrons", "Bonding strength"],
          correct: 1,
          explanation: "Electronegativity measures an atom's ability to attract electrons"
        },
        {
          question: "What type of bond forms between H and O in water?",
          options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
          correct: 1,
          explanation: "H-O bonds in water are covalent polar bonds"
        }
      ]
    },
    14: {
      type: "quiz",
      title: "Molecule Constructor",
      description: "Test knowledge of molecular geometry and structure",
      questions: [
        {
          question: "What is the molecular geometry of methane (CH₄)?",
          options: ["Linear", "Trigonal planar", "Tetrahedral", "Octahedral"],
          correct: 2,
          explanation: "CH₄ has 4 bonded atoms in a tetrahedral shape"
        },
        {
          question: "What is VSEPR theory?",
          options: ["Valence electron repulsion theory", "Valence shell electron pair repulsion theory", "Valence structure electron pattern", "Volume spectrum energy ratio"],
          correct: 1,
          explanation: "VSEPR predicts geometry based on electron pair repulsion"
        },
        {
          question: "What is the molecular geometry of CO₂?",
          options: ["Bent", "Trigonal planar", "Linear", "Tetrahedral"],
          correct: 2,
          explanation: "CO₂ is linear with O=C=O geometry"
        },
        {
          question: "What determines molecular polarity?",
          options: ["Bond polarity only", "Molecular geometry only", "Both bond polarity and molecular geometry", "Atomic mass"],
          correct: 2,
          explanation: "Molecular polarity depends on both bond type and 3D shape"
        },
        {
          question: "Is water (H₂O) polar or nonpolar?",
          options: ["Nonpolar", "Polar", "Ionic", "Metallic"],
          correct: 1,
          explanation: "Water is polar due to its bent geometry and O's high electronegativity"
        }
      ]
    },
    15: {
      type: "quiz",
      title: "Reaction Balancer",
      description: "Master balancing chemical equations",
      questions: [
        {
          question: "What does balancing an equation require?",
          options: ["Equal mass on both sides", "Equal number of each atom type on both sides", "Equal charge", "Equal molecular weight"],
          correct: 1,
          explanation: "Balancing ensures conservation of atoms and mass"
        },
        {
          question: "In the reaction H₂ + O₂ → H₂O, what coefficient is needed for O₂?",
          options: ["1", "2", "3", "4"],
          correct: 1,
          explanation: "2H₂ + O₂ → 2H₂O is the balanced equation"
        },
        {
          question: "What are the three main types of chemical reactions?",
          options: ["Acid and base only", "Combustion, synthesis, and decomposition", "Synthesis, decomposition, and displacement", "Combustion, oxidation, and reduction"],
          correct: 2,
          explanation: "Main reaction types: synthesis, decomposition, and displacement"
        },
        {
          question: "What is a displacement reaction?",
          options: ["Atoms exchange positions", "One element replaces another", "Breaking apart compounds", "Combining elements"],
          correct: 1,
          explanation: "Displacement reactions involve element substitution"
        },
        {
          question: "What is a combustion reaction?",
          options: ["Compound breaking apart", "Element burning in oxygen", "Atoms rearranging", "Electron transfer"],
          correct: 1,
          explanation: "Combustion is rapid oxidation producing heat and light"
        }
      ]
    },
    16: {
      type: "quiz",
      title: "Stoichiometry Solver",
      description: "Master mole calculations and stoichiometric relationships",
      questions: [
        {
          question: "What is Avogadro's number?",
          options: ["6.02 × 10²²", "6.02 × 10²³", "6.02 × 10²⁴", "6.02 × 10²¹"],
          correct: 1,
          explanation: "Avogadro's number is 6.022 × 10²³ particles per mole"
        },
        {
          question: "What is the molar mass of carbon dioxide (CO₂)?",
          options: ["28 g/mol", "32 g/mol", "44 g/mol", "48 g/mol"],
          correct: 2,
          explanation: "CO₂ = 12 + (2×16) = 44 g/mol"
        },
        {
          question: "In the reaction 2H₂ + O₂ → 2H₂O, if you have 4 moles of H₂, how many moles of O₂ are needed?",
          options: ["1 mole", "2 moles", "4 moles", "8 moles"],
          correct: 1,
          explanation: "The ratio is 2:1, so 4 moles H₂ requires 2 moles O₂"
        },
        {
          question: "How many molecules are in 2 moles of H₂O?",
          options: ["6.02 × 10²³", "1.2 × 10²⁴", "3.01 × 10²³", "12.04 × 10²³"],
          correct: 1,
          explanation: "2 moles × 6.02 × 10²³ = 1.204 × 10²⁴ molecules"
        },
        {
          question: "What is limiting reagent?",
          options: ["The reagent in largest amount", "The reagent that runs out first", "The product formed", "The catalyst"],
          correct: 1,
          explanation: "The limiting reagent determines how much product forms"
        }
      ]
    },
    17: {
      type: "quiz",
      title: "Acid-Base Analyzer",
      description: "Understand pH, acids, bases, and neutralization",
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
      type: "quiz",
      title: "Oxidation Redux",
      description: "Understand oxidation-reduction reactions",
      questions: [
        {
          question: "What is oxidation?",
          options: ["Gaining electrons", "Losing electrons", "Reacting with oxygen", "Adding hydrogen"],
          correct: 1,
          explanation: "Oxidation is loss of electrons (OIL RIG: Oxidation Is Loss)"
        },
        {
          question: "What is reduction?",
          options: ["Losing electrons", "Gaining electrons", "Decreasing pressure", "Removing oxygen"],
          correct: 1,
          explanation: "Reduction is gain of electrons (RIG: Reduction Is Gain)"
        },
        {
          question: "What is an oxidation number?",
          options: ["Atomic mass", "Number assigned to represent electron distribution", "Valence electrons", "Energy level"],
          correct: 1,
          explanation: "Oxidation numbers track electron transfer"
        },
        {
          question: "In the reaction 2Fe + 3Cl₂ → 2FeCl₃, what is oxidized?",
          options: ["Cl", "Fe", "FeCl₃", "Nothing"],
          correct: 1,
          explanation: "Fe is oxidized from 0 to +3 oxidation state"
        },
        {
          question: "What is a redox reaction?",
          options: ["Acid-base reaction", "Reactions involving electron transfer", "Synthesis reaction", "Combustion only"],
          correct: 1,
          explanation: "Redox reactions involve simultaneous oxidation and reduction"
        }
      ]
    },
    19: {
      type: "quiz",
      title: "Thermochemistry Lab",
      description: "Master enthalpy and reaction energy changes",
      questions: [
        {
          question: "What is an exothermic reaction?",
          options: ["Absorbs heat", "Releases heat to surroundings", "Requires energy", "Has no heat change"],
          correct: 1,
          explanation: "Exothermic reactions release energy (ΔH < 0)"
        },
        {
          question: "What is an endothermic reaction?",
          options: ["Releases heat", "Absorbs heat from surroundings", "Produces energy", "Has no heat change"],
          correct: 1,
          explanation: "Endothermic reactions absorb energy (ΔH > 0)"
        },
        {
          question: "What is enthalpy?",
          options: ["Heat of reaction", "Total heat content of a system", "Energy of molecules", "Activation energy"],
          correct: 1,
          explanation: "Enthalpy (H) represents the heat content of a system"
        },
        {
          question: "What is ΔH in thermochemistry?",
          options: ["Change in enthalpy", "Heat absorbed", "Activation energy", "Energy of products"],
          correct: 0,
          explanation: "ΔH = H(products) - H(reactants)"
        },
        {
          question: "Which type of reaction is combustion?",
          options: ["Endothermic", "Exothermic", "Neutral", "Variable"],
          correct: 1,
          explanation: "Combustion reactions always release heat (exothermic)"
        }
      ]
    },
    20: {
      type: "quiz",
      title: "Kinetics Inspector",
      description: "Understand reaction rates and kinetics",
      questions: [
        {
          question: "What is reaction rate?",
          options: ["Heat released", "Speed at which reactants convert to products", "Equilibrium position", "Activation energy"],
          correct: 1,
          explanation: "Reaction rate measures how fast a reaction occurs"
        },
        {
          question: "How does temperature affect reaction rate?",
          options: ["Decreases rate", "Increases rate", "No effect", "Stops reaction"],
          correct: 1,
          explanation: "Higher temperature increases collision frequency and kinetic energy"
        },
        {
          question: "What is a catalyst?",
          options: ["A reactant", "A product", "Substance that increases reaction rate without being consumed", "Energy requirement"],
          correct: 2,
          explanation: "Catalysts lower activation energy and increase reaction rate"
        },
        {
          question: "What is activation energy?",
          options: ["Heat released", "Minimum energy needed to start a reaction", "Average energy of molecules", "Final energy state"],
          correct: 1,
          explanation: "Activation energy is the energy barrier to reaction"
        },
        {
          question: "How does surface area affect reaction rate?",
          options: ["Decreases rate", "Increases rate", "No effect", "Stops reaction"],
          correct: 1,
          explanation: "Larger surface area increases contact between reactants"
        }
      ]
    },

    // PHYSICS GAMES (21-30)
    21: {
      type: "quiz",
      title: "Force & Motion",
      description: "Master Newton's laws of motion and forces",
      questions: [
        {
          question: "What is Newton's first law of motion?",
          options: ["F = ma", "An object in motion stays in motion unless acted upon", "For every action there is equal reaction", "Energy equals mass times speed squared"],
          correct: 1,
          explanation: "The first law states objects maintain motion unless a force acts on them"
        },
        {
          question: "What is Newton's second law expressed as?",
          options: ["v = u + at", "F = ma", "p = mv", "E = mc²"],
          correct: 1,
          explanation: "F = ma shows force equals mass times acceleration"
        },
        {
          question: "What is Newton's third law of motion?",
          options: ["Objects fall at same rate", "For every action there is equal and opposite reaction", "Force creates motion", "Energy is conserved"],
          correct: 1,
          explanation: "Action-reaction pairs are equal and opposite"
        },
        {
          question: "What is friction?",
          options: ["Force that opposes motion", "Acceleration", "Gravitational force", "Speed change"],
          correct: 0,
          explanation: "Friction opposes relative motion between surfaces"
        },
        {
          question: "Which force pulls objects toward Earth?",
          options: ["Friction", "Normal force", "Gravity", "Tension"],
          correct: 2,
          explanation: "Gravity is the attractive force between masses"
        }
      ]
    },
    22: {
      type: "quiz",
      title: "Kinematics Calculator",
      description: "Master motion equations and kinematic analysis",
      questions: [
        {
          question: "What is velocity?",
          options: ["Speed only", "Distance divided by time", "Speed in a direction", "Acceleration over time"],
          correct: 2,
          explanation: "Velocity is a vector with both magnitude and direction"
        },
        {
          question: "What is acceleration?",
          options: ["Velocity", "Change in velocity over time", "Distance traveled", "Speed of an object"],
          correct: 1,
          explanation: "Acceleration is the rate of change of velocity"
        },
        {
          question: "What is the SI unit for acceleration?",
          options: ["m/s", "m/s²", "m", "km/h"],
          correct: 1,
          explanation: "Acceleration is measured in meters per second squared (m/s²)"
        },
        {
          question: "If a car travels 100 m in 5 seconds at constant velocity, what is its speed?",
          options: ["20 m/s", "50 m/s", "500 m/s", "25 m/s"],
          correct: 0,
          explanation: "Speed = distance / time = 100 m / 5 s = 20 m/s"
        },
        {
          question: "What is instantaneous velocity?",
          options: ["Average velocity over a trip", "Velocity at a specific instant", "Total distance traveled", "Maximum speed reached"],
          correct: 1,
          explanation: "Instantaneous velocity is velocity at a specific moment in time"
        }
      ]
    },
    23: {
      type: "quiz",
      title: "Energy Transformer",
      description: "Understand energy types and conservation",
      questions: [
        {
          question: "What is kinetic energy?",
          options: ["Energy of position", "Energy of motion", "Potential energy", "Heat energy"],
          correct: 1,
          explanation: "Kinetic energy = ½mv² is energy due to motion"
        },
        {
          question: "What is potential energy?",
          options: ["Motion energy", "Energy due to position or condition", "Kinetic energy", "Electrical energy"],
          correct: 1,
          explanation: "Potential energy is stored energy due to position"
        },
        {
          question: "What is the law of conservation of energy?",
          options: ["Energy is destroyed", "Energy changes forms but total remains constant", "Energy increases over time", "Energy equals heat"],
          correct: 1,
          explanation: "Energy cannot be created or destroyed, only transformed"
        },
        {
          question: "What is work in physics?",
          options: ["Effort exerted", "Force times distance in direction of force", "Power produced", "Energy consumed"],
          correct: 1,
          explanation: "Work = Force × Distance (when force is parallel to displacement)"
        },
        {
          question: "What happens to kinetic energy when velocity doubles?",
          options: ["Doubles", "Quadruples", "Halves", "Stays same"],
          correct: 1,
          explanation: "KE ∝ v², so doubling velocity quadruples kinetic energy"
        }
      ]
    },
    24: {
      type: "quiz",
      title: "Momentum Master",
      description: "Master momentum and collision analysis",
      questions: [
        {
          question: "What is momentum?",
          options: ["Energy", "Mass times velocity", "Force times distance", "Acceleration"],
          correct: 1,
          explanation: "Momentum = mv is a measure of motion quantity"
        },
        {
          question: "What is the SI unit for momentum?",
          options: ["kg", "m/s", "kg·m/s", "N/s"],
          correct: 2,
          explanation: "Momentum is measured in kilogram-meters per second"
        },
        {
          question: "What is conservation of momentum?",
          options: ["Momentum increases", "Total momentum of closed system stays constant", "Momentum equals energy", "Momentum is destroyed"],
          correct: 1,
          explanation: "In isolated systems, total momentum before = after collision"
        },
        {
          question: "What is an elastic collision?",
          options: ["Collision where objects stick", "Collision where kinetic energy is conserved", "Collision that breaks objects", "Explosion"],
          correct: 1,
          explanation: "Elastic collisions conserve kinetic energy"
        },
        {
          question: "What is an inelastic collision?",
          options: ["Collision where energy is conserved", "Collision where kinetic energy is lost", "Collision with no motion", "Collision of springs"],
          correct: 1,
          explanation: "Inelastic collisions lose kinetic energy"
        }
      ]
    },
    25: {
      type: "quiz",
      title: "Circular Motion",
      description: "Master circular motion and rotational dynamics",
      questions: [
        {
          question: "What is centripetal force?",
          options: ["Force pushing outward", "Force directed toward center of circle", "Tangential force", "Friction force"],
          correct: 1,
          explanation: "Centripetal force points toward the center of circular motion"
        },
        {
          question: "What is centripetal acceleration?",
          options: ["a = v/t", "a = v²/r", "a = rω", "a = Δv/Δt"],
          correct: 1,
          explanation: "Centripetal acceleration = v²/r pointing toward center"
        },
        {
          question: "What is angular velocity?",
          options: ["Linear velocity", "Rate of angle change per unit time", "Velocity tangent to circle", "Rotational speed"],
          correct: 1,
          explanation: "Angular velocity (ω) measures rotation rate"
        },
        {
          question: "What is the relationship between linear and angular velocity?",
          options: ["v = ωr", "v = ω/r", "v = r/ω", "v = ω + r"],
          correct: 0,
          explanation: "Linear velocity v = ωr where r is radius"
        },
        {
          question: "What provides centripetal force for a car turning in a circle?",
          options: ["Engine", "Friction between tires and road", "Air resistance", "Gravity"],
          correct: 1,
          explanation: "Friction provides the centripetal force for circular motion"
        }
      ]
    },
    26: {
      type: "quiz",
      title: "Wave Simulator",
      description: "Understand wave properties and behavior",
      questions: [
        {
          question: "What is wavelength?",
          options: ["Height of wave", "Distance between consecutive waves", "Time for one cycle", "Speed of wave"],
          correct: 1,
          explanation: "Wavelength is distance between crests or troughs"
        },
        {
          question: "What is frequency?",
          options: ["Distance between waves", "Number of waves per unit time", "Speed of waves", "Height of waves"],
          correct: 1,
          explanation: "Frequency is number of complete waves per second (Hz)"
        },
        {
          question: "What is the relationship between wave speed, frequency, and wavelength?",
          options: ["v = f + λ", "v = f × λ", "v = f / λ", "v = λ / f"],
          correct: 1,
          explanation: "Wave speed v = frequency × wavelength"
        },
        {
          question: "What is amplitude?",
          options: ["Wavelength", "Maximum displacement from equilibrium", "Frequency", "Speed"],
          correct: 1,
          explanation: "Amplitude is the maximum distance from equilibrium"
        },
        {
          question: "What is the period of a wave?",
          options: ["Wavelength", "Time for one complete cycle", "Number of cycles", "Wave speed"],
          correct: 1,
          explanation: "Period T = 1/f is time for one complete oscillation"
        }
      ]
    },
    27: {
      type: "quiz",
      title: "Optics Explorer",
      description: "Master light properties and optical phenomena",
      questions: [
        {
          question: "What is the law of reflection?",
          options: ["Light bends at boundary", "Angle of incidence equals angle of reflection", "Light absorbs in matter", "Light travels in straight lines"],
          correct: 1,
          explanation: "Angle of incidence = angle of reflection from surface"
        },
        {
          question: "What is refraction?",
          options: ["Reflection from surface", "Bending of light at medium boundary", "Scattering of light", "Absorption of light"],
          correct: 1,
          explanation: "Refraction occurs when light enters different density medium"
        },
        {
          question: "What is Snell's law?",
          options: ["n₁sin θ₁ = n₂sin θ₂", "n₁ + n₂ = θ₁ + θ₂", "θ₁ = θ₂", "n = c/v"],
          correct: 0,
          explanation: "Snell's law describes refraction at medium boundaries"
        },
        {
          question: "What is the refractive index?",
          options: ["Angle of light", "Ratio of light speed in vacuum to medium", "Wavelength", "Frequency"],
          correct: 1,
          explanation: "Refractive index n = c/v describes how much light bends"
        },
        {
          question: "What causes a rainbow?",
          options: ["Reflection only", "Dispersion of white light into spectrum", "Refraction only", "Scattering"],
          correct: 1,
          explanation: "Rainbows form from dispersion of light in water droplets"
        }
      ]
    },
    28: {
      type: "quiz",
      title: "Electricity Circuits",
      description: "Master electrical circuits and circuit analysis",
      questions: [
        {
          question: "What is electric current?",
          options: ["Potential difference", "Flow of charge through conductor", "Resistance", "Power"],
          correct: 1,
          explanation: "Current is the flow of charge, measured in amperes (A)"
        },
        {
          question: "What is voltage?",
          options: ["Current", "Electric potential difference", "Resistance", "Power consumption"],
          correct: 1,
          explanation: "Voltage is the potential energy per unit charge"
        },
        {
          question: "What is Ohm's law?",
          options: ["V = IR", "I = VR", "R = I/V", "V = I/R"],
          correct: 0,
          explanation: "Ohm's law: Voltage = Current × Resistance"
        },
        {
          question: "What is the difference between series and parallel circuits?",
          options: ["Same as each other", "Series: components in line; Parallel: components branched", "Series has more resistance", "Parallel has lower voltage"],
          correct: 1,
          explanation: "Series has single path; parallel has multiple paths"
        },
        {
          question: "What happens to voltage in a series circuit?",
          options: ["Stays same", "Divides among components", "Increases", "Decreases proportionally"],
          correct: 1,
          explanation: "In series, voltage divides across components"
        }
      ]
    },
    29: {
      type: "quiz",
      title: "Magnetism Field",
      description: "Understand magnetic fields and electromagnetism",
      questions: [
        {
          question: "What do magnetic field lines represent?",
          options: ["Current flow", "Direction and strength of magnetic field", "Electron orbits", "Voltage distribution"],
          correct: 1,
          explanation: "Field lines show direction force on moving charges"
        },
        {
          question: "What are magnetic poles?",
          options: ["North and South regions of magnet", "Opposite charges", "Current sources", "Electromagnetic forces"],
          correct: 0,
          explanation: "Magnets have North and South poles; opposite poles attract"
        },
        {
          question: "What is electromagnetism?",
          options: ["Magnetic field from charges", "Moving charges creating magnetic field", "Static magnetism", "Electric field only"],
          correct: 1,
          explanation: "Moving electric charges create magnetic fields"
        },
        {
          question: "What is a magnetic field created by?",
          options: ["Static charges only", "Moving charges and magnetic materials", "Heat", "Light"],
          correct: 1,
          explanation: "Magnetic fields from moving charges and permanent magnets"
        },
        {
          question: "What is the Lorentz force?",
          options: ["Gravitational attraction", "Force on charge moving in magnetic field", "Electrical repulsion", "Friction"],
          correct: 1,
          explanation: "F = qvB sin θ is force on moving charge in magnetic field"
        }
      ]
    },
    30: {
      type: "quiz",
      title: "Quantum Quest",
      description: "Explore quantum mechanics and modern physics",
      questions: [
        {
          question: "What is a photon?",
          options: ["Particle of matter", "Quantum of light energy", "Electron", "Atom"],
          correct: 1,
          explanation: "Photon is the fundamental particle of light"
        },
        {
          question: "What is Planck's constant used for?",
          options: ["Speed of light", "Energy of photons", "Mass of electron", "Gravitational constant"],
          correct: 1,
          explanation: "E = hf relates photon energy to frequency"
        },
        {
          question: "What is the photoelectric effect?",
          options: ["Light creating electricity", "Electrons ejected by light from metal", "Solar cells", "Electric lights"],
          correct: 1,
          explanation: "Light ejects electrons from metal surface"
        },
        {
          question: "What does the uncertainty principle state?",
          options: ["Energy and mass are related", "Cannot simultaneously know position and momentum precisely", "Light has wave-particle duality", "Energy is quantized"],
          correct: 1,
          explanation: "Heisenberg's uncertainty principle limits precision"
        },
        {
          question: "What is wave-particle duality?",
          options: ["Light is only wave", "Light is only particle", "Light exhibits both wave and particle properties", "Matter is only particle"],
          correct: 2,
          explanation: "Light and matter exhibit both wave and particle behaviors"
        }
      ]
    },

    // ENVIRONMENTAL SCIENCE GAMES (31-40)
    31: {
      type: "quiz",
      title: "Biome Explorer",
      description: "Understand Earth's biomes and their characteristics",
      questions: [
        {
          question: "What defines a biome?",
          options: ["A single ecosystem", "Large region with similar climate and organisms", "A forest area", "An animal group"],
          correct: 1,
          explanation: "Biomes are characterized by climate, vegetation, and fauna"
        },
        {
          question: "Which biome has the most biodiversity?",
          options: ["Tundra", "Rainforest", "Desert", "Taiga"],
          correct: 1,
          explanation: "Tropical rainforests contain ~50% of Earth's species"
        },
        {
          question: "What characterizes the tundra biome?",
          options: ["Tropical heat", "Permafrost and no trees", "Rainforest vegetation", "Dry climate"],
          correct: 1,
          explanation: "Tundra has permanently frozen ground and sparse vegetation"
        },
        {
          question: "Which biome is characterized by deciduous trees?",
          options: ["Taiga", "Temperate deciduous forest", "Savanna", "Chaparral"],
          correct: 1,
          explanation: "Deciduous forests have trees that lose leaves seasonally"
        },
        {
          question: "What is the driest biome?",
          options: ["Grassland", "Desert", "Taiga", "Tundra"],
          correct: 1,
          explanation: "Deserts receive less than 10 inches of rain per year"
        }
      ]
    },
    32: {
      type: "quiz",
      title: "Water Cycle Tracker",
      description: "Master the water cycle and hydrologic processes",
      questions: [
        {
          question: "What is the water cycle?",
          options: ["Continuous movement of water", "Water in oceans only", "Rainfall pattern", "Freezing and thawing"],
          correct: 0,
          explanation: "The water cycle includes evaporation, condensation, and precipitation"
        },
        {
          question: "What is evaporation?",
          options: ["Water freezing", "Water turning to vapor from heat", "Rain falling", "Snow melting"],
          correct: 1,
          explanation: "Evaporation is water changing from liquid to gas"
        },
        {
          question: "What is transpiration?",
          options: ["Water transport in soil", "Water vapor released by plants", "Rain collection", "Groundwater movement"],
          correct: 1,
          explanation: "Transpiration is water released through plant leaves"
        },
        {
          question: "What is condensation?",
          options: ["Water freezing", "Water vapor turning to liquid", "Precipitation", "Infiltration"],
          correct: 1,
          explanation: "Condensation forms clouds from water vapor cooling"
        },
        {
          question: "What is the largest freshwater reservoir on Earth?",
          options: ["Lakes", "Rivers", "Glaciers and ice caps", "Groundwater"],
          correct: 2,
          explanation: "Ice sheets and glaciers contain ~68.7% of freshwater"
        }
      ]
    },
    33: {
      type: "quiz",
      title: "Nutrient Cycling",
      description: "Understand biogeochemical cycles",
      questions: [
        {
          question: "What is the carbon cycle?",
          options: ["Only in atmosphere", "Cycling of carbon through atmosphere, biosphere, and geosphere", "Carbon in living things only", "Coal formation process"],
          correct: 1,
          explanation: "Carbon cycles through all Earth's systems"
        },
        {
          question: "What is the nitrogen cycle?",
          options: ["Nitrogen in air only", "Nitrogen cycling through atmosphere and living things", "Nitrogen in soil only", "Plant growth only"],
          correct: 1,
          explanation: "Nitrogen cycles through atmosphere, soil, and organisms"
        },
        {
          question: "What are decomposers in nutrient cycles?",
          options: ["Producers", "Consumers", "Organisms breaking down dead matter returning nutrients", "Predators"],
          correct: 2,
          explanation: "Decomposers recycle nutrients back to soil"
        },
        {
          question: "What is nitrogen fixation?",
          options: ["Nitrogen staying in air", "Converting atmospheric N₂ to usable form", "Soil erosion", "Plant growth"],
          correct: 1,
          explanation: "Nitrogen fixing bacteria convert N₂ to ammonia"
        },
        {
          question: "What is the phosphorus cycle?",
          options: ["Through atmosphere mainly", "Cycling of phosphorus through rocks, soil, and organisms", "In water only", "Animals only"],
          correct: 1,
          explanation: "Phosphorus cycles slowly through geological and biological systems"
        }
      ]
    },
    34: {
      type: "quiz",
      title: "Weathering & Erosion",
      description: "Understand rock weathering and land formation",
      questions: [
        {
          question: "What is weathering?",
          options: ["Erosion of rocks", "Breaking down of rocks in place", "Soil formation", "Wind and rain"],
          correct: 1,
          explanation: "Weathering breaks down rocks without movement"
        },
        {
          question: "What is erosion?",
          options: ["Rock breakdown", "Transport of weathered material", "Soil formation", "Water flow"],
          correct: 1,
          explanation: "Erosion moves weathered material from one place to another"
        },
        {
          question: "What is mechanical weathering?",
          options: ["Chemical breakdown", "Physical breaking without changing composition", "Decomposition", "Oxidation"],
          correct: 1,
          explanation: "Mechanical weathering physically breaks rocks"
        },
        {
          question: "What is chemical weathering?",
          options: ["Physical breakage", "Chemical reaction changing rock composition", "Erosion", "Freeze-thaw"],
          correct: 1,
          explanation: "Chemical weathering changes minerals through reactions"
        },
        {
          question: "What factor increases weathering rate?",
          options: ["Low temperature", "Dry climate", "High temperature and moisture", "Hard rocks"],
          correct: 2,
          explanation: "Warm, wet climates increase weathering significantly"
        }
      ]
    },
    35: {
      type: "quiz",
      title: "Weather Predictor",
      description: "Master weather systems and atmospheric phenomena",
      questions: [
        {
          question: "What are the main atmospheric layers?",
          options: ["Troposphere and Stratosphere", "Troposphere, Stratosphere, Mesosphere, Thermosphere", "Ozone layer only", "Upper and lower layers"],
          correct: 1,
          explanation: "Earth's atmosphere has four main layers"
        },
        {
          question: "Where does most weather occur?",
          options: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
          correct: 1,
          explanation: "The troposphere contains weather and life"
        },
        {
          question: "What causes wind?",
          options: ["Temperature only", "Pressure differences", "Humidity", "Clouds"],
          correct: 1,
          explanation: "Wind results from air moving from high to low pressure"
        },
        {
          question: "What is a high-pressure system associated with?",
          options: ["Rain", "Clear, fair weather", "Storms", "Fog"],
          correct: 1,
          explanation: "High pressure brings clear, stable weather"
        },
        {
          question: "What does relative humidity measure?",
          options: ["Absolute water vapor amount", "Amount of moisture vs. capacity", "Temperature", "Pressure"],
          correct: 1,
          explanation: "Relative humidity is actual vapor / maximum capacity"
        }
      ]
    },
    36: {
      type: "quiz",
      title: "Climate Modeler",
      description: "Understand climate systems and climate change",
      questions: [
        {
          question: "What is climate?",
          options: ["Today's weather", "Average weather patterns over long periods", "Seasonal changes", "Temperature only"],
          correct: 1,
          explanation: "Climate is 30+ year average of weather conditions"
        },
        {
          question: "What is the greenhouse effect?",
          options: ["Cooling of atmosphere", "Heat trapping by gases causing warming", "Ozone depletion", "Acid rain"],
          correct: 1,
          explanation: "Greenhouse gases trap heat in the atmosphere"
        },
        {
          question: "What are major greenhouse gases?",
          options: ["Oxygen and nitrogen", "CO₂, CH₄, N₂O, and water vapor", "Ozone and argon", "Hydrogen and helium"],
          correct: 1,
          explanation: "CO₂ and methane are primary contributors to climate change"
        },
        {
          question: "What is global warming?",
          options: ["Normal climate variation", "Long-term increase in Earth's temperature", "Seasonal temperature change", "Local heating"],
          correct: 1,
          explanation: "Global warming is primarily due to human activities"
        },
        {
          question: "What are effects of climate change?",
          options: ["No impact", "Rising sea levels, extreme weather, species extinction", "Cooler weather", "More rain only"],
          correct: 1,
          explanation: "Climate change causes multiple environmental impacts"
        }
      ]
    },
    37: {
      type: "quiz",
      title: "Conservation Hero",
      description: "Understand conservation strategies and biodiversity",
      questions: [
        {
          question: "What is biodiversity?",
          options: ["Number of plants", "Variety of species and ecosystems", "Animal population", "Forest density"],
          correct: 1,
          explanation: "Biodiversity is the variety of life at all levels"
        },
        {
          question: "What is endangered species?",
          options: ["Extinct species", "Species at risk of extinction", "Common species", "Invasive species"],
          correct: 1,
          explanation: "Endangered species have populations declining dangerously"
        },
        {
          question: "What is habitat conservation?",
          options: ["Breeding animals only", "Protecting natural areas for species survival", "Feeding wildlife", "Building zoos"],
          correct: 1,
          explanation: "Protecting habitats is essential for conservation"
        },
        {
          question: "What is a protected area?",
          options: ["Fenced region", "Land legally protected for conservation", "Farm", "City park"],
          correct: 1,
          explanation: "Protected areas include national parks and reserves"
        },
        {
          question: "What causes species extinction?",
          options: ["Natural aging", "Habitat loss, climate change, and human activities", "Evolution only", "Disease only"],
          correct: 1,
          explanation: "Habitat destruction is the leading extinction cause"
        }
      ]
    },
    38: {
      type: "quiz",
      title: "Pollution Fighter",
      description: "Understand pollution types and environmental solutions",
      questions: [
        {
          question: "What is air pollution?",
          options: ["Wind patterns", "Harmful substances in atmosphere", "Cloud formation", "Temperature changes"],
          correct: 1,
          explanation: "Air pollution harms human health and ecosystems"
        },
        {
          question: "What causes water pollution?",
          options: ["Water only", "Industrial waste, chemicals, and plastic", "Fish only", "Evaporation"],
          correct: 1,
          explanation: "Multiple human activities pollute water"
        },
        {
          question: "What is soil pollution?",
          options: ["Loose soil", "Contamination of soil by toxins", "Erosion", "Dust"],
          correct: 1,
          explanation: "Soil pollution impacts food production"
        },
        {
          question: "What is a nonpoint source of pollution?",
          options: ["Single identifiable source", "Pollution from many diffuse sources", "Factory pipe", "Car exhaust"],
          correct: 1,
          explanation: "Nonpoint pollution includes runoff and atmospheric deposition"
        },
        {
          question: "What is sustainable development?",
          options: ["Only economic growth", "Meeting current needs without harming future", "Environmental focus only", "No development"],
          correct: 1,
          explanation: "Sustainability balances environment and development"
        }
      ]
    },
    39: {
      type: "quiz",
      title: "Renewable Energy",
      description: "Master renewable energy sources and sustainability",
      questions: [
        {
          question: "What is renewable energy?",
          options: ["Energy from coal", "Energy from sources that replenish naturally", "Nuclear power", "Fossil fuels"],
          correct: 1,
          explanation: "Renewables include solar, wind, hydro, and geothermal"
        },
        {
          question: "What is solar energy?",
          options: ["Heat from Earth", "Energy from sun's radiation", "Wind energy", "Ocean energy"],
          correct: 1,
          explanation: "Solar panels convert sunlight to electricity"
        },
        {
          question: "What is wind energy?",
          options: ["Fossil fuel", "Electricity from wind turbines", "Solar power", "Water power"],
          correct: 1,
          explanation: "Wind turbines convert kinetic energy to electricity"
        },
        {
          question: "What is hydroelectric energy?",
          options: ["Heat energy", "Electricity from flowing water", "Wind power", "Solar power"],
          correct: 1,
          explanation: "Hydroelectric dams use water flow to generate electricity"
        },
        {
          question: "What is geothermal energy?",
          options: ["Sun energy", "Energy from Earth's internal heat", "Wind energy", "Ocean energy"],
          correct: 1,
          explanation: "Geothermal taps Earth's interior heat"
        }
      ]
    },
    40: {
      type: "quiz",
      title: "Ecosystem Manager",
      description: "Master ecosystem dynamics and sustainability",
      questions: [
        {
          question: "What is an ecosystem?",
          options: ["Only living things", "Community of organisms and their environment", "Just plants", "Just animals"],
          correct: 1,
          explanation: "Ecosystems include biotic and abiotic components"
        },
        {
          question: "What is succession?",
          options: ["Plant growth", "Predictable change in ecosystem over time", "Extinction", "Climate change"],
          correct: 1,
          explanation: "Succession describes how communities change"
        },
        {
          question: "What is primary succession?",
          options: ["Change after disturbance", "Colonization of bare rock/land", "Forest regrowth", "Seasonal change"],
          correct: 1,
          explanation: "Primary succession starts on previously unvegetated land"
        },
        {
          question: "What is secondary succession?",
          options: ["First colonization", "Recovery after disturbance in existing ecosystem", "Primary growth", "New habitat"],
          correct: 1,
          explanation: "Secondary succession follows disturbance in established ecosystems"
        },
        {
          question: "What is ecological balance?",
          options: ["Perfect stability", "Dynamic equilibrium among ecosystem components", "No change", "Extinction"],
          correct: 1,
          explanation: "Balance is maintained by predator-prey interactions"
        }
      ]
    },

    // ECONOMICS GAMES (41-50)
    41: {
      type: "quiz",
      title: "Supply & Demand",
      description: "Master market forces and price equilibrium",
      questions: [
        {
          question: "What is supply?",
          options: ["What consumers want", "Quantity of goods sellers offer at various prices", "Total inventory", "Customer demand"],
          correct: 1,
          explanation: "Supply is the quantity producers offer at each price"
        },
        {
          question: "What is demand?",
          options: ["What sellers offer", "Quantity consumers want to buy at various prices", "Inventory", "Total sales"],
          correct: 1,
          explanation: "Demand is the quantity buyers want at each price"
        },
        {
          question: "What is equilibrium price?",
          options: ["Highest price", "Lowest price", "Price where supply equals demand", "Average price"],
          correct: 2,
          explanation: "Equilibrium occurs where quantity supplied = quantity demanded"
        },
        {
          question: "What happens when demand increases?",
          options: ["Price decreases", "Price increases", "Quantity stays constant", "Consumers buy less"],
          correct: 1,
          explanation: "Higher demand pushes prices up if supply is constant"
        },
        {
          question: "What is a shortage?",
          options: ["Excess supply", "Quantity demanded exceeds quantity supplied", "No demand", "Low inventory"],
          correct: 1,
          explanation: "Shortages occur below equilibrium price"
        }
      ]
    },
    42: {
      type: "quiz",
      title: "Business Tycoon",
      description: "Master business fundamentals and entrepreneurship",
      questions: [
        {
          question: "What is revenue?",
          options: ["Costs of business", "Total income from sales", "Profit margin", "Employee wages"],
          correct: 1,
          explanation: "Revenue = price × quantity sold"
        },
        {
          question: "What is profit?",
          options: ["Revenue minus costs", "Revenue only", "Sales volume", "Market value"],
          correct: 0,
          explanation: "Profit = Revenue - Total Costs"
        },
        {
          question: "What is a fixed cost?",
          options: ["Changes with production", "Cost that stays constant regardless of output", "Variable expense", "Sales-dependent cost"],
          correct: 1,
          explanation: "Fixed costs include rent, salaries, and equipment"
        },
        {
          question: "What is a variable cost?",
          options: ["Stays constant", "Cost that varies with production level", "Fixed expense", "One-time cost"],
          correct: 1,
          explanation: "Variable costs include materials and labor per unit"
        },
        {
          question: "What is break-even point?",
          options: ["Maximum profit", "Loss point", "When revenue equals total costs", "When demand peaks"],
          correct: 2,
          explanation: "Break-even is where profit = 0"
        }
      ]
    },
    43: {
      type: "quiz",
      title: "Budget Manager",
      description: "Master personal and government budgeting",
      questions: [
        {
          question: "What is income?",
          options: ["Expenses", "Money earned from work or investments", "Savings", "Debt"],
          correct: 1,
          explanation: "Income includes wages, salaries, and investment returns"
        },
        {
          question: "What is a budget?",
          options: ["Large amount of money", "Plan for how to spend money", "Savings account", "Investment"],
          correct: 1,
          explanation: "A budget balances income with expenses"
        },
        {
          question: "What is savings?",
          options: ["Spending money", "Income not spent immediately", "Investment only", "Profit"],
          correct: 1,
          explanation: "Savings are set aside for future use"
        },
        {
          question: "What is the 50/30/20 budget rule?",
          options: ["Random allocation", "50% needs, 30% wants, 20% savings", "50% savings, 30% spending", "50% taxes"],
          correct: 1,
          explanation: "50/30/20 allocates budget to needs, wants, and savings"
        },
        {
          question: "What is deficit spending?",
          options: ["Saving money", "Government spending more than revenue", "Tax cuts", "Balanced budget"],
          correct: 1,
          explanation: "Deficit spending occurs when spending exceeds income"
        }
      ]
    },
    44: {
      type: "quiz",
      title: "Investment Trader",
      description: "Understand stocks, bonds, and investment strategies",
      questions: [
        {
          question: "What is a stock?",
          options: ["Debt instrument", "Share of company ownership", "Loan", "Interest-bearing bond"],
          correct: 1,
          explanation: "Stocks represent partial ownership in a company"
        },
        {
          question: "What is a bond?",
          options: ["Company ownership", "Loan to government or corporation", "Stock certificate", "Investment property"],
          correct: 1,
          explanation: "Bonds are debt securities paying regular interest"
        },
        {
          question: "What is diversification?",
          options: ["Buying one stock", "Spreading investments across different assets", "Selling all stocks", "Day trading"],
          correct: 1,
          explanation: "Diversification reduces investment risk"
        },
        {
          question: "What is a bull market?",
          options: ["Falling prices", "Rising prices and investor optimism", "No trading", "Economic recession"],
          correct: 1,
          explanation: "Bull markets show rising prices and positive sentiment"
        },
        {
          question: "What is a bear market?",
          options: ["Rising prices", "Falling prices and investor pessimism", "Stable market", "High growth"],
          correct: 1,
          explanation: "Bear markets feature declining prices and negative sentiment"
        }
      ]
    },
    45: {
      type: "quiz",
      title: "GDP Calculator",
      description: "Understand GDP and macroeconomic measurement",
      questions: [
        {
          question: "What does GDP stand for?",
          options: ["General Domestic Product", "Gross Domestic Product", "Growth and Development Program", "Government Domestic Program"],
          correct: 1,
          explanation: "GDP is the total value of goods and services produced"
        },
        {
          question: "What are GDP components?",
          options: ["Revenue and costs", "Consumption, Investment, Government spending, Net Exports", "Imports and exports", "Population and production"],
          correct: 1,
          explanation: "GDP = C + I + G + (X - M)"
        },
        {
          question: "What is real GDP?",
          options: ["GDP in current prices", "GDP adjusted for inflation", "Stock market value", "Total wealth"],
          correct: 1,
          explanation: "Real GDP removes inflation effects"
        },
        {
          question: "What is nominal GDP?",
          options: ["Adjusted GDP", "GDP in current prices without inflation adjustment", "Per capita GDP", "Growth rate"],
          correct: 1,
          explanation: "Nominal GDP uses current market prices"
        },
        {
          question: "What does GDP per capita measure?",
          options: ["Average company size", "GDP divided by population", "National income", "Wealth distribution"],
          correct: 1,
          explanation: "GDP per capita shows average output per person"
        }
      ]
    },
    46: {
      type: "quiz",
      title: "Inflation Monitor",
      description: "Master inflation, deflation, and monetary policy",
      questions: [
        {
          question: "What is inflation?",
          options: ["Economic growth", "Sustained increase in price levels", "Rise in wages", "Lower unemployment"],
          correct: 1,
          explanation: "Inflation reduces purchasing power"
        },
        {
          question: "What is deflation?",
          options: ["Inflation", "Sustained decrease in price levels", "Rising prices", "Economic growth"],
          correct: 1,
          explanation: "Deflation is the opposite of inflation"
        },
        {
          question: "What is the CPI?",
          options: ["Consumer Income Price", "Consumer Price Index measuring price changes", "Cost Per Item", "Central Price Index"],
          correct: 1,
          explanation: "CPI tracks price changes for consumer goods"
        },
        {
          question: "What is the inflation rate?",
          options: ["Price of goods", "Percentage change in price level", "GDP growth", "Interest rate"],
          correct: 1,
          explanation: "Inflation rate measures how fast prices are rising"
        },
        {
          question: "How does inflation affect savers?",
          options: ["Increases their wealth", "Decreases purchasing power of savings", "Raises interest rates", "Increases savings"],
          correct: 1,
          explanation: "Inflation erodes the value of savings"
        }
      ]
    },
    47: {
      type: "quiz",
      title: "Trade Navigator",
      description: "Master international trade and global economics",
      questions: [
        {
          question: "What is international trade?",
          options: ["Domestic business", "Exchange of goods and services between countries", "Stock trading", "Currency exchange"],
          correct: 1,
          explanation: "International trade benefits from comparative advantage"
        },
        {
          question: "What is an import?",
          options: ["Product sold abroad", "Product bought from another country", "Domestic good", "Service sold"],
          correct: 1,
          explanation: "Imports increase available goods and may lower prices"
        },
        {
          question: "What is an export?",
          options: ["Product purchased abroad", "Product sold to another country", "Import equivalent", "Service bought"],
          correct: 1,
          explanation: "Exports create domestic jobs and income"
        },
        {
          question: "What is a tariff?",
          options: ["Trade agreement", "Tax on imported goods", "Subsidy", "Trade alliance"],
          correct: 1,
          explanation: "Tariffs protect domestic industries but may raise prices"
        },
        {
          question: "What is comparative advantage?",
          options: ["Being able to produce everything better", "Being able to produce something at lower opportunity cost", "Having more resources", "Being more efficient"],
          correct: 1,
          explanation: "Comparative advantage drives mutually beneficial trade"
        }
      ]
    },
    48: {
      type: "quiz",
      title: "Tax Planner",
      description: "Understand taxation and tax planning",
      questions: [
        {
          question: "What is income tax?",
          options: ["Sales tax", "Tax on earned income", "Property tax", "Tariff"],
          correct: 1,
          explanation: "Income tax funds federal and state governments"
        },
        {
          question: "What is a progressive tax?",
          options: ["Flat rate for all", "Higher rates for higher income", "Lower rates for higher income", "No income tax"],
          correct: 1,
          explanation: "Progressive taxes increase rate with income"
        },
        {
          question: "What is a regressive tax?",
          options: ["Based on income", "Takes larger percentage from lower income", "Increases with wealth", "No exemptions"],
          correct: 1,
          explanation: "Sales tax is regressive - same rate for all"
        },
        {
          question: "What are tax deductions?",
          options: ["Tax credits", "Amounts subtracted from income to reduce taxes", "Refunds", "Tax returns"],
          correct: 1,
          explanation: "Deductions reduce taxable income"
        },
        {
          question: "What is a tax bracket?",
          options: ["Tax rate", "Range of income taxed at specific rate", "Tax form", "Deduction amount"],
          correct: 1,
          explanation: "Tax brackets structure progressive taxation"
        }
      ]
    },
    49: {
      type: "quiz",
      title: "Labor Economics",
      description: "Master labor markets and employment",
      questions: [
        {
          question: "What is the labor force?",
          options: ["All adults", "People employed and actively seeking work", "Only employed people", "Only job seekers"],
          correct: 1,
          explanation: "Labor force includes employed and unemployed workers"
        },
        {
          question: "What is unemployment rate?",
          options: ["Total number unemployed", "Percentage of labor force without jobs", "Job vacancies", "Employed percentage"],
          correct: 1,
          explanation: "Unemployment rate = unemployed / labor force × 100"
        },
        {
          question: "What is a minimum wage?",
          options: ["Maximum wage", "Lowest legal wage employers can pay", "Average wage", "Starting salary"],
          correct: 1,
          explanation: "Minimum wage sets a wage floor"
        },
        {
          question: "What is human capital?",
          options: ["Money", "Skills, education, and experience of workers", "Equipment", "Buildings"],
          correct: 1,
          explanation: "Human capital increases worker productivity"
        },
        {
          question: "What is occupational mobility?",
          options: ["Job location", "Ability to move between occupations", "Geographic movement", "Career change"],
          correct: 1,
          explanation: "Occupational mobility allows worker flexibility"
        }
      ]
    },
    50: {
      type: "quiz",
      title: "Economic Systems",
      description: "Compare different economic systems",
      questions: [
        {
          question: "What is capitalism?",
          options: ["Government controls economy", "Private ownership and market forces determine economy", "Equal wealth distribution", "Central planning"],
          correct: 1,
          explanation: "Capitalism relies on markets and private property"
        },
        {
          question: "What is socialism?",
          options: ["Private enterprise dominates", "Government owns means of production", "No government involvement", "Capitalism variant"],
          correct: 1,
          explanation: "Socialism emphasizes collective ownership"
        },
        {
          question: "What is a mixed economy?",
          options: ["Only capitalism", "Only socialism", "Combination of capitalism and socialism", "No government role"],
          correct: 2,
          explanation: "Mixed economies have both private and public sectors"
        },
        {
          question: "What is a command economy?",
          options: ["Market-driven", "Government controls production and distribution", "Private enterprise only", "No planning"],
          correct: 1,
          explanation: "Command economies are centrally planned"
        },
        {
          question: "Which system emphasizes efficiency through competition?",
          options: ["Socialism", "Capitalism", "Command economy", "Feudalism"],
          correct: 1,
          explanation: "Capitalism promotes efficiency through competitive markets"
        }
      ]
    },

    // HISTORY GAMES (51-60)
    51: {
      type: "quiz",
      title: "Timeline Constructor",
      description: "Master chronology of ancient civilizations",
      questions: [
        {
          question: "Which ancient civilization is oldest?",
          options: ["Roman Empire", "Ancient Egypt", "Ancient Greece", "Mesopotamia"],
          correct: 3,
          explanation: "Mesopotamia (3500 BCE) is one of the earliest civilizations"
        },
        {
          question: "When did Ancient Egypt flourish?",
          options: ["5000 BCE", "3100-30 BCE", "1000 BCE", "500 CE"],
          correct: 1,
          explanation: "Egypt lasted from ~3100 BCE until Roman conquest in 30 BCE"
        },
        {
          question: "When was the Roman Empire established?",
          options: ["500 BCE", "100 BCE", "27 BCE", "100 CE"],
          correct: 2,
          explanation: "The Roman Empire began in 27 BCE under Augustus"
        },
        {
          question: "Which ancient civilization built the Great Wall?",
          options: ["India", "Japan", "China", "Vietnam"],
          correct: 2,
          explanation: "China built the Great Wall for defense"
        },
        {
          question: "What year did the Roman Empire fall?",
          options: ["200 CE", "400 CE", "476 CE", "600 CE"],
          correct: 2,
          explanation: "The Western Roman Empire fell in 476 CE"
        }
      ]
    },
    52: {
      type: "quiz",
      title: "Medieval Kingdoms",
      description: "Understand the Medieval period and feudalism",
      questions: [
        {
          question: "When was the Medieval period?",
          options: ["100-500 CE", "500-1400 CE", "1000-1500 CE", "1200-1600 CE"],
          correct: 1,
          explanation: "The Medieval period spans roughly 500-1500 CE"
        },
        {
          question: "What was feudalism?",
          options: ["Republican government", "Land-based social system with lords and vassals", "Military dictatorship", "Democratic system"],
          correct: 1,
          explanation: "Feudalism was a hierarchical land ownership system"
        },
        {
          question: "Who were the Crusades fought between?",
          options: ["Europe and Africa", "Christians and Muslims over Holy Land", "England and France", "Vikings and Saxons"],
          correct: 1,
          explanation: "Crusades were religious wars between 1095-1291 CE"
        },
        {
          question: "What was the role of the Catholic Church in Medieval Europe?",
          options: ["Military commander only", "Spiritual and political authority", "Merchant guild only", "No influence"],
          correct: 1,
          explanation: "The Church had significant spiritual and temporal power"
        },
        {
          question: "What was the Black Death?",
          options: ["War", "Plague killing ~75 million people in Europe", "Famine", "Flood"],
          correct: 1,
          explanation: "The Black Death (1347-1353) devastated Medieval Europe"
        }
      ]
    },
    53: {
      type: "quiz",
      title: "Renaissance Trivia",
      description: "Master the Renaissance and cultural rebirth",
      questions: [
        {
          question: "When was the Renaissance?",
          options: ["1000-1200 CE", "1300-1600 CE", "1200-1400 CE", "1400-1700 CE"],
          correct: 1,
          explanation: "The Renaissance occurred roughly 1300-1600 CE"
        },
        {
          question: "What does Renaissance mean?",
          options: ["Rebirth", "Renewal", "Revival of classical learning", "All of the above"],
          correct: 3,
          explanation: "Renaissance means 'rebirth' of classical knowledge"
        },
        {
          question: "Who was Leonardo da Vinci?",
          options: ["Pope", "Painter, scientist, inventor", "Military general", "King"],
          correct: 1,
          explanation: "Da Vinci was a Renaissance polymath"
        },
        {
          question: "What was the Reformation?",
          options: ["Artistic movement", "Religious movement challenging Catholic Church", "Renaissance art", "Medieval revival"],
          correct: 1,
          explanation: "The Reformation (1517+) challenged Church authority"
        },
        {
          question: "Who invented the printing press?",
          options: ["Leonardo da Vinci", "Johannes Gutenberg", "Michelangelo", "Galileo"],
          correct: 1,
          explanation: "Gutenberg invented the movable type printing press (~1440)"
        }
      ]
    },
    54: {
      type: "quiz",
      title: "Age of Exploration",
      description: "Understand the Age of Discovery",
      questions: [
        {
          question: "When was the Age of Exploration?",
          options: ["1200-1400", "1400-1600", "1500-1700", "1600-1800"],
          correct: 1,
          explanation: "The Age of Exploration was roughly 1400-1600"
        },
        {
          question: "Who sailed to the Americas in 1492?",
          options: ["Magellan", "Cortés", "Columbus", "Vasco da Gama"],
          correct: 2,
          explanation: "Columbus sailed to the Americas in 1492"
        },
        {
          question: "What trade did explorers seek?",
          options: ["Spice trade", "Silk road", "Route to Asia", "All of above"],
          correct: 3,
          explanation: "Explorers sought valuable trade routes and goods"
        },
        {
          question: "Which explorer circumnavigated the globe?",
          options: ["Columbus", "Da Gama", "Magellan", "Cortés"],
          correct: 2,
          explanation: "Magellan's expedition was the first to circumnavigate"
        },
        {
          question: "What was the impact of exploration on Native Americans?",
          options: ["Positive only", "Trade increase only", "Disease, conquest, and cultural destruction", "No impact"],
          correct: 2,
          explanation: "European diseases killed millions of Native Americans"
        }
      ]
    },
    55: {
      type: "quiz",
      title: "Revolution Puzzle",
      description: "Master major revolutionary movements",
      questions: [
        {
          question: "When did the American Revolution begin?",
          options: ["1776", "1775", "1777", "1783"],
          correct: 1,
          explanation: "The American Revolution began in 1775"
        },
        {
          question: "What year did the French Revolution start?",
          options: ["1789", "1792", "1800", "1776"],
          correct: 0,
          explanation: "The French Revolution began in 1789"
        },
        {
          question: "Who was the first U.S. President?",
          options: ["Jefferson", "Washington", "Franklin", "Adams"],
          correct: 1,
          explanation: "George Washington was the first U.S. President"
        },
        {
          question: "What major document was adopted July 4, 1776?",
          options: ["Constitution", "Declaration of Independence", "Magna Carta", "Bill of Rights"],
          correct: 1,
          explanation: "The Declaration of Independence was signed July 4, 1776"
        },
        {
          question: "Which Enlightenment thinker influenced American Revolution?",
          options: ["Voltaire", "John Locke", "Rousseau", "Descartes"],
          correct: 1,
          explanation: "John Locke's ideas on natural rights influenced America"
        }
      ]
    },
    56: {
      type: "quiz",
      title: "Industrial Era",
      description: "Understand the Industrial Revolution",
      questions: [
        {
          question: "When was the Industrial Revolution?",
          options: ["1600-1700", "1760-1840", "1800-1900", "1850-1950"],
          correct: 1,
          explanation: "The Industrial Revolution was roughly 1760-1840"
        },
        {
          question: "Where did the Industrial Revolution begin?",
          options: ["France", "Germany", "Great Britain", "United States"],
          correct: 2,
          explanation: "Britain was the birthplace of industrialization"
        },
        {
          question: "What was a major invention of the Industrial Revolution?",
          options: ["Telescope", "Steam engine", "Printing press", "Compass"],
          correct: 1,
          explanation: "The steam engine powered industrialization"
        },
        {
          question: "What was a major social impact of industrialization?",
          options: ["Return to farming", "Urbanization and factory work", "Increased agriculture", "Less trade"],
          correct: 1,
          explanation: "Industrialization caused massive urbanization"
        },
        {
          question: "What type of factories emerged?",
          options: ["Craft workshops", "Large mechanized factories", "Cottage industries", "Small mills"],
          correct: 1,
          explanation: "Factory system replaced cottage industries"
        }
      ]
    },
    57: {
      type: "quiz",
      title: "World War Historian",
      description: "Master World War I and II history",
      questions: [
        {
          question: "When was World War I?",
          options: ["1900-1920", "1914-1918", "1920-1945", "1939-1945"],
          correct: 1,
          explanation: "World War I was 1914-1918"
        },
        {
          question: "When was World War II?",
          options: ["1919-1939", "1935-1950", "1939-1945", "1941-1945"],
          correct: 2,
          explanation: "World War II was 1939-1945"
        },
        {
          question: "What was the main cause of World War I?",
          options: ["Economic competition", "Assassination of Archduke Franz Ferdinand", "Nazi aggression", "Pearl Harbor"],
          correct: 1,
          explanation: "Franz Ferdinand's assassination in Sarajevo triggered WWI"
        },
        {
          question: "Who led Germany during World War II?",
          options: ["Mussolini", "Adolf Hitler", "Kaiser Wilhelm", "Hindenburg"],
          correct: 1,
          explanation: "Adolf Hitler led Nazi Germany (1933-1945)"
        },
        {
          question: "How many people died in World War II?",
          options: ["10 million", "50 million", "70-85 million", "100 million"],
          correct: 2,
          explanation: "WWII killed approximately 70-85 million people"
        }
      ]
    },
    58: {
      type: "quiz",
      title: "Cold War Strategies",
      description: "Understand Cold War tensions and politics",
      questions: [
        {
          question: "When was the Cold War?",
          options: ["1920-1940", "1945-1991", "1950-1970", "1975-2000"],
          correct: 1,
          explanation: "The Cold War lasted 1945-1991"
        },
        {
          question: "Which countries were the superpowers?",
          options: ["Britain and France", "USA and USSR", "Germany and Italy", "China and Japan"],
          correct: 1,
          explanation: "USA and USSR were Cold War superpowers"
        },
        {
          question: "What was the main feature of the Cold War?",
          options: ["Hot military conflict", "Ideological and political tension without direct military combat", "Colonial competition", "Trade wars"],
          correct: 1,
          explanation: "Cold War was ideological competition without direct warfare"
        },
        {
          question: "What was the Korean War?",
          options: ["Civil war", "Proxy war during Cold War (1950-1953)", "World War", "Peaceful conflict"],
          correct: 1,
          explanation: "Korean War was a proxy war between superpowers"
        },
        {
          question: "What was the Cuban Missile Crisis?",
          options: ["Past event", "1962 nuclear standoff between USA and USSR", "Space race", "Berlin Wall"],
          correct: 1,
          explanation: "Cuban Missile Crisis (1962) nearly caused nuclear war"
        }
      ]
    },
    59: {
      type: "quiz",
      title: "Modern History Map",
      description: "Understand contemporary history and globalization",
      questions: [
        {
          question: "When did the Cold War end?",
          options: ["1980", "1989", "1991", "1995"],
          correct: 2,
          explanation: "The Cold War officially ended in 1991"
        },
        {
          question: "What major event happened September 11, 2001?",
          options: ["Pearl Harbor", "Terrorist attacks on USA", "Fall of Berlin Wall", "End of apartheid"],
          correct: 1,
          explanation: "9/11 attacks changed global politics"
        },
        {
          question: "What is globalization?",
          options: ["National isolation", "Increased worldwide interconnection of trade and culture", "Local focus", "Reduced communication"],
          correct: 1,
          explanation: "Globalization connects world economies and cultures"
        },
        {
          question: "Which country dissolved in 1991?",
          options: ["East Germany", "Yugoslavia", "Soviet Union", "Czechoslovakia"],
          correct: 2,
          explanation: "The Soviet Union dissolved in 1991"
        },
        {
          question: "What is the current major global challenge?",
          options: ["Cold War", "Colonialism", "Climate change and COVID-19", "Medieval conflicts"],
          correct: 2,
          explanation: "Climate change and pandemics are modern challenges"
        }
      ]
    },
    60: {
      type: "quiz",
      title: "Historical Figures",
      description: "Understand major historical figures and leaders",
      questions: [
        {
          question: "Who was Abraham Lincoln?",
          options: ["King", "U.S. President during Civil War", "General", "Prime Minister"],
          correct: 1,
          explanation: "Lincoln was U.S. President (1861-1865) during Civil War"
        },
        {
          question: "Who was Winston Churchill?",
          options: ["U.S. President", "British Prime Minister during WWII", "German leader", "French general"],
          correct: 1,
          explanation: "Churchill led Britain during WWII"
        },
        {
          question: "Who was Mahatma Gandhi?",
          options: ["Political leader", "Leader of Indian independence movement", "Military general", "Religious figure"],
          correct: 1,
          explanation: "Gandhi led India to independence through nonviolence"
        },
        {
          question: "Who was Nelson Mandela?",
          options: ["British general", "American president", "South African anti-apartheid leader", "French philosopher"],
          correct: 2,
          explanation: "Mandela fought apartheid and became South Africa's president"
        },
        {
          question: "Who was Marie Curie?",
          options: ["Artist", "Scientist who discovered radioactivity", "Queen", "Military leader"],
          correct: 1,
          explanation: "Curie discovered radium and polonium"
        }
      ]
    },

    // HUMAN GEOGRAPHY GAMES (61-70)
    61: {
      type: "quiz",
      title: "Map Master",
      description: "Master world geography, capitals, and countries",
      questions: [
        {
          question: "What is the capital of France?",
          options: ["Lyon", "Paris", "Marseille", "Nice"],
          correct: 1,
          explanation: "Paris is the capital and largest city of France"
        },
        {
          question: "Which is the largest country by land area?",
          options: ["Canada", "China", "Russia", "USA"],
          correct: 2,
          explanation: "Russia is the largest country by land area"
        },
        {
          question: "What is the capital of Japan?",
          options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"],
          correct: 2,
          explanation: "Tokyo is the capital and largest city of Japan"
        },
        {
          question: "Which continent has the most countries?",
          options: ["Asia", "Africa", "South America", "Europe"],
          correct: 1,
          explanation: "Africa has 54 recognized countries"
        },
        {
          question: "What is the capital of Brazil?",
          options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
          correct: 2,
          explanation: "Brasília is the capital of Brazil"
        }
      ]
    },
    62: {
      type: "quiz",
      title: "Culture Explorer",
      description: "Understand world cultures and traditions",
      questions: [
        {
          question: "What is culture?",
          options: ["Art only", "Shared beliefs, values, practices of group", "Food only", "Language only"],
          correct: 1,
          explanation: "Culture encompasses all aspects of group life"
        },
        {
          question: "What is cultural diffusion?",
          options: ["Culture disappearing", "Spread of cultural elements between groups", "Cultural isolation", "Tradition"],
          correct: 1,
          explanation: "Cultural diffusion spreads practices through contact"
        },
        {
          question: "What is ethnocentrism?",
          options: ["Respecting all cultures equally", "Believing one's own culture is superior", "Geographic location", "Language"],
          correct: 1,
          explanation: "Ethnocentrism is cultural bias toward one's own group"
        },
        {
          question: "What is cultural pluralism?",
          options: ["Assimilation", "Multiple cultures coexisting in society", "Homogeneity", "Isolation"],
          correct: 1,
          explanation: "Pluralism accepts cultural diversity"
        },
        {
          question: "What are cultural traits?",
          options: ["Individual characteristics", "Elements of culture like language and customs", "Physical features", "Geographic features"],
          correct: 1,
          explanation: "Traits are specific cultural elements"
        }
      ]
    },
    63: {
      type: "quiz",
      title: "Population Analyzer",
      description: "Master demographics and population geography",
      questions: [
        {
          question: "What is population density?",
          options: ["Total population", "Population per unit area", "Birth rate", "Death rate"],
          correct: 1,
          explanation: "Population density measures people per square unit"
        },
        {
          question: "What is crude birth rate?",
          options: ["Death rate", "Number of births per 1000 people", "Fertility rate", "Migration rate"],
          correct: 1,
          explanation: "Crude birth rate = (births/population) × 1000"
        },
        {
          question: "What is crude death rate?",
          options: ["Birth rate", "Deaths per 1000 people", "Mortality rate only", "Disease rate"],
          correct: 1,
          explanation: "Crude death rate = (deaths/population) × 1000"
        },
        {
          question: "What is natural increase?",
          options: ["Migration", "Birth rate minus death rate", "Total population", "Age structure"],
          correct: 1,
          explanation: "Natural increase shows population growth without migration"
        },
        {
          question: "What is demographic transition?",
          options: ["Migration pattern", "Change in population as society develops", "Age structure", "Birth and death changes"],
          correct: 1,
          explanation: "Demographic transition describes population change over development"
        }
      ]
    },
    64: {
      type: "quiz",
      title: "Urban Planner",
      description: "Master urban geography and city planning",
      questions: [
        {
          question: "What is urbanization?",
          options: ["Rural movement", "Process of populations moving to cities", "City expansion only", "Urban decline"],
          correct: 1,
          explanation: "Urbanization is the shift toward urban living"
        },
        {
          question: "What is an urban area?",
          options: ["Farming region", "Densely populated area with cities", "Park", "Forest"],
          correct: 1,
          explanation: "Urban areas have high population density"
        },
        {
          question: "What is a metropolis?",
          options: ["Small town", "Large city with metropolitan area", "Capital city", "Suburb"],
          correct: 1,
          explanation: "A metropolis is a major urban center"
        },
        {
          question: "What is sprawl?",
          options: ["Urban density", "Unplanned expansion of cities into rural areas", "City planning", "Population growth"],
          correct: 1,
          explanation: "Urban sprawl creates low-density development"
        },
        {
          question: "What is sustainable city planning?",
          options: ["Maximum growth", "Development meeting current needs without harming future", "No growth", "Rural focus"],
          correct: 1,
          explanation: "Sustainable planning balances growth with livability"
        }
      ]
    },
    65: {
      type: "quiz",
      title: "Economic Regions",
      description: "Understand economic geography and regions",
      questions: [
        {
          question: "What is economic geography?",
          options: ["Geographic study of money", "Study of how resources and economic activities distribute spatially", "Currency study", "Stock market"],
          correct: 1,
          explanation: "Economic geography studies production and trade patterns"
        },
        {
          question: "What is a developed economy?",
          options: ["Emerging market", "High income with advanced industry", "Poor nation", "Agricultural focus"],
          correct: 1,
          explanation: "Developed economies have high GDP per capita"
        },
        {
          question: "What is a developing economy?",
          options: ["Advanced economy", "Lower income with growing industry", "Rich nation", "Manufacturing only"],
          correct: 1,
          explanation: "Developing economies are industrializing with growing wealth"
        },
        {
          question: "What are special economic zones?",
          options: ["Disaster areas", "Designated areas with special trade privileges", "Natural parks", "Historic sites"],
          correct: 1,
          explanation: "SEZs attract investment through tax and trade incentives"
        },
        {
          question: "What is outsourcing?",
          options: ["Hiring locally", "Moving jobs to lower-cost regions", "Training workers", "Increasing wages"],
          correct: 1,
          explanation: "Outsourcing relocates production to reduce costs"
        }
      ]
    },
    66: {
      type: "quiz",
      title: "Political Boundaries",
      description: "Understand geopolitics and international relations",
      questions: [
        {
          question: "What is a sovereign nation?",
          options: ["Satellite state", "Independent state with self-governance", "Colony", "Territory"],
          correct: 1,
          explanation: "Sovereign states are independent entities"
        },
        {
          question: "What are maritime boundaries?",
          options: ["Land borders", "Ocean borders between nations", "River lines", "Mountain ranges"],
          correct: 1,
          explanation: "Maritime boundaries define ocean territories"
        },
        {
          question: "What is geopolitics?",
          options: ["Geography only", "Study of geography's influence on politics and power", "Political science", "International law"],
          correct: 1,
          explanation: "Geopolitics analyzes geography's role in power dynamics"
        },
        {
          question: "What is a buffer state?",
          options: ["Military state", "Small nation between larger powers", "Neutral country", "Island nation"],
          correct: 1,
          explanation: "Buffer states separate rivals geographically"
        },
        {
          question: "What is a territorial dispute?",
          options: ["Trade disagreement", "Conflict over land ownership", "Cultural difference", "Economic competition"],
          correct: 1,
          explanation: "Territorial disputes arise from competing sovereignty claims"
        }
      ]
    },
    67: {
      type: "quiz",
      title: "Resource Manager",
      description: "Understand natural resources and their management",
      questions: [
        {
          question: "What are natural resources?",
          options: ["Man-made objects", "Materials from nature used by humans", "Manufactured goods", "Energy only"],
          correct: 1,
          explanation: "Natural resources include minerals, water, forests, energy"
        },
        {
          question: "What is a renewable resource?",
          options: ["Resources sold again", "Resource that replenishes naturally", "Limited resource", "Fossil fuel"],
          correct: 1,
          explanation: "Renewables replenish faster than use rate"
        },
        {
          question: "What is a nonrenewable resource?",
          options: ["Recyclable material", "Resource finite and depletes over time", "Sustainable resource", "Water"],
          correct: 1,
          explanation: "Nonrenewables like oil and coal take millions of years to form"
        },
        {
          question: "What is resource extraction?",
          options: ["Trading goods", "Removing natural resources from environment", "Recycling", "Conservation"],
          correct: 1,
          explanation: "Extraction includes mining, logging, drilling"
        },
        {
          question: "What is sustainable resource management?",
          options: ["Maximum extraction", "Using resources without depleting for future", "No extraction", "Waste only"],
          correct: 1,
          explanation: "Sustainability balances current and future needs"
        }
      ]
    },
    68: {
      type: "quiz",
      title: "Migration Tracker",
      description: "Understand human migration patterns",
      questions: [
        {
          question: "What is migration?",
          options: ["Travel", "Permanent movement from one place to another", "Temporary trip", "Commuting"],
          correct: 1,
          explanation: "Migration is relocation with intent to stay"
        },
        {
          question: "What is immigration?",
          options: ["Emigration", "Moving into a country", "Leaving country", "Border crossing"],
          correct: 1,
          explanation: "Immigration is arrival in a new country"
        },
        {
          question: "What is emigration?",
          options: ["Immigration", "Leaving one's country", "Moving between cities", "Tourism"],
          correct: 1,
          explanation: "Emigration is departing from one's native country"
        },
        {
          question: "What are push factors?",
          options: ["Reasons to move to area", "Reasons to leave area", "Geographic features", "Cultural elements"],
          correct: 1,
          explanation: "Push factors include poverty, war, persecution"
        },
        {
          question: "What are pull factors?",
          options: ["Reasons to leave", "Reasons to move to location", "Natural disasters", "Conflict"],
          correct: 1,
          explanation: "Pull factors include jobs, freedom, education opportunity"
        }
      ]
    },
    69: {
      type: "quiz",
      title: "Climate & Landscape",
      description: "Master physical geography and climate zones",
      questions: [
        {
          question: "What are the major climate zones?",
          options: ["Just hot and cold", "Tropical, dry, temperate, cold, highland", "Desert and forest", "North and south"],
          correct: 1,
          explanation: "Köppen classifies climates into major categories"
        },
        {
          question: "What is a tropical climate?",
          options: ["Cold", "Warm year-round with high precipitation", "Dry", "Variable temperature"],
          correct: 1,
          explanation: "Tropical climates are hot and humid"
        },
        {
          question: "What is a desert climate?",
          options: ["Humid", "Arid with low precipitation", "Tropical", "Temperate"],
          correct: 1,
          explanation: "Deserts receive less than 10 inches annual rainfall"
        },
        {
          question: "What is weathering?",
          options: ["Climate change", "Breakdown of rocks in place", "Land formation", "Soil creation"],
          correct: 1,
          explanation: "Weathering physically and chemically breaks rocks"
        },
        {
          question: "What is erosion?",
          options: ["Rock breakdown", "Transport of weathered material", "Soil composition", "Sedimentation"],
          correct: 1,
          explanation: "Erosion moves material from one location to another"
        }
      ]
    },
    70: {
      type: "quiz",
      title: "Development Compass",
      description: "Understand economic development and inequality",
      questions: [
        {
          question: "What is economic development?",
          options: ["City building", "Improvement in standard of living and economic capacity", "Population growth", "Trade increase"],
          correct: 1,
          explanation: "Development involves increasing wealth and opportunities"
        },
        {
          question: "What is the Human Development Index?",
          options: ["GDP measure", "Index measuring health, education, and income", "Population measure", "Trade index"],
          correct: 1,
          explanation: "HDI assesses human welfare comprehensively"
        },
        {
          question: "What is a developed country?",
          options: ["Emerging economy", "High income with advanced infrastructure", "Developing nation", "Low GDP"],
          correct: 1,
          explanation: "Developed countries have high HDI and GDP per capita"
        },
        {
          question: "What is income inequality?",
          options: ["Equal wealth", "Unequal distribution of wealth", "High poverty", "Economic growth"],
          correct: 1,
          explanation: "Inequality is measured by wealth distribution"
        },
        {
          question: "What is the development gap?",
          options: ["Geographical distance", "Difference in development between wealthy and poor nations", "Population difference", "Trade imbalance"],
          correct: 1,
          explanation: "Development gap shows stark disparities between countries"
        }
      ]
    },

    // PSYCHOLOGY GAMES (71-80)
    71: {
      type: "quiz",
      title: "Cognitive Bias Detector",
      description: "Understand cognitive biases and thinking errors",
      questions: [
        {
          question: "What is a cognitive bias?",
          options: ["Logical thinking", "Systematic error in judgment", "Accurate reasoning", "Scientific method"],
          correct: 1,
          explanation: "Biases are predictable patterns in thinking errors"
        },
        {
          question: "What is confirmation bias?",
          options: ["Accepting all evidence", "Seeking evidence that confirms existing beliefs", "Scientific thinking", "Objectivity"],
          correct: 1,
          explanation: "Confirmation bias leads to selective information seeking"
        },
        {
          question: "What is anchoring bias?",
          options: ["Forgetting information", "Over-relying on initial information", "Good decision making", "Critical thinking"],
          correct: 1,
          explanation: "Anchoring bias causes first information to influence judgment"
        },
        {
          question: "What is availability bias?",
          options: ["Information access", "Judging based on readily available information", "Critical analysis", "Logical deduction"],
          correct: 1,
          explanation: "Availability bias overweights easily recalled information"
        },
        {
          question: "What is hindsight bias?",
          options: ["Future prediction", "Believing past was predictable (I knew it)", "Accurate memory", "Clear thinking"],
          correct: 1,
          explanation: "Hindsight bias is '20/20 vision' about the past"
        }
      ]
    },
    72: {
      type: "quiz",
      title: "Memory Mastermind",
      description: "Master memory systems and retention",
      questions: [
        {
          question: "What are the three types of memory?",
          options: ["Working and long-term", "Sensory, short-term, and long-term", "Visual and auditory", "Conscious and unconscious"],
          correct: 1,
          explanation: "Memory has sensory, short-term, and long-term components"
        },
        {
          question: "What is sensory memory?",
          options: ["Conscious recall", "Immediate impression lasting milliseconds", "Thinking process", "Emotional memory"],
          correct: 1,
          explanation: "Sensory memory is the first stage of processing"
        },
        {
          question: "What is short-term/working memory?",
          options: ["Permanent storage", "Information held for seconds to minutes", "Emotional storage", "Skills storage"],
          correct: 1,
          explanation: "Working memory temporarily holds ~7 items"
        },
        {
          question: "What is long-term memory capacity?",
          options: ["Limited", "Relatively unlimited", "Only 30 items", "Decreases with age"],
          correct: 1,
          explanation: "Long-term memory can store vast amounts"
        },
        {
          question: "What is the difference between recall and recognition?",
          options: ["Same thing", "Recall retrieves freely; recognition identifies from options", "Recall is worse", "Recognition is harder"],
          correct: 1,
          explanation: "Recognition is easier than free recall"
        }
      ]
    },
    73: {
      type: "quiz",
      title: "Learning Pathways",
      description: "Master conditioning and learning theories",
      questions: [
        {
          question: "What is classical conditioning?",
          options: ["Traditional education", "Learning through association of stimuli", "Behavioral response only", "Innate behavior"],
          correct: 1,
          explanation: "Pavlov's dogs learned through stimulus association"
        },
        {
          question: "Who was Ivan Pavlov?",
          options: ["Behaviorist", "Psychologist who discovered classical conditioning", "Therapist", "Neuroscientist"],
          correct: 1,
          explanation: "Pavlov's experiments with dogs founded classical conditioning"
        },
        {
          question: "What is operant conditioning?",
          options: ["Association only", "Learning through rewards and punishments", "Classical conditioning", "Innate behavior"],
          correct: 1,
          explanation: "Skinner's operant conditioning uses consequences"
        },
        {
          question: "What is reinforcement?",
          options: ["Punishment", "Consequence that increases behavior", "Negative feedback", "Extinction"],
          correct: 1,
          explanation: "Reinforcement strengthens behavior"
        },
        {
          question: "What is punishment?",
          options: ["Reward", "Consequence that decreases behavior", "Positive reinforcement", "Learning"],
          correct: 1,
          explanation: "Punishment weakens behavior"
        }
      ]
    },
    74: {
      type: "quiz",
      title: "Motivation Motivator",
      description: "Understand motivation and human drives",
      questions: [
        {
          question: "What is motivation?",
          options: ["Emotion only", "Force directing behavior toward goals", "Fear response", "Instinct"],
          correct: 1,
          explanation: "Motivation is the drive to accomplish goals"
        },
        {
          question: "What is intrinsic motivation?",
          options: ["External reward", "Internal drive from interest/enjoyment", "Social pressure", "Fear-based"],
          correct: 1,
          explanation: "Intrinsic motivation comes from within"
        },
        {
          question: "What is extrinsic motivation?",
          options: ["Internal drive", "External rewards or punishments", "Personal interest", "Self-determination"],
          correct: 1,
          explanation: "Extrinsic motivation comes from external consequences"
        },
        {
          question: "What is Maslow's hierarchy of needs?",
          options: ["Psychological theory", "Five-level pyramid of human needs", "One universal need", "Economic theory"],
          correct: 1,
          explanation: "Maslow's pyramid: physiological, safety, love, esteem, self-actualization"
        },
        {
          question: "What is self-actualization?",
          options: ["Financial success", "Reaching one's full potential", "Social status", "Career achievement"],
          correct: 1,
          explanation: "Self-actualization is the highest level of Maslow's hierarchy"
        }
      ]
    },
    75: {
      type: "quiz",
      title: "Personality Puzzle",
      description: "Understand personality theories and types",
      questions: [
        {
          question: "What is personality?",
          options: ["Intelligence", "Consistent patterns of thoughts, feelings, and behaviors", "Mood", "Emotions only"],
          correct: 1,
          explanation: "Personality is the pattern of individual differences"
        },
        {
          question: "What is the Big Five personality model?",
          options: ["Four traits", "Five major personality dimensions (OCEAN)", "One dominant trait", "Myers-Briggs"],
          correct: 1,
          explanation: "Big Five: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism"
        },
        {
          question: "What is extraversion?",
          options: ["Shyness", "Outgoing, social, talkative trait", "Introversion", "Anxiety"],
          correct: 1,
          explanation: "Extraversion indicates sociability and outgoingness"
        },
        {
          question: "What is introversion?",
          options: ["Social trait", "Tendency to be quiet and reserved", "Extraversion", "Unfriendly"],
          correct: 1,
          explanation: "Introversion is preference for quiet, less stimulation"
        },
        {
          question: "What is the Myers-Briggs Type Indicator?",
          options: ["One trait", "16-type personality classification", "Five factors", "Intelligence test"],
          correct: 1,
          explanation: "MBTI uses four dimensions to create 16 types"
        }
      ]
    },
    76: {
      type: "quiz",
      title: "Social Dynamics",
      description: "Master social psychology and group behavior",
      questions: [
        {
          question: "What is social psychology?",
          options: ["Clinical psychology", "Study of how people influence each other", "Individual therapy", "Brain science"],
          correct: 1,
          explanation: "Social psychology studies group and interpersonal effects"
        },
        {
          question: "What is conformity?",
          options: ["Independence", "Changing behavior to match group", "Rebellion", "Unique expression"],
          correct: 1,
          explanation: "Conformity is adjusting to group standards"
        },
        {
          question: "What is obedience?",
          options: ["Disobedience", "Following authority commands", "Resistance", "Independence"],
          correct: 1,
          explanation: "Obedience is compliance with authority"
        },
        {
          question: "Who conducted the Stanford Prison Experiment?",
          options: ["Milgram", "Philip Zimbardo", "Asch", "Bandura"],
          correct: 1,
          explanation: "Zimbardo's experiment showed how roles influence behavior"
        },
        {
          question: "What is groupthink?",
          options: ["Agreement", "Desire for harmony causing poor decisions", "Consensus", "Cooperation"],
          correct: 1,
          explanation: "Groupthink suppresses critical thinking in groups"
        }
      ]
    },
    77: {
      type: "quiz",
      title: "Mental Health Guide",
      description: "Understand mental health disorders and wellness",
      questions: [
        {
          question: "What is a mental health disorder?",
          options: ["Personality quirk", "Significant psychological dysfunction", "Being different", "Temporary mood"],
          correct: 1,
          explanation: "Disorders involve distress and impairment"
        },
        {
          question: "What is depression?",
          options: ["Occasional sadness", "Persistent sadness, loss of interest, fatigue", "Temporary mood", "Laziness"],
          correct: 1,
          explanation: "Depression is a clinical mood disorder"
        },
        {
          question: "What is anxiety disorder?",
          options: ["Normal worry", "Excessive, persistent worry affecting functioning", "Fear response", "Stress"],
          correct: 1,
          explanation: "Anxiety disorders involve disproportionate fear/worry"
        },
        {
          question: "What is bipolar disorder?",
          options: ["Sadness only", "Alternating manic and depressive episodes", "Two personalities", "Mood swings"],
          correct: 1,
          explanation: "Bipolar involves extreme mood shifts"
        },
        {
          question: "What is schizophrenia?",
          options: ["Multiple personalities", "Disorder with delusions, hallucinations, disorganized thinking", "Anxiety disorder", "Depression variant"],
          correct: 1,
          explanation: "Schizophrenia involves loss of contact with reality"
        }
      ]
    },
    78: {
      type: "quiz",
      title: "Therapy Techniques",
      description: "Master psychological treatments and interventions",
      questions: [
        {
          question: "What is psychotherapy?",
          options: ["Medication only", "Psychological treatment for mental health", "Surgery", "Physical exercise"],
          correct: 1,
          explanation: "Psychotherapy uses psychological methods for healing"
        },
        {
          question: "What is cognitive behavioral therapy (CBT)?",
          options: ["Lying on couch", "Changing thoughts and behaviors to improve mental health", "Hypnosis", "Relaxation only"],
          correct: 1,
          explanation: "CBT focuses on thoughts and behaviors"
        },
        {
          question: "What is psychoanalysis?",
          options: ["Modern therapy", "Freud's therapy exploring unconscious conflicts", "Drug treatment", "Group therapy"],
          correct: 1,
          explanation: "Psychoanalysis emphasizes unconscious processes"
        },
        {
          question: "What is humanistic therapy?",
          options: ["Scientific only", "Therapy emphasizing personal growth and potential", "Behavioral focus", "Medication"],
          correct: 1,
          explanation: "Humanistic therapy focuses on self-actualization"
        },
        {
          question: "What is psychiatric medication?",
          options: ["Only therapy needed", "Drugs treating biochemical imbalances", "Placebo", "Harmful"],
          correct: 1,
          explanation: "Medications like antidepressants address brain chemistry"
        }
      ]
    },
    79: {
      type: "quiz",
      title: "Neuroscience Quest",
      description: "Explore brain structure and neurotransmitters",
      questions: [
        {
          question: "What is neuroscience?",
          options: ["Study of thoughts", "Study of brain and nervous system", "Psychology only", "Behavior study"],
          correct: 1,
          explanation: "Neuroscience examines biological bases of behavior"
        },
        {
          question: "What does the cerebral cortex do?",
          options: ["Motor control only", "Controls thinking, planning, language, perception", "Survival functions", "Emotional response"],
          correct: 1,
          explanation: "The cortex handles higher cognitive functions"
        },
        {
          question: "What is the limbic system?",
          options: ["Thinking brain", "Brain structures controlling emotions and memory", "Motor area", "Sensory cortex"],
          correct: 1,
          explanation: "The limbic system processes emotions"
        },
        {
          question: "What are neurotransmitters?",
          options: ["Brain cells", "Chemical messengers transmitting signals between neurons", "Structural proteins", "Brain size"],
          correct: 1,
          explanation: "Neurotransmitters enable neural communication"
        },
        {
          question: "What does serotonin regulate?",
          options: ["Muscle strength", "Mood, sleep, and appetite", "Memory only", "Pain sensing"],
          correct: 1,
          explanation: "Serotonin is involved in mood and well-being"
        }
      ]
    },
    80: {
      type: "quiz",
      title: "Research Methods",
      description: "Master psychological research and statistics",
      questions: [
        {
          question: "What is the scientific method?",
          options: ["Opinion-based", "Systematic approach to testing hypothesis", "Intuition", "Authority-based"],
          correct: 1,
          explanation: "Scientific method uses observation and experimentation"
        },
        {
          question: "What is a hypothesis?",
          options: ["Conclusion", "Testable prediction", "Opinion", "Theory"],
          correct: 1,
          explanation: "Hypothesis is an educated prediction"
        },
        {
          question: "What is an experiment?",
          options: ["Observation only", "Controlled study manipulating variables", "Casual observation", "Opinion survey"],
          correct: 1,
          explanation: "Experiments test cause-effect relationships"
        },
        {
          question: "What is a control group?",
          options: ["Experimental group", "Baseline group for comparison", "Main group", "Invalid group"],
          correct: 1,
          explanation: "Control groups receive no treatment for comparison"
        },
        {
          question: "What is correlation?",
          options: ["Causation", "Statistical relationship between variables", "Experimental finding", "Proof"],
          correct: 1,
          explanation: "Correlation does not prove causation"
        }
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
    if (!activeGame) return;

    // Deduct coins if paid game
    let newCoins = playerCoins;
    if (activeGame.coin_cost > 0) {
      newCoins = playerCoins - activeGame.coin_cost;
    }

    // Add reward coins
    newCoins += activeGame.base_reward;
    setPlayerCoins(newCoins);

    // Update user
    if (user) {
      const updatedUser = { ...user, coins: newCoins };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }

    // Notify parent
    if (onGameWin) onGameWin(activeGame.id, activeGame.base_reward);

    // Dispatch dashboard update event
    const activity = {
      id: Date.now(),
      type: "Game Won",
      description: `Completed ${activeGame.title}`,
      subject: Object.keys(gamesByTopic).find(topic => 
        gamesByTopic[topic].some(g => g.id === activeGame.id)
      ) || "Games",
      created_at: new Date(),
    };

    window.dispatchEvent(new CustomEvent("dashboardUpdate", {
      detail: {
        type: "gameCompleted",
        activity,
        stats: { totalGameScore: (user?.totalGameScore || 0) + activeGame.base_reward }
      }
    }));

    // Show completion modal
    alert(`🎉 Great job! You earned ${activeGame.base_reward} coins!`);
    setActiveGame(null);
  };

  const handleExitGame = () => {
    if (window.confirm("Are you sure you want to exit? Your progress will not be saved.")) {
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
          />
        )}
        {gameType === "quiz" && (
          <QuizGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
        {gameType === "puzzle" && (
          <PuzzleGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
        {gameType === "memory" && (
          <MemoryGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
        {gameType === "dragdrop" && (
          <DragDropGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
        {gameType === "builder" && (
          <BuilderGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
        {gameType === "reaction" && (
          <ReactionGame
            gameData={{ ...activeGame, ...gameContent }}
            onComplete={handleGameComplete}
            onExit={handleExitGame}
          />
        )}
      </section>
    );
  }

  return (
    <section className="page fade-in">
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: "700", color: "#f9fafb" }}>🎮 Games by Subject</h1>
            <p style={{ fontSize: "1.1rem", color: "#9ca3af", marginBottom: "2rem" }}>Play interactive games, earn coins, and master each topic</p>
          </div>
          <div style={{ 
            padding: "15px 25px", 
            backgroundColor: "rgba(252, 211, 77, 0.1)",
            border: "2px solid rgba(252, 211, 77, 0.5)",
            borderRadius: "12px",
            textAlign: "center",
            minWidth: "150px"
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
        {topicGames.map((game) => {
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

