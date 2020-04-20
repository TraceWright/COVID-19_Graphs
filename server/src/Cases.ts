import mongoose from 'mongoose';

export interface ICases extends mongoose.Document {
  state: string;
  timeseries: Array<{timeseries: any, state: any}>;
}

const casesSchema = new mongoose.Schema({
  state: { type: String, required: false },
  timeseries: { type: Array, required: false },
}, { strict: false });

const Cases = mongoose.model<ICases>('Cases', casesSchema);

export default Cases;
