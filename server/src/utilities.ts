import { ICases } from './models/Cases';

const formatData = (data: ICases[]) => data.flatMap((element: {timeseries: any, state: any}) => {
  const { state, timeseries } = element;
  return timeseries.map((el: {date: Date, value: number}) => ({
    name: state, value: el.value, date: el.date, category: state,
  }));
});

export default formatData;
