import React from 'react';
import renderChart from './RaceChartUtils';

interface IData { timeseries: Array<{timeseries: any, state: any}>, state: string }
interface IProps {}
interface IState { svg: any }

class RaceGraph extends React.Component<IProps, IState> {
  componentDidMount() {
    fetch('https://60euq8w9ec.execute-api.ap-southeast-2.amazonaws.com/cases')
      .then((response: Response) => response.json())
      .then((data: IData[]) => {
        const svg = renderChart(data);
        this.setState({ svg });
      });
  }

  formatData = (data: IData[]) => data.flatMap((element: {timeseries: any, state: any}) => {
    const { state, timeseries } = element;
    return timeseries.map((el: {date: Date, value: number}) => ({
      name: state, value: el.value, date: el.date, category: state,
    }));
  })

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const svg = this.state ? this.state.svg : null;
    if (svg) svg.next();
    return (
      <div style={{ textAlign: 'center' }}>
        <svg
          width={800}
          height={500}
          className="race-chart"
        />
      </div>
    );
  }
}

export default RaceGraph;
