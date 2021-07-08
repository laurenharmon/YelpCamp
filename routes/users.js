const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

//REGISTER
router.route("/register")
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerPost));

//LOGIN
router.route("/login")
    .get(users.renderLoginForm)
    .post(passport.authenticate("local",
        { failureFlash: true, failureRedirect: "/login" }),
        catchAsync(users.loginSuccessful));

//LOGOUT
router.get("/logout", users.logout);



module.exports = router;