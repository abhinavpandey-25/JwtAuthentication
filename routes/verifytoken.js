import jwt from 'jsonwebtoken';
//this middleware is for authenticated user ki wo whi user h jisne signup kiya h ua nhi by 
//taking the token as an identification during accesing any private route
const middleware=(req,res,next)=>{
    //frontend se req header m bhejenge
    const token=req.header('auth-token')
    if(!token){
        //401 not authorized
        return res.status(401).send('Access Denied')
    }
    //now for accessing any private route u can use this mmiddleware 
    else{   jwt.verify(token,process.env.SECRET_KEY,(error,payload)=>{
                if(error){
                    return res.status(401).send('login first')
                }
                else{
                    req.user=payload._id;
                    next()
                }
            })
      
    }
}
export default middleware;