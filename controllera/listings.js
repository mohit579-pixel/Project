require('dotenv').config();
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
// console.log(mapToken);
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.main=async(req,res)=>{
  // const alllistings=await Listing.find({});
  // console.log(alllistings)
  res.render("listings/home.ejs");
};


module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    // console.log(alllistings)
    res.render("listings/index.ejs",{alllistings});
};

module.exports.renderNewForm= (req, res) => {
  
    res.render("listings/new.ejs");
  };

  module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listings=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    
    res.render("listings/show.ejs",{listings})
};

module.exports.createListing=async(req,res)=>{
    let response=await geoCodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send();

    let url=req.file.path;
    let filename=req.file.filename;

    const newListing =new Listing(req.body.listing);
    console.log(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_100");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };

  module.exports.updateListing=async (req, res) => {
    
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
      console.log("listing",listing);
      if(typeof req.file!=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      console.log("done");
      listing.image={url,filename};
      await listing.save();
      }
      req.flash("success","Listing Updated!");
      res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  };