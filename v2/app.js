var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var mongoose = require("mongoose");


app.use(bodyParser.urlencoded([{extended:false}]));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground = mongoose.model("campground",campgroundSchema);

// var campgrounds = [
//     {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
//     {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
//     {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"},
//     {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
//     {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
//     {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"},
//     {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
//     {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
//     {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"}
// ];

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
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show",{campground:foundCampground});
        }
    });
});

app.listen("3000",function(){
    console.log("server is running");
});