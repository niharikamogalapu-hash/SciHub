import React, { useState, useEffect } from "react";
import MatchingGame from "../components/games/MatchingGame";
import QuizGame from "../components/games/QuizGame";
import PuzzleGame from "../components/games/PuzzleGame";
import MemoryGame from "../components/games/MemoryGame";
import DragDropGame from "../components/games/DragDropGame";
import BuilderGame from "../components/games/BuilderGame";
import ReactionGame from "../components/games/ReactionGame";
import "./Games.css";
import { addGameScore, addXP, logActivity, checkAndUnlockAchievements } from "../utils/storageManager";

function Games({ onGameWin }) {
  const [user, setUser] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("AP Biology");
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
      { id: 1, game_number: 1, title: "Biology Foundations", description: "Test your knowledge from Introduction to Biology.", lesson: 1, lessonTitle: "Introduction to Biology", base_reward: 15, coin_cost: 0, difficulty: "Easy" },
      { id: 2, game_number: 2, title: "Ecology Quest", description: "Master ecosystems and populations from Ecology lesson.", lesson: 2, lessonTitle: "Ecology", base_reward: 30, coin_cost: 10, difficulty: "Medium" },
      { id: 3, game_number: 3, title: "Evolution Match", description: "Connect species to evolutionary adaptations from Evolution.", lesson: 3, lessonTitle: "Evolution", base_reward: 60, coin_cost: 20, difficulty: "Medium" },
      { id: 4, game_number: 4, title: "History of Life", description: "Explore evolutionary history and biodiversity from Evolutionary History.", lesson: 4, lessonTitle: "Evolutionary History", base_reward: 120, coin_cost: 40, difficulty: "Hard" },
      { id: 5, game_number: 5, title: "Cell Structure Master", description: "Identify cell components from Cell Structure lesson.", lesson: 5, lessonTitle: "Cell Structure", base_reward: 240, coin_cost: 80, difficulty: "Hard" },
      { id: 6, game_number: 6, title: "Energy & Division", description: "Master cellular processes from Cell Division & Energy lesson.", lesson: 6, lessonTitle: "Cell Division & Energy", base_reward: 480, coin_cost: 160, difficulty: "Medium" },
      { id: 7, game_number: 7, title: "Genetics Basics", description: "Learn inheritance patterns from Genetics Basics lesson.", lesson: 7, lessonTitle: "Genetics Basics", base_reward: 960, coin_cost: 320, difficulty: "Hard" },
      { id: 8, game_number: 8, title: "Gene Expression", description: "Understand gene expression and mutations from Gene Expression lesson.", lesson: 8, lessonTitle: "Gene Expression", base_reward: 1920, coin_cost: 640, difficulty: "Medium" },
      { id: 9, game_number: 9, title: "Multicellular Systems", description: "Study organism anatomy and systems from Multicellular Organisms lesson.", lesson: 9, lessonTitle: "Multicellular Organisms", base_reward: 3840, coin_cost: 1280, difficulty: "Hard" },
      { id: 10, game_number: 10, title: "Animal Behavior", description: "Explore nervous systems and behavior from Animal Systems & Behavior lesson.", lesson: 10, lessonTitle: "Animal Systems & Behavior", base_reward: 7680, coin_cost: 2560, difficulty: "Expert" },
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
      title: "Introduction to Biology",
      description: "Match biological concepts from Lesson 1 videos: What is Biology, Scientific Method, What do Biologists Do, Organized Life, Introduction to Ecology",
      matchPairs: [
        { answer: "bio1", term: "Biology", definition: "Study of living organisms and life processes (Video 1: What is Biology?)" },
        { answer: "bio2", term: "Scientific Method", definition: "Observation → hypothesis → experiment → analyze → conclude (Video 2: Scientific Method)" },
        { answer: "bio3", term: "Biologists", definition: "Scientists who study organisms: medicine, ecology, genetics, conservation (Video 3: What do Biologists Do?)" },
        { answer: "bio4", term: "Life Organization", definition: "Atoms → molecules → organelles → cells → tissues → organs → organisms (Video 4: Organized Life)" },
        { answer: "bio5", term: "Ecology", definition: "Study of how organisms interact with environment and each other (Video 5: Introduction to Ecology)" }
      ]
    },
    2: {
      type: "quiz",
      title: "Ecology",
      description: "Questions about Lesson 2 videos: Community Ecology, Population Ecology, What is Climate Change, Effects of Climate Change, Conservation Biology",
      questions: [
        { question: "What is a community in ecology?", options: ["Just one species", "All different populations of species living and interacting in the same area", "Only animals", "A city"], correct: 1, explanation: "Community: multiple species (predators, prey, plants, decomposers) coexisting and affecting each other." },
        { question: "What does population ecology study?", options: ["Individual behavior only", "How populations grow, decline, and interact; birth rates, death rates, competition for resources", "Evolution only", "Species migration"], correct: 1, explanation: "Population ecology: examines population size changes over time based on births, deaths, immigration, emigration." },
        { question: "What is climate change?", options: ["Normal weather variation", "Long-term shift in global temperatures and weather patterns, mostly caused by human activities", "Only ice ages", "Local temperature change"], correct: 1, explanation: "Climate change: greenhouse gases (CO₂, methane) trap heat; burning fossil fuels increases atmospheric CO₂ concentration." },
        { question: "What are the effects of climate change on ecosystems?", options: ["No effects", "Rising temperatures, ocean acidification, extreme weather, species migration, habitat loss, extinction risk", "Only benefits", "Only affects ice"], correct: 1, explanation: "Climate effects: polar bears lose ice habitat, coral bleaching, agricultural disruption, increased hurricane intensity." },
        { question: "What is conservation biology?", options: ["Only studying animals", "Science of protecting biodiversity and ecosystems from extinction and degradation", "Preventing all human activity", "Hunting regulations only"], correct: 1, explanation: "Conservation: preserves endangered species, protects habitats, restores damaged ecosystems through science and policy." }
      ]
    },
    3: {
      type: "matching",
      title: "Evolution",
      description: "Match evolutionary concepts from Lesson 3 videos: Intro to Evolution, Microevolution, Natural Selection, Population Genetics, Speciation",
      matchPairs: [
        { answer: "evo1", term: "Evolution", definition: "Change in heritable traits within populations over generations (Video 1: Intro to Evolution)" },
        { answer: "evo2", term: "Microevolution", definition: "Small changes in allele frequencies observable in real time (Video 2: Microevolution)" },
        { answer: "evo3", term: "Natural Selection", definition: "Beneficial traits increase in frequency; organisms with advantages survive and reproduce (Video 3)" },
        { answer: "evo4", term: "Population Genetics", definition: "Study of allele frequencies using Hardy-Weinberg equations (Video 4: Population Genetics)" },
        { answer: "evo5", term: "Speciation", definition: "Formation of new species via reproductive isolation preventing gene flow (Video 5: Speciation)" }
      ]
    },
    4: {
      type: "quiz",
      title: "Evolutionary History",
      description: "Questions about Lesson 4 videos: Evolutionary History, Phylogeny, Biological Diversity, Human Evolution, Carbon & Molecules",
      questions: [
        { question: "What does the fossil record show about evolutionary history?", options: ["No change", "Transitional forms, extinctions, diversification after mass extinction events", "Unchanged species", "Gaps prove no evolution"], correct: 1, explanation: "Fossil record: 99% of species extinct; transitions documented (fish→amphibians→reptiles→mammals); radiations after events." },
        { question: "What is phylogeny?", options: ["Study of fossils only", "Evolutionary relationships and common ancestry shown in family trees/cladograms", "Classification system", "No relationship"], correct: 1, explanation: "Phylogeny: evolutionary tree showing common ancestors; cladogram groups organisms by shared derived traits." },
        { question: "What is the diversity of life organized by?", options: ["Size only", "Taxonomy (Kingdom, Phylum, Class, Order, Family, Genus, Species) based on evolutionary relationships", "Color", "Habitat only"], correct: 1, explanation: "Biological diversity: 1.5 million described species, millions unknown; organized by evolutionary relatedness." },
        { question: "When did humans evolve and what makes us unique?", options: ["Same as other apes", "Humans evolved ~6-7 million years ago; bipedalism, large brain, complex language, tool use", "Recently", "Not evolved"], correct: 1, explanation: "Human evolution: fossil record (Lucy, Homo habilis, H. erectus, H. neanderthalensis); DNA 98% match with chimps." },
        { question: "What is the significance of carbon molecules in biology?", options: ["Not important", "Carbon backbone of all organic molecules (lipids, carbohydrates, proteins, nucleic acids); chemistry of life", "Only in gems", "Inorganic only"], correct: 1, explanation: "Carbon: forms 4 bonds, versatile; macromolecules built from carbon chains/rings; basis of biochemistry." }
      ]
    },
    5: {
      type: "matching",
      title: "Cell Structure",
      description: "Match cell structures from Lesson 5 videos: Water Properties, Microscopes, Cell Tour, Cell Membranes, Cell Communication",
      matchPairs: [
        { answer: "cell1", term: "Water", definition: "Polar molecule, universal solvent, high heat capacity - essential for all life (Video 1)" },
        { answer: "cell2", term: "Microscopes", definition: "Light (1000x) and electron (100,000x) reveal cell structures and organelles (Video 2)" },
        { answer: "cell3", term: "Nucleus", definition: "Organelle containing DNA that controls cellular activities (Video 3: Cell Tour)" },
        { answer: "cell4", term: "Cell Membrane", definition: "Phospholipid bilayer selectively permeable barrier controlling transport (Video 4)" },
        { answer: "cell5", term: "Cell Signaling", definition: "Cells communicate via hormones and neurotransmitters to coordinate activities (Video 5)" }
      ]
    },
    6: {
      type: "quiz",
      title: "Cell Division & Energy",
      description: "Questions about Lesson 6 videos: Chemical Reactions, Cellular Respiration, Photosynthesis, Mitosis & Cell Cycle, Meiosis",
      questions: [
        { question: "What happens in chemical reactions in cells?", options: ["No reaction", "Enzymes catalyze breaking/forming bonds; release or require energy; exergonic vs endergonic", "Only combustion", "No control"], correct: 1, explanation: "Cellular chemistry: enzymes lower activation energy; ATP provides energy currency for reactions." },
        { question: "What is cellular respiration?", options: ["Breathing air only", "Process breaking glucose to release energy as ATP; aerobic (O₂) or anaerobic (fermentation)", "Photosynthesis", "No energy"], correct: 1, explanation: "Respiration: glycolysis → Krebs cycle → electron transport; 1 glucose → ~32 ATP (theoretical max)." },
        { question: "What is photosynthesis and where does it occur?", options: ["In animals", "Light energy → glucose + O₂; occurs in chloroplasts of plant cells", "Requires no light", "Only in leaves"], correct: 1, explanation: "Photosynthesis: light reactions (thylakoid, produces ATP/NADPH), Calvin cycle (stroma, produces glucose)." },
        { question: "What is the cell cycle and what happens in mitosis?", options: ["Only division", "G1/S/G2 (growth, DNA replication, prep) → mitosis (prophase→metaphase→anaphase→telophase) → cytokinesis", "No regulation", "Random"], correct: 1, explanation: "Mitosis: produces 2 identical daughter cells; checkpoints control cycle; cancer = uncontrolled division." },
        { question: "What is meiosis and why is it important?", options: ["Same as mitosis", "Produces 4 non-identical gametes (sex cells) with half chromosomes via 2 divisions; genetic variation", "No difference", "Only in plants"], correct: 1, explanation: "Meiosis: crossing over + independent assortment create variation; essential for sexual reproduction." }
      ]
    },
    7: {
      type: "memory",
      title: "Genetics Basics",
      description: "Match genetic concepts from Lesson 7 videos: Intro to Genetics, Traits, DNA Structure, Transcription, Translation",
      pairs: [
        { term: "Gene", answer: "gen1" },
        { term: "DNA segment coding for trait (Video 1: Intro to Genetics)", answer: "gen1" },
        { term: "Allele", answer: "gen2" },
        { term: "Different version of a gene (dominant/recessive) (Video 2: Traits)", answer: "gen2" },
        { term: "DNA Replication", answer: "gen3" },
        { term: "Semiconservative: each new DNA has 1 old + 1 new strand (Video 3)", answer: "gen3" },
        { term: "Transcription", answer: "gen4" },
        { term: "DNA → mRNA in nucleus (Video 4: Transcription)", answer: "gen4" },
        { term: "Translation", answer: "gen5" },
        { term: "mRNA → Protein at ribosome (Video 5: Translation)", answer: "gen5" }
      ]
    },
    8: {
      type: "dragdrop",
      title: "Gene Expression",
      description: "Organize gene expression processes from Lesson 8 videos: Gene Expression, Mutations, Bacteria, Viruses, Bioinformatics",
      items: [
        { id: "item1", name: "DNA → mRNA", correctZone: "expression" },
        { id: "item2", name: "mRNA → Protein", correctZone: "expression" },
        { id: "item3", name: "Point Mutation (substitution)", correctZone: "mutations" },
        { id: "item4", name: "Insertion/Deletion", correctZone: "mutations" },
        { id: "item5", name: "Bacterial Operons", correctZone: "bacteria" },
        { id: "item6", name: "Horizontal Gene Transfer", correctZone: "bacteria" },
        { id: "item7", name: "Viral Replication", correctZone: "viruses" },
        { id: "item8", name: "Vaccines", correctZone: "viruses" }
      ],
      zones: [
        { id: "expression", label: "Gene Expression (Videos 1)" },
        { id: "mutations", label: "Mutations (Video 2)" },
        { id: "bacteria", label: "Bacterial Genetics (Video 3)" },
        { id: "viruses", label: "Viruses & Vaccines (Video 4)" }
      ]
    },
    9: {
      type: "quiz",
      title: "Multicellular Organisms",
      description: "Questions about Lesson 9 videos: Multicellular Function, Plant Anatomy & Physiology, Waste Systems, Animal Infrastructure, Defense Systems",
      questions: [
        { question: "How do multicellular organisms function?", options: ["No organization", "Cells specialize into tissues and organs; coordination via nervous/endocrine systems; division of labor", "All cells same", "Chaos"], correct: 1, explanation: "Multicellularity: specialization increases complexity; cells coordinate via signals and hormones." },
        { question: "How do plants work anatomically?", options: ["Simple blobs", "Roots (water/minerals), stems (transport/support), leaves (photosynthesis); vascular tissue transports", "No organization", "Only leaves"], correct: 1, explanation: "Plant structure: xylem (water up), phloem (sugars down); stomata open for CO₂, close to conserve water." },
        { question: "How do organisms handle waste?", options: ["No waste", "Kidneys filter blood → urine (nitrogenous waste, excess salts); liver processes toxins; lungs expel CO₂", "Accumulate forever", "No system"], correct: 1, explanation: "Excretion: removes metabolic wastes (urea, CO₂); osmoregulation balances water/salt." },
        { question: "What is animal infrastructure (body structure)??", options: ["No structure", "Skeleton (support, protection, movement), muscles, skin; systems integrated by nervous/circulatory", "Just muscles", "Disorganized"], correct: 1, explanation: "Animal body: skeleton provides framework, muscles attach for movement, skin is barrier." },
        { question: "How do animals defend themselves?", options: ["No defense", "Immune system (skin barrier, innate response, adaptive response), inflammation, antibodies, white blood cells", "No protection", "Just fight"], correct: 1, explanation: "Defense: skin barrier, immune cells, antibodies recognize pathogens; inflammation signals damage; memory provides immunity." }
      ]
    },
    10: {
      type: "matching",
      title: "Animal Systems & Behavior",
      description: "Match animal systems from Lesson 10 videos: Nervous & Endocrine, Reproduction, Gender/Sex, Behavior, Biology & You",
      matchPairs: [
        { answer: "anim1", term: "Nervous System", definition: "Fast electrical signals via neurons for immediate responses (Video 1: Nervous & Endocrine)" },
        { answer: "anim2", term: "Endocrine System", definition: "Slow chemical signals via hormones for sustained changes (Video 1)" },
        { answer: "anim3", term: "Sexual Reproduction", definition: "Two parents, meiosis, genetic variation (Video 2: Reproduction)" },
        { answer: "anim4", term: "Asexual Reproduction", definition: "One parent, mitosis, clones (Video 2)" },
        { answer: "anim5", term: "Innate Behavior", definition: "Genetically programmed instincts (Video 4: Animal Behavior)" }
      ]
    },

    // CHEMISTRY GAMES (11-20)
    11: {
      type: "matching",
      title: "Foundations of Matter",
      description: "Match fundamental chemistry concepts from Lesson 1 videos: Nucleus | Atoms | History of Chemistry | Periodic Table | Electron Structure",
      matchPairs: [
        { answer: "chem1", term: "Nucleus", definition: "Central core containing protons and neutrons; defines element identity" },
        { answer: "chem2", term: "Atoms", definition: "Basic units of matter; consist of nucleus surrounded by electron clouds" },
        { answer: "chem3", term: "History of Chemistry", definition: "Evolution of atomic theory from Dalton to quantum mechanics" },
        { answer: "chem4", term: "Periodic Table", definition: "Organization of elements by atomic number showing chemical properties and trends" },
        { answer: "chem5", term: "Electron Structure", definition: "Electrons occupy orbitals in shells; determines chemical bonding behavior" }
      ]
    },
    12: {
      type: "quiz",
      title: "Chemical Math & Reactions",
      description: "Test knowledge from Lesson 2 videos: Stoichiometry | Solutions | Acid-Base Chemistry | Precipitation | Redox Reactions",
      questions: [
        {
          question: "What is stoichiometry and why is it important?",
          options: ["Study of energy", "Using balanced equations to relate moles of reactants and products", "Measuring temperature", "Only for solids"],
          correct: 1,
          explanation: "Stoichiometry: coefficients give mole ratios; 2H₂ + O₂ → 2H₂O means 2:1:2 mole ratio"
        },
        {
          question: "What happens in an acid-base reaction?",
          options: ["No reaction", "H⁺ from acid combines with OH⁻ from base forming water and salt", "Gases escape", "Temperature drops"],
          correct: 1,
          explanation: "Neutralization: HCl + NaOH → NaCl + H₂O; acid donates H⁺, base donates OH⁻"
        },
        {
          question: "What is a precipitation reaction?",
          options: ["Rain falling", "Soluble ions combine forming insoluble solid (precipitate)", "Dissolving salt", "Boiling water"],
          correct: 1,
          explanation: "Precipitation: Ag⁺ + Cl⁻ → AgCl(s); used in qualitative analysis"
        },
        {
          question: "What is a redox reaction?",
          options: ["Combination reaction", "Electron transfer between reactants; one oxidized, one reduced", "Acid-base only", "No electron change"],
          correct: 1,
          explanation: "Redox: oxidation (electron loss), reduction (electron gain); always paired"
        },
        {
          question: "How do you balance redox equations?",
          options: ["Same as any equation", "Separate into half-reactions, balance atoms and charge, combine", "No method", "Impossible"],
          correct: 1,
          explanation: "Half-reaction method: oxidation half + reduction half; balance electrons lost/gained"
        }
      ]
    },
    13: {
      type: "matching",
      title: "Language of Gases",
      description: "Match gas law concepts from Lesson 3 videos: Gas Chemist Talk | Ideal Gas Law | Solving Ideal Gas Problems | Real Gases | Partial Pressures",
      matchPairs: [
        { answer: "gas1", term: "Ideal Gas Law", definition: "PV = nRT relating pressure, volume, moles, and temperature" },
        { answer: "gas2", term: "Chemistrian Language", definition: "Gas chemistry terminology and variable definitions (P, V, n, T)" },
        { answer: "gas3", term: "Real Gases", definition: "Intermolecular forces cause deviations from ideal behavior at high pressure/low temperature" },
        { answer: "gas4", term: "Partial Pressures", definition: "Each gas contributes independent pressure; Dalton's Law: P_total = P₁ + P₂ + ..." },
        { answer: "gas5", term: "Gas Problem Solving", definition: "Using ideal gas law and stoichiometry to calculate unknown gas properties" }
      ]
    },
    14: {
      type: "quiz",
      title: "Energy & Thermodynamics",
      description: "Master Lesson 4 topics: Passing Gases | Energy in Chemistry | Enthalpy | Calorimetry | Entropy and Spontaneity",
      questions: [
        {
          question: "What is enthalpy and what does ΔH tell us?",
          options: ["Disorder measure", "Heat content of system; ΔH < 0 is exothermic, ΔH > 0 is endothermic", "Temperature change", "Work done"],
          correct: 1,
          explanation: "Enthalpy: heat released/absorbed at constant pressure; combustion (ΔH = -890 kJ/mol) is highly exothermic"
        },
        {
          question: "What is calorimetry?",
          options: ["Measuring calories in food", "Experimental technique to measure heat released/absorbed using q = mcΔT", "Temperature only", "Pressure measurement"],
          correct: 1,
          explanation: "Calorimetry: uses specific heat capacity (c) to calculate heat; bomb calorimeter measures combustion energy"
        },
        {
          question: "What is entropy (S) and what is ΔS?",
          options: ["Heat energy", "Disorder/randomness in system; ΔS > 0 for more disorder, spontaneous if ΔG < 0", "Organization", "Temperature"],
          correct: 1,
          explanation: "Entropy increases for dissolving, heating, phase changes; drives spontaneity along with enthalpy"
        },
        {
          question: "What is spontaneity and Gibbs Free Energy?",
          options: ["Unpredictable", "ΔG = ΔH - TΔS determines if reaction spontaneous; ΔG < 0 is spontaneous", "Explosive only", "Energy content"],
          correct: 1,
          explanation: "Spontaneity: combines enthalpy (favorable bonds) and entropy (disorder); predicts reaction feasibility"
        },
        {
          question: "What determines whether a reaction is exothermic or endothermic?",
          options: ["Speed of reaction", "Bond energies; breaking bonds (endothermic) vs forming bonds (exothermic)", "Catalyst used", "No pattern"],
          correct: 1,
          explanation: "If products have less energy than reactants (stronger bonds), reaction is exothermic"
        }
      ]
    },
    15: {
      type: "matching",
      title: "Bonding & Molecular Structure",
      description: "Match bonding concepts from Lesson 5 videos: Lab Techniques | Chemical Bonds | Polar & Nonpolar | Lewis Structures | Orbital Shapes",
      matchPairs: [
        { answer: "bond1", term: "Chemical Bonds", definition: "Ionic (electron transfer), covalent (electron sharing), metallic (delocalized electrons)" },
        { answer: "bond2", term: "Polar & Nonpolar", definition: "Polar molecules have uneven charge distribution; nonpolar are symmetric" },
        { answer: "bond3", term: "Lewis Structures", definition: "Dot notation showing valence electrons and bonding pairs in molecules" },
        { answer: "bond4", term: "Orbital Shapes", definition: "s orbitals (spherical), p (dumbbell), d (cloverleaf); determine molecule geometry" },
        { answer: "bond5", term: "Lab Techniques", definition: "Experimental methods to determine molecular structure and properties" }
      ]
    },
    16: {
      type: "quiz",
      title: "Phases of Matter",
      description: "Test understanding from Lesson 6 videos: Liquids | Solutions | Equilibrium | Equilibrium Equations | Solids Review",
      questions: [
        {
          question: "What characterizes liquids compared to solids and gases?",
          options: ["No shape", "Fixed volume but no fixed shape; particles close together but can move", "No interactions", "Flows freely"],
          correct: 1,
          explanation: "Liquids: strong intermolecular forces (surface tension), incompressible, take container shape"
        },
        {
          question: "What is a solution and what role does the solvent play?",
          options: ["Mixture only", "Homogeneous mixture; solvent (major) dissolves solute (minor); polar dissolves polar", "Separates", "No role"],
          correct: 1,
          explanation: "Solutions: like dissolves like; water (polar) dissolves ionic compounds, salt (NaCl)"
        },
        {
          question: "What is equilibrium in chemical reactions?",
          options: ["Reaction stopped", "Reversible reaction reaches state where forward = reverse rates; concentrations constant", "One direction", "Reaction complete"],
          correct: 1,
          explanation: "Equilibrium: A + B ⇌ C + D; position determined by ΔG and K (equilibrium constant)"
        },
        {
          question: "What is the equilibrium constant (K) and what does it tell us?",
          options: ["Speed of reaction", "K = [products]/[reactants]; K > 1 favors products, K < 1 favors reactants", "Temperature scale", "Pressure"],
          correct: 1,
          explanation: "K is temperature-dependent; large K (like CO₂ in soda) means mostly products at equilibrium"
        },
        {
          question: "How do solids differ from other phases?",
          options: ["No difference", "Fixed shape and volume; particles tightly packed in crystal lattice with strong bonds", "Can flow", "Expands easily"],
          correct: 1,
          explanation: "Solids: particles vibrate in place; high melting point requires breaking strong bonds"
        }
      ]
    },
    17: {
      type: "memory",
      title: "Acids, Bases & Kinetics",
      description: "Flip and match pairs from Lesson 7 videos: pH & pOH | Buffers | Kinetics | Solids | Reaction Rates",
      pairs: [
        { term: "pH scale", answer: "acid1" },
        { term: "Measures acidity/basicity; pH = -log[H⁺]; 0-7 acidic, 7-14 basic", answer: "acid1" },
        { term: "Buffer solution", answer: "acid2" },
        { term: "Resists pH change when acid/base added; weak acid + conjugate base", answer: "acid2" },
        { term: "Kinetics", answer: "acid3" },
        { term: "Study of reaction rates and mechanisms; activation energy is key barrier", answer: "acid3" },
        { term: "Reaction Rate", answer: "acid4" },
        { term: "Speed of reaction; increases with temperature, concentration, catalyst, surface area", answer: "acid4" },
        { term: "Rate Law", answer: "acid5" },
        { term: "Experimental equation relating rate to concentrations; rate = k[A]^m[B]^n", answer: "acid5" },
        { term: "Catalyst", answer: "acid6" },
        { term: "Substance lowering activation energy; not consumed; enables alternate reaction pathway", answer: "acid6" }
      ]
    },
    18: {
      type: "dragdrop",
      title: "Advanced Atomic Theory & Electricity",
      description: "Organize concepts from Lesson 8 videos into zones: Network Solids | Silicon Chemistry | Electrochemistry | Periodic Trends | Historical Context",
      dropZones: [
        { name: "Network Solids", items: ["Diamond lattice", "Silicon dioxide structure", "Covalent bonding extends 3D"] },
        { name: "Electrochemistry", items: ["Oxidation-reduction reactions", "Galvanic cells", "Electron transfer at electrodes"] },
        { name: "Periodic Trends", items: ["Electronegativity variation", "Atomic radius patterns", "Ionization energy progression"] },
        { name: "Silicon & Technology", items: ["Semiconductors in computers", "Silicon dioxide in glass", "Doping for conductivity"] },
        { name: "Bonding Properties", items: ["Metallic vs covalent", "Electrical conductivity", "Thermal properties"] }
      ]
    },
    19: {
      type: "quiz",
      title: "Nuclear & Organic Chemistry",
      description: "Master Lesson 9 topics: Nuclear Chemistry Part 1 | Nuclear Chemistry Part 2 | Hydrocarbons | Alkenes & Alkynes | Aromatic Chemistry",
      questions: [
        {
          question: "What is nuclear chemistry and radioactivity?",
          options: ["Chemical bonding", "Study of atomic nucleus; unstable isotopes emit radiation (alpha, beta, gamma) to reach stability", "Molecular structure", "Only theory"],
          correct: 1,
          explanation: "Radioactive decay: ²³⁸U → ²³⁴Th + ⁴He; used in dating, medicine, energy"
        },
        {
          question: "What is nuclear fission and fusion?",
          options: ["Bonding types", "Fission (heavy nuclei split, releasing energy); Fusion (light nuclei combine, releasing energy)", "Chemical reactions", "Always exothermic"],
          correct: 1,
          explanation: "Fission: ²³⁵U + n → fission products + 2-3 neutrons + 200 MeV; Fusion: powers the sun"
        },
        {
          question: "What are hydrocarbons and how are they classified?",
          options: ["Only gases", "Carbon-hydrogen compounds; alkanes (C-C single bonds), alkenes (C=C), alkynes (C≡C)", "Water based", "No types"],
          correct: 1,
          explanation: "Hydrocarbons: methane (CH₄), ethene (C₂H₄), acetylene (C₂H₂); basis of organic chemistry"
        },
        {
          question: "What are aromatic compounds?",
          options: ["Just perfume", "Compounds with benzene ring (C₆H₆); resonance stability, unusual reactivity", "All plants", "No structure"],
          correct: 1,
          explanation: "Benzene: planar, 6 carbon ring with delocalized electrons; undergoes substitution, not addition"
        },
        {
          question: "What is structural isomerism in organic chemistry?",
          options: ["No relationship", "Different arrangements of atoms with same molecular formula; different properties", "Same structure", "Impossible"],
          correct: 1,
          explanation: "Isomers: C₄H₁₀ has butane (straight chain) and isobutane (branched); different boiling points"
        }
      ]
    },
    20: {
      type: "matching",
      title: "Organic Chemistry & Global Cycles",
      description: "Match concepts from Lesson 10 videos: Hydrocarbon Derivatives | Nomenclature | Polymers | Carbon Cycle | Synthesis Overview",
      matchPairs: [
        { answer: "org1", term: "Hydrocarbon Derivatives", definition: "Alcohols (-OH), aldehydes (CHO), ketones (C=O), carboxylic acids (COOH)" },
        { answer: "org2", term: "Nomenclature", definition: "IUPAC naming system for organic compounds based on structure and functional groups" },
        { answer: "org3", term: "Polymers", definition: "Large molecules from repeating units (monomers); proteins, DNA, plastics" },
        { answer: "org4", term: "Carbon Cycle", definition: "CO₂ ↔ atmosphere ↔ organisms; photosynthesis captures, respiration/decomposition releases" },
        { answer: "org5", term: "Synthesis & Reactions", definition: "Planning multi-step reactions; retrosynthesis from target to starting materials" }
      ]
    },

    // PHYSICS GAMES (21-30)
    21: {
      type: "matching",
      title: "Motion & Calculus",
      description: "Match concepts from Lesson 1 videos: Motion | Derivatives | Vectors (2D) | Newton's 1st Law | Newton's 2nd Law",
      matchPairs: [
        { answer: "phys1", term: "Motion", definition: "Change in position over time; described by velocity and acceleration" },
        { answer: "phys2", term: "Derivatives", definition: "Mathematical tool; dx/dt = velocity, dv/dt = acceleration" },
        { answer: "phys3", term: "Vectors (2D)", definition: "Quantities with magnitude and direction; resolved into x and y components" },
        { answer: "phys4", term: "Newton's 1st Law", definition: "Objects remain at rest or in motion unless external force acts (inertia)" },
        { answer: "phys5", term: "Newton's 2nd Law", definition: "F = ma; net force causes acceleration proportional to force and mass" }
      ]
    },
    22: {
      type: "quiz",
      title: "Forces, Friction & Circular Motion",
      description: "Test Lesson 2 videos: Friction | Centripetal Acceleration | Gravity | Work, Energy & Power | Kinetic & Potential Energy",
      questions: [
        {
          question: "What is friction and what types exist?",
          options: ["No friction", "Resistance to motion; static (prevents motion), kinetic (during motion), f = μN", "Only on Earth", "Always harmful"],
          correct: 1,
          explanation: "Friction: coefficient μ varies by surfaces; static > kinetic; heat loss in motion"
        },
        {
          question: "What is centripetal acceleration and centripetal force?",
          options: ["Outward", "Directed toward center; a_c = v²/r, F_c = mv²/r for circular motion", "Gravity", "Tangential"],
          correct: 1,
          explanation: "Circular motion: centripetal force (tension, gravity) provides center-directed acceleration"
        },
        {
          question: "What is gravitational force and how does it relate to weight?",
          options: ["Only on Earth", "F = GMm/r² (universal); on Earth: W = mg", "Not a force", "Constant everywhere"],
          correct: 1,
          explanation: "Gravity: weaker with distance (r²), stronger with mass; g = 9.8 m/s² on Earth"
        },
        {
          question: "What is work and how does it relate to energy?",
          options: ["Effort only", "Work = F⋅d⋅cos(θ); equals change in kinetic energy (work-energy theorem)", "No relationship", "Only positive"],
          correct: 1,
          explanation: "Work-energy theorem: W_net = ΔKE; positive work increases speed"
        },
        {
          question: "How do kinetic and potential energy transform?",
          options: ["No transformation", "KE = ½mv²; PE = mgh; transforms at different heights/speeds during motion", "Only one exists", "Separate systems"],
          correct: 1,
          explanation: "Energy conservation: KE + PE = constant (ignoring friction); at top of hill PE max, at bottom KE max"
        }
      ]
    },
    23: {
      type: "matching",
      title: "Momentum & Rotational Mechanics",
      description: "Match concepts from Lesson 3 videos: Collisions | Rotational Motion | Torque | Statics 1 | Statics 2",
      matchPairs: [
        { answer: "mom1", term: "Momentum", definition: "p = mv; conserved in collisions when no external forces" },
        { answer: "mom2", term: "Impulse", definition: "J = FΔt = Δ(mv); force × time changes momentum" },
        { answer: "mom3", term: "Rotational Motion", definition: "Angular velocity ω, angular acceleration α, torque τ = Iα" },
        { answer: "mom4", term: "Torque", definition: "τ = r × F; causes rotational acceleration; τ = Iα" },
        { answer: "mom5", term: "Statics (Equilibrium)", definition: "ΣF = 0 and Στ = 0; no motion, no rotation" }
      ]
    },
    24: {
      type: "quiz",
      title: "Fluids & Oscillations",
      description: "Master Lesson 4 topics: Fluids at Rest | Fluids in Motion | Simple Harmonic Motion | Traveling Waves 1 | Traveling Waves 2",
      questions: [
        {
          question: "What is pressure and how is it related to force?",
          options: ["Force only", "P = F/A; force per unit area; increases with depth: P = ρgh", "No relationship", "Area independent"],
          correct: 1,
          explanation: "Pressure: water pressure increases 1 atm per 10 meters depth; applies in all directions"
        },
        {
          question: "What is buoyancy and Archimedes' principle?",
          options: ["Downward force", "Upward force = weight of displaced fluid; objects float if buoyancy = weight", "Gravity effect", "Only in air"],
          correct: 1,
          explanation: "Buoyancy: F_b = ρVg; ship floats because displaced water weight equals ship weight"
        },
        {
          question: "What is flow rate and continuity equation?",
          options: ["No pattern", "Q = Av (area × velocity); conserved: A₁v₁ = A₂v₂ (incompressible fluids)", "Only for gases", "Varies randomly"],
          correct: 1,
          explanation: "Continuity: narrow pipe → faster flow, wide pipe → slower flow; water incompressible"
        },
        {
          question: "What is simple harmonic motion (SHM)?",
          options: ["Projectile motion", "Oscillation with restoring force proportional to displacement; F = -kx, a = -ω²x", "Circular motion", "No pattern"],
          correct: 1,
          explanation: "SHM: springs (F = -kx), pendulums; periodic with constant frequency and period"
        },
        {
          question: "What are traveling waves and how do they propagate?",
          options: ["Stationary only", "Disturbances traveling through medium; v = fλ; reflect, refract, interfere", "No speed", "Energy stays in place"],
          correct: 1,
          explanation: "Waves: mechanical (need medium) vs electromagnetic (light); carry energy without moving matter"
        }
      ]
    },
    25: {
      type: "matching",
      title: "Sound & Thermal Physics",
      description: "Match concepts from Lesson 5 videos: Sound | Music Physics | Temperature | Kinetic Theory | Phase Changes",
      matchPairs: [
        { answer: "sound1", term: "Sound", definition: "Mechanical wave (needs medium); longitudinal; speed depends on medium" },
        { answer: "sound2", term: "Music Physics", definition: "Frequency determines pitch; harmonics create timbre; resonance amplifies sound" },
        { answer: "sound3", term: "Temperature", definition: "Measure of average kinetic energy of particles; T = average KE" },
        { answer: "sound4", term: "Kinetic Theory", definition: "Ideal gas: particles move randomly; pressure = collisions on walls; PV = NkT" },
        { answer: "sound5", term: "Phase Changes", definition: "Melting, freezing, vaporization, condensation; requires latent heat energy" }
      ]
    },
    26: {
      type: "quiz",
      title: "Thermodynamics & Electrostatics",
      description: "Test Lesson 6 videos: 1st Law Thermodynamics | Thermodynamics & Engines | Heat Engines | Electric Charge | Electric Fields",
      questions: [
        {
          question: "What is the First Law of Thermodynamics?",
          options: ["Energy decreases", "ΔU = Q - W; change in internal energy = heat added - work done", "No transfers", "Heat only"],
          correct: 1,
          explanation: "1st Law: energy conserved; Q in increases U, W out decreases U"
        },
        {
          question: "What is the Second Law of Thermodynamics?",
          options: ["Energy increases", "Entropy increases; heat flows from hot to cold; useful work limited", "No direction", "Reversible"],
          correct: 1,
          explanation: "2nd Law: entropy (disorder) always increases; irreversible processes; efficiency < 100%"
        },
        {
          question: "What is a heat engine and efficiency?",
          options: ["Only combustion", "Device converting heat to work; efficiency η = W/Q_in = 1 - Q_out/Q_in", "Cooling only", "100% possible"],
          correct: 1,
          explanation: "Heat engines: car engines, power plants; Carnot efficiency = 1 - T_cold/T_hot (max theoretical)"
        },
        {
          question: "What is electric charge and Coulomb's Law?",
          options: ["Only positive", "Force between charges: F = kq₁q₂/r² (attractive opposite, repulsive same)", "No force", "Temperature dependent"],
          correct: 1,
          explanation: "Coulomb's Law: similar to gravity but charges can repel; much stronger than gravity"
        },
        {
          question: "What is an electric field and electric force?",
          options: ["Only from batteries", "E = F/q (field strength); force on charge: F = qE; points away from positive", "No fields", "Distance independent"],
          correct: 1,
          explanation: "Electric field: invisible influence of charges; strength decreases with distance (1/r²)"
        }
      ]
    },
    27: {
      type: "memory",
      title: "Voltage & DC Circuits",
      description: "Flip and match pairs from Lesson 7 videos: Voltage & Capacitors | Current | Resistors & Batteries | Circuit Analysis | Capacitors & Kirchhoff",
      pairs: [
        { term: "Voltage (V)", answer: "elec1" },
        { term: "Electric potential difference; energy per charge (Volts); battery provides EMF", answer: "elec1" },
        { term: "Current (I)", answer: "elec2" },
        { term: "Flow of charge; I = V/R (Ohm's Law); measured in Amperes", answer: "elec2" },
        { term: "Resistance (R)", answer: "elec3" },
        { term: "Opposition to current; R = ρL/A; higher resistance → lower current", answer: "elec3" },
        { term: "Power (P)", answer: "elec4" },
        { term: "Rate of energy transfer; P = VI = I²R = V²/R (Watts)", answer: "elec4" },
        { term: "Capacitor", answer: "elec5" },
        { term: "Device storing charge; C = Q/V; behaves like open circuit in DC", answer: "elec5" },
        { term: "Kirchhoff's Laws", answer: "elec6" },
        { term: "Junction rule: ΣI_in = ΣI_out; Loop rule: ΣV = 0 around closed loop", answer: "elec6" }
      ]
    },
    28: {
      type: "dragdrop",
      title: "Magnetism & Induction",
      description: "Organize concepts from Lesson 8 videos into zones: Magnetism | Ampere's Law | Electromagnetic Induction | Self-Inductance | Maxwell's Equations",
      dropZones: [
        { name: "Magnetic Fields", items: ["Magnetic field lines", "Pole strength", "Magnetic force on charges", "Lorentz force F = qvB"] },
        { name: "Ampere's Law", items: ["Current creates magnetic field", "Magnetic field circles around wire", "Right-hand rule for direction", "Electromagnets"] },
        { name: "Electromagnetic Induction", items: ["Faraday's Law", "Changing magnetic flux induces EMF", "Induced current opposes change (Lenz's Law)", "Transformers step up/down voltage"] },
        { name: "AC Generators", items: ["Rotating coil in field", "Produces alternating current", "Frequency = rotation frequency", "Voltage changes sinusoidally"] },
        { name: "Maxwell's Vision", items: ["Changing electric field creates magnetic field", "Changing magnetic field creates electric field", "Light is electromagnetic wave", "Unified electricity and magnetism"] }
      ]
    },
    29: {
      type: "quiz",
      title: "Optics & Light",
      description: "Master Lesson 9 topics: Light | Geometric Optics | Lenses & Mirrors | Optical Instruments | Thin Films & Interference",
      questions: [
        {
          question: "What is light and what are its properties?",
          options: ["Just visible", "Electromagnetic wave with c = 3×10⁸ m/s; particle (photon) and wave properties", "Only particles", "No properties"],
          correct: 1,
          explanation: "Light: dual nature; wave (f, λ, diffraction) and particle (E = hf, momentum)"
        },
        {
          question: "What is geometric optics and ray approximation?",
          options: ["Only for lenses", "Light travels in straight rays; bends at boundaries (refraction); reflects (reflection)", "No patterns", "Wave only"],
          correct: 1,
          explanation: "Ray optics: valid when wavelength << object sizes; explains mirrors, lenses, vision"
        },
        {
          question: "How do mirrors and lenses form images?",
          options: ["Randomly", "Curved mirrors/lenses focus light; lens equation 1/f = 1/d_o + 1/d_i", "No rules", "Direct only"],
          correct: 1,
          explanation: "Lenses converge (convex) or diverge (concave) light; magnification m = h_i/h_o = -d_i/d_o"
        },
        {
          question: "What are optical instruments and how do they work?",
          options: ["No purpose", "Microscope (magnifies small), telescope (magnifies distant), eye (focuses light on retina)", "Decoration", "Random"],
          correct: 1,
          explanation: "Microscope: objective lens (high magnification), eyepiece; telescope: objective creates image at focal point"
        },
        {
          question: "What is thin film interference and diffraction?",
          options: ["Only for thick films", "Waves reflect off thin film surfaces, interfere (constructive/destructive); causes colors", "No pattern", "Light only"],
          correct: 1,
          explanation: "Thin film: 2t = mλ (constructive), (m+½)λ (destructive); soap bubbles, oil on water rainbows"
        }
      ]
    },
    30: {
      type: "matching",
      title: "Modern Physics & Cosmology",
      description: "Match concepts from Lesson 10 videos: Special Relativity | Quantum Mechanics 1 | Quantum Mechanics 2 | Nuclear Physics | Astrophysics",
      matchPairs: [
        { answer: "mod1", term: "Special Relativity", definition: "Time and space relative; E = mc²; time dilation at high speeds; mass-energy equivalence" },
        { answer: "mod2", term: "Quantum Mechanics", definition: "Particles behave as waves; Schrödinger equation; uncertainty principle; photons/electrons duality" },
        { answer: "mod3", term: "Nuclear Physics", definition: "Nucleus contains protons/neutrons; strong force binds; radioactive decay; binding energy" },
        { answer: "mod4", term: "Astrophysics", definition: "Stars: gravity, fusion, lifecycle; black holes; expanding universe; cosmology" },
        { answer: "mod5", term: "Quantum to Classical", definition: "Quantum mechanics explains atoms/molecules; emerges to classical mechanics at large scales" }
      ]
    },

    // ENVIRONMENTAL SCIENCE GAMES (31-40)
    31: {
      type: "matching",
      title: "Foundations & History of Life",
      description: "Match concepts from Lesson 31 videos: Origins of Life | Simple Organisms | Evolution Begins | Early Life Forms | Earth History",
      matchPairs: [
        { answer: "env1", term: "Photosynthesis", definition: "Process converting light energy to chemical energy (glucose); produces oxygen as byproduct; basis for food chains" },
        { answer: "env2", term: "Early Life", definition: "Simple prokaryotes 3.8 billion years ago; anaerobic bacteria, then photosynthetic cyanobacteria producing oxygen" },
        { answer: "env3", term: "Cell Origins", definition: "Endosymbiotic theory: mitochondria/chloroplasts were free-living bacteria engulfed by eukaryotic cells" },
        { answer: "env4", term: "Geological Time", definition: "Eons, eras, periods organize Earth's history; radiometric dating and fossils provide timescale (4.6 billion years)" },
        { answer: "env5", term: "Cambrian Explosion", definition: "Rapid animal diversification 540-530 million years ago; fossil record shows emergence of major phyla" }
      ]
    },
    32: {
      type: "quiz",
      title: "Plant Biology & Evolution",
      description: "Test Lesson 32 topics: Plant Structure | Photosynthesis Light | Photosynthesis Dark | Plant Evolution | Vascular Tissues",
      questions: [
        {
          question: "What is the light-dependent reaction and where does it occur?",
          options: ["In stroma making glucose", "In thylakoids: light splits water, produces ATP and NADPH; provides energy for Calvin cycle", "Only at night", "No location"],
          correct: 1,
          explanation: "Light reactions: photosystems I and II in thylakoids; P680 and P700 chlorophyll capture photons; electron transport creates ATP and NADPH"
        },
        {
          question: "What is the Calvin cycle and what does it produce?",
          options: ["Just light reaction", "In stroma: CO2 + ATP + NADPH → glucose (G3P); occurs even without direct light", "No products", "Only in summer"],
          correct: 1,
          explanation: "Calvin cycle (dark reactions): fixation (CO2 → 3-PG), reduction (ATP/NADPH used), regeneration (RuBP); net gain 1 glucose per 3 CO2"
        },
        {
          question: "How did plants evolve from aquatic to terrestrial?",
          options: ["Instantly", "Developed roots (water uptake), vascular tissue (transport), cuticle (waterproofing), stomata (gas exchange)", "Never evolved", "Only on islands"],
          correct: 1,
          explanation: "Plant adaptations: bryophytes (no vascular), pteridophytes (ferns), gymnosperms (conifers), angiosperms (flowering); each innovation enabled new habitats"
        },
        {
          question: "What are the three plant tissue systems and their functions?",
          options: ["Only one system", "Dermal (epidermis, cuticle protection), vascular (xylem water, phloem sugars), ground (parenchyma storage)", "No distinction", "Physical only"],
          correct: 1,
          explanation: "Tissue integration: xylem transports water upward (capillary action, transpiration pull); phloem transports sugars downward via pressure flow"
        },
        {
          question: "Why were vascular plants so successful?",
          options: ["No advantage", "Xylem and phloem allow water/nutrient transport; enabled large plants and colonization of dry land", "Never used", "Only decorative"],
          correct: 1,
          explanation: "Vascular success: increased size, reduced water loss, spread to deserts/mountains; angiosperms dominate (flowering plants ~80% of species)"
        }
      ]
    },
    33: {
      type: "matching",
      title: "Botany - Reproduction & Senses",
      description: "Match concepts from Lesson 33 videos: Flower Structure | Reproduction Cycles | Pollination | Seed Dispersal | Plant Sensing",
      matchPairs: [
        { answer: "bot1", term: "Flower Parts", definition: "Calyx (sepals), corolla (petals), stamen (male: anther + filament), carpel (female: stigma, style, ovary)" },
        { answer: "bot2", term: "Double Fertilization", definition: "Unique to angiosperms: one sperm fertilizes egg (zygote), other fertilizes polar nuclei (endosperm for nutrition)" },
        { answer: "bot3", term: "Seed Dispersal", definition: "Wind (winged seeds), water (buoyant), animals (tasty fruits eaten and excreted far away); increases population spread" },
        { answer: "bot4", term: "Tropisms", definition: "Directional growth responses: phototropism (toward light), gravitropism (roots down), hydrotropism (toward water)" },
        { answer: "bot5", term: "Plant Hormones", definition: "Auxins (growth, phototropism), gibberellins (stem elongation), ethylene (ripening), ABA (stress response)" }
      ]
    },
    34: {
      type: "quiz",
      title: "Zoology - Insects to Reptiles",
      description: "Master Lesson 34 topics: Arthropod Diversity | Insect Life | Aquatic Invertebrates | Fish Evolution | Amphibians & Reptiles",
      questions: [
        {
          question: "What characteristics define arthropods and why are they successful?",
          options: ["Only worms", "Exoskeleton, jointed legs, segmented body; arthropods are 80% of animal species", "No special traits", "Only terrestrial"],
          correct: 1,
          explanation: "Arthropod success: exoskeleton (protection, water retention), wings (flight), compound eyes (vision); insects, arachnids, crustaceans"
        },
        {
          question: "What is insect metamorphosis and why is it important?",
          options: ["No change", "Complete (egg-larva-pupa-adult) vs incomplete (egg-nymph-adult); complete allows larva and adult to use different resources", "Same as growth", "Only in butterflies"],
          correct: 1,
          explanation: "Metamorphosis advantage: caterpillar eats plants, adult butterfly pollinates flowers; reduces competition between life stages"
        },
        {
          question: "What adapted fish to aquatic life?",
          options: ["Nothing special", "Gills (oxygen extraction), fins (movement), streamlined body, scales (protection), cold-blooded metabolism", "They swam", "Random"],
          correct: 1,
          explanation: "Fish adaptations: lateral line system (detect pressure waves), operculum (gill protection), buoyancy (swim bladder); dominated aquatic life"
        },
        {
          question: "How did amphibians represent a major evolutionary transition?",
          options: ["No transition", "Evolved from fish ~375 million years ago; limbs (from fins), lungs (air breathing), moist skin (permeable); metamorphosis shows both lives", "Instant", "Not real"],
          correct: 1,
          explanation: "Amphibian bridge: eggs in water (larval gills), tadpole metamorphosis to adult (lungs, limbs); salamanders, frogs, caecilians still aquatic-terrestrial"
        },
        {
          question: "What innovations define reptiles?",
          options: ["Same as fish", "Dry skin (keratin scales), eggs with shell (amniote), water-conserving kidneys, cold-blooded; enabled desert colonization", "Always wet", "No special traits"],
          correct: 1,
          explanation: "Reptile success: amniotic egg independent of water; scales prevent desiccation; includes snakes, lizards, turtles, crocodilians"
        }
      ]
    },
    35: {
      type: "memory",
      title: "Zoology - Behavior & Interaction",
      description: "Flip and match pairs from Lesson 35 videos: Animal Behavior | Communication | Social Structure | Migration | Symbiosis",
      pairs: [
        { term: "Innate behavior", answer: "behavior1" },
        { term: "Genetically programmed; bird builds nest instinctively without prior experience", answer: "behavior1" },
        { term: "Learned behavior", answer: "behavior2" },
        { term: "Acquired through experience; dog learns to sit for food reward (classical/operant conditioning)", answer: "behavior2" },
        { term: "Communication", answer: "behavior3" },
        { term: "Signal conveys information: firefly flash (visual), bird song (acoustic), pheromones (chemical)", answer: "behavior3" },
        { term: "Migration", answer: "behavior4" },
        { term: "Seasonal movement for breeding/feeding: monarch butterflies (3000 km), arctic terns (pole to pole), salmon (natal return)", answer: "behavior4" },
        { term: "Territoriality", answer: "behavior5" },
        { term: "Defending area from rivals; animals mark territory with scent, songs, displays; reduces competition", answer: "behavior5" },
        { term: "Symbiosis", answer: "behavior6" },
        { term: "Close relationship: mutualism (both benefit), commensalism (one benefits), parasitism (one harms)", answer: "behavior6" }
      ]
    },
    36: {
      type: "dragdrop",
      title: "Ecology - Populations & Growth",
      description: "Organize Lesson 36 concepts into zones: Population Measures | Growth Models | Regulation | Human Demography | Sustainability",
      dropZones: [
        { name: "Population Ecology", items: ["Population size (N)", "Density (per unit area)", "Age structure (age distribution)", "Birth rate, death rate, growth rate"] },
        { name: "Exponential Growth", items: ["Unlimited resources", "J-shaped curve", "Nt = N0(λ)^t", "Bacteria in lab", "Unsustainable long-term"] },
        { name: "Logistic Growth", items: ["Limited resources", "S-shaped curve", "Carrying capacity (K)", "Intraspecific competition", "Reaching equilibrium"] },
        { name: "Human Population", items: ["1 billion (1800) to 8 billion (2024)", "Demographic transition (high to low fertility)", "Aging in developed countries", "Rapid growth in developing regions"] },
        { name: "Limiting Factors", items: ["Predation controls prey", "Food availability limits herbivores", "Nest sites limit birds", "Disease in dense populations", "Competition for resources"] }
      ]
    },
    37: {
      type: "quiz",
      title: "Ecology - Ecosystems & Cycles",
      description: "Test Lesson 37 topics: Energy Flow | Food Chains | Nutrient Cycles | Succession | Conservation",
      questions: [
        {
          question: "What is the energy flow in ecosystems and what happens at each trophic level?",
          options: ["All same", "10% rule: only ~10% of energy passed to next level (90% lost as heat); producers → herbivores → carnivores", "No loss", "Equal transfer"],
          correct: 1,
          explanation: "Energy pyramid: 1000 units plants → 100 herbivores → 10 carnivores; explains why vegetarian diets more sustainable (direct plant energy)"
        },
        {
          question: "What is the water cycle and its components?",
          options: ["Only rain", "Evaporation (sun heats water), transpiration (plants release water), condensation (cooling forms clouds), precipitation, infiltration, runoff", "No cycle", "Linear"],
          correct: 1,
          explanation: "Water cycle: renewable resource (but freshwater limited); pollution affects all components; climate change alters precipitation patterns"
        },
        {
          question: "What is the nitrogen cycle and what roles do bacteria play?",
          options: ["No cycle", "N2 (atmosphere) → nitrogen-fixing bacteria (NH3) → nitrifying bacteria (NO3-) → plants → animals → decomposition → soil", "Only in air", "No bacteria"],
          correct: 1,
          explanation: "N cycle: atmospheric N2 inert; bacteria convert it to usable forms (ammonia, nitrate); limits productivity; excess fertilizer causes eutrophication"
        },
        {
          question: "What is the carbon cycle and how do humans affect it?",
          options: ["No human effect", "CO2 → photosynthesis → glucose → respiration/decomposition → CO2; humans add fossil fuel CO2, doubling atmospheric CO2", "Natural only", "Minor impact"],
          correct: 1,
          explanation: "Carbon: atmospheric CO2 300 ppm (1900) → 420 ppm (2024); excess causes global warming; ocean acidification, ecosystem disruption"
        },
        {
          question: "What are the phosphorus and sulfur cycles?",
          options: ["Same as others", "P: rock weathering → soil → organisms → decomposition (no atmospheric phase); S: similar, crucial for proteins", "No cycles", "Limited importance"],
          correct: 1,
          explanation: "P and S cycles: sedimentary (no gas phase); P shortage limits agriculture (phosphate mining); S involved in acid rain"
        }
      ]
    },
    38: {
      type: "matching",
      title: "Biomes & Biodiversity",
      description: "Match biome characteristics from Lesson 38 videos: Tropical Rainforest | Temperate Forest | Grasslands | Desert | Tundra | Marine",
      matchPairs: [
        { answer: "biome1", term: "Tropical Rainforest", definition: "Hot year-round, high rainfall, highest biodiversity (~50% species on ~7% of land), dense layering, fast nutrient cycling" },
        { answer: "biome2", term: "Temperate Forest", definition: "Seasonal, moderate rainfall, deciduous/coniferous trees, nutrient-rich soil, supports diverse mammals" },
        { answer: "biome3", term: "Grassland", definition: "Moderate rainfall, grasses dominate (grazing pressure), fire and drought tolerant, large herbivore herds" },
        { answer: "biome4", term: "Desert", definition: "Low rainfall (<25 cm/year), extreme heat, sparse vegetation (succulents, deep roots), nocturnal/burrowing animals" },
        { answer: "biome5", term: "Tundra", definition: "Extreme cold, permafrost, low precipitation, short growing season, lichens and mosses, arctic animals (musk ox, lemmings)" }
      ]
    },
    39: {
      type: "quiz",
      title: "The Future of Life",
      description: "Master Lesson 39 topics: Evolution Processes | Speciation | Extinction Risk | Conservation Priority | Environmental Restoration",
      questions: [
        {
          question: "What are the major biodiversity threats today?",
          options: ["No threats", "Habitat loss (deforestation), climate change, pollution, overexploitation, invasive species; sixth mass extinction ongoing", "Only climate", "Minor issues"],
          correct: 1,
          explanation: "Extinction rate: currently 100-1000x background rate; species loss before discovery (many insects unidentified)"
        },
        {
          question: "What is conservation prioritization?",
          options: ["Protect all equally", "Focus on hotspots (high endemism, threat), keystone species (high ecosystem impact), flagship species (public appeal)", "Impossible to choose", "Random"],
          correct: 1,
          explanation: "Priority: Madagascar (unique species), tropical rainforests (biodiversity), coral reefs (productivity); limited resources require hard choices"
        },
        {
          question: "How does climate change threaten biodiversity?",
          options: ["No threat", "Range shifts too fast for adaptation, phenological mismatches (timing disruption), ocean acidification, coral bleaching", "Only beneficial", "Some species win"],
          correct: 1,
          explanation: "Climate impacts: migration corridors blocked by development, mountain-top species have nowhere higher to go, marine species adapt slowly"
        },
        {
          question: "What conservation strategies work best?",
          options: ["No strategy works", "Protected areas (reserves, parks), wildlife corridors (allow migration), habitat restoration, sustainable practices, captive breeding", "Zoos only", "Legislation alone"],
          correct: 1,
          explanation: "Conservation success: gray wolves restored, Arabian oryx (extinct wild, bred in zoos, reintroduced), bald eagles recovered"
        },
        {
          question: "What is sustainable development and can it be achieved?",
          options: ["Not possible", "Meeting human needs without depleting future resources; requires green energy, sustainable agriculture, circular economy", "No solutions", "Too expensive"],
          correct: 1,
          explanation: "Sustainability examples: Costa Rica (protected forests, renewable energy), Denmark (wind power); requires long-term thinking, political will"
        }
      ]
    },
    40: {
      type: "matching",
      title: "Capstone: Synthesis & Review",
      description: "Match integrated concepts from all Lesson 31-39 topics: Systems Thinking | Interconnections | Global Change | Solutions | Future",
      matchPairs: [
        { answer: "synth1", term: "Biotic & Abiotic Factors", definition: "Ecosystems integrate living organisms with climate, soil, water; everything interconnected; change in one affects all" },
        { answer: "synth2", term: "Trophic Levels & Energy", definition: "Energy flows through food chains; entropy increases (disorder); productivity depends on photosynthesis" },
        { answer: "synth3", term: "Population & Community", definition: "Populations compete (limiting resources), predators regulate prey, species coevolve; diversity provides stability" },
        { answer: "synth4", term: "Evolution & Adaptation", definition: "Natural selection shapes species to environments; speciation creates biodiversity; extinction removes it" },
        { answer: "synth5", term: "Human-Dominated World", definition: "Humans now major planetary force (Anthropocene); conservation and restoration now require active human management" }
      ]
    },

    // ECONOMICS GAMES (41-50)
    41: {
      type: "matching",
      title: "Foundation of Choice",
      description: "Match economics concepts from Lesson 41 videos: Scarcity | Opportunity Cost | Supply & Demand | Systems | Institutions",
      matchPairs: [
        { answer: "econ1", term: "Scarcity", definition: "Unlimited wants vs limited resources; forces choices about production, distribution, consumption" },
        { answer: "econ2", term: "Opportunity Cost", definition: "Value of next best alternative foregone; going to college costs wages not earned" },
        { answer: "econ3", term: "Specialization", definition: "Focusing on comparative advantage; enables trade and increases total production" },
        { answer: "econ4", term: "Supply & Demand", definition: "Price equilibrium balances quantity supplied = demanded; shortage (low P) vs surplus (high P)" },
        { answer: "econ5", term: "Economic Systems", definition: "Command (government directs), Market (price signals), Mixed (combination); different incentives" }
      ]
    },
    42: {
      type: "quiz",
      title: "Measuring Economic Health",
      description: "Master Lesson 42 topics: GDP | Inflation | Growth | Indicators | Cycles",
      questions: [
        {
          question: "What is GDP and what are its limitations?",
          options: ["Accurate measure", "Total value of goods/services produced annually; doesn't count unpaid work, environmental damage, inequality", "Perfect measure", "No problems"],
          correct: 1,
          explanation: "GDP: ~$27 trillion US (2023); indicates size not well-being; includes 'bads' (healthcare for disease)"
        },
        {
          question: "What is inflation and how does it affect different groups?",
          options: ["No effect", "Rising price level; harms savers (money loses value), benefits borrowers, reduces purchasing power", "Always bad", "Always good"],
          correct: 1,
          explanation: "Inflation: 2% annual target (Fed); 1960s-70s 'stagflation' (high inflation + unemployment); 1980s Volcker broke inflation"
        },
        {
          question: "What is the business cycle?",
          options: ["Linear growth", "Expansion-peak-contraction-trough; driven by confidence, investment, employment cycles", "Stable", "No pattern"],
          correct: 1,
          explanation: "Cycles: 2008 Great Recession (6 years contraction), 2020 COVID (1 month, sharp recovery); unemployment lag peaks after contraction"
        },
        {
          question: "What are economic indicators and what do they predict?",
          options: ["No indicators", "Leading (stock market, consumer confidence), lagging (unemployment); predict recessions", "Irrelevant", "No predictive value"],
          correct: 1,
          explanation: "Indicators: inversion of yield curve predicts 7-8 months recession 90% accuracy; used by Fed for policy decisions"
        },
        {
          question: "How does productivity growth drive long-term prosperity?",
          options: ["No link", "Output per worker increases via tech, education, capital; compounds over decades (compound effect dramatic)", "No growth", "One-time"],
          correct: 1,
          explanation: "Productivity: 2% annual growth → income doubles in 35 years; 1% growth → doubles in 70 years; small differences matter greatly"
        }
      ]
    },
    43: {
      type: "memory",
      title: "Fiscal Policy & Government",
      description: "Flip and match pairs from Lesson 43 videos: Taxation | Government Spending | Deficits | Multiplier | Stimulus",
      pairs: [
        { term: "Fiscal Policy", answer: "fiscal1" },
        { term: "Government spending/taxation to influence economy; expansionary (boost growth), contractionary (cool inflation)", answer: "fiscal1" },
        { term: "Tax Multiplier", answer: "fiscal2" },
        { term: "$1 tax cut → consumers spend 75% → secondary spending; multiplier ~3-4 depending on economy", answer: "fiscal2" },
        { term: "National Deficit", answer: "fiscal3" },
        { term: "Annual shortfall (spending > revenue); creates government debt; high debt crowns out private investment", answer: "fiscal3" },
        { term: "Price Controls", answer: "fiscal4" },
        { term: "Ceilings (shortage), floors (surplus); create unintended consequences; market distortion costly", answer: "fiscal4" },
        { term: "Externalities", answer: "fiscal5" },
        { term: "Costs/benefits not captured by price; pollution (negative), education (positive); regulation, taxation correct", answer: "fiscal5" },
        { term: "Stimulus Package", answer: "fiscal6" },
        { term: "Government spending to boost demand during recession; 2008 TARP, 2020 COVID relief; multiplier effect spreads benefit", answer: "fiscal6" }
      ]
    },
    44: {
      type: "dragdrop",
      title: "Money & Central Banking",
      description: "Organize Lesson 44 concepts into zones: Money Supply | Fed Tools | Interest Rates | Financial Crisis | Banking",
      dropZones: [
        { name: "Money Supply", items: ["M1: cash, checking accounts", "M2: savings, money market", "Money multiplier: 10% reserve → $10 loans from $1 deposit", "Inflation: too much money (MV=PQ)", "Deflation: insufficient money, debt burden rises"] },
        { name: "Fed Tools", items: ["Open market operations: buy/sell bonds", "Discount rate: lending rate to banks", "Reserve requirements: lower → more loans", "Quantitative easing: buy long-term bonds", "Forward guidance: communicate policy path"] },
        { name: "Interest Rates", items: ["Fed funds rate: overnight lending between banks", "Prime rate: for creditworthy borrowers", "Yield curve: normal (upsloping) vs inverted (recession signal)", "Real vs nominal: accounts for inflation", "Negative rates: chase deposits to real assets"] },
        { name: "2008 Financial Crisis", items: ["Housing bubble: subprime mortgages bundled", "Derivatives: toxic securities hide risk", "Lehman collapse: bank failures cascade", "Credit freeze: lending stopped, economy froze", "Government bailout: Fed/Treasury intervened massively"] },
        { name: "Banking System", items: ["Fractional reserve: banks lend out deposits", "Bank run: panic withdrawal destroys solvent bank", "FDIC insurance: protects deposits", "Leverage: amplifies gains/losses", "Systemic risk: failure spreads (too big to fail)"] }
      ]
    },
    45: {
      type: "quiz",
      title: "Global Trade & Finance",
      description: "Master Lesson 45 topics: Comparative Advantage | Exchange Rates | Trade Wars | Globalization | Institutions",
      questions: [
        {
          question: "What is comparative advantage?",
          options: ["No trade", "Even if country better at everything, specialization in comparative advantage gains trade for all; Ricardo's insight", "All countries same", "Harmful always"],
          correct: 1,
          explanation: "Comparative advantage: if US better at both cars/wheat, but relatively better at cars, should specialize cars, import wheat"
        },
        {
          question: "How do exchange rates affect trade?",
          options: ["Irrelevant", "Strong $ makes exports expensive (hurt manufacturers), imports cheap (help consumers); affects competitiveness", "Always stable", "Government control"],
          correct: 1,
          explanation: "Exchange rates: 1 EUR = $1.10; if $ strengthens to 1 EUR = $1.20, European cars cheaper in US (boost imports, reduce exports)"
        },
        {
          question: "What is the balance of trade?",
          options: ["Always balanced", "Exports - Imports; US deficit with China $300B+ (more imports); reflects savings rate, growth", "No relationship", "Irrelevant"],
          correct: 1,
          explanation: "Trade deficit: not necessarily bad (capital inflows finance investment); but concentrated job loss (manufacturing decline in Midwest)"
        },
        {
          question: "What is globalization?",
          options: ["New phenomenon", "Integration via trade, investment, technology; creates winners (efficient firms, cheap goods) and losers (displaced workers)", "Always beneficial", "Always harmful"],
          correct: 1,
          explanation: "Globalization: off-shoring reduces manufacturing jobs in US, creates jobs in China; income inequality increases locally (trade adjustment difficult)"
        },
        {
          question: "What are trade agreements and their effects?",
          options: ["No agreements", "NAFTA, TPP, bilateral: reduce tariffs, boost trade; but unequal gains (some industries devastated, others boom)", "All beneficial", "Never help"],
          correct: 1,
          explanation: "Trade deals: net positive for economy but concentrated costs (coal workers suffer while tech benefits); adjustment assistance insufficient"
        }
      ]
    },
    46: {
      type: "matching",
      title: "Microeconomics & Labor Markets",
      description: "Match concepts from Lesson 46 videos: Costs | Competition | Profit | Labor | Human Capital",
      matchPairs: [
        { answer: "micro1", term: "Perfect Competition", definition: "Many firms, homogeneous products, free entry; efficient (P=MC) but rare; agriculture approaches" },
        { answer: "micro2", term: "Monopolistic Competition", definition: "Many firms, differentiated products; some pricing power; long-term zero profit (free entry)" },
        { answer: "micro3", term: "Labor Market", definition: "Workers supply labor, firms demand it; wage = marginal revenue product; education increases wage via productivity" },
        { answer: "micro4", term: "Human Capital", definition: "Education, skills, health, experience; investment yields returns; explains income distribution and inequality" },
        { answer: "micro5", term: "Profit Maximization", definition: "MR = MC rule; firms maximize where marginal revenue equals marginal cost; determines output, pricing" }
      ]
    },
    47: {
      type: "quiz",
      title: "Market Power & Competitive Strategy",
      description: "Master Lesson 47 topics: Monopoly | Oligopoly | Game Theory | Antitrust | Entrepreneurship",
      questions: [
        {
          question: "What is a monopoly?",
          options: ["Just big firm", "Single firm, high barriers to entry, price maker (P > MC), restricts output, inefficient allocation", "No firms", "Impossible"],
          correct: 1,
          explanation: "Monopoly: exploits market power; charges high prices, produces less; examples: local utilities, pharmaceutical patents (deadweight loss)"
        },
        {
          question: "What are barriers to entry?",
          options: ["No barriers", "Capital requirements, patents, network effects, natural monopoly (declining AC), regulation, brand loyalty", "Free entry always", "No impediment"],
          correct: 1,
          explanation: "Barriers: high barriers protect monopoly profit; low barriers enable competition; natural monopoly (utilities) = large fixed cost"
        },
        {
          question: "What is game theory?",
          options: ["Just games", "Strategic interaction where outcome depends on others' actions; prisoner's dilemma, Nash equilibrium", "No application", "Irrelevant"],
          correct: 1,
          explanation: "Game theory: explains cartels (unstable—incentive to cheat), oligopoly pricing, negotiation; Nash equilibrium no one wants to deviate"
        },
        {
          question: "What is an oligopoly?",
          options: ["Few sellers", "Few large firms, high barriers, interdependent pricing; possible collusion or competitive behavior; examples: airlines, tech", "No structure", "Rare"],
          correct: 1,
          explanation: "Oligopoly: firms consider rivals' reactions; outcome depends on competition/collusion; unstable cartels often break (incentive to cheat)"
        },
        {
          question: "What is antitrust policy?",
          options: ["No policy", "Laws preventing monopolies, mergers reducing competition, price-fixing; promotes competition, protects consumers", "Government control", "Always bad"],
          correct: 1,
          explanation: "Antitrust: Sherman Act (1890), Clayton Act; broken up: Standard Oil, AT&T; ongoing: tech companies (Apple, Google) facing scrutiny"
        }
      ]
    },
    48: {
      type: "quiz",
      title: "Inequality & Development",
      description: "Master Lesson 48 topics: Education | Income Inequality | Healthcare | Poverty | Development",
      questions: [
        {
          question: "What is income inequality and why does it matter?",
          options: ["No problem", "Top 1% earn 20% of income, bottom 50% earn 12%; Gini coefficient measures; causes: education, capital, luck, discrimination", "Everyone same", "No cause"],
          correct: 1,
          explanation: "Inequality: risen since 1980 in US; high inequality associated with lower mobility, health problems, social friction, political division"
        },
        {
          question: "What is poverty?",
          options: ["No poverty", "Absolute (can't survive), relative (inequality measure); extreme poverty $1.90/day; 700M live in extreme poverty", "Only rich countries", "Temporary"],
          correct: 1,
          explanation: "Poverty: extreme poverty fell from 36% (1990) to 10% (2015) via development; still concentrated in sub-Saharan Africa, South Asia"
        },
        {
          question: "What is education's economic value?",
          options: ["No value", "Increases productivity, earning potential, reduced unemployment, spillover benefits to society", "Just credentialing", "No return"],
          correct: 1,
          explanation: "Education ROI: college degree ~$1 million lifetime earnings premium; benefits society (reduced crime, health, growth)"
        },
        {
          question: "What is healthcare economics?",
          options: ["No economics", "Market failure: asymmetric information, positive externality of health; high US costs (~18% GDP) vs efficiency", "No analysis", "Only medical"],
          correct: 1,
          explanation: "Healthcare: US spends 2x OECD average but not healthiest; insurance market problems; moral hazard (over-use) and adverse selection"
        },
        {
          question: "What is sustainable development?",
          options: ["No development", "Balancing economic growth with environmental protection and social equity; SDGs (17 goals) target 2030", "Growth only", "No goals"],
          correct: 1,
          explanation: "Sustainable development: companies (Interface carpets, Patagonia) show profits compatible with sustainability; triple bottom line (people, planet, profit)"
        }
      ]
    },
    49: {
      type: "matching",
      title: "Behavioral Economics & Data",
      description: "Match concepts from Lesson 49 videos: Behavioral Bias | Sharing Economy | Data | Causation | Statistics",
      matchPairs: [
        { answer: "behav1", term: "Loss Aversion", definition: "Fear of losing $100 > joy of gaining $100; explains risk-aversion, status quo bias, endowment effect" },
        { answer: "behav2", term: "Anchoring Bias", definition: "First number influences judgment; salary negotiation, price perception; intentional use in persuasion" },
        { answer: "behav3", term: "Sharing Economy", definition: "Peer-to-peer (Uber, Airbnb, TaskRabbit) using idle capacity; flexibility/convenience vs labor protections, regulation issues" },
        { answer: "behav4", term: "Correlation ≠ Causation", definition: "Variables move together (correlated) doesn't mean one causes other; confounds, reverse causality possible; RCT required" },
        { answer: "behav5", term: "Statistical Misuse", definition: "Cherry-picking data, misleading graphs, biased samples; p-hacking finds false significances; critical evaluation needed" }
      ]
    },
    50: {
      type: "dragdrop",
      title: "Future Economy",
      description: "Organize Lesson 50 concepts into zones: Gig Economy | Automation | Urbanization | Cryptocurrency | Sustainability",
      dropZones: [
        { name: "Gig Economy", items: ["Independent contractors (Uber, Doordash, Upwork)", "Flexibility but no benefits, unstable income", "36 million US workers", "Labor classification debate", "Future: mix of employment, gig work"] },
        { name: "Automation & AI", items: ["Routine jobs displaced (data entry, manufacturing)", "New jobs created historically (ATMs → more tellers)", "Transition pain for workers (geographic mismatch)", "Inequality risk if benefits concentrated", "Reskilling essential but difficult"] },
        { name: "Urbanization Trends", items: ["56% global urban (2020), 68% by 2050", "Agglomeration benefits (innovation, jobs)", "Housing affordability crisis", "Mega-cities in Asia, Africa", "Sustainable cities challenge"] },
        { name: "Cryptocurrency & Blockchain", items: ["Bitcoin: decentralized, volatile, speculative", "Blockchain: distributed ledger, immutable", "Applications: smart contracts, supply chain", "Regulatory uncertainty limits adoption", "Future: central bank digital currencies likely"] },
        { name: "Sustainability & Circular Economy", items: ["Linear (take-make-waste) → circular (reuse, recycle)", "Extended producer responsibility", "Interface, Patagonia: profit + sustainability", "Carbon pricing, ESG investing", "Climate adaptation essential"] }
      ]
    },

    // HISTORY OF SCIENCE GAMES (51-60)
    51: {
      type: "quiz",
      title: "Ancient Roots & Natural Philosophy",
      description: "Master Lesson 51 topics: Greek Thought | Aristotle | Romans | Islamic Science | Medieval",
      questions: [
        {
          question: "What was ancient natural philosophy?",
          options: ["Modern science", "Greeks seeking to understand nature through reason (Thales, Aristotle); no experimentation, authority-based", "No philosophy", "Wrong approach"],
          correct: 1,
          explanation: "Ancient philosophy: Plato (ideals), Aristotle (logic, categories); dominated for 2000 years; wrong predictions (heavy objects fall faster)"
        },
        {
          question: "What did Aristotle teach about science?",
          options: ["Modern methods", "Logic, categories, deduction; believed 4 elements, celestial vs terrestrial realms differ, geocentric universe", "Experimentation", "Not authority"],
          correct: 1,
          explanation: "Aristotle: brilliant logician but wrong about physics; authority of his writings blocked progress for centuries; final cause vs efficient"
        },
        {
          question: "What was Roman science and engineering?",
          options: ["Pure theory", "Aqueducts, roads, concrete; practical engineering excelled but theoretical science limited; copied Greeks", "No innovation", "Only Greek"],
          correct: 1,
          explanation: "Romans: engineering marvels (Colosseum, aqueducts spanning 60 miles) but less innovation in physics, astronomy; preserved Greek texts"
        },
        {
          question: "What happened to science during the Middle Ages?",
          options: ["No change", "Europe: stagnation, authority (Aristotle), Church dominance; Islamic world: astronomy, medicine, mathematics thrived", "Rapid progress", "Same everywhere"],
          correct: 1,
          explanation: "Middle Ages: European science dormant but Islamic Golden Age: Al-Razi (medicine), Al-Khwarizmi (algorithms), star catalogs; monks preserved texts"
        },
        {
          question: "What was the Golden Age of Islam's contribution?",
          options: ["Nothing", "Preserved Greek knowledge, advanced astronomy (better star catalogs), mathematics (algorithms, algebra), medicine, chemistry", "Only Europe matters", "No science"],
          correct: 1,
          explanation: "Islamic science: hospitals with pharmacies, universities, translation movement; later transferred to Europe via Crusades, trade, Sicily"
        }
      ]
    },
    52: {
      type: "quiz",
      title: "Scientific Revolution Begins",
      description: "Test Lesson 52 topics: Renaissance | Copernicus | Tycho | Kepler | Scientific Method",
      questions: [
        {
          question: "What was the Renaissance?",
          options: ["No change", "Rebirth of classical learning; emphasized human observation, art, individual achievement; foundation for scientific revolution", "Only art", "Medieval"],
          correct: 1,
          explanation: "Renaissance: rediscovery of classical texts, printing press (Gutenberg 1440), perspective in art, anatomical drawings; enabled detailed observation"
        },
        {
          question: "How did Copernicus challenge the geocentric model?",
          options: ["No challenge", "Heliocentric hypothesis (1543): sun at center, Earth orbits; contradicted Aristotle, biblical interpretation", "Stayed geocentric", "Proven wrong"],
          correct: 1,
          explanation: "Copernicus: published De revolutionibus on deathbed; heliocentric model simpler for calculations, challenged Church authority"
        },
        {
          question: "What did Tycho Brahe contribute?",
          options: ["Nothing", "Precise naked-eye observations of stars/planets (1576-1613); best pre-telescope data; showed comets beyond Moon", "No data", "Incomplete"],
          correct: 1,
          explanation: "Tycho: accurate measurements revealed comet parallax (in supralunar realm, contradicting Aristotle); data enabled Kepler's laws"
        },
        {
          question: "What were Kepler's laws?",
          options: ["Random", "Elliptical orbits (I), equal areas in equal time (II), period² ∝ distance³ (III); explained planetary motion precisely", "Circular", "No laws"],
          correct: 1,
          explanation: "Kepler's laws: fit Tycho's data perfectly; planets accelerate near sun, slow far away (elliptical, not Aristotle's uniform circles)"
        },
        {
          question: "What was the Scientific Revolution fundamentally?",
          options: ["Just astronomy", "Shift from authority to observation, mathematics, experimentation; Descartes (reason), Bacon (empiricism), Newton synthesis", "Philosophy only", "No method"],
          correct: 1,
          explanation: "Revolution: epistemology changed - nature understood via measurement, math, testing; not just appeal to ancient authorities"
        }
      ]
    },
    53: {
      type: "quiz",
      title: "Physics, Light & Gravity",
      description: "Master Lesson 53 topics: Galileo | Newton's Laws | Gravity | Optics | Calculus",
      questions: [
        {
          question: "What did Galileo contribute?",
          options: ["Nothing", "Telescope observation (moons of Jupiter), law of inertia, inclined plane experiments, support for heliocentrism", "Only theory", "Wrong"],
          correct: 1,
          explanation: "Galileo: experimentation + math; inclined plane showed acceleration constant (not Aristotle's speed proportional to force); trial (1633)"
        },
        {
          question: "What are Newton's Laws of Motion?",
          options: ["No laws", "First: object at rest stays unless forced; Second: F = ma; Third: equal/opposite reactions; describe all motion", "Wrong", "Incomplete"],
          correct: 1,
          explanation: "Newton's laws: First = inertia, Second = acceleration from force, Third = interaction pairs; foundation of classical mechanics (300 years validity)"
        },
        {
          question: "What was Newton's Law of Universal Gravitation?",
          options: ["Only Earth", "F = G(m₁m₂)/r²; explains planetary orbits, tides, falling apples; unified terrestrial and celestial mechanics", "Not universal", "Wrong"],
          correct: 1,
          explanation: "Newton: gravity acts everywhere, same law; mass and distance determine force; overthrew Aristotle's different realms (Earth vs sky)"
        },
        {
          question: "What did Newton discover about light?",
          options: ["No discovery", "White light = mixture of colors (prism experiments), different colors refract differently, corpuscular theory", "Monochromatic", "Waves only"],
          correct: 1,
          explanation: "Newton: light corpuscular (particles); prism shows white = spectrum combined; explained rainbow, color vision"
        },
        {
          question: "Why was calculus Newton's great innovation?",
          options: ["Not needed", "Mathematics of change (rates, accumulation), essential for describing motion, forces, orbits, optimization", "Just algebra", "Irrelevant"],
          correct: 1,
          explanation: "Calculus: enables modeling continuous change; derivatives (rate), integrals (accumulation); revolutionized mathematics and physics"
        }
      ]
    },
    54: {
      type: "quiz",
      title: "Chemistry & The Unseen World",
      description: "Test Lesson 54 topics: Alchemy | Boyle | Lavoisier | Dalton | Periodic Table",
      questions: [
        {
          question: "What did alchemists contribute despite failing transmutation?",
          options: ["Nothing", "Lab techniques (distillation, crystallization), discovery of elements, early chemistry despite mysticism", "Only failure", "No science"],
          correct: 1,
          explanation: "Alchemy: combined observation with philosophy; discovered sulfuric acid, aqua regia; failed gold-making but advanced techniques"
        },
        {
          question: "What was Boyle's major contribution?",
          options: ["Nothing", "Boyle's Law (PV = constant); showed gases have quantifiable properties, corpuscular theory explains them", "No law", "Incomplete"],
          correct: 1,
          explanation: "Boyle: experimental rigor (air pump), skeptical about Aristotle; enabled gas laws, quantitative chemistry"
        },
        {
          question: "How did Lavoisier revolutionize chemistry?",
          options: ["Minor change", "Law of conservation of mass (combustion doesn't destroy mass), identified oxygen, overthrew phlogiston", "Wrong", "Small step"],
          correct: 1,
          explanation: "Lavoisier: careful weighing (balance), systematic nomenclature; father of modern chemistry; beheaded in Revolution"
        },
        {
          question: "What was Dalton's atomic theory?",
          options: ["No theory", "Elements composed of indivisible atoms, each element's atoms have unique weight, compounds from atom combinations", "Still wrong", "Incomplete"],
          correct: 1,
          explanation: "Dalton: explained definite proportions (law) via atoms; laid foundation for chemistry; later refined (indivisible ≠ truth)"
        },
        {
          question: "Why was Mendeleev's periodic table significant?",
          options: ["Just organization", "Arranged elements by properties, predicted missing elements (Ge, Sc, Ga), properties repeated; revealed pattern", "No pattern", "Random"],
          correct: 1,
          explanation: "Periodic table: properties repeat → atomic structure pattern; predictions validated → confirmed atomic theory; organized knowledge"
        }
      ]
    },
    55: {
      type: "quiz",
      title: "Biology, Life & Deep Time",
      description: "Master Lesson 55 topics: Cell Theory | Geologic Time | Evolution | Darwin | Fossils",
      questions: [
        {
          question: "What is cell theory?",
          options: ["Incomplete", "All organisms made of cells (Schleiden, Schwann), cells from pre-existing cells (Virchow), fundamental to biology", "No origin", "Wrong"],
          correct: 1,
          explanation: "Cell theory: explains organization, heredity, disease (cells go bad); cells ≠ spontaneous generation"
        },
        {
          question: "How did geology establish Deep Time?",
          options: ["Biblical timeline", "Hutton/Lyell: uniformitarianism (same processes), rock formations show vast time, radiometric dating → 4.5 billion years", "Recent", "Static"],
          correct: 1,
          explanation: "Deep Time: Hutton (1785) → Lyell (1830) → Darwin had time for evolution; radiometric dating (Becquerel, 1896) confirmed"
        },
        {
          question: "What did Lamarck contribute to evolutionary thought?",
          options: ["Nothing", "Pre-Darwinian evolutionist; wrong mechanism (use/disuse inherited) but recognized evolution, competition, adaptation", "Completely right", "Misleading"],
          correct: 1,
          explanation: "Lamarck: intuited evolution but wrong mechanism; later experiments disproved inheritance of acquired traits"
        },
        {
          question: "What was Darwin's evolutionary theory?",
          options: ["Random change", "Natural selection: variation, inheritance, differential reproduction → adaptation; explains fossils, homologies, diversity", "God design", "No mechanism"],
          correct: 1,
          explanation: "Darwin: evolution via selection not design; explains without purpose; controversial (removes human specialness); validated by genetics"
        },
        {
          question: "Why was human evolution controversial?",
          options: ["Not controversial", "Challenged human exceptionalism, biblical creation, human dignity; some cultures still reject (despite evidence)", "Universally accepted", "Minor issue"],
          correct: 1,
          explanation: "Human evolution: fossil record (Lucy, Homo habilis), DNA (98% chimp match), anatomy (vestigial tailbone); scientific consensus clear"
        }
      ]
    },
    56: {
      type: "quiz",
      title: "Medicine & The Human Body",
      description: "Test Lesson 56 topics: Germ Theory | Vaccines | Genetics | DNA | Biotechnology",
      questions: [
        {
          question: "What did germ theory overturn?",
          options: ["Nothing", "Miasma (bad air) theory; Pasteur/Koch showed microorganisms cause disease via culture, filtration", "Incorrect", "No change"],
          correct: 1,
          explanation: "Germ theory: Pasteur (fermentation, rabies vaccine), Koch (TB bacteria); enabled antisepsis (Lister), sanitation, antibiotics"
        },
        {
          question: "How did vaccination save millions?",
          options: ["No effect", "Jenner (1796): cowpox vaccine protected smallpox; now polio nearly eradicated, measles prevented, COVID vaccines developed", "Only Jenner", "Minimal"],
          correct: 1,
          explanation: "Vaccines: train immune system without infection risk; herd immunity (90%+ vaccinated) protects unvaccinated; antivax misinformation harms"
        },
        {
          question: "What was Mendel's discovery?",
          options: ["No discovery", "Traits inherited discretely (dominant/recessive, not blending); pea plants showed 3:1 ratios; laws of inheritance", "Wrong", "Incomplete"],
          correct: 1,
          explanation: "Mendelian genetics: explained heredity; rediscovered (1900) after Mendel's death; foundation for modern genetics"
        },
        {
          question: "What was DNA structure's significance?",
          options: ["No importance", "Watson, Crick, Franklin (1953): double helix, base pairing (A-T, G-C) → replication, mutation, genetic code", "Only academic", "Limited"],
          correct: 1,
          explanation: "DNA: structure explains inheritance, enables genetic engineering, PCR, sequencing, gene therapy; CRISPR genome editing now possible"
        },
        {
          question: "What are applications of biotechnology?",
          options: ["Limited", "Gene therapy (genetic disease treatment), GMOs (disease-resistant crops), personalized medicine, forensic DNA, mRNA vaccines", "Only experimental", "Dangerous only"],
          correct: 1,
          explanation: "Biotech: mRNA vaccines (COVID) developed in 1 year; GMOs controversial (safety vs hunger relief); CRISPR ethics debates"
        }
      ]
    },
    57: {
      type: "memory",
      title: "Electricity & Thermodynamics",
      description: "Flip and match pairs from Lesson 57 videos: Electrostatics | Circuits | Electromagnetism | Thermodynamics | Engines",
      pairs: [
        { term: "Coulomb's Law", answer: "energy1" },
        { term: "F = kq₁q₂/r²; electric force inverse-square like gravity", answer: "energy1" },
        { term: "Faraday's Induction", answer: "energy2" },
        { term: "Changing magnetic flux induces EMF; enables generators, transformers", answer: "energy2" },
        { term: "Joule's Heating", answer: "energy3" },
        { term: "Heat = current² × resistance (P = I²R); proved heat = work", answer: "energy3" },
        { term: "Thermodynamic Laws", answer: "energy4" },
        { term: "1st: energy conserved; 2nd: entropy increases (disorder); limits efficiency", answer: "energy4" },
        { term: "Carnot Efficiency", answer: "energy5" },
        { term: "Maximum theoretical efficiency = 1 - T_cold/T_hot; never 100%", answer: "energy5" },
        { term: "Steam Engine", answer: "energy6" },
        { term: "Converted heat to work; powered Industrial Revolution; practical thermodynamics", answer: "energy6" }
      ]
    },
    58: {
      type: "dragdrop",
      title: "Modern Physics Revolution",
      description: "Organize Lesson 58 concepts into zones: Special Relativity | Quantum Mechanics | Atomic Structure | Nuclear Physics | Particle Physics",
      dropZones: [
        { name: "Special Relativity", items: ["Speed of light constant in all frames", "Time dilation: moving clocks slow", "Length contraction: moving objects shrink", "E = mc²: mass-energy equivalence", "Overturned absolute time/space"] },
        { name: "Quantum Mechanics", items: ["Planck: energy quantized (photons)", "Einstein: photoelectric effect (photons)", "Heisenberg: uncertainty principle (ΔxΔp ≥ ℏ/2)", "Schrödinger: wave equation", "Probability, not determinism"] },
        { name: "Atomic Structure", items: ["Bohr model: quantized orbits", "Electron clouds (orbitals)", "Spectral lines explained", "Explains chemical bonding", "Refined: quantum mechanics"] },
        { name: "Nuclear Physics", items: ["Rutherford: nucleus discovered", "Radioactive decay: alpha, beta, gamma", "Binding energy, mass-energy", "Fission: heavy nuclei split", "Fusion: light nuclei combine"] },
        { name: "Atomic Bomb", items: ["E = mc² enables nuclear weapon", "Hiroshima/Nagasaki (200k+ deaths)", "Changed warfare, geopolitics", "MAD doctrine (mutually assured destruction)", "Nuclear age began"] }
      ]
    },
    59: {
      type: "quiz",
      title: "Information & The Digital Age",
      description: "Test Lesson 59 topics: Computing History | Turing | Internet | AI | Information Theory",
      questions: [
        {
          question: "What was the history of computing?",
          options: ["Always digital", "Mechanical (Babbage Analytical Engine), electromechanical (ENIAC 1946, 150 kW, 30 tons), transistors, IC, microcomputers", "Recent", "Instant"],
          correct: 1,
          explanation: "Computing: Moore's Law (transistor density doubles every 2 years) enabled exponential growth; miniaturization → smartphones > ENIAC"
        },
        {
          question: "Who was Alan Turing and what did he contribute?",
          options: ["No contribution", "Theoretical computer science, Turing machine (universal computation), AI concept, Turing test (human intelligence)", "Only cryptography", "Minor"],
          correct: 1,
          explanation: "Turing: foundations of computation; tragic (prosecuted for homosexuality); Turing test: if machine indistinguishable from human, is it intelligent?"
        },
        {
          question: "How did the internet develop?",
          options: ["Always existed", "ARPANET (1969, packet switching) → TCP/IP protocol → World Wide Web (1991) → commercial internet", "Private creation", "Instant"],
          correct: 1,
          explanation: "Internet: decentralized design (survive nuclear war), packet switching (robust); now ~5 billion users globally"
        },
        {
          question: "What is artificial intelligence and its history?",
          options: ["No history", "Turing test (1950), expert systems (1980s), deep learning (2010s via neural networks); beats humans chess, Go", "Recent", "Still impossible"],
          correct: 1,
          explanation: "AI: narrow AI successful (specific tasks); general AI (human-level) far off; large language models (GPT, Claude) impressive but limitations"
        },
        {
          question: "What is information theory's significance?",
          options: ["No significance", "Shannon (1948): quantifies information (bits), enables compression, error correction, communication theory, coding", "Not applicable", "Wrong"],
          correct: 1,
          explanation: "Information theory: explains redundancy, noise, efficiency; foundations of digital communication, data compression, reliability"
        }
      ]
    },
    60: {
      type: "matching",
      title: "Science in the 21st Century",
      description: "Match contemporary science from Lesson 60 videos: Climate Science | Genetics | Space | Technology | Ethics",
      matchPairs: [
        { answer: "mod1", term: "Climate Science", definition: "Greenhouse effect (CO₂ traps heat), ice core records, satellite data; human CO₂ (280→420 ppm) causes warming" },
        { answer: "mod2", term: "CRISPR Gene Editing", definition: "Precise genetic modification; therapeutic (sickle cell) vs enhancement (designer babies) ethical divide" },
        { answer: "mod3", term: "Space Exploration", definition: "ISS, Mars rovers, Hubble telescope, James Webb; next: Mars colonization, deep space, asteroid mining" },
        { answer: "mod4", term: "Artificial Intelligence", definition: "Machine learning, deep neural networks; accelerating discovery but risks (bias, job loss, misuse)" },
        { answer: "mod5", term: "Scientific Ethics", definition: "Dual-use research (weapons), environmental impact, equity, informed consent, reproducibility crisis, misinformation" }
      ]
    },

    // HUMAN GEOGRAPHY GAMES (61-70)
    61: {
      type: "quiz",
      title: "Tools of the Geographer",
      description: "Master Lesson 61 topics: Geographic Methods | GIS | Maps | Scale | Fieldwork",
      questions: [
        {
          question: "What is geography and what does it study?",
          options: ["Just maps", "Physical (climate, landforms) and human (culture, economy, politics); integrates natural and social sciences", "Only land", "No integration"],
          correct: 1,
          explanation: "Geography: uniqueness of places, human-environment interaction, spatial patterns; regional geography (holistic) or systematic"
        },
        {
          question: "What are map projections and their distortions?",
          options: ["Perfect copies", "Mercator (distorts poles), equal-area (preserves area), equidistant (preserves distance); trade-offs required", "No distortion", "All same"],
          correct: 1,
          explanation: "Projections: Greenland appears huge (Mercator) but same size as Africa; projection choice affects policy (colonial maps exaggerated territory)"
        },
        {
          question: "What is GIS and how is it used?",
          options: ["Just mapping", "Digital analysis of spatial data: layers (elevation, land use, population), modeling, prediction", "Only visualization", "No analysis"],
          correct: 1,
          explanation: "GIS: urban planning (zoning), environmental management (protected areas), resource allocation (hospital locations); ArcGIS standard"
        },
        {
          question: "What is scale in geography?",
          options: ["No meaning", "Ratio of map to reality (1:50,000); also geographic scale (local to global); same phenomenon differs at different scales", "Same everywhere", "Fixed"],
          correct: 1,
          explanation: "Scales: income inequality visible globally but caused locally; same processes operate differently (climate global, weather local)"
        },
        {
          question: "Why is fieldwork important in geography?",
          options: ["Not scientific", "Direct observation reveals patterns, context, local knowledge not visible in data; qualitative + quantitative methods", "Only for surveys", "No value"],
          correct: 1,
          explanation: "Fieldwork: ethnographic studies reveal migration drivers (cannot see in data), interviews understand place meanings"
        }
      ]
    },
    62: {
      type: "quiz",
      title: "Earth's Tectonic & Surface Systems",
      description: "Test Lesson 62 topics: Plate Tectonics | Earthquakes | Rock Cycle | Weathering | Landforms",
      questions: [
        {
          question: "What is plate tectonics?",
          options: ["No movement", "Earth's lithosphere divided into plates moving via mantle convection; explains earthquakes, volcanoes, mountains", "Static", "Wrong"],
          correct: 1,
          explanation: "Plate tectonics: Wegener (continental drift 1912, rejected), then validated (seafloor spreading, magnetic reversals); revolutionary (1960s)"
        },
        {
          question: "What are the three plate boundaries?",
          options: ["Only one", "Convergent (collide, subduction, mountains), divergent (spread, rifts), transform (slide, earthquakes)", "No variation", "Two types"],
          correct: 1,
          explanation: "Boundaries: convergent → Himalayas (tallest); divergent → Iceland (new crust); transform → San Andreas (damaging quakes)"
        },
        {
          question: "What is the rock cycle?",
          options: ["No cycle", "Igneous (magma cools) → weathering → sedimentary (compaction) → burial → metamorphic → melting → recycled", "One direction", "Static"],
          correct: 1,
          explanation: "Rock cycle: driven by plate tectonics (heat, burial), weathering (erosion), time scales (millions of years)"
        },
        {
          question: "What causes weathering and erosion?",
          options: ["No cause", "Physical (frost, exfoliation), chemical (oxidation, dissolution), biological (roots, organisms); transport by water/wind/ice", "No transport", "Random"],
          correct: 1,
          explanation: "Weathering: granite breaks down to sand; erosion transports it; deposition creates new sedimentary rocks"
        },
        {
          question: "How do landforms reveal tectonic activity?",
          options: ["No link", "Mountain ranges (convergent boundaries), valleys (erosion), plateaus (uplift); landscapes are windows to processes", "No relationship", "Random patterns"],
          correct: 1,
          explanation: "Landforms: Appalachians (old, worn), Rockies (young, steep); Himalayan growth (ongoing); landscapes read like geology textbook"
        }
      ]
    },
    63: {
      type: "quiz",
      title: "Atmosphere, Climate & Change",
      description: "Master Lesson 63 topics: Weather vs Climate | Wind Patterns | Biomes | Greenhouse Effect | Climate Change",
      questions: [
        {
          question: "What is the difference between weather and climate?",
          options: ["Same", "Weather: short-term (tomorrow's rain); Climate: 30-year average patterns; seasons, extremes vary by region", "No difference", "Interchangeable"],
          correct: 1,
          explanation: "Weather vs climate: today's rain ≠ climate change; but changing averages (warming) change extreme frequency"
        },
        {
          question: "What causes global wind and pressure patterns?",
          options: ["Random", "Solar heating creates temperature differences → pressure gradients → circulation: trade winds, jet streams, monsoons", "No pattern", "Seasonal only"],
          correct: 1,
          explanation: "Circulation: equator hot (low pressure), poles cold (high pressure); Coriolis effect deflects winds; creates predictable patterns"
        },
        {
          question: "How do climate zones relate to biomes?",
          options: ["Not related", "Climate determines biome type: tropical (rainforest), arid (desert), temperate (mixed forest), polar (tundra)", "Random", "No pattern"],
          correct: 1,
          explanation: "Biome-climate link: same climate zone globally produces similar ecosystems (convergent evolution); 30°S/N deserts (descending air)"
        },
        {
          question: "What is the greenhouse effect?",
          options: ["Natural only", "Atmospheric gases (CO₂, CH₄, H₂O) trap heat; necessary for life (warming ~33°C) but excess causes warming", "No effect", "Unproven"],
          correct: 1,
          explanation: "Greenhouse effect: human CO₂ (280 ppm 1800 → 420 ppm 2024) enhances natural effect → climate change"
        },
        {
          question: "How is climate change affecting geography?",
          options: ["No effect", "Sea level rise (flooding coasts), range shifts (species & diseases), phenological mismatches (timing disruption), extreme weather", "Minor", "Temporary"],
          correct: 1,
          explanation: "Climate impacts: Arctic warming 2x global average (ice-albedo feedback), hurricanes intensifying, droughts/floods pattern shift"
        }
      ]
    },
    64: {
      type: "memory",
      title: "The Hydrosphere & Moving Water",
      description: "Flip and match pairs from Lesson 64 videos: Water Cycle | Rivers | Glaciers | Groundwater | Oceans | Coasts",
      pairs: [
        { term: "Water Cycle", answer: "water1" },
        { term: "Evaporation → condensation → precipitation → infiltration → runoff; sun-powered, renewable", answer: "water1" },
        { term: "Rivers", answer: "water2" },
        { term: "Flow downslope carving valleys, transporting sediment, creating floodplains", answer: "water2" },
        { term: "Glaciers", answer: "water3" },
        { term: "Store freshwater (70% of fresh water), shape landscapes via erosion, advance/retreat with climate", answer: "water3" },
        { term: "Groundwater", answer: "water4" },
        { term: "Underground water supply, aquifers recharge slowly, vulnerable to contamination", answer: "water4" },
        { term: "Ocean Currents", answer: "water5" },
        { term: "Gulf Stream (warm), California Current (cold); redistribute heat, affect climate", answer: "water5" },
        { term: "Coastal Hazards", answer: "water6" },
        { term: "Erosion, flooding, tsunamis; human development increases vulnerability", answer: "water6" }
      ]
    },
    65: {
      type: "dragdrop",
      title: "Biogeography & Land Use",
      description: "Organize Lesson 65 concepts into zones: Species Distribution | Land Use Change | Agriculture | Conservation | Sustainability",
      dropZones: [
        { name: "Biogeography", items: ["Species distribution patterns", "Plate tectonics (continents split, isolation)", "Island biogeography (size/distance)", "Endemism (species in limited area)", "Migration routes, dispersal"] },
        { name: "Land Use Change", items: ["Deforestation (10 million ha/year)", "Urbanization (56% urban, growing)", "Agriculture (cropland 15% of land)", "Habitat fragmentation", "Biodiversity loss"] },
        { name: "Agriculture Impact", items: ["Monocultures reduce diversity", "Pesticide/fertilizer runoff", "Soil erosion, depletion", "Water use, irrigation", "Biodiversity loss"] },
        { name: "Forests Role", items: ["Carbon storage (climate regulation)", "Biodiversity hotspots", "Indigenous peoples live there", "Threatened by logging", "Reforestation potential"] },
        { name: "Conservation Strategies", items: ["Protected areas (national parks)", "Wildlife corridors (allow migration)", "Sustainable practices (organic farming)", "Community involvement", "Payment for ecosystem services"] }
      ]
    },
    66: {
      type: "quiz",
      title: "Human Population & Movement",
      description: "Test Lesson 66 topics: Demography | Population Growth | Migration | Urbanization | Aging",
      questions: [
        {
          question: "What is demography and demographic transition?",
          options: ["No transition", "Study of population changes; transition: high birth/death → declining death → declining birth → stable (developed countries)", "Linear growth", "No pattern"],
          correct: 1,
          explanation: "Demographic transition: Europe/Japan stage 4 (low growth), developing countries stage 2/3 (rapid growth, fertility declining)"
        },
        {
          question: "What drives human population growth?",
          options: ["No drivers", "Fertility (children/woman), mortality, migration; 1 billion (1800) → 8 billion (2024); growth slowing", "Always increasing", "Stable"],
          correct: 1,
          explanation: "Population growth: ~80 million/year net (declining rate); Africa highest fertility (4.3 children/woman), Asia aging rapidly"
        },
        {
          question: "What causes migration?",
          options: ["Random", "Pull factors (opportunities, safety), push factors (poverty, conflict, persecution); affects both origin and destination", "No pattern", "Individual choice"],
          correct: 1,
          explanation: "Migration: Syrian refugees (11 million displaced), climate migrants rising; remittances major income source for poor countries"
        },
        {
          question: "What is urbanization and its challenges?",
          options: ["No trend", "Movement to cities; 56% urban (2020), 68% by 2050; creates agglomeration benefits (jobs, innovation) but inequality, slums", "Rural growing", "Stable"],
          correct: 1,
          explanation: "Urbanization: mega-cities (Tokyo 37M, Delhi 30M) in Asia/Africa; challenge: housing, infrastructure, inequality within cities"
        },
        {
          question: "How does population structure affect development?",
          options: ["No relationship", "Young population (Africa) = demographic dividend (workers) if jobs exist; aging (Japan, Europe) = dependent workers", "All same", "No effect"],
          correct: 1,
          explanation: "Population pyramids: show age structure; young = future growth potential, aging = healthcare costs, pension burden"
        }
      ]
    },
    67: {
      type: "quiz",
      title: "Cultural & Social Geography",
      description: "Master Lesson 67 topics: Culture | Language | Religion | Identity | Globalization",
      questions: [
        {
          question: "What is cultural geography?",
          options: ["Only anthropology", "Study of cultures, identities, meanings across space; how geography shapes culture and vice versa", "Only patterns", "Not spatial"],
          correct: 1,
          explanation: "Cultural geography: language distribution (1000+ languages disappearing), religion geography (competition, conflict), food cultures (terroir)"
        },
        {
          question: "What is cultural landscape?",
          options: ["Just nature", "Visible modifications to environment reflecting human values, beliefs, practices (houses, fields, monuments)", "Invisible", "No meaning"],
          correct: 1,
          explanation: "Landscape reading: temple presence indicates religion, housing style shows climate adaptation and culture, monuments reflect power"
        },
        {
          question: "How does language geography work?",
          options: ["Random distribution", "Languages cluster by migration history, isolation, power; colonial languages (English, Spanish) dominant", "No pattern", "Scattered"],
          correct: 1,
          explanation: "Languages: 6000+ languages, but 10% spoken by 94% of people; endangerment (indigenous languages lost); Mandarin, Spanish, English largest"
        },
        {
          question: "What is religion's geographic significance?",
          options: ["Not important", "Spatial distribution (Christianity 32% global, Islam 25%), affects landscape (temples, cemeteries), conflicts (Palestine)", "Equal everywhere", "No impact"],
          correct: 1,
          explanation: "Religion geography: pilgrimage sites (Mecca, Jerusalem), food practices (Kosher, Halal), Sabbath affects weekday, settlement patterns"
        },
        {
          question: "How does cultural diffusion work?",
          options: ["Isolated", "Cultural traits spread via contact, migration, trade, media (cultural imperialism); adoption varies by receptiveness", "Never spreads", "Unchanged"],
          correct: 1,
          explanation: "Diffusion: Islam spread via trade routes, Christianity via colonialism, K-pop via social media; local adaptation creates glocalization"
        }
      ]
    },
    68: {
      type: "quiz",
      title: "Political Geography & Power",
      description: "Test Lesson 68 topics: Geopolitics | Borders | States | Sovereignty | Conflict",
      questions: [
        {
          question: "What is geopolitics?",
          options: ["Not real", "Power struggles between nations based on geography, resources, location, alliances", "Just politics", "Academic only"],
          correct: 1,
          explanation: "Geopolitics: Russia-Ukraine (resources, NATO expansion), China-Taiwan (strategic location, semiconductor supply), Middle East (oil, conflict)"
        },
        {
          question: "How are borders created and why do they matter?",
          options: ["Natural", "Drawn by history, colonialism, treaties, conflict; affect trade, migration, identity, resources; often arbitrary (Africa colonial)", "Permanent", "No importance"],
          correct: 1,
          explanation: "Borders: Berlin Wall (Cold War), India-Pakistan partition (1.2 million deaths), Israel-Palestine (ongoing conflict), maritime boundaries (EEZ)"
        },
        {
          question: "What is sovereignty?",
          options: ["Shared", "Supreme authority within territory; challenged by EU supranationalism, indigenous sovereignty, NGOs", "Absolute", "No limits"],
          correct: 1,
          explanation: "Sovereignty: Westphalian (1648) established state system; challenged by ICC (universal jurisdiction), climate treaties (global)"
        },
        {
          question: "What are supranational organizations?",
          options: ["Just trade", "EU (integration, passport, euro), UN (peacekeeping, humanitarian), AU (African cooperation), reduce state power", "No influence", "Weak"],
          correct: 1,
          explanation: "Supranationalism: EU most integrated (pooled sovereignty); UN toothless (veto power); loose cooperation in most organizations"
        },
        {
          question: "How does geography affect conflict?",
          options: ["No link", "Resources (oil, minerals, water), borders (Kashmir, Crimea), strategic location, ethnic distribution → competition → conflict", "Random", "Unrelated"],
          correct: 1,
          explanation: "Conflict geography: 80% civil wars in global South, often over resources; climate stress increases resource conflict risk (water, land)"
        }
      ]
    },
    69: {
      type: "matching",
      title: "Economic Geography & Development",
      description: "Match concepts from Lesson 69 videos: Production | Sectors | Supply Chains | Development | Inequality",
      matchPairs: [
        { answer: "econ1", term: "Sectors", definition: "Primary (agriculture), secondary (manufacturing), tertiary (services), quaternary (information); development stage determines composition" },
        { answer: "econ2", term: "Global Supply Chains", definition: "Production spans countries (Nike shoes: design USA, manufacturing Vietnam, retail everywhere); just-in-time, complex interdependence" },
        { answer: "econ3", term: "Development", definition: "GDP per capita, HDI (life expectancy, education, income); unequal: richest 20% earn 80% of income" },
        { answer: "econ4", term: "Digital Divide", definition: "Unequal internet access (80% global coverage but 20% world uses 80% of data); limits opportunity" },
        { answer: "econ5", term: "Sustainable Development", definition: "SDGs (17 goals: poverty, health, education, climate); balance growth with environment and equity" }
      ]
    },
    70: {
      type: "dragdrop",
      title: "Urban Environments & The Future",
      description: "Organize Lesson 70 concepts into zones: Urban Structure | Planning | Smart Cities | Sustainability | Future Trends",
      dropZones: [
        { name: "Urban Structure", items: ["Central business district (CBD)", "Residential zones", "Manufacturing areas", "Transport networks", "Reflects history and function"] },
        { name: "Urban Planning", items: ["Zoning regulations", "Density (high = efficient, social)", "Mixed-use development", "Green space, parks", "Equity access to services"] },
        { name: "Smart Cities", items: ["IoT sensors (traffic, pollution)", "Data analytics (optimize services)", "Autonomous vehicles", "Smart grids (renewable energy)", "Digital divide risk"] },
        { name: "Sustainability", items: ["Public transit (reduce cars)", "Energy efficiency (green buildings)", "Water management (reuse)", "Waste reduction (circular)", "Urban agriculture"] },
        { name: "Urban Challenges", items: ["Slums (informal housing)", "Inequality (spatial segregation)", "Traffic congestion", "Pollution (air, water)", "Climate vulnerability"] }
      ]
    },

    // PSYCHOLOGY GAMES (71-80)
    71: {
      type: "quiz",
      title: "Intro & Research Methods",
      description: "Master Lesson 71 topics: Psychology Science | Brain | Neurotransmitters | Research | Ethics",
      questions: [
        {
          question: "What is psychology?",
          options: ["Just talking", "Scientific study of behavior and mental processes using empirical methods", "Not science", "Only observation"],
          correct: 1,
          explanation: "Psychology: spans neuroscience (brain), cognitive (thinking), social (groups), clinical (disorder treatment); applied broadly"
        },
        {
          question: "What are neurotransmitters and their roles?",
          options: ["No role", "Chemical messengers: serotonin (mood, depression if low), dopamine (reward, motivation), GABA (calm), glutamate (excite)", "Only in brain", "Limited"],
          correct: 1,
          explanation: "Neurotransmitters: imbalance causes disorders (depression, ADHD, anxiety); drugs target them (antidepressants increase serotonin)"
        },
        {
          question: "What is nature vs nurture?",
          options: ["Genetics only", "Both: genes provide potential, environment activates/suppresses expression; interactions complex (epigenetics)", "Environment only", "No interaction"],
          correct: 1,
          explanation: "Nature-nurture: identical twins separated show 50% intelligence correlation (genes matter) but environment allows 15+ IQ point differences"
        },
        {
          question: "What are psychological research methods?",
          options: ["No standards", "Experiments (control variables), correlations (relationships), observations (behavior), surveys (large samples)", "Only guessing", "Unscientific"],
          correct: 1,
          explanation: "Research ethics: informed consent, privacy, minimal harm; RCTs gold standard; many psychology findings fail replication (crisis)"
        },
        {
          question: "Why is the brain's structure important?",
          options: ["No importance", "Prefrontal cortex (reasoning, impulse control), limbic system (emotion), hippocampus (memory), amygdala (fear)", "All same", "Not specialized"],
          correct: 1,
          explanation: "Brain regions: damage reveals function (Phineas Gage: brain damage → personality change); brain plasticity allows recovery"
        }
      ]
    },
    72: {
      type: "quiz",
      title: "Sensation & Perception",
      description: "Test Lesson 72 topics: Sensory Systems | Sensation | Perception | Thresholds | Organization",
      questions: [
        {
          question: "What is the difference between sensation and perception?",
          options: ["No difference", "Sensation: physical stimulus detection; Perception: brain interpretation (meaning)", "Same process", "Only sensation matters"],
          correct: 1,
          explanation: "Sensation-perception: light on retina (sensation) → brain recognizes face (perception); top-down expectations shape perception"
        },
        {
          question: "What are sensory thresholds?",
          options: ["Not measurable", "Absolute (minimum to detect), difference (notice change); Weber's Law (difference proportional to magnitude)", "Irrelevant", "No standards"],
          correct: 1,
          explanation: "Thresholds: absolute threshold for smell ~1 drop perfume in stadium; difference threshold increases with intensity"
        },
        {
          question: "What is sensory adaptation?",
          options: ["Never happens", "Reduced sensitivity to constant stimulus; allows attention to changes (newborns habituate to voices)", "Always sensitive", "Fixed"],
          correct: 1,
          explanation: "Adaptation: wearing clothes → stop feeling them; allows salience (notice changes); evolutionary (respond to danger, novelty)"
        },
        {
          question: "What is perceptual organization?",
          options: ["No organization", "Gestalt principles: figure-ground (foreground/background), grouping (proximity, similarity); complete incomplete pictures", "Chaotic", "No processing"],
          correct: 1,
          explanation: "Gestalt: 'whole > sum of parts'; organizing principles reveal perception is constructive (brain fills in gaps, assumes patterns)"
        },
        {
          question: "How do past experiences shape perception?",
          options: ["No effect", "Expectations and context affect what we perceive; perceive stimuli matching schemas faster (top-down)", "Objective always", "Culture irrelevant"],
          correct: 1,
          explanation: "Perception culturally shaped: lens shape affects depth perception (Eskimo snow words myth but visual differences real)"
        }
      ]
    },
    73: {
      type: "quiz",
      title: "Sleep, Altered States & Genetics",
      description: "Master Lesson 73 topics: Sleep Stages | Dreams | Consciousness | Drugs | Epigenetics",
      questions: [
        {
          question: "What are sleep stages and functions?",
          options: ["No stages", "NREM (light, deep) and REM (dreaming); cycles ~90 min, deep sleep early, REM late; consolidates memories", "All same", "No function"],
          correct: 1,
          explanation: "Sleep need: ~8 hours (varies); deprivation harms memory, immune, mood; dreams (REM) process emotions and memories"
        },
        {
          question: "What are dreams and why do we have them?",
          options: ["No purpose", "REM activation; theories: emotion regulation, memory consolidation, problem-solving, random brain activity", "Just noise", "Meaningless"],
          correct: 1,
          explanation: "Dreams: REM stage, brain active, muscles paralyzed; can lucid dream (aware dreaming); nightmares during stress"
        },
        {
          question: "What are altered states of consciousness?",
          options: ["No states", "Meditation (calm), hypnosis (suggestible), drugs (chemical), sleep (restorative); different EEG patterns", "Only sleep", "Not real"],
          correct: 1,
          explanation: "Altered states: meditation shows theta waves (calm), hypnosis shows reduced frontal activity (less deliberation), drugs affect neurotransmitters"
        },
        {
          question: "How do drugs affect consciousness?",
          options: ["No effect", "Interact with neurotransmitters: stimulants (dopamine), depressants (GABA), hallucinogens (serotonin); risk dependence", "No impact", "Always helpful"],
          correct: 1,
          explanation: "Drugs: caffeine (adenosine antagonist), alcohol (GABA agonist, inhibitions drop), marijuana (CB1 receptors), opioids (endorphin system)"
        },
        {
          question: "What is epigenetics?",
          options: ["Gene change", "Gene expression regulation without DNA change; environment affects which genes activate; heritable without mutation", "Only genetics", "No evidence"],
          correct: 1,
          explanation: "Epigenetics: Dutch famine (mothers malnourished) → offspring have lower methylation, higher obesity; environment shapes biology"
        }
      ]
    },
    74: {
      type: "memory",
      title: "Development & Growth",
      description: "Flip and match pairs from Lesson 74 videos: Piaget | Attachment | Milestones | Parenting | Moral Development",
      pairs: [
        { term: "Sensorimotor Stage", answer: "dev1" },
        { term: "Birth-2 years: learning through senses and movement, object permanence (out of sight ≠ gone)", answer: "dev1" },
        { term: "Preoperational Stage", answer: "dev2" },
        { term: "2-7 years: language, symbolic play, egocentrism (can't take others' perspective)", answer: "dev2" },
        { term: "Concrete Operational", answer: "dev3" },
        { term: "7-11 years: logical thinking with concrete objects, conservation (amount doesn't change with shape)", answer: "dev3" },
        { term: "Formal Operational", answer: "dev4" },
        { term: "11+ years: abstract thinking, hypotheticals, idealism; not everyone reaches full abstraction", answer: "dev4" },
        { term: "Attachment", answer: "dev5" },
        { term: "Secure attachment (caregiver responsive) → emotional security, healthy relationships; insecure → anxiety, avoidance", answer: "dev5" },
        { term: "Authoritative Parenting", answer: "dev6" },
        { term: "Clear rules + warmth → best outcomes (confident, competent); vs authoritarian (strict) or permissive (indulgent)", answer: "dev6" }
      ]
    },
    75: {
      type: "drag",
      title: "Adolescent Development",
      description: "Match adolescent changes from Lesson 75 videos to their domains",
      pairs: [
        { term: "Physical Development", pairs: ["Puberty: growth spurt, hormonal changes (testosterone, estrogen)", "Secondary sexual characteristics: body hair, voice changes", "Brain development: prefrontal cortex (judgment) lags limbic system (emotion)"] },
        { term: "Cognitive Development", pairs: ["Formal operational thinking (Piaget): abstract, hypotheticals, idealism", "Risk assessment underdeveloped relative to thrill-seeking: explains recklessness", "Metacognition: thinking about thinking; identity questions 'Who am I?'"] },
        { term: "Social-Emotional Development", pairs: ["Identity vs. role confusion (Erikson): exploring beliefs, values, sexuality", "Peer relationships crucial; peer pressure increases; family relationships shift", "Autonomy increasing; parent conflict peaks mid-adolescence before resolution"] }
      ]
    },
    76: {
      type: "matching",
      title: "Adult Development & Aging",
      description: "Match adult life stages from Lesson 76 videos with their characteristics",
      pairs: [
        { term: "Early Adulthood (18-40)", answer: "Intimacy vs. isolation (Erikson): forming deep relationships, partnerships; identity solidifying; peak physical ability" },
        { term: "Middle Adulthood (40-65)", answer: "Generativity vs. stagnation (Erikson): contribution (parenting, mentoring, work); midlife reassessment; still cognitively capable" },
        { term: "Late Adulthood (65+)", answer: "Integrity vs. despair (Erikson): life review, acceptance or regret; cognitive changes (speed slows, wisdom grows); biological decline" },
        { term: "Physical Aging", answer: "Cellular (telomere shortening), organ decline, sensory changes; gender differences (women: menopause; men: gradual decline)" },
        { term: "Cognitive Aging", answer: "Fluid intelligence (speed, reasoning) declines; crystallized intelligence (knowledge, judgment) stable or improves with age/experience" },
        { term: "Social-Emotional Development", answer: "Relationships selective (quality over quantity); emotional regulation improves; purpose/meaning-making increases" }
      ]
    },
    77: {
      type: "puzzle",
      title: "Life Stages & Well-being",
      description: "Rearrange puzzle pieces from Lesson 77 videos about lifespan development",
      pieces: [
        "Infancy: Trust vs mistrust; secure attachment foundation",
        "Toddlerhood: Autonomy vs shame/doubt; exploring independence",
        "Early childhood: Initiative vs guilt; play-based learning",
        "Middle childhood: Industry vs inferiority; skill development, peer importance",
        "Adolescence: Identity vs role confusion; physical/cognitive/social changes",
        "Early adulthood: Intimacy vs isolation; relationships, career launch",
        "Middle adulthood: Generativity vs stagnation; contribution, mentoring",
        "Late adulthood: Integrity vs despair; life review, acceptance",
        "Success = developing competence + healthy relationships at each stage",
        "Failure in stage → identity/relationship challenges later (can be resolved with support)"
      ],
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    78: {
      type: "reaction",
      title: "Psychological Disorders",
      description: "Tap terms from Lesson 78 videos as fast as possible: Anxiety | OCD | PTSD | Depression | Bipolar",
      items: ["Generalized Anxiety Disorder", "Panic Disorder", "Specific Phobia", "OCD (Obsessions + Compulsions)", "PTSD (Flashbacks, Hyperarousal)", "Major Depressive Disorder", "Bipolar Disorder", "Seasonal Affective Disorder", "Amygdala", "Neurotransmitters"]
    },
    79: {
      type: "builder",
      title: "Treatment & Therapy Approaches",
      description: "Build understanding from Lesson 79 videos: Psychotherapy Types | Biomedical Treatments | Integration",
      elements: [
        { term: "Cognitive-Behavioral Therapy (CBT)", definition: "Identify → challenge → change maladaptive thoughts, develop coping behaviors; empirically supported for depression, anxiety, OCD" },
        { term: "Psychodynamic Therapy", definition: "Explore unconscious conflicts, defense mechanisms, early relationships; less evidence than CBT but helps some with insight" },
        { term: "Humanistic Therapy", definition: "Emphasize personal growth, self-actualization, client-centered (Rogers); less structured; research limited" },
        { term: "Antidepressants (SSRIs)", definition: "Increase serotonin availability; treat depression, anxiety, OCD; slow onset (weeks), common side effects (sexual dysfunction, weight gain)" },
        { term: "Antipsychotics", definition: "Block dopamine; treat schizophrenia, bipolar; side effects (movement disorders); newer atypicals better tolerated" },
        { term: "Anxiolytics (Benzodiazepines)", definition: "Enhance GABA; quick relief; addiction risk high; short-term use only; CBT preferred long-term" },
        { term: "Electroconvulsive Therapy (ECT)", definition: "Induce seizure under anesthesia; severe depression, treatment-resistant; effective but controversial; memory side effects" },
        { term: "Transcranial Magnetic Stimulation (TMS)", definition: "Magnetic pulses to brain; depression treatment; fewer side effects than ECT; emerging evidence" },
        { term: "Integration (Eclectic)", definition: "Combine therapy types + medication based on individual; best outcomes typically use multiple approaches" },
        { term: "Prevention & Resilience", definition: "Early intervention, community support, stress management, social connection reduce mental health crisis; promote well-being proactively" }
      ]
    },
    80: {
      type: "quiz",
      title: "Social Psychology & Applications",
      description: "Master social behavior from Lesson 80 videos",
      questions: [
        { question: "What is social thinking and attribution?", options: ["No thinking", "Attribution: explain behavior via dispositions vs situation; fundamental attribution error (overestimate person, underestimate situation); self-serving bias", "Always accurate", "No biases"], correct: 1, explanation: "Attribution: when others act, we blame personality; when we act, we blame situation → biases affect judgment, stereotyping, prejudice." },
        { question: "What is conformity?", options: ["No pressure", "Normative pressure (fit in → compliance), informative (use group for info → true belief change); Asch line study 35% conformed obviously wrong", "Individual only", "Never happens"], correct: 1, explanation: "Conformity: varies by culture (collectivist → higher), group size (peaks ~3-5), unanimity (one dissent → conformity drops); public vs private." },
        { question: "What is obedience?", options: ["No authority", "Milgram: 65% gave max shock following orders; authority, gradual escalation, proximity, responsibility diffusion increase obedience", "Always refuse", "Not studied"], correct: 1, explanation: "Obedience: situation matters more than personality; same people obey or rebel based on context; social forces powerful." },
        { question: "What is prejudice and how to reduce it?", options: ["No prejudice", "Prejudice: stereotypes + negative attitude + discrimination; reduction: contact (extended), cooperation (common goals), perspective-taking, education", "Can't change", "Only laws"], correct: 1, explanation: "Prejudice: implicit bias (automatic, unconscious) remains even with explicit egalitarianism; contact works if cooperation + equal status." },
        { question: "What is group behavior and collective action?", options: ["No group effects", "Social facilitation (presence → better/worse performance), loafing (effort ↓ group size), deindividuation (anonymity → disinhibition), groupthink (conformity → poor decisions)", "Groups don't matter", "Individuals always same"], correct: 1, explanation: "Groups: polarization (more extreme), bystander effect (diffusion responsibility), social identity (in-group bias); apply to leadership, teams, social change." }
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

      // Add XP reward (equal to coins earned)
      addXP(user.id, activeGame.base_reward);

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

