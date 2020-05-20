import AbstractSmartComponent from './abstract-smart-component';
import {getPropertyCount} from '../utils/common';
import {getCardsByFilter} from '../utils/filter';
import {FilterType} from '../const';
import Chart from 'chart.js';
import chartDataLabels from 'chartjs-plugin-datalabels';

const getAllGenres = (cards) => cards.reduce((acc, card) => acc.concat(card.genre), []);

const getWatchedGenres = (cards) => cards.filter((card) => card[`isWatched`]);

const getTopGenre = (cards) => {
  const uniqueGenres = getUniqueGenres(cards); // уникальные жанры
  const genresCount = getCountElements(cards); // количество каждого жанра
  const maxCount = Math.max(...genresCount);
  const index = genresCount.findIndex((num) => maxCount === num);

  return uniqueGenres[index];
};

const getTimeAddition = (cards) => {
  return cards.reduce((acc, card) => acc + card.duration, 0);
};

const getHours = (cards) => {
  const time = getTimeAddition(cards);
  return Math.trunc(time / 60);
};

const getMinutes = (cards) => {
  const time = getTimeAddition(cards);
  return time % 60;
};

const getUniqueGenres = (cards) => {
  const set = new Set();
  const genres = getAllGenres(cards);
  genres.forEach((genre) => set.add(genre));
  return [...set];
};

const getCountElements = (cards) => {
  const uniqCards = getUniqueGenres(cards);
  const concatCards = cards.reduce((acc, card) => acc.concat(card.genre), []);

  return uniqCards.map((genre) => {
    return concatCards.filter((elem) => elem === genre).length;
  });
};

const createStatisticElement = (cards) => {
  return `<div>
    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${getPropertyCount(cards, `isWatched`)} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${getHours(cards)} <span class="statistic__item-description">h</span> ${getMinutes(cards)} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${getTopGenre(cards) || ``}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div></div>`;
};

export default class StatisticChart extends AbstractSmartComponent {
  constructor(cards) {
    super();
    this._cards = getCardsByFilter(cards, FilterType.HISTORY);
  }

  getTemplate() {

    return createStatisticElement(this._cards);
  }

  renderChart() {
    const ctx = this.getElement().querySelector(`.statistic__chart`);
    return new Chart(ctx, {
      plugins: [chartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: getUniqueGenres(getWatchedGenres(this._cards)),
        datasets: [
          {
            data: getCountElements(getWatchedGenres(this._cards)),
            backgroundColor: `#ffe800`,
            borderWidth: 0,
            barThickness: 30,
          }
        ]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 16
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            padding: 30
          }
        },
        tooltips: {
          enabled: false
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            ticks: {
              fontSize: 18,
              fontColor: `#ffffff`,
              padding: 60,
            }
          }]
        }
      }
    });
  }

}
