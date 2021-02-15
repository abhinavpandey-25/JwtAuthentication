import express from 'express';
import middleware from './verifytoken.js'
const router=express.Router();
router.get('/',middleware,(req,res)=>{
    res.json({userid:req.user});
})
export default router