import AbstractComponent from './abstract-component';

const createMainFilmsElement = () => {
  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
            <div class="films-list__container"></div>
          </section>`;
};

export default class MainFilms extends AbstractComponent {
  getTemplate() {
    return createMainFilmsElement();
  }

  setTitle(title) {
    this.getElement().querySelector(`.films-list__title`).textContent = title;
  }
}
