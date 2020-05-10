import mongoose from 'mongoose';

require('dotenv').config({ path: `${__dirname}/../.env` });

const {
  REACT_APP_MONGO_DB_USERNAME,
  REACT_APP_MONGO_DB_PASSWORD,
  REACT_APP_MONGO_DB_ENDPOINT,
} = process.env;

let connection: string;
if (REACT_APP_MONGO_DB_USERNAME.length === 0) {
  connection = `mongodb://${REACT_APP_MONGO_DB_ENDPOINT}`;
} else {
  connection = `mongodb+src://${REACT_APP_MONGO_DB_USERNAME}:${REACT_APP_MONGO_DB_PASSWORD}@${REACT_APP_MONGO_DB_ENDPOINT}`;
}
const connectDb = () => mongoose.connect(connection, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

export default connectDb;
