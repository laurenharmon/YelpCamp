const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

//create
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createNewCampground = async (req, res, next) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await newCamp.save();
    req.flash("success", "New Campground Created Successfully");
    res.redirect(`/campgrounds/${newCamp.id}`);
}

//read
module.exports.campDetails = async (req, res, next) => {
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
}

//update
module.exports.renderUpdateForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash("error", "We couldn't find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", `Successfully updated ${camp.title}!`);
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground.");
    res.redirect("/campgrounds");
}

//delete