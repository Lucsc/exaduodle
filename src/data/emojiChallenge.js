import { EMOJIS } from "./emojis";


function getDaySeed() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return (today.getFullYear() * 1000 + dayOfYear) >>> 0;
}

function lcgNext(s) {
  return ((s * 1664525 + 1013904223) & 0xffffffff) >>> 0;
}

/**
 * Build emoji sequence: start with emojiCompliquer, then add emojiSimple at the end
 * Priority: use all emojiCompliquer first, then fill with emojiSimple if needed
 */
function buildEmojiSequence(emojiData) {
  const sequence = [];
  
  // Add all emojiCompliquer first
  if (emojiData.emojiCompliquer && emojiData.emojiCompliquer.length > 0) {
    sequence.push(...emojiData.emojiCompliquer);
  }
  
  // Add emojiSimple only if we need more emojis (up to 4 total)
  const remainingSlots = 4 - sequence.length;
  if (remainingSlots > 0 && emojiData.emojiSimple && emojiData.emojiSimple.length > 0) {
    const simpleCount = Math.min(remainingSlots, emojiData.emojiSimple.length);
    sequence.push(...emojiData.emojiSimple.slice(0, simpleCount));
  }
  
  return sequence.slice(0, 4);
}

export function getEmojiCandidates(entities) {
  return entities.filter((entity) =>
    EMOJIS.some((emoji) => emoji.id === entity.id)
  );
}

export function createRandomEmojiChallenge(entities, excludedIds = []) {
  const availableCandidates = getEmojiCandidates(entities).filter(
    (entity) => !excludedIds.includes(entity.id)
  );

  if (availableCandidates.length === 0) {
    return null;
  }

  const seed = lcgNext(getDaySeed() * 7);
  const target = availableCandidates[seed % availableCandidates.length];
  const emojiData = EMOJIS.find((emoji) => emoji.id === target.id);
  
  if (!emojiData) {
    return null;
  }

  const emojiSequence = buildEmojiSequence(emojiData);
  
  if (emojiSequence.length === 0) {
    return null;
  }

  return {
    entityId: target.id,
    emojiSequence,
  };
}

export function isEmojiChallengeValid(challenge, entities) {
  if (!challenge?.entityId || !challenge?.emojiSequence || challenge.emojiSequence.length === 0) {
    return false;
  }

  return getEmojiCandidates(entities).some((entity) => entity.id === challenge.entityId);
}
