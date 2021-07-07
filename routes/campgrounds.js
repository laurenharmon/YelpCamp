const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../models/campground");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware");

//CAMPGROUND INDEX
router.get("/", catchAsync(campgrounds.index));

//CAMPGROUND CREATE
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router.post("/", isLoggedIn, validateCamp, catchAsync(campgrounds.createNewCampground));

//CAMPGROUND DETAILS
router.get("/:id", catchAsync(campgrounds.campDetails));


//CAMPGROUND UPDATE
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateForm));
router.put("/:id", isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.updateCampground));

//CAMPGROUND DELETE
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));


module.exports = router;