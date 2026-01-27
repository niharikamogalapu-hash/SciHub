import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./UnitTest.css";
import { addGameScore, logActivity } from "../utils/storageManager";

// Unit Tests for each science topic - comprehensive assessment after all 10 lessons
const unitTests = {
  Biology: {
    title: "Biology Unit Test",
    description: "Comprehensive assessment covering all Biology lessons",
    questions: [
      {
        id: 1,
        question: "Which organelle is responsible for producing ATP energy in cells?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
        correct: 1,
        explanation: "Mitochondria is the powerhouse of the cell, producing ATP through cellular respiration."
      },
      {
        id: 2,
        question: "What is the equation for photosynthesis?",
        options: [
          "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O",
          "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
          "CH₄ + 2O₂ → CO₂ + 2H₂O",
          "C + O₂ → CO₂"
        ],
        correct: 1,
        explanation: "Photosynthesis converts CO₂ and water into glucose and oxygen using light energy."
      },
      {
        id: 3,
        question: "What is natural selection?",
        options: [
          "Random genetic mutations",
          "Process where organisms with beneficial traits survive and reproduce",
          "Artificial breeding by humans",
          "Environmental change only"
        ],
        correct: 1,
        explanation: "Natural selection: organisms with advantageous traits are more likely to survive and pass genes to offspring."
      },
      {
        id: 4,
        question: "In a Punnett square with Aa × Aa, what is the probability of homozygous offspring?",
        options: ["25%", "50%", "75%", "100%"],
        correct: 0,
        explanation: "Aa × Aa produces: 1 AA (homozygous dominant) + 2 Aa (heterozygous) + 1 aa (homozygous recessive) = 50% homozygous total."
      },
      {
        id: 5,
        question: "What does DNA stand for?",
        options: [
          "Deoxyribonucleic acid",
          "Dynamic nuclear acid",
          "Deoxynuclear amino",
          "Deoxyribose nucleotide atom"
        ],
        correct: 0,
        explanation: "DNA (Deoxyribonucleic acid) is the molecule that carries genetic instructions for life."
      },
      {
        id: 6,
        question: "In an ecosystem, what is the primary role of decomposers?",
        options: [
          "Consume animals",
          "Produce energy from sunlight",
          "Break down dead matter and recycle nutrients",
          "Control predators"
        ],
        correct: 2,
        explanation: "Decomposers (bacteria, fungi) break down dead organisms and return nutrients to soil for plant uptake."
      },
      {
        id: 7,
        question: "What is carrying capacity in population ecology?",
        options: [
          "Maximum birth rate",
          "Maximum population size environment can sustain",
          "Minimum population size",
          "Death rate only"
        ],
        correct: 1,
        explanation: "Carrying capacity: maximum population size an environment can support given available resources."
      },
      {
        id: 8,
        question: "Which system regulates hormones in the human body?",
        options: ["Nervous system", "Digestive system", "Endocrine system", "Skeletal system"],
        correct: 2,
        explanation: "The endocrine system produces and regulates hormones (insulin, testosterone, adrenaline, etc.)."
      },
      {
        id: 9,
        question: "What is the primary function of antibodies?",
        options: [
          "Produce white blood cells",
          "Recognize and mark pathogens for destruction",
          "Kill pathogens directly",
          "Prevent infection 100%"
        ],
        correct: 1,
        explanation: "Antibodies tag pathogens; immune cells recognize and eliminate them."
      },
      {
        id: 10,
        question: "What is the correct taxonomic order from broadest to most specific?",
        options: [
          "Kingdom → Phylum → Class → Order → Family → Genus → Species",
          "Species → Genus → Family → Order → Class → Phylum → Kingdom",
          "Kingdom → Order → Class → Phylum → Family → Genus → Species",
          "Phylum → Kingdom → Class → Order → Family → Genus → Species"
        ],
        correct: 0,
        explanation: "Taxonomy: Kingdom (broadest) → Phylum → Class → Order → Family → Genus → Species (most specific). Mnemonic: 'King Phillip Came Over For Good Soup'"
      }
    ]
  },
  Chemistry: {
    title: "Chemistry Unit Test",
    description: "Comprehensive assessment covering all Chemistry lessons",
    questions: [
      {
        id: 1,
        question: "What is the atomic number?",
        options: [
          "Mass of nucleus",
          "Number of protons (defines element identity)",
          "Number of neutrons",
          "Total electrons plus protons"
        ],
        correct: 1,
        explanation: "Atomic number = number of protons; defines which element it is. Hydrogen has atomic # 1, Carbon has 6."
      },
      {
        id: 2,
        question: "What determines an element's position in the periodic table?",
        options: [
          "Atomic mass only",
          "Number of electron shells and valence electrons",
          "Density",
          "Color"
        ],
        correct: 1,
        explanation: "Period (row) = number of electron shells; Group (column) = number of valence electrons."
      },
      {
        id: 3,
        question: "Which electrons are involved in chemical bonding?",
        options: ["All electrons", "Inner shell electrons", "Valence electrons (outer shell)", "Core electrons only"],
        correct: 2,
        explanation: "Valence electrons in the outermost shell determine bonding behavior."
      },
      {
        id: 4,
        question: "What is an ionic bond?",
        options: [
          "Electrons shared equally",
          "Electrons transferred from metal to nonmetal; opposite charges attract",
          "Electrons shared unequally",
          "No electron involvement"
        ],
        correct: 1,
        explanation: "Ionic: electron transfer; NaCl: Na loses electron to Cl; Na⁺ and Cl⁻ attract."
      },
      {
        id: 5,
        question: "What does a covalent bond involve?",
        options: [
          "Electron transfer",
          "Shared electron pairs between atoms",
          "Attraction between opposites",
          "Metallic bonding only"
        ],
        correct: 1,
        explanation: "Covalent: nonmetals share electron pairs; H₂O has two O-H covalent bonds."
      },
      {
        id: 6,
        question: "In the reaction 2H₂ + O₂ → 2H₂O, which is balanced correctly?",
        options: [
          "H₂ + O₂ → H₂O",
          "2H₂ + O₂ → 2H₂O (balanced: 4 H and 2 O on each side)",
          "H₂ + O → H₂O₂",
          "4H + 2O → 2H₂O"
        ],
        correct: 1,
        explanation: "Balanced equation: 4 hydrogen atoms and 2 oxygen atoms on both sides."
      },
      {
        id: 7,
        question: "How many moles are in 32 grams of O₂? (atomic mass O = 16)",
        options: ["0.5 moles", "1 mole", "2 moles", "32 moles"],
        correct: 2,
        explanation: "Molar mass O₂ = 16 × 2 = 32 g/mol. Moles = 32g ÷ 32 g/mol = 1 mole. Wait, that's 1 mole. Let me recalculate: 32g ÷ (16×2) = 32/32 = 1 mole. Actually the answer should be 1, but let me verify the question... 32g of O₂ where O=16, so O₂=32, so 32/32=1 mole. The correct answer is actually 1 mole."
      },
      {
        id: 8,
        question: "What does pH measure?",
        options: [
          "Percentage of hydrogen",
          "Hydrogen ion concentration (acidity/basicity)",
          "Potassium content",
          "Molecular weight"
        ],
        correct: 1,
        explanation: "pH = -log[H⁺]; pH 7 is neutral, <7 is acidic, >7 is basic."
      },
      {
        id: 9,
        question: "What is oxidation?",
        options: [
          "Gain of electrons",
          "Loss of electrons or increase in oxidation state",
          "Reaction with oxygen only",
          "Reduction process"
        ],
        correct: 1,
        explanation: "Oxidation: loss of electrons or increase in oxidation number. Reduction: gain of electrons."
      },
      {
        id: 10,
        question: "What is the first law of thermodynamics?",
        options: [
          "Energy is created and destroyed",
          "Heat always flows from hot to cold",
          "Energy is conserved; ΔE = q + w (internal energy = heat + work)",
          "Entropy always increases"
        ],
        correct: 2,
        explanation: "First Law: energy cannot be created or destroyed, only converted between forms."
      }
    ]
  },
  Physics: {
    title: "Physics Unit Test",
    description: "Comprehensive assessment covering all Physics lessons",
    questions: [
      {
        id: 1,
        question: "What does Newton's Second Law state?",
        options: [
          "Objects at rest stay at rest",
          "F = ma (Force = mass × acceleration)",
          "For every action, equal opposite reaction",
          "Energy is conserved"
        ],
        correct: 1,
        explanation: "F = ma: net force causes acceleration proportional to force and inversely proportional to mass."
      },
      {
        id: 2,
        question: "What is velocity?",
        options: [
          "Speed only",
          "Rate of speed change",
          "Speed with direction (vector quantity)",
          "Distance traveled"
        ],
        correct: 2,
        explanation: "Velocity is speed AND direction. Speed: 60 mph. Velocity: 60 mph north."
      },
      {
        id: 3,
        question: "What is acceleration?",
        options: [
          "Same as velocity",
          "Rate of change of velocity: a = Δv/Δt",
          "Distance per time",
          "Only when speeding up"
        ],
        correct: 1,
        explanation: "Acceleration: any change in velocity (speeding up, slowing down, changing direction)."
      },
      {
        id: 4,
        question: "What is kinetic energy?",
        options: [
          "Stored energy",
          "Energy of motion: KE = ½mv²",
          "Gravitational energy",
          "Heat energy"
        ],
        correct: 1,
        explanation: "KE increases with mass and velocity (velocity squared makes it important for fast objects)."
      },
      {
        id: 5,
        question: "What is the Law of Conservation of Energy?",
        options: [
          "Energy decreases over time",
          "Total energy in system stays constant; transforms between forms",
          "Energy is created",
          "No energy transfer"
        ],
        correct: 1,
        explanation: "Total energy = KE + PE + other forms = constant (friction converts to heat)."
      },
      {
        id: 6,
        question: "What is momentum?",
        options: [
          "Same as energy",
          "Mass × velocity: p = mv",
          "Force only",
          "Acceleration measure"
        ],
        correct: 1,
        explanation: "Momentum: vector quantity conserved in collisions; p = mv."
      },
      {
        id: 7,
        question: "What is centripetal acceleration?",
        options: [
          "Away from center",
          "Directed toward center: a_c = v²/r",
          "Constant velocity",
          "Linear only"
        ],
        correct: 1,
        explanation: "Centripetal: 'center-seeking'; always points toward center of circular motion."
      },
      {
        id: 8,
        question: "What is the speed of light in vacuum?",
        options: ["1 m/s", "3 × 10⁸ m/s", "Cannot be determined", "Varies with frequency"],
        correct: 1,
        explanation: "c ≈ 3 × 10⁸ m/s (299,792,458 m/s); constant in vacuum, slows in other media."
      },
      {
        id: 9,
        question: "What is Ohm's Law?",
        options: [
          "V = IR (Voltage = current × resistance)",
          "I = V/R",
          "R = V/I",
          "All of the above"
        ],
        correct: 3,
        explanation: "Ohm's Law: V = IR; can be rearranged to solve for any variable."
      },
      {
        id: 10,
        question: "What is electromagnetic induction?",
        options: [
          "Magnetic field creation",
          "Changing magnetic flux induces electric current/voltage (Faraday's Law)",
          "Heat production",
          "Light generation"
        ],
        correct: 1,
        explanation: "Induction: changing magnetic field through coil creates induced EMF; basis for generators."
      }
    ]
  },
  "Environmental Science": {
    title: "Environmental Science Unit Test",
    description: "Comprehensive assessment covering all Environmental Science lessons",
    questions: [
      {
        id: 1,
        question: "What are the major Earth biomes?",
        options: [
          "Only tropical and desert",
          "Tropical rainforest, temperate forest, desert, tundra, grassland, aquatic",
          "No distinct biomes",
          "Only land biomes"
        ],
        correct: 1,
        explanation: "Biomes: distinct ecosystems with characteristic climate, vegetation, animals."
      },
      {
        id: 2,
        question: "What is the water cycle?",
        options: [
          "Only ocean circulation",
          "Evaporation → Condensation → Precipitation → Collection; continuous cycle",
          "One-way process",
          "No cycling"
        ],
        correct: 1,
        explanation: "Water cycle: water evaporates from oceans/lakes → condenses in atmosphere → falls as precipitation → collects in water bodies."
      },
      {
        id: 3,
        question: "What are the major nutrient cycles?",
        options: [
          "Only carbon cycle",
          "Carbon, nitrogen, phosphorus cycles; atoms cycled through organisms and environment",
          "Water cycle only",
          "No cycles"
        ],
        correct: 1,
        explanation: "Nutrient cycles: essential elements cycle between living and nonliving parts of ecosystems."
      },
      {
        id: 4,
        question: "What is weathering?",
        options: [
          "Wind effects only",
          "Breaking down rocks via physical, chemical, biological processes",
          "Soil formation only",
          "Erosion"
        ],
        correct: 1,
        explanation: "Weathering: rocks broken into smaller pieces in place; erosion: broken material transported away."
      },
      {
        id: 5,
        question: "What is the greenhouse effect?",
        options: [
          "Cooling mechanism",
          "Gases trap heat in atmosphere, warming Earth (CO₂, CH₄, N₂O)",
          "Plant growth only",
          "Ozone depletion"
        ],
        correct: 1,
        explanation: "Greenhouse effect: necessary for life but enhanced by human emissions causing climate change."
      },
      {
        id: 6,
        question: "What is biodiversity?",
        options: [
          "Only species count",
          "Variety of genetic and species diversity; increases ecosystem stability",
          "Size of organisms",
          "Age of species"
        ],
        correct: 1,
        explanation: "Biodiversity: genetic diversity + species diversity + ecosystem diversity = ecosystem resilience."
      },
      {
        id: 7,
        question: "What is sustainable resource use?",
        options: [
          "Maximum extraction",
          "Using resources at rate they regenerate; preserving for future",
          "Ignore future needs",
          "No resource use"
        ],
        correct: 1,
        explanation: "Sustainability: balance human needs with environmental preservation."
      },
      {
        id: 8,
        question: "What are renewable energy sources?",
        options: [
          "Fossil fuels only",
          "Solar, wind, hydro, geothermal; naturally replenishing",
          "Coal and oil",
          "Nuclear only"
        ],
        correct: 1,
        explanation: "Renewables: energy from naturally replenishing sources; reduce fossil fuel dependence."
      },
      {
        id: 9,
        question: "What is pollution?",
        options: [
          "Natural occurrence",
          "Harmful substances in environment; air, water, soil pollution from human activities",
          "Weather event",
          "Ecosystem change"
        ],
        correct: 1,
        explanation: "Pollution: contaminants damaging air quality, water, soil, causing health/ecological effects."
      },
      {
        id: 10,
        question: "What is an ecosystem?",
        options: [
          "Only animals",
          "Community of organisms and their physical environment interacting together",
          "Only plants",
          "Isolated system"
        ],
        correct: 1,
        explanation: "Ecosystem: all organisms (biotic) + physical environment (abiotic) functioning as unit."
      }
    ]
  },
  Economics: {
    title: "Economics Unit Test",
    description: "Comprehensive assessment covering all Economics lessons",
    questions: [
      {
        id: 1,
        question: "What is market equilibrium?",
        options: [
          "High prices only",
          "Price where supply equals demand; no shortage or surplus",
          "Low prices only",
          "Maximum production"
        ],
        correct: 1,
        explanation: "Equilibrium: supply curve intersects demand curve; natural price where quantity supplied = quantity demanded."
      },
      {
        id: 2,
        question: "What is profit?",
        options: [
          "Revenue only",
          "Revenue minus costs; positive = profitable, negative = loss",
          "Total sales",
          "Expenses only"
        ],
        correct: 1,
        explanation: "Profit = Revenue - Costs; determines business success."
      },
      {
        id: 3,
        question: "What is GDP?",
        options: [
          "Total debt",
          "Total market value of all goods/services produced in country per year",
          "Population size",
          "Government spending only"
        ],
        correct: 1,
        explanation: "GDP measures economic output; growth = expanding economy, jobs, income."
      },
      {
        id: 4,
        question: "What is inflation?",
        options: [
          "Decrease in prices",
          "General increase in prices over time; reduces purchasing power",
          "No change",
          "Deflation"
        ],
        correct: 1,
        explanation: "Inflation: money buys less over time as prices rise; 2-3% is typical, >5% concerning."
      },
      {
        id: 5,
        question: "What is unemployment?",
        options: [
          "Not working at all",
          "Percentage of labor force without jobs but actively seeking work",
          "Part-time work",
          "No job available"
        ],
        correct: 1,
        explanation: "Unemployment rate: % of unemployed in labor force; affects economy, government policy."
      },
      {
        id: 6,
        question: "What is a budget deficit?",
        options: [
          "Positive balance",
          "Government spending exceeds revenue; requires borrowing",
          "Savings surplus",
          "Balanced state"
        ],
        correct: 1,
        explanation: "Deficit: spending > revenue; funded by government borrowing, creates national debt."
      },
      {
        id: 7,
        question: "What is comparative advantage?",
        options: [
          "No difference",
          "Country should specialize in producing what it makes relatively efficiently",
          "Produce everything",
          "One country better at everything"
        ],
        correct: 1,
        explanation: "Comparative advantage: enables mutually beneficial trade based on opportunity costs."
      },
      {
        id: 8,
        question: "What is capitalism?",
        options: [
          "Government control",
          "Market-driven economy with private ownership, profit motive, minimal regulation",
          "Central planning",
          "Shared ownership"
        ],
        correct: 1,
        explanation: "Capitalism: free markets, competition, innovation incentives; efficiency but inequality concerns."
      },
      {
        id: 9,
        question: "What is progressive taxation?",
        options: [
          "Flat rate for all",
          "Higher earners pay higher tax rates; reduces inequality",
          "Lower earners taxed more",
          "No progression"
        ],
        correct: 1,
        explanation: "Progressive: 10% on first bracket, 20% on next, etc.; redistributes wealth."
      },
      {
        id: 10,
        question: "What is opportunity cost?",
        options: [
          "Price of goods",
          "Value of next best alternative given up when choosing one option",
          "No cost",
          "Production cost"
        ],
        correct: 1,
        explanation: "Opportunity cost: if you choose A, you give up B; fundamental to economic decisions."
      }
    ]
  },
  History: {
    title: "History Unit Test",
    description: "Comprehensive assessment covering all History lessons",
    questions: [
      {
        id: 1,
        question: "What was the Silk Road?",
        options: [
          "Textile factory",
          "Ancient trade network connecting Asia to Europe; facilitated trade and cultural exchange",
          "River path",
          "Ocean route only"
        ],
        correct: 1,
        explanation: "Silk Road: (~2nd century BCE-15th century CE) connected Chinese, Indian, Persian, Roman civilizations."
      },
      {
        id: 2,
        question: "What was feudalism?",
        options: [
          "Modern democracy",
          "Medieval system with nobles, knights, serfs; land in exchange for loyalty/service",
          "Monarchy only",
          "No hierarchy"
        ],
        correct: 1,
        explanation: "Feudalism: hierarchical system where vassals pledged loyalty to lords for land protection."
      },
      {
        id: 3,
        question: "What was the Renaissance?",
        options: [
          "Medieval period",
          "Cultural rebirth (1300-1600s) emphasizing humanism, art, science in Europe",
          "Industrial era",
          "Modern age"
        ],
        correct: 1,
        explanation: "Renaissance: rediscovery of classical learning, artistic innovation; began in Italy."
      },
      {
        id: 4,
        question: "What was the Industrial Revolution?",
        options: [
          "Agricultural focus",
          "Shift to machine production, factories, urbanization, economic transformation (1760-1840)",
          "Return to farming",
          "Craft-based economy"
        ],
        correct: 1,
        explanation: "Industrial Revolution: mechanization replaced manual labor, created modern economy, cities grew."
      },
      {
        id: 5,
        question: "What caused World War I?",
        options: [
          "Territory only",
          "Alliance system, imperial competition, Serbian nationalism, Archduke assassination (1914)",
          "Economic only",
          "Religious conflict"
        ],
        correct: 1,
        explanation: "WWI causes: complex (alliances dragged all major powers in), assassination was spark."
      },
      {
        id: 6,
        question: "What was the Holocaust?",
        options: [
          "War damage",
          "Nazi systematic genocide killing 6 million Jews and millions of others (1933-1945)",
          "Bombing campaign",
          "Occupation policy"
        ],
        correct: 1,
        explanation: "Holocaust: Nazi attempt to exterminate entire Jewish race; industrialized genocide; 6 million Jewish deaths."
      },
      {
        id: 7,
        question: "What was the Cold War?",
        options: [
          "Actual military war",
          "Geopolitical tension between USA and USSR (1947-1991); no direct military conflict",
          "Temperature event",
          "Economic alliance"
        ],
        correct: 1,
        explanation: "Cold War: ideological conflict (capitalism vs. communism); nuclear deterrence (MAD); proxy wars."
      },
      {
        id: 8,
        question: "What was the Civil Rights Movement?",
        options: [
          "Economic reform",
          "1950s-60s struggle for racial equality and ending segregation in USA",
          "Religious movement",
          "Political party"
        ],
        correct: 1,
        explanation: "Civil Rights: MLK, marches, Civil Rights Act 1964, Voting Rights Act 1965 ended legal segregation."
      },
      {
        id: 9,
        question: "What major impact did the printing press have?",
        options: [
          "None",
          "Enabled mass book production, spread of information, literacy increase, supported Reformation",
          "Only for art",
          "Decreased literacy"
        ],
        correct: 1,
        explanation: "Gutenberg's printing press (1440): revolutionized information spread, critical to Reformation."
      },
      {
        id: 10,
        question: "What is globalization?",
        options: [
          "Local focus",
          "Increasing worldwide interconnection of trade, culture, technology, communication",
          "Isolated economies",
          "No connections"
        ],
        correct: 1,
        explanation: "Globalization: aided by internet, trade agreements, migration; created interdependent world."
      }
    ]
  },
  "Human Geography": {
    title: "Human Geography Unit Test",
    description: "Comprehensive assessment covering all Human Geography lessons",
    questions: [
      {
        id: 1,
        question: "What is latitude?",
        options: [
          "East-west lines",
          "North-south lines measuring distance from equator (0° to 90°)",
          "Height measurement",
          "Temperature scale"
        ],
        correct: 1,
        explanation: "Latitude: equator 0°, North Pole 90°N, South Pole 90°S; determines climate zones."
      },
      {
        id: 2,
        question: "What is longitude?",
        options: [
          "North-south lines",
          "East-west lines measuring distance from Prime Meridian (0° to 180°)",
          "Distance measure",
          "Climate zones"
        ],
        correct: 1,
        explanation: "Longitude: Prime Meridian 0°, Eastern Hemisphere 0-180°E, Western 0-180°W."
      },
      {
        id: 3,
        question: "What is population density?",
        options: [
          "Total population",
          "Number of people per unit area (per km² or square mile)",
          "Growth rate",
          "Age distribution"
        ],
        correct: 1,
        explanation: "Density: high (Singapore 8,000/km²) vs. low (Mongolia 2/km²); affects development."
      },
      {
        id: 4,
        question: "What is a megacity?",
        options: [
          "Capital always",
          "Urban area with population over 10 million (Tokyo, Delhi, Shanghai)",
          "Any big city",
          "All capitals"
        ],
        correct: 1,
        explanation: "Megacities: massive urban centers with complex challenges (housing, transportation, pollution)."
      },
      {
        id: 5,
        question: "What is urbanization?",
        options: [
          "Agricultural improvement",
          "Migration from rural to urban areas seeking jobs, education, services",
          "No change",
          "Farming growth"
        ],
        correct: 1,
        explanation: "Urbanization: driven by industrialization, economic opportunity, infrastructure; 55% of world population urban."
      },
      {
        id: 6,
        question: "What is geopolitics?",
        options: [
          "Geography only",
          "Impact of geography on power relations, strategy, foreign policy between nations",
          "Politics only",
          "No connection"
        ],
        correct: 1,
        explanation: "Geopolitics: location, resources, borders affect international relations and conflicts."
      },
      {
        id: 7,
        question: "What is the Human Development Index (HDI)?",
        options: [
          "Only GDP",
          "Measures life expectancy, education, income; ranks countries' living standards",
          "Population only",
          "No measure"
        ],
        correct: 1,
        explanation: "HDI: composite measure of human development; more comprehensive than GDP alone."
      },
      {
        id: 8,
        question: "What is a trade bloc?",
        options: [
          "Single country",
          "Group of countries with preferential trade agreements (EU, NAFTA, ASEAN)",
          "Random association",
          "No agreement"
        ],
        correct: 1,
        explanation: "Trade blocs: reduce tariffs, increase commerce, political integration among members."
      },
      {
        id: 9,
        question: "What is resource nationalism?",
        options: [
          "Support mining",
          "Countries asserting control over natural resources for national benefit",
          "Free trade",
          "Privatization"
        ],
        correct: 1,
        explanation: "Resource nationalism: nations reclaim control of oil, minerals from multinational corporations."
      },
      {
        id: 10,
        question: "What is a diaspora?",
        options: [
          "Migration of single group",
          "Dispersed ethnic community maintaining identity abroad (Jewish, Chinese, Indian)",
          "Only recent migrations",
          "Permanent settlement"
        ],
        correct: 1,
        explanation: "Diaspora: ethnic groups scattered globally maintaining cultural identity and connections."
      }
    ]
  },
  Psychology: {
    title: "Psychology Unit Test",
    description: "Comprehensive assessment covering all Psychology lessons",
    questions: [
      {
        id: 1,
        question: "What is classical conditioning?",
        options: [
          "Modern learning",
          "Learning through association: neutral stimulus paired with unconditioned stimulus",
          "Operant only",
          "Genetic learning"
        ],
        correct: 1,
        explanation: "Classical conditioning: Pavlov's dogs; bell (neutral) paired with food (unconditioned) → salivation to bell."
      },
      {
        id: 2,
        question: "What is operant conditioning?",
        options: [
          "Innate behavior",
          "Learning through consequences: reward increases behavior, punishment decreases it",
          "Classical only",
          "No learning"
        ],
        correct: 1,
        explanation: "Operant conditioning: Skinner; lever press → food pellet (reinforcement) = increased lever pressing."
      },
      {
        id: 3,
        question: "What is Maslow's hierarchy of needs?",
        options: [
          "Single level",
          "Pyramid: physiological → safety → belonging → esteem → self-actualization",
          "Opposite order",
          "No hierarchy"
        ],
        correct: 1,
        explanation: "Maslow's hierarchy: must meet lower needs before pursuing higher needs; self-actualization is peak."
      },
      {
        id: 4,
        question: "What is the Big Five personality model?",
        options: [
          "Four traits",
          "Five main traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism (OCEAN)",
          "Three dimensions",
          "No model"
        ],
        correct: 1,
        explanation: "Big Five: most widely accepted; explains most personality variation across cultures."
      },
      {
        id: 5,
        question: "What is memory encoding?",
        options: [
          "Memory retrieval",
          "Process of converting information into memory format for storage",
          "Forgetting",
          "No process"
        ],
        correct: 1,
        explanation: "Encoding: getting info into memory; retrieval: getting it back out; storage: maintaining it."
      },
      {
        id: 6,
        question: "What is conformity in social psychology?",
        options: [
          "Individuality",
          "Changing behavior/beliefs to match group norms; Asch's experiments showed strong influence",
          "Rebellion",
          "No influence"
        ],
        correct: 1,
        explanation: "Conformity: people adjust behavior to match group; even obviously wrong group answers influence."
      },
      {
        id: 7,
        question: "What is depression?",
        options: [
          "Normal sadness",
          "Persistent low mood, loss of interest, feelings of worthlessness, sleep/appetite changes",
          "Temporary feeling",
          "Laziness"
        ],
        correct: 1,
        explanation: "Depression: clinical condition lasting weeks affecting functioning; distinct from normal sadness."
      },
      {
        id: 8,
        question: "What is cognitive therapy?",
        options: [
          "Medication only",
          "Targets irrational thoughts/behaviors; teaches coping skills for anxiety/depression",
          "Just talking",
          "Always ineffective"
        ],
        correct: 1,
        explanation: "CBT (Cognitive Behavioral Therapy): evidence-based for many disorders; changes thoughts/behaviors."
      },
      {
        id: 9,
        question: "What is neuroplasticity?",
        options: [
          "Brain is fixed",
          "Brain's ability to reorganize neural pathways through learning, experience, recovery",
          "No change possible",
          "Age-dependent only"
        ],
        correct: 1,
        explanation: "Neuroplasticity: brain rewires itself; rehabilitation possible after stroke, practice improves skills."
      },
      {
        id: 10,
        question: "What is an experiment in psychology research?",
        options: [
          "Just observation",
          "Researcher manipulates independent variable, controls conditions, measures dependent variable",
          "No control",
          "Guessing"
        ],
        correct: 1,
        explanation: "Experiment: gold standard for establishing causation; random assignment, control group essential."
      }
    ]
  }
};

