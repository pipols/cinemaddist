import AbstractSmartComponent from './abstract-smart-component';
import {getFormattedTime, TimeToken} from '../utils/common';

const DefaultData = {
  deleteButtonText: `Delete`,
  deleteButtonDisabled: ``,
};

const Emotion = {
  smile: `./images/emoji/smile.png`,
  sleeping: `./images/emoji/sleeping.png`,
  puke: `./images/emoji/puke.png`,
  angry: `./images/emoji/angry.png`
};

const createCommentElement = (comment, options) => {
  const {emotion, commentText, author, date} = comment;
  const {deleteButtonText, deleteButtonDisabled} = options;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${Emotion[emotion]}" width="55" height="55" alt="emoji">
      </span>
      <div>
      <p class="film-details__comment-text">${commentText}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${getFormattedTime(date, TimeToken.COMMENT)}</span>
        <button class="film-details__comment-delete" ${deleteButtonDisabled}>${deleteButtonText}</button>
      </p>
      </div>
    </li>`);
};

export default class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();
    this._comment = comment;
    this._externalData = DefaultData;

    this.deleteCommentButtonHandler = null;
  }

  getTemplate() {
    return createCommentElement(this._comment, this._externalData);
  }

  setDeleteCommentButtonHandler(handler) {
    this.deleteCommentButtonHandler = handler;

    this.getElement()
      .querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(this._comment.id, this);
      });
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  recoveryListeners() {
    this.setDeleteCommentButtonHandler(this.deleteCommentButtonHandler);
  }
}
