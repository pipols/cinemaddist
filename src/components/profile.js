import AbstractComponent from './abstract-component';
import {getProfileRating, getPropertyCount} from '../utils/common';

const createProfileElement = (cards) => {
  const countWatched = getPropertyCount(cards, `isWatched`);
  const rating = getProfileRating(countWatched);

  return (
    `<section class="header__profile profile">
       <p class="profile__rating">${rating}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`);
};

export default class Profile extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createProfileElement(this._cards);
  }
}
