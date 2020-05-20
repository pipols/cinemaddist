import CardComponent from '../components/film-card';
import FilmDetailsComponent from '../components/film-details';
import CommentComponent from '../components/comment';
import MovieAdapter from '../adapters/movie';
import {render, replace, remove} from '../utils/render';
import {KeyCode} from '../const';
import {encode} from 'he';

const SHAKE_ANIMATION_TIMEOUT = 600;
const siteBodyElement = document.querySelector(`body`);

const parseFormData = (formData) => {
  const comment = formData.get(`comment`);
  const emoji = formData.get(`comment-emoji`);

  const newComment = {
    "comment": encode(comment),
    "date": new Date().toISOString(),
    "emotion": emoji,
  };
  return newComment;
};

export default class MovieController {
  constructor(container, onDataChange, onCommentChange, onOpenedPopup, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onCommentChange = onCommentChange;
    this._onOpenedPopup = onOpenedPopup;
    this._api = api;

    this._card = [];
    this._card.comments = [];
    this._cardComponent = null;
    this._filmDetailsComponent = null;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._deleteCommentButtonHandler = this._deleteCommentButtonHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._card = card;
    this._cardComponent = new CardComponent(card);
    this._filmDetailsComponent = new FilmDetailsComponent(card);


    if (oldFilmDetailsComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
      this._setPopupListeners();
    } else {
      render(this._container, this._cardComponent);
    }


    this._isCommentsRender = false;

    this._cardComponent.setCardPosterClickHandler(this._cardClickHandler);
    this._cardComponent.setCardTitleClickHandler(this._cardClickHandler);
    this._cardComponent.setCardCommentsClickHandler(this._cardClickHandler);

    this._cardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isWatchlist = !newCard.isWatchlist;

      this._onDataChange(this, this._card, newCard);
    });

    this._cardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isWatched = !newCard.isWatched;

      this._onDataChange(this, this._card, newCard);
    });

    this._cardComponent.setFavoriteButtonClick((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(this, this._card, newCard);
    });


    this._loadComments();
  }

  destroy() {
    remove(this._cardComponent);
    this.removePopup();
  }

  removePopup() {
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._escKeydownHandler);
    this._isCommentsRender = false;
  }

  commentSendingError() {
    this.shake();
    this._filmDetailsComponent.setFormUnlock();
    this._filmDetailsComponent.setCommentFieldError();
  }

  shake() {
    this._filmDetailsComponent.getElement().classList.add(`shake`);
    this._cardComponent.getElement().classList.add(`shake`);

    setTimeout(() => {
      this._filmDetailsComponent.getElement().classList.remove(`shake`);
      this._cardComponent.getElement().classList.remove(`shake`);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _renderPopup() {
    this._onOpenedPopup(this);

    render(siteBodyElement, this._filmDetailsComponent);
    this._setPopupListeners();
    document.addEventListener(`keydown`, this._escKeydownHandler);

    if (!this._isCommentsRender) {
      this._renderComments(this._card.comments);
    }
  }

  _closeButtonClickHandler() {
    this.removePopup();
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.ESC) {
      this.removePopup();
    }
  }

  _loadComments() {
    this._api.getComment(this._card.id)
      .then((comments) => {
        this._card.comments = comments;
        this._isCommentsRender = true;
        this._renderComments(this._card.comments);
      });
  }

  _cardClickHandler() {
    this._renderPopup();
  }

  _deleteCommentButtonHandler(commentId, commentComponent) {
    commentComponent.setData({
      deleteButtonText: `Deleting…`,
      deleteButtonDisabled: `disabled`
    });

    this._api.deleteComment(commentId)
      .then(() => {
        this._card.comments = this._card.comments.filter((comment) => comment.id !== commentId);
        this._onDataChange(this, this._card, this._card);
      })
      .catch(() => {
        this.shake();
        commentComponent.setData({
          deleteButtonText: `Delete`,
        });
      });
  }

  _formSubmitHandler(evt, card) {
    this._filmDetailsComponent.deleteCommentFieldError();

    if ((evt.ctrlKey || evt.metaKey) && evt.key === KeyCode.ENTER) {
      const formData = this._filmDetailsComponent.getData();
      const newComment = parseFormData(formData);

      this._filmDetailsComponent.setFormLock();
      this._onCommentChange(this, card, newComment);
    }
  }

  _renderComments(comments) {
    const container = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
    comments.map((comment) => {
      const commentComponent = new CommentComponent(comment);
      commentComponent.setDeleteCommentButtonHandler(this._deleteCommentButtonHandler);
      render(container, commentComponent);
    });
  }

  _setPopupListeners() {
    this._filmDetailsComponent.setWatchlistChangeHandler((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isWatchlist = !newCard.isWatchlist;

      this._onDataChange(this, this._card, newCard);
    });

    this._filmDetailsComponent.setWatchedChangeHandler((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isWatched = !newCard.isWatched;

      this._onDataChange(this, this._card, newCard);
    });

    this._filmDetailsComponent.setFavoriteChangeHandler((evt) => {
      evt.preventDefault();
      const newCard = MovieAdapter.clone(this._card);
      newCard.isFavorite = !newCard.isFavorite;

      this._onDataChange(this, this._card, newCard);
    });

    this._filmDetailsComponent.setEmojiChangeHandler();

    this._filmDetailsComponent.setFormSubmitHandler(this._formSubmitHandler);

    this._filmDetailsComponent.setCloseButtonClickHandler(this._closeButtonClickHandler);

  }

}
