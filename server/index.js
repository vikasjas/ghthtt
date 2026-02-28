
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import messageRoutes from './routes/message.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const mongoUri = process.env.MONGO_URI || 'mongodb+srv://v588721_db_user:<AAqNEWNYXsL2Hx1H>@date1.shosue8.mongodb.net/';


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Dating App API Running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
