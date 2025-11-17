import express from 'express'
const router=express.Router()
import {body} from "express-validator"
import { userRegister,userLogin, userLogout } from '../controllers/user.controller.js'



router.post("/register",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname").isLength({min:3}).withMessage("First name must be at least 3 character long"),
    body("password").isLength({min:8}).withMessage("Password must be at least 8 character long")],
    userRegister)

router.post("/login",[ 
  body("email").isEmail().withMessage("Invalid Email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 character long")],
  userLogin)

router.get("/logout",userLogout)

export default router;