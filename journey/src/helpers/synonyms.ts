type FeedbackWord = string | { heading: string; subtitle?: string };

type FeedbackHeading = {
  tier: number;
  words: FeedbackWord[];
}[];

export interface FeedbackText {
  heading: string;
  subtitle?: string;
}

export const getHeading = (
  feedbackHeading: FeedbackHeading,
  completedWeeks: number,
): FeedbackText => {
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

  const wordList =
    feedbackHeading.find((item) => item.tier === tier)?.words ?? [];
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList.at(randomIndex);

  if (typeof word === 'string') return { heading: word };

  return word ?? { heading: '' };
};

export const getHeadingSize = (sentence: string) => {
  const sentenceLength = sentence.length;
  const longestWord = getLongestWord(sentence);
  const length = longestWord.length;
  let headingSize;

  if (length < 5 && sentenceLength < 15) {
    headingSize = 'l';
  } else if (length < 6 && sentenceLength < 18) {
    headingSize = 'm';
  } else if (length < 7 && sentenceLength < 21) {
    headingSize = 's';
  } else if (length < 9 && sentenceLength < 27) {
    headingSize = 'xs';
  } else {
    headingSize = 'xxs';
  }

  return headingSize;
};

const getLongestWord = (sentence: string) => {
  const words = sentence.split(' ');

  const longestWord = words.reduce(
    (champ, contender) => (contender.length > champ.length ? contender : champ),
    '',
  );

  return longestWord;
};
