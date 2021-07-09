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
//Models
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 50 + 10);
        const camps = new Campground({
            author: "60e6042f7379d30ad08eb104",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: "https://res.cloudinary.com/de7wrrblm/image/upload/v1625786895/YelpCamp/imksrpgzbmhzv759ddnx.jpg",
                    filename: "YelpCamp/imksrpgzbmhzv759ddnx"
                },
                {
                    url: "https://res.cloudinary.com/de7wrrblm/image/upload/v1625786896/YelpCamp/ehe7sgqse1jxdnssz5w7.jpg",
                    filename: "YelpCamp/ehe7sgqse1jxdnssz5w7"
                },
                {
                    url: "https://res.cloudinary.com/de7wrrblm/image/upload/v1625786897/YelpCamp/t9xaqd5pxmgneuly1khf.jpg",
                    filename: "YelpCamp/t9xaqd5pxmgneuly1khf"
                }
            ],
            description: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane.",
            price
        })
        await camps.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
    console.log("connection closed")
})

