import MovieAdapter from './adapters/movie';
import CommentAdapter from './adapters/comment';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(apiUrl, token) {
    this._apiUrl = apiUrl;
    this._token = token;
  }

  getMovies() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(MovieAdapter.parseMovies);
  }

  updateMovie(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(film.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})})
        .then((response) => response.json())
        .then(MovieAdapter.parseMovie);
  }

  getComment(filmId) {
    return this._load({url: `comments/${filmId}`})
    .then((response) => response.json())
    .then(CommentAdapter.parseComments);
  }

  createComment(filmId, data) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})})
        .then((response) => response.json())
        .then((movie) => {
          const film = MovieAdapter.parseMovie(movie.movie);
          film.comments = CommentAdapter.parseComments(movie.comments);
          return film;
        });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._token);

    return fetch(`${this._apiUrl}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

}
