import mongoose from 'mongoose';

export const connectMongo = async () => {
  const uri = process.env.MONGODB_URI as string;

  if (!uri) {
    throw new Error('MONGO_DB URI undefined in .env');
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB: ', error);
    process.exit(1);
  }
};
