const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { campValidationSchema } = require("../schemas.js");

const validateCamp = (req, res, next) => {
    const { error } = campValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

//CAMPGROUND INDEX
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

//CAMPGROUND CREATE
router.get("/new", (req, res) => {
    res.render("campgrounds/new");
})

router.post("/", validateCamp, catchAsync(async (req, res, next) => {

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`);
}))

//CAMPGROUND DETAILS
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { camp })
}))


//CAMPGROUND UPDATE
router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
}))

router.put("/:id", validateCamp, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMPGROUND DELETE
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))


module.exports = router;