type FeedbackHeading = {
  tier: number;
  words: string[];
}[];

type Streak = number;

export const getHeading = (
  feedbackHeading: FeedbackHeading,
  streak: Streak
) => {
  let tier = 1;

  if (streak < 15) {
    tier = 1;
  } else if (streak < 30) {
    tier = 2;
  } else if (streak < 60) {
    tier = 3;
  } else if (streak < 99) {
    tier = 4;
  } else if (streak < 100) {
    tier = 5;
  } else {
    tier = 6;
  }

  const wordList =
    feedbackHeading.find((item) => item.tier === tier)?.words || [];
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const word = wordList[randomIndex];

  return word;
};

export const getHeadingSize = (sentence: string) => {
  const sentenceLength = sentence.length;
  const longestWord = getLongestWord(sentence);
  const length = longestWord.length;
  let headingSize = 'm';

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

export const getLongestWord = (sentence: string) => {
  var words = sentence.split(' ');

  const longestWord = words.reduce((champ, contender) =>
    contender.length > champ.length ? contender : champ
  );

  return longestWord;
};
