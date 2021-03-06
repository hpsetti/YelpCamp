var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Campground = require("./models/campground.js");
var seedDb = require("./seeds");

app.use(bodyParser.urlencoded([{extended:false}]));
app.set("view engine","ejs");
seedDb();

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});



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
            res.render("index",{campgrounds:Newcampground});
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
app.get("/campgrounds/new",function(req,res){
    res.render("new");
});


//SHOW route
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("show",{campground:foundCampground});
        }
    });
});

app.listen("3000",function(){
    console.log("server is running");
});