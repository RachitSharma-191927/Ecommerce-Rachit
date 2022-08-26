var express = require("express");
var router = express.Router();
var User = require("../Models/register");
var Order = require("../Models/order");
const isLoggedIn=require("../Middleware/login")

router.get("/order/:id/success", isLoggedIn, function (req, res) {
  res.render("cart/confirmation", { id: req.params.id });
});

router.get("/orders", isLoggedIn, function (req, res) {
  User.findById(req.user._id)
    .populate("orders")
    .exec(function (err, user) {
      if (err || !user) {
        req.flash("error", "Something went wrong!! if no Users");
        res.redirect("/home");
      } else {
        res.render("orders/index", { orders: user.orders });
      }
    });
});

router.get("/orders/:id", isLoggedIn, function (req, res) {
  Order.findById(req.params.id, function (err, order) {
    if (err || !order) {
      req.flash("error", "Order not found!!");
      res.redirect("/home");
    } else {
      res.render("orders/show", { order: order });
    }
  });
});

module.exports = router;