import mongoose from 'mongoose';

const resultsSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  notification_date: { type: Date, required: true },
  postcode: { type: Number, required: true },
  lhd_2010_code: { type: String, required: true },
  lhd_2010_name: { type: String, required: true },
  lga_code19: { type: Number, required: true },
  lga_name19: { type: String, required: true },
});

const Results = mongoose.model('Results', resultsSchema);

export default Results;
