const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const db = require("./config/dbconfig");
const path=require("path")
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const authinitialize = require("./config/passport");
const authRoute = require("./Routes/auth");
const mainRoute = require("./Routes/main");
const productRoutes = require("./Routes/product");
const reviewRoutes = require("./Routes/review");
const cartRoutes = require("./Routes/cartroutes");
const checkoutRoutes = require("./Routes/checkout");
const orderRoutes = require("./Routes/order");
var OrderCount = require("./Models/ordernumber");
require("dotenv").config();
port=process.env.PORT||3000;
const app = express();
app.use(
  session({
    secret: "Keyboard",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
app.use(passport.initialize());
app.use(passport.authenticate("session"));
authinitialize(passport);


app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.failure = req.flash("failure");
  next();
});

app.use(authRoute);
app.use(mainRoute);
app.use(productRoutes)
app.use(orderRoutes)
app.use(checkoutRoutes)
app.use(reviewRoutes)
app.use(cartRoutes)

OrderCount.find({}, function (err, orderCountObjects) {
  if (orderCountObjects.length == 0) {
    OrderCount.create({ count: 0 });
  }
});



app.listen(port, "localhost", () => {
    console.log("App listening for Requests");
});

  