var express = require("express");
const mongoose= require("mongoose");
var router = express.Router();
const isLoggedIn=require("../Middleware/login")
var Product = require("../Models/product");
var User = require("../Models/register");

router.get("/cart/new/:id/:return",inCart, async function(req,res){
	var cartItem = {
		product: mongoose.Types.ObjectId(req.params.id),
		qty: 1
	}
	req.user.cart.items.unshift(cartItem);
	Product.findById(req.params.id, async function(err,products){
		if(err || !products) {
			req.flash("error","Product not found!!");
			res.redirect("/home");
		} else {
			req.user.cart.cart_total+=products.mrp;
			req.user.cart.discount+=products.discount;
			req.user.cart.total+=products.price;
			const user = await User.findById(req.user._id)
			user.cart.cart_total+=products.mrp;
			user.cart.discount+=products.discount;
			user.cart.total+=products.price;
			user.cart.items.unshift(cartItem);
			await user.save();		
		}
	});

	req.flash("success","Product added to Cart!!");
	if(req.params.return=="show") {
		res.redirect("/products/" + req.params.id);
	} else {
		res.redirect("/home");
	}
});

router.get("/cart",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("cart.items.product").exec(function(err,user){
		if(err || !user) {
			console.log("Error");
			req.flash("error","Something went wrong!!");
			res.redirect("/home");
		} else {
			res.render("cart/show",{user: user});
		}
	});
});

router.get("/cart/:id/:action",isLoggedIn,function(req,res){
	User.findById(req.user._id).populate("cart.items.product").exec(function(err,user){
		if(err || !user) {
			req.flash("error","Something went wrong!!");
			res.redirect("/home");
		} else {
			for(var i = user.cart.items.length - 1; i >= 0; i--) {
				var cartItem = user.cart.items[i];
				if(cartItem.product._id.equals(req.params.id)){
					if(req.params.action=='rem') {
						user.cart.cart_total-=(cartItem.product.mrp*cartItem.qty);
						user.cart.discount-=(cartItem.product.discount*cartItem.qty);
						user.cart.total-=(cartItem.product.price*cartItem.qty);
						user.cart.items.splice(i,1);
					} else {
						if(req.params.action=='inc'){
							user.cart.cart_total+=cartItem.product.mrp;
							user.cart.discount+=cartItem.product.discount;
							user.cart.total+=cartItem.product.price;
							cartItem.qty++;
						} else if(req.params.action=='dec') {
							user.cart.cart_total-=cartItem.product.mrp;
							user.cart.discount-=cartItem.product.discount;
							user.cart.total-=cartItem.product.price;
							cartItem.qty--;
							if(cartItem.qty==0) {
								user.cart.items.splice(i,1);
							}
						}
					}
					break;
				}
			}
			user.save();
			req.flash("success","Cart updated!!");
			res.redirect("/cart");
		}
	});
});

function inCart(req,res,next) {
	if(req.isAuthenticated()) {
		if(req.user.cart.items.some(function(cartItem){
			return cartItem.product._id==req.params.id;
		})) {
			req.flash("error","This product is already present in your cart!!");
			res.redirect("/home");
		} else {
			next();
		}
	} else {
		req.flash("error","Login to continue!!");
		res.redirect("/login");
	}
}

module.exports = router;