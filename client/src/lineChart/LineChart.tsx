import React from 'react';
import initializeChart from './LineChartUtils';
// eslint-disable-next-line no-unused-vars
import d3Config, { Cartesian } from './LineChartConfig';

interface IData { date: string, count: number }
interface IProps {}
interface IState { data: IData[] }

class LineChart extends React.Component<IProps, IState> {
  componentDidMount() {
    fetch('http://localhost:8080/results')
      .then((response: Response) => response.json())
      .then((data: IData[]) => {
        const arr: Cartesian[] = data.map((element: IData) => [
          new Date(element.date).getTime(), element.count,
        ]);

        initializeChart(arr);
      });
  }

  render() {
    return (
      <div>
        <svg
          className="line-chart"
          width={d3Config.maxChartWidth}
          height={d3Config.maxChartHeight}
        />
      </div>
    );
  }
}

export default LineChart;
