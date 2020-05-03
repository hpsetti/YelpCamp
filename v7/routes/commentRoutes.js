var express = require("express");
var router = express.Router({mergeParams:true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");


//============================
// COMMENT ROUTES
//=============================

//NEW ROUTE
router.get("/new",isLoggedIn,function(req,res){
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
router.post("/",isLoggedIn,function(req,res){
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


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
