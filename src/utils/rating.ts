import { IdeaInput } from '../types/idea';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function generateFakeAiRating(input: IdeaInput): number {
  const words = input.description.trim().split(/\s+/).filter(Boolean).length;
  const noveltyBoost = Math.min(15, Math.floor(words / 8));
  const clarityBoost = input.tagline.length > 20 ? 8 : 4;
  const seed = input.name.length * 7 + input.tagline.length * 5 + input.description.length * 3;
  const randomSwing = Math.floor(Math.random() * 21) - 10;

  const rawScore = 55 + noveltyBoost + clarityBoost + (seed % 18) + randomSwing;
  return clamp(rawScore, 0, 100);
}
