
export type Cartesian = [number, number];

const d3Config = {
  maxChartWidth: 800,
  maxChartHeight: 500,
  numberFormat: '',
  dateFormat: '%d-%m',
  xAxisLabel: 'Date (DD-MM)',
  yAxisLabel: 'New Cases (count per day)',
  title: 'New COVID-19 cases for NSW',
  titlePadding: 30,
  padding: 50,
};

class MinMaxXY {
  private minXValue: number = new Date('2020-01-01T00:00:00').getTime();

  private maxXValue: number = new Date('2020-01-01T00:00:00').getTime();

  private minYValue: number = 0;

  private maxYValue: number = 0;

  minX(): number {
    return this.minXValue;
  }

  maxX(): number {
    return this.maxXValue;
  }

  minY(): number {
    return this.minYValue;
  }

  maxY(): number {
    return this.maxYValue;
  }

  constructor(data: Cartesian[]) {
    const dateValue = data.map((element: Cartesian) => element[0]);
    const countValue = data.map((element: Cartesian) => element[1]);

    this.minXValue = Math.min(...dateValue);
    this.maxXValue = Math.max(...dateValue);
    this.minYValue = Math.min(...countValue);
    this.maxYValue = Math.max(...countValue);
  }
}

export { MinMaxXY };
export default d3Config;
