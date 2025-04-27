const express = require("express");
const { register, login, googleLogin } = require("../controllers/auth");
const passport = require("passport");
const User = require("../model/user");
require("../config/passport");


const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/google",googleLogin)

router.get('/google', passport.authenticate('google', {scope:['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google', {session:false,failureRedirect:'/'}),(req, res)=>{
    res.send({data:1235})
})

passport.serializeUser((user, done)=>{
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    const user = await User.findById(id)
    done(null, user)
})
module.exports = router;