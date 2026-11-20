type FeedbackHeading = {
  tier: number;
  words: string[];
}[];

export const getHeading = (
  feedbackHeading: FeedbackHeading,
  completedWeeks: number,
) => {
  let tier = 1;

  if (completedWeeks < 15) {
    tier = 1;
  } else if (completedWeeks < 30) {
    tier = 2;
  } else if (completedWeeks < 60) {
    tier = 3;
  } else if (completedWeeks < 99) {
    tier = 4;
  } else if (completedWeeks < 100) {
    tier = 5;
  } else {
    tier = 6;
  }

  const wordList =
    feedbackHeading.find((item) => item.tier === tier)?.words ?? [];
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex];

  return word;
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
