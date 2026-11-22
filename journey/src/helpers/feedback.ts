type FeedbackEntry = string | { heading: string; subtitle?: string };

interface FeedbackTier {
  messages: FeedbackEntry[];
  tier: number;
}

export interface FeedbackMessage {
  heading: string;
  subtitle?: string;
}

export const pickFeedback = (
  tiers: FeedbackTier[],
  completedWeeks: number,
): FeedbackMessage => {
  let tier = 1;

  if (completedWeeks < 2) {
    tier = 0;
  } else if (completedWeeks < 4) {
    tier = 1;
  } else if (completedWeeks < 7) {
    tier = 2;
  } else if (completedWeeks < 13) {
    tier = 3;
  } else if (completedWeeks < 19) {
    tier = 4;
  } else if (completedWeeks < 20) {
    tier = 5;
  } else {
    tier = 6;
  }

  const messages = tiers.find((item) => item.tier === tier)?.messages ?? [];
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * messages.length);
  const entry = messages.at(randomIndex);

  if (typeof entry === 'string') return { heading: entry };

  return entry ?? { heading: '' };
};
