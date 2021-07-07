const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");


//CREATE REVIEW
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "Your review was posted!");
    res.redirect(`/campgrounds/${camp.id}`);
}))

//CAMP REVIEW DELETE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted your review.");
    res.redirect(`/campgrounds/${camp.id}`);
}))


module.exports = router;