import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);


export const TimeToken = {
  TIME: `H[h] m[m]`,
  DATE: `DD MMMM YYYY`,
  COMMENT: `YYYY/MM/DD HH:MM`,
  YEAR: `YYYY`
};

export const getFormattedTime = (date, timeToken) => {
  return moment(date).format(timeToken);
};

export const getFilmDuration = (movieDuration) => {
  return moment.duration(movieDuration, `minutes`).format(`h[h] m[m]`);
};

// 0 — звание не отображается;
// от 1 до 10 — novice;
// от 11 до 20 — fan;
// от 21 и выше — movie buff;
const NumberMoviesWatched = {
  NOVICE: 10,
  FAN: 20
};

const ProfileRank = {
  NOVICE: `novice`,
  FAN: `fan`,
  MOVIE_BUFF: `movie buff`
};

export const getProfileRating = (countWatched) => {
  if (countWatched <= NumberMoviesWatched.NOVICE) {
    return ProfileRank.NOVICE;
  } else if (countWatched <= NumberMoviesWatched.FAN) {
    return ProfileRank.FAN;
  } else if (countWatched > NumberMoviesWatched.FAN) {
    return ProfileRank.MOVIE_BUFF;
  }
  return ``;
};

// количество обьектов в массиве, у которого значение переданого свойства true
export const getPropertyCount = (arr, property) => arr.filter((elem) => elem[property]).length;

export const getLimitString = (string, maxLength, lastSymbol = `...`) => {
  return string.length > maxLength
    ? string.substr(0, maxLength - lastSymbol.length) + lastSymbol
    : string;
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const shuffleArray = ([...items]) => {
  let currentIndex = items.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = getRandomIntegerNumber(0, currentIndex);
    currentIndex -= 1;

    temporaryValue = items[currentIndex];
    items[currentIndex] = items[randomIndex];
    items[randomIndex] = temporaryValue;
  }
  return items;
};

export const isSameValues = (items, key) => items.every((it) => it[key] === items[0][key]);

export const isSameCountComments = (cards) => cards.every((card) => card.commentsId.length === cards[0].commentsId.length);
