type FeedbackEntry = string | { heading: string; subtitle?: string };

interface FeedbackTier {
  fromWeek: number;
  messages: FeedbackEntry[];
  subtitle?: string;
}

export interface FeedbackMessage {
  heading: string;
  subtitle?: string;
}

// Tiers must be sorted by `fromWeek`. The last tier that has been reached wins.
// A tier `subtitle` is the default for its messages and may contain `{weeks}`.
export const pickFeedback = (
  tiers: FeedbackTier[],
  completedWeeks: number,
): FeedbackMessage => {
  const tier = tiers.findLast((item) => completedWeeks >= item.fromWeek);
  const messages = tier?.messages ?? [];
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * messages.length);
  const entry = messages.at(randomIndex);

  const message: FeedbackMessage =
    typeof entry === 'string' ? { heading: entry } : (entry ?? { heading: '' });

  return {
    ...message,
    subtitle:
      message.subtitle ??
      tier?.subtitle?.replace('{weeks}', String(completedWeeks)),
  };
};
