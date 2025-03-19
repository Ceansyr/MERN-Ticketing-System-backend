import express from 'express';

const router = express.Router();

// @route   GET /auth/test
// @desc    Test route
// @access  Public
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});
export default router;