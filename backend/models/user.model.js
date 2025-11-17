import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:3
        },
        lastname:{
            type:String,
    
        }
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
required:true,
enum:["male","female"]
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    profilepic:{
  type:String,
     
        default:""
    }
},{timestamps:true})

const User=mongoose.model("User",userSchema)

export default User;