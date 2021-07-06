const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const User = require("../models/user");

//REGISTER
router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registered = await User.register(user, password);
    console.log(registered);
    req.flash("success", "Registration Successful");
    res.redirect("/login");
}))

//LOGIN
router.get("/login", catchAsync(async (req, res) => {
    res.render("users/login");
}))


module.exports = router;