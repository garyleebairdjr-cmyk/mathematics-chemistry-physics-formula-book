import type { Chapter } from "./types.ts";
import { L } from "./types.ts";

export const lawsChapter: Chapter = {
  slug: "laws",
  volume: "physics",
  level: "advanced",
  title: "The named laws",
  minutes: 75,
  summary:
    "The named laws, from Newton’s first through the Einstein equation: the ones the earlier physics chapters already compute with, and the ones they left unnamed.",
  prereqs: ["mechanics", "electromagnetism", "modern-physics"],
  ideas: [
    "A named law is a compact relation with a stated domain. Outside that domain it is the wrong tool, not a failed universe.",
    "Newton’s second law, gravitation, Coulomb, Ohm, Faraday, Snell, the ideal gas, and the Lorentz kinematics already have formulas in the earlier chapters. This chapter names the rest, and it does not pretend the earlier ones do not count.",
    "Several “laws” are linear approximations: Hooke, Ohm, friction as μN, Newtonian viscosity, Curie’s law, and Newton’s law of cooling.",
    "Hubble’s law is an empirical fit. The number H₀ is still in dispute between local and cosmic measurements.",
  ],
  body: [
    "No field book contains every relation a specialty calls a law. Continuum mechanics has a constitutive equation for every class of material, and the Standard Model is a Lagrangian, not a stack of plug-in formulas. What this book does contain is the named canon a physicist expects you to recognize. Newton’s second law, gravitation, momentum, work and mechanical energy, the ideal gas, Coulomb, Ohm, resistors, the magnetic force, Faraday, Snell, time dilation, E = mc², the photon, the photoelectric effect, and de Broglie are formulas in the earlier physics chapters. This chapter is the rest: the names that were only a sentence, or missing.",
    "Mechanics. Newton’s first law is the inertial-frame claim: no net force, no acceleration. The third law is the pair of forces on two different bodies. Hooke, kinetic friction, impulse, and τ = Iα are the elementary models. Kepler’s first law is the ellipse with the sun at a focus, the second is equal areas, and the third is the period–axis relation already computed below. Angular momentum is conserved when the external torque vanishes. Archimedes, Pascal, continuity, and Bernoulli are the hydrostatic and ideal-flow laws. Stokes, Poiseuille, and Torricelli are the laminar and efflux results that follow from them. Newtonian viscosity is the stress law inside the Navier–Stokes equation; it is not a description of blood, paint, or turbulence.",
    "Thermodynamics. The zeroth law is what makes temperature a property: thermal equilibrium is transitive. The first law is ΔU = Q − W, with W the work done by the system. Books that write ΔU = Q + W are measuring W as work done on the system. The second law says the entropy of an isolated system does not decrease. The third says the entropy of a perfect crystal approaches a universal constant, taken as zero, as T approaches 0, and that you do not get there in finitely many steps. Carnot’s efficiency is the highest any engine can have between two temperatures, and those temperatures are kelvin. Boyle, Charles, Gay-Lussac, and Avogadro are the ideal-gas law with one variable held fixed. Fourier’s law is heat conduction. Stefan–Boltzmann, Wien, and Planck are thermal radiation; Kirchhoff’s radiation law says a good absorber is a good emitter. Newton’s law of cooling and Dulong–Petit are restricted approximations. Curie’s law is the high-temperature paramagnet, not a ferromagnet below its Curie point.",
    "Electromagnetism. Maxwell’s equations in integral form are Gauss’s law, the absence of magnetic monopoles, Faraday’s law, and the Ampère–Maxwell law. Lenz’s law is the minus sign in Faraday. The Lorentz force is q(E + v × B); the magnetic half is already in Electromagnetism. Biot–Savart is the field of a current element, and the force between two long wires is what used to define the ampere. Kirchhoff’s circuit rules are charge conservation and a single-valued electrostatic potential. They fail when a changing magnetic flux makes the electric field nonconservative. Capacitance and the ideal transformer are definitions with stated idealizations, written here because they are used as laws.",
    "Light, quanta, and gravity. Reflection and the thin lens sit with Snell. Malus and Brewster are the polarization laws. The classical Doppler formula is for sound in a medium; light uses the relativistic one, and you cannot add the two speeds as numbers past c. Planck’s law is the blackbody spectrum. Bohr, Rydberg, Heisenberg, Bragg, Compton, and radioactive decay are the early quantum rules. The Schrödinger equation is the dynamical law of nonrelativistic quantum mechanics; writing it down is not the same as solving it. Hubble’s law is empirical, and H₀ is not one settled number: local distance-ladder work sits near 73 km/s/Mpc, while cosmic-microwave inferences under ΛCDM sit near 67. Gauss’s law for gravity is the inverse-square law in integral form. The Einstein field equation is the law of general relativity; in the weak, slow limit it is Newton’s gravitation again. Left out on purpose: the Standard Model Lagrangian, baryon and lepton number as a particle catalog, and every specialty constitutive law beyond Hooke, Ohm, and Newtonian viscosity.",
  ],
  formulas: [
    {
      id: "newton3",
      name: "Newton’s third law",
      tex: L`\mathbf{F}_{AB}=-\mathbf{F}_{BA}`,
      meaning:
        "The force of A on B is equal and opposite the force of B on A. The two forces act on different bodies.",
      symbols: [
        { sym: "F_AB", means: "Force exerted by A on B" },
        { sym: "F_BA", means: "Force exerted by B on A" },
      ],
    },
    {
      id: "hooke",
      name: "Hooke’s law",
      tex: L`F=-kx`,
      meaning:
        "Restoring force of a spring in its linear range. The minus sign means the force opposes the displacement from equilibrium.",
      symbols: [
        { sym: "k", means: "Spring constant, force per extension" },
        { sym: "x", means: "Displacement from the unloaded length" },
      ],
    },
    {
      id: "friction",
      name: "Friction",
      tex: L`f_k=\mu_k N,\qquad f_s\le \mu_s N`,
      meaning:
        "Kinetic friction has a set magnitude while sliding. Static friction is whatever value, up to μₛN, is needed to prevent slipping.",
      symbols: [
        { sym: "μ_k", means: "Coefficient of kinetic friction" },
        { sym: "μ_s", means: "Coefficient of static friction" },
        { sym: "N", means: "Normal force, perpendicular to the surface" },
      ],
    },
    {
      id: "impulse",
      name: "Impulse and momentum",
      tex: L`\mathbf{J}=\int\mathbf{F}\,dt=\Delta\mathbf{p}`,
      meaning:
        "The time integral of the net force equals the change in momentum. For a roughly constant force, J = FΔt.",
      symbols: [
        { sym: "J", means: "Impulse" },
        { sym: "Δp", means: "Change in momentum" },
        { sym: "F", means: "Net force, or its average over the interval" },
      ],
    },
    {
      id: "rotation",
      name: "Rotational second law",
      tex: L`\tau=rF\sin\theta,\qquad \tau_{\mathrm{net}}=I\alpha`,
      meaning:
        "Torque is the moment of a force. The net torque equals the moment of inertia times the angular acceleration, about the same axis.",
      symbols: [
        { sym: "τ", means: "Torque" },
        { sym: "I", means: "Moment of inertia about the chosen axis" },
        { sym: "α", means: "Angular acceleration" },
        { sym: "θ", means: "Angle between the position vector and the force" },
      ],
    },
    {
      id: "kepler3",
      name: "Kepler’s third law",
      tex: L`\frac{T^2}{a^3}=\frac{4\pi^2}{GM}`,
      meaning:
        "For a small body orbiting a mass M, the square of the period is proportional to the cube of the semimajor axis. The first law says the orbit is an ellipse with M at one focus. The second says the radius vector sweeps equal areas in equal times.",
      symbols: [
        { sym: "T", means: "Orbital period" },
        { sym: "a", means: "Semimajor axis" },
        { sym: "M", means: "Mass of the central body" },
        { sym: "G", means: "Gravitational constant" },
      ],
    },
    {
      id: "archimedes",
      name: "Archimedes’ principle",
      tex: L`F_b=\rho_f V_d g`,
      meaning:
        "Buoyant force equals the weight of the fluid displaced. It acts upward through the center of mass of the displaced fluid.",
      symbols: [
        { sym: "ρ_f", means: "Density of the fluid" },
        { sym: "V_d", means: "Volume of fluid displaced" },
        { sym: "g", means: "Gravitational acceleration" },
      ],
    },
    {
      id: "continuity",
      name: "Continuity",
      tex: L`A_1 v_1=A_2 v_2`,
      meaning:
        "For an incompressible fluid in a full pipe, volume flow rate is the same at every cross section. A narrower section flows faster.",
      symbols: [
        { sym: "A", means: "Cross-sectional area" },
        { sym: "v", means: "Speed of the fluid, averaged over that area" },
      ],
    },
    {
      id: "bernoulli",
      name: "Bernoulli’s equation",
      tex: L`P+\rho g h+\frac12\rho v^2=\mathrm{constant}`,
      meaning:
        "Along a streamline of steady, incompressible, nonviscous flow. Higher speed means lower pressure when the height does not change.",
      symbols: [
        { sym: "P", means: "Pressure" },
        { sym: "h", means: "Height" },
        { sym: "ρ", means: "Fluid density" },
      ],
    },
    {
      id: "first-law",
      name: "First law of thermodynamics",
      tex: L`\Delta U=Q-W`,
      meaning:
        "Change in internal energy equals heat added to the system minus work done by the system. If your book defines W as work on the system, the sign in front of W flips.",
      symbols: [
        { sym: "ΔU", means: "Change in internal energy of the system" },
        { sym: "Q", means: "Heat added to the system" },
        { sym: "W", means: "Work done by the system" },
      ],
    },
    {
      id: "stefan",
      name: "Stefan–Boltzmann law",
      tex: L`P=\varepsilon\sigma A\left(T^4-T_s^4\right)`,
      meaning:
        "Net radiated power. Temperatures are absolute. ε = 1 is a blackbody. σ = 5.670374419×10⁻⁸ W·m⁻²·K⁻⁴.",
      symbols: [
        { sym: "σ", means: "Stefan–Boltzmann constant" },
        { sym: "ε", means: "Emissivity, from 0 to 1" },
        { sym: "T", means: "Surface temperature in kelvin" },
        { sym: "T_s", means: "Temperature of the surroundings in kelvin" },
      ],
    },
    {
      id: "wien",
      name: "Wien’s displacement law",
      tex: L`\lambda_{\max} T=b`,
      meaning:
        "Wavelength of the peak of a blackbody spectrum, per kelvin. b = 2.897771955×10⁻³ m·K.",
      symbols: [
        { sym: "λ_max", means: "Wavelength at which the spectral radiance peaks" },
        { sym: "b", means: "Wien’s displacement constant" },
      ],
    },
    {
      id: "cooling",
      name: "Newton’s law of cooling",
      tex: L`T(t)=T_{\mathrm{env}}+\left(T_0-T_{\mathrm{env}}\right)e^{-kt}`,
      meaning:
        "The temperature difference from the surroundings decays exponentially when that difference is modest.",
      symbols: [
        { sym: "T_env", means: "Ambient temperature" },
        { sym: "T_0", means: "Temperature at t = 0" },
        { sym: "k", means: "Cooling constant, in reciprocal time" },
      ],
    },
    {
      id: "reflection",
      name: "Law of reflection",
      tex: L`\theta_i=\theta_r`,
      meaning:
        "Angle of incidence equals angle of reflection. Both are measured from the normal, not from the surface, and the two rays and the normal lie in one plane.",
      symbols: [
        { sym: "θ_i", means: "Angle of incidence from the normal" },
        { sym: "θ_r", means: "Angle of reflection from the normal" },
      ],
    },
    {
      id: "thin-lens",
      name: "Thin-lens equation",
      tex: L`\frac{1}{f}=\frac{1}{d_o}+\frac{1}{d_i},\qquad m=-\frac{d_i}{d_o}`,
      meaning:
        "Gaussian sign convention: f > 0 for a converging lens, dₒ > 0 for a real object, dᵢ > 0 when the image is real and on the far side. A negative magnification is inverted.",
      symbols: [
        { sym: "f", means: "Focal length" },
        { sym: "d_o", means: "Object distance" },
        { sym: "d_i", means: "Image distance" },
        { sym: "m", means: "Transverse magnification" },
      ],
    },
    {
      id: "kirchhoff",
      name: "Kirchhoff’s rules",
      tex: L`\sum I=0,\qquad \sum\Delta V=0`,
      meaning:
        "At a junction, currents sum to zero. Around a loop in a static circuit, potential changes sum to zero. A changing magnetic flux adds Faraday’s emf and the second sum is no longer zero by itself.",
      symbols: [
        { sym: "I", means: "Current, with a sign for direction" },
        { sym: "ΔV", means: "Potential change across one element" },
      ],
    },
    {
      id: "capacitance",
      name: "Capacitance",
      tex: L`Q=CV,\qquad U=\frac12 CV^2`,
      meaning:
        "Definition of capacitance, and the energy stored in the field. A parallel-plate capacitor has C = ε₀ A/d when the plate separation is small and fringing is ignored.",
      symbols: [
        { sym: "C", means: "Capacitance" },
        { sym: "Q", means: "Magnitude of the charge on one plate" },
        { sym: "V", means: "Potential difference" },
        { sym: "U", means: "Stored energy" },
      ],
    },
    {
      id: "gauss",
      name: "Gauss’s laws",
      tex: L`\oint\mathbf{E}\cdot d\mathbf{A}=\frac{Q_{\mathrm{enc}}}{\varepsilon_0},\qquad \oint\mathbf{B}\cdot d\mathbf{A}=0`,
      meaning:
        "Electric flux through a closed surface equals the enclosed charge over ε₀. Magnetic flux through a closed surface is zero: no magnetic monopoles.",
      symbols: [
        { sym: "Q_enc", means: "Charge inside the closed surface" },
        { sym: "ε₀", means: "8.854×10⁻¹² C²/(N·m²)" },
      ],
    },
    {
      id: "ampere-maxwell",
      name: "Ampère–Maxwell law",
      tex: L`\oint\mathbf{B}\cdot d\mathbf{l}=\mu_0 I_{\mathrm{enc}}+\mu_0\varepsilon_0\frac{d\Phi_E}{dt}`,
      meaning:
        "Circulation of B equals μ₀ times the enclosed current, plus μ₀ε₀ times the rate of change of electric flux. For a long straight wire in the steady state, B = μ₀ I / (2πr).",
      symbols: [
        { sym: "I_enc", means: "Current through the Amperian loop" },
        { sym: "Φ_E", means: "Electric flux" },
        { sym: "μ₀", means: "4π×10⁻⁷ N/A²" },
      ],
    },
    {
      id: "transformer",
      name: "Ideal transformer",
      tex: L`\frac{V_s}{V_p}=\frac{N_s}{N_p},\qquad V_p I_p=V_s I_s`,
      meaning:
        "Voltage ratio equals turns ratio. For an ideal transformer the power in equals the power out, so the currents ratio is the inverse.",
      symbols: [
        { sym: "N_p", means: "Turns on the primary" },
        { sym: "N_s", means: "Turns on the secondary" },
        { sym: "V_p, V_s", means: "Primary and secondary voltages" },
      ],
    },
    {
      id: "length-contract",
      name: "Length contraction",
      tex: L`L=L_0\sqrt{1-v^2/c^2}`,
      meaning:
        "Length of an object along the direction of its motion, measured in a frame where it moves at speed v. L₀ is the length in the object’s rest frame.",
      symbols: [
        { sym: "L_0", means: "Proper length" },
        { sym: "v", means: "Speed of the object relative to the observer" },
        { sym: "c", means: "Speed of light" },
      ],
    },
    {
      id: "heisenberg",
      name: "Heisenberg uncertainty",
      tex: L`\Delta x\,\Delta p\ge\frac{\hbar}{2}`,
      meaning:
        "The product of the standard deviations of position and momentum, in a given preparation, cannot be smaller than ℏ/2. It is not a statement about a clumsy classical measurement.",
      symbols: [
        { sym: "Δx", means: "Spread in position" },
        { sym: "Δp", means: "Spread in momentum" },
        { sym: "ℏ", means: "h/2π, about 1.055×10⁻³⁴ J·s" },
      ],
    },
    {
      id: "bohr",
      name: "Bohr levels",
      tex: L`E_n=-\frac{13.6\,\mathrm{eV}}{n^2}`,
      meaning:
        "Energy of the hydrogen atom in the Bohr model, and of the real hydrogen atom’s levels to this accuracy. n = 1, 2, 3, …. The conventional 13.6 eV is rounded from 13.598 eV.",
      symbols: [
        { sym: "n", means: "Principal quantum number, a positive integer" },
        { sym: "E_n", means: "Energy relative to a free electron at rest" },
      ],
    },
    {
      id: "rydberg",
      name: "Rydberg formula",
      tex: L`\frac{1}{\lambda}=R\left(\frac{1}{n_1^2}-\frac{1}{n_2^2}\right)`,
      meaning:
        "Vacuum wavelength of a hydrogen line for a jump from level n₂ down to n₁. R = 1.097×10⁷ m⁻¹. The Balmer series is n₁ = 2.",
      symbols: [
        { sym: "n_1", means: "Lower level" },
        { sym: "n_2", means: "Upper level, greater than n₁" },
        { sym: "R", means: "Rydberg constant" },
      ],
    },
    {
      id: "decay-law",
      name: "Radioactive decay",
      tex: L`N=N_0 e^{-\lambda t},\qquad \lambda=\frac{\ln 2}{t_{1/2}}`,
      meaning:
        "The number of undecayed nuclei falls exponentially. Half the sample remains after one half-life, whatever the starting amount.",
      symbols: [
        { sym: "λ", means: "Decay constant" },
        { sym: "t_{1/2}", means: "Half-life" },
        { sym: "N_0", means: "Number at t = 0" },
      ],
    },
    {
      id: "bragg",
      name: "Bragg’s law",
      tex: L`n\lambda=2d\sin\theta`,
      meaning:
        "Constructive interference for waves reflecting from planes spaced d apart. θ is the glancing angle from the plane, not from the normal. If nλ > 2d, that order does not exist.",
      symbols: [
        { sym: "n", means: "Positive integer order" },
        { sym: "d", means: "Spacing of the reflecting planes" },
        { sym: "θ", means: "Glancing angle" },
      ],
    },
    {
      id: "hubble",
      name: "Hubble’s law",
      tex: L`v=H_0 d`,
      meaning:
        "Recession speed of a distant galaxy is proportional to its distance. H₀ is measured near 73 km/s/Mpc locally and near 67 km/s/Mpc from the cosmic microwave background under ΛCDM. The law is not used inside a gravitationally bound system.",
      symbols: [
        { sym: "v", means: "Recession speed" },
        { sym: "d", means: "Distance" },
        { sym: "H_0", means: "Hubble constant, in speed per distance" },
      ],
    },
    {
      id: "newton1",
      name: "Newton’s first law",
      tex: L`\mathbf{F}_{\mathrm{net}}=\mathbf{0}\implies\mathbf{a}=\mathbf{0}`,
      meaning:
        "In an inertial frame, a body with no net force moves at constant velocity. Rest is the special case of velocity zero. The second law, in Classical mechanics, is what happens when the force is not zero.",
      symbols: [
        { sym: "F_net", means: "Vector sum of every force on the body" },
        { sym: "a", means: "Acceleration of the body" },
      ],
    },
    {
      id: "work-energy",
      name: "Work–energy theorem",
      tex: L`W_{\mathrm{net}}=\Delta K`,
      meaning:
        "The net work done on a particle equals its change in kinetic energy. If the only forces that do work are conservative, this is conservation of mechanical energy.",
      symbols: [
        { sym: "W_net", means: "Work by the net force" },
        { sym: "ΔK", means: "Change in kinetic energy, ½mv²" },
      ],
    },
    {
      id: "angular",
      name: "Angular momentum",
      tex: L`\mathbf{L}=I\boldsymbol{\omega}=\mathbf{r}\times\mathbf{p},\qquad \boldsymbol{\tau}_{\mathrm{ext}}=\frac{d\mathbf{L}}{dt}`,
      meaning:
        "External torque equals the rate of change of angular momentum, about the same point or axis. Zero external torque means L is conserved, which is why a skater spins faster by pulling in.",
      symbols: [
        { sym: "L", means: "Angular momentum" },
        { sym: "I", means: "Moment of inertia about the axis" },
        { sym: "ω", means: "Angular velocity" },
        { sym: "τ_ext", means: "Net external torque" },
      ],
    },
    {
      id: "kepler1",
      name: "Kepler’s first law",
      tex: L`r=\frac{a(1-e^2)}{1+e\cos\theta}`,
      meaning:
        "The orbit is a conic section with the central body at one focus. Bound orbits are ellipses. e = 0 is a circle. θ is measured from periapsis.",
      symbols: [
        { sym: "e", means: "Eccentricity, from 0 up to 1 for a bound orbit" },
        { sym: "θ", means: "True anomaly, the angle from the closest point" },
        { sym: "a", means: "Semimajor axis" },
      ],
    },
    {
      id: "kepler2",
      name: "Kepler’s second law",
      tex: L`\frac{dA}{dt}=\frac{L}{2m}=\mathrm{constant}`,
      meaning:
        "The line from the focus to the body sweeps equal areas in equal times. The body moves faster at periapsis than at apoapsis.",
      symbols: [
        { sym: "dA/dt", means: "Area swept per time" },
        { sym: "L", means: "Angular momentum of the orbiting body" },
        { sym: "m", means: "Mass of the orbiting body" },
      ],
    },
    {
      id: "pascal",
      name: "Pascal’s law",
      tex: L`\frac{F_1}{A_1}=\frac{F_2}{A_2},\qquad P=P_0+\rho g h`,
      meaning:
        "A pressure applied to a confined static fluid is transmitted undiminished to every part of the fluid. Depth adds ρgh, which is the hydrostatic law.",
      symbols: [
        { sym: "F", means: "Force on a piston" },
        { sym: "A", means: "Area of that piston" },
        { sym: "h", means: "Depth below the free surface, or below the reference" },
      ],
    },
    {
      id: "stokes",
      name: "Stokes’ law",
      tex: L`F_d=6\pi\eta r v`,
      meaning:
        "Drag on a sphere in a viscous fluid when the Reynolds number is small. It is not the drag of a baseball.",
      symbols: [
        { sym: "η", means: "Dynamic viscosity of the fluid" },
        { sym: "r", means: "Radius of the sphere" },
        { sym: "v", means: "Speed of the sphere relative to the fluid" },
      ],
    },
    {
      id: "poiseuille",
      name: "Poiseuille’s law",
      tex: L`Q=\frac{\pi r^4\Delta P}{8\eta L}`,
      meaning:
        "Volume flow of a laminar, incompressible Newtonian fluid through a straight round pipe. The fourth power of the radius is the point: a slightly narrower pipe flows much less.",
      symbols: [
        { sym: "Q", means: "Volume flow rate" },
        { sym: "ΔP", means: "Pressure drop along the pipe" },
        { sym: "L", means: "Length of the pipe" },
      ],
    },
    {
      id: "torricelli",
      name: "Torricelli’s law",
      tex: L`v=\sqrt{2gh}`,
      meaning:
        "Speed of efflux from a hole a depth h below the free surface of an ideal liquid, the same speed as free fall through that height. It is Bernoulli applied to a large tank.",
      symbols: [
        { sym: "h", means: "Depth of the hole below the surface" },
        { sym: "v", means: "Speed of the exiting fluid" },
      ],
    },
    {
      id: "viscosity",
      name: "Newton’s law of viscosity",
      tex: L`\tau=\eta\frac{dv}{dy}`,
      meaning:
        "Shear stress in a Newtonian fluid is viscosity times the velocity gradient. This is the constitutive assumption inside the Navier–Stokes equation, not a law of every fluid.",
      symbols: [
        { sym: "τ", means: "Shear stress" },
        { sym: "η", means: "Dynamic viscosity" },
        { sym: "dv/dy", means: "How fast the parallel velocity changes across the flow" },
      ],
    },
    {
      id: "navier-stokes",
      name: "Navier–Stokes equation",
      tex: L`\rho\left(\frac{\partial\mathbf{v}}{\partial t}+\mathbf{v}\cdot\nabla\mathbf{v}\right)=-\nabla P+\eta\nabla^2\mathbf{v}+\mathbf{f}`,
      meaning:
        "Momentum balance for an incompressible Newtonian fluid of constant viscosity. Euler’s equation is the same line with η = 0. The equation is the law; solving it for a turbulent flow is a different problem.",
      symbols: [
        { sym: "v", means: "Velocity field of the fluid" },
        { sym: "P", means: "Pressure" },
        { sym: "f", means: "Body force per volume, such as ρg" },
      ],
    },
    {
      id: "gas-laws",
      name: "Boyle, Charles, Gay-Lussac, Avogadro",
      tex: L`PV=\mathrm{const},\quad \frac{V}{T}=\mathrm{const},\quad \frac{P}{T}=\mathrm{const},\quad \frac{V}{n}=\mathrm{const}`,
      meaning:
        "Four names for the ideal-gas law with something held fixed. Boyle holds T and n fixed, Charles holds P and n, Gay-Lussac (Amontons) holds V and n, Avogadro holds P and T. Temperature is absolute.",
      symbols: [
        { sym: "T", means: "Absolute temperature" },
        { sym: "n", means: "Amount of gas" },
      ],
    },
    {
      id: "zeroth",
      name: "Zeroth law of thermodynamics",
      tex: L`A\sim B\;\mathrm{and}\;B\sim C\implies A\sim C`,
      meaning:
        "If A is in thermal equilibrium with B, and B with C, then A is in equilibrium with C. That transitivity is what a thermometer measures, and it is why temperature exists as a property.",
      symbols: [{ sym: "∼", means: "In thermal equilibrium with" }],
    },
    {
      id: "second-law",
      name: "Second law of thermodynamics",
      tex: L`\Delta S\ge\int\frac{\delta Q}{T}`,
      meaning:
        "The entropy of an isolated system does not decrease. Equality holds for a reversible process. Clausius: heat does not spontaneously flow from cold to hot. Kelvin: no engine converts heat entirely into work with no other effect.",
      symbols: [
        { sym: "ΔS", means: "Entropy change of the system" },
        { sym: "δQ", means: "Heat added reversibly, used to compute ΔS" },
      ],
    },
    {
      id: "third-law",
      name: "Third law of thermodynamics",
      tex: L`S\to S_0\quad\mathrm{as}\quad T\to 0`,
      meaning:
        "The entropy of a perfect crystal approaches a universal constant, taken to be zero, as the temperature approaches absolute zero. A disordered ground state keeps a residual entropy. Absolute zero is not reached in finitely many steps.",
      symbols: [
        { sym: "S_0", means: "Residual entropy, zero for a unique perfect-crystal ground state" },
      ],
    },
    {
      id: "carnot",
      name: "Carnot efficiency",
      tex: L`\eta=1-\frac{T_C}{T_H}`,
      meaning:
        "The highest efficiency of any heat engine operating between a hot reservoir and a cold one. Temperatures are kelvin. Real engines do worse. The formula is a theorem of the second law, and it is the number everyone computes.",
      symbols: [
        { sym: "T_H", means: "Temperature of the hot reservoir" },
        { sym: "T_C", means: "Temperature of the cold reservoir" },
        { sym: "η", means: "Work output divided by heat absorbed from the hot reservoir" },
      ],
    },
    {
      id: "fourier",
      name: "Fourier’s law",
      tex: L`\frac{P}{A}=-k\frac{dT}{dx}`,
      meaning:
        "Heat flows toward lower temperature. For a slab of thickness L with a temperature difference ΔT, the heat current is kAΔT/L. k is a property of the material.",
      symbols: [
        { sym: "k", means: "Thermal conductivity" },
        { sym: "P", means: "Heat current, energy per time" },
        { sym: "A", means: "Area the heat crosses" },
      ],
    },
    {
      id: "dulong-petit",
      name: "Dulong–Petit law",
      tex: L`c_V\approx 3R`,
      meaning:
        "Molar heat capacity of many solid elements at room temperature, from classical equipartition. It fails at low temperature, where the heat capacity falls toward zero, as the third law requires.",
      symbols: [
        { sym: "c_V", means: "Molar heat capacity at constant volume" },
        { sym: "R", means: "Gas constant, 8.314 J/(mol·K)" },
      ],
    },
    {
      id: "kirchhoff-rad",
      name: "Kirchhoff’s radiation law",
      tex: L`\varepsilon_\lambda=\alpha_\lambda`,
      meaning:
        "At thermal equilibrium, spectral emissivity equals spectral absorptivity. A surface that absorbs a wavelength well also emits it well. This is not Kirchhoff’s circuit rules.",
      symbols: [
        { sym: "ε_λ", means: "Emissivity at wavelength λ" },
        { sym: "α_λ", means: "Absorptivity at the same wavelength" },
      ],
    },
    {
      id: "planck",
      name: "Planck’s law",
      tex: L`B_\lambda=\frac{2hc^2}{\lambda^5}\frac{1}{e^{hc/(\lambda k_B T)}-1}`,
      meaning:
        "Spectral radiance of a blackbody, per wavelength. Stefan–Boltzmann is the integral over wavelength and angle. Wien’s displacement law locates the peak. The Rayleigh–Jeans limit is the long-wavelength end, and it diverges if you use it for every wavelength.",
      symbols: [
        { sym: "B_λ", means: "Power per area per steradian per metre of wavelength" },
        { sym: "λ", means: "Wavelength" },
        { sym: "k_B", means: "Boltzmann constant" },
      ],
    },
    {
      id: "curie",
      name: "Curie’s law",
      tex: L`\chi=\frac{C}{T}`,
      meaning:
        "Magnetic susceptibility of a paramagnet at high temperature and weak field. C is a material constant. A ferromagnet below its Curie temperature does not obey this.",
      symbols: [
        { sym: "χ", means: "Magnetic susceptibility" },
        { sym: "C", means: "Curie constant of the material, in kelvin" },
        { sym: "T", means: "Absolute temperature" },
      ],
    },
    {
      id: "lorentz",
      name: "Lorentz force",
      tex: L`\mathbf{F}=q\left(\mathbf{E}+\mathbf{v}\times\mathbf{B}\right)`,
      meaning:
        "The electromagnetic force on a point charge. The magnetic term is perpendicular to the velocity and does no work. The magnetic-only case is the formula in Electromagnetism.",
      symbols: [
        { sym: "E", means: "Electric field" },
        { sym: "B", means: "Magnetic field" },
        { sym: "v", means: "Velocity of the charge" },
      ],
    },
    {
      id: "biot",
      name: "Biot–Savart law",
      tex: L`d\mathbf{B}=\frac{\mu_0}{4\pi}\frac{I\,d\mathbf{l}\times\hat{\mathbf{r}}}{r^2}`,
      meaning:
        "Magnetic field of a steady current element. Integrating it around a long straight wire gives B = μ₀I/(2πr). At the center of a circular loop it gives B = μ₀I/(2R).",
      symbols: [
        { sym: "dl", means: "A short piece of the wire, in the direction of the current" },
        { sym: "r", means: "Distance from that piece to the point where B is wanted" },
      ],
    },
    {
      id: "ampere-force",
      name: "Force between two wires",
      tex: L`\frac{F}{L}=\frac{\mu_0 I_1 I_2}{2\pi d}`,
      meaning:
        "Force per length between two long parallel wires. Currents in the same direction attract. The old definition of the ampere was the current that made this force 2×10⁻⁷ N/m at a separation of 1 m.",
      symbols: [
        { sym: "d", means: "Distance between the wires" },
        { sym: "I_1, I_2", means: "The two currents" },
      ],
    },
    {
      id: "lenz",
      name: "Lenz’s law",
      tex: L`\mathcal{E}=-\frac{d\Phi_B}{dt}`,
      meaning:
        "The induced current opposes the change in flux that produced it. The formula is Faraday’s law; the name Lenz belongs to the minus sign. Increasing flux into the page drives a current whose own field points out of the page.",
      symbols: [
        { sym: "ε", means: "Induced emf" },
        { sym: "Φ_B", means: "Magnetic flux through the circuit" },
      ],
    },
    {
      id: "charge-cons",
      name: "Conservation of charge",
      tex: L`\frac{dQ_{\mathrm{enc}}}{dt}=-\oint\mathbf{J}\cdot d\mathbf{A}`,
      meaning:
        "Charge in a volume changes only because current crosses the surface. At a circuit junction this is Kirchhoff’s current rule. Charge is not created when a capacitor charges; it moves.",
      symbols: [
        { sym: "Q_enc", means: "Charge inside the volume" },
        { sym: "J", means: "Current density" },
      ],
    },
    {
      id: "malus",
      name: "Malus’s law",
      tex: L`I=I_0\cos^2\theta`,
      meaning:
        "Intensity through a perfect polarizer, θ being the angle between the incident polarization and the polarizer’s axis. At 90° the transmitted intensity is zero.",
      symbols: [
        { sym: "I_0", means: "Intensity of the already polarized incident light" },
        { sym: "θ", means: "Angle between the polarization and the polarizer axis" },
      ],
    },
    {
      id: "brewster",
      name: "Brewster’s law",
      tex: L`\tan\theta_B=\frac{n_2}{n_1}`,
      meaning:
        "Angle of incidence, from the normal, at which reflected light is fully polarized perpendicular to the plane of incidence. n₂ is the medium the light is entering.",
      symbols: [
        { sym: "θ_B", means: "Brewster angle, from the normal" },
        { sym: "n_1", means: "Index of the medium the light is coming from" },
        { sym: "n_2", means: "Index of the medium the light is entering" },
      ],
    },
    {
      id: "doppler-law",
      name: "Doppler effect",
      tex: L`f'=f\frac{v\pm v_o}{v\pm v_s}`,
      meaning:
        "Sound in a medium. Use the plus in the numerator when the observer moves toward the source, and the minus in the denominator when the source moves toward the observer. Light does not use this formula.",
      symbols: [
        { sym: "v", means: "Speed of the wave in the medium" },
        { sym: "v_o", means: "Speed of the observer relative to the medium" },
        { sym: "v_s", means: "Speed of the source relative to the medium" },
      ],
    },
    {
      id: "doppler-rel",
      name: "Relativistic Doppler effect",
      tex: L`f_{\mathrm{obs}}=f\sqrt{\frac{1+\beta}{1-\beta}}`,
      meaning:
        "Light from a source moving straight toward the observer, β = v/c. Receding swaps the signs. There is no medium. At low speed it becomes the familiar f(1 + v/c).",
      symbols: [
        { sym: "β", means: "Speed of the source along the line of sight, as a fraction of c" },
        { sym: "f", means: "Frequency in the source’s rest frame" },
      ],
    },
    {
      id: "inv-square",
      name: "Inverse-square law",
      tex: L`I=\frac{P}{4\pi r^2}`,
      meaning:
        "Intensity from a source that radiates equally in every direction, when the power is conserved. Gravity and Coulomb’s law are inverse-square forces for the same geometric reason.",
      symbols: [
        { sym: "P", means: "Power of the source" },
        { sym: "r", means: "Distance from the source" },
        { sym: "I", means: "Power per area" },
      ],
    },
    {
      id: "velocity-add",
      name: "Relativistic velocity addition",
      tex: L`u=\frac{v+u'}{1+vu'/c^2}`,
      meaning:
        "Velocity of an object that moves at u′ in a frame already moving at v relative to you, along the same line. The result is always slower than c if both speeds are.",
      symbols: [
        { sym: "v", means: "Velocity of the moving frame" },
        { sym: "u'", means: "Velocity of the object in that frame" },
        { sym: "u", means: "Velocity of the object in your frame" },
      ],
    },
    {
      id: "compton",
      name: "Compton scattering",
      tex: L`\Delta\lambda=\frac{h}{m_e c}(1-\cos\theta)`,
      meaning:
        "Increase in the wavelength of a photon that scatters off a free electron at rest. The Compton wavelength h/(m_e c) is 2.426×10⁻¹² m. θ is the photon’s deflection.",
      symbols: [
        { sym: "θ", means: "Angle the photon is scattered through" },
        { sym: "m_e", means: "Electron mass" },
        { sym: "Δλ", means: "Wavelength after minus wavelength before" },
      ],
    },
    {
      id: "schrodinger",
      name: "Schrödinger equation",
      tex: L`i\hbar\frac{\partial\psi}{\partial t}=\hat{H}\psi`,
      meaning:
        "The dynamical law of nonrelativistic quantum mechanics. For one particle, H = p²/(2m) + V with p replaced by −iℏ∇. Stationary states satisfy Hψ = Eψ. Bohr’s levels are the eigenvalues for hydrogen, not a rival law.",
      symbols: [
        { sym: "ψ", means: "Wave function" },
        { sym: "H", means: "Hamiltonian, the energy operator" },
        { sym: "ℏ", means: "h/(2π)" },
      ],
    },
    {
      id: "gauss-g",
      name: "Gauss’s law for gravity",
      tex: L`\oint\mathbf{g}\cdot d\mathbf{A}=-4\pi G M_{\mathrm{enc}}`,
      meaning:
        "Gravitational flux through a closed surface equals −4πG times the enclosed mass. Outside a spherical body this is g = GM/r², the same inverse square as Newton’s law of gravitation.",
      symbols: [
        { sym: "g", means: "Gravitational field, acceleration of a test mass" },
        { sym: "M_enc", means: "Mass inside the surface" },
      ],
    },
    {
      id: "einstein-field",
      name: "Einstein field equation",
      tex: L`G_{\mu\nu}+\Lambda g_{\mu\nu}=\frac{8\pi G}{c^4}T_{\mu\nu}`,
      meaning:
        "The law of general relativity: spacetime curvature tracks stress-energy. Λ is the cosmological term in the form used with the current expansion. In the weak, slow limit the equation becomes Newton’s gravitation. It is not a calculator.",
      symbols: [
        { sym: "G_μν", means: "Einstein curvature tensor, not the gravitational constant" },
        { sym: "T_μν", means: "Stress-energy tensor" },
        { sym: "Λ", means: "Cosmological constant" },
      ],
    },
  ],
  examples: [
    {
      title: "A book and the Earth",
      prompt:
        "Earth pulls a book downward with 5.0 N. What is the third-law partner, and why does the book not hover?",
      steps: [
        "The partner is the book pulling Earth upward with 5.0 N.",
        "Those two forces act on different bodies. On the book, the forces are Earth’s pull and the table’s normal force.",
        "If the book is at rest, the normal force is also 5.0 N upward. That pair is not a third-law pair.",
      ],
      answer:
        "The partner is 5.0 N upward on the Earth. The book stays put because the table pushes it, not because the third-law pair cancels on the book.",
    },
    {
      title: "A spring, inside its linear range",
      prompt: "A spring has k = 200 N/m. How hard does it pull back when it is stretched 5.0 cm?",
      steps: [
        "x = 0.050 m.",
        "The magnitude is kx = 200 × 0.050 = 10 N.",
        "The direction is toward the equilibrium position, which is what the minus sign records.",
      ],
      answer:
        "10 N toward equilibrium. Past the elastic limit this number is no longer what the spring does.",
    },
    {
      title: "Sliding friction",
      prompt:
        "A crate is sliding. μₖ = 0.20 and the normal force is 50 N. Find the kinetic friction.",
      steps: [
        "fₖ = μₖ N = 0.20 × 50.",
        "That is 10 N, opposing the velocity, not necessarily opposing the way the crate is pointed.",
        "Static friction is not this formula. While the crate is stuck, static friction can be anything from 0 up to μₛN.",
      ],
      answer: "10 N, opposite the motion.",
    },
    {
      title: "A bat on a ball",
      prompt:
        "A bat pushes on a 0.50 kg ball with an average force of 5.0 N for 0.20 s. Find the impulse and the change in velocity.",
      steps: [
        "J = FΔt = 5.0 × 0.20 = 1.0 N·s.",
        "Δp = J = 1.0 kg·m/s.",
        "Δv = Δp / m = 1.0 / 0.50 = 2.0 m/s, in the direction of the average force.",
      ],
      answer: "Impulse 1.0 N·s, and the velocity changes by 2.0 m/s.",
    },
    {
      title: "A torque, then an angular acceleration",
      prompt:
        "A force of 20 N is applied at 0.30 m from an axis, at 90° to the radius. The moment of inertia about that axis is 0.20 kg·m². Find τ and α.",
      steps: [
        "sin 90° = 1, so τ = rF = 0.30 × 20 = 6.0 N·m.",
        "α = τ / I = 6.0 / 0.20 = 30 rad/s².",
        "If the force were along the radius, sin θ would be 0 and the torque would vanish.",
      ],
      answer: "6.0 N·m and 30 rad/s².",
    },
    {
      title: "The Earth’s year from Kepler",
      prompt:
        "Take the Sun’s mass as 1.989×10³⁰ kg and the Earth’s semimajor axis as 1.496×10¹¹ m. Find the period.",
      steps: [
        "T = 2π √(a³ / GM).",
        "With these values that is 3.16×10⁷ s.",
        "Dividing by 86400 s/day gives 365 days.",
      ],
      answer:
        "About 365 days. The law returns the period you already know, which is the check that G, M, and a are in consistent units.",
    },
    {
      title: "Does it float?",
      prompt:
        "A 0.010 m³ block of wood has a mass of 6.0 kg. It is pushed fully under fresh water, density 1000 kg/m³. Find the buoyant force, using g = 9.8 m/s².",
      steps: [
        "F_b = ρ V g = 1000 × 0.010 × 9.8 = 98 N.",
        "The weight is mg = 6.0 × 9.8 = 59 N.",
        "Buoyancy exceeds weight, so the block accelerates upward while it is held under, and it floats when less than the whole volume is submerged.",
      ],
      answer: "98 N upward, against a weight of 59 N.",
    },
    {
      title: "A pipe that narrows",
      prompt:
        "Water flows at 1.0 m/s in a pipe of radius 2.0 cm, then enters a pipe of radius 1.0 cm. Find the speed in the narrow pipe.",
      steps: [
        "Area scales with radius squared, so the narrow pipe has one quarter of the area.",
        "A₁v₁ = A₂v₂ implies v₂ = 4 v₁.",
        "v₂ = 4.0 m/s.",
      ],
      answer: "4.0 m/s. This is continuity, not Bernoulli. It says nothing yet about the pressure.",
    },
    {
      title: "Pressure drop in a narrowing",
      prompt:
        "The same water speeds go from 2.0 m/s to 8.0 m/s at constant height. The upstream pressure is 1.013×10⁵ Pa. Find the downstream pressure. Density is 1000 kg/m³.",
      steps: [
        "The height terms cancel.",
        "P₂ = P₁ + ½ρ(v₁² − v₂²) = 1.013×10⁵ + 500 × (4 − 64).",
        "500 × (−60) = −3.00×10⁴, so P₂ = 7.13×10⁴ Pa.",
      ],
      answer: "7.13×10⁴ Pa. Faster flow, lower pressure, at the same height.",
    },
    {
      title: "Heat in, work out",
      prompt:
        "A gas absorbs 500 J of heat and does 200 J of work on its surroundings. Find ΔU in the convention of this chapter.",
      steps: [
        "Q = +500 J because heat enters the system.",
        "W = +200 J because the system does the work.",
        "ΔU = 500 − 200 = 300 J.",
      ],
      answer:
        "300 J. In the other convention the work on the system is −200 J and ΔU = Q + W_on gives the same 300 J.",
    },
    {
      title: "A black surface at 1000 K",
      prompt:
        "How much power does 1.00 m² of blackbody at 1000 K radiate into surroundings at absolute zero?",
      steps: [
        "ε = 1, A = 1, Tₛ = 0, T⁴ = 10¹² K⁴.",
        "σ × 10¹² = 5.670×10⁴ W.",
        "The net power is 56.7 kW. Real surroundings are not at 0 K, so a real net power is smaller.",
      ],
      answer: "56.7 kW.",
    },
    {
      title: "The Sun’s peak wavelength",
      prompt:
        "A blackbody at 5800 K stands in for the solar photosphere. Where is the peak of the spectrum?",
      steps: [
        "λ_max = b / T.",
        "b = 2.898×10⁻³ m·K, so λ_max = 2.898×10⁻³ / 5800.",
        "That is 5.00×10⁻⁷ m, or 500 nm, in the green.",
      ],
      answer:
        "About 500 nm. The Sun is not a perfect blackbody, and 5800 K is a round photospheric temperature, not a definition.",
    },
    {
      title: "Coffee on a bench",
      prompt:
        "A cup at 80 °C sits in a 20 °C room. The cooling constant is 0.10 per minute. What is the temperature after 10 minutes?",
      steps: [
        "T(t) = 20 + (80 − 20) e^{−0.10 × 10}.",
        "The exponent is −1, and e⁻¹ ≈ 0.368.",
        "60 × 0.368 ≈ 22, so T ≈ 42 °C.",
      ],
      answer: "About 42 °C. The constant k belongs to this cup and this room; it is not universal.",
    },
    {
      title: "A mirror and a normal",
      prompt:
        "Light hits a mirror at 35° to the normal. What is the angle of reflection, and what is the angle to the surface?",
      steps: [
        "θᵣ = θᵢ = 35° from the normal.",
        "The angle to the surface is 90° − 35° = 55°, and that is not the angle the law uses.",
        "Incident ray, reflected ray, and normal are coplanar.",
      ],
      answer: "35° from the normal.",
    },
    {
      title: "A converging lens",
      prompt:
        "A lens has f = +10 cm. An object is 30 cm in front of it. Find the image distance and the magnification.",
      steps: [
        "1/dᵢ = 1/f − 1/dₒ = 1/10 − 1/30 = 1/15.",
        "dᵢ = +15 cm, so the image is real, 15 cm past the lens.",
        "m = −dᵢ/dₒ = −15/30 = −1/2. The image is inverted and half as tall.",
      ],
      answer: "15 cm beyond the lens, inverted, half the object’s height.",
    },
    {
      title: "A series loop",
      prompt:
        "A 12 V battery is in series with a 4.0 Ω resistor and an 8.0 Ω resistor. Check Kirchhoff’s loop rule.",
      steps: [
        "The current is 12 / 12 = 1.0 A.",
        "The drops are IR = 4.0 V and 8.0 V.",
        "Going around the loop: +12 V from the battery, then −4 V, then −8 V. The sum is zero.",
      ],
      answer:
        "The changes sum to zero. At every point in this single loop the current in equals the current out, which is the junction rule with nowhere else to go.",
    },
    {
      title: "Charge and energy on a capacitor",
      prompt: "A 100 μF capacitor is charged to 12 V. Find the charge and the stored energy.",
      steps: [
        "C = 1.00×10⁻⁴ F.",
        "Q = CV = 1.00×10⁻⁴ × 12 = 1.2×10⁻³ C.",
        "U = ½CV² = ½ × 1.00×10⁻⁴ × 144 = 7.2×10⁻³ J.",
      ],
      answer: "1.2 mC, and 7.2 mJ.",
    },
    {
      title: "Flux of a point charge",
      prompt:
        "How much electric flux passes through any closed surface around a 1.00 μC point charge?",
      steps: [
        "Gauss’s law says the flux is Q/ε₀, and the shape of the surface does not matter.",
        "ε₀ = 8.854×10⁻¹² C²/(N·m²).",
        "Flux = 1.00×10⁻⁶ / 8.854×10⁻¹² = 1.13×10⁵ N·m²/C.",
      ],
      answer: "1.13×10⁵ N·m²/C outward if the charge is positive.",
    },
    {
      title: "Field of a long wire",
      prompt: "A long straight wire carries 10 A. Find B at 2.0 cm, ignoring displacement current.",
      steps: [
        "B = μ₀ I / (2πr), with μ₀/(2π) = 2.0×10⁻⁷ T·m/A.",
        "B = 2.0×10⁻⁷ × 10 / 0.020.",
        "That is 1.0×10⁻⁴ T.",
      ],
      answer:
        "1.0×10⁻⁴ T, circling the wire. The displacement-current term is zero because the electric flux is not changing.",
    },
    {
      title: "A step-down transformer",
      prompt:
        "A primary of 600 turns is connected to 120 V. The secondary has 60 turns. Find the secondary voltage, and the secondary current if the primary draws 0.50 A, ideally.",
      steps: [
        "Vₛ = Vₚ × Nₛ/Nₚ = 120 × 60/600 = 12 V.",
        "Power balance: Iₛ = Iₚ × Nₚ/Nₛ = 0.50 × 10 = 5.0 A.",
        "Real transformers drop some of that in resistance and leakage.",
      ],
      answer: "12 V and 5.0 A.",
    },
    {
      title: "A metre stick at 0.8c",
      prompt:
        "A rod has proper length 1.00 m. How long is it in a frame where it moves lengthwise at 0.80c?",
      steps: ["v/c = 0.80, so v²/c² = 0.64.", "√(1 − 0.64) = √0.36 = 0.60.", "L = 0.60 m."],
      answer: "0.60 m. Lengths perpendicular to the motion are unchanged.",
    },
    {
      title: "The smallest momentum spread",
      prompt:
        "A preparation localizes a particle to about 0.10 nm. What is the minimum spread in momentum?",
      steps: [
        "Δx Δp ≥ ℏ/2.",
        "ℏ/2 ≈ 5.27×10⁻³⁵ J·s, and Δx = 1.0×10⁻¹⁰ m.",
        "Δp ≥ 5.3×10⁻²⁵ kg·m/s.",
      ],
      answer:
        "At least about 5.3×10⁻²⁵ kg·m/s. A smaller momentum spread would require a larger position spread.",
    },
    {
      title: "The n = 2 level of hydrogen",
      prompt: "Find the Bohr energy for n = 2.",
      steps: ["Eₙ = −13.6 eV / n².", "n² = 4.", "E₂ = −3.40 eV."],
      answer:
        "−3.40 eV. The ground state is −13.6 eV, so the jump from n = 2 to n = 1 releases 10.2 eV.",
    },
    {
      title: "The red hydrogen line",
      prompt: "Find the wavelength of the jump from n = 3 to n = 2.",
      steps: [
        "1/λ = R (1/4 − 1/9) = R × 5/36.",
        "R × 5/36 ≈ 1.097×10⁷ × 0.13889 ≈ 1.524×10⁶ m⁻¹.",
        "λ ≈ 656 nm.",
      ],
      answer: "656 nm, the red Balmer line.",
    },
    {
      title: "One half-life",
      prompt:
        "A sample starts with 1000 nuclei. How many remain after one half-life, and what is λ if the half-life is 5730 years?",
      steps: [
        "After one half-life, N = N₀/2 = 500.",
        "λ = ln 2 / t½.",
        "ln 2 ≈ 0.693, so λ ≈ 0.693 / 5730 ≈ 1.21×10⁻⁴ per year.",
      ],
      answer:
        "500 nuclei remain. The decay constant is about 1.21×10⁻⁴ yr⁻¹. These defaults are the carbon-14 half-life.",
    },
    {
      title: "A first-order Bragg peak",
      prompt:
        "X-rays of wavelength 0.154 nm strike planes spaced 0.200 nm apart. Find the glancing angle of the n = 1 peak.",
      steps: [
        "sin θ = nλ / (2d) = 0.154 / 0.400 = 0.385.",
        "θ = arcsin(0.385) ≈ 22.6°.",
        "The second order would need sin θ = 0.770, which is allowed; a much longer wavelength might not be.",
      ],
      answer: "About 22.6°.",
    },
    {
      title: "A galaxy at 10 Mpc",
      prompt: "Using H₀ = 70 km/s/Mpc, what recession speed does Hubble’s law give at 10 Mpc?",
      steps: [
        "v = H₀ d = 70 × 10.",
        "v = 700 km/s.",
        "If H₀ is 67, the speed is 670 km/s. If H₀ is 73, it is 730 km/s. The law does not decide which.",
      ],
      answer:
        "700 km/s at the value of H₀ you inserted. The present measurements do not agree on that value at the level of a few km/s/Mpc.",
    },
    {
      title: "A puck on ice",
      prompt:
        "A hockey puck slides at 3.0 m/s on ice you are treating as frictionless. What is its acceleration, and its speed 4.0 s later?",
      steps: [
        "No horizontal force, so F_net = 0 and a = 0.",
        "Constant velocity means the speed is still 3.0 m/s.",
        "The weight and the normal force cancel vertically. They are not a reason for the puck to slow down.",
      ],
      answer:
        "Acceleration 0, speed still 3.0 m/s. Any real ice has a little friction, which is a force, and then the first law no longer says the velocity is constant.",
    },
    {
      title: "Net work and a speed",
      prompt:
        "A net force of 10 N pushes a 2.0 kg block 3.0 m along the force, starting from rest. Find the final speed.",
      steps: [
        "W_net = 10 × 3.0 = 30 J.",
        "ΔK = 30 J = ½ × 2.0 × v².",
        "v² = 30, so v = √30 ≈ 5.5 m/s.",
      ],
      answer: "About 5.5 m/s. The work–energy theorem did not need the time.",
    },
    {
      title: "A skater pulls in",
      prompt:
        "A skater spinning at 2.0 rad/s has I = 2.0 kg·m². She pulls her arms in and I becomes 1.0 kg·m². Friction at the ice is ignored. Find the new spin.",
      steps: [
        "No external torque, so L is conserved.",
        "L = Iω = 2.0 × 2.0 = 4.0 kg·m²/s.",
        "ω₂ = L / I₂ = 4.0 / 1.0 = 4.0 rad/s.",
      ],
      answer: "4.0 rad/s. Her kinetic energy went up; she did work pulling her arms in.",
    },
    {
      title: "Perihelion of an ellipse",
      prompt:
        "A comet’s orbit has semimajor axis 2.0 AU and eccentricity 0.50. How close does it come to the Sun?",
      steps: [
        "Closest approach is θ = 0.",
        "r = a(1 − e²)/(1 + e) = a(1 − e).",
        "r = 2.0 × 0.50 = 1.0 AU.",
      ],
      answer: "1.0 AU. The far end, apohelion, is a(1 + e) = 3.0 AU.",
    },
    {
      title: "Equal areas",
      prompt:
        "In 10 days near perihelion a planet’s radius vector sweeps 2.0×10¹⁴ m². How much area does it sweep in 10 days near aphelion?",
      steps: [
        "dA/dt is constant by Kepler’s second law.",
        "The time interval is the same.",
        "The area is the same, 2.0×10¹⁴ m², even though the planet is slower out there.",
      ],
      answer: "2.0×10¹⁴ m². The shape of the slice changes. The area does not.",
    },
    {
      title: "A hydraulic lift",
      prompt:
        "A small piston has area 2.0 cm² and is pushed with 10 N. The large piston has area 20 cm². Find the force on the large piston.",
      steps: [
        "The areas are in the ratio 20 / 2 = 10. The units cancel.",
        "F₂ = F₁ × A₂/A₁ = 10 × 10 = 100 N.",
        "The pressure is 10 N / 2.0×10⁻⁴ m² = 5.0×10⁴ Pa on both pistons, ignoring height.",
      ],
      answer: "100 N. You pay for the extra force with a longer stroke of the small piston.",
    },
    {
      title: "A slow sphere in water",
      prompt:
        "A sphere of radius 1.0 mm moves at 2.0 cm/s through water, viscosity 1.0×10⁻³ Pa·s. Find the Stokes drag.",
      steps: [
        "r = 1.0×10⁻³ m and v = 0.020 m/s.",
        "F = 6π × 1.0×10⁻³ × 1.0×10⁻³ × 0.020.",
        "6π × 2.0×10⁻⁸ = 3.8×10⁻⁷ N.",
      ],
      answer:
        "About 3.8×10⁻⁷ N, opposing the motion. At a higher speed this laminar formula stops being the drag.",
    },
    {
      title: "Flow through a narrow tube",
      prompt:
        "Water, η = 1.0×10⁻³ Pa·s, is driven through a tube of radius 1.0 mm and length 10 cm by a pressure difference of 100 Pa. Find the volume flow.",
      steps: [
        "Q = π r⁴ ΔP / (8 η L).",
        "r⁴ = 1.0×10⁻¹². The numerator is π × 1.0×10⁻¹² × 100.",
        "The denominator is 8 × 1.0×10⁻³ × 0.10 = 8.0×10⁻⁴. Q ≈ 3.9×10⁻⁷ m³/s.",
      ],
      answer: "About 3.9×10⁻⁷ m³/s. Halving the radius would cut the flow by 16.",
    },
    {
      title: "A hole in a tank",
      prompt:
        "Water leaks from a hole 5.0 m below the surface of a large open tank. How fast does it leave? Use g = 9.8 m/s².",
      steps: ["v = √(2gh) = √(2 × 9.8 × 5.0).", "2 × 9.8 × 5.0 = 98.", "√98 ≈ 9.9 m/s."],
      answer:
        "About 9.9 m/s, the same as an object dropped 5.0 m. Viscosity and a small tank will both spoil the number.",
    },
    {
      title: "A velocity gradient",
      prompt:
        "Engine oil is not the example; water is. Viscosity 1.0×10⁻³ Pa·s, and the speed changes by 10 m/s across 1.0 m of depth. Find the shear stress.",
      steps: ["dv/dy = 10 s⁻¹.", "τ = η dv/dy = 1.0×10⁻³ × 10.", "τ = 0.010 Pa."],
      answer: "0.010 Pa. A fluid that shear-thins does not keep this η fixed.",
    },
    {
      title: "From Navier–Stokes to a pipe",
      prompt:
        "Steady flow down a straight horizontal pipe has no acceleration. What is left of the Navier–Stokes equation, and what law does it become?",
      steps: [
        "The left side is zero: nothing is speeding up, and the velocity is along the pipe.",
        "The balance is −∇P + η∇²v = 0, plus no body force along the pipe.",
        "Integrating that balance across a round pipe is Poiseuille’s law.",
      ],
      answer:
        "A pressure gradient balanced by viscous shear, which integrates to Poiseuille. Turbulence is still a solution of the same equation, just not this smooth one.",
    },
    {
      title: "Boyle, with the temperature fixed",
      prompt:
        "A gas at 1.0 atm occupies 2.0 L. It is compressed to 0.50 L at the same temperature. Find the new pressure.",
      steps: [
        "T and n are fixed, so Boyle says P₁V₁ = P₂V₂.",
        "P₂ = 1.0 × 2.0 / 0.50.",
        "P₂ = 4.0 atm.",
      ],
      answer:
        "4.0 atm. If the compression warmed the gas, Boyle does not apply and Gay-Lussac is not the whole story either; use the full ideal-gas law.",
    },
    {
      title: "A thermometer and a bath",
      prompt:
        "A thermometer in a water bath reads 25 °C and has stopped changing. A metal block is then placed against the thermometer until it too stops changing, still at 25 °C. What does the zeroth law say about the block and the bath?",
      steps: [
        "The bath and the thermometer are in equilibrium.",
        "The block and the thermometer are in equilibrium.",
        "Therefore the block and the bath are in equilibrium with each other. They are at the same temperature even if they never touch.",
      ],
      answer:
        "The block and the bath are at the same temperature. That is the entire content of the law.",
    },
    {
      title: "Melting ice, reversibly",
      prompt:
        "One kilogram of ice melts at 273 K. The latent heat is 3.34×10⁵ J/kg. Find the entropy change of the ice.",
      steps: [
        "Reversible melting at one temperature: ΔS = Q/T.",
        "Q = 3.34×10⁵ J.",
        "ΔS = 3.34×10⁵ / 273 ≈ 1.22×10³ J/K.",
      ],
      answer:
        "About 1.22×10³ J/K for the ice. If a warmer room melts it, the ice’s entropy change is the same, and the room loses less entropy than that, so the universe’s entropy rises.",
    },
    {
      title: "Why the heat capacity falls",
      prompt:
        "Dulong–Petit says a solid’s molar heat capacity is about 3R. What does the third law say must happen as T approaches 0?",
      steps: [
        "S approaches a constant.",
        "Heat capacity is T times dS/dT, roughly. A constant S means that derivative vanishes.",
        "So c must go to 0. The classical 3R cannot hold all the way down.",
      ],
      answer:
        "The heat capacity goes to zero. A perfect crystal’s residual entropy is taken to be zero; ice, with a disordered hydrogen arrangement, keeps a little.",
    },
    {
      title: "The best possible engine",
      prompt: "A heat engine runs between 600 K and 300 K. What efficiency can it not exceed?",
      steps: [
        "η = 1 − T_C/T_H = 1 − 300/600.",
        "That is 0.50.",
        "A real engine between these reservoirs is below 50%. The formula is not a target you beat with better machining.",
      ],
      answer:
        "50%. If the temperatures had been typed as 600 °C and 300 °C, the kelvin ratio would be 573/873 and the efficiency would be a different number.",
    },
    {
      title: "Heat through a pane",
      prompt:
        "A glass pane has k = 0.80 W/(m·K), area 2.0 m², and thickness 1.0 cm. One side is 20 K warmer than the other. Find the heat current.",
      steps: ["P = k A ΔT / L.", "L = 0.010 m.", "P = 0.80 × 2.0 × 20 / 0.010 = 3200 W."],
      answer: "3.2 kW, toward the cold side. The minus sign in Fourier’s law is that direction.",
    },
    {
      title: "Three times R",
      prompt: "Estimate the molar heat capacity of a metal at room temperature by Dulong–Petit.",
      steps: ["c_V ≈ 3R.", "R = 8.314 J/(mol·K).", "3R ≈ 24.9 J/(mol·K)."],
      answer: "About 25 J/(mol·K). Light atoms and low temperatures fall below this.",
    },
    {
      title: "A gray surface",
      prompt:
        "A surface absorbs 40% of the light that hits it at a wavelength where it is in thermal equilibrium. What is its emissivity there?",
      steps: [
        "Kirchhoff: ε_λ = α_λ.",
        "α_λ = 0.40.",
        "ε_λ = 0.40. It radiates 40% of what a blackbody at the same temperature radiates, at that wavelength.",
      ],
      answer: "0.40. A perfect mirror absorbs nothing and, by the same law, emits nothing.",
    },
    {
      title: "The solar peak, as a spectrum",
      prompt:
        "Planck’s law at 500 nm and 5800 K. What is the spectral radiance, roughly, and which named law is the integral of this one?",
      steps: [
        "B_λ = 2hc²/λ⁵ divided by (e^{hc/λkT} − 1).",
        "At these numbers the exponent hc/λkT is about 4.96, and B_λ is about 2.7×10¹³ W·m⁻²·sr⁻¹·m⁻¹.",
        "Per nanometre that is about 2.7×10⁴ W·m⁻²·sr⁻¹·nm⁻¹. Integrating B_λ over wavelength and over a hemisphere gives σT⁴, the Stefan–Boltzmann law.",
      ],
      answer:
        "About 2.7×10⁴ W·m⁻²·sr⁻¹·nm⁻¹. Stefan–Boltzmann is the integral, not a different physical fact.",
    },
    {
      title: "A paramagnet at room temperature",
      prompt:
        "A material has Curie constant C = 0.10 K. Find χ at 300 K, and say when the formula is the wrong one.",
      steps: [
        "χ = C/T = 0.10 / 300.",
        "χ = 3.3×10⁻⁴.",
        "If this material is ferromagnetic and 300 K is below its Curie temperature, the susceptibility is not this number.",
      ],
      answer: "3.3×10⁻⁴, and only while the material is a paramagnet in a weak field.",
    },
    {
      title: "Electric and magnetic pieces",
      prompt:
        "A proton, q = 1.6×10⁻¹⁹ C, sits at rest in an electric field of 1.0×10⁴ N/C. There is also a magnetic field. Find the force.",
      steps: [
        "v = 0, so v × B = 0 whatever B is.",
        "F = qE = 1.6×10⁻¹⁹ × 1.0×10⁴.",
        "F = 1.6×10⁻¹⁵ N, in the direction of E.",
      ],
      answer:
        "1.6×10⁻¹⁵ N. Give the proton a velocity and the magnetic term appears, perpendicular to that velocity.",
    },
    {
      title: "The center of a loop",
      prompt: "A single circular loop of radius 5.0 cm carries 2.0 A. Find B at the center.",
      steps: [
        "The Biot–Savart integral for a round loop gives B = μ₀ I / (2R).",
        "μ₀ / (2 × 0.050) × 2.0 = (4π×10⁻⁷) / 0.10 × 2.",
        "B ≈ 2.5×10⁻⁵ T.",
      ],
      answer: "About 2.5×10⁻⁵ T, perpendicular to the plane of the loop.",
    },
    {
      title: "The old ampere",
      prompt:
        "Two long wires, 1.0 m apart, each carry 1.0 A in the same direction. Find the force on each metre of wire.",
      steps: [
        "F/L = μ₀ I₁ I₂ / (2π d).",
        "μ₀/(2π) = 2.0×10⁻⁷ N/A².",
        "F/L = 2.0×10⁻⁷ N/m, attractive.",
      ],
      answer:
        "2.0×10⁻⁷ N on each metre, toward the other wire. Opposite currents would push apart.",
    },
    {
      title: "Which way the current runs",
      prompt:
        "Magnetic flux into the page through a loop is increasing at 0.20 Wb/s. Find the induced emf and the direction of the induced field.",
      steps: [
        "The magnitude is |dΦ/dt| = 0.20 V.",
        "Lenz: the induced current opposes the increase.",
        "Its own field points out of the page.",
      ],
      answer:
        "0.20 V, driving a current whose field is out of the page. The formula is Faraday’s; the direction is Lenz’s.",
    },
    {
      title: "A junction",
      prompt:
        "Two amperes enter a junction. One leaving wire carries 0.50 A. What does the other leaving wire carry?",
      steps: [
        "Charge is not accumulating at an ideal junction, so the currents sum to zero.",
        "2.0 A in, 0.50 A out on one branch.",
        "The other branch carries 1.5 A out.",
      ],
      answer: "1.5 A. This is charge conservation, and it is also Kirchhoff’s current rule.",
    },
    {
      title: "A second polarizer",
      prompt:
        "Polarized light of intensity 8.0 W/m² meets a polarizer at 60° to its polarization. What gets through?",
      steps: ["cos 60° = 1/2.", "cos² 60° = 1/4.", "I = 8.0 / 4 = 2.0 W/m²."],
      answer:
        "2.0 W/m². At 90° it would be zero. Unpolarized light through one polarizer is a different problem: half gets through, and Malus applies after that.",
    },
    {
      title: "Glass, from the air side",
      prompt: "Light in air, n = 1, hits glass, n = 1.50. Find the Brewster angle.",
      steps: ["tan θ_B = n₂/n₁ = 1.50.", "θ_B = arctan(1.50).", "θ_B ≈ 56.3° from the normal."],
      answer:
        "About 56.3°. Reflected light at that angle is polarized perpendicular to the plane of incidence.",
    },
    {
      title: "A siren coming toward you",
      prompt:
        "A siren at rest would be 400 Hz. It moves toward you at 20 m/s through still air, v = 340 m/s. You are standing still. What frequency do you hear?",
      steps: [
        "Observer still, so the numerator is just v.",
        "Source toward you, so the denominator is v − v_s = 320 m/s.",
        "f′ = 400 × 340/320 = 425 Hz.",
      ],
      answer:
        "425 Hz. If you used this formula for a star, you would be using the wrong Doppler law.",
    },
    {
      title: "A star approaching at 0.6c",
      prompt:
        "A spectral line is emitted at frequency f. The star moves straight toward you at 0.60c. What frequency do you see?",
      steps: [
        "β = 0.60. The approaching formula is f √((1+β)/(1−β)).",
        "(1.60)/(0.40) = 4.",
        "√4 = 2, so you see 2f.",
      ],
      answer: "Twice the emitted frequency, a blueshift. Receding at 0.60c would halve it.",
    },
    {
      title: "A lamp and a distance",
      prompt:
        "A 100 W lamp radiates equally in all directions, as an idealization. Find the intensity at 2.0 m.",
      steps: [
        "The area of the sphere is 4πr² = 4π × 4.0.",
        "4π × 4 ≈ 50.3 m².",
        "I = 100 / 50.3 ≈ 2.0 W/m².",
      ],
      answer: "About 2.0 W/m². A real lamp is not isotropic, and a wall is not a vacuum.",
    },
    {
      title: "Two fast frames",
      prompt:
        "A ship passes you at 0.80c. It fires a probe forward at 0.80c relative to the ship. How fast is the probe relative to you?",
      steps: [
        "u = (v + u′) / (1 + vu′/c²).",
        "Numerator 1.60c. Denominator 1 + 0.64 = 1.64.",
        "u = 0.976c, not 1.60c.",
      ],
      answer:
        "0.976c. Classical addition would have exceeded the speed of light, which this law does not allow.",
    },
    {
      title: "A photon bounced backward",
      prompt:
        "An X-ray scatters off a free electron through 180°. By how much does its wavelength grow?",
      steps: [
        "cos 180° = −1, so 1 − cos θ = 2.",
        "Δλ = 2 h/(m_e c).",
        "The Compton wavelength is 2.426×10⁻¹² m, so Δλ = 4.85×10⁻¹² m.",
      ],
      answer: "4.85×10⁻¹² m. At 90° the shift is one Compton wavelength, 2.43×10⁻¹² m.",
    },
    {
      title: "A particle in a box, as an eigenvalue",
      prompt:
        "The Schrödinger equation for an electron in a one-dimensional infinite well of width 0.100 nm has a ground-state energy h²/(8mL²). How large is that?",
      steps: [
        "This is Hψ = Eψ, the stationary form of the law, for V = 0 inside and infinite outside.",
        "L = 1.00×10⁻¹⁰ m and m = m_e.",
        "E₁ ≈ 6.02×10⁻¹⁸ J ≈ 37.6 eV.",
      ],
      answer:
        "About 37.6 eV. The number is an eigenvalue of this well. The law is the equation, not the 37.6.",
    },
    {
      title: "Surface gravity from a flux",
      prompt:
        "Treat the Earth as a sphere of mass 5.97×10²⁴ kg and radius 6.37×10⁶ m. Find g at the surface from Gauss’s law for gravity.",
      steps: [
        "By symmetry g is constant on the sphere and points in, so the flux is −g × 4πR².",
        "That equals −4πGM, so g = GM/R².",
        "g ≈ 9.82 m/s².",
      ],
      answer:
        "About 9.82 m/s². The familiar 9.81 includes the Earth’s spin and its not-quite-spherical mass. The law itself is the flux statement.",
    },
    {
      title: "The Newtonian limit, and a length",
      prompt:
        "The vacuum solution of the Einstein equation outside a spherical mass is the Schwarzschild geometry. Its characteristic radius is 2GM/c². How large is that for the Earth?",
      steps: [
        "In the weak, slow limit the field equation reduces to ∇²Φ = 4πGρ, which is Newton.",
        "The vacuum length that the same law produces outside a spherical mass is r_s = 2GM/c².",
        "For the Earth’s mass that length is about 8.9 mm.",
      ],
      answer:
        "About 8.9 mm. Nothing about the Earth is a black hole; the length is far inside the planet, where the vacuum solution does not apply.",
    },
  ],
  practice: [
    {
      q: "A 2.0 kg mass on a spring with k = 50 N/m oscillates with amplitude 0.10 m. What is the maximum restoring force?",
      a: "Hooke: F = kx at the end of the swing, 50 × 0.10 = 5.0 N, toward equilibrium. The law says nothing about the force once the spring is overstretched.",
    },
    {
      q: "An ice cube of density 917 kg/m³ is floating in fresh water. What fraction of its volume is under water?",
      a: "Floating means weight equals buoyancy, so ρ_ice V g = ρ_water V_d g. The fraction is 917/1000 = 0.917.",
    },
    {
      q: "A converging lens has f = 20 cm. An object is 20 cm in front of it. Where is the image?",
      a: "1/dᵢ = 1/20 − 1/20 = 0, so dᵢ is infinite. The rays leave parallel. The thin-lens equation is telling you the image is at infinity, not that the lens is broken.",
    },
    {
      q: "A Carnot engine takes heat at 400 K and rejects it at 300 K. What is its efficiency?",
      a: "η = 1 − 300/400 = 0.25, so 25%. Any real engine between those two reservoirs does worse.",
    },
    {
      q: "Polarized light hits a polarizer at 45°. What fraction of the intensity gets through?",
      a: "Malus: cos 45° = 1/√2, and its square is 1/2. Half the intensity is transmitted.",
    },
  ],
  pitfalls: [
    "Cancelling a third-law pair inside one free-body diagram. The two forces act on two different bodies.",
    "Using μN for static friction as if it were always at its maximum. The maximum is a ceiling, not the value.",
    "Applying Bernoulli across a propeller, a shock, or a pipe with serious friction. The constant is mechanical energy per volume, and those devices change it.",
    "Mixing the two sign conventions for work in the first law. Pick one and keep it for the whole problem.",
    "Putting Celsius into Stefan–Boltzmann or Wien. Both laws use absolute temperature.",
    "Treating H₀ as a defined constant. It is a measured parameter, and the local and cosmic routes do not currently agree.",
    "Using the sound Doppler formula for light, or adding two speeds past c. Light uses the relativistic formulas.",
    "Putting Celsius into Carnot, Wien, Stefan, Planck, or Curie. Those temperatures are absolute.",
    "Using Poiseuille or Stokes for a turbulent flow. Both are laminar results.",
    "Reading G_μν in the Einstein equation as the gravitational constant. The constant is the G on the other side.",
  ],
};
