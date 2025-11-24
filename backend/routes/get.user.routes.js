import { isLogin } from "../middleware/auth.middleware.js";
import express from 'express';
const router=express.Router();
import { getUserBySearch,getCurrentChatters } from "../controllers/search.controller.js";

router.get('/getuser',isLogin,getUserBySearch)
router.get("/getchatters",isLogin,getCurrentChatters)




export default router;