const jwt = require('jsonwebtoken')
const User = require('../model/user');
const axios = require('axios')
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJWT = (user)=>{
    return jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET,{expiresIn:'24h'})
}

const register = async(req,res)=>{
    try {
        const {email} = req.body
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(406).json({message:'User already exists!'})
        }
        // console.log(userExists)
        const user = new User(req.body)
        await user.save()
        res.status(201).json({message:'User registered successfully'})
        
    } catch (error) {
        // console.log(error)
        res.status(400).json({ message: error.message })
    }

}
const login = async(req,res)=>{
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        // console.log(user)
        if(!user || !await user.matchPassword(password)){
            return res.status(406).json({message:'Invalid Credintials'})
        }
        const token = generateJWT(user)
        const {_id, name, role, createdAt} = user
        res.status(200).json({token, user:{id:_id, name, email, role, joinDate: new Date(createdAt).toLocaleDateString('en-CA')}})
        
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }

}

const googleLogin = async(req,res)=>{

    //console.log(req.body)
    const {token} = req.body
    try{

        const tokens = await axios.post("https://oauth2.googleapis.com/token", {
            'code': token,
            'client_id': process.env.GOOGLE_CLIENT_ID,
            'client_secret': process.env.GOOGLE_CLIENT_SECRET,
            'redirect_uri': 'postmessage',
            'grant_type': 'authorization_code'
        });
        const ticket = await client.verifyIdToken({
            idToken: tokens.data.id_token,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const {name, email, } = ticket.getPayload()
        
        let user = await User.findOne({email})
        if(!user){
            user = new User({name, email, role:'user'})
            await user.save()
        }
        const accessToken = generateJWT(user)
        const {_id, role, createdAt} = user
        res.status(200).json({token:accessToken, user:{id:_id, name, email, role,joinDate: new Date(createdAt).toLocaleDateString('en-CA')}})




    }
    catch(error){
        console.log(error)

    }
    //res.send('ok')

}


module.exports =  {register,login, googleLogin}