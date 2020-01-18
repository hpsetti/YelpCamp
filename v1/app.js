var express = require("express");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded([{extended:false}]));
app.set("view engine","ejs");



var campgrounds = [
    {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
    {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
    {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"},
    {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
    {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
    {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"},
    {"name":"Durdle Door", "image":"https://www.campsites.co.uk/getupload/attraction/10014/95a643a4-d176-40a0-934d-e1b84f9e3ea8/1200/627/either/campsites-near-durdle-door.jpg"},
    {"name":"Pembroke","image":"https://media-cdn.tripadvisor.com/media/photo-s/01/4e/d4/15/pembroke-at-it-s-best.jpg"},
    {"name":"Dover","image":"//nt.global.ssl.fastly.net/images/1431733755283-crackincliffportinbackground.jpg?width=30px&crop=1:1&quality=30&auto=webp"}
];

//landing
app.get("/",function(req,res){
    res.render("landing");
});

//campgrounds listing page
app.get("/campgrounds",function(req,res){
    res.render("campground",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
    res.redirect("/campgrounds");

    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});

app.listen("3000",function(){
    console.log("server is running");
});