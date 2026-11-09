// Test-Pi has 7 decimals: contract prices are integers in its smallest unit
const DECIMALS = 7;
const UNITS_PER_PI = 10n ** BigInt(DECIMALS);

// 1000000n -> "0.1", 35000000n -> "3.5"
export const formatPi = (units: bigint) => {
  const sign = units < 0n ? "-" : "";
  const abs = units < 0n ? -units : units;
  const whole = abs / UNITS_PER_PI;
  const fraction = (abs % UNITS_PER_PI).toString().padStart(DECIMALS, "0").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""}`;
};

const DAY = 86400;
// largest unit first: a period is named in the largest unit it is a whole number of. A month is the
// mean Gregorian month (2,629,746 s), so 12 months and a 365-day year get different words.
const PERIOD_UNITS: [seconds: number, singular: string, plural: string][] = [
  [365 * DAY, "year", "years"],
  [2629746, "month", "months"],
  [7 * DAY, "week", "weeks"],
  [DAY, "day", "days"],
  [3600, "hour", "hours"],
  [60, "minute", "minutes"],
  [1, "second", "seconds"],
];

type PeriodWords = {
  // "every week", "every 30 days"
  every: string;
  // "/week", "/30 days"
  per: string;
  // "1 week", "30 days"
  span: string;
};

export const describePeriod = (seconds: number): PeriodWords => {
  // contract periods are whole seconds, and the last unit (1 second) divides every whole number
  const [unit, singular, plural] = PERIOD_UNITS.find(([unitSeconds]) => seconds % unitSeconds === 0)!;
  const count = seconds / unit;
  if (count === 1) {
    return { every: `every ${singular}`, per: `/${singular}`, span: `1 ${singular}` };
  }
  return { every: `every ${count} ${plural}`, per: `/${count} ${plural}`, span: `${count} ${plural}` };
};

// "Oct 28", or "Oct 28, 2027" outside the current year
export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== new Date().getFullYear() ? { year: "numeric" } : {}),
  });

// contract timestamps are unix seconds
export const fromChainTime = (timestamp: string) => new Date(Number(timestamp) * 1000);

// a date the contract recorded, as the screens show it
export const chainDate = (timestamp: string) => formatDate(fromChainTime(timestamp));

// an amount in Test-Pi's smallest unit, with its unit
export const formatTestPi = (units: bigint) => `${formatPi(units)} Test-Pi`;

export const shortAddress = (address: string) => `${address.slice(0, 4)}…${address.slice(-4)}`;
