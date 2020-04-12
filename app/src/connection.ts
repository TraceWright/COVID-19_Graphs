import mongoose from 'mongoose';

const connection = 'mongodb://localhost:27017/coronavirus';
const connectDb = () => mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });

export default connectDb;
