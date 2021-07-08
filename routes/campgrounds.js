const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utilities/catchAsync");
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//Index and New Camp Post
router.route("/")
    .get(catchAsync(campgrounds.index))
    // .post(isLoggedIn, validateCamp, catchAsync(campgrounds.createNewCampground));
    .post(upload.array("image"), (req, res) => {
        console.log(req.body, req.files);
        res.send("Maybe?");
    })

//New Camp Form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//Camp Details, Update Campground, Delete Campground
router.route("/:id")
    .get(catchAsync(campgrounds.campDetails))
    .put(isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//Edit Camp
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderUpdateForm));



module.exports = router;