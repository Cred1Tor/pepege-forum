import mongoose from 'mongoose';

export default await mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true },
).catch((err) => { throw err; });
