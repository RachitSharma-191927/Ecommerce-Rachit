var express = require("express");
var router = express.Router();
var isLoggedIn=require("../Middleware/login")
var Order = require("../Models/order");
var OrderCount = require("../Models/ordernumber");
var User = require("../Models/register");

router.get("/checkout", isLoggedIn, function (req, res) {
  res.render("cart/checkout", { user: req.user });
});

router.post("/checkout", isLoggedIn, function (req, res) {
  OrderCount.findOne({}, function (err, orderCountObject) {
    if (err) {
      req.flash("error", "Something went wrong!! in orderCount");
      res.redirect("/home");
    } else {
      orderCountObject.count++;
      var no = orderCountObject.count;
      orderCountObject.save();
      User.findById(req.user._id)
        .populate("cart.items.product")
        .exec(function (err, user) {
          var order = {
            no: no,
            name: req.body.name,
            address: req.body.address,
            contactNo: req.body.contactNo,
            paymentMode: "COD",
            checkoutCart: {
              items: [],
              cart_total: user.cart.cart_total,
              discount: user.cart.discount,
              total: user.cart.total,
            },
            user: req.user,
          };
          user.cart.items.forEach(function (cartItem) {
            var orderItem = {
              product: {
                id: cartItem.product._id,
                name: cartItem.product.name,
                image: cartItem.product.image,
                mrp: cartItem.product.mrp,
                category: cartItem.product.category,
                price: cartItem.product.price,
                disc_perc: cartItem.product.disc_perc,
                discount: cartItem.product.discount,
              },
              qty: cartItem.qty,
            };
            order.checkoutCart.items.push(orderItem);
          });
          Order.create(order,async function (err, order) {
            if (err || !order) {
              req.flash("error", "Something went wrong!!");
              res.redirect("/home");
            } else {
              req.user.cart.cart_total=0;
			        req.user.cart.discount=0;
			        req.user.cart.total=0;
              req.user.cart.items=[];
              req.user.orders.unshift(order);
			        const user = await User.findById(req.user._id)
			        user.cart.cart_total=0;
			        user.cart.discount=0;
			        user.cart.total=0;
			        user.cart.items=[];
              user.orders.unshift(order);
			        await user.save();
              req.flash("success", "Order placed successfully!!");
              res.redirect("/order/" + order._id + "/success");
              
            }
          });
        });
    }
  });
});

module.exports = router;