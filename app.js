//Express
const express = require("express");
const app = express();
//Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
});
//EJS Mate
const ejsEngine = require("ejs-mate");
app.engine("ejs", ejsEngine);
//Path and Views Settings
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Parse Request Body Middleware
app.use(express.urlencoded({ extended: true }));
//Allow for Method Overrides & Middleware
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//utilities

const ExpressError = require("./utilities/ExpressError");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

////////////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log("Good to go!");
})

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

//HOME
app.get("/", (req, res) => {
    res.render("home");
})

//404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//ERROR
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No! Something Went Wrong!"
    res.status(statusCode).render("error", { err });
})