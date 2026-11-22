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
