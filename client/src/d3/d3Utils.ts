import {
  axisLeft,
  axisBottom,
  format,
  timeFormat,
  scaleTime,
  scaleLinear,
  select,
  curveMonotoneX,
  line as d3Line,
} from 'd3';
import d3Config from './d3Config';

type Cartesian = [number, number];

// const xScale = scaleTime()
//   .domain([DateUtils.getStartOfMonth(new Date()), new Date()])
//   .range([0, d3Config.maxChartWidth]);

const xScale = scaleLinear()
  .domain([d3Config.defaultMinXValue, d3Config.defaultMaxXValue])
  .range([0, d3Config.maxChartWidth]);

const yScale = scaleLinear()
  .domain([d3Config.defaultMinYValue, d3Config.defaultMaxYValue])
  .range([d3Config.maxChartHeight, 0]);

const scaleXData = (point: Cartesian) => xScale(point[0]);
const scaleYData = (point: Cartesian) => yScale(point[1]);

const yAxis = axisLeft(yScale)
  .ticks(5)
  .tickFormat(format(d3Config.numberFormat)) as any;

const xAxis = axisBottom(xScale)
  .ticks(5)
  .tickFormat(timeFormat(d3Config.dateFormat) as any) as any;

const drawAxes = () => {
  select('.line-chart-xaxis')
    .call(xAxis);

  select('.line-chart-yaxis')
    .call(yAxis);
};

export const buildAxes = () => {
  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-yaxis')
    .attr('transform', `translate(${d3Config.padding}, 0)`);

  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-xaxis')
    .attr('transform', `translate(${d3Config.padding}, ${d3Config.maxChartHeight})`);
};

const buildLine = () => {
  select('.line-chart')
    .append('path')
    .attr('stroke', 'blue')
    .attr('fill', 'none')
    .attr('class', 'line-chart-line')
    .attr('transform', `translate(${d3Config.padding}, 0)`);
};

const addAxisLabel = () => {
  select('.line-chart')
    .append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', (d3Config.maxChartWidth + d3Config.padding) / 2)
    .attr('y', d3Config.maxChartHeight + d3Config.padding)
    .text('Date (YYYY-MM-DD)');

  select('.line-chart')
    .append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'middle')
    .attr('y', 0)
    .attr('dy', '.75em')
    .attr('transform', `rotate(-90) translate(-${(d3Config.maxChartHeight + d3Config.padding) / 2}, 0)`)
    .text('New Cases (count per day)');
};

const drawLine = (data: any) => {
  const line = d3Line()
    .x(scaleXData)
    .y(scaleYData)
    .curve(curveMonotoneX);

  select('.line-chart-line')
    .attr('d', line(data) || '');
};

const renderChanges = (data: any) => {
  drawAxes();
  drawLine(data);
};

const initializeChart = (data: any) => {
  buildAxes();
  buildLine();
  addAxisLabel();
  renderChanges(data);
};

export default initializeChart;
