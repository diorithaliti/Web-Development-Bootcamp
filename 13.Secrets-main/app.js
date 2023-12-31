//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require ("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;



const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({ //
  secret: "our little secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  twitterId: String,
  secret: Array
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      facebookId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));

app.get("/auth/facebook",
  passport.authenticate("facebook")
);

app.get("/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

//   passport.use(new TwitterStrategy({
//       clientID: process.env.TWITTER_APP_ID,
//       clientSecret: process.env.TWITTER_APP_SECRET,
//       callbackURL: "http://localhost:3000/auth/twitter/secrets"
//     },
//     function(token, tokenSecret, profile, cb) {
//       User.findOrCreate({ twitterId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   ));
//
//   app.get('/auth/twitter',
//   passport.authenticate("twitter"));
//
// app.get('/auth/twitter/secrets',
//   passport.authenticate("twitter", { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/secrets");
//   });


  app.get("/", function(req ,res){
    res.render("home");
  });


app.get("/login", function(req, res){
  res.render("login");
});


app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets",function(req,res){
  User.find({secret:{$ne:null}},function (err, users){
    if(!err){
      if (users){
        res.render("secrets",{usersWithSecrets:users});
      }else {
        console.log(err);
      }
    }else {
      console.log(err);
    }
  });
});

app.route("/submit")
.get(function (req,res){
  if(req.isAuthenticated()){
    User.findById(req.user.id,function (err,foundUser){
      if(!err){
        res.render("submit",{secrets:foundUser.secret});
      }
    })
  }else {
    res.redirect("/login");
  }
})
.post(function (req, res){
  if(req.isAuthenticated()){
    User.findById(req.user.id,function (err, user){
      user.secret.push(req.body.secret);
      user.save(function (){
        res.redirect("/secrets");
      });
    });

  }else {
   res.redirect("/login");
  }
});
app.get("/logout", function(req, res){

  req.logout(function(err) {
    if (err) {
      console.log(err);
    }

    res.redirect('/');
  });
});


app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/submit/delete",function (req, res){
  if(req.isAuthenticated()){
    User.findById(req.user.id, function (err,foundUser){
      foundUser.secret.splice(foundUser.secret.indexOf(req.body.secret),1);
      foundUser.save(function (err) {
        if(!err){
          res.redirect("/submit");
        }
      });
    });
  }else {
    res.redirect("/login");
  }
});


app.post("/login", function (req, res){
  const user = new User ({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });
});





app.listen(process.env.PORT || 3000, function() {
  console.log("server started on port 3000");
});



