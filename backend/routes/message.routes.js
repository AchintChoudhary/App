import express from "express"
const router=express.Router()
import { sendMessage,receieveMessage } from "../controllers/message.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";


router.post("/send/:id",isLogin,sendMessage)
router.get("/:id",isLogin,receieveMessage)




export default router;