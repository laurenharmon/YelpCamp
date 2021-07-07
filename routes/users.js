const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const passport = require("passport");
const User = require("../models/user");

//REGISTER
router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registered = await User.register(user, password);
        req.flash("success", `Registration for ${registered.username} was successful!`);
        res.redirect("/login");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}))

//LOGIN
router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), catchAsync(async (req, res, next) => {
    req.flash("success", "Welcome Back!")
    res.redirect("/");
}))

//LOGOUT
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You've been logged out.");
    res.redirect("/");
})

module.exports = router;