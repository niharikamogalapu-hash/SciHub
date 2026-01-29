// CHEMISTRY GAMES (11-20)

const gameQuizzes = {
  11: {
    type: "quiz",
    title: "Atomic Structure & Periodic Table",
    description: "Master atomic structure and periodic trends",
    questions: [
      {
        question: "What subatomic particles are found in the nucleus of an atom?",
        options: ["Electrons and protons", "Protons and neutrons", "Electrons and neutrons", "Only electrons"],
        correct: 1,
        explanation: "The nucleus contains protons (positive charge) and neutrons (neutral charge). Electrons orbit around the nucleus in electron clouds."
      },
      {
        question: "How many electrons does a neutral carbon atom have?",
        options: ["6", "8", "12", "14"],
        correct: 0,
        explanation: "Carbon has an atomic number of 6, meaning it has 6 protons and 6 electrons in its neutral state."
      },
      {
        question: "Who is credited with creating modern chemistry as a science?",
        options: ["Isaac Newton", "Antoine Lavoisier", "Marie Curie", "Robert Boyle"],
        correct: 1,
        explanation: "Antoine Lavoisier is often called the father of modern chemistry for establishing the law of conservation of mass."
      },
      {
        question: "Which element is in Group 17 and Period 3 of the periodic table?",
        options: ["Chlorine", "Fluorine", "Bromine", "Iodine"],
        correct: 0,
        explanation: "Chlorine (Cl) is in Group 17 (halogens) and Period 3. It has 17 valence electrons."
      },
      {
        question: "In what orbitals are electrons in atoms located?",
        options: ["Fixed circular paths only", "Regions of probability around the nucleus", "Linear paths", "The nucleus itself"],
        correct: 1,
        explanation: "Electrons exist in orbitals, which are three-dimensional regions where electrons are likely to be found."
      }
    ]
  },

  12: {
    type: "quiz",
    title: "Chemical Reactions & Solutions",
    description: "Understand stoichiometry, solutions, and reaction types",
    questions: [
      {
        question: "In the reaction 2H₂ + O₂ → 2H₂O, how many moles of water are produced from 4 moles of hydrogen?",
        options: ["2 moles", "4 moles", "8 moles", "1 mole"],
        correct: 1,
        explanation: "The stoichiometric ratio is 2:2 for H₂ to H₂O, so 4 moles H₂ produces 4 moles H₂O."
      },
      {
        question: "What is the molarity of a solution containing 2 moles of solute dissolved in 500 mL of total solution?",
        options: ["1 M", "2 M", "4 M", "0.5 M"],
        correct: 2,
        explanation: "Molarity = moles/liters = 2 moles / 0.5 L = 4 M"
      },
      {
        question: "What is produced when an acid reacts with a base?",
        options: ["An alkali and water", "A salt and water", "Hydrogen gas", "An oxide"],
        correct: 1,
        explanation: "Acid-base reactions (neutralization) produce a salt and water as products."
      },
      {
        question: "Which of the following is a precipitation reaction?",
        options: ["AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)", "Mg(s) + O₂(g) → MgO(s)", "HCl + NaOH → NaCl + H₂O", "2Na(s) + Cl₂(g) → 2NaCl(s)"],
        correct: 0,
        explanation: "A precipitation reaction forms an insoluble solid (precipitate). AgCl is insoluble in water."
      },
      {
        question: "In a redox reaction, what does oxidation refer to?",
        options: ["Loss of electrons", "Gain of electrons", "Loss of oxygen atoms", "Gain of hydrogen atoms"],
        correct: 0,
        explanation: "Oxidation is the loss of electrons. The opposite process, reduction, is the gain of electrons."
      }
    ]
  },

  13: {
    type: "quiz",
    title: "Gas Laws & Kinetic Theory",
    description: "Master ideal and real gas behavior",
    questions: [
      {
        question: "The ideal gas law is represented by which equation?",
        options: ["PV = nKT", "PV = nRT", "P = nRT/V", "V = nRT/P"],
        correct: 1,
        explanation: "The ideal gas law is PV = nRT, where P is pressure, V is volume, n is moles, R is the gas constant, and T is temperature."
      },
      {
        question: "If a gas at 1 atm and 300 K occupies 2 L, what volume will it occupy at 2 atm and 300 K?",
        options: ["4 L", "2 L", "1 L", "0.5 L"],
        correct: 2,
        explanation: "Using Boyle's Law (P₁V₁ = P₂V₂): 1 × 2 = 2 × V₂, so V₂ = 1 L"
      },
      {
        question: "What assumption do real gases violate compared to ideal gases?",
        options: ["They have mass", "They occupy no volume and have no intermolecular forces", "They condense at high pressures", "They contain atoms"],
        correct: 1,
        explanation: "Ideal gases assume zero volume and no intermolecular forces, but real gases do have volume and intermolecular attractions."
      },
      {
        question: "In a mixture of gases, the total pressure equals the sum of individual pressures. This is known as:",
        options: ["Graham's Law", "Dalton's Law of Partial Pressures", "Boyle's Law", "Charles's Law"],
        correct: 1,
        explanation: "Dalton's Law states that the total pressure of a gas mixture equals the sum of partial pressures of individual gases."
      },
      {
        question: "Which gas diffuses faster: N₂ or H₂?",
        options: ["N₂", "H₂", "They diffuse at the same rate", "It depends on temperature"],
        correct: 1,
        explanation: "According to Graham's Law, lighter molecules diffuse faster. H₂ (2 g/mol) is much lighter than N₂ (28 g/mol)."
      }
    ]
  },

  14: {
    type: "quiz",
    title: "Thermodynamics & Energy",
    description: "Explore energy, enthalpy, and entropy",
    questions: [
      {
        question: "What is the SI unit for enthalpy?",
        options: ["Joules", "Calories", "Kilocalories", "Electron volts"],
        correct: 0,
        explanation: "Enthalpy (H) is measured in Joules (J) or kilojoules (kJ)."
      },
      {
        question: "Is the combustion of methane endothermic or exothermic?",
        options: ["Endothermic", "Exothermic", "Neither", "Both simultaneously"],
        correct: 1,
        explanation: "Combustion reactions release energy to the surroundings, making them exothermic (ΔH is negative)."
      },
      {
        question: "In calorimetry, how is the heat absorbed by water calculated?",
        options: ["q = m × ΔT", "q = m × c × ΔT", "q = c × ΔT", "q = m × T"],
        correct: 1,
        explanation: "The heat equation is q = m × c × ΔT, where m is mass, c is specific heat capacity, and ΔT is temperature change."
      },
      {
        question: "Which statement best describes entropy?",
        options: ["The amount of heat in a system", "A measure of disorder or randomness", "The speed of a reaction", "The energy required to break bonds"],
        correct: 1,
        explanation: "Entropy (S) is a measure of the disorder or randomness in a system."
      },
      {
        question: "What happens to entropy in an isolated system?",
        options: ["It always decreases", "It stays constant", "It always increases", "It becomes zero"],
        correct: 2,
        explanation: "According to the second law of thermodynamics, the entropy of an isolated system always increases."
      }
    ]
  },

  15: {
    type: "quiz",
    title: "Chemical Bonding & Molecular Structure",
    description: "Master bonding types and molecular shapes",
    questions: [
      {
        question: "Which lab safety rule is most important?",
        options: ["Wear a white coat", "Always wear safety goggles in the lab", "Eat snacks at your bench", "Use your phone during experiments"],
        correct: 1,
        explanation: "Safety goggles protect eyes from chemical splashes and are essential lab safety equipment."
      },
      {
        question: "Which type of bond forms when electrons are transferred between atoms?",
        options: ["Covalent bond", "Ionic bond", "Hydrogen bond", "Metallic bond"],
        correct: 1,
        explanation: "Ionic bonds form through electron transfer from one atom to another, creating oppositely charged ions."
      },
      {
        question: "Is CO₂ a polar or nonpolar molecule?",
        options: ["Polar", "Nonpolar", "Ionic", "Metallic"],
        correct: 1,
        explanation: "CO₂ is nonpolar because its linear geometry causes the dipole moments of the C=O bonds to cancel."
      },
      {
        question: "In a Lewis structure, what do dots represent?",
        options: ["Bonded electrons", "Valence electrons", "Core electrons", "Neutrons"],
        correct: 1,
        explanation: "Lewis structures use dots to represent valence electrons around atoms."
      },
      {
        question: "What orbitals are involved in a sigma (σ) bond?",
        options: ["p orbitals only", "s orbitals only", "s and p orbitals", "d orbitals"],
        correct: 2,
        explanation: "Sigma bonds can form from s-s, s-p, or p-p overlap along the internuclear axis."
      }
    ]
  },

  16: {
    type: "quiz",
    title: "States of Matter & Equilibrium",
    description: "Understand liquids, solutions, and chemical equilibrium",
    questions: [
      {
        question: "Which intermolecular force is responsible for the properties of liquids?",
        options: ["Ionic bonds", "Van der Waals forces", "Covalent bonds", "Metallic bonds"],
        correct: 1,
        explanation: "Van der Waals forces (dipole-dipole, London dispersion) are the primary intermolecular forces in liquids."
      },
      {
        question: "What does a saturated solution contain?",
        options: ["Dissolved solute equal to solubility at that temperature", "More solute than it can dissolve", "No solute", "A mixture of immiscible liquids"],
        correct: 0,
        explanation: "A saturated solution contains the maximum amount of dissolved solute at a given temperature."
      },
      {
        question: "When a reversible reaction reaches equilibrium, what is true about forward and reverse reactions?",
        options: ["Forward reaction stops", "They occur at equal rates", "Reverse reaction stops", "No reactions occur"],
        correct: 1,
        explanation: "At equilibrium, the forward and reverse reaction rates are equal, so concentrations remain constant."
      },
      {
        question: "What is the expression for the equilibrium constant Kc?",
        options: ["Kc = [Reactants]/[Products]", "Kc = [Products]/[Reactants]", "Kc = Products + Reactants", "Kc = Reactants - Products"],
        correct: 1,
        explanation: "The equilibrium constant is Kc = [Products]/[Reactants], each raised to their stoichiometric coefficients."
      },
      {
        question: "What is the most common crystalline structure in solid materials?",
        options: ["Amorphous", "Cubic", "Hexagonal", "All are equally common"],
        correct: 1,
        explanation: "Cubic is the most common crystalline structure, though hexagonal and other systems also occur."
      }
    ]
  },

  17: {
    type: "quiz",
    title: "Kinetics & Reaction Rates",
    description: "Explore pH, buffers, and reaction mechanisms",
    questions: [
      {
        question: "What is the pH of a solution with [H⁺] = 1×10⁻³ M?",
        options: ["1", "2", "3", "4"],
        correct: 2,
        explanation: "pH = -log[H⁺] = -log(1×10⁻³) = 3"
      },
      {
        question: "What is the primary function of a buffer solution?",
        options: ["To increase reaction rate", "To resist changes in pH", "To accelerate catalysis", "To precipitate ions"],
        correct: 1,
        explanation: "A buffer resists changes in pH by containing a weak acid and its conjugate base (or weak base and conjugate acid)."
      },
      {
        question: "How does a catalyst affect reaction rate?",
        options: ["Increases activation energy", "Decreases activation energy", "Changes the equilibrium constant", "Increases temperature"],
        correct: 1,
        explanation: "Catalysts lower the activation energy required for a reaction, allowing it to proceed faster."
      },
      {
        question: "In solids, how are atoms typically arranged?",
        options: ["Randomly", "In regular, repeating patterns", "In layers", "In chains"],
        correct: 1,
        explanation: "Atoms in crystalline solids are arranged in regular, repeating three-dimensional patterns."
      },
      {
        question: "What does the rate law express?",
        options: ["Equilibrium concentrations", "The relationship between rate and concentrations", "The energy of a reaction", "The solubility of substances"],
        correct: 1,
        explanation: "The rate law shows how the reaction rate depends on the concentrations of reactants."
      }
    ]
  },

  18: {
    type: "quiz",
    title: "Carbon & Periodic Properties",
    description: "Explore network solids, electrochemistry, and trends",
    questions: [
      {
        question: "Which is an example of a network solid?",
        options: ["Diamond", "Table salt", "Ice", "Sulfur"],
        correct: 0,
        explanation: "Diamond is a network solid where carbon atoms are covalently bonded in a continuous 3D structure."
      },
      {
        question: "What is the primary use of silicon in modern technology?",
        options: ["Jewelry", "Semiconductors and microchips", "Building material", "Fuel"],
        correct: 1,
        explanation: "Silicon's semiconducting properties make it essential for electronics and computer chips."
      },
      {
        question: "In electrochemistry, what occurs at the anode?",
        options: ["Reduction occurs", "Oxidation occurs", "Neutralization occurs", "Precipitation occurs"],
        correct: 1,
        explanation: "Oxidation (loss of electrons) occurs at the anode in an electrochemical cell."
      },
      {
        question: "Dalton's atomic theory proposed that atoms are:",
        options: ["Divisible into subatomic particles", "Indivisible and cannot be created or destroyed", "Made of light", "Electrically neutral spheres"],
        correct: 1,
        explanation: "Dalton proposed that atoms are the smallest units of matter and cannot be divided."
      },
      {
        question: "As you move down a group in the periodic table, atomic radius:",
        options: ["Decreases", "Increases", "Stays the same", "Varies randomly"],
        correct: 1,
        explanation: "Atomic radius increases going down a group because each element has an additional electron shell."
      }
    ]
  },

  19: {
    type: "quiz",
    title: "Organic Chemistry & Nuclear Chemistry",
    description: "Master hydrocarbon structures and nuclear reactions",
    questions: [
      {
        question: "What is produced in nuclear fission?",
        options: ["Light elements", "Smaller nuclei and energy", "New atoms of the same element", "Only radiation"],
        correct: 1,
        explanation: "Nuclear fission splits heavy nuclei into lighter nuclei, releasing significant energy."
      },
      {
        question: "What is half-life?",
        options: ["The time for half of a sample to decay", "The age of a fossil", "The energy released in decay", "The stability of an isotope"],
        correct: 0,
        explanation: "Half-life is the time required for half of a radioactive sample to decay into another substance."
      },
      {
        question: "What is a hydrocarbon?",
        options: ["A compound containing hydrogen and oxygen", "A compound containing only hydrogen and carbon", "An acid containing hydrogen", "A salt of carbon"],
        correct: 1,
        explanation: "Hydrocarbons contain only hydrogen and carbon atoms bonded together."
      },
      {
        question: "What is the difference between alkenes and alkynes?",
        options: ["Alkenes have single bonds, alkynes have double", "Alkenes have double bonds, alkynes have triple", "Alkynes are aromatic", "There is no difference"],
        correct: 1,
        explanation: "Alkenes contain C=C (double) bonds, while alkynes contain C≡C (triple) bonds."
      },
      {
        question: "Which compound is aromatic?",
        options: ["Ethane", "Benzene", "Hexane", "Propene"],
        correct: 1,
        explanation: "Benzene is the classic aromatic compound with a six-membered ring and resonant structure."
      }
    ]
  },

  20: {
    type: "quiz",
    title: "Organic Synthesis & Carbon Cycle",
    description: "Understand organic compounds and biogeochemical cycles",
    questions: [
      {
        question: "Which functional group is characteristic of alcohols?",
        options: ["-COOH", "-OH", "-CHO", "-NH₂"],
        correct: 1,
        explanation: "Alcohols contain the hydroxyl group (-OH) bonded to a carbon atom."
      },
      {
        question: "In IUPAC nomenclature, what does 'but-' indicate?",
        options: ["A molecule with 3 carbons", "A molecule with 4 carbons", "A branched chain", "An aromatic compound"],
        correct: 1,
        explanation: "'But-' (or 'butan-') indicates a 4-carbon main chain. 'Prop-' means 3 carbons, 'eth-' means 2."
      },
      {
        question: "What are polymers made from?",
        options: ["Single amino acids", "Small repeating units called monomers", "Only inorganic compounds", "Metals"],
        correct: 1,
        explanation: "Polymers are long chains made from many repeating monomer units linked by chemical bonds."
      },
      {
        question: "In the global carbon cycle, where is most carbon stored?",
        options: ["The atmosphere", "Living organisms", "The ocean and sediments", "Soil"],
        correct: 2,
        explanation: "Most carbon is stored in the oceans and in sedimentary rocks, with smaller amounts in the atmosphere and biosphere."
      },
      {
        question: "Which process returns carbon to the atmosphere from living organisms?",
        options: ["Photosynthesis", "Respiration", "Combustion", "Both respiration and combustion"],
        correct: 3,
        explanation: "Both respiration (in living things) and combustion (of fossil fuels) release CO₂ to the atmosphere."
      }
    ]
  },

  // PHYSICS GAMES (21-30)

  21: {
    type: "quiz",
    title: "Motion & Newton's Laws",
    description: "Master kinematics, derivatives, and forces",
    questions: [
      {
        question: "If an object travels 100 m in 10 seconds at constant velocity, what is its velocity?",
        options: ["10 m/s", "100 m/s", "1 m/s", "1000 m/s"],
        correct: 0,
        explanation: "Velocity = distance/time = 100 m / 10 s = 10 m/s"
      },
      {
        question: "The derivative of position with respect to time gives:",
        options: ["Acceleration", "Velocity", "Momentum", "Force"],
        correct: 1,
        explanation: "The first derivative of position (x) with respect to time gives velocity (dx/dt = v)."
      },
      {
        question: "A vector has both:",
        options: ["Direction and magnitude", "Speed and acceleration", "Mass and weight", "Force and time"],
        correct: 0,
        explanation: "A vector is defined by both its magnitude (size) and direction."
      },
      {
        question: "Newton's second law is expressed as:",
        options: ["F = ma", "F = mv", "F = a/m", "F = m/a"],
        correct: 0,
        explanation: "F = ma (Force equals mass times acceleration) is Newton's second law of motion."
      },
      {
        question: "What does Newton's first law state?",
        options: ["Force equals mass times acceleration", "Objects in motion stay in motion unless acted upon by a force", "Action and reaction are equal", "Gravity is a fundamental force"],
        correct: 1,
        explanation: "Newton's first law states that an object at rest stays at rest, and an object in motion stays in motion unless a force acts on it."
      }
    ]
  },

  22: {
    type: "quiz",
    title: "Energy & Gravity",
    description: "Explore forces, energy, and gravitational interactions",
    questions: [
      {
        question: "When sliding friction acts on an object, in what direction does it point?",
        options: ["In the direction of motion", "Opposite to the direction of motion", "Perpendicular to the surface", "Upward"],
        correct: 1,
        explanation: "Friction always opposes motion, pointing in the direction opposite to the object's movement."
      },
      {
        question: "What provides the centripetal force for a car turning on a curved road?",
        options: ["Air resistance", "Friction between tires and road", "Engine power", "Gravitational force"],
        correct: 1,
        explanation: "Friction between the tires and road provides the centripetal force needed for circular motion."
      },
      {
        question: "Newton's law of universal gravitation relates force to:",
        options: ["Velocity and time", "Mass and distance", "Density and volume", "Energy and momentum"],
        correct: 1,
        explanation: "F = G(m₁m₂)/r², where force is proportional to masses and inversely proportional to the square of distance."
      },
      {
        question: "Work is calculated as:",
        options: ["Force × distance", "Force × time", "Mass × velocity", "Energy ÷ time"],
        correct: 0,
        explanation: "Work = Force × distance × cos(θ), where θ is the angle between force and displacement."
      },
      {
        question: "What is the total mechanical energy of a system equal to?",
        options: ["Kinetic energy alone", "Potential energy alone", "Kinetic energy plus potential energy", "Work done divided by time"],
        correct: 2,
        explanation: "Total mechanical energy E = KE + PE (kinetic plus potential energy)."
      }
    ]
  },

  23: {
    type: "quiz",
    title: "Rotational Motion & Statics",
    description: "Master collisions, torque, and equilibrium",
    questions: [
      {
        question: "In an elastic collision, what is conserved?",
        options: ["Momentum only", "Kinetic energy only", "Both momentum and kinetic energy", "Neither"],
        correct: 2,
        explanation: "Elastic collisions conserve both total momentum and total kinetic energy."
      },
      {
        question: "Rotational inertia is to rotation as:",
        options: ["Velocity is to motion", "Mass is to linear motion", "Force is to acceleration", "Energy is to power"],
        correct: 1,
        explanation: "Rotational inertia is the resistance to angular acceleration, similar to how mass resists linear acceleration."
      },
      {
        question: "Torque is calculated as:",
        options: ["Force × distance", "Force × distance × sin(θ)", "Moment of inertia × angular acceleration", "Options A and B only"],
        correct: 3,
        explanation: "Torque τ = r × F × sin(θ), and τ = Iα (torque equals moment of inertia times angular acceleration)."
      },
      {
        question: "For an object to be in static equilibrium:",
        options: ["The net force must be zero", "The net torque must be zero", "Both net force and net torque must be zero", "It must not be moving"],
        correct: 2,
        explanation: "Static equilibrium requires both zero net force (translational equilibrium) and zero net torque (rotational equilibrium)."
      },
      {
        question: "A seesaw is balanced when:",
        options: ["The weights on each side are equal", "The torques on each side are equal", "The forces are parallel", "The distances from the fulcrum are equal"],
        correct: 1,
        explanation: "For rotational equilibrium, torques must balance: τ₁ = τ₂, or F₁r₁ = F₂r₂."
      }
    ]
  },

  24: {
    type: "quiz",
    title: "Fluids & Waves",
    description: "Understand fluid mechanics and wave motion",
    questions: [
      {
        question: "Pressure in a fluid at rest depends on:",
        options: ["The shape of the container", "The density and depth of the fluid", "The temperature only", "The volume of the container"],
        correct: 1,
        explanation: "Pressure P = ρgh, where ρ is density, g is gravity, and h is depth below the surface."
      },
      {
        question: "Bernoulli's principle states that as fluid speed increases:",
        options: ["Pressure increases", "Pressure decreases", "Pressure stays constant", "Temperature increases"],
        correct: 1,
        explanation: "Bernoulli's principle: as speed increases, pressure decreases. P + ½ρv² + ρgh = constant"
      },
      {
        question: "What characterizes simple harmonic motion?",
        options: ["Constant velocity", "Restoring force proportional to displacement", "Increasing acceleration", "Decreasing amplitude"],
        correct: 1,
        explanation: "In SHM, a restoring force is proportional to displacement from equilibrium (F ∝ -x)."
      },
      {
        question: "For a traveling wave, the relationship between wavelength, frequency, and speed is:",
        options: ["v = f/λ", "v = f × λ", "v = λ/f", "v = f + λ"],
        correct: 1,
        explanation: "Wave equation: v = f × λ (velocity equals frequency times wavelength)."
      },
      {
        question: "What property of waves allows them to bend around obstacles?",
        options: ["Refraction", "Diffraction", "Reflection", "Interference"],
        correct: 1,
        explanation: "Diffraction is the bending of waves around obstacles or through openings."
      }
    ]
  },

  25: {
    type: "quiz",
    title: "Sound, Temperature & Kinetic Theory",
    description: "Explore acoustics, thermodynamics, and molecular motion",
    questions: [
      {
        question: "The speed of sound is fastest in:",
        options: ["Air", "Water", "Steel (a solid)", "A vacuum"],
        correct: 2,
        explanation: "Sound travels fastest through solids (steel ~5000 m/s), slower in liquids (~1500 m/s), and slowest in gases (~340 m/s)."
      },
      {
        question: "A musical note's pitch is determined by:",
        options: ["Its amplitude", "Its frequency", "Its wavelength", "Its intensity"],
        correct: 1,
        explanation: "Pitch is perceived based on frequency; higher frequency = higher pitch."
      },
      {
        question: "What is absolute zero in Celsius?",
        options: ["0°C", "-100°C", "-273.15°C", "-300°C"],
        correct: 2,
        explanation: "Absolute zero (0 K) equals -273.15°C, the lowest possible temperature where molecular motion stops."
      },
      {
        question: "The kinetic theory of gases assumes that gas molecules:",
        options: ["Attract each other strongly", "Move randomly and collide elastically", "Have fixed positions", "Move in straight lines only"],
        correct: 1,
        explanation: "Kinetic theory assumes random molecular motion with elastic collisions and no intermolecular forces."
      },
      {
        question: "What occurs during a phase change at constant temperature?",
        options: ["Temperature increases", "Molecular motion increases", "Heat is absorbed or released while temperature stays constant", "The substance becomes denser"],
        correct: 2,
        explanation: "During phase transitions (melting, boiling), heat is exchanged without temperature change as bonds break/form."
      }
    ]
  },

  26: {
    type: "quiz",
    title: "Thermodynamics & Electricity",
    description: "Master heat engines and electric forces",
    questions: [
      {
        question: "The first law of thermodynamics states:",
        options: ["Heat always flows from hot to cold", "ΔU = Q - W (energy change equals heat minus work)", "Entropy always increases", "Temperature must be absolute"],
        correct: 1,
        explanation: "ΔU = Q - W: internal energy change equals heat added minus work done by the system."
      },
      {
        question: "What is the efficiency of a perfect heat engine?",
        options: ["0%", "50%", "100%", "It depends on the engine"],
        correct: 1,
        explanation: "No heat engine can be 100% efficient due to the second law of thermodynamics. Real engines are much less efficient."
      },
      {
        question: "Like charges:",
        options: ["Attract each other", "Repel each other", "Have no interaction", "Move together"],
        correct: 1,
        explanation: "Like charges repel; opposite charges attract. This is Coulomb's law of electrostatics."
      },
      {
        question: "Electric field is defined as:",
        options: ["Force per unit charge", "Charge per unit force", "Voltage per unit distance", "Current per unit time"],
        correct: 0,
        explanation: "Electric field E = F/q (force per unit charge) determines the force on a test charge."
      },
      {
        question: "An electric field points:",
        options: ["Away from negative charges", "Toward positive charges", "Always downward", "In the direction of electron flow"],
        correct: 0,
        explanation: "Electric field lines point away from positive charges and toward negative charges."
      }
    ]
  },

  27: {
    type: "quiz",
    title: "Circuits & Electromagnetic Theory",
    description: "Understand current, resistance, and circuit analysis",
    questions: [
      {
        question: "What is measured by a voltmeter?",
        options: ["Current", "Voltage (potential difference)", "Resistance", "Power"],
        correct: 1,
        explanation: "A voltmeter measures voltage (potential difference) between two points in a circuit."
      },
      {
        question: "Ohm's law is expressed as:",
        options: ["V = IR", "I = VR", "R = VI", "P = VI"],
        correct: 0,
        explanation: "V = IR: voltage equals current times resistance."
      },
      {
        question: "In a series circuit, current:",
        options: ["Is different through each component", "Is the same through all components", "Increases through each resistor", "Depends on voltage"],
        correct: 1,
        explanation: "In series, current is the same everywhere because there's only one path for current flow."
      },
      {
        question: "The total resistance in a parallel circuit is:",
        options: ["The sum of individual resistances", "1/R_total = 1/R₁ + 1/R₂ + ...", "Always less than the smallest resistor", "The average of all resistances"],
        correct: 1,
        explanation: "For parallel resistors: 1/R_total = 1/R₁ + 1/R₂ + ... The total is less than any single resistor."
      },
      {
        question: "Which of Kirchhoff's rules states that the sum of potential differences around a closed loop equals zero?",
        options: ["Junction rule", "Loop rule", "Current rule", "Voltage rule"],
        correct: 1,
        explanation: "Kirchhoff's loop rule states that ΣV = 0 around any closed circuit path."
      }
    ]
  },

  28: {
    type: "quiz",
    title: "Magnetism & Electromagnetic Induction",
    description: "Explore magnetic fields and induced currents",
    questions: [
      {
        question: "Magnetic field lines emerge from:",
        options: ["Negative charges", "The north pole of a magnet", "Insulators", "Conductors"],
        correct: 1,
        explanation: "Magnetic field lines emerge from the north pole and enter the south pole of a magnet."
      },
      {
        question: "Ampere's law relates magnetic field to:",
        options: ["Electric charge", "Electric current", "Voltage", "Resistance"],
        correct: 1,
        explanation: "Ampere's law: ∮B·dl = μ₀I_enclosed (magnetic field is related to the current that creates it)."
      },
      {
        question: "According to Lenz's law, an induced current opposes:",
        options: ["The magnetic field that created it", "The original motion", "The source of the change", "All of the above"],
        correct: 3,
        explanation: "Lenz's law states that induced effects oppose the change that causes them."
      },
      {
        question: "Self-inductance is important in circuits because:",
        options: ["It stores electrical energy", "It opposes changes in current", "It reduces energy loss", "Both A and B"],
        correct: 3,
        explanation: "Self-inductance L opposes changes in current (dI/dt) and stores energy in a magnetic field (U = ½LI²)."
      },
      {
        question: "Maxwell's equations unify:",
        options: ["Mechanics and thermodynamics", "Electricity and magnetism", "Gravity and electromagnetism", "Quantum and classical physics"],
        correct: 1,
        explanation: "Maxwell's four equations unified electricity and magnetism into electromagnetism and predicted electromagnetic waves."
      }
    ]
  },

  29: {
    type: "quiz",
    title: "Optics & Light",
    description: "Master light behavior, lenses, and interference",
    questions: [
      {
        question: "The speed of light in a vacuum is approximately:",
        options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
        correct: 1,
        explanation: "c ≈ 3 × 10⁸ m/s (299,792,458 m/s exactly)."
      },
      {
        question: "In geometric optics, a concave mirror produces:",
        options: ["Only virtual images", "Only real images", "Both real and virtual images depending on object position", "No image"],
        correct: 2,
        explanation: "Concave mirrors can produce real images (beyond focal point) or virtual images (between mirror and focal point)."
      },
      {
        question: "A converging lens focuses light at:",
        options: ["The center of the lens", "The focal point", "Infinity", "The optical axis"],
        correct: 1,
        explanation: "A converging lens brings parallel light rays to a focus at the focal point F."
      },
      {
        question: "An optical instrument like a microscope magnifies by using:",
        options: ["A single lens", "Two or more lenses arranged to magnify", "Only mirrors", "Prisms"],
        correct: 1,
        explanation: "Microscopes use objective and eyepiece lenses in combination to achieve high magnification."
      },
      {
        question: "Thin film interference occurs when light reflects from:",
        options: ["A single surface", "Two closely spaced surfaces", "A diffraction grating", "A prism"],
        correct: 1,
        explanation: "Interference in thin films results from light reflecting from top and bottom surfaces with a small path difference."
      }
    ]
  },

  30: {
    type: "quiz",
    title: "Modern Physics & Cosmology",
    description: "Explore relativity, quantum mechanics, and the universe",
    questions: [
      {
        question: "According to special relativity, the speed of light is:",
        options: ["Relative to the observer's frame", "The same for all observers", "Faster in moving frames", "Slower in moving frames"],
        correct: 1,
        explanation: "The postulate of special relativity states that c is constant (same speed) for all inertial observers."
      },
      {
        question: "Which equation relates mass and energy in special relativity?",
        options: ["E = mc", "E = mc²", "E = m²c", "E = m/c²"],
        correct: 1,
        explanation: "E = mc² shows that mass can be converted to energy and vice versa."
      },
      {
        question: "In quantum mechanics, the uncertainty principle states that:",
        options: ["We can never know anything", "Position and momentum cannot both be precisely known", "Energy is quantized", "Particles are waves"],
        correct: 1,
        explanation: "Heisenberg's uncertainty principle: Δx × Δp ≥ ℏ/2 (position-momentum uncertainty product has a minimum)."
      },
      {
        question: "In nuclear physics, what is a nucleon?",
        options: ["A single electron", "A neutron only", "Either a proton or neutron", "A nucleus of hydrogen"],
        correct: 2,
        explanation: "Nucleons are the particles in the nucleus: protons and neutrons."
      },
      {
        question: "The Big Bang theory suggests that:",
        options: ["The universe is eternal", "The universe began from a hot, dense state", "The universe is static", "Stars created the universe"],
        correct: 1,
        explanation: "The Big Bang theory states the universe began from an extremely hot and dense state and has been expanding since."
      }
    ]
  },

  // ENVIRONMENTAL SCIENCE GAMES (31-40)

  31: {
    type: "quiz",
    title: "Life Diversity & Evolution",
    description: "Explore biology, biodiversity, and animal evolution",
    questions: [
      {
        question: "Which organelle is responsible for photosynthesis in plant cells?",
        options: ["Mitochondrion", "Chloroplast", "Nucleus", "Ribosome"],
        correct: 1,
        explanation: "Chloroplasts contain chlorophyll and perform photosynthesis in plants and algae."
      },
      {
        question: "What is the key characteristic that defines animals?",
        options: ["They produce oxygen", "They are multicellular and consume other organisms", "They have chloroplasts", "They reproduce asexually"],
        correct: 1,
        explanation: "Animals are multicellular heterotrophs that consume other organisms for energy."
      },
      {
        question: "When did the first animals appear on Earth?",
        options: ["3 billion years ago", "600 million years ago", "200 million years ago", "65 million years ago"],
        correct: 1,
        explanation: "The first animals appeared around 600 million years ago during the Ediacaran period."
      },
      {
        question: "Which anatomical structures are homologous in vertebrates?",
        options: ["Bat wing and insect wing", "Fish fin and human arm", "Bird wing and fish tail", "Snake scale and human hair"],
        correct: 1,
        explanation: "Homologous structures (like bat wing and human arm) evolved from a common ancestor and share similar bone structures."
      },
      {
        question: "Comparative anatomy is important for understanding:",
        options: ["Current animal behavior", "Evolutionary relationships", "Animal nutrition", "Ecosystem dynamics"],
        correct: 1,
        explanation: "Comparing anatomical structures across species helps reveal evolutionary relationships."
      }
    ]
  },

  32: {
    type: "quiz",
    title: "Plant Biology & Vascular Systems",
    description: "Master photosynthesis, plant structure, and evolution",
    questions: [
      {
        question: "The overall equation for photosynthesis is:",
        options: ["C₆H₁₂O₆ → 6CO₂ + 6H₂O", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "O₂ + light → C₆H₁₂O₆", "H₂O → H₂ + O₂"],
        correct: 1,
        explanation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants convert CO₂ and water into glucose."
      },
      {
        question: "What is the primary function of the cell wall in plants?",
        options: ["Photosynthesis", "Storage", "Structure and protection", "Reproduction"],
        correct: 2,
        explanation: "The cell wall provides structural support, rigidity, and protection to plant cells."
      },
      {
        question: "How did early plants evolve from water to land?",
        options: ["Suddenly appeared on land", "Gradually developed tissues for water transport and protection", "Through animal migration", "Due to temperature changes"],
        correct: 1,
        explanation: "Plants evolved from aquatic algae, developing vascular tissues and protective layers for terrestrial life."
      },
      {
        question: "What are the two main types of vascular tissue in plants?",
        options: ["Xylem and phloem", "Epidermis and cortex", "Parenchyma and collenchyma", "Cambium and heartwood"],
        correct: 0,
        explanation: "Xylem transports water and minerals; phloem transports sugars and nutrients throughout the plant."
      },
      {
        question: "Which vascular plants have no seeds?",
        options: ["Mosses", "Ferns", "Gymnosperms", "Angiosperms"],
        correct: 1,
        explanation: "Ferns are vascular plants that reproduce via spores, not seeds (unlike seed plants)."
      }
    ]
  },

  33: {
    type: "quiz",
    title: "Plant Reproduction & Ecology",
    description: "Understand plant reproduction, stress, and ecosystems",
    questions: [
      {
        question: "What is the primary function of a flower?",
        options: ["Photosynthesis", "Water absorption", "Sexual reproduction", "Food storage"],
        correct: 2,
        explanation: "Flowers are the reproductive organs of angiosperms, containing structures for sexual reproduction."
      },
      {
        question: "Seeds and fruits develop from:",
        options: ["Leaves", "Roots", "Flowers (ovule and ovary)", "Stems"],
        correct: 2,
        explanation: "Seeds develop from ovules and fruits from the ovary after pollination and fertilization."
      },
      {
        question: "How do plants respond to stimuli like light and gravity?",
        options: ["They don't respond", "Through plant hormones and growth movements (tropisms)", "By moving their roots", "By changing color"],
        correct: 1,
        explanation: "Tropisms are growth responses: phototropism (toward light) and gravitropism (toward gravity)."
      },
      {
        question: "Which of the following causes plant stress?",
        options: ["Optimal sunlight", "Drought", "Appropriate watering", "Cool but not freezing temperatures"],
        correct: 1,
        explanation: "Drought, extreme temperatures, excess salt, and disease are major plant stressors."
      },
      {
        question: "What is the relationship between plants and fungi in mycorrhizae?",
        options: ["Parasitic", "Mutualistic (both benefit)", "Competitive", "Predator-prey"],
        correct: 1,
        explanation: "Mycorrhizae are mutualistic associations where fungi help plants absorb nutrients in exchange for sugars."
      }
    ]
  },

  34: {
    type: "quiz",
    title: "Animal Diversity",
    description: "Explore arthropods, vertebrates, and human anatomy",
    questions: [
      {
        question: "What is the most diverse group of animals on Earth?",
        options: ["Vertebrates", "Arthropods (insects, spiders, crustaceans)", "Mollusks", "Fish"],
        correct: 1,
        explanation: "Arthropods, particularly insects, make up over 80% of all known animal species."
      },
      {
        question: "Which group transitioned from water to land and gave rise to amphibians?",
        options: ["Sharks", "Lungfish and other lobe-finned fish", "Jellyfish", "Crocodiles"],
        correct: 1,
        explanation: "Lobe-finned fish (sarcopterygians) evolved limbs and lungs, becoming ancestors of amphibians."
      },
      {
        question: "What key feature distinguishes birds from reptiles?",
        options: ["Scales", "Feathers", "Eggs", "Cold-bloodedness"],
        correct: 1,
        explanation: "Feathers are the defining characteristic of birds, evolved from theropod dinosaurs."
      },
      {
        question: "Which characteristic is unique to mammals?",
        options: ["Laying eggs", "Having backbones", "Producing milk to feed young", "Breathing air"],
        correct: 2,
        explanation: "Mammary glands that produce milk to feed offspring are unique to mammals."
      },
      {
        question: "In humans, how many bones are in the adult skeleton?",
        options: ["186", "206", "226", "256"],
        correct: 1,
        explanation: "Adult humans have 206 bones. Babies have more (~270) which fuse as they grow."
      }
    ]
  },

  35: {
    type: "quiz",
    title: "Animal Behavior & Survival",
    description: "Master behavior, communication, and adaptation",
    questions: [
      {
        question: "What is animal domestication?",
        options: ["Animals living in the wild", "The process of selectively breeding animals for human use", "Migration to new habitats", "Hunting wild animals"],
        correct: 1,
        explanation: "Domestication is selective breeding over many generations to adapt animals to human purposes."
      },
      {
        question: "Behavioral ecology studies:",
        options: ["How behavior relates to evolutionary fitness", "Only feeding behavior", "Migration patterns exclusively", "Communication only"],
        correct: 0,
        explanation: "Behavioral ecology examines how animal behaviors evolve and affect survival and reproduction."
      },
      {
        question: "Which type of animal communication involves sound?",
        options: ["Visual signals", "Ultrasonic calls and echolocation", "Chemical signals", "All of the above"],
        correct: 1,
        explanation: "Many animals use sound signals for communication; bats use echolocation for navigation and hunting."
      },
      {
        question: "What is animal migration?",
        options: ["Permanent movement to a new habitat", "Temporary movement to exploit resources seasonally", "Hunting behavior", "Social hierarchies"],
        correct: 1,
        explanation: "Migration is seasonal movement (e.g., birds flying south) to find better conditions or food."
      },
      {
        question: "Desert animals survive extreme conditions by:",
        options: ["Ignoring heat", "Storing water and remaining inactive during the day", "Migrating constantly", "Having thick fur"],
        correct: 1,
        explanation: "Desert adaptations include water conservation, nocturnal activity, and behavioral avoidance of heat."
      }
    ]
  },

  36: {
    type: "quiz",
    title: "Ecology & Ecosystem Dynamics",
    description: "Understand populations, communities, and succession",
    questions: [
      {
        question: "What is population ecology?",
        options: ["The study of individual organisms", "The study of population size, growth, and distribution", "The study of human cities", "The study of genetic variation"],
        correct: 1,
        explanation: "Population ecology examines factors affecting population size, growth rates, and interactions."
      },
      {
        question: "What is the carrying capacity of an environment?",
        options: ["The maximum population size the environment can sustain", "The minimum number of organisms needed", "The initial population size", "How much food is produced"],
        correct: 0,
        explanation: "Carrying capacity (K) is the maximum population size an environment can support indefinitely."
      },
      {
        question: "In a community, what is a predator-prey relationship?",
        options: ["Both organisms benefit", "One organism benefits, the other is harmed", "Neither organism benefits", "Organisms compete for resources"],
        correct: 1,
        explanation: "Predation is a relationship where one organism (predator) benefits by hunting another (prey)."
      },
      {
        question: "What is ecological succession?",
        options: ["Food chains", "The predictable sequence of community changes over time", "Population genetics", "Energy flow"],
        correct: 1,
        explanation: "Ecological succession describes how communities change after disturbances (pioneer species → climax community)."
      },
      {
        question: "In the nitrogen cycle, which process converts atmospheric N₂ into usable forms?",
        options: ["Photosynthesis", "Nitrogen fixation", "Decomposition", "Respiration"],
        correct: 1,
        explanation: "Nitrogen fixation by bacteria converts atmospheric N₂ into ammonia (NH₃) and other nitrogen compounds."
      }
    ]
  },

  37: {
    type: "quiz",
    title: "Biogeochemical Cycles",
    description: "Master ecosystem energy flow and nutrient cycles",
    questions: [
      {
        question: "In an ecosystem, what role do decomposers play?",
        options: ["Produce energy from sunlight", "Hunt other organisms", "Break down dead matter and recycle nutrients", "Prevent nutrient loss"],
        correct: 2,
        explanation: "Decomposers (bacteria, fungi) break down dead organisms and return nutrients to the soil."
      },
      {
        question: "The hydrologic cycle involves:",
        options: ["Circulation of water through evaporation, condensation, and precipitation", "Only underground water movement", "Only ocean circulation", "Plant growth"],
        correct: 0,
        explanation: "The water cycle moves water through the environment: evaporation → condensation → precipitation → infiltration."
      },
      {
        question: "The carbon cycle involves:",
        options: ["Only atmospheric CO₂", "Exchange of carbon between atmosphere, biosphere, and geosphere", "Only photosynthesis", "Combustion only"],
        correct: 1,
        explanation: "The carbon cycle includes photosynthesis, respiration, combustion, and geological processes."
      },
      {
        question: "What is the primary source of energy for most ecosystems?",
        options: ["Geothermal energy", "Sunlight captured by producers", "Chemical energy in soil", "Heat from decomposition"],
        correct: 1,
        explanation: "Solar energy is captured by plants (producers) through photosynthesis, supporting all ecosystem energy."
      },
      {
        question: "How does agriculture affect the carbon cycle?",
        options: ["It increases carbon fixation only", "It increases carbon dioxide release through tillage and machinery", "It has no effect", "It only removes carbon"],
        correct: 1,
        explanation: "Agriculture increases atmospheric CO₂ through land disturbance, fossil fuel use, and reduced plant cover."
      }
    ]
  },

  38: {
    type: "quiz",
    title: "Biomes & Conservation",
    description: "Explore Earth's biomes and biodiversity conservation",
    questions: [
      {
        question: "Which biome receives the most rainfall annually?",
        options: ["Savanna", "Desert", "Tropical rainforest", "Tundra"],
        correct: 2,
        explanation: "Tropical rainforests receive 200-400+ cm of rain annually, supporting enormous biodiversity."
      },
      {
        question: "What are the dominant plants in grassland/savanna biomes?",
        options: ["Trees and shrubs", "Grasses and scattered trees", "Mosses and lichens", "Cacti"],
        correct: 1,
        explanation: "Grasslands and savannas are characterized by grasses and herbaceous plants with scattered trees."
      },
      {
        question: "What is the primary threat to tropical rainforests?",
        options: ["Cold temperatures", "Deforestation for agriculture and timber", "Desertification", "Lack of rainfall"],
        correct: 1,
        explanation: "Deforestation (logging, ranching, agriculture) is the main threat to rainforest ecosystems."
      },
      {
        question: "What causes water pollution?",
        options: ["Only industrial waste", "Agricultural runoff, industrial discharge, sewage, and plastics", "Only agricultural chemicals", "Only natural processes"],
        correct: 1,
        explanation: "Water pollution comes from multiple sources: industry, agriculture, sewage, and human waste."
      },
      {
        question: "What is the primary goal of conservation biology?",
        options: ["Studying animal behavior", "Preserving biodiversity and protecting ecosystems", "Managing timber resources", "Hunting wild animals sustainably"],
        correct: 1,
        explanation: "Conservation biology aims to preserve biodiversity and protect ecosystems from extinction and degradation."
      }
    ]
  },

  39: {
    type: "quiz",
    title: "Evolution & Biodiversity",
    description: "Understand speciation, development, and classification",
    questions: [
      {
        question: "How are plants currently contributing to the global carbon cycle?",
        options: ["Reducing it significantly", "Maintaining it through photosynthesis and respiration balance", "Increasing atmospheric CO₂", "Eliminating carbon completely"],
        correct: 1,
        explanation: "Plants maintain the carbon cycle through photosynthesis (removing CO₂) and respiration (releasing CO₂)."
      },
      {
        question: "What is zoology primarily concerned with?",
        options: ["The study of plants", "The scientific study of animals", "Medical treatments", "Geology"],
        correct: 1,
        explanation: "Zoology is the biological study of animals, their structure, behavior, and ecology."
      },
      {
        question: "What is evolutionary developmental biology (evo-devo)?",
        options: ["How organisms develop food sources", "The study of how development and evolution are connected", "Managing evolution", "Plant breeding"],
        correct: 1,
        explanation: "Evo-devo examines how developmental processes change through evolution, explaining morphological diversity."
      },
      {
        question: "Speciation is the process by which:",
        options: ["Organisms adapt to their environment", "New species arise from ancestral populations", "Species go extinct", "Organisms mutate"],
        correct: 1,
        explanation: "Speciation occurs when populations diverge genetically until they can no longer interbreed."
      },
      {
        question: "What is the modern taxonomic hierarchy from broadest to most specific?",
        options: ["Species → Genus → Family → Order → Class → Phylum → Kingdom", "Kingdom → Phylum → Class → Order → Family → Genus → Species", "Phylum → Class → Genus → Species", "Family → Order → Species"],
        correct: 1,
        explanation: "Modern taxonomy uses: Kingdom → Phylum → Class → Order → Family → Genus → Species (Kingdom to Species)."
      }
    ]
  },

  40: {
    type: "quiz",
    title: "Life's History & Future",
    description: "Review evolution, ecology, and conservation challenges",
    questions: [
      {
        question: "What era witnessed the evolution of dinosaurs?",
        options: ["Paleozoic", "Mesozoic", "Cenozoic", "Hadean"],
        correct: 1,
        explanation: "The Mesozoic Era (252-66 million years ago) was the 'Age of Dinosaurs'."
      },
      {
        question: "Why is comparative anatomy important for understanding evolution?",
        options: ["It shows animals' behavior patterns", "It reveals evolutionary relationships through shared structures", "It measures animal size", "It determines lifespan"],
        correct: 1,
        explanation: "Homologous structures in different species indicate common ancestry and evolutionary relationships."
      },
      {
        question: "What is the main difference between artificial and natural selection?",
        options: ["There is no difference", "Natural selection is random; artificial is directed by humans", "Artificial selection is faster", "Both are controlled by nature"],
        correct: 1,
        explanation: "Natural selection operates through environmental pressures; artificial selection is human-directed breeding."
      },
      {
        question: "What major event caused the extinction of most dinosaurs?",
        options: ["Gradual climate change", "A meteor impact 66 million years ago", "Competition with mammals", "Volcanic activity alone"],
        correct: 1,
        explanation: "The K-Pg extinction event (meteor impact) 66 million years ago ended the Mesozoic Era and dinosaur dominance."
      },
      {
        question: "What is the biggest threat to biodiversity today?",
        options: ["Meteor impacts", "Natural climate cycles", "Human activities (habitat loss, pollution, climate change)", "Evolutionary adaptation"],
        correct: 2,
        explanation: "Human-caused habitat destruction, pollution, and climate change are driving current mass extinction."
      }
    ]
  }
};

export default gameQuizzes;
