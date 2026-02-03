import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./UnitTest.css";
import { addGameScore, logActivity } from "../utils/storageManager";

// Unit Tests for each science topic - comprehensive assessment after all 10 lessons
const unitTests = {
  "AP Biology": {
    title: "AP Biology Unit Test",
    description: "Comprehensive assessment covering all AP Biology lessons",
    questions: [
      {
        id: 1,
        question: "A student conducts an experiment to test the effect of light intensity on the rate of photosynthesis in Elodea plants. Which variable should be kept constant to ensure valid results?",
        options: ["Type of plant used", "Amount of CO2 in water", "Distance from light source", "Temperature of water"],
        correct: 1,
        explanation: "To isolate the effect of light intensity, other factors like CO2 concentration, temperature, and plant type must be kept constant."
      },
      {
        id: 2,
        question: "The graph below shows the population growth of bacteria in a closed system. Which phase represents exponential growth? (Assume graph is shown)",
        options: ["Lag phase", "Log phase", "Stationary phase", "Death phase"],
        correct: 1,
        explanation: "The log phase is when bacteria reproduce rapidly and population increases exponentially."
      },
      {
        id: 3,
        question: "A genetic cross between two heterozygous pea plants (Yy) for seed color results in a 3:1 ratio of yellow to green seeds. Which principle does this illustrate?",
        options: ["Law of Segregation", "Law of Independent Assortment", "Law of Dominance", "Law of Recessiveness"],
        correct: 0,
        explanation: "The Law of Segregation states that allele pairs separate during gamete formation, resulting in the observed 3:1 ratio."
      },
      {
        id: 4,
        question: "A scientist compares the amino acid sequences of hemoglobin in humans and chimpanzees. What type of evolutionary evidence is this?",
        options: ["Fossil evidence", "Molecular evidence", "Embryological evidence", "Biogeographical evidence"],
        correct: 1,
        explanation: "Molecular evidence involves comparing DNA or protein sequences to determine evolutionary relationships."
      },
      {
        id: 5,
        question: "In a population of finches, a drought causes only large seeds to be available. Over generations, the average beak size increases. What is this an example of?",
        options: ["Genetic drift", "Natural selection", "Gene flow", "Mutation"],
        correct: 1,
        explanation: "Natural selection favors finches with larger beaks, increasing their frequency in the population."
      },
      {
        id: 6,
        question: "A patient receives a blood transfusion of type A blood, but their blood type is O. What is the likely outcome?",
        options: ["No reaction", "Mild fever", "Agglutination and immune response", "Improved oxygen delivery"],
        correct: 2,
        explanation: "Type O blood has anti-A antibodies, so receiving type A blood causes agglutination and a dangerous immune reaction."
      },
      {
        id: 7,
        question: "Which of the following is a density-dependent limiting factor in population growth?",
        options: ["Flood", "Disease", "Earthquake", "Wildfire"],
        correct: 1,
        explanation: "Disease spreads more rapidly as population density increases, making it density-dependent."
      },
      {
        id: 8,
        question: "A diagram shows a food web in a pond ecosystem. If the population of frogs decreases, what is the most likely effect on the insect population?",
        options: ["Increase", "Decrease", "No change", "Extinction"],
        correct: 0,
        explanation: "Frogs eat insects; fewer frogs means more insects survive, so their population increases."
      },
      {
        id: 9,
        question: "A scientist observes that a certain antibiotic is less effective against bacteria after several years of use. What biological process explains this?",
        options: ["Mutation", "Natural selection", "Gene flow", "Genetic drift"],
        correct: 1,
        explanation: "Bacteria with resistance genes survive and reproduce, leading to a population with increased resistance (natural selection)."
      },
      {
        id: 10,
        question: "Which organelle is responsible for packaging and modifying proteins for secretion?",
        options: ["Mitochondria", "Golgi apparatus", "Nucleus", "Lysosome"],
        correct: 1,
        explanation: "The Golgi apparatus modifies, sorts, and packages proteins for secretion."
      },
      {
        id: 11,
        question: "How does the scientific method guide biological research and ensure reliability?",
        options: [
          "No structured approach",
          "Observation → hypothesis → controlled experiment (independent/dependent variables) → analysis → peer review validation",
          "Guessing and intuition",
          "Random observations only"
        ],
        correct: 1,
        explanation: "Scientific method: control groups isolate variables; replication ensures reliability; peer review validates findings before publication."
      },
      {
        id: 12,
        question: "What role do prokaryotes play in biogeochemical cycles?",
        options: [
          "No role",
          "Nitrogen fixation (converts N₂ to usable forms); nitrification; decomposition recycles nutrients; CO₂ fixation in photosynthesis",
          "Only in animals",
          "Produce toxins only"
        ],
        correct: 1,
        explanation: "Bacteria: cyanobacteria fix nitrogen; decomposers return nutrients to soil; essential for ecosystem functioning."
      },
      {
        id: 13,
        question: "How do apex predators affect community structure through trophic cascades?",
        options: [
          "No effect",
          "Predators control herbivore populations → vegetation recovery; loss of predators causes overgrazing; wolves/sea otters classic examples",
          "Only eat carnivores",
          "Beneficial to prey"
        ],
        correct: 1,
        explanation: "Yellowstone wolves: reduced elk → willows recovered → stream erosion decreased; trophic cascades = multi-level indirect effects."
      },
      {
        id: 14,
        question: "What is microevolution, and how do populations change genetically?",
        options: [
          "No population change",
          "Small-scale evolution: allele frequencies change through natural selection, genetic drift, gene flow, mutation",
          "Only large-scale change",
          "Random only"
        ],
        correct: 1,
        explanation: "Microevolution: peppered moths darkened during Industrial Revolution; Hardy-Weinberg equilibrium (stable allele frequencies in absence of evolution forces)."
      },
      {
        id: 15,
        question: "How do vestigial structures provide evidence for evolution?",
        options: [
          "No evolutionary significance",
          "Vestigial structures (whale hip bones, human tailbone) are functionless remnants from ancestors; show common ancestry",
          "Different organisms",
          "No inheritance"
        ],
        correct: 1,
        explanation: "Vestigial: human appendix (herbivore cecum), whale pelvic bones (walking ancestors), snake hip girdles; evidence of evolutionary descent with modification."
      },
      {
        id: 16,
        question: "What does the cell membrane do, and which molecules comprise it?",
        options: [
          "Only protective",
          "Phospholipid bilayer with embedded proteins; selectively permeable; controls transport; maintains cell identity through receptors",
          "Only lipids",
          "Permits all molecules"
        ],
        correct: 1,
        explanation: "Membrane structure: hydrophobic tails face in, hydrophilic heads face out; cholesterol increases rigidity; proteins span membrane for transport/signaling."
      },
      {
        id: 17,
        question: "How does energy flow through ecosystems, and why is each trophic level smaller?",
        options: [
          "Equal at all levels",
          "~10% energy transferred to next level; 90% lost as heat; pyramid of energy; limits food chain length",
          "More at top",
          "Random distribution"
        ],
        correct: 1,
        explanation: "Energy flow: 1000 kcal plants → 100 kcal herbivores → 10 kcal carnivores; limits predator population sizes; explains terrestrial vs aquatic ecosystems."
      },
      {
        id: 18,
        question: "What is speciation, and how do reproductive barriers prevent gene flow?",
        options: [
          "No new species",
          "Evolution of new species through reproductive isolation; prezygotic barriers (habitat, behavioral) prevent mating; postzygotic (hybrid inviability)",
          "Same species",
          "No barriers exist"
        ],
        correct: 1,
        explanation: "Speciation: allopatric (geographic isolation), peripatric (founder effects), sympatric (polyploidy in plants); reproductive isolation is definition of species."
      },
      {
        id: 19,
        question: "How do plant-animal interactions shape coevolution and adaptation?",
        options: [
          "No interaction",
          "Flowers evolve colors/shapes for pollinator attraction; plants produce defensive toxins; herbivores evolve detoxification; mutual adaptation",
          "Only competition",
          "Random changes"
        ],
        correct: 1,
        explanation: "Coevolution: milkweed (toxins) - monarch butterfly (detoxification); flowering plants - pollinators; arms race between plants/herbivores."
      },
      {
        id: 20,
        question: "What mechanisms regulate gene expression in eukaryotic cells?",
        options: [
          "No regulation",
          "Transcriptional (enhancers, promoters, repressors); epigenetic (DNA methylation, histone modification); post-translational (protein modification)",
          "Only DNA level",
          "Random expression"
        ],
        correct: 1,
        explanation: "Gene regulation: chromatin remodeling allows/prevents transcription; enhancers increase transcription; allows differential gene expression between cell types."
      }
    ]
  },
  "AP Chemistry": {
    title: "AP Chemistry Unit Test",
    description: "Comprehensive assessment covering all AP Chemistry lessons",
    questions: [
      {
        id: 1,
        question: "How many orbitals are in the second electron shell (n=2)?",
        options: ["1 orbital", "4 orbitals", "9 orbitals", "16 orbitals"],
        correct: 1,
        explanation: "n=2 has s and p orbitals: 1 s-orbital + 3 p-orbitals = 4 total orbitals."
      },
      {
        id: 2,
        question: "Which represents a polar covalent bond?",
        options: [
          "H-H (Δ EN ≈ 0)",
          "O-H (Δ EN ≈ 1.4)",
          "Na-Cl (Δ EN ≈ 2.1)",
          "C-C (Δ EN ≈ 0)"
        ],
        correct: 1,
        explanation: "Polar covalent: electronegativity difference 0.5-1.7. O-H has Δ EN ≈ 1.4, making it polar."
      },
      {
        id: 3,
        question: "What is the geometry of a molecule with 4 bonding pairs and 0 lone pairs?",
        options: ["Linear", "Trigonal planar", "Tetrahedral", "Trigonal bipyramidal"],
        correct: 2,
        explanation: "VSEPR: 4 bonding pairs, 0 lone pairs = tetrahedral geometry (e.g., methane, CH₄)."
      },
      {
        id: 4,
        question: "In the reaction 2 NO₂ ⇌ N₂O₄, what does K represent?",
        options: [
          "Kinetic energy",
          "Equilibrium constant: ratio of products to reactants at equilibrium",
          "Kelvin temperature",
          "Coefficient"
        ],
        correct: 1,
        explanation: "K = [N₂O₄]/[NO₂]² at equilibrium; K > 1 favors products; K < 1 favors reactants."
      },
      {
        id: 5,
        question: "What is the reducing agent in this reaction: Zn + 2H⁺ → Zn²⁺ + H₂?",
        options: ["H⁺", "Zn", "H₂", "Zn²⁺"],
        correct: 1,
        explanation: "Reducing agent: loses electrons (oxidized). Zn is oxidized from 0 to +2, so Zn is the reducing agent."
      },
      {
        id: 6,
        question: "Which salt solution is acidic due to hydrolysis?",
        options: [
          "NaCl (neutral)",
          "NH₄Cl (hydrolysis of weak conjugate acid)",
          "KOH (basic)",
          "HCl (strong acid)"
        ],
        correct: 1,
        explanation: "NH₄⁺ hydrolyzes: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺, producing H⁺ ions (acidic)."
      },
      {
        id: 7,
        question: "In an electrochemical cell, what occurs at the cathode?",
        options: [
          "Oxidation and negative electrode",
          "Oxidation and positive electrode",
          "Reduction and positive electrode",
          "Reduction and negative electrode"
        ],
        correct: 2,
        explanation: "Cathode: reduction occurs; in a galvanic cell, cathode is positive; in electrolytic cell, cathode is negative."
      },
      {
        id: 8,
        question: "What is Le Chatelier's Principle?",
        options: [
          "All reactions go to completion",
          "System at equilibrium shifts to counteract stress (change in temp, pressure, concentration)",
          "Reactions cannot be reversed",
          "Products are always favored"
        ],
        correct: 1,
        explanation: "If system at equilibrium is disturbed, it shifts to partially counteract the disturbance."
      },
      {
        id: 9,
        question: "Which compound has the highest boiling point due to hydrogen bonding?",
        options: ["CH₄", "H₂S", "H₂O", "HCl"],
        correct: 2,
        explanation: "H₂O has strong hydrogen bonding between molecules, resulting in a high boiling point (100°C)."
      },
      {
        id: 10,
        question: "What is the relationship between reaction rate and temperature?",
        options: [
          "No relationship",
          "Rate decreases with temperature",
          "Rate increases with temperature; higher kinetic energy means more collisions with sufficient activation energy",
          "Temperature only affects catalysts"
        ],
        correct: 2,
        explanation: "Increased temperature increases molecular kinetic energy, leading to more frequent and energetic collisions."
      },
      {
        id: 11,
        question: "How do electron configurations follow the Aufbau principle and Hund's rule?",
        options: [
          "No order",
          "Aufbau: fill lower energy orbitals first; Hund's rule: single electrons in degenerate orbitals before pairing; maximizes unpaired electrons",
          "Random filling",
          "All same energy"
        ],
        correct: 1,
        explanation: "Aufbau: 1s² 2s² 2p⁶... follows energy ordering; Hund's rule: ↑ ↑ ↑ before ↑↓ prevents electron-electron repulsion."
      },
      {
        id: 12,
        question: "What is molarity, and how is it used in solution stoichiometry?",
        options: [
          "Number of atoms",
          "Molarity: moles solute per liter solution; M₁V₁ = M₂V₂ for dilutions; used in acid-base and redox calculations",
          "Grams per liter only",
          "No solution measure"
        ],
        correct: 1,
        explanation: "Molarity allows stoichiometric calculations: 0.5 M H₂SO₄ + NaOH → volume of base determines reaction extent."
      },
      {
        id: 13,
        question: "What is a buffer solution, and how does it resist pH changes?",
        options: [
          "No pH resistance",
          "Weak acid + conjugate base (or weak base + conjugate acid); neutralizes added acid/base through equilibrium shift",
          "Only strong acids",
          "Random pH control"
        ],
        correct: 1,
        explanation: "Buffer: acetate buffer (CH₃COOH/CH₃COO⁻) neutralizes H⁺ with CH₃COO⁻ or neutralizes OH⁻ with CH₃COOH; Henderson-Hasselbalch equation."
      },
      {
        id: 14,
        question: "What is oxidation-reduction, and how do you identify oxidizing/reducing agents?",
        options: [
          "Only electron loss",
          "Oxidation: lose electrons (increase oxidation state); reduction: gain electrons; oxidizing agent accepts electrons; reducing agent donates",
          "Opposite of chemistry",
          "No electron transfer"
        ],
        correct: 1,
        explanation: "Redox: 2Fe²⁺ + Cl₂ → 2Fe³⁺ + 2Cl⁻; Cl₂ is oxidizing agent (gains e⁻); Fe²⁺ is reducing agent (loses e⁻)."
      },
      {
        id: 15,
        question: "How do ionic and covalent bonds differ in terms of electronegativity?",
        options: [
          "No difference",
          "Ionic: Δ EN > 1.7 (electrons transferred); covalent: Δ EN < 0.5 (electrons shared); polar covalent intermediate (0.5-1.7)",
          "All same bonding",
          "Only one exists"
        ],
        correct: 1,
        explanation: "Electronegativity differences: NaCl (2.1, ionic); H₂O (1.4, polar covalent); H₂ (0, nonpolar covalent); determines compound properties."
      },
      {
        id: 16,
        question: "What is equilibrium, and what does the equilibrium constant K tell us?",
        options: [
          "No equilibrium state",
          "Equilibrium: forward rate = reverse rate; K = [products]/[reactants]; K > 1 favors products; K < 1 favors reactants",
          "Reactions go one way",
          "Constant changes always"
        ],
        correct: 1,
        explanation: "K expression: 2NO₂ ⇌ N₂O₄; K = [N₂O₄]/[NO₂]²; K indicates extent of reaction at equilibrium; temperature-dependent."
      },
      {
        id: 17,
        question: "What are Lewis structures, and how do they represent molecular bonding?",
        options: [
          "No bonding shown",
          "Lewis structures show valence electrons as dots; bonding pairs as lines; lone pairs; predict molecular geometry and polarity",
          "Only atoms shown",
          "No electron representation"
        ],
        correct: 1,
        explanation: "Lewis dot: H:H shows bonding pair; formal charges (V - N - B/2) verify stability; helps identify reactive sites."
      },
      {
        id: 18,
        question: "How do energy, enthalpy, and entropy determine spontaneity (ΔG)?",
        options: [
          "No relationship",
          "ΔG = ΔH - TΔS; ΔG < 0 spontaneous; negative ΔH (exothermic) and positive ΔS (disorder increase) favor spontaneity",
          "Only enthalpy matters",
          "Random spontaneity"
        ],
        correct: 1,
        explanation: "Gibbs free energy: melting ice above 0°C (ΔH > 0, ΔS > 0, TΔS > ΔH, spontaneous); freezing below 0°C (opposite)."
      },
      {
        id: 19,
        question: "What are limiting reactants, and how do they affect reaction yield?",
        options: [
          "No limits",
          "Limiting reactant completely consumed first; determines maximum product amount; stoichiometry determines ratio",
          "All react equally",
          "No effect on yield"
        ],
        correct: 1,
        explanation: "Limiting reactant: 2 mol H₂ + 1 mol O₂ → 2 mol H₂O; if 2 mol H₂ + 3 mol O₂, H₂ limits to 2 mol product."
      },
      {
        id: 20,
        question: "How are solubility and solubility product (Ksp) related to precipitation?",
        options: [
          "No relationship",
          "Solubility product Ksp = [ion1]^n[ion2]^m at saturation; Q > Ksp precipitates form; Q < Ksp dissolves; ionic compounds dissolve to Ksp limit",
          "No ion interaction",
          "Always dissolve"
        ],
        correct: 1,
        explanation: "AgCl: Ksp = [Ag⁺][Cl⁻] = 1.8 × 10⁻¹⁰; Q > Ksp → precipitation; Q < Ksp → dissolution."
      }
    ]
  },
  "AP Physics": {
    title: "AP Physics Unit Test",
    description: "Comprehensive assessment covering all AP Physics lessons",
    questions: [
      {
        id: 1,
        question: "What does Newton's First Law state?",
        options: [
          "F = ma",
          "For every action, equal opposite reaction",
          "Object at rest stays at rest unless acted upon by net force",
          "Energy is always conserved"
        ],
        correct: 2,
        explanation: "Newton's First Law (Inertia): objects resist changes in motion."
      },
      {
        id: 2,
        question: "A car travels 60 km in 1 hour. What is its average speed?",
        options: ["30 km/h", "60 km/h", "120 km/h", "Cannot determine"],
        correct: 1,
        explanation: "Average speed = distance/time = 60 km / 1 h = 60 km/h."
      },
      {
        id: 3,
        question: "What is the difference between distance and displacement?",
        options: [
          "They're the same",
          "Distance: total path length; displacement: straight-line distance with direction",
          "Distance has direction, displacement doesn't",
          "No practical difference"
        ],
        correct: 1,
        explanation: "Distance is scalar (magnitude only); displacement is vector (magnitude + direction)."
      },
      {
        id: 4,
        question: "If a 2 kg object has kinetic energy of 16 J, what is its velocity?",
        options: ["2 m/s", "4 m/s", "8 m/s", "16 m/s"],
        correct: 1,
        explanation: "KE = ½mv²; 16 = ½(2)v²; v² = 16; v = 4 m/s."
      },
      {
        id: 5,
        question: "What is the difference between elastic and inelastic collisions?",
        options: [
          "Elastic: momentum conserved; inelastic: momentum not conserved",
          "Elastic: KE conserved; inelastic: KE not conserved (converts to heat/deformation)",
          "Inelastic collisions don't conserve momentum",
          "All collisions conserve both"
        ],
        correct: 1,
        explanation: "Both conserve momentum; elastic also conserves KE; inelastic does not."
      },
      {
        id: 6,
        question: "What is gravitational potential energy?",
        options: [
          "Energy of motion",
          "PE = mgh (mass × gravity × height)",
          "Energy from gravity alone",
          "Only at Earth's surface"
        ],
        correct: 1,
        explanation: "Gravitational PE increases with mass, gravity, and height. g = 9.8 m/s²."
      },
      {
        id: 7,
        question: "What is the period of a pendulum dependent on?",
        options: [
          "Mass only",
          "Length of string and gravity: T = 2π√(L/g)",
          "Amplitude only",
          "Weight of object"
        ],
        correct: 1,
        explanation: "Period depends on length and gravity, NOT on mass or amplitude (for small angles)."
      },
      {
        id: 8,
        question: "Which type of wave requires a medium?",
        options: ["Electromagnetic waves", "Light waves", "Sound waves", "Radio waves"],
        correct: 2,
        explanation: "Sound is a mechanical wave needing medium (air, water, solids); EM waves travel through vacuum."
      },
      {
        id: 9,
        question: "What is the relationship between current, voltage, and resistance?",
        options: [
          "I = V/R (Ohm's Law)",
          "V = I × R",
          "R = V/I",
          "All are equivalent expressions of Ohm's Law"
        ],
        correct: 3,
        explanation: "V = IR can be rearranged; all three forms are equivalent."
      },
      {
        id: 10,
        question: "What is the angle of incidence vs. angle of reflection for light?",
        options: [
          "Always different",
          "Angle of incidence = angle of reflection (Law of Reflection)",
          "Incidence is always larger",
          "Depends on mirror type"
        ],
        correct: 1,
        explanation: "Law of Reflection: angle in = angle out, measured from normal to surface."
      },
      {
        id: 11,
        question: "What is the concept of vectors and 2D motion in kinematics?",
        options: [
          "Only 1D motion possible",
          "Vectors have magnitude and direction; components analyzed separately (horizontal: constant velocity, vertical: constant acceleration)",
          "Same as speed",
          "No vertical component"
        ],
        correct: 1,
        explanation: "Projectile motion: vₓ constant, aᵧ = -9.8 m/s²; displacement analyzed in x and y independently."
      },
      {
        id: 12,
        question: "How does circular motion relate to centripetal acceleration?",
        options: [
          "No acceleration in circles",
          "Centripetal acceleration: directed toward center; a_c = v²/r; always perpendicular to velocity",
          "Same as linear",
          "Only at poles"
        ],
        correct: 1,
        explanation: "Circular motion: constant speed, changing direction; centripetal force = ma_c = mv²/r toward center."
      },
      {
        id: 13,
        question: "What is Newton's Law of Universal Gravitation?",
        options: [
          "Only on Earth",
          "F = G(m₁m₂)/r²; gravity attracts all masses; inversely proportional to distance squared",
          "Only attractive force",
          "Distance doesn't matter"
        ],
        correct: 1,
        explanation: "Gravitational force: proportional to product of masses; decreases with distance squared; G = 6.67 × 10⁻¹¹ N⋅m²/kg²."
      },
      {
        id: 14,
        question: "What is the relationship between work, energy, and power?",
        options: [
          "All same quantity",
          "Work = force × distance; energy = capacity to do work; power = work/time (rate of energy transfer)",
          "No relationships",
          "Power is force only"
        ],
        correct: 1,
        explanation: "W = Fd (joules); power P = W/t (watts); efficiency = useful work/total energy input."
      },
      {
        id: 15,
        question: "What is rotational motion, and how do torque and angular momentum relate?",
        options: [
          "No rotation exists",
          "Torque = force × perpendicular distance; τ = Iα (rotational analog of F = ma); angular momentum L = Iω conserved without external torque",
          "Same as linear",
          "No angular velocity"
        ],
        correct: 1,
        explanation: "Rotational dynamics: moment of inertia I analogous to mass; angular acceleration α from net torque; angular momentum conserved (ice skater)."
      },
      {
        id: 16,
        question: "How does static equilibrium differ from dynamic equilibrium?",
        options: [
          "No difference",
          "Static: object at rest; dynamic: object moving with constant velocity; both: net force = 0, net torque = 0",
          "Only static exists",
          "Force always present"
        ],
        correct: 1,
        explanation: "Equilibrium conditions: ΣF = 0 (translational) and Στ = 0 (rotational); bridge (static), airplane cruising (dynamic)."
      },
      {
        id: 17,
        question: "What is the relationship between pressure and fluid motion (Bernoulli's principle)?",
        options: [
          "No relationship",
          "Pressure decreases where fluid velocity increases; P + ½ρv² + ρgh = constant along streamline",
          "Pressure always increases",
          "Velocity independent"
        ],
        correct: 1,
        explanation: "Bernoulli's equation: total mechanical energy per unit volume constant; airplane wings (low pressure → lift), spray bottles (nozzle constriction)."
      },
      {
        id: 18,
        question: "What is simple harmonic motion, and what characterizes it?",
        options: [
          "All oscillations",
          "Motion where acceleration ∝ -displacement (a = -ω²x); occurs in springs, pendulums, waves; periodic with fixed period",
          "Only circular",
          "No restoring force"
        ],
        correct: 1,
        explanation: "SHM: restoring force proportional to displacement; x(t) = A cos(ωt + φ); energy oscillates between kinetic and potential."
      },
      {
        id: 19,
        question: "How do standing waves form, and what are nodes and antinodes?",
        options: [
          "No wave patterns",
          "Standing waves from superposition of forward/backward waves; nodes: zero amplitude (destructive interference); antinodes: maximum amplitude",
          "Only traveling waves",
          "Random patterns"
        ],
        correct: 1,
        explanation: "Guitar strings: fixed ends → nodes; fundamental frequency when λ/2 = L; harmonics at multiples of fundamental."
      },
      {
        id: 20,
        question: "What is the relationship between electricity and magnetism (Ohm's Law and circuits)?",
        options: [
          "No relationship",
          "Ohm's Law: V = IR; electric current creates magnetic fields; resistors dissipate energy; circuit analysis uses Kirchhoff's rules",
          "Independent phenomena",
          "No current flow"
        ],
        correct: 1,
        explanation: "Ohm's Law: 12V = I(4Ω) → I = 3A; power = VI = I²R; series (same current) vs parallel (same voltage) configurations."
      }
    ]
  },
  "AP Environmental Science": {
    title: "AP Environmental Science Unit Test",
    description: "Comprehensive assessment covering all AP Environmental Science lessons",
    questions: [
      {
        id: 1,
        question: "What is soil composition?",
        options: [
          "Only rock",
          "Mineral particles (sand, silt, clay), organic matter, water, air",
          "Only clay",
          "Dead organisms"
        ],
        correct: 1,
        explanation: "Soil: mixture of inorganic minerals and organic matter; supports plant growth."
      },
      {
        id: 2,
        question: "What is the nitrogen cycle?",
        options: [
          "Only atmospheric N₂",
          "Nitrogen cycles through atmosphere, soil, organisms; fixed by bacteria, used by organisms, returned to soil",
          "No cycling",
          "Irreversible"
        ],
        correct: 1,
        explanation: "Nitrogen cycle: N₂ in air → fixed to NO₃⁻ by bacteria → used by plants → animals eat plants → decomposed back."
      },
      {
        id: 3,
        question: "What causes ocean acidification?",
        options: [
          "Algae only",
          "CO₂ absorption forming carbonic acid; threatens shell-forming organisms",
          "Warming only",
          "Pollution from trash"
        ],
        correct: 1,
        explanation: "Ocean acidification: excess CO₂ + H₂O → H₂CO₃; pH drops; dissolves shells of pteropods, corals."
      },
      {
        id: 4,
        question: "What is the ozone layer's function?",
        options: [
          "Produces oxygen",
          "Blocks harmful UV radiation from Sun; protects life",
          "Traps heat",
          "Creates weather"
        ],
        correct: 1,
        explanation: "Ozone (O₃) in stratosphere: absorbs UVB radiation; CFCs damage it, creating ozone hole."
      },
      {
        id: 5,
        question: "What are non-renewable resources?",
        options: [
          "Plant-based",
          "Finite resources that don't regenerate (fossil fuels, minerals); depleted with use",
          "Recyclable only",
          "Always available"
        ],
        correct: 1,
        explanation: "Non-renewables: oil, coal, natural gas, metals; require millions of years to form."
      },
      {
        id: 6,
        question: "What is conservation?",
        options: [
          "Preservation only",
          "Sustainable use of resources; balances preservation with human needs",
          "No resource use",
          "Wasteful extraction"
        ],
        correct: 1,
        explanation: "Conservation: rational use of resources ensuring availability for future generations."
      },
      {
        id: 7,
        question: "What are the main sources of air pollution?",
        options: [
          "Volcanoes only",
          "Vehicles, factories, power plants, agriculture; create smog, acid rain, ozone",
          "Natural only",
          "No human sources"
        ],
        correct: 1,
        explanation: "Air pollution: NOx, SO₂, PM2.5, ozone harm respiratory health and ecosystems."
      },
      {
        id: 8,
        question: "What is eutrophication in aquatic systems?",
        options: [
          "Normal process",
          "Excess nutrients (N, P) cause algae overgrowth → dead zone when algae decompose",
          "No consequence",
          "Oxygen increase"
        ],
        correct: 1,
        explanation: "Eutrophication: nutrient pollution → algal bloom → hypoxia → dead zones (Gulf of Mexico example)."
      },
      {
        id: 9,
        question: "What is the difference between weather and climate?",
        options: [
          "Same thing",
          "Weather: short-term (hours-days); climate: long-term patterns (30+ years)",
          "Weather is permanent",
          "Climate changes daily"
        ],
        correct: 1,
        explanation: "Weather: temporary atmospheric conditions; climate: average weather over decades."
      },
      {
        id: 10,
        question: "What is an invasive species problem?",
        options: [
          "Beneficial always",
          "Non-native species outcompete natives, reduce biodiversity, disrupt food webs",
          "No negative impact",
          "Improves ecosystems"
        ],
        correct: 1,
        explanation: "Invasive species: zebra mussels, pythons in Florida, cane toads in Australia; costly to remove."
      },
      {
        id: 11,
        question: "What is conservation biology, and its role in biodiversity?",
        options: [
          "No conservation needed",
          "Applies ecology to preserve biodiversity; protects endangered species, habitat restoration; prevents extinction",
          "Only studies ecology",
          "Accepts extinction"
        ],
        correct: 1,
        explanation: "Conservation: hotspot protection (tropical rainforests), species reintroduction (California condors), habitat corridors preserve gene flow."
      },
      {
        id: 12,
        question: "What are the different terrestrial biomes and their characteristics?",
        options: [
          "All same",
          "Tropical rainforest (high rain, biodiversity), desert (low rain, sparse life), tundra (freezing, lichens), temperate forest (4 seasons)",
          "One biome only",
          "No differences"
        ],
        correct: 1,
        explanation: "Biomes determined by temperature/precipitation; each has characteristic organisms adapted to climate."
      },
      {
        id: 13,
        question: "What is the carbon cycle, and how does it relate to climate change?",
        options: [
          "No cycle",
          "CO₂ cycles between atmosphere, organisms, fossil fuels; excess CO₂ from combustion traps heat → global warming",
          "Oxygen only",
          "No human impact"
        ],
        correct: 1,
        explanation: "Carbon cycle: atmosphere ↔ biota ↔ soil ↔ ocean; fossil fuel burning increases atmospheric CO₂ (410 ppm, pre-industrial 280 ppm)."
      },
      {
        id: 14,
        question: "What is the phosphorus cycle, and why is it a major nutrient?",
        options: [
          "No cycling",
          "Phosphorus cycles through soil, rocks, organisms; essential for ATP, DNA; limited in most ecosystems; rock weathering replenishes",
          "Only in animals",
          "Unlimited supply"
        ],
        correct: 1,
        explanation: "Phosphorus: rock → soil → plants → animals → decomposition → soil; unlike N/C, no atmospheric phase; mining depletes it."
      },
      {
        id: 15,
        question: "What is the hydrologic (water) cycle?",
        options: [
          "No cycling",
          "Evaporation → condensation → precipitation → runoff → groundwater → infiltration; driven by solar energy",
          "Only rainfall",
          "Constant in lakes"
        ],
        correct: 1,
        explanation: "Water cycle: ocean evaporates → clouds form → rain → rivers return to ocean; transpiration from plants also releases water."
      },
      {
        id: 16,
        question: "What are renewable and sustainable energy sources?",
        options: [
          "No alternatives exist",
          "Renewable: replenish naturally (solar, wind, hydro, geothermal); sustainable: meets current needs without compromising future",
          "Only fossil fuels",
          "All same type"
        ],
        correct: 1,
        explanation: "Renewable energy: solar (intermittent), wind (depends on location), hydroelectric (dams disrupt ecosystems), geothermal (limited areas)."
      },
      {
        id: 17,
        question: "What is ecosystem succession, and how do communities change?",
        options: [
          "No change",
          "Primary succession (bare rock → pioneer species → climax community); secondary succession (regrowth after disturbance)",
          "Random change",
          "Always same species"
        ],
        correct: 1,
        explanation: "Ecological succession: pioneer lichens → grasses → shrubs → forest; increases biodiversity; climax community relatively stable."
      },
      {
        id: 18,
        question: "What is the concept of carrying capacity and population limits?",
        options: [
          "No limit",
          "Carrying capacity (K): maximum population size habitat supports; logistic growth reaches K when resources limit growth",
          "Unlimited growth",
          "Always increasing"
        ],
        correct: 1,
        explanation: "Carrying capacity: determined by resources (food, water, space); populations oscillate around K; exceeding K → crash."
      },
      {
        id: 19,
        question: "What are environmental impacts of agriculture?",
        options: [
          "No impacts",
          "Soil depletion, water pollution (pesticides, fertilizer runoff), deforestation for cropland, monoculture reduces biodiversity",
          "Always beneficial",
          "No water use"
        ],
        correct: 1,
        explanation: "Agriculture: intensive farming exhausts soil (crop rotation restores fertility), pesticides harm non-target organisms, irrigation depletes aquifers."
      },
      {
        id: 20,
        question: "What is climate change, and what are its major causes and effects?",
        options: [
          "Not happening",
          "Greenhouse gas emissions (CO₂, CH₄, N₂O) trap heat; causes warming, sea-level rise, habitat loss, extreme weather",
          "Only natural cycles",
          "No human role"
        ],
        correct: 1,
        explanation: "Climate change: CO₂ up 50% since industrial revolution; +1.1°C warming; melting ice, coral bleaching, species extinction."
      }
    ]
  },
  Economics: {
    title: "Economics Unit Test",
    description: "Comprehensive assessment covering all Economics lessons",
    questions: [
      {
        id: 1,
        question: "What is the law of supply and demand?",
        options: [
          "Supply always exceeds demand",
          "Price rises when demand > supply; falls when supply > demand",
          "Price never changes",
          "Only supply matters"
        ],
        correct: 1,
        explanation: "Supply and demand: fundamental market mechanism determining prices and quantities."
      },
      {
        id: 2,
        question: "What is marginal cost?",
        options: [
          "Total production cost",
          "Cost of producing one additional unit",
          "Fixed cost",
          "Unlimited cost"
        ],
        correct: 1,
        explanation: "Marginal cost: additional cost from producing one more unit; key to profit maximization."
      },
      {
        id: 3,
        question: "What is elasticity of demand?",
        options: [
          "Demand never changes",
          "Measure of how quantity demanded responds to price changes",
          "Same as supply",
          "No relationship"
        ],
        correct: 1,
        explanation: "Elastic: quantity changes significantly with price (luxury goods); inelastic: minimal change (essentials)."
      },
      {
        id: 4,
        question: "What is inflation's effect on purchasing power?",
        options: [
          "Increases it",
          "Decreases it; money buys less as prices rise",
          "No effect",
          "Doubles it"
        ],
        correct: 1,
        explanation: "Inflation erodes purchasing power; wages must rise to maintain living standards."
      },
      {
        id: 5,
        question: "What does the Federal Reserve control?",
        options: [
          "Corporate profits",
          "Money supply and interest rates; implements monetary policy",
          "Government spending",
          "Prices directly"
        ],
        correct: 1,
        explanation: "Fed: sets interest rates, manages money supply to control inflation and employment."
      },
      {
        id: 6,
        question: "What is the difference between fiscal and monetary policy?",
        options: [
          "No difference",
          "Fiscal: government taxes/spending; monetary: Fed controls interest rates/money",
          "Both are the same",
          "Only fiscal exists"
        ],
        correct: 1,
        explanation: "Fiscal policy: government spending and taxation; monetary policy: central bank money management."
      },
      {
        id: 7,
        question: "What is the stock market?",
        options: [
          "Physical location only",
          "System where shares of ownership (stocks) in companies are bought/sold",
          "Fixed income only",
          "Government bonds"
        ],
        correct: 1,
        explanation: "Stock market: exchange where investors trade company ownership shares; reflects economic health."
      },
      {
        id: 8,
        question: "What is consumer price index (CPI)?",
        options: [
          "Company profits",
          "Measure of average prices paid by consumers; indicates inflation rate",
          "Stock prices",
          "Unemployment"
        ],
        correct: 1,
        explanation: "CPI: basket of goods/services; tracks purchasing power changes; key inflation indicator."
      },
      {
        id: 9,
        question: "What is a trade deficit?",
        options: [
          "Always beneficial",
          "Country imports more than it exports; can reflect consumer demand or industrial weakness",
          "Always bad",
          "No trade"
        ],
        correct: 1,
        explanation: "Trade deficit: imports > exports; affects currency, employment in export industries."
      },
      {
        id: 10,
        question: "What is economic growth?",
        options: [
          "Always permanent",
          "Increase in GDP; measured annually; indicates expanding economy",
          "Guaranteed",
          "No cycles"
        ],
        correct: 1,
        explanation: "Economic growth: usually 2-3% annually; depends on productivity, investment, consumer spending."
      },
      {
        id: 11,
        question: "What is specialization and comparative advantage in trade?",
        options: [
          "No trade",
          "Countries specialize in products where they have relative cost advantage; both gain through trade",
          "Everyone produces everything",
          "No benefits"
        ],
        correct: 1,
        explanation: "Comparative advantage: Portugal/England cloth/wine trade example; both benefit even if one better at both products."
      },
      {
        id: 12,
        question: "What is the role of the Federal Reserve in the economy?",
        options: [
          "No economic role",
          "Central bank controls money supply, sets interest rates, regulates banks, manages inflation/employment",
          "Only private banks control money",
          "No banking regulation"
        ],
        correct: 1,
        explanation: "Federal Reserve: raises rates to fight inflation, lowers rates to stimulate economy; 2008 crisis showed importance of monetary policy."
      },
      {
        id: 13,
        question: "What causes inflation, and how does it affect consumers?",
        options: [
          "Inflation doesn't happen",
          "Rising prices due to increased money supply, demand, supply shocks; reduces purchasing power; impacts savings, wages",
          "Only deflation exists",
          "No consumer impact"
        ],
        correct: 1,
        explanation: "Inflation: 1970s stagflation (high inflation + unemployment); expectations matter; wage/price spiral; savers hurt, borrowers helped."
      },
      {
        id: 14,
        question: "What is the difference between perfect competition and monopoly?",
        options: [
          "Same market structure",
          "Perfect competition: many firms, price-takers, no barriers; monopoly: one firm, price-maker, high barriers to entry",
          "Only monopolies exist",
          "No competition"
        ],
        correct: 1,
        explanation: "Market structure: perfect competition (agriculture), monopoly (utilities), oligopoly (airlines); affects prices and innovation."
      },
      {
        id: 15,
        question: "What is externalities, and why do they cause market failure?",
        options: [
          "No external effects",
          "Costs/benefits not reflected in prices (pollution = negative; education = positive); markets fail to allocate efficiently",
          "All prices correct",
          "No government role"
        ],
        correct: 1,
        explanation: "Externalities: carbon tax internalizes pollution cost; subsidies support positive externalities (vaccinations); corrects market failures."
      },
      {
        id: 16,
        question: "What is unemployment, and how is it measured?",
        options: [
          "No unemployment",
          "Percentage of labor force actively seeking work but jobless; includes frictional, structural, cyclical unemployment",
          "Only temporary",
          "All unemployed"
        ],
        correct: 1,
        explanation: "Unemployment rate: BLS surveys; cyclical (recessions), structural (skill mismatch), frictional (job search); affects government policy."
      },
      {
        id: 17,
        question: "What is GDP, and how does it measure economic health?",
        options: [
          "No measurement",
          "Gross Domestic Product: total value of goods/services produced; indicates economic size; grows with productivity and population",
          "Only income",
          "No connection to welfare"
        ],
        correct: 1,
        explanation: "GDP: doesn't measure inequality, environmental damage, happiness; per capita GDP better for comparisons; growth depends on factors/productivity."
      },
      {
        id: 18,
        question: "What is deflation, and what are its economic consequences?",
        options: [
          "Positive always",
          "Falling prices; consumers delay purchases expecting lower prices; reduces investment, wages; leads to unemployment",
          "Same as inflation",
          "Beneficial"
        ],
        correct: 1,
        explanation: "Deflation: 1930s Great Depression, 2008 recession risks; vicious cycle; Japan's lost decade; real wages rise but employment falls."
      },
      {
        id: 19,
        question: "What is protectionism, and when do countries use it?",
        options: [
          "Always free trade",
          "Trade barriers (tariffs, quotas) protect domestic industries; can cause trade wars, retaliatory barriers, inefficiency",
          "Never used",
          "No effects"
        ],
        correct: 1,
        explanation: "Protectionism: infant industries need protection; special interests lobby; US-China trade war; overall reduces efficiency and consumer choice."
      },
      {
        id: 20,
        question: "What is income distribution and economic inequality?",
        options: [
          "No inequality exists",
          "Gini coefficient measures inequality; wealth concentration top 1%; affects social mobility, health, educational outcomes",
          "Everyone equal",
          "No measurement"
        ],
        correct: 1,
        explanation: "Inequality: GINI index (0=equal, 1=unequal); varies by country; increases with education wage premium; affects economic growth."
      }
    ]
  },
  History: {
    title: "History Unit Test",
    description: "Comprehensive assessment covering all History lessons",
    questions: [
      {
        id: 1,
        question: "What empire was known for building the Great Wall?",
        options: [
          "Roman",
          "Chinese dynasties (especially Ming Dynasty)",
          "Ottoman",
          "Persian"
        ],
        correct: 1,
        explanation: "Great Wall: built over centuries by Chinese dynasties; defensive barrier against invasions."
      },
      {
        id: 2,
        question: "What was the major cause of the French Revolution?",
        options: [
          "Religious conflict",
          "Debt, famine, inequality, Enlightenment ideas challenging absolute monarchy",
          "War with England",
          "Colonial disputes"
        ],
        correct: 1,
        explanation: "French Revolution (1789): social inequality, empty treasury, Enlightenment ideas triggered revolution."
      },
      {
        id: 3,
        question: "What was the main impact of the Enlightenment?",
        options: [
          "Religious dominance",
          "Emphasized reason, science, individual rights; challenged absolute authority",
          "Strengthened monarchy",
          "No intellectual change"
        ],
        correct: 1,
        explanation: "Enlightenment: influenced American/French revolutions; promoted democracy, scientific method, human rights."
      },
      {
        id: 4,
        question: "What was the significance of the Declaration of Independence (1776)?",
        options: [
          "Economic treaty",
          "Formal statement of American independence from British rule; listed grievances",
          "Peace agreement",
          "Military alliance"
        ],
        correct: 1,
        explanation: "Declaration: Jefferson-drafted document; inspired subsequent revolutions; cornerstone of US founding."
      },
      {
        id: 5,
        question: "What event started World War II?",
        options: [
          "Pearl Harbor",
          "Germany's invasion of Poland (September 1939)",
          "Battle of Britain",
          "Dunkirk evacuation"
        ],
        correct: 1,
        explanation: "WWII: Germany invaded Poland; Britain/France declared war; conflict became truly global."
      },
      {
        id: 6,
        question: "What was the main goal of the Marshall Plan?",
        options: [
          "Military conquest",
          "Rebuild Western Europe economically after WWII; prevent Soviet expansion",
          "Start new war",
          "Reduce trade"
        ],
        correct: 1,
        explanation: "Marshall Plan (1948-1952): US aid to Europe; promoted recovery, stability, containment of communism."
      },
      {
        id: 7,
        question: "What was the primary cause of decolonization after WWII?",
        options: [
          "Military victories",
          "European powers weakened; colonial independence movements; Cold War superpower influence",
          "Economic prosperity",
          "No resistance"
        ],
        correct: 1,
        explanation: "Decolonization: 1945-1975; Asian, African nations gained independence; created UN expansion."
      },
      {
        id: 8,
        question: "What was significant about the fall of the Berlin Wall (1989)?",
        options: [
          "Repairing infrastructure",
          "Symbolized Cold War end; marked beginning of Soviet Union's collapse",
          "Economic event",
          "Sports competition"
        ],
        correct: 1,
        explanation: "Berlin Wall fall: represented Cold War's end; led to German reunification; Cold War officially ended 1991."
      },
      {
        id: 9,
        question: "What were the major causes of World War I?",
        options: [
          "Colonial disputes only",
          "Militarism, alliances, imperialism, nationalism; assassination triggered declarations",
          "Economic only",
          "No real cause"
        ],
        correct: 1,
        explanation: "WWI (1914-1918): complex causes (MAIN acronym); modern warfare introduced on massive scale."
      },
      {
        id: 10,
        question: "What was the significance of the printing press invention?",
        options: [
          "Art purposes only",
          "Enabled mass book production; spread knowledge; supported Reformation and Science",
          "Military tool",
          "No impact"
        ],
        correct: 1,
        explanation: "Gutenberg's press (1440): revolutionized information spread; enabled Reformation; crucial to modernization."
      },
      {
        id: 11,
        question: "What was the Renaissance, and how did it impact European culture?",
        options: [
          "Medieval continuation",
          "Rebirth of classical learning (14th-17th centuries); humanist philosophy, art, science; revived Greek/Roman texts",
          "Religious movement",
          "Political only"
        ],
        correct: 1,
        explanation: "Renaissance: transition from Middle Ages to modernity; Leonardo, Michelangelo, Machiavelli; emphasis on individual, reason, observation."
      },
      {
        id: 12,
        question: "What was the Scientific Revolution, and how did it change worldview?",
        options: [
          "No change",
          "Shift from authority (Aristotle) to empirical method; Copernicus (heliocentrism), Galileo (observations), Newton (laws of motion)",
          "Only religious",
          "No methodology"
        ],
        correct: 1,
        explanation: "Scientific Revolution: Copernican revolution challenged Church; Galileo's telescope observations; Newton's physics; founded modern science."
      },
      {
        id: 13,
        question: "What was colonialism, and what were its effects on colonized territories?",
        options: [
          "Beneficial always",
          "European exploitation of resources, labor, markets; cultural disruption, disease, enslavement, extraction of wealth",
          "No negative effects",
          "Voluntary"
        ],
        correct: 1,
        explanation: "Colonialism: Africa/Asia/Americas resources flowed to Europe; disrupted societies; created artificial borders; legacy of inequality."
      },
      {
        id: 14,
        question: "What was industrialization, and how did it transform society?",
        options: [
          "No social change",
          "Machine production replaced hand labor; urbanization, factory system, working class emerged, environmental degradation",
          "Only technological",
          "No consequences"
        ],
        correct: 1,
        explanation: "Industrial Revolution: 18th-19th centuries; steam power, coal, textiles; created modern capitalism, labor movements, pollution."
      },
      {
        id: 15,
        question: "What was the significance of the Russian Revolution?",
        options: [
          "Minor event",
          "Communist revolution; overthrew tsarism; established Soviet Union; inspired communist movements globally",
          "Liberal reform",
          "Only local impact"
        ],
        correct: 1,
        explanation: "Russian Revolution (1917): Lenin's Bolsheviks took power; Civil War; created communist state; Cold War rival to US."
      },
      {
        id: 16,
        question: "What were the causes and consequences of the Holocaust?",
        options: [
          "Minor event",
          "Nazi genocide of 6 million Jews; antisemitism, racism, totalitarianism; worst atrocity; led to international human rights law",
          "Exaggerated history",
          "Isolated incident"
        ],
        correct: 1,
        explanation: "Holocaust: systematic extermination; concentration camps; genocide defined after WWII; 'Never Again' became international principle."
      },
      {
        id: 17,
        question: "What was decolonization, and how did it reshape the world?",
        options: [
          "Didn't happen",
          "Post-WWII independence movements; India, Africa, Asia threw off colonial rule; created new nation-states; Cold War conflicts",
          "Only peaceful",
          "Colonialism continues"
        ],
        correct: 1,
        explanation: "Decolonization: 1945-1975; anticolonial nationalism; Gandhi, Ho Chi Minh; both superpowers competed for influence in newly independent nations."
      },
      {
        id: 18,
        question: "What was the invention of the steam engine, and how did it impact economic development?",
        options: [
          "No impact",
          "Watt's steam engine powered factories, trains, ships; enabled mass production, transportation revolution, industrial capitalism",
          "Only for heating",
          "Transportation only"
        ],
        correct: 1,
        explanation: "Steam engine: mechanization of production; railways connected markets; factories concentrated workers; foundation of modern industrial economy."
      },
      {
        id: 19,
        question: "What was the significance of the fall of the Berlin Wall?",
        options: [
          "Just a wall",
          "Symbol of Cold War's end (1989); divided Germany reunified; Soviet Union collapsed 1991; reshaped Europe",
          "Only aesthetic",
          "No geopolitical impact"
        ],
        correct: 1,
        explanation: "Berlin Wall fall: Gorbachev's reforms, Eastern European revolutions; peaceful end to Cold War; Germany reunified; European Union expanded."
      },
      {
        id: 20,
        question: "What were the major causes of World War II?",
        options: [
          "No identifiable cause",
          "Treaty of Versailles resentment, economic depression, rise of fascism (Hitler, Mussolini), Japanese expansion, appeasement failure",
          "Only Japanese",
          "Random war"
        ],
        correct: 1,
        explanation: "WWII causes: Versailles humiliation of Germany, Nazi ideology, Japanese imperialism, collective security failure; started 1939."
      }
    ]
  },
  "AP Human Geography": {
    title: "AP Human Geography Unit Test",
    description: "Comprehensive assessment covering all AP Human Geography lessons",
    questions: [
      {
        id: 1,
        question: "Which concept describes the unequal distribution of economic and political power globally based on geography and development?",
        options: [
          "Absolute location",
          "Imperialism and colonialism creating core and peripheral regions",
          "Latitude determination",
          "Continental drift"
        ],
        correct: 1,
        explanation: "Core-periphery model: developed nations (core) dominate developing nations (periphery) through historical colonialism and modern economic systems; explains global inequality patterns."
      },
      {
        id: 2,
        question: "What is cultural relativism in the context of understanding global cultures?",
        options: [
          "One culture is superior",
          "All cultures are equally valid in their own context; avoiding ethnocentrism",
          "Cultures should be homogenized",
          "Cultural patterns don't matter"
        ],
        correct: 1,
        explanation: "Cultural relativism: understanding cultures on their own terms rather than judging by your own standards; essential for geography studying human behavior and beliefs across regions."
      },
      {
        id: 3,
        question: "How does the demographic transition model explain population changes?",
        options: [
          "Population always increases",
          "Societies progress through stages: high birth/death rates → declining death → declining birth → low both",
          "Population decreases constantly",
          "No pattern exists"
        ],
        correct: 1,
        explanation: "DTM: Stage 1 (high BR/DR, pre-industrial) → Stage 2 (declining DR, rapid growth) → Stage 3 (declining BR, slower growth) → Stage 4 (low both, stable); explains development patterns."
      },
      {
        id: 4,
        question: "What is scale in human geography, and why is it important?",
        options: [
          "Only map measurement",
          "Hierarchical levels of analysis (local, regional, national, global) affecting how phenomena operate differently",
          "Population statistics",
          "Geographic distance only"
        ],
        correct: 1,
        explanation: "Scales: local (neighborhood) → regional → national → global; same issue (poverty, migration) operates differently at each scale; multi-scalar analysis essential."
      },
      {
        id: 5,
        question: "Which process describes the influence of dominant cultures on minority groups, often resulting in loss of cultural identity?",
        options: [
          "Cultural preservation",
          "Cultural imperialism and cultural homogenization through media, language, consumption patterns",
          "Cultural innovation",
          "No cultural change"
        ],
        correct: 1,
        explanation: "Cultural imperialism: dominance of Western (especially American) culture globally through English, Hollywood, technology, consumer goods; threatens indigenous cultures and languages."
      },
      {
        id: 6,
        question: "What is the difference between internal migration and international migration?",
        options: [
          "No difference",
          "Internal: within country borders; international: crossing borders; different legal/economic consequences",
          "Internal is voluntary only",
          "International is internal"
        ],
        correct: 1,
        explanation: "Internal migration: rural-to-urban, regional shifts (China urbanization 300M+); international: cross-border (refugees, labor migration) with legal, political, cultural implications."
      },
      {
        id: 7,
        question: "How do political boundaries affect human geography patterns?",
        options: [
          "Boundaries have no effect",
          "Artificial colonial borders create cultural conflicts; boundaries organize nation-states and affect resource distribution, trade, identity",
          "Boundaries prevent all interaction",
          "Only water creates boundaries"
        ],
        correct: 1,
        explanation: "Boundaries: colonial legacies (straight lines in Africa) divide ethnic groups/resources; shape nationalism, sovereignty, conflict (Kashmir, Palestine); economic zones (EU), trade routes."
      },
      {
        id: 8,
        question: "What is the significance of the relationship between physical geography and human settlement patterns?",
        options: [
          "Geography doesn't affect settlement",
          "Rivers provide water/transport (Nile, Yangtze); fertile plains attract agriculture (Mississippi, Indus); mountains isolate groups",
          "All areas equally settled",
          "Climate irrelevant"
        ],
        correct: 1,
        explanation: "Human-environment interaction: settlements cluster near water, fertile lands, transportation routes; natural hazards (floods, earthquakes) influence location decisions and vulnerability."
      },
      {
        id: 9,
        question: "How does globalization reshape labor patterns and create economic inequality?",
        options: [
          "Globalization creates equality",
          "Outsourcing to low-wage regions; multinational corporations exploit labor; financial capital flows freely while workers face barriers",
          "Labor migration eliminated",
          "No economic change"
        ],
        correct: 1,
        explanation: "Labor geography: maquiladoras (Mexico), call centers (India), manufacturing (Bangladesh) pay low wages while corporations profit; remittances home critical; brain drain from developing nations."
      },
      {
        id: 10,
        question: "What is the relationship between nationalism and territorial identity?",
        options: [
          "Nationalism has no geographic basis",
          "National identity tied to territory; affects borders, resource claims, conflict over sacred/historical lands",
          "Territories are purely economic",
          "Identity is never territorial"
        ],
        correct: 1,
        explanation: "Nationalism: emotional attachment to territory (homeland); creates nation-states; geopolitical conflicts (Israel-Palestine, Kashmir); diaspora communities maintain transnational identities."
      },
      {
        id: 11,
        question: "What is urban geography, and how do cities develop?",
        options: [
          "No urban patterns",
          "Cities develop around ports/crossroads/resources; concentric zones model (CBD, residential, suburbs); primate cities dominate economies",
          "Random growth",
          "No geographic factors"
        ],
        correct: 1,
        explanation: "Urban geography: cities concentration of economic activity; gentrification displaces poor; sprawl environmental costs; megacities in Global South."
      },
      {
        id: 12,
        question: "What is political ecology, and how does it explain environmental conflicts?",
        options: [
          "No connection",
          "Power relations affect environmental outcomes; indigenous lands exploited for resources; environmental justice movements",
          "Only science matters",
          "No conflict"
        ],
        correct: 1,
        explanation: "Political ecology: indigenous territories (Amazon) threatened by mining/logging; environmental racism (pollution near poor communities); unequal power in resource distribution."
      },
      {
        id: 13,
        question: "What is the concept of place versus space in human geography?",
        options: [
          "Same thing",
          "Space: abstract, geometric (latitude/longitude); place: meaningful location with human attachment, identity, memory",
          "No distinction",
          "Both identical"
        ],
        correct: 1,
        explanation: "Place: home, sacred sites, neighborhoods have cultural meaning; space: mathematical grid; humanistic geography emphasizes place and identity."
      },
      {
        id: 14,
        question: "How does gender geography analyze spatial inequalities?",
        options: [
          "No gender differences",
          "Women's limited access to land, safety concerns in public space, domestic labor unequal geographic distribution",
          "Fully equal already",
          "Geography irrelevant"
        ],
        correct: 1,
        explanation: "Gender geography: women face restrictions in public space (safety), lack land ownership rights; unpaid care work invisible; feminism critiques geography."
      },
      {
        id: 15,
        question: "What is cultural geography, and what does it study?",
        options: [
          "No culture exists",
          "Examines how cultures vary spatially; language distribution, religion regions, food systems, identity formation in places",
          "Only economics",
          "No spatial variation"
        ],
        correct: 1,
        explanation: "Cultural geography: religions map globally (Christianity Europe/Americas, Islam Middle East/Africa); food regions (pasta Italy, rice Asia); cultural diffusion."
      },
      {
        id: 16,
        question: "What is the relationship between natural resources and geopolitics?",
        options: [
          "No relationship",
          "Oil-producing nations leverage power (OPEC); water scarcity causes conflict (Jordan/Palestine); critical minerals supply chains affect global politics",
          "Resources irrelevant",
          "All trade peaceful"
        ],
        correct: 1,
        explanation: "Resource geopolitics: Middle East oil importance; rare earth minerals China monopoly; water conflicts expected to increase; resource curse (oil-producing nations)."
      },
      {
        id: 17,
        question: "What is climate justice, and how does it relate to geographic inequality?",
        options: [
          "No inequality",
          "Global South suffers most from climate change despite lowest emissions; unequal responsibility and vulnerability; adaptation costs burden poor nations",
          "All nations equal",
          "No injustice"
        ],
        correct: 1,
        explanation: "Climate justice: Pacific island nations disappear from rising seas; African droughts caused by Northern emissions; reparations and adaptation finance demanded."
      },
      {
        id: 18,
        question: "What is transnationalism, and how do migrants maintain multiple identities?",
        options: [
          "No transnational ties",
          "Migrants maintain connections across borders; dual citizenship, sending remittances home, return visits; challenge nation-state boundaries",
          "Only national identity",
          "No global migration"
        ],
        correct: 1,
        explanation: "Transnationalism: diaspora communities (Mexican-Americans), Indian tech workers sending money home; transnational families; challenge to fixed identities."
      },
      {
        id: 19,
        question: "What is regional development, and how do regions become wealthy or poor?",
        options: [
          "No regional variation",
          "Historical advantages (resources, location, early industrialization) compound; technology hubs (Silicon Valley), deindustrialized regions lag",
          "All regions equal",
          "Random distribution"
        ],
        correct: 1,
        explanation: "Regional development: core-periphery within nations; Sunbelt vs Rustbelt USA; London dominates UK; unequal development perpetuated."
      },
      {
        id: 20,
        question: "What is the concept of positionality in geographic research?",
        options: [
          "Research neutral always",
          "Researcher's identity (race, gender, nationality) affects what/how they study; positionality shapes knowledge production; reflexivity essential",
          "Identity irrelevant",
          "No research bias"
        ],
        correct: 1,
        explanation: "Positionality: Western geographers studying Global South bring biases; indigenous geographies challenge Western perspectives; decolonizing geography important."
      }
    ]
  },
  "AP Psychology": {
    title: "AP Psychology Unit Test",
    description: "Comprehensive assessment covering all Psychology lessons",
    questions: [
      {
        id: 1,
        question: "Which neurotransmitter is most associated with mood regulation, and low levels are linked to depression?",
        options: [
          "Acetylcholine",
          "Serotonin; antidepressants (SSRIs) increase serotonin levels to improve mood",
          "Glutamate",
          "GABA"
        ],
        correct: 1,
        explanation: "Serotonin: mood regulation, sleep, appetite; serotonin hypothesis of depression; SSRIs block reuptake increasing synaptic serotonin; monoamine neurotransmitter system."
      },
      {
        id: 2,
        question: "What is the difference between proactive and retroactive interference in memory?",
        options: [
          "No difference",
          "Proactive: old info interferes with new learning; retroactive: new info interferes with old memories",
          "Both are same type",
          "Neither affects memory"
        ],
        correct: 1,
        explanation: "Interference theory: proactive (studying Spanish then French - Spanish interferes with French); retroactive (French interferes with Spanish memories); explains forgetting."
      },
      {
        id: 3,
        question: "How does the social facilitation theory explain behavior in front of others?",
        options: [
          "Presence never matters",
          "Others enhance dominant response: improves easy tasks (driving), impairs difficult tasks (learning new skill) due to arousal",
          "Only helps easy tasks",
          "Others always help"
        ],
        correct: 1,
        explanation: "Social facilitation (Zajonc): performance of well-learned behaviors improves with audience (cheering at sports); performance of new complex skills worsens (stage fright)."
      },
      {
        id: 4,
        question: "What is attribution theory, and what is the fundamental attribution error?",
        options: [
          "No theory of attribution",
          "We explain behavior as internal (personality) or external (situation); FAE: overestimate internal causes when judging others",
          "Always external",
          "Always internal"
        ],
        correct: 1,
        explanation: "Attribution: explaining behavior; FAE/correspondence bias: others' bad behavior = personality flaw (ignore situation); our bad behavior = circumstances (ignore our personality)."
      },
      {
        id: 5,
        question: "Which brain structure is primarily responsible for forming new long-term memories?",
        options: [
          "Cerebellum",
          "Hippocampus; damage (like H.M.) prevents new memory formation but preserves old memories and procedural memory",
          "Amygdala",
          "Cerebral cortex"
        ],
        correct: 1,
        explanation: "Hippocampus: consolidation of declarative memory (facts, events); damage = anterograde amnesia (can't form new memories); temporal lobe structure critical to memory."
      },
      {
        id: 6,
        question: "What is the difference between fixed ratio and variable ratio reinforcement schedules?",
        options: [
          "No difference",
          "Fixed: reward after set number of responses (every 5 lever presses); variable: unpredictable (creates persistent behavior like gambling)",
          "Both same pattern",
          "Neither uses reinforcement"
        ],
        correct: 1,
        explanation: "Schedules of reinforcement: FR (predictable, steady response) vs VR (most resistant to extinction, continuous responding - slot machines); Skinner's operant conditioning."
      },
      {
        id: 7,
        question: "How do gender socialization and social norms influence personality development according to research?",
        options: [
          "No gender influence",
          "Parents, peers, media reinforce gender-typical behaviors (boys-assertiveness, girls-compliance); creates personality differences often exaggerated",
          "Personality fully genetic",
          "Socialization irrelevant"
        ],
        correct: 1,
        explanation: "Gender socialization: differential reinforcement (girls rewarded for niceness, boys for toughness); gender schema theory; observational learning of gender-appropriate behavior; media representation."
      },
      {
        id: 8,
        question: "What is the relationship between stress and the autonomic nervous system?",
        options: [
          "Stress doesn't affect autonomic nervous system",
          "Chronic stress keeps sympathetic nervous system activated (fight-or-flight) instead of parasympathetic recovery; increases cortisol, damages immune system",
          "Stress only affects brain",
          "Autonomic system not related"
        ],
        correct: 1,
        explanation: "Stress response: SNS releases epinephrine/norepinephrine (heart rate, blood pressure); HPA axis releases cortisol; chronic activation causes hypertension, ulcers, weakened immunity."
      },
      {
        id: 9,
        question: "How do schemas influence perception and memory according to cognitive psychology?",
        options: [
          "Schemas don't exist",
          "Schemas: mental frameworks organizing knowledge; lead to selective perception, encoding consistent info, distorting memories to fit schema",
          "Perception completely objective",
          "Schemas irrelevant to memory"
        ],
        correct: 1,
        explanation: "Schema theory: we perceive and remember in ways consistent with existing schemas; bartlett's war of ghosts study showed memory distorted to fit cultural schemas."
      },
      {
        id: 10,
        question: "What is the biopsychosocial model's main contribution to understanding mental illness?",
        options: [
          "Only biological factors matter",
          "Integration of biological (genetics, neurotransmitters), psychological (cognition, behavior), social (culture, relationships) factors in mental health",
          "Only psychological factors",
          "Social factors irrelevant"
        ],
        correct: 1,
        explanation: "Biopsychosocial: depression involves neurotransmitter imbalance AND cognitive distortions AND social isolation/trauma; most comprehensive; guides multifaceted treatment approach."
      },
      {
        id: 11,
        question: "What is operant conditioning, and how does it differ from classical conditioning?",
        options: [
          "Same process",
          "Operant: behavior → consequences → behavior change; classical: stimulus → automatic response; operant: voluntary behavior, classical: automatic",
          "No difference exists",
          "Only classical works"
        ],
        correct: 1,
        explanation: "Operant conditioning: Skinner; lever press → food (reinforcement) increases pressing; timeout → behavior decreases; shaped complex behaviors."
      },
      {
        id: 12,
        question: "What is attachment in infant development, and why is it important?",
        options: [
          "No importance",
          "Emotional bond between infant and caregiver; Ainsworth's secure/anxious/avoidant styles; affects later relationships",
          "Only physical care",
          "No long-term effects"
        ],
        correct: 1,
        explanation: "Attachment: Bowlby's theory; secure attachment supports healthy development; maternal separation has negative effects; impacts emotional regulation."
      },
      {
        id: 13,
        question: "What is cognitive development, and what are Piaget's stages?",
        options: [
          "No development",
          "Sensorimotor (0-2) → preoperational (2-7) → concrete operational (7-12) → formal operational (12+); schema development through assimilation/accommodation",
          "All same from birth",
          "No mental growth"
        ],
        correct: 1,
        explanation: "Piaget: children think differently at different ages; conservation task shows concrete operations; formal operations enable abstract reasoning."
      },
      {
        id: 14,
        question: "What is the structure and function of the brain, especially the limbic system?",
        options: [
          "All brain same",
          "Limbic system: emotional processing (amygdala-fear, hippocampus-memory, hypothalamus-drives); prefrontal cortex controls behavior",
          "Brain has no structure",
          "Emotions not brain-based"
        ],
        correct: 1,
        explanation: "Brain structures: amygdala detects threats; hippocampus consolidates memories; prefrontal cortex develops slowly (impulsivity in teens); hemispheric lateralization."
      },
      {
        id: 15,
        question: "What is cognitive dissonance, and how do people resolve it?",
        options: [
          "No mental conflict",
          "Discomfort from holding contradictory beliefs; resolved by changing attitude, behavior, or justifying beliefs",
          "Always consistent thinking",
          "Never occurs"
        ],
        correct: 1,
        explanation: "Cognitive dissonance: smoker knows smoking unhealthy (conflict); may quit, downplay risks, or claim benefits; Festinger's theory."
      },
      {
        id: 16,
        question: "What is observational learning, and when is it most effective?",
        options: [
          "Can't learn from others",
          "Learning by watching others; Bandura's Bobo doll (children imitated aggression); attention, retention, reproduction, motivation affect success",
          "Only direct experience",
          "Never effective"
        ],
        correct: 1,
        explanation: "Observational learning: modeling (copying behavior); mirror neurons activate when observing actions; media violence impact on aggression controversial."
      },
      {
        id: 17,
        question: "What is the bystander effect, and what is diffusion of responsibility?",
        options: [
          "No bystander effect",
          "People less likely help in groups due to diffusion of responsibility; Kitty Genovese case; reduces individual accountability",
          "People always help",
          "No group effects"
        ],
        correct: 1,
        explanation: "Bystander effect: 38 witnesses to Genovese murder didn't help; each person assumes others will act; more bystanders = less help."
      },
      {
        id: 18,
        question: "What is obedience to authority, and what did Milgram's experiments show?",
        options: [
          "No obedience",
          "Milgram: 65% gave lethal shocks when ordered; proximity to victim decreased obedience; ordinary people commit atrocities under authority",
          "Everyone disobeys",
          "Authority irrelevant"
        ],
        correct: 1,
        explanation: "Milgram: powerful statement on human nature; people override conscience when authority orders; 'I was following orders' defense limited."
      },
      {
        id: 19,
        question: "What is mental health treatment, and what are different therapeutic approaches?",
        options: [
          "No effective treatment",
          "Psychotherapy (cognitive-behavioral, psychoanalytic), medication (antidepressants), combination most effective; therapy modality matters less than rapport",
          "Only medication works",
          "Therapy fake"
        ],
        correct: 1,
        explanation: "Treatment: CBT for anxiety/depression, antipsychotics for schizophrenia, antidepressants for depression; therapeutic alliance crucial for success."
      },
      {
        id: 20,
        question: "What is the nature versus nurture debate in psychology?",
        options: [
          "Only nature",
          "Both genes (nature) and environment (nurture) shape behavior; epigenetics shows environmental effects on gene expression; interaction complex",
          "Only nurture",
          "No interaction"
        ],
        correct: 1,
        explanation: "Nature vs nurture: twins raised apart show genetic influence but environment matters; intelligence (heritability 50%), personality traits heritable; environment modifies expression."
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
        // Do NOT add to game score for unit tests
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
