import AbstractComponent from './abstract-component';
export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

const ACTIVE_CLASS = `sort__button--active`;

const createSortElement = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`);
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createSortElement();
  }

  setSortChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!evt.target.classList.contains(`sort__button`)) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      const activeLink = this.getElement().querySelector(`.${ACTIVE_CLASS}`);

      activeLink.classList.remove(ACTIVE_CLASS);
      evt.target.classList.add(ACTIVE_CLASS);

      handler(sortType);
    });
  }

}
