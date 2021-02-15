import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import postRoute from './routes/posts.js'
const app=express();
app.use(express.json());
dotenv.config();
mongoose.connect(process.env.MONGO_URL,{useUnifiedTopology:true,useNewUrlParser:true,useFindAndModify:true},()=>console.log("connected"))

app.use('/api/user',authRoute);
//the possts routes below can only be accesed if the user is a logged in one
app.use('/api/posts',postRoute)
app.listen(3000,()=>console.log("listen"))