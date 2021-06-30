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
//Joi
const { campValidationSchema, reviewValidationSchema } = require("./schemas.js");
//Parse Request Body Middleware
app.use(express.urlencoded({ extended: true }));
//Allow for Method Overrides & Middleware
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//utilities
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
//Models
const Campground = require("./models/campground");
const Review = require("./models/review");
const validateCamp = (req, res, next) => {
    const { error } = campValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}
const validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

////////////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log("Good to go!");
})

//HOME
app.get("/", (req, res) => {
    res.render("home");
})

//CAMPGROUND INDEX
app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

//CAMPGROUND CREATE
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds", validateCamp, catchAsync(async (req, res, next) => {

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`);
}))

//CAMPGROUND DETAILS
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { camp })
}))


//CAMPGROUND UPDATE
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}))

app.put("/campgrounds/:id", validateCamp, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMPGROUND DELETE
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

//CAMP REVIEW
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMP REVIEW DELETE
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${camp.id}`);
}))

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