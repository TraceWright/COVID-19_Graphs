import React from 'react';
import renderChart from './chart';

interface IData { date: string, count: number }
interface IProps {}
interface IState { svg: any }

class RaceGraph extends React.Component<IProps, IState> {
  componentDidMount() {
    const svg = renderChart();
    this.setState({ svg });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const svg = this.state ? this.state.svg : null;
    console.log(svg ? svg.next() : 'nada');
    return (
      <div>
        <svg
          className="race-chart"
        />
      </div>
    );
  }
}

export default RaceGraph;
