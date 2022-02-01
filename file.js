const PORT = 1000;
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
app.set('view engine','ejs');

const database= require('./config/mongoose')

//import passport
const passport= require('passport');
const passportLocal = require('./config/passport-local')
const session = require('express-session')

app.use(express.static('./assets'));
app.set('views',path.join(__dirname,'views'));

const server = require('http').createServer(app);
const io= require('socket.io')(server,{cors:{origin:'*'}})
const User = require('./models/user');


app.use(express.urlencoded({extended:true}));
app.use(cookieParser()); //middleware
app.use(passport.setAuthenticatedUser);

//session used
app.use(session({
    name: 'login',
    secret:'xyz',
    saveUninitialized : false,
    resave : false,
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}))

app.use(passport.initialize());
app.use(passport.session());
/*
app.get('/profile',function(req,res){
    return res.render('Profile',{name:req.cookies.name});
})
*/
app.get('/signin',function(req,res){
    return res.render('SignIn');
})

app.get('/signup',function(req,res){
    console.log(req.cookies);
    return res.render('SignUp');
})
app.get('/profile',passport.checkAuthentication,function(req,res){
    return res.render('profile');
})

app.post('/userCreate',function(req,res){
    if(req.body.password != req.body.confirm_password){
    console.log("Password not matched");
    return res.redirect('back'); 
    }
    User.findOne({email : req.body.email},function(err,user){
        if(err){
            console.log("error found");
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                console.log(req.body);
                if(err){
                    console.log("error found");
                    return;
                }
              return res.redirect('/signin')
            })
        }
        else{
            return res.redirect('back');
        }
    })

})

app.post('/userLogin',
passport.authenticate(
    'local',
    {failureRedirect: '/signup'}
    ),function(req,res){
    return res.redirect('/profile')
})



app.listen(PORT,function(err){
    if(err){
        console.log(err);
        return;   
     }
        console.log("Server is running on port",PORT)
})
/*
app.post('/userLogin',function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("error found");
            return;
        }
        if(user){
           if(user.password != req.body.password){
               return res.redirect('back')
           }
           res.cookie('name',user.name);
           res.redirect('/profile');
        }
        else{
           return res.redirect('back');
        }
    })
})
*/