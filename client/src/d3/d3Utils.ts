import {
  axisLeft,
  axisBottom,
  format,
  timeFormat,
  scaleLinear,
  select,
  curveMonotoneX,
  line as d3Line,
} from 'd3';
import d3Config, { Cartesian, MinMaxXY } from './d3Config';

const minMax = new MinMaxXY();

export const buildAxes = () => {
  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-yaxis')
    .attr('transform', `translate(${d3Config.padding}, ${d3Config.titlePadding})`);

  select('.line-chart')
    .append('g')
    .attr('class', 'line-chart-xaxis')
    .attr('transform', `translate(${d3Config.padding}, ${d3Config.maxChartHeight - d3Config.padding})`);
};

const buildLine = () => {
  select('.line-chart')
    .append('path')
    .attr('stroke', 'blue')
    .attr('fill', 'none')
    .attr('class', 'line-chart-line')
    .attr('transform', `translate(${d3Config.padding}, ${d3Config.titlePadding})`);
};

const addAxisLabel = () => {
  select('.line-chart')
    .append('text')
    .attr('class', 'x-label')
    .attr('text-anchor', 'middle')
    .attr('x', (d3Config.maxChartWidth + d3Config.padding) / 2)
    .attr('y', d3Config.maxChartHeight)
    .text(d3Config.xAxisLabel);

  select('.line-chart')
    .append('text')
    .attr('class', 'y-label')
    .attr('text-anchor', 'middle')
    .attr('y', 0)
    .attr('dy', '.75em')
    .attr('transform', `rotate(-90) translate(-${d3Config.maxChartHeight / 2}, 0)`)
    .text(d3Config.yAxisLabel);

  select('.line-chart')
    .append('text')
    .attr('class', 'graph-title')
    .attr('text-anchor', 'middle')
    .style('font-size', '30px')
    .attr('x', (d3Config.maxChartWidth / 2))
    .attr('y', d3Config.titlePadding)
    .text(d3Config.title);
};

const drawLine = (data: Cartesian[]) => {
  minMax.minMax(data);

  const xScale = scaleLinear()
    .domain([minMax.minX(), minMax.maxX()])
    .range([0, d3Config.maxChartWidth - d3Config.padding]);

  const yScale = scaleLinear()
    .domain([minMax.minY(), minMax.maxY()])
    .range([d3Config.maxChartHeight - d3Config.padding - d3Config.titlePadding, 0]);

  const scaleXData = (point: Cartesian) => xScale(point[0]);
  const scaleYData = (point: Cartesian) => yScale(point[1]);

  const yAxis = axisLeft(yScale)
    .ticks(10)
    .tickFormat(format(d3Config.numberFormat)) as any;

  const xAxis = axisBottom(xScale)
    .ticks(20)
    .tickFormat(timeFormat(d3Config.dateFormat) as any) as any;

  select('.line-chart-xaxis')
    .call(xAxis)
    .selectAll('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-65) translate(-20, -5)');

  select('.line-chart-yaxis')
    .call(yAxis);

  const line = d3Line()
    .x(scaleXData)
    .y(scaleYData)
    .curve(curveMonotoneX);

  select('.line-chart-line')
    .attr('d', line(data) || '');
};

const initializeChart = (data: Cartesian[]) => {
  buildAxes();
  buildLine();
  addAxisLabel();

  drawLine(data);
};

export default initializeChart;
