import AbstractComponent from './abstract-component';
import {getProfileRating, getPropertyCount} from '../utils/common';

const createStatisticElement = (cards) => {
  const countWatched = getPropertyCount(cards, `isWatched`);
  const rating = getProfileRating(countWatched);

  return `<section class="statistic visually-hidden">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

  </section>`;
};

export default class StatisticControls extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
    this.filterInputhandler = null;
  }

  setFilterInputHandler(handler) {
    this.filterInputhandler = handler;

    this.getElement()
      .querySelector(`.statistic__filters`)
      .addEventListener(`input`, handler);
  }

  getTemplate() {
    return createStatisticElement(this._cards);
  }

}
