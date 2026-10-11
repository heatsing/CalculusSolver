/** Shared stop-generation gate for thin percent and equivalent-fraction pages. */

export function fractionCandidateKey(candidate) {
  return `${candidate.numerator}/${candidate.denominator}`;
}

export function frozenInventoryMatches(existing, publishedKeys) {
  const existingKeys = existing.map(fractionCandidateKey);
  return existingKeys.length === publishedKeys.length && existingKeys.every((key, index) => key === publishedKeys[index]);
}

export function selectPublishableCandidates(candidates, publishedKeys, generateNew) {
  if (generateNew === true) return [...candidates];
  const allowed = new Set(publishedKeys);
  return candidates.filter((candidate) => allowed.has(fractionCandidateKey(candidate)));
}
