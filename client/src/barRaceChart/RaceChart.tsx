import React from 'react';
import Select from 'react-select';
import * as _ from 'lodash';
import renderChart from './RaceChartUtils';
import raceChartConfig from './RaceChartConfig';
import './raceChart.css';

interface IData { timeseries: Array<{timeseries: any, state: any}>, location: string }
interface IProps {}
interface IState {
  svg: any,
  selectedLocation: { value: string, label: string },
}

const options = [
  { value: 'country', label: 'Global' },
  { value: 'cases', label: 'Australia' },
];

class RaceGraph extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLocation: { value: 'country', label: 'Global' },
      svg: '',
    };
  }

  componentDidMount() {
    const { selectedLocation } = this.state;
    this.createSVG(selectedLocation);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    const { selectedLocation } = this.state;
    if (!_.isEqual(prevState.selectedLocation, selectedLocation)) {
      this.createSVG(selectedLocation);
    }
  }

  formatData = (data: IData[]) => data.flatMap((element: {timeseries: any, location: any}) => {
    const { location, timeseries } = element;
    return timeseries.map((el: {date: Date, value: number}) => ({
      name: location, value: el.value, date: el.date, category: location,
    }));
  });

  handleChange = (selectedLocation: any) => {
    this.setState({ selectedLocation });
  };

  createSVG(selectedLocation: { value: string, label: string }) {
    const URL = process.env.REACT_APP_LAMBDA_URL;
    fetch(`${URL}${selectedLocation.value}`)
      .then((response: Response) => response.json())
      .then((data: IData[]) => {
        const svg = renderChart(data);
        this.setState({ svg });
      });
  }

  render() {
    const { selectedLocation, svg } = this.state;
    const chart = this.state ? svg : null;
    if (chart) {
      chart.next();
      chart.next();
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="select-location">
          <div>Location</div>
          <div style={{ width: '160px' }}>
            <Select
              value={selectedLocation}
              onChange={this.handleChange}
              options={options}
            />
          </div>
        </div>
        <svg
          width={raceChartConfig.width}
          height={raceChartConfig.height}
          className="race-chart"
        />
      </div>
    );
  }
}

export default RaceGraph;
