var express = require("express");
var router = express.Router();
var passport = require("passport");
var Product = require("../Models/product");
var User = require("../Models/register");

router.get("/", function (req, res) {
  Product.find({},function(err,productS){
    if(err){
      req.flash("Error","Error is there")
      res.redirect("/")
    }
    else{
      res.render("products/home",{ products: productS });
    }
  })

});


router.get("/logout", function (req, res) {
  req.logout((err)=>{
    if(err) res.redirect("/")
    return
  });
  req.flash("success", "Love to have You Here, Come back Soon ;(");
  res.redirect("/",);
});

module.exports = router;