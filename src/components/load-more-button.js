import AbstractComponent from './abstract-component';

const createLoadMoreButtonElement = () => {
  return (`<button class="films-list__show-more">Show more</button>`);
};

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return createLoadMoreButtonElement();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
