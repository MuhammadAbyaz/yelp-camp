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
    await new Campground({
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    }).save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
