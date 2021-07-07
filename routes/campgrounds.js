const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware");

//CAMPGROUND INDEX
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}))

//CAMPGROUND CREATE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

router.post("/", isLoggedIn, validateCamp, catchAsync(async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "New Campground Created Successfully");
    res.redirect(`/campgrounds/${newCamp.id}`);
}))

//CAMPGROUND DETAILS
router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await (await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("author"));
    if (!camp) {
        req.flash("error", "Campground not found.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp })
}))


//CAMPGROUND UPDATE
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash("error", "We couldn't find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp })
}))

router.put("/:id", isLoggedIn, isAuthor, validateCamp, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", `Successfully updated ${camp.title}!`);
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMPGROUND DELETE
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground.");
    res.redirect("/campgrounds");
}))


module.exports = router;