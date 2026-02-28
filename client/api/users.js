
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../server/models/User";

// Mongoose connection cache for Vercel serverless
const MONGODB_URI = process.env.MONGO_URI;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

async function auth(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token, authorization denied');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    throw new Error('Token is not valid');
  }
}

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET' && req.query.action === 'me') {
    // Get current user profile
    try {
      const userData = await auth(req);
      const user = await User.findById(userData.id).select('-password');
      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  } else if (req.method === 'PUT' && req.query.action === 'me') {
    // Update profile
    try {
      const userData = await auth(req);
      const updates = req.body;
      const user = await User.findByIdAndUpdate(userData.id, updates, { new: true }).select('-password');
      return res.status(200).json(user);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  } else if (req.method === 'GET' && req.query.action === 'browse') {
    // Browse users (basic search)
    try {
      const userData = await auth(req);
      const users = await User.find({ _id: { $ne: userData.id } }).select('-password');
      return res.status(200).json(users);
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  } else if (req.method === 'GET') {
    // Public route to get all users
    try {
      const users = await User.find().select('-password');
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
