const raceBarConfig = {
  barHeight: 60,
  maxBarWidth: 600,
  numberOfBars: 8,
};
const margin = {
  top: 60, right: 6, bottom: 6, left: 200,
};
const raceChartConfig = {
  graphSpeed: 3,
  duration: 250,
  title: 'COVID-19 Case Counts per Australian State',
  titlePadding: 30,
  barHeight: raceBarConfig.barHeight,
  numberOfBars: raceBarConfig.numberOfBars,
  margin,
  width: margin.right + margin.left + raceBarConfig.maxBarWidth,
  height: margin.top + margin.bottom
      + (raceBarConfig.barHeight * raceBarConfig.numberOfBars),
};

export default raceChartConfig;
