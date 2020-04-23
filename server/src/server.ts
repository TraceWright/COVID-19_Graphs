import express from 'express';
import cors from 'cors';
import connectDb from './connection';
import Results from './models/Results';
import Cases, { ICases } from './models/Cases';
import formatData from './utilities';

// require('dotenv').config({ path: `${__dirname}/../.env` });

const app = express();
const PORT = 8080;

// Set up a whitelist and check against it:
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS ${origin}`));
    }
  },
};

app.get('/cases', cors(corsOptions), async (req, res) => {
  const cases: ICases[] = await Cases.find({});
  const formatted = formatData(cases);
  res.json(formatted);
});

app.get('/results', cors(corsOptions), async (req, res) => {
  const results = await Results.aggregate([
    {
      $group: {
        _id: '$notification_date',
        count: { $sum: 1 },
      },
    },
    {
      $addFields: { date: '$_id' },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);

  connectDb().then(() => { console.log('MongoDb connected'); });
});
