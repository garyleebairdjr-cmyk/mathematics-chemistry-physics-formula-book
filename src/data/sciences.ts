import type { Chapter } from "./types.ts";
import { L } from "./types.ts";

export const sciences: Chapter[] = [
  {
    slug: "mechanics",
    volume: "physics",
    level: "foundational",
    title: "Classical mechanics",
    minutes: 35,
    summary:
      "Motion under forces: kinematics in one dimension, Newton’s laws, momentum, and circular motion.",
    prereqs: ["algebra", "differential-calculus"],
    ideas: [
      "Kinematics relates position, velocity, and acceleration before any cause is named.",
      "Newton’s second law says net force equals mass times acceleration, when mass is constant.",
      "Momentum is conserved when the net external force is zero.",
      "Uniform circular motion has acceleration toward the center, of size v²/r.",
    ],
    body: [
      "Kinematics is the description of motion. In one dimension with constant acceleration a, the velocity changes linearly with time and the position is a quadratic. These formulas are integrals of a = constant, nothing more. The sign of a is part of the answer: acceleration opposite the velocity is slowing down, even if the number you were given was written as a positive “deceleration.”",
      "Newton’s first law is the statement that a frame with no acceleration exists, and in it a body with no net force moves at constant velocity. The second law, F_net = ma, defines how the net force changes the motion. The third says forces come in pairs: the force of A on B is equal and opposite the force of B on A, and those two forces act on different bodies, so they do not cancel inside a single free-body diagram. Weight near Earth is mg, with g about 9.81 m/s² downward. The normal force is whatever a surface must push to enforce the constraint; it is not automatically mg.",
      "Momentum p = mv is the quantity whose rate of change is the net force. In an isolated system the total momentum is constant, which is how you solve collisions without knowing the messy forces during the crash. Kinetic energy is not similarly conserved in an inelastic collision. Uniform circular motion keeps the speed constant while the direction changes, so there is an acceleration v²/r toward the center, and therefore a net force mv²/r toward the center. That force is not a new kind of force. It is friction, tension, gravity, or some other real force, required to point inward.",
    ],
    formulas: [
      {
        id: "kin-v",
        name: "Constant acceleration, velocity",
        tex: L`v=v_0+at`,
        meaning: "Velocity after time t when acceleration is constant.",
        symbols: [
          { sym: "v₀", means: "Initial velocity" },
          { sym: "a", means: "Constant acceleration" },
          { sym: "t", means: "Elapsed time" },
        ],
      },
      {
        id: "kin-x",
        name: "Constant acceleration, position",
        tex: L`x=x_0+v_0 t+\frac12 at^2`,
        meaning:
          "Position after time t. The quadratic term is the signature of constant acceleration.",
        symbols: [{ sym: "x₀", means: "Initial position" }],
      },
      {
        id: "newton2",
        name: "Newton’s second law",
        tex: L`\mathbf{F}_{\mathrm{net}}=m\mathbf{a}`,
        meaning: "Net force and acceleration are parallel. Mass is the resistance to acceleration.",
        symbols: [
          { sym: "m", means: "Mass" },
          { sym: "F_net", means: "Vector sum of all forces on the body" },
        ],
      },
      {
        id: "momentum",
        name: "Momentum",
        tex: L`\mathbf{p}=m\mathbf{v}`,
        meaning: "Mass times velocity. Conserved, as a vector, in an isolated system.",
        symbols: [{ sym: "p", means: "Momentum, not pressure" }],
      },
      {
        id: "centrip",
        name: "Centripetal acceleration",
        tex: L`a=\frac{v^2}{r}`,
        meaning:
          "Magnitude of the acceleration of uniform circular motion, directed toward the center.",
        symbols: [
          { sym: "v", means: "Speed" },
          { sym: "r", means: "Radius of the circle" },
        ],
      },
      {
        id: "gravity",
        name: "Newton’s law of gravitation",
        tex: L`F=G\frac{m_1 m_2}{r^2}`,
        meaning: "Attractive force between two point masses, along the line joining them.",
        symbols: [
          { sym: "G", means: "6.674×10⁻¹¹ N·m²/kg²" },
          { sym: "r", means: "Distance between centers" },
        ],
      },
    ],
    examples: [
      {
        title: "A car speeding up",
        prompt:
          "A car starts from rest and reaches 20 m/s in 5.0 s at constant acceleration. How far does it go?",
        steps: [
          "a = (20 − 0) / 5 = 4.0 m/s².",
          "x = 0 + 0·5 + ½·4·25 = 50 m.",
          "Check with average velocity: the average of 0 and 20 is 10 m/s, times 5 s is 50 m.",
        ],
        answer: "50 meters.",
      },
      {
        title: "A block on a table",
        prompt:
          "A 2.0 kg block is pulled horizontally by 9.0 N, with 3.0 N of kinetic friction opposing. Find the acceleration.",
        steps: [
          "Net horizontal force: 9.0 − 3.0 = 6.0 N.",
          "a = F/m = 6.0 / 2.0 = 3.0 m/s², in the direction of the pull.",
          "The vertical forces cancel: weight 19.6 N down, normal 19.6 N up. They do not enter the horizontal equation.",
        ],
        answer: "3.0 m/s² in the direction of the pull.",
      },
    ],
    practice: [
      {
        q: "A 0.50 kg ball moving at 4.0 m/s hits and sticks to a 1.5 kg block at rest. How fast do they move together?",
        a: "Momentum: 0.50 × 4.0 + 0 = 2.0 kg·m/s. Total mass 2.0 kg, so v = 1.0 m/s. Kinetic energy is not conserved; this is inelastic.",
      },
      {
        q: "A 1000 kg car takes a level curve of radius 50 m at 10 m/s. What centripetal force is required?",
        a: "F = mv²/r = 1000 × 100 / 50 = 2000 N, supplied by friction, toward the center.",
      },
    ],
    pitfalls: [
      "The third-law pair never acts on the same object. You cannot cancel the Earth’s pull on you against your pull on the Earth inside your own free-body diagram.",
      "Centripetal force is the name of the net inward force, not an extra force you add.",
      "g is an acceleration, about 9.81 m/s². Weight is mg, a force, in newtons.",
    ],
  },
  {
    slug: "energy-waves",
    volume: "physics",
    level: "intermediate",
    title: "Energy, heat, and waves",
    minutes: 35,
    summary:
      "Work and mechanical energy, the ideal gas, heat capacity, and the description of a traveling wave.",
    prereqs: ["mechanics"],
    ideas: [
      "Work by a constant force is force times displacement times the cosine of the angle between them.",
      "Mechanical energy is conserved when the only forces doing work are conservative, such as gravity and springs.",
      "For an ideal gas, PV = nRT, and temperature measures average kinetic energy per molecule.",
      "A traveling wave has speed equal to frequency times wavelength.",
    ],
    body: [
      "Work is energy transferred by a force acting through a displacement. For a constant force, W = F d cos θ. Kinetic energy ½mv² changes by exactly the net work done, which is the work–energy theorem. Potential energy is bookkeeping for conservative forces: gravity near Earth contributes mgh, and an ideal spring contributes ½kx². If friction does work, mechanical energy decreases by that amount and shows up as thermal energy.",
      "An ideal gas is the model in which molecules do not interact except in elastic collisions, and the particles themselves take up no volume. Its equation of state is PV = nRT. At fixed pressure, volume is proportional to temperature; at fixed volume, pressure is. The kelvin scale is the one that makes this proportionality true, with 0 K the extrapolated point of zero pressure. The average translational kinetic energy of a molecule is (3/2) kT, so temperature is a measure of that microscopic energy, not of “how hot it feels.”",
      "A wave carries energy and a pattern, not the medium. For a periodic wave the speed, frequency, and wavelength are tied by v = fλ. On a string the speed is √(T/μ), tension over linear density, which is why tightening a string raises the pitch. Standing waves on a string fixed at both ends fit an integer number of half-wavelengths into the length. Doubling the frequency at fixed speed halves the wavelength.",
    ],
    formulas: [
      {
        id: "work",
        name: "Work by a constant force",
        tex: L`W=Fd\cos\theta`,
        meaning: "Only the component of force along the displacement does work.",
        symbols: [
          { sym: "θ", means: "Angle between force and displacement" },
          { sym: "d", means: "Distance moved" },
        ],
      },
      {
        id: "ke-pe",
        name: "Mechanical energy",
        tex: L`K=\frac12 mv^2,\qquad U_g=mgh,\qquad U_s=\frac12 kx^2`,
        meaning: "Kinetic energy, gravitational potential near Earth, and spring potential.",
        symbols: [
          { sym: "k", means: "Spring constant" },
          { sym: "h", means: "Height, measured from a zero you choose" },
        ],
      },
      {
        id: "ideal-gas",
        name: "Ideal gas law",
        tex: L`PV=nRT`,
        meaning: "Equation of state of an ideal gas. Temperature must be in kelvin.",
        symbols: [
          { sym: "n", means: "Amount of substance in moles" },
          { sym: "R", means: "8.314 J/(mol·K)" },
          { sym: "P, V, T", means: "Pressure, volume, absolute temperature" },
        ],
      },
      {
        id: "heat",
        name: "Sensible heat",
        tex: L`Q=mc\Delta T`,
        meaning: "Heat required to change the temperature of a mass m by ΔT, with no phase change.",
        symbols: [{ sym: "c", means: "Specific heat capacity" }],
      },
      {
        id: "wave-speed",
        name: "Wave speed",
        tex: L`v=f\lambda`,
        meaning: "Frequency times wavelength. Holds for any periodic wave.",
        symbols: [
          { sym: "f", means: "Frequency in cycles per time" },
          { sym: "λ", means: "Wavelength" },
        ],
      },
      {
        id: "string-speed",
        name: "Speed on a string",
        tex: L`v=\sqrt{T/\mu}`,
        meaning: "Wave speed set by tension and mass per length.",
        symbols: [
          { sym: "T", means: "Tension" },
          { sym: "μ", means: "Linear mass density" },
        ],
      },
    ],
    examples: [
      {
        title: "How high does it go?",
        prompt:
          "A 0.20 kg ball is thrown upward at 8.0 m/s. How high does it rise, ignoring air resistance?",
        steps: [
          "Take potential zero at the release point. Initial energy is all kinetic: ½(0.20)(64) = 6.4 J.",
          "At the top, velocity is 0, so 6.4 = mgh = 0.20 × 9.81 × h.",
          "h = 6.4 / 1.962 ≈ 3.26 m.",
        ],
        answer: "About 3.3 m. Using v² = v₀² − 2gh gives the same number.",
      },
      {
        title: "A gas compressed at constant temperature",
        prompt: "Two moles of ideal gas at 300 K occupy 0.050 m³. What is the pressure?",
        steps: [
          "P = nRT / V = (2)(8.314)(300) / 0.050.",
          "Numerator: 4988.4. Divide by 0.050: 99,768 Pa.",
        ],
        answer: "About 1.00 × 10⁵ Pa, essentially one atmosphere. A useful sanity check.",
      },
    ],
    practice: [
      {
        q: "A wave on a lake has wavelength 2.0 m and frequency 0.50 Hz. What is its speed?",
        a: "v = fλ = 0.50 × 2.0 = 1.0 m/s.",
      },
      {
        q: "How much heat raises 0.50 kg of water by 10 K? Take c = 4184 J/(kg·K).",
        a: "Q = 0.50 × 4184 × 10 = 20,920 J, about 21 kJ.",
      },
    ],
    pitfalls: [
      "The ideal gas law needs absolute temperature. Celsius will give nonsense, including negative pressures.",
      "Potential energy depends on the zero you chose. Differences of potential energy do not.",
      "Frequency and angular frequency differ by 2π. In v = fλ, f is in hertz, not radians per second.",
    ],
  },
  {
    slug: "electromagnetism",
    volume: "physics",
    level: "advanced",
    title: "Electromagnetism and optics",
    minutes: 35,
    summary:
      "Coulomb’s law, circuits, the magnetic force on a charge, and the wave picture of light.",
    prereqs: ["mechanics", "energy-waves"],
    ideas: [
      "Electric force falls as 1/r² and is proportional to both charges.",
      "In a steady circuit, current is the same through series elements, and voltage adds around a loop.",
      "A charge moving in a magnetic field feels a force perpendicular to both its velocity and the field.",
      "Light in vacuum travels at c, and that speed is fixed by the electric and magnetic constants.",
    ],
    body: [
      "Coulomb’s law has the same shape as Newton’s gravitation, with charges in place of masses and a constant k = 1/(4πε₀) about 8.99 × 10⁹ N·m²/C². Like charges repel. The electric field is the force per unit charge, so the field of a point charge is kq/r². Electric potential is potential energy per unit charge; for a point charge it is kq/r, and the field points from high potential toward low potential for a positive test charge. Voltage, in circuit language, is a potential difference.",
      "Ohm’s law V = IR is a material relation, true for ohmic resistors, not a law on the level of Coulomb. Power dissipated in a resistor is IV, which is also I²R and V²/R. In series, resistances add and the current is common. In parallel, the currents add and the voltage is common, so the reciprocals of resistance add. Kirchhoff’s loop rule is the statement that electrostatic potential is single-valued: the sum of voltage changes around a closed loop is zero.",
      "A charge q moving at velocity v in a magnetic field B feels F = q v × B, magnitude qvB sin θ, direction given by the right-hand rule, and zero when v is parallel to B. Magnetic forces do no work, because they are always perpendicular to the velocity; they change direction, not speed. Changing magnetic flux induces an emf equal to minus the rate of change of flux, which is Faraday’s law, and the minus sign is Lenz’s law: the induced current opposes the change. Maxwell’s correction to Ampère’s law makes the whole set predict electromagnetic waves that travel at c = 1/√(μ₀ε₀).",
    ],
    formulas: [
      {
        id: "coulomb",
        name: "Coulomb’s law",
        tex: L`F=k\frac{|q_1 q_2|}{r^2},\quad k=\frac{1}{4\pi\varepsilon_0}`,
        meaning:
          "Magnitude of the force between two point charges. Direction is along the line joining them.",
        symbols: [
          { sym: "k", means: "8.99×10⁹ N·m²/C²" },
          { sym: "q", means: "Charge, in coulombs" },
        ],
      },
      {
        id: "ohm",
        name: "Ohm’s law and power",
        tex: L`V=IR,\qquad P=IV`,
        meaning: "Voltage across an ohmic resistor, and the power it dissipates.",
        symbols: [
          { sym: "R", means: "Resistance, in ohms" },
          { sym: "I", means: "Current, in amperes" },
        ],
      },
      {
        id: "series-parallel",
        name: "Resistors",
        tex: L`R_{\mathrm{s}}=R_1+R_2,\qquad \frac{1}{R_{\mathrm{p}}}=\frac{1}{R_1}+\frac{1}{R_2}`,
        meaning: "Series adds resistance. Parallel adds conductance.",
        symbols: [{ sym: "R_s, R_p", means: "Equivalent series and parallel resistances" }],
      },
      {
        id: "lorentz-b",
        name: "Magnetic force",
        tex: L`\mathbf{F}=q\,\mathbf{v}\times\mathbf{B}`,
        meaning:
          "Force on a moving charge. Magnitude qvB sin θ, direction perpendicular to v and B.",
        symbols: [{ sym: "B", means: "Magnetic field, in tesla" }],
      },
      {
        id: "faraday",
        name: "Faraday’s law",
        tex: L`\mathcal{E}=-\frac{d\Phi_B}{dt}`,
        meaning: "Induced emf equals the negative rate of change of magnetic flux.",
        symbols: [
          { sym: "Φ_B", means: "Magnetic flux, field times area when uniform and perpendicular" },
        ],
      },
      {
        id: "snell",
        name: "Snell’s law",
        tex: L`n_1\sin\theta_1=n_2\sin\theta_2`,
        meaning:
          "Refraction at an interface. Angles are measured from the normal, not from the surface.",
        symbols: [{ sym: "n", means: "Index of refraction, c divided by the speed in the medium" }],
      },
    ],
    examples: [
      {
        title: "Two charges",
        prompt: "Find the force between two charges of +2.0 μC separated by 0.10 m.",
        steps: [
          "F = k q² / r², since the charges are equal.",
          "q = 2.0×10⁻⁶. q² = 4.0×10⁻¹². r² = 0.010.",
          "F = (8.99×10⁹)(4.0×10⁻¹²) / 0.010 = 3.60 N.",
        ],
        answer: "3.6 N, repulsive.",
      },
      {
        title: "A pair of resistors",
        prompt:
          "A 6.0 Ω and a 3.0 Ω resistor are in parallel across a 12 V battery. What is the total current?",
        steps: [
          "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 1/2, so R = 2.0 Ω.",
          "I = V/R = 12 / 2 = 6.0 A.",
          "Check by branches: 12/6 = 2 A and 12/3 = 4 A, total 6 A.",
        ],
        answer: "6.0 A drawn from the battery.",
      },
    ],
    practice: [
      {
        q: "A proton (q = 1.6×10⁻¹⁹ C) moves at 2.0×10⁶ m/s perpendicular to a 0.50 T field. Find the force magnitude.",
        a: "F = qvB = (1.6×10⁻¹⁹)(2.0×10⁶)(0.50) = 1.6×10⁻¹³ N.",
      },
      {
        q: "Light goes from air (n = 1) into glass (n = 1.5) at 30° to the normal. What is the refracted angle?",
        a: "sin θ₂ = sin 30° / 1.5 = 0.5 / 1.5 = 0.333, so θ₂ ≈ 19.5°.",
      },
    ],
    pitfalls: [
      "Angles in Snell’s law are from the normal. Measuring from the surface will not satisfy the formula.",
      "Series and parallel formulas assume ideal resistors and the obvious two-terminal connection. A bridge circuit is neither.",
      "Magnetic force does not change the speed of a charge. If you need the charge to speed up, you need an electric field.",
    ],
  },
  {
    slug: "modern-physics",
    volume: "physics",
    level: "frontier",
    title: "Relativity and quantum ideas",
    minutes: 30,
    summary:
      "The two twentieth-century corrections: c is a speed limit built into spacetime, and energy and matter are quantized.",
    prereqs: ["energy-waves", "electromagnetism"],
    ideas: [
      "The speed of light in vacuum is the same for every inertial observer.",
      "Moving clocks run slow by the factor γ, and E = γmc² includes the rest energy mc².",
      "Light of frequency f arrives in quanta of energy hf.",
      "Matter waves have wavelength h/p, and position and momentum cannot both be sharp.",
    ],
    body: [
      "Special relativity starts from one experimental fact: every inertial observer measures the same speed of light, c = 2.998 × 10⁸ m/s. The consequences are kinematic. Clocks that move relative to you tick slowly, lengths contract along the direction of motion, and simultaneity depends on the observer. The factor that appears everywhere is γ = 1/√(1 − v²/c²), which is about 1 at everyday speeds and grows without bound as v approaches c. Nothing with mass reaches c, because γ, and therefore the energy, would have to become infinite.",
      "Energy and momentum combine into E² = (pc)² + (mc²)². At rest, p = 0 and E = mc². That rest energy is not a metaphor; it is the energy available if the mass disappears, as in matter–antimatter annihilation, and the deficit that appears as binding energy when a nucleus is lighter than its parts. For slow motion the total energy is mc² + ½mv² plus higher orders, so Newtonian kinetic energy is the first correction.",
      "Quantum theory starts from a different fact: the energy of light of frequency f comes in amounts hf, where h is Planck’s constant, 6.626 × 10⁻³⁴ J·s. The photoelectric effect ejects electrons only when hf exceeds a work function φ, and extra frequency becomes kinetic energy, not a waiting time. De Broglie assigned a wavelength h/p to any particle. The Heisenberg relation Δx Δp ≥ ℏ/2 says a state sharply localized in position is broad in momentum. The Schrödinger equation is the dynamical law whose standing waves are the orbitals of chemistry.",
    ],
    formulas: [
      {
        id: "gamma",
        name: "Lorentz factor",
        tex: L`\gamma=\frac{1}{\sqrt{1-v^2/c^2}}`,
        meaning:
          "The factor by which a moving clock runs slow, and by which total energy exceeds rest energy.",
        symbols: [
          { sym: "v", means: "Speed relative to the observer" },
          { sym: "c", means: "2.998×10⁸ m/s" },
        ],
      },
      {
        id: "time-dilation",
        name: "Time dilation",
        tex: L`\Delta t=\gamma\,\Delta t_0`,
        meaning:
          "A clock measures Δt₀ between two events at the same place in its frame. Everyone else measures a longer interval.",
        symbols: [{ sym: "Δt₀", means: "Proper time" }],
      },
      {
        id: "energy-momentum",
        name: "Energy–momentum",
        tex: L`E^2=(pc)^2+(mc^2)^2`,
        meaning: "The relativistic relation. At rest it is E = mc². For light, m = 0 and E = pc.",
        symbols: [
          { sym: "m", means: "Rest mass" },
          { sym: "p", means: "Relativistic momentum" },
        ],
      },
      {
        id: "photon",
        name: "Photon energy",
        tex: L`E=hf=\frac{hc}{\lambda}`,
        meaning: "Energy of one quantum of light.",
        symbols: [
          { sym: "h", means: "6.626×10⁻³⁴ J·s" },
          { sym: "f, λ", means: "Frequency and wavelength" },
        ],
      },
      {
        id: "photoelectric",
        name: "Photoelectric effect",
        tex: L`K_{\max}=hf-\phi`,
        meaning:
          "Maximum kinetic energy of an ejected electron. Nothing is ejected if hf is below the work function φ.",
        symbols: [{ sym: "φ", means: "Work function of the metal" }],
      },
      {
        id: "debroglie",
        name: "De Broglie wavelength",
        tex: L`\lambda=\frac{h}{p}`,
        meaning: "Wavelength associated with a particle of momentum p.",
        symbols: [{ sym: "p", means: "Momentum" }],
      },
    ],
    examples: [
      {
        title: "A mildly relativistic clock",
        prompt:
          "A spacecraft passes at v = 0.6c. How long do you measure for a 1.00 s tick of its clock?",
        steps: [
          "v/c = 0.6, so v²/c² = 0.36, and 1 − v²/c² = 0.64.",
          "√0.64 = 0.80, so γ = 1/0.80 = 1.25.",
          "Δt = 1.25 × 1.00 s = 1.25 s.",
        ],
        answer: "1.25 seconds. The moving clock runs slow, as you see it.",
      },
      {
        title: "A photon’s energy",
        prompt:
          "A photon has wavelength 500 nm. What is its energy in joules and in electron-volts?",
        steps: [
          "E = hc/λ. hc ≈ (6.626×10⁻³⁴)(2.998×10⁸) ≈ 1.986×10⁻²⁵.",
          "λ = 5.00×10⁻⁷ m. E ≈ 3.97×10⁻¹⁹ J.",
          "Divide by 1.602×10⁻¹⁹: about 2.48 eV.",
        ],
        answer:
          "About 3.97×10⁻¹⁹ J, or 2.48 eV. Visible light sits near that scale, which is why chemistry and vision live in the electron-volt range.",
      },
    ],
    practice: [
      {
        q: "What is the rest energy of an electron? Mass 9.11×10⁻³¹ kg.",
        a: "E = mc² ≈ (9.11×10⁻³¹)(8.99×10¹⁶) ≈ 8.19×10⁻¹⁴ J ≈ 511 keV. The famous half-MeV.",
      },
      {
        q: "A metal has work function 2.0 eV. What is the maximum kinetic energy of electrons ejected by 3.5 eV photons?",
        a: "K_max = 3.5 − 2.0 = 1.5 eV. Brighter light ejects more electrons, not faster ones.",
      },
    ],
    pitfalls: [
      "γ uses v²/c² under the square root. At 0.6c it is 1.25, not a dramatic number. Everyday speeds give γ indistinguishable from 1.",
      "E = mc² is the rest energy. A moving particle has more. Photons have energy and zero rest mass.",
      "The photoelectric effect is not explained by a brighter wave delivering energy faster. Below the threshold frequency, no amount of waiting ejects an electron.",
    ],
  },
  {
    slug: "quantities-gases",
    volume: "chemistry",
    level: "foundational",
    title: "Amounts, stoichiometry, and gases",
    minutes: 30,
    summary:
      "The mole, balancing reactions, concentration, and the gas laws chemists actually compute with.",
    prereqs: ["arithmetic", "algebra"],
    ideas: [
      "The mole is a count: 6.022×10²³ particles. Molar mass converts between grams and moles.",
      "A balanced equation is a ratio of moles, not of grams.",
      "Molarity is moles of solute per liter of solution.",
      "The ideal gas law closes the set of gas computations once any three of P, V, n, T are known.",
    ],
    body: [
      "Chemistry counts particles by the mole because the particles are too small and too numerous to count directly. One mole is Avogadro’s number of things, 6.022×10²³. The molar mass, in grams per mole, is numerically the same as the atomic or molecular mass in unified mass units. So 18.02 g of water is one mole of water, and it contains one mole of oxygen atoms and two moles of hydrogen atoms. That last sentence is stoichiometry already: the subscripts are mole ratios.",
      "A balanced chemical equation equates atoms on both sides, and therefore equates moles of each substance in the ratios of the coefficients. If you are given grams, convert to moles, use the coefficient ratio, and convert back. The reactant that runs out first is the limiting reactant; the others are in excess. Percent yield compares what you isolated to what the limiting reactant could have produced. Theoretical yield is a mole calculation, not a hope.",
      "Concentration in molarity is n/V, with V in liters of solution, not liters of solvent. Dilution at constant amount of solute is M₁V₁ = M₂V₂. Gases add the ideal gas law PV = nRT, with T in kelvin. At STP of 1 bar and 273.15 K, one mole of ideal gas occupies about 22.7 L; the older 22.4 L figure belongs to 1 atm. Dalton’s law says partial pressures add, and each gas behaves as if it occupied the volume alone.",
    ],
    formulas: [
      {
        id: "moles",
        name: "Moles from mass",
        tex: L`n=\frac{m}{M}`,
        meaning: "Divide the mass by the molar mass. Keep the units: grams over grams per mole.",
        symbols: [
          { sym: "m", means: "Mass" },
          { sym: "M", means: "Molar mass" },
        ],
      },
      {
        id: "molarity",
        name: "Molarity",
        tex: L`c=\frac{n}{V}`,
        meaning: "Moles of solute per liter of solution.",
        symbols: [{ sym: "V", means: "Volume of the solution, in liters" }],
      },
      {
        id: "dilution",
        name: "Dilution",
        tex: L`M_1 V_1=M_2 V_2`,
        meaning: "Amount of solute is unchanged when you add solvent.",
        symbols: [
          { sym: "M", means: "Molarity, not molar mass — a collision of symbols you must watch" },
        ],
      },
      {
        id: "gas-law",
        name: "Ideal gas law",
        tex: L`PV=nRT`,
        meaning: "The working equation for an ideal gas. T in kelvin.",
        symbols: [{ sym: "R", means: "0.082057 L·atm/(mol·K), or 8.314 J/(mol·K)" }],
      },
      {
        id: "dalton",
        name: "Dalton’s law",
        tex: L`P=\sum_i P_i,\qquad P_i=x_i P`,
        meaning:
          "Total pressure is the sum of partial pressures. Each partial pressure is the mole fraction times the total.",
        symbols: [{ sym: "xᵢ", means: "Mole fraction of gas i" }],
      },
    ],
    examples: [
      {
        title: "From grams to concentration",
        prompt:
          "Dissolve 5.00 g of NaCl (molar mass 58.44 g/mol) in water and dilute to 250.0 mL. What is the molarity?",
        steps: [
          "n = 5.00 / 58.44 = 0.08556 mol.",
          "V = 0.2500 L.",
          "c = 0.08556 / 0.2500 = 0.342 M.",
        ],
        answer: "0.342 mol/L.",
      },
      {
        title: "A limiting reactant, in outline",
        prompt:
          "Hydrogen burns as 2 H₂ + O₂ → 2 H₂O. You have 4.0 mol of H₂ and 1.5 mol of O₂. Which runs out, and how much water forms?",
        steps: [
          "The equation wants 2 mol H₂ per 1 mol O₂.",
          "1.5 mol O₂ would require 3.0 mol H₂. You have 4.0, so O₂ runs out.",
          "Water formed equals twice the O₂ consumed, from the coefficients: 3.0 mol.",
        ],
        answer:
          "Oxygen is limiting. You get 3.0 mol of water, and 1.0 mol of hydrogen is left over.",
      },
    ],
    practice: [
      {
        q: "What volume does 0.25 mol of ideal gas occupy at 1.00 atm and 298 K? Use R = 0.0821 L·atm/(mol·K).",
        a: "V = nRT/P = (0.25)(0.0821)(298) / 1 ≈ 6.12 L.",
      },
      {
        q: "You dilute 10.0 mL of 2.00 M HCl to 250 mL. What is the new molarity?",
        a: "M₂ = M₁V₁/V₂ = (2.00)(10.0) / 250 = 0.0800 M. Volumes may stay in mL because they appear as a ratio.",
      },
    ],
    pitfalls: [
      "Coefficients are mole ratios, not gram ratios. Water is not “2 grams of hydrogen per 16 of oxygen” until you convert.",
      "Molarity uses liters of solution. Adding 250 mL of water to a solid is not automatically a 250 mL solution; the solid has volume too. Volumetric flasks exist for this reason.",
      "R has several values. If P is in atm and V in liters, use 0.0821. If you want joules, use 8.314 and measure pressure in pascals, volume in cubic meters.",
    ],
  },
  {
    slug: "equilibrium-energy",
    volume: "chemistry",
    level: "intermediate",
    title: "Equilibrium, energy, and rates",
    minutes: 35,
    summary:
      "The equilibrium constant, the free-energy test for spontaneity, and the rate laws that say how fast you get there.",
    prereqs: ["quantities-gases", "functions"],
    ideas: [
      "Equilibrium is a balance of rates, not a situation in which nothing happens.",
      "K is a ratio of concentrations (or pressures) raised to stoichiometric powers. Large K favors products.",
      "ΔG < 0 means the forward direction is spontaneous as written. ΔG° = −RT ln K connects that to the equilibrium constant.",
      "A rate law is experimental. The orders are not the stoichiometric coefficients, unless you have shown they are.",
    ],
    body: [
      "A reaction at equilibrium has not stopped. The forward and reverse rates are equal, so concentrations stay constant. The equilibrium constant K expresses that condition. For aA + bB ⇌ cC + dD, K is [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ, with each concentration raised to its coefficient. Pure solids and the solvent in a dilute solution are omitted, because their activities are essentially 1. K depends on temperature and not, directly, on how you mix the starting materials. The reaction quotient Q has the same form using the current concentrations. If Q < K the reaction runs forward; if Q > K, backward.",
      "Enthalpy H is the heat of reaction at constant pressure. Entropy S measures the number of ways the energy can be arranged. The quantity that actually decides spontaneity at constant temperature and pressure is the Gibbs free energy, G = H − TS, and the change ΔG = ΔH − TΔS. Negative ΔG means the forward direction increases the entropy of the universe, which is the second law restated in a convenient potential. The standard free-energy change is tied to the equilibrium constant by ΔG° = −RT ln K. A reaction can be spontaneous and still immeasurably slow. Thermodynamics does not mention time.",
      "Kinetics does. A rate law such as rate = k[A]ᵐ[B]ⁿ is determined by experiment. The exponents are the orders, and their sum is the overall order. For a first-order process, concentration decays as e^{−kt} and the half-life is ln 2 / k, independent of how much you started with. Temperature dependence of k is summarized by the Arrhenius equation: a plot of ln k against 1/T is a straight line whose slope is −Eₐ/R. A catalyst lowers the activation energy and is not consumed. It does not change K.",
    ],
    formulas: [
      {
        id: "k-eq",
        name: "Equilibrium constant",
        tex: L`K=\frac{[C]^c[D]^d}{[A]^a[B]^b}`,
        meaning:
          "For aA + bB ⇌ cC + dD. Concentrations at equilibrium, each to the power of its coefficient.",
        symbols: [{ sym: "[ ]", means: "Concentration, or partial pressure in Kₚ" }],
      },
      {
        id: "gibbs",
        name: "Gibbs free energy",
        tex: L`\Delta G=\Delta H-T\Delta S`,
        meaning:
          "The test for spontaneity at constant T and P. Negative means spontaneous in the forward direction.",
        symbols: [
          { sym: "ΔH", means: "Enthalpy change" },
          { sym: "ΔS", means: "Entropy change of the system" },
          { sym: "T", means: "Absolute temperature" },
        ],
      },
      {
        id: "dg-k",
        name: "Free energy and K",
        tex: L`\Delta G^\circ=-RT\ln K`,
        meaning: "The standard free-energy change fixes the equilibrium constant, and conversely.",
        symbols: [
          { sym: "ΔG°", means: "Standard free-energy change" },
          { sym: "K", means: "The thermodynamic equilibrium constant" },
        ],
      },
      {
        id: "first-order",
        name: "First-order decay",
        tex: L`[A]=[A]_0 e^{-kt},\qquad t_{1/2}=\frac{\ln 2}{k}`,
        meaning:
          "Concentration falls exponentially. The half-life does not depend on the starting amount.",
        symbols: [
          { sym: "k", means: "Rate constant" },
          { sym: "t₁/₂", means: "Half-life" },
        ],
      },
      {
        id: "arrhenius",
        name: "Arrhenius equation",
        tex: L`k=Ae^{-E_a/RT}`,
        meaning: "Rate constants grow with temperature. Eₐ is the activation energy.",
        symbols: [
          { sym: "A", means: "Pre-exponential factor" },
          { sym: "Eₐ", means: "Activation energy" },
        ],
      },
    ],
    examples: [
      {
        title: "Reading Q against K",
        prompt:
          "For H₂ + I₂ ⇌ 2 HI, K = 50 at the temperature of interest. You mix equal concentrations [H₂] = [I₂] = [HI] = 0.10 M. Which way does the reaction go?",
        steps: [
          "Q = [HI]² / ([H₂][I₂]) = (0.10)² / (0.10 × 0.10) = 1.",
          "Q = 1 and K = 50, so Q < K.",
          "The reaction runs forward, making more HI, until Q rises to 50.",
        ],
        answer: "Forward. Products are under-represented relative to equilibrium.",
      },
      {
        title: "A half-life",
        prompt:
          "A first-order decomposition has k = 0.020 per minute. What fraction remains after 1.0 hour?",
        steps: [
          "t = 60 min. kt = 0.020 × 60 = 1.20.",
          "Fraction left: e^{−1.20} ≈ 0.301.",
          "Half-life is 0.693/0.020 = 34.7 min, so 60 min is a bit under two half-lives, and (1/2)² = 0.25, close to 0.30.",
        ],
        answer: "About 30% remains.",
      },
    ],
    practice: [
      {
        q: "ΔH = −40 kJ/mol and ΔS = −80 J/(mol·K). At what temperature does ΔG change sign?",
        a: "ΔG = 0 when ΔH = TΔS, so T = 40000 / 80 = 500 K. Below 500 K the reaction is spontaneous (both terms considered with consistent units); above it, the −TΔS term dominates and ΔG is positive. This is an enthalpy-driven reaction opposed by entropy.",
      },
      {
        q: "If K = 1, what is ΔG°?",
        a: "ln 1 = 0, so ΔG° = 0. Products and reactants are equally favored in the standard sense; the equilibrium composition still depends on the stoichiometry.",
      },
    ],
    pitfalls: [
      "K has no unit in the thermodynamic definition because each concentration is divided by a standard concentration. In beginner calculations the units are often carried and then quietly dropped. Be consistent.",
      "A large K does not mean a fast reaction. Diamond turning into graphite is spontaneous and extraordinarily slow.",
      "Orders in a rate law are not the coefficients in the balanced equation, unless the reaction is elementary and you have said so.",
    ],
  },
  {
    slug: "acids-electrochemistry",
    volume: "chemistry",
    level: "advanced",
    title: "Acids, bases, and electrochemistry",
    minutes: 30,
    summary:
      "pH, weak-acid equilibria, the Henderson–Hasselbalch equation, and the voltage of an electrochemical cell.",
    prereqs: ["equilibrium-energy"],
    ideas: [
      "pH is the negative log of the hydrogen-ion activity. In dilute water it is about −log[H⁺].",
      "A weak acid’s dissociation is an equilibrium with constant Kₐ. Strong acids are treated as fully dissociated.",
      "A buffer resists pH change. Its pH is set by the pKₐ and the ratio of conjugate base to acid.",
      "Cell voltage is a free-energy measurement: ΔG = −nFE.",
    ],
    body: [
      "Water autoionizes: H₂O ⇌ H⁺ + OH⁻, with K_w = [H⁺][OH⁻] = 1.0×10⁻¹⁴ at 25 °C. In pure water each ion is 1.0×10⁻⁷ M and the pH is 7. Acids raise [H⁺] and, because the product is fixed, lower [OH⁻]. A strong acid such as HCl is treated as fully dissociated, so 0.010 M HCl has pH 2.00. A weak acid is not. You solve the equilibrium Kₐ = [H⁺][A⁻]/[HA], often with the approximation that x is small compared with the initial concentration, and you check that approximation afterward.",
      "A buffer is a weak acid and its conjugate base, both present in comparable amounts. Adding a little strong acid converts some base into the weak acid; adding a little strong base does the reverse. The pH barely moves. The Henderson–Hasselbalch equation reads the equilibrium in log form: pH = pKₐ + log([A⁻]/[HA]). When the two concentrations are equal, pH = pKₐ, which is the point where the buffer works best.",
      "An electrochemical cell runs a redox reaction in two places joined by a wire and a salt bridge. The standard cell potential is E°_cathode − E°_anode, using reduction potentials for both and subtracting. A positive E° means a spontaneous reaction as written, under standard conditions. The free-energy connection is ΔG = −nFE, so a positive voltage is a negative free-energy change. The Nernst equation corrects the voltage for concentrations that are not standard. Electrolysis is the same apparatus run backwards by an external voltage.",
    ],
    formulas: [
      {
        id: "ph",
        name: "pH",
        tex: L`\mathrm{pH}=-\log_{10}[H^+],\qquad [H^+][OH^-]=K_w`,
        meaning: "At 25 °C, K_w = 1.0×10⁻¹⁴ and a neutral solution has pH 7.",
        symbols: [{ sym: "[H⁺]", means: "Hydrogen-ion concentration in mol/L" }],
      },
      {
        id: "ka",
        name: "Acid dissociation",
        tex: L`K_a=\frac{[H^+][A^-]}{[HA]}`,
        meaning: "Equilibrium constant for HA ⇌ H⁺ + A⁻. Larger Kₐ means a stronger weak acid.",
        symbols: [{ sym: "pKₐ", means: "−log Kₐ" }],
      },
      {
        id: "henderson",
        name: "Henderson–Hasselbalch",
        tex: L`\mathrm{pH}=\mathrm{p}K_a+\log_{10}\frac{[A^-]}{[HA]}`,
        meaning: "pH of a buffer. The ratio is conjugate base over weak acid.",
        symbols: [{ sym: "[A⁻]/[HA]", means: "Base-to-acid ratio" }],
      },
      {
        id: "cell-potential",
        name: "Standard cell potential",
        tex: L`E^\circ_{\mathrm{cell}}=E^\circ_{\mathrm{cathode}}-E^\circ_{\mathrm{anode}}`,
        meaning:
          "Both potentials are reduction potentials. The anode is the electrode where oxidation occurs.",
        symbols: [{ sym: "E°", means: "Standard reduction potential" }],
      },
      {
        id: "faraday-energy",
        name: "Free energy of a cell",
        tex: L`\Delta G=-nFE`,
        meaning:
          "Voltage and free energy describe the same reaction. F is the charge of one mole of electrons.",
        symbols: [
          { sym: "n", means: "Moles of electrons transferred" },
          { sym: "F", means: "Faraday constant, 96485 C/mol" },
        ],
      },
      {
        id: "nernst",
        name: "Nernst equation",
        tex: L`E=E^\circ-\frac{RT}{nF}\ln Q`,
        meaning:
          "Cell voltage at nonstandard concentrations. At 25 °C the prefactor is about (0.059 V)/n when written with log base 10.",
        symbols: [{ sym: "Q", means: "Reaction quotient" }],
      },
    ],
    examples: [
      {
        title: "A strong acid",
        prompt: "What is the pH of 0.010 M HCl?",
        steps: [
          "HCl is strong, so [H⁺] ≈ 0.010 M.",
          "pH = −log(0.010) = 2.00.",
          "Check [OH⁻] = 10⁻¹⁴ / 0.010 = 10⁻¹², negligible as a correction to [H⁺].",
        ],
        answer: "pH 2.00.",
      },
      {
        title: "A buffer at equal concentrations",
        prompt:
          "Acetic acid has pKₐ = 4.76. What is the pH of a buffer with [acetate] = [acetic acid] = 0.10 M? What if you then double the acetate?",
        steps: [
          "When the ratio is 1, log 1 = 0, so pH = 4.76.",
          "Doubling acetate makes the ratio 2.",
          "log₁₀ 2 ≈ 0.30, so pH ≈ 5.06.",
        ],
        answer: "4.76, then about 5.06. Tenfold changes in the ratio move the pH by one unit.",
      },
    ],
    practice: [
      {
        q: "A cell has E° = 0.46 V and transfers 2 electrons. Estimate ΔG°.",
        a: "ΔG° = −nFE° = −2 × 96485 × 0.46 ≈ −8.9×10⁴ J/mol, about −89 kJ/mol. Spontaneous under standard conditions.",
      },
      {
        q: "The pH is 3.50. What is [H⁺]?",
        a: "[H⁺] = 10^(−3.50) = 3.16×10⁻⁴ M.",
      },
    ],
    pitfalls: [
      "Henderson–Hasselbalch wants base over acid. Inverting the ratio changes the sign of the log and gives the wrong side of the pKₐ.",
      "Strong acids do not have a meaningful Kₐ in the beginner treatment. Do not set up an ICE table for 0.01 M HCl.",
      "The anode is where oxidation happens, which is not always the electrode drawn on the left. The sign of E° follows the chemistry, not the picture.",
    ],
  },
  {
    slug: "populations-genetics",
    volume: "biology",
    level: "intermediate",
    title: "Populations and genetics",
    minutes: 30,
    summary:
      "Exponential and logistic growth, and the Hardy–Weinberg accounting of alleles in a population that is not evolving.",
    prereqs: ["functions", "probability", "differential-equations"],
    ideas: [
      "Unchecked growth is exponential. Limits turn it into a logistic curve that levels off at a carrying capacity.",
      "Hardy–Weinberg is a null model: if nothing interesting is happening, genotype frequencies are p², 2pq, and q².",
      "Departure from those frequencies is evidence that selection, drift, mating, mutation, or migration is at work.",
      "Recessive diseases hide in heterozygotes. The carrier frequency is much larger than the disease frequency.",
    ],
    body: [
      "A population growing by a constant per-capita rate r satisfies dN/dt = rN, with solution N = N₀ e^{rt}. That is the growth of bacteria in fresh medium, and of any population far below the resources that will eventually limit it. The logistic equation puts the limit in: dN/dt = rN(1 − N/K). Growth is fastest at N = K/2 and stops at the carrying capacity K. Real populations overshoot, oscillate, and get eaten; the logistic is the first honest correction to pure exponential growth, not a portrait of an ecosystem.",
      "Hardy–Weinberg starts from two alleles, A and a, with frequencies p and q, and p + q = 1. If mating is random and no selection, mutation, migration, or drift is changing the frequencies, the next generation is p² of AA, 2pq of Aa, and q² of aa. The useful move is usually backwards. You observe the recessive phenotype frequency q², take a square root to get q, and then the carrier frequency is 2pq. For a rare recessive, q is small, p is near 1, and carriers outnumber affected individuals by about 2/q.",
      "The assumptions are the point of the model. A statistically significant excess of homozygotes suggests inbreeding or a hidden population split (the Wahlund effect). A persistent excess of heterozygotes suggests balancing selection. Genetic drift is the sampling error of finite populations; its strength is about 1/(2N) per generation for the variance in allele frequency, which is why small populations lose variation. None of these tests require you to believe that a natural population is actually at equilibrium. They require you to know what equilibrium would have looked like.",
    ],
    formulas: [
      {
        id: "exponential-pop",
        name: "Exponential growth",
        tex: L`N=N_0 e^{rt}`,
        meaning: "Constant per-capita growth. Doubling time is ln 2 / r.",
        symbols: [
          { sym: "N₀", means: "Population at t = 0" },
          { sym: "r", means: "Per-capita growth rate" },
        ],
      },
      {
        id: "logistic",
        name: "Logistic growth",
        tex: L`\frac{dN}{dt}=rN\left(1-\frac{N}{K}\right)`,
        meaning: "Per-capita growth shrinks linearly as N approaches K.",
        symbols: [{ sym: "K", means: "Carrying capacity" }],
      },
      {
        id: "hardy",
        name: "Hardy–Weinberg",
        tex: L`p+q=1,\qquad p^2+2pq+q^2=1`,
        meaning:
          "Allele frequencies, and the genotype frequencies AA, Aa, aa under the null assumptions.",
        symbols: [{ sym: "p, q", means: "Frequencies of alleles A and a" }],
      },
      {
        id: "carriers",
        name: "Carrier frequency",
        tex: L`2pq=2q(1-q)`,
        meaning: "Frequency of heterozygotes. For a rare recessive, about 2√(disease frequency).",
        symbols: [{ sym: "q²", means: "Frequency of the recessive genotype" }],
      },
    ],
    examples: [
      {
        title: "Where logistic growth is fastest",
        prompt:
          "A population has r = 0.4 per year and K = 1000. It is currently 200. What is dN/dt, and at what size would growth be fastest?",
        steps: [
          "dN/dt = 0.4 × 200 × (1 − 0.2) = 80 × 0.8 = 64 individuals per year.",
          "The factor N(1 − N/K) is a parabola peaking at N = K/2.",
          "Fastest growth at 500 individuals.",
        ],
        answer:
          "64 per year now. The maximum rate occurs at N = 500, not when the population is largest.",
      },
      {
        title: "A rare recessive",
        prompt:
          "A recessive condition appears in 1 in 10,000 births. Estimate the carrier frequency, assuming Hardy–Weinberg.",
        steps: [
          "q² = 1/10000, so q = 1/100 = 0.01.",
          "p = 0.99.",
          "2pq = 2(0.99)(0.01) = 0.0198, about 1 in 50.",
        ],
        answer:
          "About 2% of people are carriers, roughly 200 times the frequency of affected births.",
      },
    ],
    practice: [
      {
        q: "A population of 500 grows exponentially at r = 0.1 per year. Estimate the population in 10 years.",
        a: "N = 500 e^{1} ≈ 500 × 2.718 = 1360.",
      },
      {
        q: "Allele frequencies are p = 0.7 and q = 0.3. What genotype frequencies does Hardy–Weinberg predict?",
        a: "AA: 0.49. Aa: 2×0.7×0.3 = 0.42. aa: 0.09. They sum to 1.",
      },
    ],
    pitfalls: [
      "q² is the frequency of the recessive genotype, not of the allele. Taking the square root is the step that recovers q.",
      "Hardy–Weinberg is the null. Fitting it is not evidence that selection is absent until you have the sample size to have noticed a departure.",
      "The logistic K is not a target the population “wants.” It is the point where the modeled per-capita growth hits zero.",
    ],
  },
  {
    slug: "physiology",
    volume: "biology",
    level: "advanced",
    title: "Enzymes, membranes, and scaling",
    minutes: 30,
    summary:
      "Michaelis–Menten kinetics, the Nernst potential, diffusion time, and the allometric scaling that compares animals of different sizes.",
    prereqs: ["functions", "acids-electrochemistry"],
    ideas: [
      "An enzyme saturates. At high substrate the rate approaches Vmax and stops depending on further substrate.",
      "Km is the substrate concentration at half-maximum rate. It is not, by itself, a binding constant, though it is related.",
      "The Nernst potential is the voltage that balances a concentration gradient for one ion.",
      "Diffusion time grows with the square of distance, which is why cells are small.",
    ],
    body: [
      "Enzyme kinetics in the Michaelis–Menten model assumes a substrate S binding an enzyme to form a complex, which either falls apart or proceeds to product. At steady state the initial rate is v = Vmax [S] / (Km + [S]). At [S] = Km the rate is half of Vmax, which is the operational definition of Km and the reason it is read off a plot rather than derived from a microscope. At low substrate the reaction looks first-order in S. At high substrate the enzyme is saturated and the rate is zero-order in S, stuck at Vmax. A competitive inhibitor raises the apparent Km and leaves Vmax alone; it can be outcompeted by enough substrate.",
      "Ions are not at the same concentration on both sides of a cell membrane, and the membrane potential is the electrical compromise. For a single ion species that can cross, the Nernst potential is the voltage at which the chemical gradient and the electrical gradient cancel. At mammalian body temperature the rule of thumb is E ≈ (61.5 mV / z) log₁₀([out]/[in]) for a cation. Potassium, high inside, has a negative Nernst potential. Sodium, high outside, has a positive one. The resting membrane sits near the potassium potential because the membrane at rest is much more permeable to potassium. The Goldman equation is the weighted average when several ions matter.",
      "Diffusion is not a flow with a speed. The time to diffuse a distance x is on the order of x² / (2D), where D is the diffusion coefficient. Double the distance and you quadruple the time. A neurotransmitter crosses a synaptic cleft in microseconds because the cleft is tens of nanometers. The same molecule would take minutes to cross a centimeter. That square law is why circulatory systems and lungs exist: bulk flow covers distance, diffusion covers the last small gap. Allometric scaling compares whole animals. A quantity Y often follows Y = a Mᵇ. Metabolic rate scales closer to M^{3/4} than to M¹, so mass-specific metabolism falls as animals get larger. Surface-to-volume arguments suggest 2/3; the three-quarter law is empirical and still argued over, and the formula is what you fit.",
    ],
    formulas: [
      {
        id: "mm",
        name: "Michaelis–Menten",
        tex: L`v=\frac{V_{\max}[S]}{K_m+[S]}`,
        meaning: "Initial rate versus substrate concentration for a simple enzyme.",
        symbols: [
          { sym: "Vmax", means: "Maximum rate, at saturating substrate" },
          { sym: "Km", means: "Substrate concentration giving half of Vmax" },
        ],
      },
      {
        id: "lineweaver",
        name: "Lineweaver–Burk",
        tex: L`\frac{1}{v}=\frac{K_m}{V_{\max}}\frac{1}{[S]}+\frac{1}{V_{\max}}`,
        meaning:
          "The double-reciprocal form. Slope Km/Vmax, intercept 1/Vmax. Useful to see, noisy in practice.",
        symbols: [{ sym: "1/v", means: "Reciprocal of the measured rate" }],
      },
      {
        id: "nernst-bio",
        name: "Nernst potential",
        tex: L`E=\frac{RT}{zF}\ln\frac{[\mathrm{out}]}{[\mathrm{in}]}`,
        meaning:
          "Equilibrium potential of one ion. At 37 °C, about (61.5 / z) log₁₀([out]/[in]) in millivolts.",
        symbols: [
          { sym: "z", means: "Charge of the ion, +1 for K⁺ and Na⁺" },
          { sym: "[out], [in]", means: "Concentrations on the two sides" },
        ],
      },
      {
        id: "diffusion-time",
        name: "Diffusion time",
        tex: L`t\sim\frac{x^2}{2D}`,
        meaning: "Characteristic time to diffuse a distance x. Quadratic in distance.",
        symbols: [
          { sym: "D", means: "Diffusion coefficient" },
          { sym: "x", means: "Distance" },
        ],
      },
      {
        id: "hill",
        name: "Hill equation",
        tex: L`Y=\frac{p^{n}}{P_{50}^{n}+p^{n}}`,
        meaning:
          "Fraction bound, for a cooperative binder such as hemoglobin. n > 1 is cooperativity.",
        symbols: [
          { sym: "P₅₀", means: "Partial pressure, or concentration, at half saturation" },
          { sym: "n", means: "Hill coefficient" },
        ],
      },
      {
        id: "allometry",
        name: "Allometric scaling",
        tex: L`Y=aM^{b}`,
        meaning:
          "How a biological quantity scales with body mass. Take logs: log Y = log a + b log M, a straight line.",
        symbols: [
          { sym: "M", means: "Body mass" },
          { sym: "b", means: "The scaling exponent" },
        ],
      },
    ],
    examples: [
      {
        title: "Half-maximum, by definition",
        prompt:
          "An enzyme has Vmax = 100 μmol/min and Km = 2.0 mM. What is the rate at [S] = 2.0 mM, and at [S] = 18 mM?",
        steps: [
          "At [S] = Km, v = Vmax / 2 = 50.",
          "At 18 mM, v = 100 × 18 / (2 + 18) = 1800 / 20 = 90.",
          "Nine times the substrate, from the Km point, only raises the rate from 50 to 90. Saturation is the whole story.",
        ],
        answer: "50 μmol/min at 2 mM, and 90 μmol/min at 18 mM.",
      },
      {
        title: "Potassium’s equilibrium",
        prompt:
          "A neuron has [K⁺]in = 140 mM and [K⁺]out = 5 mM. Estimate the Nernst potential at body temperature.",
        steps: [
          "Use E ≈ 61.5 log₁₀([out]/[in]) mV, since z = 1.",
          "[out]/[in] = 5/140 ≈ 0.0357. log₁₀ of that is about −1.45.",
          "E ≈ 61.5 × (−1.45) ≈ −89 mV.",
        ],
        answer:
          "About −89 mV. Resting potentials near −70 mV sit close to this, pulled positive by a little sodium leak.",
      },
    ],
    practice: [
      {
        q: "Oxygen diffuses with D about 2×10⁻⁹ m²/s in tissue. Estimate the time to diffuse 10 μm, then 1 mm.",
        a: "For 10 μm = 10⁻⁵ m, t ~ x²/(2D) = 10⁻¹⁰ / (4×10⁻⁹) = 0.025 s. For 1 mm = 10⁻³ m, x² is 10⁴ times larger, so t ~ 250 s. A millimeter is a long walk for a diffusing molecule.",
      },
      {
        q: "If metabolic rate scales as M^{3/4}, by what factor does total metabolism rise when mass increases by 16?",
        a: "16^{3/4} = (2⁴)^{3/4} = 2³ = 8. Sixteen times the mass, eight times the metabolism, so metabolism per kilogram is halved.",
      },
    ],
    pitfalls: [
      "Km is the concentration at half Vmax. A small Km means the enzyme reaches half speed at low substrate; calling it “high affinity” is a shorthand that fails for multi-step mechanisms.",
      "The Nernst potential of an ion is not the resting membrane potential. The resting potential is a permeability-weighted compromise.",
      "Allometric exponents fitted on a log–log plot are sensitive to the range of masses and to whether you used species means or individuals. Quote the range.",
    ],
  },
];
