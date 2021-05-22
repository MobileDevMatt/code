export const isValidEmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/**
 * Validates whether a given value can be used as a name for a jamesbook profile.
 * @param str
 * @param options - an object to modify the default behavior of this function.
 * https://javascript.info/regexp-unicode
 * https://andrewwoods.net/blog/2018/name-validation-regex/
 */
export const isValidName = (
  str: string,
): boolean => {
  const value = str.trim();
  const containsValidMultipleWordsRegex = /^[A-Za-z]+([\ A-Za-z]+)*/;
  const startsWithValidLetterRegex = /^[A-Za-z]/;
  const containsInvalidCharactersRegex = /[0-9_@`~#$%^&*(){}\[\];:!=<>\"?\\\/|+]/;

  return (
    startsWithValidLetterRegex.test(value) &&
    containsValidMultipleWordsRegex.test(value) &&
    containsInvalidCharactersRegex.test(value) === false
  );
};

export const formatTime = (time) => { //time is in seconds
  const getSeconds = `0${(time % 60)}`.slice(-2);
  const minutes = `${Math.floor(time / 60)}`;
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

  return `${getMinutes} : ${getSeconds}`;
};