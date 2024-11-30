const express=require ('express');
const User = require("../models/user");
const router=express.Router();

const {v4:uuidv4}= require("uuid");
const {setUser}= require('../service/auth');

router.post('/signup', async (req, res) => {
    try {

      const {email,password,username}=req.body;
      // Check if the email already exists
      const existingUser = await User.findOne({ email});
      if (existingUser) {
          return res.status(400).json({ message: "Email already in use. Please use a different email." });
      }

      // const hashedPassword = await bcrypt.hash(password, 10);

      const user=new User({email,password,username});
      console.log("in signup block");
      console.log(req.body);
      user.save()
      .then((result)=>{
        console.log(result);
      })
      .catch((err)=>{
        console.log(err); 
      })
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ message: "An error occurred while creating the user." });
    }
  res.redirect('/');
});

router.post('/login',async (req,res)=>{
    try {
      console.log(req.body);
      const { email, password } = req.body;
       
      console.log('Login attempt for email:', email);
      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'User not found. Please sign up.' });
      }
  
      // Compare the password
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   return res.status(401).json({ message: 'Invalid password' });
      // }
     
      const token=setUser(user);
      console.log('Setting cookie...')
      res.cookie("uid",token);
      console.log("cookie set");
  
  
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
    res.redirect('/');
  })

module.exports=router;