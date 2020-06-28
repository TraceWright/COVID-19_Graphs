export interface configType {
  graphSpeed: number,
  duration: number,
  title: string,
  titlePadding: number,
  barHeight: number,
  numberOfBars: number,
  margin: {
      top: number,
      right: number,
      bottom: number,
      left: number,
  },
  width: number,
  height: number,
}

const raceBarConfig = {
  barHeight: 60,
  maxBarWidth: 600,
  numberOfBars: 12,
};
const margin = {
  top: 100, right: 6, bottom: 6, left: 200,
};
const raceChartDefaultConfig: configType = {
  graphSpeed: 1,
  duration: 250,
  title: 'COVID-19 Confirmed Cases',
  titlePadding: 30,
  barHeight: raceBarConfig.barHeight,
  numberOfBars: raceBarConfig.numberOfBars,
  margin,
  width: margin.right + margin.left + raceBarConfig.maxBarWidth,
  height: margin.top + margin.bottom
      + (raceBarConfig.barHeight * raceBarConfig.numberOfBars),
};

export default raceChartDefaultConfig;