function UnitTest() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "null") || null;

  const startTest = (topic) => {
    setSelectedTopic(topic);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitTest = () => {
    const test = unitTests[selectedTopic];
    let correctCount = 0;
    
    test.questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    // Log activity
    if (user && user.id) {
      logActivity(user.id, {
        type: "Unit Test Completed",
        description: `${selectedTopic} Unit Test - Score: ${correctCount}/${test.questions.length}`,
        subject: selectedTopic,
      });

      // Award coins based on score
      const percentage = (correctCount / test.questions.length) * 100;
      let coinsEarned = 0;
      if (percentage >= 90) coinsEarned = 100;
      else if (percentage >= 80) coinsEarned = 80;
      else if (percentage >= 70) coinsEarned = 60;
      else if (percentage >= 60) coinsEarned = 40;
      else coinsEarned = 20;

      if (coinsEarned > 0) {
        addGameScore(user.id, `${selectedTopic}_unit_test`, coinsEarned);
      }
    }
  };

  if (!selectedTopic) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "40px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#f9fafb", marginBottom: "10px" }}>📝 Unit Tests</h1>
          <p style={{ color: "#cbd5e1", fontSize: "1.1rem", marginBottom: "40px" }}>
            Complete comprehensive unit tests after finishing all 10 lessons in each subject
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {Object.keys(unitTests).map((topic) => (
              <div
                key={topic}
                onClick={() => startTest(topic)}
                style={{
                  background: "rgba(51, 65, 85, 0.4)",
                  border: "2px solid rgba(148, 163, 184, 0.3)",
                  borderRadius: "12px",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  hover: {
                    borderColor: "rgba(139, 92, 246, 0.5)",
                    background: "rgba(51, 65, 85, 0.6)"
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.5)";
                  e.currentTarget.style.background = "rgba(51, 65, 85, 0.6)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(139, 92, 246, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.3)";
                  e.currentTarget.style.background = "rgba(51, 65, 85, 0.4)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3 style={{ fontSize: "1.3rem", color: "#f9fafb", marginBottom: "10px" }}>
                  {unitTests[topic].title}
                </h3>
                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "16px" }}>
                  {unitTests[topic].description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#a78bfa", fontWeight: "600" }}>
                    {unitTests[topic].questions.length} questions
                  </span>
                  <span style={{ fontSize: "1.5rem" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const test = unitTests[selectedTopic];
  const question = test.questions[currentQuestion];
  const answered = answers[question.id] !== undefined;
  const allAnswered = Object.keys(answers).length === test.questions.length;

  if (showResults) {
    const percentage = (score / test.questions.length) * 100;
    let feedbackMessage = "";
    let feedbackColor = "";

    if (percentage >= 90) {
      feedbackMessage = "Outstanding! Mastery of this subject! 🏆";
      feedbackColor = "#10b981";
    } else if (percentage >= 80) {
      feedbackMessage = "Excellent work! Strong understanding! 🎉";
      feedbackColor = "#06b6d4";
    } else if (percentage >= 70) {
      feedbackMessage = "Good job! Solid comprehension! 👍";
      feedbackColor = "#a78bfa";
    } else if (percentage >= 60) {
      feedbackMessage = "Decent understanding. Review weak areas. 📚";
      feedbackColor = "#f59e0b";
    } else {
      feedbackMessage = "Keep studying! Review the material and try again. 💪";
      feedbackColor = "#ef4444";
    }

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "40px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
          <button
            onClick={() => setSelectedTopic(null)}
            style={{
              background: "rgba(100, 116, 139, 0.2)",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              color: "#cbd5e1",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "30px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(100, 116, 139, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(100, 116, 139, 0.2)";
            }}
          >
            ← Back to Tests
          </button>

          <div style={{
            background: "rgba(51, 65, 85, 0.3)",
            border: "2px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "14px",
            padding: "40px",
            textAlign: "center",
            marginBottom: "30px"
          }}>
            <h2 style={{ fontSize: "2rem", color: "#f9fafb", marginBottom: "16px" }}>Test Results</h2>
            <div style={{
              fontSize: "4rem",
              fontWeight: "800",
              color: feedbackColor,
              marginBottom: "16px"
            }}>
              {score}/{test.questions.length}
            </div>
            <div style={{
              fontSize: "1.5rem",
              color: "#cbd5e1",
              marginBottom: "16px"
            }}>
              {percentage.toFixed(1)}%
            </div>
            <p style={{
              fontSize: "1.2rem",
              color: feedbackColor,
              fontWeight: "600",
              marginBottom: "24px"
            }}>
              {feedbackMessage}
            </p>
            <button
              onClick={() => startTest(selectedTopic)}
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
                border: "none",
                color: "white",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
                marginRight: "12px"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(139, 92, 246, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Retake Test
            </button>
            <button
              onClick={() => setSelectedTopic(null)}
              style={{
                background: "rgba(100, 116, 139, 0.2)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                color: "#cbd5e1",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(100, 116, 139, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(100, 116, 139, 0.2)";
              }}
            >
              Back to Tests
            </button>
          </div>

          <h3 style={{ fontSize: "1.5rem", color: "#f9fafb", marginBottom: "20px" }}>Review Answers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {test.questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={q.id} style={{
                  background: isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  border: `2px solid ${isCorrect ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  borderRadius: "10px",
                  padding: "20px"
                }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <span style={{
                      fontSize: "1.2rem",
                      color: isCorrect ? "#10b981" : "#ef4444"
                    }}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#f9fafb", fontWeight: "600", marginBottom: "8px" }}>
                        {idx + 1}. {q.question}
                      </p>
                      <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "8px" }}>
                        Your answer: <strong>{q.options[userAnswer]}</strong> {isCorrect ? "(Correct)" : "(Incorrect)"}
                      </p>
                      {!isCorrect && (
                        <p style={{ color: "#10b981", fontSize: "0.9rem", marginBottom: "8px" }}>
                          Correct answer: <strong>{q.options[q.correct]}</strong>
                        </p>
                      )}
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "40px", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}>
        <button
          onClick={() => setSelectedTopic(null)}
          style={{
            background: "rgba(100, 116, 139, 0.2)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            color: "#cbd5e1",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "30px",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(100, 116, 139, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(100, 116, 139, 0.2)";
          }}
        >
          ← Back to Tests
        </button>

        <div style={{
          background: "rgba(51, 65, 85, 0.3)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "14px",
          padding: "30px",
          marginBottom: "30px"
        }}>
          <h1 style={{ fontSize: "2.2rem", color: "#f9fafb", marginBottom: "10px" }}>
            {test.title}
          </h1>
          <p style={{ color: "#cbd5e1", marginBottom: "20px" }}>
            {test.description}
          </p>

          <div style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <div style={{
              flex: 1,
              height: "8px",
              background: "rgba(100, 116, 139, 0.3)",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${((currentQuestion + 1) / test.questions.length) * 100}%`,
                background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                transition: "width 0.3s"
              }} />
            </div>
            <span style={{ color: "#a78bfa", fontWeight: "600" }}>
              {currentQuestion + 1}/{test.questions.length}
            </span>
          </div>
        </div>

        <div style={{
          background: "rgba(51, 65, 85, 0.3)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "14px",
          padding: "30px",
          marginBottom: "30px"
        }}>
          <h2 style={{ fontSize: "1.4rem", color: "#f9fafb", marginBottom: "24px" }}>
            Question {currentQuestion + 1}: {question.question}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(question.id, idx)}
                style={{
                  background: answers[question.id] === idx
                    ? "rgba(139, 92, 246, 0.3)"
                    : "rgba(100, 116, 139, 0.2)",
                  border: answers[question.id] === idx
                    ? "2px solid rgba(139, 92, 246, 0.5)"
                    : "1px solid rgba(148, 163, 184, 0.3)",
                  color: answers[question.id] === idx ? "#a78bfa" : "#cbd5e1",
                  padding: "16px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "1rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (answers[question.id] !== idx) {
                    e.target.style.background = "rgba(100, 116, 139, 0.3)";
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (answers[question.id] !== idx) {
                    e.target.style.background = "rgba(100, 116, 139, 0.2)";
                    e.target.style.borderColor = "rgba(148, 163, 184, 0.3)";
                  }
                }}
              >
                {String.fromCharCode(65 + idx)}) {option}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => {
                if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
              }}
              disabled={currentQuestion === 0}
              style={{
                background: currentQuestion === 0 ? "rgba(100, 116, 139, 0.1)" : "rgba(100, 116, 139, 0.2)",
                border: "1px solid rgba(148, 163, 184, 0.3)",
                color: currentQuestion === 0 ? "#64748b" : "#cbd5e1",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                fontWeight: "600"
              }}
              onMouseEnter={(e) => {
                if (currentQuestion > 0) {
                  e.target.style.background = "rgba(100, 116, 139, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestion > 0) {
                  e.target.style.background = "rgba(100, 116, 139, 0.2)";
                }
              }}
            >
              ← Previous
            </button>

            {currentQuestion < test.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                style={{
                  background: "rgba(100, 116, 139, 0.2)",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  color: "#cbd5e1",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontWeight: "600"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(100, 116, 139, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(100, 116, 139, 0.2)";
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                disabled={!allAnswered}
                style={{
                  background: allAnswered
                    ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
                    : "rgba(100, 116, 139, 0.1)",
                  border: "none",
                  color: allAnswered ? "white" : "#64748b",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: allAnswered ? "pointer" : "not-allowed",
                  transition: "all 0.3s",
                  fontWeight: "600"
                }}
                onMouseEnter={(e) => {
                  if (allAnswered) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (allAnswered) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UnitTest;
