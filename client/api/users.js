import mongoose from "mongoose";

// Import your User model. Adjust the path if needed.
import User from "../../server/models/User";

export default async function handler(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
