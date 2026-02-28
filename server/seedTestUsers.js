// Script to create 15 test users in MongoDB
import mongoose from 'mongoose';
import User from './models/User.js';

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://v588721_db_user:AAqNEWNYXsL2Hx1H@date1.shosue8.mongodb.net/';

const users = Array.from({ length: 15 }).map((_, i) => ({
  username: `testuser${i+1}`,
  email: `testuser${i+1}@example.com`,
  password: 'password123',
  gender: i % 2 === 0 ? 'male' : 'female',
  age: 20 + (i % 10),
  bio: `I am test user ${i+1}`,
  interests: ['music', 'sports', 'reading'],
  avatar: '',
}));

async function seed() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({ email: { $regex: /^testuser\d+@example.com$/ } });
  await User.insertMany(users);
  console.log('15 test users created');
  await mongoose.disconnect();
}

seed();
