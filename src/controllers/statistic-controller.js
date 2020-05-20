import StatisticControls from '../components/statistic-controls';
import StatisticChart from '../components/statistic-chart';
import {render, replace} from '../utils/render';
import {getCardsByChartFilter} from '../utils/filter';

export default class StatisticController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this.cards = [];

    this._statisticChart = null;
    this._statisticControls = null;

    this._statisticInputHandler = this._statisticInputHandler.bind(this);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._moviesModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    this.cards = this._moviesModel.getCardsAll();
    const oldStatisticControls = this._statisticControls;

    this._statisticControls = new StatisticControls(this.cards);
    this._statisticChart = new StatisticChart(this.cards);

    this._statisticControls.setFilterInputHandler(this._statisticInputHandler);
    this._statisticChart.renderChart();

    const chartContainer = this._statisticControls.getElement();

    if (oldStatisticControls) {
      replace(this._statisticControls, oldStatisticControls);
    } else {
      render(container, this._statisticControls);
    }

    render(chartContainer, this._statisticChart);
  }

  hide() {
    this._statisticControls.hide();
  }

  show() {
    this._statisticControls.show();
  }

  _statisticInputHandler(evt) {
    const filterValue = evt.target.value;
    const cards = getCardsByChartFilter(this.cards, filterValue);
    const oldComponent = this._statisticChart;
    this._statisticChart = new StatisticChart(cards);
    this._statisticChart.renderChart();

    replace(this._statisticChart, oldComponent);
  }

  _dataChangeHandler() {
    this.render();
  }
}
