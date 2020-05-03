var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user");
var seedDb = require("./seeds");

var campgroundRoutes = require("./routes/campgroundRoutes.js");
var commentRoutes = require("./routes/commentRoutes.js");
var authRoutes = require("./routes/authRoutes.js");



app.use(bodyParser.urlencoded([{extended:false}]));
app.use(express.static('public'));
app.set("view engine","ejs");
// seedDb();

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

//passport initialization
app.use(require("express-session")({
    secret:"the secret is boom",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
 
 app.use("/campgrounds",campgroundRoutes);
 app.use("/campgrounds/:id/comment",commentRoutes);
 app.use(authRoutes);

app.listen("3000",function(){
    console.log("server is running");
});