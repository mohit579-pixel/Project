const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB(); // Move the initialization step inside the main function
  })
  .then(() => {
    console.log("Data was initialized");
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    mongoose.disconnect(); // Close the MongoDB connection after operations
  });

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

const initDB = async () => {
  await Listing.deleteMany({});
  // Assuming you have a valid ObjectId for the owner
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "653f64cd8938b8daefb0218c", category: "Trending" }));
  await Listing.insertMany(initData.data);
};
