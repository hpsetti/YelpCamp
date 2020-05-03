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

app.use(bodyParser.urlencoded([{extended:false}]));
app.use(express.static('public'));
app.set("view engine","ejs");
seedDb();

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
 
//landing page
app.get("/",function(req,res){
    res.render("landing");
});

//INDEX - campgrounds listing page
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,Newcampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:Newcampground});
        }
    })
});


//CREATE route
app.post("/campgrounds",function(req,res){
//adding a campground using an array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name:name,image:image,description:description};
    // campgrounds.push(newCampground);

//adding a campground using mongodb
    Campground.create(
        newCampground
    ,function(err,Newcampground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});


//NEW route
app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});


//SHOW route
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});


//============================
// COMMENT ROUTES
//=============================

//NEW ROUTE
app.get("/campgrounds/:id/comment/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            console.log(campground);
        res.render("comment/new",{campground:campground});
        }
    });
});

//CREATE ROUTE
app.post("/campgrounds/:id/comment",isLoggedIn,function(req,res){
    var newComment = req.body.comment;
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
            console.log(err);
        }else{
            Comment.create(newComment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            })
        }
    })
});



//AUTH ROUTES

//SHOW SIGNUP Page
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/campgrounds");
            });
        }
    });
});

//SHOW LOGIN Page
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen("3000",function(){
    console.log("server is running");
});