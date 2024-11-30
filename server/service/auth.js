const jwt=require('jsonwebtoken');
const secret='gayathri@123'
function setUser(user) {
  return jwt.sign({
    _id:user._id,
    email:user.email,
  },secret,
  { expiresIn: '1h' });
}
function getUser(token) {
  // if(!token) return null;
  try{
    return jwt.verify(token,secret);
  }
  catch{
    return null;
  }
  
}
module.exports = {
  setUser,
  getUser,
};