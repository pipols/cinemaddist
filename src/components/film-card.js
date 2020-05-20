import {getLimitString, getFilmDuration, TimeToken, getFormattedTime} from '../utils/common';
import AbstractSmartComponent from './abstract-smart-component';

const MAX_LENGTH_DESCRIPTION = 139;
const ACTIVE_BUTTON = `film-card__controls-item--active`;

const createFilmGenre = (genre) => `<span class="film-card__genre">${genre}</span>`;

const createFilmCardElement = (card) => {
  const {title, poster, description, commentsId, genre, releaseDate, rate, duration, isWatchlist, isWatched, isFavorite} = card;
  const getLimitDescription = getLimitString(description, MAX_LENGTH_DESCRIPTION);

  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rate}</p>
        <p class="film-card__info">
          <span class="film-card__year">${getFormattedTime(releaseDate, TimeToken.YEAR)}</span>
          <span class="film-card__duration">${getFilmDuration(duration)}</span>
          ${genre.map(createFilmGenre).join(` `)}
        </p>
        <img src="./${poster}" alt="${title}" class="film-card__poster">
        <p class="film-card__description">${getLimitDescription}</p>
        <a class="film-card__comments">${commentsId.length} comments</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist ? ACTIVE_BUTTON : ``}">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? ACTIVE_BUTTON : ``}">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? ACTIVE_BUTTON : ``}">Mark as favorite</button>
        </form>
      </article>`);
};

export default class FilmCard extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._cardHandler = null;
    this._watchlistHandler = null;
    this._watchedHandler = null;
    this._favoriteHandler = null;
  }

  getTemplate() {
    return createFilmCardElement(this._card);
  }

  setCardPosterClickHandler(handler) {
    this._cardHandler = handler;
    this.getElement()
      .querySelector(`.film-card__poster`)
      .addEventListener(`click`, this._cardHandler);
  }

  setCardTitleClickHandler(handler) {
    this._cardHandler = handler;
    this.getElement()
      .querySelector(`.film-card__title`)
      .addEventListener(`click`, this._cardHandler);
  }

  setCardCommentsClickHandler(handler) {
    this._cardHandler = handler;
    this.getElement()
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, this._cardHandler);
  }

  setWatchlistButtonClickHandler(handler) {
    this._watchlistHandler = handler;
    this.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, this._watchlistHandler);
  }

  setWatchedButtonClickHandler(handler) {
    this._watchedHandler = handler;
    this.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, this._watchedHandler);
  }

  setFavoriteButtonClick(handler) {
    this._favoriteHandler = handler;
    this.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, this._favoriteHandler);
  }

  recoveryListeners() {
    this.setCardPosterClickHandler(this._cardHandler);
    this.setCardTitleClickHandler(this._cardHandler);
    this.setCardCommentsClickHandler(this._cardHandler);
    this.setWatchlistButtonClickHandler(this._watchlistHandler);
    this.setWatchedButtonClickHandler(this._watchedHandler);
    this.setFavoriteButtonClick(this._favoriteHandler);
  }

}
