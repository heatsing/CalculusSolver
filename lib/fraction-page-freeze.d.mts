export function fractionCandidateKey(candidate: { numerator: number; denominator: number }): string;

export function frozenInventoryMatches(
  existing: readonly { numerator: number; denominator: number }[],
  publishedKeys: readonly string[]
): boolean;

export function selectPublishableCandidates<T extends { numerator: number; denominator: number }>(
  candidates: readonly T[],
  publishedKeys: readonly string[],
  generateNew: boolean
): T[];
