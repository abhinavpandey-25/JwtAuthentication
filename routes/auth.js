import express from 'express'
import User from '../model/user.js'
import bcrypt from 'bcryptjs'
import joi from 'joi';
import jwt from 'jsonwebtoken'
const router = express.Router();
const registerschema = joi.object({
    name: joi.string().min(6).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required()
})
const loginschema = joi.object({
    email: joi.string().min(6).required(),
    password: joi.string().min(6).required()
})

router.post('/signup', async (req, res) => {
    //lets do the validation  
    try {
        const value = await registerschema.validateAsync(req.body);



        const password = req.body.password;
        bcrypt.hash(password, 12).then(async encryptPassword => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: encryptPassword
            })
            const emailExist = await User.findOne({ email: req.body.email })
            if (emailExist) {
                return res.status(400).send("User with this email already exists");
            }
            else {
                const savedUser = await user.save();
                res.json({ user: savedUser._id });
            }
        }).catch(e => console.log(e));



    }
    catch (err) {
        return res.status(400).json({ error: err.details[0].message });
    }

})
router.post('/login', async (req, res) => {
    try {
        const value = await loginschema.validateAsync(req.body)
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send('email or password is wrong')
        }
        else {
            const validPass = await bcrypt.compare(req.body.password, user.password)
            if (!validPass) {
                return res.status(400).send('email or password is not matched')
            }
            else {
               const token= jwt.sign({_id:user._id},process.env.SECRET_KEY)
                res.header('auth-token',token).send({token})
            }
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
})

export default router;
// export default router; for this to be allowed we need tu put type:module once u put this type
//then require syntax willnot work