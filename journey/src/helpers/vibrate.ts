// Two short buzzes then a long one reads as "no".
const ERROR_PATTERN = [60, 50, 60, 50, 200];

export const vibrationSupported = 'vibrate' in navigator;

export const vibrateError = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(ERROR_PATTERN);
  }
};
