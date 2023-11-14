const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllera/listings.js");
const { isLoggedIn } = require("./middleware.js");
const { isOwner, validateListing } = require("./middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")

const upload = multer({ storage })

// Index Routings
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
  

console.log(process.env.SECRET);
// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Edit Route (placed before :id route)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Show, Update, and Delete Routes
router.route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'),wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
