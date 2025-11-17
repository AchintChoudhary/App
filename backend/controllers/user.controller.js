import { CommandSucceededEvent } from "mongodb"
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import generateAuthToken from "../utils/jwtwebToken.js"
import {validationResult} from "express-validator"
export const userRegister=async(req,res)=>{
    try {
    const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

        const {fullname,username,email,password,gender,profilepic}=req.body

 const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).send({ success: false, message: "Email already exists" });
            }
            if (existingUser.username === username) {
                return res.status(400).send({ success: false, message: "Username already exists" });
            }
        }

       const user= await User.findOne({email,username})
       if(user){
        return res.status(500).send({success:false,message:"User and email already exist"})
       }
 //if we use hashSync() function, we dont have to use  'await' because it also a async function

const hashPassword=bcryptjs.hashSync(password,10)  //salt Round            
const profileBoy= profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
const profileGirl= profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;


  //create User method
  const newUser = new User({
    fullname:{
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    },

    username,
    email,
    password: hashPassword,
    gender,
    profilepic: gender==='male' ? profileBoy : profileGirl
  });

if(newUser){
    await newUser.save()
    generateAuthToken(newUser._id,res)
}else{
    res.status(500).send({success:false,message:"Invalid User data"})
}

res.status(201).send({
    _id:newUser._id,
    fullname:newUser.fullname,
    username:newUser.username,
    profilepic:newUser.profilepic,
    email:newUser.email,
   
})

    } catch (error) {
        res.status(500).send({success:false,message:error})
        console.log(error)
    }
}   


export const userLogin=async(req,res)=>{
    try {
         const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return  res.status(500).send({success:false,message:"Email doesn't exist"})
        }
        const comparePassword=bcryptjs.compareSync(password,user.password)

if(!comparePassword){
    return res.status(500).send({success:false,message:"eamil and password invalid"})
}

 generateAuthToken(user._id,res)
res.status(200).send({
    _id:user._id,
    fullname:user.fullname,
    username:user.username,
    profilepic:user.profilepic,
    email:user.email,
   message:"Successfully login"
})



    } catch (error) {
         res.status(500).send({success:false,message:error})
        console.log(error)
    }
}

export const userLogout=async(req,res)=>{
try {
    res.cookie("jwt",'',{
        maxAge:0
    })
    res.status(200).send({message:'User logout'})
} catch (error) {
      res.status(500).send({success:false,message:error})
        console.log(error)
}
}
