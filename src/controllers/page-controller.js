import ProfileComponent from '../components/profile';
import FilmListComponent from '../components/film-list';
import MainFilmsComponent from '../components/main-films';
import ExtraFilmsComponent from '../components/extra-films';
import FooterStatisticComponent from '../components/footer-statistic';
import LoadMoreButtonComponent from '../components/load-more-button';

import MovieController from './movie-controller';

import {CardCount, FilmsListTitle} from '../const';
import {render, remove} from '../utils/render';

const siteHeaderElement = document.querySelector(`header`);
const siteFooterElement = document.querySelector(`footer`);

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;

    this._profileComponent = null;
    this._filmListComponent = null;
    this._topRatedFilmsComponent = null;
    this._mostCommentedFilms = null;
    this._footerStatisticComponent = null;

    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._mainFilmsComponent = new MainFilmsComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._loadMoreClickHandler = this._loadMoreClickHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
    this._commentChangeHandler = this._commentChangeHandler.bind(this);
    this._popupOpenHandler = this._popupOpenHandler.bind(this);

    this._showedCardControllers = [];
    this._showedExtraCardControllers = [];
    this._prevCardsCount = 0;
    this._openedPopup = null;

    this._showingMainFilmsCount = CardCount.MAIN_FILM;
    this._oldDetailsComponent = null;

    this._moviesModel.setFilterChangeHandler(this._filterChangeHandler);
    this._moviesModel.setSortChangeHandler(this._sortChangeHandler);
    this._loadMoreButtonComponent.setClickHandler(this._loadMoreClickHandler);
  }

  render() {
    const cards = this._moviesModel.getCards();

    this._profileComponent = new ProfileComponent(cards);
    this._filmListComponent = new FilmListComponent();
    this._footerStatisticComponent = new FooterStatisticComponent(cards);

    render(siteHeaderElement, this._profileComponent);
    render(this._container, this._filmListComponent);
    render(siteFooterElement, this._footerStatisticComponent);
    render(this._filmListComponent.getElement(), this._mainFilmsComponent);

    this._renderFilmsListTitle();
    this._renderMainCards();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
    this._renderLoadMoreButton();
  }


  hide() {
    this._filmListComponent.hide();
  }

  show() {
    this._filmListComponent.show();
  }

  _loadMoreClickHandler() {
    this._showingMainFilmsCount = this._showingMainFilmsCount + CardCount.BY_BUTTON;
    this._renderMainCards();

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    const cards = this._moviesModel.getCards();
    remove(this._loadMoreButtonComponent);

    if (this._showingMainFilmsCount >= cards.length) {
      return;
    }

    render(this._mainFilmsComponent.getElement(), this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(this._loadMoreClickHandler);
  }

  _renderExtraCards(cards, title, component) {
    const container = component.getElement().querySelector(`.films-list__container`);
    const newCards = this._renderCards(container, cards);
    component.setTitle(title);

    this._showedExtraCardControllers = this._showedExtraCardControllers.concat(newCards);
    render(this._filmListComponent.getElement(), component);
  }

  _renderMainCards() {
    const cards = this._moviesModel.getCards().slice(this._prevCardsCount, this._showingMainFilmsCount);
    const container = this._mainFilmsComponent.getElement().querySelector(`.films-list__container`);
    const newCards = this._renderCards(container, cards);

    this._prevCardsCount += CardCount.MAIN_FILM;
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingMainFilmsCount = this._showedCardControllers.length;
  }

  _renderCards(container, cards) {
    return cards.map((card) => {
      const movieController = new MovieController(container, this._dataChangeHandler, this._commentChangeHandler, this._popupOpenHandler, this._api);
      movieController.render(card);

      return movieController;
    });
  }

  _removeCards() {
    this._showedCardControllers.forEach((movieController) => movieController.destroy());
    this._showedCardControllers = [];

    this._showedExtraCardControllers.forEach((movieController) => movieController.destroy());
    this._showedExtraCardControllers = [];
  }

  _commentChangeHandler(movieController, card, newComment) {
    this._api.createComment(card.id, newComment)
      .then((newCard) => {
        this._dataChangeHandler(movieController, card, newCard);
      })
      .catch(() => {
        movieController.commentSendingError();
      });
  }

  _dataChangeHandler(movieController, oldData, newData) {
    this._api.updateMovie(newData)
      .then((movie) => {
        const isSuccess = this._moviesModel.updateCard(oldData.id, movie);

        if (isSuccess) {
          movieController.render(movie);
        }
      });
  }

  _filterChangeHandler() {
    this._removeCards();
    this._prevCardsCount = 0;
    this._showingMainFilmsCount = CardCount.MAIN_FILM;

    this._renderFilmsListTitle();
    this._renderMainCards();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
    this._renderLoadMoreButton();
  }

  _sortChangeHandler() {
    this._showedCardControllers.forEach((movieController) => movieController.destroy());
    this._showedCardControllers = [];
    this._showingMainFilmsCount = CardCount.MAIN_FILM;
    this._prevCardsCount = 0;

    this._renderMainCards();
    this._renderLoadMoreButton();
  }

  _popupOpenHandler(movieComponent) {
    if (this._openedPopup) {
      this._openedPopup.removePopup();
    }
    this._openedPopup = movieComponent;
  }

  _renderTopRatedFilms() {
    if (this._topRatedFilmsComponent) {
      remove(this._topRatedFilmsComponent);
    }

    this._topRatedFilmsComponent = new ExtraFilmsComponent();
    const cards = this._moviesModel.getTopRatedCards();

    this._renderExtraCards(cards, FilmsListTitle.TOP_RATED, this._topRatedFilmsComponent);
  }

  _renderMostCommentedFilms() {
    if (this._mostCommentedFilms) {
      remove(this._mostCommentedFilms);
    }

    this._mostCommentedFilms = new ExtraFilmsComponent();
    const cards = this._moviesModel.getMostCommentedCards();

    this._renderExtraCards(cards, FilmsListTitle.MOST_COMMENTED, this._mostCommentedFilms);
  }

  _renderFilmsListTitle() {
    const cards = this._moviesModel.getCards();

    if (cards.length === 0) {
      this._mainFilmsComponent.setTitle(FilmsListTitle.MESSAGE_NO_FILMS);
      this._mainFilmsComponent.getElement().querySelector(`.films-list__title`).classList.remove(`visually-hidden`);
    } else {
      this._mainFilmsComponent.setTitle(FilmsListTitle.MAIN_FILM);
    }
  }

}
