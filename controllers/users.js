const User = require("../models/user");
const ExpressError = require("../utilities/ExpressError");

//REGISTER
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerPost = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registered = await User.register(user, password);
        req.login(registered, err => {
            if (err) return next(err);
            req.flash("success", `Registration for ${registered.username} was successful!`);
            res.redirect("/");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}

//LOGIN
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginSuccessful = async (req, res, next) => {
    req.flash("success", "Welcome Back!")
    const redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//LOGOUT
module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "You've been logged out.");
    res.redirect("/");
}
