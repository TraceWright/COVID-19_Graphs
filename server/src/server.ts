import express from 'express';
import connectDb from './connection';
import Results from './Results';

const app = express();
const PORT = 8080;

app.get('/results', async (req, res) => {
  const results = await Results.aggregate([
    {
      $group: {
        _id: '$notification_date',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);

  connectDb().then(() => { console.log('MongoDb connected'); });
});
