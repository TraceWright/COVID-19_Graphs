import React from 'react';
import initializeChart from '../d3/d3Utils';
import d3Config from '../d3/d3Config';

interface IData { date: string, count: number }
interface IProps {}
interface IState { data: IData[] }

class FirstGraph extends React.Component<IProps, IState> {
  componentDidMount() {
    fetch('http://localhost:8080/results')
      .then((response: Response) => response.json())
      .then((data: IData[]) => {
        const arr = data.map((element: IData) => [new Date(element.date).getTime(), element.count]);
        console.log(arr);

        initializeChart(arr);
      });
  }

  render() {
    return (
      <div>
        <h3>New COVID-19 cases for NSW</h3>
        <svg
          className="line-chart"
          width={d3Config.maxChartWidth + d3Config.padding}
          height={d3Config.maxChartHeight + d3Config.padding}
        />
      </div>
    );
  }
}

export default FirstGraph;
