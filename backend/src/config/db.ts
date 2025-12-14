import mongoose from 'mongoose';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/sweetshop';

export default async function connectDB() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}
