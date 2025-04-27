const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const User = require('../model/user')

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8500/api/auth/google/callback"
}, async(accessToken, refreshToken, profile, done)=>{
    // console.log(profile)
    let user = await User.findOne({googleId: profile.id})
    if(!user){
        user = new User({name: profile.displayName, email:profile.emails[0]?.value, googleId:profile.id})
        await user.save()
    }
    return done(null, user)
    
}))