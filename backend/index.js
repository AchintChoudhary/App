import express from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import cors from "cors";     
config()
import {app,server} from './socket/socket.js'
const port=process.env.PORT
const mongoURL = process.env.MONGO_URL; 
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import cookieParser from 'cookie-parser'
import getUser from './routes/get.user.routes.js'
import path from 'path';

const __dirname=path.resolve()
// MongoDB connection
  connect(mongoURL) 
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Your code for successful connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    // Your error handling code
  });

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, // This is crucial for sending cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())  //This middleware automatically converts the JSON string into a JavaScript object 
app.use(cookieParser())
app.use(express.urlencoded({extended:true})) //It converts the form data into a JavaScript object
app.use("/users",userRouter)
 app.use("/messages",messageRouter)  
app.use("/search",getUser)

app.use(express.static(path.join(__dirname,"frontend/dist")))



app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))

})


server.listen(port,()=>{
    console.log(`app listening on port ${port}`)
})