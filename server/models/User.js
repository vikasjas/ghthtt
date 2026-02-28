
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: String,
  age: Number,
  bio: String,
  interests: [String],
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
