import express from 'express';

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

export default router;