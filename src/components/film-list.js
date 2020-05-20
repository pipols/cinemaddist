import AbstractComponent from './abstract-component';

const createFilmListElement = () => {
  return (
    `<section class="films"></section>`);
};

export default class FilmList extends AbstractComponent {
  getTemplate() {
    return createFilmListElement();
  }
}
