module.exports=isLoggedIn=function(req, res, next) {
    if (req.user) {
      return next();
    } else {
      req.flash('failure','Please Log In or Sign Up First')
      return res.redirect("/signup");
    }
  };
  