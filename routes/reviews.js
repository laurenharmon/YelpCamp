const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");


//CREATE REVIEW
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//CAMP REVIEW DELETE
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;