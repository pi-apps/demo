// contract values can be BigInt, which JSON.stringify can't handle on its own
export const toJSON = (value: unknown) =>
  JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? v.toString() : v), 2);
