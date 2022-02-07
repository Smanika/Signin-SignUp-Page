const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: 'your_client_id',
    clientSecret: 'yor_client_secret',
    callbackURL:'http://localhost:1000/auth/google/callback'
},
  function(accessToken,refreshToken,profile,done){
      User.findOne({email : profile.emails[0].value}).exec(function(err,user){
          if(err){
              console.log("err");
              return;
          }
            console.log(profile);
            if(user){
                return done(null,user)
            }
            else{
                User.create({
                    name:profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(24).toString('hex')
                },function(err,user){
                    if(err){
                        console.log("err");
                        return;
                    }
                    
                        return done(null,user)
                });
            }
      })
  }
))

module.exports= passport;
