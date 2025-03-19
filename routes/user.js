import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Define your user-related routes here
router.get('/', (req, res) => {
    res.send('Get all users');
});

router.post('/', (req, res) => {
    res.send('Create a new user');
});

router.get('/:id', (req, res) => {
    res.send(`Get user with ID: ${req.params.id}`);
});

router.put('/:id', (req, res) => {
    res.send(`Update user with ID: ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Delete user with ID: ${req.params.id}`);
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    // `req.user` is set by the authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;