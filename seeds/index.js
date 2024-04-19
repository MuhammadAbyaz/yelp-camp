const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
// Connection with mongodb
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    await new Campground({
      user: "661bdd8497e6cf8a092a81d7",
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[rand1000].longitude, cities[rand1000].latitude],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dstj0sh3r/image/upload/v1713464620/YelpCamp/facqku5weflgo7jqgvks.jpg",
          filename: "YelpCamp/facqku5weflgo7jqgvks",
        },
        {
          url: "https://res.cloudinary.com/dstj0sh3r/image/upload/v1713464622/YelpCamp/bzqb7epwazbej7sxtiix.jpg",
          filename: "YelpCamp/bzqb7epwazbej7sxtiix",
        },
      ],
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero eligendi cum, est, incidunt obcaecati eaque a ducimus expedita reprehenderit, vero debitis error. Repellat placeat voluptatibus natus error doloribus perspiciatis consectetur!",
      price,
    }).save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
