/* eslint-disable no-restricted-syntax */
import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import * as d3Chromatics from 'd3-scale-chromatic';
import raceChartDefaultConfig, { configType } from './RaceChartConfig';

interface ImportData { date: string, name: string, category: string, value: number }
interface BrandData { date: Date, name: string, category: string, value: number }
interface RankData { name: string, value: number, rank: number }
type KeyFramesArray = Array<any>[];
type NameFramesArray = Array<string | RankData[]>[];
type Prev = Map<RankData, RankData>;
type Next = Map<RankData, RankData>;
interface CaseCounts { [x: string]: number }
interface DateValueData extends Array<Date | CaseCounts> {
  0: Date;
  1: CaseCounts;
}

class RaceChart {
  dataImport: ImportData[];

  raceChartConfig: configType = raceChartDefaultConfig;

  data: BrandData[] = [];

  datevalues: DateValueData[] = [];

  names: Set<string> = new Set();

  y: d3.ScaleBand<string> = d3.scaleBand();

  x: d3.ScaleLinear<number, number> = d3.scaleLinear();

  keyframes: KeyFramesArray = [];

  prev: Prev = new Map();

  next: Next = new Map();

  rank(value: Function, names: Set<string>): RankData[] {
    const data: RankData[] = Array.from(names, (name) => (
      { name, value: value(name), rank: -1 }
    ));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; i += 1) {
      data[i].rank = Math.min(this.raceChartConfig.numberOfBars, i);
    }
    return data;
  }

  interpolateValue: (
    names: Set<string>,
    aPair: CaseCounts,
    bPair: CaseCounts,
    t: number) => RankData[] = (
      names: Set<string>,
      aPair: CaseCounts,
      bPair: CaseCounts,
      t: number,
    ) => this.rank(
      (name: string) => (aPair[name] || 0) * (1 - t) + (bPair[name] || 0) * t, names,
    );

  static interpolateDate(aDate: Date, bDate: Date, t: number) {
    return new Date(aDate.getTime() * (1 - t) + bDate.getTime() * t);
  }

  getInterpolationFraction(i: number) {
    return i / this.raceChartConfig.graphSpeed;
  }

  keyframesFunc = (dateValues: DateValueData[], names: Set<string>): KeyFramesArray => {
    let keyframes: KeyFramesArray = [];
    let aDate: Date;
    let bDate: Date;
    let aCase: CaseCounts;
    let bCase: CaseCounts;
    for ([[aDate, aCase], [bDate, bCase]] of d3.pairs(dateValues)) {
      for (let i = 0; i < this.raceChartConfig.graphSpeed; i += 1) {
        const interpolationFraction: number = this.getInterpolationFraction(i);
        const interpolatedDate: Date = RaceChart.interpolateDate(
          aDate, bDate, interpolationFraction,
        );
        const interpolatedValue: RankData[] = this.interpolateValue(
          names, aCase, bCase, interpolationFraction,
        );
        keyframes = keyframes.concat([[interpolatedDate, interpolatedValue]]);
      }
    }
    return keyframes;
  }

  constructor(data: ImportData[], updateConfig: any) {
    this.dataImport = data;
    this.raceChartConfig = { ...this.raceChartConfig, ...updateConfig };
    this.runData();
  }

  width: number = this.raceChartConfig.width;

  height: number = this.raceChartConfig.height;

  formatDate = d3.utcFormat('%Y-%m-%d');

  formatNumber = d3.format(',d');

  runData() {
    this.prev = new Map(this.nameframes().flatMap(([, data]) => d3.pairs(
      data as any, (a, b) => [b, a],
    ))) as Prev;

    this.next = new Map(this.nameframes().flatMap(([, data]) => d3.pairs(data as any)));

    this.y = d3.scaleBand()
      .domain(d3.range(this.raceChartConfig.numberOfBars + 1) as unknown as readonly string[])
      .rangeRound([this.raceChartConfig.margin.top, this.raceChartConfig.margin.top
        + this.raceChartConfig.barHeight * (this.raceChartConfig.numberOfBars + 1 + 0.1)])
      .padding(0.1);

    this.x = d3.scaleLinear()
      .domain([0, 1])
      .range([this.raceChartConfig.margin.left, this.width - this.raceChartConfig.margin.right]);

    this.data = this.dataImport.map((element: ImportData) => ({
      date: new Date(element.date),
      name: element.name,
      category: element.category,
      value: element.value,
    }));

    this.datevalues = Array.from(
      d3Array.rollup(
        this.data,
        (d: BrandData[]) => {
          const ret: CaseCounts = {};
          for (const p of d) {
            ret[p.name] = p.value;
          }
          return ret;
        },
        (d: BrandData) => d.date.getTime(),
      ),
    ).sort(([a], [b]) => d3.ascending(a, b))
      .map(([date, data]) => [new Date(date), data]);

    this.names = new Set(this.data.map((d) => d.name));
    this.keyframes = this.keyframesFunc(this.datevalues, this.names);
  }

  nameframes = (): NameFramesArray => {
    const nf: NameFramesArray = [];
    const mapped: Map<any, any> = d3Array.group(this.keyframes.flatMap(([, dt]) => dt),
      (d: RankData) => d.name);
    mapped.forEach((element: RankData[], key: string) => nf.push([key, element]));
    return nf;
  };

  color = (): Function => {
    const scale = d3.scaleOrdinal(d3Chromatics.schemeSet3);
    if (this.data.some((d: any) => d.category !== undefined)) {
      const categoryByName = new Map(this.data.map((d: any) => [d.name, d.category]));
      scale.domain(Array.from(categoryByName.values()));
      return (d: any) => scale(categoryByName.get(d.name));
    }
    return (d: any) => scale(d.name);
  }

  ticker(svg: any) {
    const now = svg.append('text')
      .style('font-weight', 'bold')
      .style('font-size', 'large')
      .attr('text-anchor', 'left')
      .attr('x', this.raceChartConfig.margin.left)
      .attr('y', this.raceChartConfig.margin.top / 1.8)
      .attr('dy', '0.32em')
      .text(this.formatDate(this.keyframes[0][0]));

    return ([date]: any, transition: any) => {
      transition.end().then(() => now.text(new Date(date).toLocaleString('en-US', { month: 'long', day: 'numeric' })));
    };
  }

  axis(svg: any) {
    const g = svg.append('g')
      .attr('transform', `translate(0,${this.raceChartConfig.margin.top})`);

    const axis = d3.axisTop(this.x)
      .ticks(this.width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-this.raceChartConfig.barHeight
        * (this.raceChartConfig.numberOfBars + this.y.padding()));

    return (_: any, transition: any) => {
      g.transition(transition).call(axis);
      g.select('.tick:first-of-type text').remove();
      g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
      g.select('.domain').remove();
    };
  }

  textTween = (a: any, b: any, apply: any) => {
    const i = d3.interpolateNumber(a, b);
    return (t: any) => {
      apply.text(this.formatNumber(i(t)));
    };
  };

  labels = (svg: any) => {
    let label = svg.append('g')
      .style('font', 'bold 12px var(--sans-serif)')
      .style('font-variant-numeric', 'tabular-nums')
      .attr('text-anchor', 'end')
      .selectAll('text');

    // eslint-disable-next-line no-return-assign
    return ([, data]: any, transition: any) => label = label
      .data(data.slice(0, this.raceChartConfig.numberOfBars), (d: RankData) => d.name)
      .join(
        (enter: any) => enter.append('text')
          .attr('transform', (d: any) => `translate(${this.x((this.prev.get(d) || d).value)},${this.y((this.prev.get(d) || d).rank)})`)
          .attr('y', this.y.bandwidth() / 2)
          .attr('x', -6)
          .attr('dy', '-0.25em')
          .text((d: RankData) => d.name)
          .call((text: any) => text.append('tspan')
            .attr('fill-opacity', 0.7)
            .attr('font-weight', 'normal')
            .attr('x', -6)
            .attr('dy', '1.15em')),
        (update: any) => update,
        (exit: any) => exit.transition(transition).remove()
          .attr('transform', (d: RankData) => `translate(${this.x((this.next.get(d) || d).value)},${this.y((this.next.get(d) || d).rank.toString())})`)
          .call((g: any) => g.select('tspan').tween('text', (d: any) => this.textTween(d.value, (this.next.get(d) || d).value, svg.select(`#${d.name.replace(/\s/g, '_')}_value`)))),
      )
      .call((bar: any) => bar.transition(transition)
        .attr('transform', (d: any) => `translate(${this.x(d.value)},${this.y(d.rank)})`)
        .call((g: any) => g.select('tspan').attr('id', (d: RankData) => `${d.name.replace(/\s/g, '_')}_value`).tween('text', (d: RankData) => this.textTween((this.prev.get(d) || d).value, d.value, svg.select(`#${d.name.replace(/\s/g, '_')}_value`)))));
  }

  bars = (svg: any) => {
    let bar = svg.append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('rect');

    // eslint-disable-next-line no-return-assign
    return ([, data]: any, transition: any) => bar = bar
      .data(data.slice(0, this.raceChartConfig.numberOfBars), (d: RankData) => d.name)
      .join(
        (enter: any) => enter.append('rect')
          .attr('fill', this.color())
          .attr('height', this.y.bandwidth())
          .attr('x', this.raceChartConfig.margin.left)
          .attr('y', (d: any) => this.y((this.prev.get(d) || d).rank))
          .attr('width', (d: any) => this.x((this.prev.get(d) || d).value) - this.x(0)),
        (update: any) => update,
        (exit: any) => exit.transition(transition).remove()
          .attr('y', (d: any) => this.y((this.next.get(d) || d).rank))
          .attr('width', (d: any) => this.x((this.next.get(d) || d).value) - this.x(0)),
      )
      .call((barr: any) => barr.transition(transition)
        .attr('y', (d: any) => this.y(d.rank))
        .attr('width', (d: any) => this.x(d.value) - this.x(0)));
  }
}

async function* renderChart(data: any, updateConfig: any) {
  const chart = new RaceChart(data, updateConfig);

  const svg = d3.select('.race-chart');

  svg.append('text')
    .attr('class', 'graph-title')
    .attr('text-anchor', 'left')
    .style('font-size', '22px')
    .attr('x', chart.raceChartConfig.margin.left)
    .attr('y', chart.raceChartConfig.titlePadding)
    .text(chart.raceChartConfig.title);

  const updateBars = chart.bars(svg);

  const updateAxis = chart.axis(svg);

  const updateLabels = chart.labels(svg);

  const updateTicker = chart.ticker(svg);
  yield svg.node();

  let keyframe;
  for (keyframe of chart.keyframes) {
    const transition = svg.transition()
      .duration(chart.raceChartConfig.duration)
      .ease(d3.easeLinear);

    // Extract the top bar’s value.
    chart.x.domain([0, keyframe[1][0].value]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    // invalidation.then(() => svg.interrupt());
    // eslint-disable-next-line no-await-in-loop
    await transition.end();
  }
}

export default renderChart;
