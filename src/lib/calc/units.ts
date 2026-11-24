export type Unit = {
  id: string;
  name: string;
  symbol: string;
  toSI: (value: number) => number;
  fromSI: (si: number) => number;
};

export type Quantity = {
  id: string;
  name: string;
  dimension: string;
  si: string;
  about: string;
  units: Unit[];
};

function linear(id: string, name: string, symbol: string, perSI: number): Unit {
  return {
    id,
    name,
    symbol,
    toSI: (value) => value * perSI,
    fromSI: (si) => si / perSI,
  };
}

const u = linear;

export const quantities: Quantity[] = [
  {
    id: "length",
    name: "Length",
    dimension: "L",
    si: "metre (m)",
    about: "Distance. The metre is defined from the speed of light.",
    units: [
      u("m", "Metre", "m", 1),
      u("km", "Kilometre", "km", 1000),
      u("cm", "Centimetre", "cm", 0.01),
      u("mm", "Millimetre", "mm", 0.001),
      u("um", "Micrometre", "μm", 1e-6),
      u("nm", "Nanometre", "nm", 1e-9),
      u("A", "Ångström", "Å", 1e-10),
      u("pm", "Picometre", "pm", 1e-12),
      u("in", "Inch", "in", 0.0254),
      u("ft", "Foot", "ft", 0.3048),
      u("yd", "Yard", "yd", 0.9144),
      u("mi", "Mile", "mi", 1609.344),
      u("nmi", "Nautical mile", "nmi", 1852),
      u("au", "Astronomical unit", "au", 149597870700),
      u("ly", "Light-year", "ly", 9460730472580800),
      u("pc", "Parsec", "pc", 3.085677581491367e16),
    ],
  },
  {
    id: "area",
    name: "Area",
    dimension: "L²",
    si: "square metre (m²)",
    about: "Extent of a surface. Areas scale with the square of a length scale.",
    units: [
      u("m2", "Square metre", "m²", 1),
      u("km2", "Square kilometre", "km²", 1e6),
      u("cm2", "Square centimetre", "cm²", 1e-4),
      u("mm2", "Square millimetre", "mm²", 1e-6),
      u("ha", "Hectare", "ha", 10000),
      u("acre", "Acre", "acre", 4046.8564224),
      u("ft2", "Square foot", "ft²", 0.09290304),
      u("in2", "Square inch", "in²", 0.00064516),
      u("barn", "Barn", "b", 1e-28),
    ],
  },
  {
    id: "volume",
    name: "Volume",
    dimension: "L³",
    si: "cubic metre (m³)",
    about:
      "The litre is exactly 0.001 m³. A millilitre and a cubic centimetre are the same volume.",
    units: [
      u("m3", "Cubic metre", "m³", 1),
      u("L", "Litre", "L", 0.001),
      u("mL", "Millilitre", "mL", 1e-6),
      u("uL", "Microlitre", "μL", 1e-9),
      u("cm3", "Cubic centimetre", "cm³", 1e-6),
      u("ft3", "Cubic foot", "ft³", 0.028316846592),
      u("in3", "Cubic inch", "in³", 1.6387064e-5),
      u("gal", "US gallon", "gal", 0.003785411784),
      u("qt", "US quart", "qt", 0.000946352946),
      u("floz", "US fluid ounce", "fl oz", 2.95735295625e-5),
      u("cup", "US cup", "cup", 0.0002365882365),
    ],
  },
  {
    id: "mass",
    name: "Mass",
    dimension: "M",
    si: "kilogram (kg)",
    about: "Mass is not weight. The atomic mass unit is one twelfth the mass of a carbon-12 atom.",
    units: [
      u("kg", "Kilogram", "kg", 1),
      u("g", "Gram", "g", 0.001),
      u("mg", "Milligram", "mg", 1e-6),
      u("ug", "Microgram", "μg", 1e-9),
      u("ng", "Nanogram", "ng", 1e-12),
      u("t", "Tonne", "t", 1000),
      u("lb", "Pound", "lb", 0.45359237),
      u("oz", "Ounce", "oz", 0.028349523125),
      u("st", "Stone", "st", 6.35029318),
      u("u", "Atomic mass unit", "u", 1.6605390666e-27),
      u("slug", "Slug", "slug", 14.59390294),
    ],
  },
  {
    id: "time",
    name: "Time",
    dimension: "T",
    si: "second (s)",
    about: "The second is the SI base unit of time. A year here is the Julian year, 365.25 days.",
    units: [
      u("s", "Second", "s", 1),
      u("ms", "Millisecond", "ms", 1e-3),
      u("us", "Microsecond", "μs", 1e-6),
      u("ns", "Nanosecond", "ns", 1e-9),
      u("min", "Minute", "min", 60),
      u("h", "Hour", "h", 3600),
      u("d", "Day", "d", 86400),
      u("wk", "Week", "wk", 604800),
      u("yr", "Julian year", "yr", 31557600),
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    dimension: "Θ",
    si: "kelvin (K)",
    about:
      "Kelvin and Rankine start at absolute zero. Celsius and Fahrenheit do not, so a ratio of those readings is meaningless.",
    units: [
      {
        id: "K",
        name: "Kelvin",
        symbol: "K",
        toSI: (v) => v,
        fromSI: (k) => k,
      },
      {
        id: "C",
        name: "Celsius",
        symbol: "°C",
        toSI: (v) => v + 273.15,
        fromSI: (k) => k - 273.15,
      },
      {
        id: "F",
        name: "Fahrenheit",
        symbol: "°F",
        toSI: (v) => ((v - 32) * 5) / 9 + 273.15,
        fromSI: (k) => ((k - 273.15) * 9) / 5 + 32,
      },
      {
        id: "R",
        name: "Rankine",
        symbol: "°R",
        toSI: (v) => (v * 5) / 9,
        fromSI: (k) => (k * 9) / 5,
      },
    ],
  },
  {
    id: "amount",
    name: "Amount of substance",
    dimension: "N",
    si: "mole (mol)",
    about:
      "A mole is exactly 6.02214076×10²³ entities. Mass and amount are different quantities: grams become moles only through a molar mass.",
    units: [
      u("mol", "Mole", "mol", 1),
      u("mmol", "Millimole", "mmol", 1e-3),
      u("umol", "Micromole", "μmol", 1e-6),
      u("nmol", "Nanomole", "nmol", 1e-9),
      u("kmol", "Kilomole", "kmol", 1000),
      u("particle", "Entity", "entities", 1 / 6.02214076e23),
      u("dozen", "Dozen entities", "dozen", 12 / 6.02214076e23),
    ],
  },
  {
    id: "frequency",
    name: "Frequency",
    dimension: "T⁻¹",
    si: "hertz (Hz)",
    about: "Cycles per second. Revolutions per minute are a frequency too: divide by 60.",
    units: [
      u("Hz", "Hertz", "Hz", 1),
      u("kHz", "Kilohertz", "kHz", 1e3),
      u("MHz", "Megahertz", "MHz", 1e6),
      u("GHz", "Gigahertz", "GHz", 1e9),
      u("THz", "Terahertz", "THz", 1e12),
      u("rpm", "Revolutions per minute", "rpm", 1 / 60),
    ],
  },
  {
    id: "angle",
    name: "Angle",
    dimension: "1",
    si: "radian (rad)",
    about:
      "A radian is an arc length divided by a radius. Trigonometric functions in analysis expect radians.",
    units: [
      u("rad", "Radian", "rad", 1),
      u("deg", "Degree", "°", Math.PI / 180),
      u("arcmin", "Arcminute", "′", Math.PI / 10800),
      u("arcsec", "Arcsecond", "″", Math.PI / 648000),
      u("grad", "Gradian", "gon", Math.PI / 200),
      u("turn", "Turn", "turn", 2 * Math.PI),
    ],
  },
  {
    id: "speed",
    name: "Speed",
    dimension: "L T⁻¹",
    si: "metre per second (m/s)",
    about: "Speed is distance over time. c is exactly 299,792,458 m/s.",
    units: [
      u("mps", "Metre per second", "m/s", 1),
      u("kmh", "Kilometre per hour", "km/h", 1000 / 3600),
      u("mph", "Mile per hour", "mph", 1609.344 / 3600),
      u("fts", "Foot per second", "ft/s", 0.3048),
      u("kn", "Knot", "kn", 1852 / 3600),
      u("kms", "Kilometre per second", "km/s", 1000),
      u("c", "Speed of light", "c", 299792458),
    ],
  },
  {
    id: "acceleration",
    name: "Acceleration",
    dimension: "L T⁻²",
    si: "metre per second squared (m/s²)",
    about:
      "Standard gravity is exactly 9.80665 m/s². It is a conventional value, not the local field.",
    units: [
      u("mps2", "Metre per second squared", "m/s²", 1),
      u("g", "Standard gravity", "g", 9.80665),
      u("fts2", "Foot per second squared", "ft/s²", 0.3048),
      u("gal", "Galileo", "Gal", 0.01),
    ],
  },
  {
    id: "force",
    name: "Force",
    dimension: "M L T⁻²",
    si: "newton (N)",
    about:
      "A newton accelerates one kilogram at one metre per second squared. Kilogram-force already folds in standard gravity.",
    units: [
      u("N", "Newton", "N", 1),
      u("kN", "Kilonewton", "kN", 1000),
      u("dyn", "Dyne", "dyn", 1e-5),
      u("kgf", "Kilogram-force", "kgf", 9.80665),
      u("lbf", "Pound-force", "lbf", 4.4482216152605),
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    dimension: "M L⁻¹ T⁻²",
    si: "pascal (Pa)",
    about:
      "A pascal is one newton per square metre. One standard atmosphere is exactly 101,325 Pa.",
    units: [
      u("Pa", "Pascal", "Pa", 1),
      u("kPa", "Kilopascal", "kPa", 1e3),
      u("MPa", "Megapascal", "MPa", 1e6),
      u("bar", "Bar", "bar", 1e5),
      u("mbar", "Millibar", "mbar", 100),
      u("atm", "Atmosphere", "atm", 101325),
      u("torr", "Torr", "Torr", 101325 / 760),
      u("mmHg", "Millimetre of mercury", "mmHg", 133.322387415),
      u("psi", "Pound per square inch", "psi", 6894.757293168),
      u("inHg", "Inch of mercury", "inHg", 3386.389),
    ],
  },
  {
    id: "energy",
    name: "Energy",
    dimension: "M L² T⁻²",
    si: "joule (J)",
    about:
      "Work, heat, and kinetic energy share this dimension. The thermochemical calorie is 4.184 J. The electronvolt uses the exact elementary charge.",
    units: [
      u("J", "Joule", "J", 1),
      u("kJ", "Kilojoule", "kJ", 1e3),
      u("MJ", "Megajoule", "MJ", 1e6),
      u("cal", "Calorie", "cal", 4.184),
      u("kcal", "Kilocalorie", "kcal", 4184),
      u("eV", "Electronvolt", "eV", 1.602176634e-19),
      u("keV", "Kiloelectronvolt", "keV", 1.602176634e-16),
      u("MeV", "Megaelectronvolt", "MeV", 1.602176634e-13),
      u("GeV", "Gigaelectronvolt", "GeV", 1.602176634e-10),
      u("Wh", "Watt-hour", "Wh", 3600),
      u("kWh", "Kilowatt-hour", "kWh", 3.6e6),
      u("BTU", "British thermal unit", "BTU", 1055.05585262),
      u("erg", "Erg", "erg", 1e-7),
      u("ftlbf", "Foot-pound", "ft·lbf", 1.3558179483314),
    ],
  },
  {
    id: "power",
    name: "Power",
    dimension: "M L² T⁻³",
    si: "watt (W)",
    about: "Energy per time. Mechanical horsepower is 745.69987158227022 W.",
    units: [
      u("W", "Watt", "W", 1),
      u("kW", "Kilowatt", "kW", 1e3),
      u("MW", "Megawatt", "MW", 1e6),
      u("hp", "Horsepower", "hp", 745.6998715822702),
      u("cals", "Calorie per second", "cal/s", 4.184),
      u("BTUh", "BTU per hour", "BTU/h", 1055.05585262 / 3600),
    ],
  },
  {
    id: "charge",
    name: "Electric charge",
    dimension: "T I",
    si: "coulomb (C)",
    about:
      "The elementary charge is exactly 1.602176634×10⁻¹⁹ C. An ampere-hour is the charge of one ampere flowing for one hour.",
    units: [
      u("C", "Coulomb", "C", 1),
      u("mC", "Millicoulomb", "mC", 1e-3),
      u("uC", "Microcoulomb", "μC", 1e-6),
      u("nC", "Nanocoulomb", "nC", 1e-9),
      u("e", "Elementary charge", "e", 1.602176634e-19),
      u("Ah", "Ampere-hour", "A·h", 3600),
      u("mAh", "Milliampere-hour", "mA·h", 3.6),
    ],
  },
  {
    id: "current",
    name: "Electric current",
    dimension: "I",
    si: "ampere (A)",
    about: "Charge per time. The ampere is an SI base unit.",
    units: [
      u("A", "Ampere", "A", 1),
      u("mA", "Milliampere", "mA", 1e-3),
      u("uA", "Microampere", "μA", 1e-6),
      u("nA", "Nanoampere", "nA", 1e-9),
      u("kA", "Kiloampere", "kA", 1e3),
    ],
  },
  {
    id: "voltage",
    name: "Electric potential",
    dimension: "M L² T⁻³ I⁻¹",
    si: "volt (V)",
    about: "Energy per charge. One volt pushes one joule into each coulomb.",
    units: [
      u("V", "Volt", "V", 1),
      u("mV", "Millivolt", "mV", 1e-3),
      u("uV", "Microvolt", "μV", 1e-6),
      u("kV", "Kilovolt", "kV", 1e3),
      u("MV", "Megavolt", "MV", 1e6),
    ],
  },
  {
    id: "resistance",
    name: "Resistance",
    dimension: "M L² T⁻³ I⁻²",
    si: "ohm (Ω)",
    about: "Potential difference per current, from Ohm’s law.",
    units: [
      u("ohm", "Ohm", "Ω", 1),
      u("mohm", "Milliohm", "mΩ", 1e-3),
      u("kohm", "Kilohm", "kΩ", 1e3),
      u("Mohm", "Megohm", "MΩ", 1e6),
    ],
  },
  {
    id: "capacitance",
    name: "Capacitance",
    dimension: "M⁻¹ L⁻² T⁴ I²",
    si: "farad (F)",
    about:
      "Charge stored per volt. A farad is large; laboratory capacitors are usually microfarads or smaller.",
    units: [
      u("F", "Farad", "F", 1),
      u("mF", "Millifarad", "mF", 1e-3),
      u("uF", "Microfarad", "μF", 1e-6),
      u("nF", "Nanofarad", "nF", 1e-9),
      u("pF", "Picofarad", "pF", 1e-12),
    ],
  },
  {
    id: "efield",
    name: "Electric field",
    dimension: "M L T⁻³ I⁻¹",
    si: "volt per metre (V/m)",
    about: "Force per charge. A newton per coulomb is the same unit as a volt per metre.",
    units: [
      u("Vpm", "Volt per metre", "V/m", 1),
      u("Vpcm", "Volt per centimetre", "V/cm", 100),
      u("kVpm", "Kilovolt per metre", "kV/m", 1000),
      u("NC", "Newton per coulomb", "N/C", 1),
    ],
  },
  {
    id: "bfield",
    name: "Magnetic field",
    dimension: "M T⁻² I⁻¹",
    si: "tesla (T)",
    about: "The tesla is a large field. The gauss of cgs electromagnetism is 10⁻⁴ T.",
    units: [
      u("T", "Tesla", "T", 1),
      u("mT", "Millitesla", "mT", 1e-3),
      u("uT", "Microtesla", "μT", 1e-6),
      u("nT", "Nanotesla", "nT", 1e-9),
      u("G", "Gauss", "G", 1e-4),
    ],
  },
  {
    id: "density",
    name: "Mass density",
    dimension: "M L⁻³",
    si: "kilogram per cubic metre (kg/m³)",
    about: "Mass per volume. Water near 4 °C is about 1000 kg/m³, which is 1 g/cm³.",
    units: [
      u("kgm3", "Kilogram per cubic metre", "kg/m³", 1),
      u("gcm3", "Gram per cubic centimetre", "g/cm³", 1000),
      u("gL", "Gram per litre", "g/L", 1),
      u("kgL", "Kilogram per litre", "kg/L", 1000),
      u("lbft3", "Pound per cubic foot", "lb/ft³", 16.01846337),
      u("lbgal", "Pound per US gallon", "lb/gal", 119.826427),
    ],
  },
  {
    id: "molarity",
    name: "Molar concentration",
    dimension: "N L⁻³",
    si: "mole per cubic metre (mol/m³)",
    about:
      "Amount per volume. A 1 M solution is 1 mol/L, which is 1000 mol/m³. This is not a mass concentration.",
    units: [
      u("molm3", "Mole per cubic metre", "mol/m³", 1),
      u("M", "Molar", "mol/L", 1000),
      u("mM", "Millimolar", "mmol/L", 1),
      u("uM", "Micromolar", "μmol/L", 0.001),
      u("nM", "Nanomolar", "nmol/L", 1e-6),
    ],
  },
  {
    id: "massconc",
    name: "Mass concentration",
    dimension: "M L⁻³",
    si: "kilogram per cubic metre (kg/m³)",
    about:
      "Mass of solute per volume of solution. Turning this into molarity requires the molar mass.",
    units: [
      u("kgm3", "Kilogram per cubic metre", "kg/m³", 1),
      u("gL", "Gram per litre", "g/L", 1),
      u("mgL", "Milligram per litre", "mg/L", 0.001),
      u("ugmL", "Microgram per millilitre", "μg/mL", 1),
      u("gmL", "Gram per millilitre", "g/mL", 1000),
    ],
  },
  {
    id: "fraction",
    name: "Fraction and parts",
    dimension: "1",
    si: "one (a pure ratio)",
    about:
      "A dimensionless ratio. Here 1 ppm means 10⁻⁶ of the whole, as a mole fraction or a mass fraction. It is not automatically mg/L.",
    units: [
      u("one", "Fraction", "1", 1),
      u("percent", "Percent", "%", 0.01),
      u("permille", "Permille", "‰", 0.001),
      u("ppm", "Parts per million", "ppm", 1e-6),
      u("ppb", "Parts per billion", "ppb", 1e-9),
      u("ppt", "Parts per trillion", "ppt", 1e-12),
    ],
  },
  {
    id: "molarmass",
    name: "Molar mass",
    dimension: "M N⁻¹",
    si: "kilogram per mole (kg/mol)",
    about:
      "Mass per amount. A molar mass of 18.015 g/mol is 0.018015 kg/mol. The number looks the same as the molecular mass in u.",
    units: [
      u("kgmol", "Kilogram per mole", "kg/mol", 1),
      u("gmol", "Gram per mole", "g/mol", 0.001),
      u("mgmmol", "Milligram per millimole", "mg/mmol", 0.001),
    ],
  },
  {
    id: "specificheat",
    name: "Specific heat",
    dimension: "L² T⁻² Θ⁻¹",
    si: "joule per kilogram kelvin (J/(kg·K))",
    about:
      "Heat to raise the temperature of a unit mass by one degree. A kelvin and a degree Celsius are the same size.",
    units: [
      u("si", "Joule per kilogram kelvin", "J/(kg·K)", 1),
      u("kJ", "Kilojoule per kilogram kelvin", "kJ/(kg·K)", 1000),
      u("cal", "Calorie per gram", "cal/(g·°C)", 4184),
    ],
  },
  {
    id: "wavenumber",
    name: "Wavenumber",
    dimension: "L⁻¹",
    si: "reciprocal metre (m⁻¹)",
    about:
      "Reciprocal wavelength, the spectroscopist’s usual coordinate. One reciprocal centimetre is 100 m⁻¹.",
    units: [u("m", "Per metre", "m⁻¹", 1), u("cm", "Per centimetre", "cm⁻¹", 100)],
  },
  {
    id: "viscosity",
    name: "Dynamic viscosity",
    dimension: "M L⁻¹ T⁻¹",
    si: "pascal second (Pa·s)",
    about: "Shear stress per velocity gradient. Water at 20 °C is about 1 centipoise.",
    units: [
      u("Pas", "Pascal second", "Pa·s", 1),
      u("cP", "Centipoise", "cP", 0.001),
      u("P", "Poise", "P", 0.1),
    ],
  },
  {
    id: "activity",
    name: "Radioactivity",
    dimension: "T⁻¹",
    si: "becquerel (Bq)",
    about: "Decays per second. One curie is exactly 3.7×10¹⁰ Bq.",
    units: [
      u("Bq", "Becquerel", "Bq", 1),
      u("kBq", "Kilobecquerel", "kBq", 1e3),
      u("MBq", "Megabecquerel", "MBq", 1e6),
      u("GBq", "Gigabecquerel", "GBq", 1e9),
      u("Ci", "Curie", "Ci", 3.7e10),
      u("mCi", "Millicurie", "mCi", 3.7e7),
      u("uCi", "Microcurie", "μCi", 3.7e4),
    ],
  },
  {
    id: "dose",
    name: "Absorbed dose",
    dimension: "L² T⁻²",
    si: "gray (Gy)",
    about: "Energy deposited per mass. One gray is one joule per kilogram. The rad is 0.01 Gy.",
    units: [
      u("Gy", "Gray", "Gy", 1),
      u("mGy", "Milligray", "mGy", 1e-3),
      u("rad", "Rad", "rad", 0.01),
      u("mrad", "Millirad", "mrad", 1e-5),
    ],
  },
  {
    id: "doseeq",
    name: "Dose equivalent",
    dimension: "L² T⁻²",
    si: "sievert (Sv)",
    about:
      "Absorbed dose weighted for biological effect. One rem is 0.01 Sv. The dimension matches energy per mass; the weighting is a judgment, not a new dimension.",
    units: [
      u("Sv", "Sievert", "Sv", 1),
      u("mSv", "Millisievert", "mSv", 1e-3),
      u("uSv", "Microsievert", "μSv", 1e-6),
      u("rem", "Rem", "rem", 0.01),
      u("mrem", "Millirem", "mrem", 1e-5),
    ],
  },
  {
    id: "torque",
    name: "Torque",
    dimension: "M L² T⁻²",
    si: "newton metre (N·m)",
    about:
      "A force times a lever arm. The dimension matches energy, but a newton metre of torque is not a joule of work until something rotates.",
    units: [
      u("Nm", "Newton metre", "N·m", 1),
      u("lbft", "Pound-foot", "lbf·ft", 1.3558179483314),
      u("lbin", "Pound-inch", "lbf·in", 0.112984829861),
    ],
  },
  {
    id: "momentum",
    name: "Momentum",
    dimension: "M L T⁻¹",
    si: "kilogram metre per second (kg·m/s)",
    about: "Mass times velocity, in Newtonian mechanics.",
    units: [
      u("si", "Kilogram metre per second", "kg·m/s", 1),
      u("gcms", "Gram centimetre per second", "g·cm/s", 1e-5),
    ],
  },
];

export const quantityById = new Map(quantities.map((quantity) => [quantity.id, quantity]));

export function unitById(quantity: Quantity, id: string): Unit | undefined {
  return quantity.units.find((unit) => unit.id === id);
}

export function convert(
  quantityId: string,
  value: number,
  fromId: string,
  toId: string,
): number | null {
  const quantity = quantityById.get(quantityId);
  if (!quantity || !Number.isFinite(value)) return null;
  const from = unitById(quantity, fromId);
  const to = unitById(quantity, toId);
  if (!from || !to) return null;
  return to.fromSI(from.toSI(value));
}

export const benchConstants: { symbol: string; name: string; value: string }[] = [
  { symbol: "c", name: "Speed of light", value: "299,792,458 m/s" },
  { symbol: "h", name: "Planck constant", value: "6.62607015×10⁻³⁴ J·s" },
  { symbol: "e", name: "Elementary charge", value: "1.602176634×10⁻¹⁹ C" },
  { symbol: "k", name: "Boltzmann constant", value: "1.380649×10⁻²³ J/K" },
  { symbol: "Nₐ", name: "Avogadro constant", value: "6.02214076×10²³ /mol" },
  { symbol: "R", name: "Gas constant", value: "8.314462618 J/(mol·K)" },
  { symbol: "F", name: "Faraday constant", value: "96,485.3321 C/mol" },
  { symbol: "g", name: "Standard gravity", value: "9.80665 m/s²" },
  { symbol: "G", name: "Gravitational constant", value: "6.67430×10⁻¹¹ N·m²/kg²" },
  { symbol: "kₑ", name: "Coulomb constant", value: "8.9875517923×10⁹ N·m²/C²" },
  { symbol: "atm", name: "Standard atmosphere", value: "101,325 Pa" },
];
