import {FilterType, FilterChartType} from '../const';
import moment from 'moment';

export const getCardsByFilter = (cards, filter) => {
  switch (filter) {
    case FilterType.ALL:
      return cards;
    case FilterType.WATCHLIST:
      return cards.filter((card) => card.isWatchlist);
    case FilterType.HISTORY:
      return cards.filter((card) => card.isWatched);
    case FilterType.FAVORITES:
      return cards.filter((card) => card.isFavorite);
  }

  return cards;
};

export const getCardsByChartFilter = (cards, filter) => {
  switch (filter) {
    case FilterChartType.ALL:
      return cards;
    case FilterChartType.TODAY:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) === 0);
    case FilterChartType.WEEK:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 0);
    case FilterChartType.MONTH:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 31);
    case FilterChartType.YEAR:
      return cards.filter((card) => moment().diff(card.watchingDate, `days`) <= 364);
  }

  return cards;
};
