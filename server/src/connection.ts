import mongoose from 'mongoose';

const { MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_ENDPOINT } = process.env;

const connection = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_ENDPOINT}`;
const connectDb = () => mongoose.connect(connection, {
  useNewUrlParser: true, useUnifiedTopology: true,
});

export default connectDb;
