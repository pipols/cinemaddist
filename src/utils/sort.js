import {SortType} from '../const';

export const getCardsBySortType = (cards, sortType) => {
  switch (sortType) {
    case SortType.DEFAULT:
      return cards;
    case SortType.DATE:
      return [...cards].sort((a, b) => b.releaseDate - a.releaseDate);
    case SortType.RATING:
      return [...cards].sort((a, b) => b.rate - a.rate);
  }
  return cards;
};

export const sortRatedCards = (cards) => [...cards].sort((a, b) => b.rate - a.rate);

export const sortMostCommentedCards = (cards) => [...cards].sort((a, b) => b.commentsId.length - a.commentsId.length);
