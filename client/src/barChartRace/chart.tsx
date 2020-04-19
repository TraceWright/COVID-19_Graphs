/* eslint-disable no-restricted-syntax */
import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import * as d3Chromatics from 'd3-scale-chromatic';
import dataImport from './category-brands.json';

interface ImportData { date: string, name: string, category: string, value: number }
interface BrandData { date: Date, name: string, category: string, value: number }
interface RankData { name: string, value: number, rank: number }
type KeyFramesArray = Array<any>[];
type NameFramesArray = Array<string | RankData[]>[];
type Prev = Map<RankData, RankData>;
type Next = Map<RankData, RankData>;
interface InnerData { [x: string]: number }
interface DateValueData extends Array<Date | InnerData> {
  0: Date;
  1: InnerData;
}

class RaceChart {
  k = 10;

  n = 12;

  duration = 250;

  margin = {
    top: 16, right: 6, bottom: 6, left: 0,
  };

  barSize = 48;

  width: number = this.margin.top + this.barSize * this.n + this.margin.bottom;

  height: number = this.margin.top + this.barSize * this.n + this.margin.bottom;

  y = d3.scaleBand()
    .domain(d3.range(this.n + 1) as unknown as readonly string[])
    .rangeRound([this.margin.top, this.margin.top + this.barSize * (this.n + 1 + 0.1)])
    .padding(0.1)

  x = d3.scaleLinear()
    .domain([0, 1])
    .range([this.margin.left, this.width - this.margin.right]);

  formatDate = d3.utcFormat('%Y');

  formatNumber = d3.format(',d');

  data: BrandData[] = dataImport.map((element: ImportData) => ({
    date: new Date(element.date),
    name: element.name,
    category: element.category,
    value: element.value,
  }));

  datevalues: DateValueData[] = Array.from(
    d3Array.rollup(
      this.data,
      (d: BrandData[]) => {
        const ret: InnerData = {};
        for (const p of d) {
          ret[p.name] = p.value;
        }
        return ret;
      },
      (d: BrandData) => d.date.getTime(),
    ),
  ).sort(([a], [b]) => d3.ascending(a, b))
    .map(([date, data]) => [new Date(date), data]);

  names: Set<string> = new Set(this.data.map((d) => d.name))

  rank(value: Function): RankData[] {
    const data: RankData[] = Array.from(this.names, (name) => (
      { name, value: value(name), rank: -1 }
    ));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; i += 1) data[i].rank = Math.min(this.n, i);
    return data;
  }

  keyframesFunc = (): KeyFramesArray => {
    const keyframes = [];
    let ka: Date; let kb: Date = new Date('2020-01-01T00:00:00');
    let a: InnerData; let b: InnerData;
    for ([[ka, a], [kb, b]] of d3.pairs(this.datevalues)) {
      for (let i = 0; i < this.k; i += 1) {
        const t = i / this.k;
        keyframes.push([
          new Date(ka.getTime() * (1 - t) + kb.getTime() * t),
          // eslint-disable-next-line no-loop-func
          this.rank((name: string) => (a[name] || 0) * (1 - t) + (b[name] || 0) * t),
        ]);
      }
    }
    keyframes.push([new Date(kb.getTime()), this.rank((name: any) => b[name] || 0)]);
    return keyframes;
  }

  keyframes: KeyFramesArray = this.keyframesFunc();

  nameframes = (): NameFramesArray => {
    const nf: NameFramesArray = [];
    const mapped: Map<any, any> = d3Array.group(this.keyframes.flatMap(([, dt]) => dt),
      (d: RankData) => d.name);
    mapped.forEach((element: RankData[], key: string) => nf.push([key, element]));
    return nf;
  };

  prev: Prev = new Map(this.nameframes().flatMap(([, data]) => d3.pairs(
    data as any, (a, b) => [b, a],
  ))) as Prev;

  next: Next = new Map(this.nameframes().flatMap(([, data]) => d3.pairs(data as any)));

  color = () => {
    const scale = d3.scaleOrdinal(d3Chromatics.schemeCategory10);
    if (this.data.some((d: any) => d.category !== undefined)) {
      const categoryByName = new Map(this.data.map((d: any) => [d.name, d.category]));
      scale.domain(Array.from(categoryByName.values()));
      return (d: any) => scale(categoryByName.get(d.name));
    }
    return (d: any) => scale(d.name);
  }

  ticker(svg: any) {
    const now = svg.append('text')
      .style('font', `bold ${this.barSize}px var(--sans-serif)`)
      .style('font-variant-numeric', 'tabular-nums')
      .attr('text-anchor', 'end')
      .attr('x', this.width - 6)
      .attr('y', this.margin.top + this.barSize * (this.n - 0.45))
      .attr('dy', '0.32em')
      .text(this.formatDate(this.keyframes[0][0]));

    return ([date]: any, transition: any) => {
      transition.end().then(() => now.text(this.formatDate(date)));
    };
  }

  axis(svg: any) {
    const g = svg.append('g')
      .attr('transform', `translate(0,${this.margin.top})`);

    const axis = d3.axisTop(this.x)
      .ticks(this.width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-this.barSize * (this.n + this.y.padding()));

    return (_: any, transition: any) => {
      g.transition(transition).call(axis);
      g.select('.tick:first-of-type text').remove();
      g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
      g.select('.domain').remove();
    };
  }

  textTween = (a: any, b: any) => {
    const i = d3.interpolateNumber(a, b);
    return (t: any) => {
      // this.textContent = this.formatNumber(i(t));
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
      .data(data.slice(0, this.n), (d: RankData) => d.name)
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
          .call((g: any) => g.select('tspan').tween('text', (d: any) => this.textTween(d.value, (this.next.get(d) || d).value))),
      )
      .call((bar: any) => bar.transition(transition)
        .attr('transform', (d: any) => `translate(${this.x(d.value)},${this.y(d.rank)})`)
        .call((g: any) => g.select('tspan').tween('text', (d: any) => this.textTween((this.prev.get(d) || d).value, d.value))));
  }

  bars = (svg: any) => {
    let bar = svg.append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('rect');

    // eslint-disable-next-line no-return-assign
    return ([, data]: any, transition: any) => bar = bar
      .data(data.slice(0, this.n), (d: RankData) => d.name)
      .join(
        (enter: any) => enter.append('rect')
          .attr('fill', this.color)
          .attr('height', this.y.bandwidth())
          .attr('x', this.x(0))
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

async function* renderChart() {
  const chart = new RaceChart();

  const svg = d3.select('.race-chart')
    .attr('viewBox', [0, 0, chart.width, chart.height] as any);

  const updateBars = chart.bars(svg);

  const updateAxis = chart.axis(svg);

  const updateLabels = chart.labels(svg);

  const updateTicker = chart.ticker(svg);
  yield svg.node();

  let keyframe;
  for (keyframe of chart.keyframes) {
    const transition = svg.transition()
      .duration(chart.duration)
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
