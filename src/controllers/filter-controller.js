import MenuComponent from '../components/menu';
import {render, replace} from '../utils/render';
import {FilterType} from '../const';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._moviesModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allCards = this._moviesModel.getCardsAll();

    const oldComponent = this._menuComponent;

    this._menuComponent = new MenuComponent(allCards);
    this._menuComponent.setFilterChangeHandler(this._filterChangeHandler);
    this._menuComponent.setActiveLink(this._activeFilterType);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent);
    }
  }

  setFilterChangeHandler(handler) {
    this._menuComponent.setFilterChangeHandler(handler);
    this._filterItemClickHandler = handler;
  }

  _filterChangeHandler(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _dataChangeHandler() {
    this.render();
    this._recoveryListeners();
  }

  _recoveryListeners() {
    this._menuComponent.setFilterChangeHandler(this._filterItemClickHandler);
  }

}
