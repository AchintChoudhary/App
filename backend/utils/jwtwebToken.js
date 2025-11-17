import jwt from "jsonwebtoken"


// Generates a JWT token for the user
function generateAuthToken(userId,res,) {
  const token = jwt.sign({userId:userId }, process.env.JWT_SECRET,{expiresIn:'24h'});
  res.cookie('jwt',token,{
    maxAge:30*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.SECURE!=="development"
  })
};

// Compares provided password with stored hashed password
    // Authentication (checking passwords)
// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };


export default generateAuthToken;
