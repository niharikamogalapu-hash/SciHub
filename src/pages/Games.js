import React, { useState, useEffect } from "react";
import MatchingGame from "../components/games/MatchingGame";
import QuizGame from "../components/games/QuizGame";
import PuzzleGame from "../components/games/PuzzleGame";
import MemoryGame from "../components/games/MemoryGame";
import DragDropGame from "../components/games/DragDropGame";
import BuilderGame from "../components/games/BuilderGame";
import ReactionGame from "../components/games/ReactionGame";
import "./Games.css";
import { addGameScore, addCoins, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

function Games({ onGameWin }) {
  const [user, setUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("AP Biology");
  const [isLoading, setIsLoading] = useState(true);
  const [playerCoins, setPlayerCoins] = useState(0);
  const [dashboardStats, setDashboardStats] = useState(null);
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
        // Always use dashboard stats for coins
        const stats = window.localStorage.getItem(`scihub_user_${parsedUser.id}_dashboard_stats`);
        if (stats) {
          const parsedStats = JSON.parse(stats);
          setDashboardStats(parsedStats);
          setPlayerCoins(parsedStats.coins || 0);
        } else {
          setPlayerCoins(parsedUser.coins || 0);
        }
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
      // IDs: 1 (AP Biology), 11 (AP Chemistry), 21 (AP Physics), 31 (AP Env Sci), 41 (Economics), 51 (History), 61 (AP Geography), 71 (AP Psychology)
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
    "AP Biology": [
      { id: 1, game_number: 1, title: "Cell Structure Master", description: "Identify cell organelles and their functions. Match organelles to their descriptions.", lesson: "Introduction to Biology", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 2, game_number: 2, title: "Ecology Quest", description: "Explore community and population ecology concepts.", lesson: "Ecology", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 3, game_number: 3, title: "Evolution Match", description: "Connect species to their evolutionary adaptations through natural selection.", lesson: "Evolution", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 4, game_number: 4, title: "Phylogeny Master", description: "Build evolutionary trees and understand biological diversity.", lesson: "Evolutionary History", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 5, game_number: 5, title: "Cell Anatomy", description: "Tour the cell, identify membranes and cellular communication.", lesson: "Cell Structure", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 6, game_number: 6, title: "Energy Lab", description: "Master cellular respiration, photosynthesis, mitosis and meiosis.", lesson: "Cell Division & Energy", base_reward: 480, coin_cost: 160, difficulty: "Medium" },
      { id: 7, game_number: 7, title: "Genetics Inheritance", description: "Create Punnett squares, learn DNA structure and genetic expression.", lesson: "Genetics Basics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 8, game_number: 8, title: "Gene Expression Explorer", description: "Understand mutations, bacterial genetics, and gene regulation.", lesson: "Gene Expression", base_reward: 1920, coin_cost: 640, difficulty: "Medium" },
      { id: 9, game_number: 9, title: "Organisms & Systems", description: "Study plant and animal anatomy, physiology and defense systems.", lesson: "Multicellular Organisms", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 10, game_number: 10, title: "Behavior & Reproduction", description: "Learn nervous systems, reproduction, and animal behavior.", lesson: "Animal Systems & Behavior", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "AP Chemistry": [
      { id: 11, game_number: 1, title: "Foundations of Matter", description: "Learn atomic structure, electrons, and the periodic table.", lesson: "The Foundations of Matter", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 12, game_number: 2, title: "Chemical Math & Reactions", description: "Master stoichiometry and reaction types.", lesson: "Chemical Math & Reactions", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 13, game_number: 3, title: "Gas Language", description: "Understand ideal gas law and gas behavior.", lesson: "The Language of Gases", base_reward: 60, coin_cost: 20, difficulty: "Hard" },
      { id: 14, game_number: 4, title: "Thermodynamics Explorer", description: "Study energy, enthalpy, entropy, and calorimetry.", lesson: "Energy & Thermodynamics", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 15, game_number: 5, title: "Bonding & Structure", description: "Master chemical bonds and molecular geometry.", lesson: "Bonding & Molecular Structure", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 16, game_number: 6, title: "States of Matter", description: "Learn liquids, solids, solutions, and equilibrium.", lesson: "Phases of Matter", base_reward: 480, coin_cost: 160, difficulty: "Expert" },
      { id: 17, game_number: 7, title: "Acids & Kinetics", description: "Determine pH, buffers, and reaction rates.", lesson: "Acids, Bases, & Kinetics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 18, game_number: 8, title: "Advanced Atomic Theory", description: "Explore atomic structure and electrochemistry.", lesson: "Advanced Atomic Theory & Electricity", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 19, game_number: 9, title: "Nuclear & Organic", description: "Study nuclear chemistry and organic compounds.", lesson: "Nuclear Chemistry & Organic Intro", base_reward: 3840, coin_cost: 1280, difficulty: "Expert" },
      { id: 20, game_number: 10, title: "Organic Chemistry & Cycles", description: "Master organic compounds and global cycles.", lesson: "Organic Chemistry & Global Cycles", base_reward: 7680, coin_cost: 2560, difficulty: "Hard" },
    ],
    "AP Physics": [
      { id: 21, game_number: 1, title: "One-Dimensional Motion", description: "Learn motion, calculus, vectors, and Newton's Laws.", lesson: "One-Dimensional Motion & Calculus", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 22, game_number: 2, title: "Forces & Circular Motion", description: "Master friction, centripetal force, gravity, and energy.", lesson: "Forces, Friction & Circular Motion", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 23, game_number: 3, title: "Momentum & Rotation", description: "Study collisions, rotational mechanics, and torque.", lesson: "Momentum & Rotational Mechanics", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 24, game_number: 4, title: "Fluids & Oscillations", description: "Explore fluid dynamics and simple harmonic motion.", lesson: "Fluids & Oscillations", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 25, game_number: 5, title: "Sound & Thermal", description: "Learn sound, music physics, and temperature.", lesson: "Sound & Thermal Physics", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 26, game_number: 6, title: "Thermodynamics & Electrostatics", description: "Study thermodynamics and electric fields.", lesson: "Thermodynamics & Electrostatics", base_reward: 480, coin_cost: 160, difficulty: "Medium" },
      { id: 27, game_number: 7, title: "Voltage & Circuits", description: "Master voltage, current, and DC circuit analysis.", lesson: "Voltage & DC Circuits", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 28, game_number: 8, title: "Magnetism & Induction", description: "Explore magnetism and electromagnetic induction.", lesson: "Magnetism & Induction", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 29, game_number: 9, title: "Optics & Light", description: "Study light behavior, lenses, and optical instruments.", lesson: "Optics & Light Behavior", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 30, game_number: 10, title: "Modern Physics & Cosmology", description: "Explore relativity, quantum mechanics, and cosmology.", lesson: "Modern Physics & Cosmology", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "AP Environmental Science": [
      { id: 31, game_number: 1, title: "Foundations & History of Life", description: "Explore Earth's history and early life forms.", lesson: "Foundations & The History of Life", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 32, game_number: 2, title: "Plant Biology & Evolution", description: "Study photosynthesis and plant evolution.", lesson: "Plant Biology & Evolution", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 33, game_number: 3, title: "Botany - Reproduction", description: "Learn plant reproduction and sensory mechanisms.", lesson: "Botany - Reproduction & Senses", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 34, game_number: 4, title: "Zoology - Insects to Reptiles", description: "Study animal diversity from insects to mammals.", lesson: "Zoology - Insects to Reptiles", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 35, game_number: 5, title: "Zoology - Behavior & Interaction", description: "Explore animal behavior and ecological interactions.", lesson: "Zoology - Behavior & Interaction", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 36, game_number: 6, title: "Ecology - Populations", description: "Analyze population dynamics and community interactions.", lesson: "Ecology - Populations & Growth", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 37, game_number: 7, title: "Ecology - Ecosystems & Cycles", description: "Study energy flows and nutrient cycling.", lesson: "Ecology - Ecosystems & Cycles", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 38, game_number: 8, title: "Biomes & Biodiversity", description: "Understand global biomes and conservation.", lesson: "Biomes & Biodiversity", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 39, game_number: 9, title: "The Future of Life", description: "Explore evolution, speciation, and taxonomy.", lesson: "The Future of Life", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 40, game_number: 10, title: "Capstone: Synthesis & Review", description: "Synthesize all concepts and comprehensive review.", lesson: "Capstone: Synthesis & Review", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "Economics": [
      { id: 41, game_number: 1, title: "The Foundation of Choice", description: "Learn basics of supply, demand, and economic systems.", lesson: "The Foundation of Choice", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 42, game_number: 2, title: "Measuring Economic Health", description: "Understand GDP, inflation, and economic growth.", lesson: "Measuring Economic Health", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 43, game_number: 3, title: "Government & Fiscal Policy", description: "Explore taxes, spending, and government stimulus.", lesson: "Government & Fiscal Policy", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 44, game_number: 4, title: "Money, Banking & The Fed", description: "Study monetary policy and financial institutions.", lesson: "Money, Banking & The Fed", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 45, game_number: 5, title: "Global Markets & Trade", description: "Analyze international trade and exchange rates.", lesson: "Global Markets & Trade", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 46, game_number: 6, title: "Microeconomics - Firms & Costs", description: "Learn about markets, costs, and pricing strategies.", lesson: "Microeconomics - Firms & Costs", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 47, game_number: 7, title: "Competition & Market Structures", description: "Study monopolies, competition, and market behavior.", lesson: "Competition & Market Structures", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 48, game_number: 8, title: "Inequality & Human Welfare", description: "Examine inequality, education, and healthcare economics.", lesson: "Inequality & Human Welfare", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 49, game_number: 9, title: "Behavioral Econ & Data", description: "Explore behavioral economics and statistical analysis.", lesson: "Behavioral Econ & Data", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 50, game_number: 10, title: "The Future of the Global Economy", description: "Analyze automation, development, and future trends.", lesson: "The Future of the Global Economy", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "History": [
      { id: 51, game_number: 1, title: "Ancient Roots & Natural Philosophy", description: "Explore ancient scientific thought and natural philosophy.", lesson: "Ancient Roots & Natural Philosophy", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 52, game_number: 2, title: "The Scientific Revolution Begins", description: "Study the Renaissance and early scientific revolution.", lesson: "The Scientific Revolution Begins", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 53, game_number: 3, title: "Physics, Light & Gravity", description: "Learn about Galileo, Kepler, Newton, and optics.", lesson: "Physics, Light & Gravity", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 54, game_number: 4, title: "Chemistry & The Unseen World", description: "Explore alchemists, gases, and atomic theory.", lesson: "Chemistry & The Unseen World", base_reward: 120, coin_cost: 40, difficulty: "Medium" },
      { id: 55, game_number: 5, title: "Biology, Life & Deep Time", description: "Study cell theory, geology, and evolution.", lesson: "Biology, Life & Deep Time", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 56, game_number: 6, title: "Medicine & The Human Body", description: "Learn germ theory, vaccines, genetics, and DNA.", lesson: "Medicine & The Human Body", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 57, game_number: 7, title: "Electricity & Thermodynamics", description: "Explore electromagnetism and heat science.", lesson: "Electricity & Thermodynamics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 58, game_number: 8, title: "The Modern Physics Revolution", description: "Study relativity, quantum mechanics, and particle physics.", lesson: "The Modern Physics Revolution", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 59, game_number: 9, title: "Information & The Digital Age", description: "Trace computing, internet, and AI history.", lesson: "Information & The Digital Age", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 60, game_number: 10, title: "Science in the 21st Century", description: "Explore climate, space exploration, and modern science.", lesson: "Science in the 21st Century", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "AP Human Geography": [
      { id: 61, game_number: 1, title: "Tools of the Geographer", description: "Learn geography tools, GIS, maps, and projections.", lesson: "Tools of the Geographer", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 62, game_number: 2, title: "Earth's Tectonic & Surface Systems", description: "Explore plate tectonics, landforms, and soils.", lesson: "Earth's Tectonic & Surface Systems", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 63, game_number: 3, title: "Atmosphere, Climate & Change", description: "Study atmosphere, climate, and global biomes.", lesson: "Atmosphere, Climate & Change", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 64, game_number: 4, title: "The Hydrosphere & Moving Water", description: "Learn about water systems, rivers, glaciers, and oceans.", lesson: "The Hydrosphere & Moving Water", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 65, game_number: 5, title: "Biogeography & Land Use", description: "Study ecosystems, conservation, and agriculture.", lesson: "Biogeography & Land Use", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 66, game_number: 6, title: "Human Population & Movement", description: "Explore demographics, migration, and urbanization.", lesson: "Human Population & Movement", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 67, game_number: 7, title: "Cultural & Social Geography", description: "Analyze cultural landscapes, language, and identity.", lesson: "Cultural & Social Geography", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 68, game_number: 8, title: "Political Geography & Power", description: "Study geopolitics, borders, and colonialism.", lesson: "Political Geography & Power", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 69, game_number: 9, title: "Economic Geography & Development", description: "Examine supply chains, development, and inequality.", lesson: "Economic Geography & Development", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 70, game_number: 10, title: "Urban Environments & The Future", description: "Explore cities, urban planning, and smart cities.", lesson: "Urban Environments & The Future", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
    ],
    "AP Psychology": [
      { id: 71, game_number: 1, title: "Intro & Research Methods", description: "Learn psychology fundamentals and research approaches.", lesson: "Intro & Research Methods", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 72, game_number: 2, title: "Sensation & Perception", description: "Understand sensory systems and perception processes.", lesson: "Sensation & Perception", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 73, game_number: 3, title: "Sleep, Altered States & Genetics", description: "Explore sleep, consciousness, and epigenetics.", lesson: "Sleep, Altered States & Genetics", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 74, game_number: 4, title: "Development & Growth", description: "Study childhood, adolescence, and adult development.", lesson: "Development & Growth", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 75, game_number: 5, title: "Learning & Memory", description: "Learn conditioning, memory processes, and cognition.", lesson: "Learning & Memory", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 76, game_number: 6, title: "Language, Intelligence & Emotion", description: "Study language, IQ, bias, and emotional processes.", lesson: "Language, Intelligence & Emotion", base_reward: 480, coin_cost: 160, difficulty: "Hard" },
      { id: 77, game_number: 7, title: "Stress & Personality", description: "Examine stress effects and personality theories.", lesson: "Stress & Personality", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 78, game_number: 8, title: "Disorders & Treatment Part 1", description: "Learn anxiety, mood, and trauma disorders.", lesson: "Disorders & Treatment Part 1", base_reward: 1920, coin_cost: 640, difficulty: "Hard" },
      { id: 79, game_number: 9, title: "Disorders & Treatment Part 2", description: "Study psychotic, eating, and personality disorders.", lesson: "Disorders & Treatment Part 2", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 80, game_number: 10, title: "Social Psychology & Influence", description: "Explore social thinking, influence, and prejudice.", lesson: "Social Psychology & Influence", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
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
        { answer: "organelle1", term: "Mitochondria", definition: "Produces ATP through aerobic respiration - energy source for cells" },
        { answer: "organelle2", term: "Nucleus", definition: "Contains DNA and controls all cellular activities and genes" },
        { answer: "organelle3", term: "Chloroplast", definition: "Site of photosynthesis converting sunlight to glucose in plant cells" },
        { answer: "organelle4", term: "Ribosome", definition: "Synthesizes proteins using mRNA instructions" },
        { answer: "organelle5", term: "Golgi Apparatus", definition: "Modifies, packages and ships proteins to destinations" },
      ]
    },
    2: {
      type: "quiz",
      title: "Photosynthesis Puzzle",
      description: "Test your knowledge of photosynthesis and light/dark reactions",
      questions: [
        {
          question: "What is the overall equation for photosynthesis?",
          options: ["6CO₂ + H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + H₂O", "6C + 6H → 6CH", "Light energy → Glucose"],
          correct: 0,
          explanation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂"
        },
        {
          question: "Where do the light-dependent reactions occur?",
          options: ["Stroma", "Thylakoid membranes", "Mitochondria", "Cell nucleus"],
          correct: 1,
          explanation: "Light reactions occur in thylakoid membranes where photosystems capture light"
        },
        {
          question: "What is the Calvin Cycle (dark reaction)?",
          options: ["Light absorption", "Glucose synthesis using ATP and NADPH", "CO₂ release", "Water splitting"],
          correct: 1,
          explanation: "Calvin Cycle uses ATP and NADPH from light reactions to synthesize glucose"
        },
        {
          question: "What is the primary pigment in photosynthesis?",
          options: ["Xanthophyll", "Chlorophyll", "Carotenoid", "Hemoglobin"],
          correct: 1,
          explanation: "Chlorophyll absorbs light energy, primarily red and blue wavelengths"
        },
        {
          question: "What happens to glucose made in photosynthesis?",
          options: ["Released as gas", "Used for plant energy and growth", "Stored as starch", "All of the above"],
          correct: 3,
          explanation: "Glucose is used immediately for energy, stored as starch, or used for growth"
        }
      ]
    },
    3: {
      type: "matching",
      title: "Evolution Match",
      description: "Connect species to their evolutionary adaptations explained by natural selection",
      matchPairs: [
        { answer: "adapt1", term: "Giraffe long neck", definition: "Adaptation to reach high tree leaves in African savannas" },
        { answer: "adapt2", term: "Camel humps", definition: "Store fat for energy reserves during desert droughts" },
        { answer: "adapt3", term: "Arctic fox white fur", definition: "Camouflage adaptation for survival in snowy environments" },
        { answer: "adapt4", term: "Cheetah speed", definition: "Burst speed adaptation for hunting fast prey on plains" },
        { answer: "adapt5", term: "Chameleon color change", definition: "Cryptic coloration for predator avoidance and prey capture" },
      ]
    },
    4: {
      type: "quiz",
      title: "Genetics Inheritance",
      description: "Master Punnett squares and Mendelian inheritance patterns",
      questions: [
        {
          question: "If a parent is Aa and the other is aa, what percentage of offspring will be homozygous?",
          options: ["0%", "25%", "50%", "75%"],
          correct: 2,
          explanation: "Aa × aa produces 50% Aa (heterozygous) and 50% aa (homozygous)"
        },
        {
          question: "In a cross between Aa × Aa, what ratio produces the phenotype 3:1?",
          options: ["Genotypic ratio", "Phenotypic ratio for dominant vs recessive", "All dominant", "All recessive"],
          correct: 1,
          explanation: "Aa × Aa = 1 AA : 2 Aa : 1 aa = 3 dominant : 1 recessive phenotype"
        },
        {
          question: "What is the difference between genotype and phenotype?",
          options: ["Genotype is visible, phenotype is hidden", "Genotype is genetic makeup, phenotype is observable traits", "Same thing", "Genotype is dominant only"],
          correct: 1,
          explanation: "Genotype (AA, Aa, aa) is what genes you have; phenotype is what you observe"
        },
        {
          question: "What is a test cross used for?",
          options: ["Test dominant traits", "Determine genotype of dominant phenotype organism", "Cure genetic disorders", "Change alleles"],
          correct: 1,
          explanation: "Test cross with homozygous recessive reveals if organism is homozygous or heterozygous"
        },
        {
          question: "What is incomplete dominance?",
          options: ["No dominant allele", "Heterozygote shows intermediate phenotype between parents", "Only recessive shows", "Both alleles equally dominant"],
          correct: 1,
          explanation: "Incomplete dominance: Aa produces phenotype between AA and aa (e.g., red × white = pink)"
        }
      ]
    },
    5: {
      type: "matching",
      title: "DNA Sequencer",
      description: "Match DNA base pairs - understand complementary base pairing in DNA structure",
      matchPairs: [
        { answer: "pair1", term: "Adenine (A) pairs with", definition: "Thymine (T) - 2 hydrogen bonds" },
        { answer: "pair2", term: "Guanine (G) pairs with", definition: "Cytosine (C) - 3 hydrogen bonds" },
        { answer: "pair3", term: "DNA strand direction", definition: "5' to 3' and 3' to 5' (antiparallel)" },
        { answer: "pair4", term: "Double helix structure", definition: "Two complementary strands wound around sugar-phosphate backbone" },
        { answer: "pair5", term: "DNA replication result", definition: "Two identical DNA molecules, each with one old and one new strand" },
      ]
    },
    6: {
      type: "quiz",
      title: "Ecology & Ecosystems",
      description: "Understand energy flow, food chains, and ecosystem roles",
      questions: [
        {
          question: "What role do producers play in an ecosystem?",
          options: ["Consume other organisms", "Convert sunlight to chemical energy via photosynthesis", "Break down dead matter", "Control predators"],
          correct: 1,
          explanation: "Producers (plants) convert solar energy into glucose, the energy base for all ecosystems"
        },
        {
          question: "In a food chain grass → rabbit → fox, what is the rabbit?",
          options: ["Producer", "Primary consumer (herbivore)", "Secondary consumer (carnivore)", "Decomposer"],
          correct: 1,
          explanation: "Primary consumers eat producers; secondary consumers eat primary consumers"
        },
        {
          question: "What happens to energy as it moves up trophic levels?",
          options: ["Increases", "Decreases by ~10% (90% used for metabolism)", "Stays the same", "Is released as heat only"],
          correct: 1,
          explanation: "Energy decreases ~90% per level; only 10% stored as biomass for next level"
        },
        {
          question: "What role do decomposers play?",
          options: ["Eat consumers", "Break down dead organisms and recycle nutrients back to soil", "Produce energy", "Compete with producers"],
          correct: 1,
          explanation: "Decomposers (bacteria, fungi) recycle nutrients essential for ecosystem cycling"
        },
        {
          question: "What is biodiversity and why is it important?",
          options: ["Number of species in one location", "Variety of genetic and species diversity for ecosystem stability", "Size of organisms", "Age of ecosystem"],
          correct: 1,
          explanation: "Biodiversity increases resilience, stability, and ecosystem function"
        }
      ]
    },
    7: {
      type: "memory",
      title: "Population Dynamics",
      description: "Match population growth factors and limiting factors",
      pairs: [
        { term: "Exponential growth", answer: "pop1" },
        { term: "J-shaped curve with unlimited resources", answer: "pop1" },
        { term: "Logistic growth", answer: "pop2" },
        { term: "S-shaped curve limited by carrying capacity", answer: "pop2" },
        { term: "Carrying capacity", answer: "pop3" },
        { term: "Maximum population size environment can sustain", answer: "pop3" },
      ]
    },
    8: {
      type: "dragdrop",
      title: "Human Body Systems",
      description: "Identify major organs and their body system locations",
      items: [
        { id: "item1", name: "Heart", correctZone: "circulatory" },
        { id: "item2", name: "Lungs", correctZone: "respiratory" },
        { id: "item3", name: "Brain", correctZone: "nervous" },
        { id: "item4", name: "Liver", correctZone: "digestive" },
        { id: "item5", name: "Stomach", correctZone: "digestive" },
      ],
      zones: [
        { id: "nervous", label: "Nervous System" },
        { id: "circulatory", label: "Circulatory System" },
        { id: "respiratory", label: "Respiratory System" },
        { id: "digestive", label: "Digestive System" },
      ]
    },
    9: {
      type: "quiz",
      title: "Immune System & Disease",
      description: "Understand how immune cells fight infections and maintain health",
      questions: [
        {
          question: "What is the first line of defense against pathogens?",
          options: ["White blood cells", "Skin and mucous membranes", "Antibodies", "Lymph nodes"],
          correct: 1,
          explanation: "Skin, saliva, mucus are physical/chemical barriers to prevent pathogen entry"
        },
        {
          question: "What do antibodies do?",
          options: ["Kill pathogens directly", "Recognize and mark pathogens for destruction", "Produce white blood cells", "Heal wounds"],
          correct: 1,
          explanation: "Antibodies tag pathogens; immune cells recognize and eliminate them"
        },
        {
          question: "What is the difference between innate and adaptive immunity?",
          options: ["Same thing", "Innate is immediate general response; adaptive is specific learned response", "Only one exists", "No difference"],
          correct: 1,
          explanation: "Innate: immediate, non-specific (fever, inflammation); Adaptive: specific, memory-based"
        },
        {
          question: "How do vaccinations work?",
          options: ["Kill all pathogens", "Introduce harmless pathogen material to build immune memory", "Replace immune system", "Prevent infection 100%"],
          correct: 1,
          explanation: "Vaccines prime adaptive immunity; antibodies and memory cells respond faster if exposed"
        },
        {
          question: "What happens in an allergic reaction?",
          options: ["Infection occurs", "Immune system overreacts to harmless substance", "No immune response", "Pathogen wins"],
          correct: 1,
          explanation: "Allergies: immune cells release histamine in excessive response to safe allergens"
        }
      ]
    },
    10: {
      type: "matching",
      title: "Classification & Taxonomy",
      description: "Match organisms to their taxonomic classification levels",
      matchPairs: [
        { answer: "tax1", term: "Kingdom", definition: "Broadest category: Animals, Plants, Fungi, Protists, Bacteria" },
        { answer: "tax2", term: "Phylum", definition: "Groups organisms by major body structures (Chordata, Arthropoda)" },
        { answer: "tax3", term: "Class", definition: "Groups organisms by characteristics (Mammalia, Reptilia, Aves)" },
        { answer: "tax4", term: "Species", definition: "Narrowest category: organisms that can breed and produce fertile offspring" },
        { answer: "tax5", term: "Binomial nomenclature", definition: "Scientific naming: Genus species (e.g., Homo sapiens)" },
      ]
    },

    // CHEMISTRY GAMES (11-20)
    11: {
      type: "quiz",
      title: "Atomic Structure & Periodic Table",
      description: "Master atomic structure, periodic trends, and element properties",
      questions: [
        {
          question: "What are the three main subatomic particles?",
          options: ["Atoms, molecules, ions", "Protons, neutrons, electrons", "Quarks, gluons, photons", "Nucleus, shell, orbital"],
          correct: 1,
          explanation: "Protons (positive, nucleus), neutrons (neutral, nucleus), electrons (negative, shells)"
        },
        {
          question: "What is the atomic number?",
          options: ["Mass of nucleus", "Number of protons (defines the element)", "Number of neutrons", "Total particle count"],
          correct: 1,
          explanation: "Atomic number = # protons = # electrons in neutral atom; defines element identity"
        },
        {
          question: "What does the periodic table group (vertical column) tell you?",
          options: ["Atomic mass", "Number of electron shells", "Number of valence electrons - similar chemical properties", "Radioactivity"],
          correct: 2,
          explanation: "Same group = same # valence electrons = similar reactivity and bonding behavior"
        },
        {
          question: "What is an isotope?",
          options: ["Different element", "Same element with different # neutrons", "Different charge", "Excited atom"],
          correct: 1,
          explanation: "Isotopes: same atomic # (protons), different mass # (neutrons); Carbon-12 vs Carbon-14"
        },
        {
          question: "What trend occurs left to right across a period?",
          options: ["Ionization energy decreases", "Ionization energy increases", "All atoms same size", "No trend exists"],
          correct: 1,
          explanation: "Across period: atoms get smaller, more negative, ionization energy increases"
        }
      ]
    },
    12: {
      type: "memory",
      title: "Electron Configuration & Energy Levels",
      description: "Match electrons to energy levels, orbitals, and quantum states",
      pairs: [
        { term: "Valence electrons", answer: "elec1" },
        { term: "Outermost shell electrons involved in bonding", answer: "elec1" },
        { term: "s orbital", answer: "elec2" },
        { term: "Spherical shape, holds maximum 2 electrons", answer: "elec2" },
        { term: "p orbital", answer: "elec3" },
        { term: "Dumbbell shape, holds maximum 6 electrons", answer: "elec3" },
      ]
    },
    13: {
      type: "quiz",
      title: "Chemical Bonding",
      description: "Understand ionic, covalent, and metallic bonds",
      questions: [
        {
          question: "In an ionic bond, what happens to electrons?",
          options: ["Shared equally", "Transferred from metal to nonmetal", "Split in half", "Shared unequally"],
          correct: 1,
          explanation: "Ionic: electron transfer; metal loses to nonmetal; opposite charges attract"
        },
        {
          question: "What is a covalent bond?",
          options: ["Electrons transferred", "Electrons shared between atoms", "Metal attraction", "Weak intermolecular force"],
          correct: 1,
          explanation: "Covalent: nonmetals share electron pairs in orbitals"
        },
        {
          question: "What is electronegativity?",
          options: ["Negative charge", "Ability to attract electrons in a bond", "Ionic charge", "Orbital size"],
          correct: 1,
          explanation: "Electronegativity difference: large = ionic, small = covalent, polar covalent"
        },
        {
          question: "What is a polar covalent bond?",
          options: ["Equal sharing", "Unequal sharing due to electronegativity difference", "Ionic bond", "No bond"],
          correct: 1,
          explanation: "Polar covalent: electrons shared but closer to more electronegative atom (δ+ and δ-)"
        },
        {
          question: "What is a coordinate covalent bond?",
          options: ["Ionic bond", "Both electrons from same atom but shared", "Metallic bond", "No bonding"],
          correct: 1,
          explanation: "Coordinate: one atom donates both electrons of the shared pair"
        }
      ]
    },
    14: {
      type: "matching",
      title: "Molecular Geometry & Structure",
      description: "Match molecules to their shapes based on VSEPR theory",
      matchPairs: [
        { answer: "shape1", term: "H₂O (water)", definition: "Bent/angular with 104.5° bond angle due to 2 lone pairs" },
        { answer: "shape2", term: "CO₂ (carbon dioxide)", definition: "Linear with 180° bond angle, nonpolar despite polar bonds" },
        { answer: "shape3", term: "NH₃ (ammonia)", definition: "Trigonal pyramidal with 107° due to 1 lone pair on N" },
        { answer: "shape4", term: "CH₄ (methane)", definition: "Tetrahedral with 109.5° bond angles, nonpolar symmetrical" },
        { answer: "shape5", term: "PCl₅ (phosphorus pentachloride)", definition: "Trigonal bipyramidal, P with 5 bonding pairs" },
      ]
    },
    15: {
      type: "quiz",
      title: "Chemical Reactions & Balancing",
      description: "Master equation balancing and reaction types",
      questions: [
        {
          question: "Why do we balance chemical equations?",
          options: ["Makes prettier format", "Satisfies law of conservation of mass - same atoms on both sides", "Required by law", "Speeds up reaction"],
          correct: 1,
          explanation: "Balanced equations show conservation of atoms/mass during reactions"
        },
        {
          question: "What is a synthesis reaction?",
          options: ["Breakdown", "Two or more reactants combine to form one product (A + B → AB)", "Displacement", "Combustion"],
          correct: 1,
          explanation: "Synthesis: 2 or more substances combine into 1 compound"
        },
        {
          question: "What is a decomposition reaction?",
          options: ["Combination", "One compound breaks into two or more substances (AB → A + B)", "Exchange", "Combustion"],
          correct: 1,
          explanation: "Decomposition: 1 substance breaks into 2+ simpler substances"
        },
        {
          question: "What is combustion?",
          options: ["Synthesis", "Reaction with O₂ producing heat and light, usually CO₂ and H₂O", "Decomposition", "Oxidation only"],
          correct: 1,
          explanation: "Combustion: hydrocarbon + O₂ → CO₂ + H₂O + heat (exothermic)"
        },
        {
          question: "In 2H₂ + O₂ → 2H₂O, what is the mole ratio of reactants?",
          options: ["1:1", "2:1", "1:2", "3:2"],
          correct: 1,
          explanation: "Coefficients show molar ratios: 2 moles H₂ for every 1 mole O₂"
        }
      ]
    },
    16: {
      type: "quiz",
      title: "Stoichiometry & Moles",
      description: "Master mole calculations and chemical stoichiometry",
      questions: [
        {
          question: "What is Avogadro's Number?",
          options: ["1 million", "6.02 × 10²³ particles per mole", "Atomic mass number", "Temperature scale"],
          correct: 1,
          explanation: "6.02 × 10²³ = number of atoms/molecules in 1 mole"
        },
        {
          question: "How many moles in 36 grams of H₂O (molar mass = 18 g/mol)?",
          options: ["2 moles", "18 moles", "36 moles", "54 moles"],
          correct: 0,
          explanation: "moles = mass/molar mass = 36g ÷ 18 g/mol = 2 moles"
        },
        {
          question: "In the reaction 2H₂ + O₂ → 2H₂O, how many moles of H₂O form from 3 moles O₂?",
          options: ["2 moles", "3 moles", "6 moles", "1.5 moles"],
          correct: 2,
          explanation: "Mole ratio: 1 O₂ : 2 H₂O, so 3 mol O₂ × (2 H₂O/1 O₂) = 6 mol H₂O"
        },
        {
          question: "What is molar mass?",
          options: ["Mass of atom", "Sum of atomic masses of all atoms in a compound (in g/mol)", "Molarity only", "Density"],
          correct: 1,
          explanation: "Molar mass: sum of atomic masses; H₂O = 2(1) + 16 = 18 g/mol"
        },
        {
          question: "What is the relationship between moles, atoms, and grams?",
          options: ["No relationship", "moles = grams/molar mass; atoms = moles × 6.02×10²³", "Random", "Only for metals"],
          correct: 1,
          explanation: "Conversion factors: grams ↔ moles ↔ particles (atoms/molecules)"
        }
      ]
    },
    17: {
      type: "matching",
      title: "Acids, Bases & pH",
      description: "Match acid/base properties and understand pH scale",
      matchPairs: [
        { answer: "acid1", term: "Acidic solution", definition: "pH < 7, [H⁺] > [OH⁻], tastes sour, turns litmus red" },
        { answer: "acid2", term: "Basic (alkaline) solution", definition: "pH > 7, [H⁺] < [OH⁻], slippery, turns litmus blue" },
        { answer: "acid3", term: "Neutral solution", definition: "pH = 7, [H⁺] = [OH⁻] = 10⁻⁷ M (pure water at 25°C)" },
        { answer: "acid4", term: "Strong acid example", definition: "HCl completely dissociates: HCl → H⁺ + Cl⁻" },
        { answer: "acid5", term: "Weak acid example", definition: "Acetic acid partially dissociates: CH₃COOH ⇌ CH₃COO⁻ + H⁺" },
      ]
    },
    18: {
      type: "memory",
      title: "Redox & Electrochemistry",
      description: "Match oxidation states and identify redox reactions",
      pairs: [
        { term: "Oxidation", answer: "redox1" },
        { term: "Loss of electrons, increase in oxidation state", answer: "redox1" },
        { term: "Reduction", answer: "redox2" },
        { term: "Gain of electrons, decrease in oxidation state", answer: "redox2" },
        { term: "Redox reaction", answer: "redox3" },
        { term: "Electron transfer between reactants", answer: "redox3" },
      ]
    },
    19: {
      type: "quiz",
      title: "Thermochemistry & Energy",
      description: "Understand energy changes in chemical reactions",
      questions: [
        {
          question: "What is an exothermic reaction?",
          options: ["Absorbs heat", "Releases heat energy to surroundings (ΔH negative)", "No energy change", "Endothermic"],
          correct: 1,
          explanation: "Exothermic: ΔH < 0, products have less energy than reactants (combustion, freezing)"
        },
        {
          question: "What is an endothermic reaction?",
          options: ["Releases heat", "Absorbs heat from surroundings (ΔH positive)", "Exothermic", "No change"],
          correct: 1,
          explanation: "Endothermic: ΔH > 0, requires energy input (melting ice, photosynthesis)"
        },
        {
          question: "What is enthalpy (ΔH)?",
          options: ["Disorder", "Heat energy released or absorbed at constant pressure", "Temperature", "Entropy"],
          correct: 1,
          explanation: "ΔH = energy change; negative = exothermic, positive = endothermic"
        },
        {
          question: "What is activation energy?",
          options: ["Total reaction energy", "Minimum energy needed to start reaction", "Heat released", "Bond breaking energy"],
          correct: 1,
          explanation: "Activation energy (Ea) is the barrier; catalysts lower it without changing ΔH"
        },
        {
          question: "How does a catalyst affect a reaction?",
          options: ["Increases ΔH", "Lowers activation energy, increases reaction rate, unchanged ΔH", "Decreases products", "Changes product"],
          correct: 1,
          explanation: "Catalysts provide alternative pathway with lower Ea; not consumed, reusable"
        }
      ]
    },
    20: {
      type: "matching",
      title: "Reaction Kinetics",
      description: "Match factors that affect reaction rates",
      matchPairs: [
        { answer: "kin1", term: "Increased temperature", definition: "Increases reaction rate by increasing molecular collisions and energy" },
        { answer: "kin2", term: "Catalyst", definition: "Lowers activation energy, increases rate without being consumed" },
        { answer: "kin3", term: "Increased concentration", definition: "More particles per volume increases collision frequency and rate" },
        { answer: "kin4", term: "Increased surface area", definition: "More particle contact surface speeds up reaction rate" },
        { answer: "kin5", term: "Pressure (gases)", definition: "Increased pressure increases concentration and collision frequency" },
      ]
    },

    // PHYSICS GAMES (21-30)
    21: {
      type: "quiz",
      title: "Forces & Newton's Laws",
      description: "Master Newton's three laws of motion",
      questions: [
        {
          question: "What does Newton's First Law state?",
          options: ["F = ma", "Object at rest stays at rest; object in motion stays in motion unless force acts", "Gravity always attracts", "Energy is conserved"],
          correct: 1,
          explanation: "First Law (Inertia): no net force = no acceleration; velocity remains constant"
        },
        {
          question: "What does Newton's Second Law state?",
          options: ["Inertia rule", "F = ma (Force = mass × acceleration)", "Action-reaction", "Gravity constant"],
          correct: 1,
          explanation: "Second Law: Net force causes acceleration proportional to force, inverse to mass"
        },
        {
          question: "What does Newton's Third Law state?",
          options: ["Objects stay in motion", "For every action, equal opposite reaction occurs", "Forces always balance", "No such thing"],
          correct: 1,
          explanation: "Third Law: Forces always come in pairs; pushing floor pushes you up"
        },
        {
          question: "What is the SI unit of force?",
          options: ["kg", "m/s", "Newton (N)", "J/m"],
          correct: 2,
          explanation: "1 Newton = 1 kg⋅m/s² (force to accelerate 1 kg at 1 m/s²)"
        },
        {
          question: "What is weight?",
          options: ["Same as mass", "Force of gravity on object: W = mg", "Density × volume", "Always constant"],
          correct: 1,
          explanation: "Weight is gravitational force (varies with g); mass is constant"
        }
      ]
    },
    22: {
      type: "matching",
      title: "Motion & Kinematics",
      description: "Match kinematic equations to their uses",
      matchPairs: [
        { answer: "kin1", term: "v = u + at", definition: "Find final velocity with constant acceleration" },
        { answer: "kin2", term: "s = ut + ½at²", definition: "Find displacement with constant acceleration" },
        { answer: "kin3", term: "v² = u² + 2as", definition: "Find velocity without time, using displacement" },
        { answer: "kin4", term: "s = (u + v)t/2", definition: "Find displacement using average velocity" },
        { answer: "kin5", term: "a = Δv/Δt", definition: "Find acceleration from velocity change over time" },
      ]
    },
    23: {
      type: "quiz",
      title: "Work, Energy & Power",
      description: "Master energy concepts and energy transformations",
      questions: [
        {
          question: "What is kinetic energy?",
          options: ["Stored energy", "Energy of motion: KE = ½mv²", "Gravitational energy", "Heat only"],
          correct: 1,
          explanation: "KE depends on mass and velocity; faster objects have more KE"
        },
        {
          question: "What is potential energy?",
          options: ["Motion energy", "Stored energy due to position: PE = mgh (gravitational)", "Kinetic only", "Temperature"],
          correct: 1,
          explanation: "PE increases with height; converted to KE when object falls"
        },
        {
          question: "What is the Law of Conservation of Energy?",
          options: ["Energy decreases", "Total energy stays constant; transforms between forms", "Energy created", "Heat loss only"],
          correct: 1,
          explanation: "E_total = KE + PE + other = constant (friction/heat = energy lost from system)"
        },
        {
          question: "What is work?",
          options: ["Effort expended", "Force applied through distance: W = F⋅d⋅cos(θ)", "Energy spent", "Friction force"],
          correct: 1,
          explanation: "Work = Force × displacement × cos(angle between them)"
        },
        {
          question: "What is power?",
          options: ["Force strength", "Rate of work done: P = W/t (in Watts)", "Energy amount", "Velocity"],
          correct: 1,
          explanation: "Power = Work/time; 1 Watt = 1 Joule/second"
        }
      ]
    },
    24: {
      type: "matching",
      title: "Momentum & Collisions",
      description: "Understand momentum conservation in collisions",
      matchPairs: [
        { answer: "mom1", term: "Momentum", definition: "p = mv (mass × velocity), vector quantity" },
        { answer: "mom2", term: "Impulse", definition: "Change in momentum: J = F⋅Δt = Δ(mv)" },
        { answer: "mom3", term: "Elastic collision", definition: "Kinetic energy conserved, objects bounce apart" },
        { answer: "mom4", term: "Inelastic collision", definition: "KE not conserved, objects stick together or deform" },
        { answer: "mom5", term: "Conservation of momentum", definition: "Total momentum before = total after (no external forces)" },
      ]
    },
    25: {
      type: "quiz",
      title: "Circular Motion & Gravity",
      description: "Master circular motion and gravitational forces",
      questions: [
        {
          question: "What is centripetal acceleration?",
          options: ["Away from center", "Directed toward center: a_c = v²/r", "Constant velocity", "Gravity effect"],
          correct: 1,
          explanation: "Centripetal acceleration = v²/r, always points toward center of circle"
        },
        {
          question: "What is centripetal force?",
          options: ["Outward force", "Inward force needed for circular motion: F_c = mv²/r", "Gravity", "Friction"],
          correct: 1,
          explanation: "Centripetal force keeps object moving in circle (tension, gravity, normal force)"
        },
        {
          question: "What is angular velocity?",
          options: ["Linear speed", "Rate of angle change: ω = θ/t (rad/s)", "Centripetal force", "Period"],
          correct: 1,
          explanation: "Angular velocity (rad/s) related to linear: v = ωr"
        },
        {
          question: "What is Newton's Law of Universal Gravitation?",
          options: ["Weight equals mass", "F = G(m₁m₂)/r² (attractive force between masses)", "Only on Earth", "Constant force"],
          correct: 1,
          explanation: "Gravitational force proportional to masses, inversely proportional to distance squared"
        },
        {
          question: "What is orbital velocity?",
          options: ["Escape velocity", "Speed needed to stay in circular orbit: v = √(GM/r)", "Free fall", "Terminal velocity"],
          correct: 1,
          explanation: "Orbital velocity: centripetal force = gravitational force"
        }
      ]
    },
    26: {
      type: "matching",
      title: "Waves & Sound",
      description: "Match wave properties and behaviors",
      matchPairs: [
        { answer: "wave1", term: "Wavelength (λ)", definition: "Distance between consecutive crests or troughs" },
        { answer: "wave2", term: "Frequency (f)", definition: "Number of waves per second (Hz), inverse of period" },
        { answer: "wave3", term: "Amplitude", definition: "Maximum displacement from equilibrium; affects intensity" },
        { answer: "wave4", term: "Wave speed", definition: "v = fλ (frequency × wavelength)" },
        { answer: "wave5", term: "Doppler effect", definition: "Frequency changes when sound source moves relative to observer" },
      ]
    },
    27: {
      type: "quiz",
      title: "Light & Optics",
      description: "Master light properties, reflection, and refraction",
      questions: [
        {
          question: "What is the speed of light in vacuum?",
          options: ["1 m/s", "3 × 10⁸ m/s", "Cannot be determined", "Varies with frequency"],
          correct: 1,
          explanation: "Speed of light (c) ≈ 3 × 10⁸ m/s; constant in vacuum, slows in media"
        },
        {
          question: "What is the law of reflection?",
          options: ["Light disappears", "Angle of incidence = angle of reflection from surface", "Light bends", "No angle relationship"],
          correct: 1,
          explanation: "Reflected ray and incident ray make same angle with normal"
        },
        {
          question: "What is refraction?",
          options: ["Bouncing off surface", "Bending of light entering different medium (different speed)", "Absorption", "Dispersion only"],
          correct: 1,
          explanation: "Refraction occurs because light travels at different speeds in different media"
        },
        {
          question: "What is Snell's Law?",
          options: ["Light angle", "n₁sin(θ₁) = n₂sin(θ₂) relating refraction to refractive indices", "Reflection law", "Color property"],
          correct: 1,
          explanation: "Snell's Law predicts how light bends at medium boundaries"
        },
        {
          question: "What is the refractive index?",
          options: ["Color identifier", "Ratio n = c/v (speed of light in vacuum/medium)", "Angle measure", "Brightness scale"],
          correct: 1,
          explanation: "Higher refractive index = slower light speed in medium; glass n≈1.5, water n≈1.33"
        }
      ]
    },
    28: {
      type: "matching",
      title: "Electricity & Circuits",
      description: "Match electrical concepts and circuit properties",
      matchPairs: [
        { answer: "elec1", term: "Current (I)", definition: "Flow of charge: I = Q/t (Amperes = Coulombs/second)" },
        { answer: "elec2", term: "Voltage (V)", definition: "Electric potential difference; energy per unit charge (Volts)" },
        { answer: "elec3", term: "Resistance (R)", definition: "Opposition to current flow (Ohms): R = V/I (Ohm's Law)" },
        { answer: "elec4", term: "Series circuit", definition: "Components in single path; current same, voltage divides" },
        { answer: "elec5", term: "Parallel circuit", definition: "Multiple paths; voltage same across branches, current divides" },
      ]
    },
    29: {
      type: "quiz",
      title: "Magnetism & Electromagnetism",
      description: "Master magnetic fields and electromagnetic forces",
      questions: [
        {
          question: "What are magnetic poles?",
          options: ["No such thing", "North and South; opposite poles attract, same poles repel", "Only one type", "Created by electricity"],
          correct: 1,
          explanation: "Magnetic poles cannot be separated; every magnet has N and S poles"
        },
        {
          question: "What is a magnetic field?",
          options: ["Electric field", "Region where magnetic force acts on charges/magnets", "Temperature zone", "Pressure area"],
          correct: 1,
          explanation: "Magnetic field lines show direction; denser lines = stronger field"
        },
        {
          question: "What creates a magnetic field?",
          options: ["Heat only", "Moving electric charges (current) and magnetic materials", "Static charges", "Light"],
          correct: 1,
          explanation: "Electromagnet: current-carrying wire creates magnetic field; permanent magnets have atomic currents"
        },
        {
          question: "What is the Lorentz Force?",
          options: ["Gravity only", "Force on charged particle moving in magnetic field: F = qvB", "Electrostatic only", "No force"],
          correct: 1,
          explanation: "F = qvB sin(θ); perpendicular to both velocity and field"
        },
        {
          question: "What is electromagnetic induction?",
          options: ["Magnetic field creation", "Changing magnetic flux induces electric current/voltage", "Heat production", "Light generation"],
          correct: 1,
          explanation: "Faraday's Law: changing magnetic field through coil creates induced EMF"
        }
      ]
    },
    30: {
      type: "matching",
      title: "Modern Physics & Quantum",
      description: "Match concepts in quantum mechanics and relativity",
      matchPairs: [
        { answer: "mod1", term: "Photon", definition: "Particle of light with energy E = hf (Planck's constant × frequency)" },
        { answer: "mod2", term: "Photoelectric effect", definition: "Light ejects electrons from metal; proves photons exist" },
        { answer: "mod3", term: "Wave-particle duality", definition: "Light and matter exhibit both wave and particle properties" },
        { answer: "mod4", term: "Uncertainty principle", definition: "Cannot simultaneously know position and momentum precisely" },
        { answer: "mod5", term: "E = mc²", definition: "Mass-energy equivalence; matter can become energy" },
      ]
    },

    // ENVIRONMENTAL SCIENCE GAMES (31-40)
    31: {
      type: "matching",
      title: "Biome Explorer",
      description: "Match biomes to their characteristics and locations",
      matchPairs: [
        { answer: "biome1", term: "Tropical Rainforest", definition: "Warm, wet, high biodiversity near equator; Amazon, Congo Basin" },
        { answer: "biome2", term: "Temperate Forest", definition: "Moderate climate, deciduous/coniferous trees; North America, Europe, Asia" },
        { answer: "biome3", term: "Desert", definition: "Dry, low precipitation, extreme temperatures; Sahara, Kalahari, Arabian" },
        { answer: "biome4", term: "Tundra", definition: "Arctic/Alpine, frozen soil, low vegetation; polar regions" },
        { answer: "biome5", term: "Grassland/Savanna", definition: "Grasses and scattered trees; prairies, African savanna" },
      ]
    },
    32: {
      type: "quiz",
      title: "Water Cycle Tracker",
      description: "Master the water cycle: evaporation, condensation, precipitation, collection",
      questions: [
        {
          question: "What is evaporation in the water cycle?",
          options: ["Water freezing", "Water changing from liquid to gas due to solar heat", "Water collection", "Water flowing downhill"],
          correct: 1,
          explanation: "Evaporation occurs when water from oceans, lakes, and soil becomes water vapor"
        },
        {
          question: "What is the role of condensation in the water cycle?",
          options: ["Heating water", "Water vapor changing to liquid clouds/fog", "Melting ice", "Rainfall only"],
          correct: 1,
          explanation: "Condensation occurs when water vapor cools and forms clouds"
        },
        {
          question: "What is transpiration?",
          options: ["Rainwater flow", "Water released by plant leaves through stomata", "Ocean evaporation", "Groundwater seepage"],
          correct: 1,
          explanation: "Transpiration: water absorbed by plant roots exits through leaves as vapor"
        },
        {
          question: "What is the role of precipitation in the water cycle?",
          options: ["Heat release", "Water falling from clouds as rain/snow", "Vapor creation", "Soil heating"],
          correct: 1,
          explanation: "Precipitation returns water from atmosphere to Earth's surface"
        },
        {
          question: "What percentage of Earth's water is in oceans?",
          options: ["50%", "~97% (most water is saltwater in oceans)", "75%", "10%"],
          correct: 1,
          explanation: "Oceans contain 97% of Earth's water; only 3% is freshwater"
        }
      ]
    },
    33: {
      type: "memory",
      title: "Nutrient Cycling",
      description: "Match nutrient cycles and their processes",
      pairs: [
        { term: "Carbon Cycle", answer: "nutr1" },
        { term: "CO₂ in atmosphere → plants → animals → decomposition → CO₂ released", answer: "nutr1" },
        { term: "Nitrogen Cycle", answer: "nutr2" },
        { term: "Atmospheric N₂ → soil nitrates → plants → animals → decomposition", answer: "nutr2" },
        { term: "Phosphorus Cycle", answer: "nutr3" },
        { term: "Rock weathering → soil → plants → animals → sediment → rocks", answer: "nutr3" },
      ]
    },
    34: {
      type: "quiz",
      title: "Weathering & Erosion",
      description: "Understand rock formation, weathering processes, and soil development",
      questions: [
        {
          question: "What is weathering?",
          options: ["Erosion by water", "Breaking down rocks into smaller pieces via physical/chemical/biological processes", "Soil formation only", "Wind effects only"],
          correct: 1,
          explanation: "Weathering breaks down rocks; erosion transports the broken material"
        },
        {
          question: "What is physical weathering?",
          options: ["Chemical breakdown", "Rocks broken by temperature, frost, roots without chemical change", "Biological breakdown only", "Acid rain effects"],
          correct: 1,
          explanation: "Physical weathering: rocks split by freeze-thaw cycles, root pressure, abrasion"
        },
        {
          question: "What is chemical weathering?",
          options: ["Size reduction", "Rocks altered by chemical reactions with water/acids/oxygen", "Mechanical breakdown", "Temperature change only"],
          correct: 1,
          explanation: "Chemical weathering: acid rain, oxidation, hydration dissolve rocks"
        },
        {
          question: "What is erosion?",
          options: ["Rock breakdown in place", "Transport of weathered material by water/wind/ice/gravity", "Soil creation", "Mineral formation"],
          correct: 1,
          explanation: "Erosion moves soil and sediment downhill and downstream"
        },
        {
          question: "What is soil composed of?",
          options: ["Rock only", "Minerals, organic matter, water, air, organisms", "Organic matter only", "Sand and clay only"],
          correct: 1,
          explanation: "Soil: weathered minerals (45%), organic matter (5%), water (25%), air (25%)"
        }
      ]
    },
    35: {
      type: "matching",
      title: "Weather Predictor",
      description: "Match weather phenomena to atmospheric conditions",
      matchPairs: [
        { answer: "weather1", term: "High pressure system", definition: "Cool, clear weather with descending dry air masses" },
        { answer: "weather2", term: "Low pressure system", definition: "Cloudy, wet weather with rising moist air and potential storms" },
        { answer: "weather3", term: "Jet streams", definition: "Fast-moving air rivers 35,000 feet up guiding weather patterns" },
        { answer: "weather4", term: "Coriolis effect", definition: "Earth's rotation deflects moving air masses creating wind patterns" },
        { answer: "weather5", term: "Dew point", definition: "Temperature at which air becomes saturated and condenses to water droplets" },
      ]
    },
    36: {
      type: "quiz",
      title: "Climate Modeler",
      description: "Master climate systems and predict climate change impacts",
      questions: [
        {
          question: "What is the difference between weather and climate?",
          options: ["Same thing", "Weather is short-term atmospheric conditions; climate is long-term patterns (30+ years)", "Opposite", "Both describe yearly patterns"],
          correct: 1,
          explanation: "Weather: today's conditions; Climate: average conditions over decades"
        },
        {
          question: "What is the greenhouse effect?",
          options: ["Cooling mechanism", "Gases trap heat in atmosphere, warming Earth (CO₂, CH₄, N₂O)", "Plant growth only", "Ozone layer"],
          correct: 1,
          explanation: "Greenhouse gases absorb infrared radiation, keeping heat near Earth's surface"
        },
        {
          question: "What causes climate change?",
          options: ["Natural variation only", "Increased greenhouse gas emissions from human activities amplifying natural warming", "Solar variation only", "No clear cause"],
          correct: 1,
          explanation: "Human activities (burning fossil fuels, deforestation) increase CO₂ 40% since 1800s"
        },
        {
          question: "What are effects of climate change?",
          options: ["None observed", "Rising temperatures, melting ice, sea level rise, extreme weather, ecosystem disruption", "Only positive", "Local effects only"],
          correct: 1,
          explanation: "Global warming impacts: droughts, floods, species extinction, human migration pressure"
        },
        {
          question: "What is a carbon footprint?",
          options: ["Geological feature", "Total greenhouse gas emissions from activities (travel, food, energy)", "Fossil fuel deposit", "Climate model"],
          correct: 1,
          explanation: "Carbon footprint measures individual/organization's climate impact in CO₂ equivalents"
        }
      ]
    },
    37: {
      type: "dragdrop",
      title: "Conservation Hero",
      description: "Match conservation strategies to endangered species protection",
      items: [
        { id: "item1", name: "Protected habitats", correctZone: "strategy" },
        { id: "item2", name: "Breeding programs", correctZone: "strategy" },
        { id: "item3", name: "Poaching prevention", correctZone: "strategy" },
        { id: "item4", name: "Habitat restoration", correctZone: "strategy" },
        { id: "item5", name: "Education campaigns", correctZone: "strategy" },
      ],
      zones: [
        { id: "strategy", label: "Conservation Strategies" },
      ]
    },
    38: {
      type: "memory",
      title: "Pollution Fighter",
      description: "Match pollution types to their sources and effects",
      pairs: [
        { term: "Air pollution", answer: "poll1" },
        { term: "Vehicle emissions, factories, burning fossil fuels → respiratory disease, acid rain", answer: "poll1" },
        { term: "Water pollution", answer: "poll2" },
        { term: "Industrial discharge, agricultural runoff, plastic → aquatic ecosystem damage", answer: "poll2" },
        { term: "Soil pollution", answer: "poll3" },
        { term: "Heavy metals, pesticides, waste → reduced fertility, crop contamination", answer: "poll3" },
      ]
    },
    39: {
      type: "quiz",
      title: "Renewable Energy",
      description: "Learn about sustainable energy sources and clean technology",
      questions: [
        {
          question: "What is renewable energy?",
          options: ["Fossil fuels", "Energy from naturally replenishing sources (sun, wind, water, geothermal)", "Nuclear only", "Always finite"],
          correct: 1,
          explanation: "Renewable energy regenerates naturally and doesn't deplete"
        },
        {
          question: "What is solar energy?",
          options: ["Heat from Earth", "Energy from sunlight converted to electricity or heat via panels", "Wind power", "Water flow"],
          correct: 1,
          explanation: "Solar panels convert photons to electrical current; solar thermal heats water"
        },
        {
          question: "How does wind energy work?",
          options: ["Heat source", "Wind turbines with rotating blades generate electricity from wind currents", "Solar conversion", "Tidal movement"],
          correct: 1,
          explanation: "Wind energy: kinetic energy of moving air → mechanical rotation → electrical generation"
        },
        {
          question: "What is hydroelectric power?",
          options: ["Solar thermal", "Electricity generated by flowing/falling water through turbines", "Wind turbines", "Geothermal heat"],
          correct: 1,
          explanation: "Dams and run-of-river systems use water's gravitational potential energy"
        },
        {
          question: "Why is renewable energy important?",
          options: ["Cheaper only", "Reduces fossil fuel dependence, mitigates climate change, sustainable", "No real benefits", "Limited availability"],
          correct: 1,
          explanation: "Renewables are clean, abundant long-term, and reduce greenhouse gas emissions"
        }
      ]
    },
    40: {
      type: "matching",
      title: "Ecosystem Manager",
      description: "Balance human needs with ecosystem health and sustainability",
      matchPairs: [
        { answer: "sust1", term: "Sustainable agriculture", definition: "Farming that preserves soil health and biodiversity while producing food" },
        { answer: "sust2", term: "Deforestation", definition: "Clearing forests for agriculture/development causing habitat loss and climate impact" },
        { answer: "sust3", term: "Circular economy", definition: "Reduce-Reuse-Recycle model minimizing waste and resource extraction" },
        { answer: "sust4", term: "Biodiversity conservation", definition: "Protecting species and ecosystems maintaining ecological balance" },
        { answer: "sust5", term: "Sustainable fishing", description: "Managing fish stocks to prevent overfishing and ecosystem collapse" },
      ]
    },

    // ECONOMICS GAMES (41-50)
    41: {
      type: "quiz",
      title: "Supply & Demand",
      description: "Master market equilibrium, price elasticity, and supply/demand curves",
      questions: [
        {
          question: "What is supply in economics?",
          options: ["Demand only", "Quantity of goods producers willing to sell at different prices", "Consumer purchases", "Stock inventory"],
          correct: 1,
          explanation: "Supply increases with price; sellers want higher prices for more output"
        },
        {
          question: "What is demand in economics?",
          options: ["Production capacity", "Quantity consumers willing to buy at different prices", "Availability only", "Storage"],
          correct: 1,
          explanation: "Demand decreases with price; buyers want lower prices for more quantity"
        },
        {
          question: "What is market equilibrium?",
          options: ["High prices", "Price where supply equals demand; no surplus or shortage", "Low prices", "Maximum production"],
          correct: 1,
          explanation: "Equilibrium price: supply curve intersects demand curve"
        },
        {
          question: "What happens when demand exceeds supply?",
          options: ["Prices fall", "Shortage occurs, prices rise, sellers can raise prices", "Equilibrium reached", "No change"],
          correct: 1,
          explanation: "Shortage: shortage → price increase → quantity demanded decreases/supplied increases"
        },
        {
          question: "What is price elasticity of demand?",
          options: ["Maximum price", "Measure of how demand changes with price (% change quantity / % change price)", "Minimum cost", "Production level"],
          correct: 1,
          explanation: "Elastic: demand changes significantly (luxury goods); Inelastic: stable (necessities)"
        }
      ]
    },
    42: {
      type: "matching",
      title: "Business Tycoon",
      description: "Match business concepts to profit/loss management strategies",
      matchPairs: [
        { answer: "bus1", term: "Revenue", definition: "Total income from selling products/services: Price × Quantity" },
        { answer: "bus2", term: "Costs", definition: "Fixed (rent, salaries) and variable costs (materials, labor per unit)" },
        { answer: "bus3", term: "Profit", definition: "Revenue minus costs; positive = profitable, negative = loss" },
        { answer: "bus4", term: "Break-even point", definition: "Sales level where revenue equals costs (zero profit/loss)" },
        { answer: "bus5", term: "Economies of scale", definition: "Lower per-unit costs from increased production volume" },
      ]
    },
    43: {
      type: "quiz",
      title: "Budget Manager",
      description: "Create household and government budgets with income/expenses",
      questions: [
        {
          question: "What is a budget?",
          options: ["Wishful thinking", "Plan allocating expected income to expenses and savings", "Accounting only", "Tax document"],
          correct: 1,
          explanation: "Budget: Income - Expenses = Surplus (savings) or Deficit (debt)"
        },
        {
          question: "What are the main household budget categories?",
          options: ["Random", "Housing, food, transportation, utilities, insurance, entertainment, savings", "Only expenses", "No fixed items"],
          correct: 1,
          explanation: "Household budgets track fixed (rent, insurance) and variable (food, entertainment) costs"
        },
        {
          question: "What is a government budget?",
          options: ["Personal spending", "Plan for public revenue (taxes) and expenditures (services, infrastructure)", "Corporate finances", "Private accounts"],
          correct: 1,
          explanation: "Government budgets fund roads, schools, defense, social services, debt payment"
        },
        {
          question: "What is a budget deficit?",
          options: ["Positive balance", "Government spending exceeds tax revenue; requires borrowing", "Savings surplus", "Balanced state"],
          correct: 1,
          explanation: "Deficit: spending > revenue; creates national debt; funded by bonds/borrowing"
        },
        {
          question: "Why is budgeting important?",
          options: ["No real benefit", "Helps allocate resources, avoid debt, plan for goals, track spending", "Only for business", "Unnecessary for individuals"],
          correct: 1,
          explanation: "Budgeting enables financial stability, goal achievement, and prevents overspending"
        }
      ]
    },
    44: {
      type: "memory",
      title: "Investment Trader",
      description: "Match investment types to their risk/reward profiles",
      pairs: [
        { term: "Stocks", answer: "inv1" },
        { term: "Ownership shares in companies; higher risk, higher reward", answer: "inv1" },
        { term: "Bonds", answer: "inv2" },
        { term: "Loans to governments/companies; lower risk, fixed interest", answer: "inv2" },
        { term: "Diversification", answer: "inv3" },
        { term: "Spreading investments across assets to reduce risk", answer: "inv3" },
      ]
    },
    45: {
      type: "quiz",
      title: "GDP Calculator",
      description: "Measure economic growth, GDP calculation, and productivity",
      questions: [
        {
          question: "What is GDP (Gross Domestic Product)?",
          options: ["Total debt", "Total market value of all goods/services produced by country in a year", "Population size", "Government spending only"],
          correct: 1,
          explanation: "GDP = C (consumption) + I (investment) + G (government) + (X-M) (exports-imports)"
        },
        {
          question: "What is real GDP?",
          options: ["Total GDP", "GDP adjusted for inflation, showing true economic growth", "Nominal only", "Unadjusted value"],
          correct: 1,
          explanation: "Real GDP accounts for inflation; nominal GDP doesn't"
        },
        {
          question: "What is per capita GDP?",
          options: ["Total GDP", "GDP divided by population; measures living standard", "Average wage only", "National income"],
          correct: 1,
          explanation: "Per capita GDP: higher value = higher average productivity and income per person"
        },
        {
          question: "What indicates economic growth?",
          options: ["Inflation increase", "Increasing real GDP over time", "Rising unemployment", "Falling investments"],
          correct: 1,
          explanation: "Positive GDP growth: economy expanding, more jobs, higher incomes"
        },
        {
          question: "What is a recession?",
          options: ["Quick growth", "Two consecutive quarters of negative GDP growth; rising unemployment", "Inflation spike", "Normal variation"],
          correct: 1,
          explanation: "Recession: economic contraction reducing jobs, income, and spending"
        }
      ]
    },
    46: {
      type: "dragdrop",
      title: "Inflation Monitor",
      description: "Manage inflation, unemployment, and interest rates",
      items: [
        { id: "item1", name: "Inflation", correctZone: "macro" },
        { id: "item2", name: "Unemployment", correctZone: "macro" },
        { id: "item3", name: "Interest rates", correctZone: "macro" },
        { id: "item4", name: "Exchange rates", correctZone: "macro" },
      ],
      zones: [
        { id: "macro", label: "Macroeconomic Factors" },
      ]
    },
    47: {
      type: "memory",
      title: "Trade Navigator",
      description: "Understand international trade and tariff impacts",
      pairs: [
        { term: "Exports", answer: "trade1" },
        { term: "Goods produced domestically and sold internationally", answer: "trade1" },
        { term: "Imports", answer: "trade2" },
        { term: "Foreign goods purchased and consumed domestically", answer: "trade2" },
        { term: "Trade balance", answer: "trade3" },
        { term: "Exports value minus imports value; surplus or deficit", answer: "trade3" },
      ]
    },
    48: {
      type: "quiz",
      title: "Tax Planner",
      description: "Calculate taxes and optimize financial strategy",
      questions: [
        {
          question: "What are income taxes?",
          options: ["Sales tax only", "Percentage of earnings paid to government; progressive (higher income, higher rate)", "Fixed fee", "Deductions only"],
          correct: 1,
          explanation: "Income tax: federal, state, local; funds government services"
        },
        {
          question: "What is tax deduction?",
          options: ["Tax credit", "Expense subtracted from income, reducing taxable income", "Refund amount", "Penalty"],
          correct: 1,
          explanation: "Deductions: mortgage interest, charitable donations, medical expenses"
        },
        {
          question: "What is a tax credit?",
          options: ["Deduction", "Direct reduction in taxes owed (worth more than deduction)", "Income increase", "Payment plan"],
          correct: 1,
          explanation: "$1 credit = $1 tax reduction; more valuable than deduction"
        },
        {
          question: "What is progressive taxation?",
          options: ["Flat rate for all", "Higher earners pay higher tax rates; reduces inequality", "Lower earners taxed more", "No progression"],
          correct: 1,
          explanation: "Progressive: 10% on first $10k, 20% on $10-50k, 30% on >$50k"
        },
        {
          question: "Why do governments use taxes?",
          options: ["Punishment", "Fund public services (roads, schools, defense, social programs), reduce inequality", "Collect debt", "Limit economy"],
          correct: 1,
          explanation: "Taxes redistribute wealth and fund public goods markets won't provide"
        }
      ]
    },
    49: {
      type: "matching",
      title: "Labor Economics",
      description: "Match labor concepts to worker impacts and employment",
      matchPairs: [
        { answer: "labor1", term: "Minimum wage", definition: "Legal floor on hourly pay protecting workers from exploitation" },
        { answer: "labor2", term: "Unemployment", definition: "Percentage of labor force without jobs but actively seeking work" },
        { answer: "labor3", term: "Wage gap", definition: "Difference in pay between demographic groups for same work" },
        { answer: "labor4", term: "Labor union", definition: "Worker organization negotiating wages, benefits, and working conditions" },
        { answer: "labor5", term: "Underemployment", definition: "Working part-time or below skill level due to job scarcity" },
      ]
    },
    50: {
      type: "quiz",
      title: "Economic Systems",
      description: "Compare capitalism, socialism, and mixed economies",
      questions: [
        {
          question: "What is capitalism?",
          options: ["Government control", "Market-driven economy with private ownership, profit motive, minimal regulation", "Central planning", "Shared ownership"],
          correct: 1,
          explanation: "Capitalism: free markets determine production, prices, distribution"
        },
        {
          question: "What is socialism?",
          options: ["Private ownership", "Economy with collective/state ownership, reduced inequality, planned production", "Market-based", "No regulation"],
          correct: 1,
          explanation: "Socialism: government owns resources, distributes goods based on need"
        },
        {
          question: "What is a mixed economy?",
          options: ["Pure capitalism", "Combines market mechanisms with government intervention and regulation", "Pure socialism", "No mixing"],
          correct: 1,
          explanation: "Mixed: capitalism with safety nets, regulations, public services (USA, Canada, Europe)"
        },
        {
          question: "What are advantages of capitalism?",
          options: ["Equality only", "Efficiency, innovation, individual choice, economic growth", "No advantages", "Perfect distribution"],
          correct: 1,
          explanation: "Capitalism incentivizes innovation and efficiency through competition"
        },
        {
          question: "What are disadvantages of pure socialism?",
          options: ["No problems", "Reduced innovation incentives, inefficiency, bureaucratic barriers, potentially oppressive", "All advantages", "Unclear systems"],
          correct: 1,
          explanation: "Socialism struggles with innovation and efficiency without market competition"
        }
      ]
    },

    // HISTORY GAMES (51-60)
    51: {
      type: "quiz",
      title: "Timeline Constructor",
      description: "Arrange historical events in correct chronological order",
      questions: [
        {
          question: "What ancient civilization developed writing first?",
          options: ["Egypt", "Sumer in Mesopotamia (~3200 BCE with cuneiform)", "China", "Greece"],
          correct: 1,
          explanation: "Sumerians created cuneiform, the earliest known writing system"
        },
        {
          question: "When did the Roman Empire fall?",
          options: ["1000 CE", "476 CE (Western Rome); Eastern Byzantine Empire continued to 1453", "500 BCE", "1500 CE"],
          correct: 1,
          explanation: "Western Roman Empire fell in 476 CE; Eastern Byzantine Empire lasted until 1453"
        },
        {
          question: "What was the Silk Road?",
          options: ["Textile factory", "Ancient trade network connecting Asia to Europe via routes through Central Asia", "River path", "Ocean route"],
          correct: 1,
          explanation: "Silk Road: facilitated trade, cultural exchange between East and West (2nd century BCE - 15th century CE)"
        },
        {
          question: "When did the Columbian Exchange begin?",
          options: ["1400", "1492 (Columbus reaches Americas); transformed world with crop/disease/people exchanges", "1500", "1600"],
          correct: 1,
          explanation: "Columbus: 1492; led to exchange of crops, animals, diseases, and people"
        },
        {
          question: "What was the Industrial Revolution's primary impact?",
          options: ["Agricultural focus", "Shift to machine production, urbanization, factory systems, economic growth (1760-1840)", "Decline in trade", "Return to farming"],
          correct: 1,
          explanation: "Industrial Revolution: mechanization replaced manual labor, created modern economy"
        }
      ]
    },
    52: {
      type: "matching",
      title: "Medieval Kingdoms",
      description: "Match medieval concepts to feudal society structure",
      matchPairs: [
        { answer: "med1", term: "Feudalism", definition: "Social system with nobles, knights, serfs; land in exchange for loyalty and service" },
        { answer: "med2", term: "Knight", definition: "Warrior noble serving lord, following chivalry code of honor" },
        { answer: "med3", term: "Serf", definition: "Bound to land, required to work for lord, no freedom of movement" },
        { answer: "med4", term: "Castle", definition: "Fortified noble residence and defensive stronghold" },
        { answer: "med5", term: "Crusades", definition: "Religious military campaigns (1095-1291) by Christians to reclaim Holy Land" },
      ]
    },
    53: {
      type: "quiz",
      title: "Renaissance Trivia",
      description: "Explore art, science, and culture rebirth in Renaissance",
      questions: [
        {
          question: "What was the Renaissance?",
          options: ["Medieval period", "Cultural rebirth (1300-1600s) emphasizing humanism, art, science in Europe", "Industrial era", "Modern age"],
          correct: 1,
          explanation: "Renaissance: rediscovery of classical learning, artistic/scientific innovation"
        },
        {
          question: "What region led the Renaissance?",
          options: ["France", "Italy (Florence, Venice); wealthy city-states patronized artists and thinkers", "Spain", "Germany"],
          correct: 1,
          explanation: "Italian Renaissance: Medici family patronage, proximity to classical Rome"
        },
        {
          question: "Who was Leonardo da Vinci?",
          options: ["Pope", "Renaissance polymath: artist (Mona Lisa), scientist, inventor, engineer", "Knight", "Cardinal"],
          correct: 1,
          explanation: "Da Vinci: embodied Renaissance ideal of combining art and science"
        },
        {
          question: "What was the Reformation?",
          options: ["Renaissance art", "Religious movement (1517) challenging Catholic Church authority", "Political reform", "Artistic movement"],
          correct: 1,
          explanation: "Reformation: Martin Luther's 95 Theses challenged corruption; led to Protestantism"
        },
        {
          question: "What major printing advance occurred during Renaissance?",
          options: ["Hand copying", "Gutenberg's printing press (1440); enabled mass book production and literacy spread", "Typewriters", "Computers"],
          correct: 1,
          explanation: "Printing press revolutionized information spread and supported Reformation"
        }
      ]
    },
    54: {
      type: "memory",
      title: "Age of Exploration",
      description: "Match explorers to discoveries and routes",
      pairs: [
        { term: "Columbus", answer: "exp1" },
        { term: "Sailed to Americas 1492; believed reached Asia but found New World", answer: "exp1" },
        { term: "Magellan", answer: "exp2" },
        { term: "First to circumnavigate globe; Pacific Ocean crossing 1520", answer: "exp2" },
        { term: "da Gama", answer: "exp3" },
        { term: "Sailed around Africa to India 1498; opened sea route to Asia", answer: "exp3" },
      ]
    },
    55: {
      type: "quiz",
      title: "Revolution Puzzle",
      description: "Master causes and effects of major revolutionary movements",
      questions: [
        {
          question: "What was the American Revolution?",
          options: ["Internal reform", "Colonial rebellion (1775-1783) against British rule; established USA independence", "French war", "Industrial change"],
          correct: 1,
          explanation: "American Revolution: Declaration of Independence 1776, Constitution 1787"
        },
        {
          question: "What was the French Revolution?",
          options: ["American support", "Radical upheaval (1789-1799) overthrowing monarchy, establishing republic", "Internal reform", "Napoleon's war"],
          correct: 1,
          explanation: "French Revolution: Enlightenment ideals, rights, executed king, Reign of Terror"
        },
        {
          question: "What caused the French Revolution?",
          options: ["American support only", "Debt, famine, Enlightenment ideas, resentment of absolutism and privileges", "Weather only", "External invasion"],
          correct: 1,
          explanation: "Causes: financial crisis, food shortages, inequality, Enlightenment influence"
        },
        {
          question: "What was the Russian Revolution?",
          options: ["Industrial development", "Overthrow of Tsar (1917), establishing communist USSR under Lenin", "Reform attempt", "Monarchy restoration"],
          correct: 1,
          explanation: "Russian Revolution: Bolsheviks seized power, created first communist state"
        },
        {
          question: "What major theme connects these revolutions?",
          options: ["Monarchy strengthening", "Demand for individual rights, democracy, challenging absolute authority", "Industrial growth", "Empire expansion"],
          correct: 1,
          explanation: "Revolutions: driven by Enlightenment ideals of liberty, equality, representative government"
        }
      ]
    },
    56: {
      type: "matching",
      title: "Industrial Era",
      description: "Match Industrial Revolution innovations to societal changes",
      matchPairs: [
        { answer: "ind1", term: "Steam Engine", definition: "Watt's innovation (1769); powered factories, trains, revolutionized production" },
        { answer: "ind2", term: "Factory System", definition: "Concentrated production with division of labor, increased efficiency and output" },
        { answer: "ind3", term: "Urbanization", definition: "Rural people migrated to cities for factory jobs; created crowded urban centers" },
        { answer: "ind4", term: "Child Labor", definition: "Children 5-14 worked long hours in dangerous factories with no protections" },
        { answer: "ind5", term: "Labor Movements", definition: "Workers organized unions demanding rights, wages, safe conditions" },
      ]
    },
    57: {
      type: "quiz",
      title: "World War Historian",
      description: "Study major conflicts and their global impacts",
      questions: [
        {
          question: "What caused World War I?",
          options: ["Territory only", "Alliance system, imperial competition, Serbian nationalism, Archduke Franz Ferdinand assassination 1914", "Economic only", "Religious conflict"],
          correct: 1,
          explanation: "WWI: triggered by assassination; alliances dragged all major powers into conflict"
        },
        {
          question: "What was WWI's major technology impact?",
          options: ["Same as before", "Trenches, machine guns, poison gas, tanks, aircraft changed warfare forever", "Minimal change", "Nothing significant"],
          correct: 1,
          explanation: "WWI introduced modern industrial warfare with massive casualties (16 million deaths)"
        },
        {
          question: "What caused World War II?",
          options: ["Economic prosperity", "Treaty of Versailles resentment, Great Depression, rise of Hitler and fascism, appeasement failure", "No real cause", "Allied aggression"],
          correct: 1,
          explanation: "WWII: harsh WWI treaty, economic crisis, aggressive fascist ideologies, appeasement failure"
        },
        {
          question: "What was the Holocaust?",
          options: ["War damage", "Nazi systematic genocide killing 6 million Jews and millions of others", "Bombing campaign", "Occupation policy"],
          correct: 1,
          explanation: "Holocaust: Nazi attempt to exterminate entire Jewish race; industrialized genocide"
        },
        {
          question: "What major outcome resulted from WWII?",
          options: ["British dominance", "USA and USSR as superpowers, UN creation, decolonization, nuclear age begins", "Axis victory", "Minor changes"],
          correct: 1,
          explanation: "WWII outcomes: Cold War begins, nuclear weapons change global dynamics"
        }
      ]
    },
    58: {
      type: "matching",
      title: "Cold War Strategies",
      description: "Match Cold War concepts to geopolitical tensions and tactics",
      matchPairs: [
        { answer: "cold1", term: "Containment", definition: "USA policy to prevent Soviet expansion through alliances and military presence" },
        { answer: "cold2", term: "Mutually Assured Destruction (MAD)", definition: "Nuclear deterrent: both sides could annihilate each other preventing war" },
        { answer: "cold3", term: "Proxy Wars", definition: "USA and USSR supported opposite sides in Korea, Vietnam, Afghanistan avoiding direct conflict" },
        { answer: "cold4", term: "Space Race", definition: "Competition to reach space; USSR Sputnik 1957, USA moon landing 1969" },
        { answer: "cold5", term: "Berlin Wall", definition: "Dividing East/West Berlin (1961-1989); symbol of Iron Curtain division" },
      ]
    },
    59: {
      type: "quiz",
      title: "Modern History Map",
      description: "Trace contemporary historical movements and events",
      questions: [
        {
          question: "When did the Soviet Union collapse?",
          options: ["1970", "1991 (end of Cold War, dissolved into independent republics)", "2000", "Never happened"],
          correct: 1,
          explanation: "USSR: dissolved peacefully 1991, ending Cold War era"
        },
        {
          question: "What was the Civil Rights Movement?",
          options: ["Economic reform", "1950s-60s struggle for racial equality and ending segregation in USA", "Religious movement", "Political party"],
          correct: 1,
          explanation: "Civil Rights: MLK, Marches on Washington, Civil Rights Act 1964, Voting Rights Act 1965"
        },
        {
          question: "What was the fall of the Berlin Wall significant for?",
          options: ["Architectural only", "Symbolized end of Cold War division; reunified Germany; ended Soviet control of Eastern Europe", "Local event", "No impact"],
          correct: 1,
          explanation: "Berlin Wall fall (1989): marked Soviet system collapse and Cold War end"
        },
        {
          question: "What happened September 11, 2001?",
          options: ["Weather event", "Terrorist attacks on USA; Al-Qaeda planes hit Twin Towers, Pentagon; 3,000 deaths", "Military exercise", "Weather disaster"],
          correct: 1,
          explanation: "9/11: triggered War on Terror, Afghanistan/Iraq invasions, global security changes"
        },
        {
          question: "What is globalization?",
          options: ["Local focus", "Increasing worldwide interconnection of trade, culture, technology, communication", "Isolated economies", "No connections"],
          correct: 1,
          explanation: "Globalization: aided by internet, trade agreements, migration; created interdependent world"
        }
      ]
    },
    60: {
      type: "matching",
      title: "Historical Figures",
      description: "Match leaders and thinkers with their achievements and impact",
      matchPairs: [
        { answer: "fig1", term: "Napoleon Bonaparte", definition: "French general who conquered Europe, crowned emperor, influenced law codes and government" },
        { answer: "fig2", term: "Abraham Lincoln", definition: "USA president who preserved Union, ended slavery via Emancipation Proclamation and 13th Amendment" },
        { answer: "fig3", term: "Adolf Hitler", definition: "Nazi leader whose fascism caused Holocaust and WWII; symbol of genocide and totalitarianism" },
        { answer: "fig4", term: "Mohandas Gandhi", definition: "Indian leader using nonviolent resistance to overthrow British rule; inspired civil rights movements" },
        { answer: "fig5", term: "Winston Churchill", definition: "British PM during WWII who led resistance against Hitler; rallied British during their darkest hours" },
      ]
    },

    // HUMAN GEOGRAPHY GAMES (61-70)
    61: {
      type: "quiz",
      title: "Map Master",
      description: "Identify countries, capitals, and major geographic features",
      questions: [
        {
          question: "What are continents?",
          options: ["Countries", "Large landmasses: Africa, Antarctica, Asia, Europe, North America, Oceania, South America", "Islands only", "Oceans"],
          correct: 1,
          explanation: "Continents: largest landmasses surrounded by water"
        },
        {
          question: "What is a capital city?",
          options: ["Largest city always", "City serving as government seat and political center of country", "Richest city", "Oldest city"],
          correct: 1,
          explanation: "Capital: where national government functions; e.g., Washington DC (USA), Beijing (China)"
        },
        {
          question: "What is latitude?",
          options: ["East-west lines", "North-south lines measuring distance from equator (0° to 90°)", "Height measurement", "Temperature"],
          correct: 1,
          explanation: "Latitude: equator 0°, North Pole 90°N, South Pole 90°S"
        },
        {
          question: "What is longitude?",
          options: ["North-south lines", "East-west lines measuring distance from Prime Meridian (0° to 180°)", "Distance measure", "Climate"],
          correct: 1,
          explanation: "Longitude: Prime Meridian 0°, Eastern Hemisphere 0-180°E, Western 0-180°W"
        },
        {
          question: "What is the Ring of Fire?",
          options: ["Volcano legend", "Pacific rim zone with 75% of world's active volcanoes and earthquake zones", "Fire phenomenon", "Climate region"],
          correct: 1,
          explanation: "Ring of Fire: circum-Pacific region with tectonic activity; Japan, Philippines, Peru, California vulnerable"
        }
      ]
    },
    62: {
      type: "matching",
      title: "Culture Explorer",
      description: "Learn about different cultures, traditions, and ways of life worldwide",
      matchPairs: [
        { answer: "cult1", term: "Hinduism", definition: "Major religion (1.2B followers) centered on karma, dharma, reincarnation in India/South Asia" },
        { answer: "cult2", term: "Islam", definition: "Monotheistic faith (1.8B followers) following Prophet Muhammad; Quran as holy text" },
        { answer: "cult3", term: "Buddhism", definition: "Path to enlightenment based on Buddha's teachings; meditation, escape from suffering" },
        { answer: "cult4", term: "Confucianism", definition: "Chinese philosophy emphasizing ethics, respect for authority, family harmony" },
        { answer: "cult5", term: "Indigenous cultures", definition: "Native peoples with unique languages, traditions, spiritual practices; often marginalized" },
      ]
    },
    63: {
      type: "quiz",
      title: "Population Analyzer",
      description: "Study population distribution, demographics, and migration patterns",
      questions: [
        {
          question: "What is population density?",
          options: ["Total population", "Number of people per unit area (per km² or square mile)", "Growth rate", "Age distribution"],
          correct: 1,
          explanation: "High density: Singapore 8,000/km²; Low density: Mongolia 2/km²"
        },
        {
          question: "What is demographic transition?",
          options: ["Immigration only", "Model of population change: high birth/death → low birth/death as societies develop", "Age distribution", "Gender ratio"],
          correct: 1,
          explanation: "Transition: premodern (high birth/death) → modern (low birth/death)"
        },
        {
          question: "What causes urbanization?",
          options: ["Agricultural improvement", "Migration from rural to urban areas seeking jobs, education, services", "No clear cause", "Farming growth"],
          correct: 1,
          explanation: "Urbanization driven by industrialization, economic opportunity, infrastructure"
        },
        {
          question: "What is a megacity?",
          options: ["Capital always", "Urban area with population over 10 million; Tokyo, Delhi, Shanghai, São Paulo", "Any big city", "All capitals"],
          correct: 1,
          explanation: "Megacities: massive urban centers with complex challenges (housing, transportation, pollution)"
        },
        {
          question: "What is the youth bulge?",
          options: ["Obesity problem", "Large percentage of population under age 15; mainly in developing countries", "Aging problem", "Gender imbalance"],
          correct: 1,
          explanation: "Youth bulge: potential workforce but also unemployment/education challenges in poor countries"
        }
      ]
    },
    64: {
      type: "memory",
      title: "Urban Planner",
      description: "Match urban planning concepts to sustainable city design",
      pairs: [
        { term: "Smart cities", answer: "urban1" },
        { term: "Technology integration for efficiency: traffic, utilities, services optimization", answer: "urban1" },
        { term: "Public transit", answer: "urban2" },
        { term: "Buses, trains, subways reducing car dependence and emissions", answer: "urban2" },
        { term: "Green space", answer: "urban3" },
        { term: "Parks, trees, gardens improving air quality and well-being", answer: "urban3" },
      ]
    },
    65: {
      type: "quiz",
      title: "Economic Regions",
      description: "Understand global economic zones, trade blocs, and development",
      questions: [
        {
          question: "What is economic geography?",
          options: ["Physical terrain only", "Study of production, distribution, consumption of goods/services across space", "Banking only", "Population study"],
          correct: 1,
          explanation: "Economic geography: examines why industries locate where they do"
        },
        {
          question: "What is a trade bloc?",
          options: ["Single country", "Group of countries with preferential trade agreements; EU, NAFTA, ASEAN", "Random association", "No agreement"],
          correct: 1,
          explanation: "Trade blocs: reduce tariffs, increase commerce, political integration"
        },
        {
          question: "What is comparative advantage?",
          options: ["No difference", "Country should specialize in producing what it makes relatively efficiently", "Produce everything", "One country better"],
          correct: 1,
          explanation: "Comparative advantage: enables mutually beneficial trade based on opportunity costs"
        },
        {
          question: "What is a development gap?",
          options: ["No gaps exist", "Economic disparity between wealthy developed nations and poor developing ones", "Same everywhere", "Irrelevant"],
          correct: 1,
          explanation: "Gap: wealthy nations (USA, Germany) vs. poor (Sub-Saharan Africa, South Asia)"
        },
        {
          question: "What are newly industrialized countries (NICs)?",
          options: ["Farmers only", "Developing nations rapidly industrializing; South Korea, Taiwan, Singapore, Brazil", "Always poor", "Never change status"],
          correct: 1,
          explanation: "NICs: emerging economies with growing manufacturing and investment"
        }
      ]
    },
    66: {
      type: "matching",
      title: "Political Boundaries",
      description: "Learn geopolitics, borders, and international tensions",
      matchPairs: [
        { answer: "geo1", term: "Sovereignty", definition: "Right of nation to govern itself without external interference; foundation of nation-state" },
        { answer: "geo2", term: "Border disputes", definition: "Conflicts over territorial boundaries; Kashmir (India/Pakistan), Crimea (Russia/Ukraine)" },
        { answer: "geo3", term: "Geopolitics", definition: "Impact of geography on power relations, strategy, foreign policy between nations" },
        { answer: "geo4", term: "Imperialism", definition: "Control of distant territories by powerful nations; 19th-20th century European colonialism" },
        { answer: "geo5", term: "Decolonization", definition: "Post-WWII process of colonies gaining independence from imperial powers" },
      ]
    },
    67: {
      type: "quiz",
      title: "Resource Manager",
      description: "Manage natural resources sustainably and understand resource scarcity",
      questions: [
        {
          question: "What is a natural resource?",
          options: ["Manufactured goods", "Materials from nature used for human benefit: minerals, water, forests, fossil fuels", "Money only", "Services"],
          correct: 1,
          explanation: "Natural resources: renewable (water, forests) or nonrenewable (oil, metals)"
        },
        {
          question: "What is resource depletion?",
          options: ["Abundance growth", "Using resources faster than they regenerate; groundwater, forests, fish stocks declining", "Natural cycle", "Not a concern"],
          correct: 1,
          explanation: "Depletion: fishing collapses, aquifers drying, deforestation threatening sustainability"
        },
        {
          question: "What is sustainable resource use?",
          options: ["Unlimited extraction", "Using resources at rate they regenerate; preserving for future generations", "Ignore future", "Maximize profits"],
          correct: 1,
          explanation: "Sustainability: balance human needs with environmental preservation"
        },
        {
          question: "What are conflict minerals?",
          options: ["No such thing", "Minerals (coltan, diamonds) mined in war zones funding armed conflict", "Imported minerals only", "Rare metals"],
          correct: 1,
          explanation: "Conflict minerals: blood diamonds from Angola, coltan from Congo fueling violence"
        },
        {
          question: "What is resource nationalism?",
          options: ["Support mining", "Countries asserting control over natural resources for national benefit vs. foreign corporations", "Free trade", "Privatization"],
          correct: 1,
          explanation: "Resource nationalism: nations reclaim control of oil, minerals from multinational corporations"
        }
      ]
    },
    68: {
      type: "memory",
      title: "Migration Tracker",
      description: "Match migration patterns and diaspora communities",
      pairs: [
        { term: "Voluntary migration", answer: "migr1" },
        { term: "People choose to move seeking better opportunities, education, work", answer: "migr1" },
        { term: "Forced migration", answer: "migr2" },
        { term: "People flee war, persecution, slavery, displacement against will", answer: "migr2" },
        { term: "Diaspora", answer: "migr3" },
        { term: "Dispersed ethnic community maintaining identity abroad; Jewish, Chinese, Indian diasporas", answer: "migr3" },
      ]
    },
    69: {
      type: "quiz",
      title: "Climate & Landscape",
      description: "Explore climate zones, biomes, landforms, and ecosystems",
      questions: [
        {
          question: "What are Earth's major climate zones?",
          options: ["Only hot and cold", "Tropical (warm year-round), temperate (seasonal), polar (cold), arid (dry), alpine", "Random distribution", "One climate"],
          correct: 1,
          explanation: "Climate zones: determined by latitude, elevation, ocean currents, wind patterns"
        },
        {
          question: "What is the Coriolis effect?",
          options: ["Gravity only", "Earth's rotation deflects moving air/water currents creating gyres and wind patterns", "Temperature effect", "No real effect"],
          correct: 1,
          explanation: "Coriolis: clockwise rotation in Northern Hemisphere, counterclockwise Southern Hemisphere"
        },
        {
          question: "What are ocean currents?",
          options: ["Random movement", "Continuous flows of water driven by wind, gravity, temperature differences", "No pattern", "Only tides"],
          correct: 1,
          explanation: "Currents: Gulf Stream (warm), California Current (cold); transport heat, larvae, nutrients"
        },
        {
          question: "What are landforms?",
          options: ["Human structures", "Natural terrain features: mountains, valleys, plateaus, plains, deltas shaped by geology", "Cities only", "Manufactured"],
          correct: 1,
          explanation: "Landforms: created by tectonic activity, erosion, deposition, glaciation"
        },
        {
          question: "What is the difference between weather and climate?",
          options: ["Same thing", "Weather is short-term atmospheric conditions; climate is long-term average patterns", "Opposite", "No difference"],
          correct: 1,
          explanation: "Weather: today's rain; Climate: region's long-term precipitation patterns"
        }
      ]
    },
    70: {
      type: "matching",
      title: "Development Compass",
      description: "Compare development levels and inequality across regions",
      matchPairs: [
        { answer: "dev1", term: "Human Development Index (HDI)", definition: "Measures life expectancy, education, income; ranks countries' living standards" },
        { answer: "dev2", term: "Developed nations", definition: "High HDI, industrialized, high GDP per capita; USA, Germany, Japan" },
        { answer: "dev3", term: "Developing nations", definition: "Low-medium HDI, industrializing, lower GDP per capita; India, Nigeria, Philippines" },
        { answer: "dev4", term: "Least developed countries (LDCs)", definition: "Lowest HDI, mostly poor agricultural economies; many in Sub-Saharan Africa" },
        { answer: "dev5", term: "BRICS nations", definition: "Emerging economies: Brazil, Russia, India, China, South Africa; rapid growth" },
      ]
    },

    // PSYCHOLOGY GAMES (71-80)
    71: {
      type: "quiz",
      title: "Cognitive Bias Detector",
      description: "Identify common thinking patterns and cognitive biases",
      questions: [
        {
          question: "What is a cognitive bias?",
          options: ["Always accurate", "Systematic error in thinking/judgment; shortcuts leading to irrational decisions", "Perfect thinking", "Awareness only"],
          correct: 1,
          explanation: "Biases: mental shortcuts helping quick decisions but often inaccurate"
        },
        {
          question: "What is confirmation bias?",
          options: ["Seeking all evidence", "Tendency to search for information confirming existing beliefs", "Open-minded", "Random thinking"],
          correct: 1,
          explanation: "Confirmation bias: people seek evidence supporting views, ignore contradictory info"
        },
        {
          question: "What is availability heuristic?",
          options: ["Thorough analysis", "Judging likelihood by how easily examples come to mind", "Careful reasoning", "No shortcut"],
          correct: 1,
          explanation: "Availability: dramatic plane crashes overestimated in memory vs. common car accidents"
        },
        {
          question: "What is anchoring bias?",
          options: ["No initial impact", "First number encountered influences final decision/estimate", "Rational assessment", "Ignoring information"],
          correct: 1,
          explanation: "Anchoring: initial offer of $50 anchors price negotiation even if unreasonable"
        },
        {
          question: "Why do cognitive biases exist?",
          options: ["Evolutionary mistake", "Mental shortcuts for quick decisions in complex world; trade accuracy for speed", "Deliberate error", "No reason"],
          correct: 1,
          explanation: "Biases: evolved to make decisions quickly; useful but often inaccurate"
        }
      ]
    },
    72: {
      type: "matching",
      title: "Memory Mastermind",
      description: "Learn memory types and encoding/retrieval processes",
      matchPairs: [
        { answer: "mem1", term: "Sensory memory", definition: "Brief storage of sensory impressions (0.5 second visual, 2-3 seconds auditory)" },
        { answer: "mem2", term: "Short-term memory", definition: "Working memory holds ~7 items for seconds to minutes; uses active rehearsal" },
        { answer: "mem3", term: "Long-term memory", definition: "Permanent storage from days to lifetime; semantic (facts) and episodic (experiences)" },
        { answer: "mem4", term: "Encoding", definition: "Process of converting information into memory format for storage" },
        { answer: "mem5", term: "Retrieval", definition: "Accessing stored memories; can fail (forgetting), distort (false memories)" },
      ]
    },
    73: {
      type: "quiz",
      title: "Learning Pathways",
      description: "Master classical and operant conditioning theories and applications",
      questions: [
        {
          question: "What is classical conditioning?",
          options: ["Modern learning", "Learning through association: neutral stimulus paired with unconditioned stimulus", "Operant only", "Genetic learning"],
          correct: 1,
          explanation: "Classical conditioning: Pavlov's dogs; bell (neutral) paired with food (unconditioned) → salivation"
        },
        {
          question: "What is operant conditioning?",
          options: ["Innate behavior", "Learning through consequences: reward increases behavior, punishment decreases it", "Classical only", "No learning"],
          correct: 1,
          explanation: "Operant conditioning: Skinner's rat; lever press → food pellet (reinforcement) = increased lever pressing"
        },
        {
          question: "What is positive reinforcement?",
          options: ["Punishment", "Adding pleasant consequence after behavior to increase frequency", "Removal", "Neutral effect"],
          correct: 1,
          explanation: "Positive reinforcement: praise, money, treats increase desired behavior"
        },
        {
          question: "What is punishment?",
          options: ["Reward", "Adding unpleasant consequence after behavior to decrease frequency", "Reinforcement", "No effect"],
          correct: 1,
          explanation: "Punishment: spanking, fines, detention decrease unwanted behavior"
        },
        {
          question: "What is extinction in learning?",
          options: ["Permanent effect", "Conditioned response disappears when unconditioned stimulus is withheld", "No change", "Increase response"],
          correct: 1,
          explanation: "Extinction: repeatedly ring bell without food → dog stops salivating"
        }
      ]
    },
    74: {
      type: "memory",
      title: "Motivation Motivator",
      description: "Match motivation theories to human needs and drives",
      pairs: [
        { term: "Maslow's hierarchy", answer: "mot1" },
        { term: "Pyramid: physiological → safety → belonging → esteem → self-actualization", answer: "mot1" },
        { term: "Intrinsic motivation", answer: "mot2" },
        { term: "Internal drive: doing task for enjoyment, interest, personal satisfaction", answer: "mot2" },
        { term: "Extrinsic motivation", answer: "mot3" },
        { term: "External rewards: money, grades, praise for behavior", answer: "mot3" },
      ]
    },
    75: {
      type: "quiz",
      title: "Personality Puzzle",
      description: "Learn personality theories, traits, and assessment methods",
      questions: [
        {
          question: "What is personality?",
          options: ["Just behavior", "Consistent patterns of thoughts, feelings, behaviors across time and situations", "Always changing", "No consistency"],
          correct: 1,
          explanation: "Personality: stable individual characteristics; shape how people interact"
        },
        {
          question: "What is the Big Five personality model?",
          options: ["Four traits", "Five main traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (OCEAN)", "Three dimensions", "No model"],
          correct: 1,
          explanation: "Big Five: widely accepted framework explaining most personality variation"
        },
        {
          question: "What is extraversion?",
          options: ["Shyness trait", "Personality dimension: tendency to seek social interaction, stimulation, excitement", "Introversion only", "No social"],
          correct: 1,
          explanation: "Extraversion: extraverts energized by social interaction; introverts drained"
        },
        {
          question: "What is neuroticism?",
          options: ["Mental illness", "Personality trait of emotional instability, anxiety, negative emotionality", "Happiness", "Stability always"],
          correct: 1,
          explanation: "Neuroticism: tendency to experience anxiety, sadness, irritability, defensiveness"
        },
        {
          question: "How is personality assessed?",
          options: ["No assessment", "Questionnaires (MBTI, Big Five tests), interviews, behavioral observation", "One method only", "Guessing"],
          correct: 1,
          explanation: "Personality assessment: self-report (questionnaires) and observer ratings most common"
        }
      ]
    },
    76: {
      type: "matching",
      title: "Social Dynamics",
      description: "Match social psychology concepts to group behavior and influence",
      matchPairs: [
        { answer: "soc1", term: "Conformity", definition: "Changing behavior/beliefs to match group norms; Asch's conformity experiments" },
        { answer: "soc2", term: "Groupthink", definition: "Group prioritizes harmony over critical thinking; poor decisions (Bay of Pigs)" },
        { answer: "soc3", term: "Social facilitation", definition: "Task performance enhanced in presence of others for simple tasks, impaired for complex" },
        { answer: "soc4", term: "Prejudice", definition: "Negative attitude toward group based on stereotypes; leads to discrimination" },
        { answer: "soc5", term: "Aggression", definition: "Behavior intended to harm another; influenced by frustration, modeling, reinforcement" },
      ]
    },
    77: {
      type: "quiz",
      title: "Mental Health Guide",
      description: "Learn about psychological disorders and mental wellness",
      questions: [
        {
          question: "What is mental health?",
          options: ["No illness only", "State of psychological well-being including emotional, social, cognitive functioning", "Happiness always", "No sadness"],
          correct: 1,
          explanation: "Mental health: spectrum from thriving to disorder; context and cultural factors matter"
        },
        {
          question: "What is depression?",
          options: ["Normal sadness", "Persistent low mood, loss of interest, feelings of worthlessness, sleep/appetite changes", "Temporary feeling", "Laziness"],
          correct: 1,
          explanation: "Depression: clinical condition lasting weeks affecting functioning; distinct from normal sadness"
        },
        {
          question: "What is anxiety disorder?",
          options: ["Normal worry", "Persistent excessive worry/fear causing physical symptoms and avoidance", "Caution only", "No real symptoms"],
          correct: 1,
          explanation: "Anxiety disorder: panic, GAD, phobias; interferes with daily life"
        },
        {
          question: "What is schizophrenia?",
          options: ["Split personality", "Severe disorder with hallucinations, delusions, disorganized thinking/speech", "Common condition", "Dissociative disorder"],
          correct: 1,
          explanation: "Schizophrenia: genetic, biochemical factors; affects ~1% of population"
        },
        {
          question: "What is therapy?",
          options: ["Medication only", "Psychological treatment involving client-therapist relationship addressing thoughts/behaviors/emotions", "Just talking", "Always ineffective"],
          correct: 1,
          explanation: "Therapy types: CBT, psychodynamic, humanistic; evidence-based for many disorders"
        }
      ]
    },
    78: {
      type: "matching",
      title: "Therapy Techniques",
      description: "Match psychological treatments to their approaches and applications",
      matchPairs: [
        { answer: "ther1", term: "Cognitive Behavioral Therapy (CBT)", definition: "Targets irrational thoughts/behaviors; teaches coping skills; effective for anxiety/depression" },
        { answer: "ther2", term: "Psychodynamic therapy", definition: "Explores unconscious conflicts/childhood experiences; analyzes defense mechanisms" },
        { answer: "ther3", term: "Humanistic therapy", definition: "Focuses on personal growth, self-actualization, client-centered approach (Rogers)" },
        { answer: "ther4", term: "Exposure therapy", definition: "Confronting feared situations gradually to reduce anxiety; treats phobias, PTSD" },
        { answer: "ther5", term: "Pharmacotherapy", definition: "Using medications (antidepressants, antipsychotics) alongside therapy for mental disorders" },
      ]
    },
    79: {
      type: "quiz",
      title: "Neuroscience Quest",
      description: "Explore brain structure, function, and neurotransmitters",
      questions: [
        {
          question: "What are the major brain structures?",
          options: ["Only one part", "Frontal (executive), parietal (sensation), temporal (memory), occipital (vision), cerebellum, brainstem", "No structures", "No function"],
          correct: 1,
          explanation: "Brain regions: specialized functions; damage affects specific abilities"
        },
        {
          question: "What is a neurotransmitter?",
          options: ["Brain structure", "Chemical messenger allowing neuron-to-neuron communication across synapses", "Hormone only", "Thought"],
          correct: 1,
          explanation: "Key neurotransmitters: dopamine (reward), serotonin (mood), GABA (calm), glutamate (activation)"
        },
        {
          question: "What is dopamine?",
          options: ["Stress hormone", "Neurotransmitter associated with reward, motivation, pleasure; implicated in addiction", "Fear transmitter", "Sleep only"],
          correct: 1,
          explanation: "Dopamine: low levels in depression, high in reward-seeking; drugs hijack dopamine system"
        },
        {
          question: "What is serotonin?",
          options: ["Stress hormone", "Neurotransmitter regulating mood, sleep, appetite; imbalance linked to depression", "Attention only", "Memory"],
          correct: 1,
          explanation: "Serotonin: SSRIs increase availability; depression associated with low serotonin"
        },
        {
          question: "What is neuroplasticity?",
          options: ["Brain is fixed", "Brain's ability to reorganize neural pathways through learning, experience, recovery", "No change possible", "Age-dependent"],
          correct: 1,
          explanation: "Neuroplasticity: brain rewires itself; rehabilitation possible after stroke, practice improves skill"
        }
      ]
    },
    80: {
      type: "matching",
      title: "Research Methods",
      description: "Match research designs and statistical analysis to psychological inquiry",
      matchPairs: [
        { answer: "res1", term: "Experiment", definition: "Researcher manipulates independent variable, controls conditions, measures dependent variable" },
        { answer: "res2", term: "Correlational study", definition: "Examines relationships between variables without manipulation; cannot infer causation" },
        { answer: "res3", term: "Case study", definition: "In-depth examination of individual/group; detailed but cannot generalize" },
        { answer: "res4", term: "Survey", definition: "Questions large sample about attitudes/behaviors; quick but susceptible to bias" },
        { answer: "res5", term: "Statistical significance", definition: "Result unlikely due to chance (p < 0.05); indicates real effect not random variation" },
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

      // Add coins using storageManager so dashboard stays in sync
      addCoins(user.id, activeGame.base_reward);
      // Sync coins from dashboard stats after update
      const stats = window.localStorage.getItem(`scihub_user_${user.id}_dashboard_stats`);
      if (stats) {
        const parsedStats = JSON.parse(stats);
        setPlayerCoins(parsedStats.coins || 0);
      }

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

