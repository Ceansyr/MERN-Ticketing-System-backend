import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - User registration endpoint
router.post('/register', register);

// POST /api/auth/login - User login endpoint
router.post('/login', login);

export default router;
