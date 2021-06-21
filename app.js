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
//Path and Views Settings
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//Parse Request Body
app.use(express.urlencoded({ extended: true }));
//Allow for Method Overrides
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
//Models
const Campground = require("./models/campground");
///////////////////////////////////////////////////////////////////////
app.listen(3000, () => {
    console.log("Good to go!");
})

//HOME
app.get("/", (req, res) => {
    res.render("home");
})

//CAMPGROUND INDEX
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})

//CAMPGROUND CREATE
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds/:id", async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp.id}`);
})

//CAMPGROUND READ
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/show", { camp })
})


//CAMPGROUND UPDATE
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp })
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${camp.id}`);
})

//CAMPGROUND DELETE
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})