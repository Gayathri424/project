const express=require('express');
const router=express.Router();
const Upload = require('../models/upload');
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        // Assuming you have a middleware to authenticate the user and attach `req.user`
        
        const userId = req.user._id;
        console.log(userId);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: User not logged in' });
        }

        // Fetch uploads related to this user
        const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });
        console.log(uploads);
        
        res.json(uploads);
    } catch (error) {
        console.error('Error fetching user history:', error.message);
        res.status(500).send('Server error');
    }
});

module.exports=router;
