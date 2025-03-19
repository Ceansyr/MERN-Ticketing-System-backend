import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/event.js';
import availabilityRoutes from './routes/availability.js';
import userRoutes from './routes/user.js';

dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const startServer = async () => {
        try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000 
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

startServer();