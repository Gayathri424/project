const express=require ('express');
const User = require("../models/user");
const router=express.Router();

router.post('/',async (req,res)=>{
    const user=req.user._id;
    console.log(user);
    const { textarea }=req.body;
    console.log(textarea);
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not logged in' });
        }

        if (!textarea) {
            return res.status(400).json({ message: 'Feedback cannot be empty' });
        }

        // Add feedback to the user's document
        const user = await User.findById(req.user._id); // Assuming you have user authentication and req.user contains the logged-in user
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.feedback.push({ message: textarea });
        await user.save();

        // res.status(200).json({ message: 'Feedback submitted successfully' });
        res.redirect('/?feedbackSuccess=true');

    } catch (error) {
        console.error('Error saving feedback:', error);
        // res.status(500).json({ message: 'An error occurred while saving feedback' });
        res.redirect('/?feedbackSuccess=false');
    }

})

router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not logged in' });
        }

        const user = await User.findById(req.user._id); // Assuming req.user contains logged-in user data
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ feedback: user.feedback });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'An error occurred while fetching feedback' });
    }
});

module.exports=router;