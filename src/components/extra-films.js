import AbstractComponent from './abstract-component';

const createRatedFilmsElement = () => {
  return `<section class="films-list--extra">
            <h2 class="films-list__title"></h2>
            <div class="films-list__container"></div>
          </section>`;
};

export default class ExtraFilms extends AbstractComponent {
  getTemplate() {
    return createRatedFilmsElement();
  }

  setTitle(title) {
    this.getElement().querySelector(`.films-list__title`).textContent = title;
  }
}
