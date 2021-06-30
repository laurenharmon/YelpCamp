const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { reviewValidationSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

//CREATE REVIEW
router.post("/", validateReview, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMP REVIEW DELETE
router.delete("/:reviewId", catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${camp.id}`);
}))


module.exports = router;