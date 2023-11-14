const Listing=require("../models/listing.js")
const Review=require("../models/review.js")
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
    req.flash("error","You MUSt be LOGGED in to create listings");
    return res.redirect("/login");}
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        // console.log(req.session.redirectUrl)
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash("error", "You  are not Authorized ");
            return res.redirect(`/listings/${id}`);
        }

        // If the user is the owner, proceed to the next middleware or route handler
        next();
    
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(', ');
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(', ');
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You  are not Authorized ");
        return res.redirect(`/listings/${id}`);
    }

    // If the user is the owner, proceed to the next middleware or route handler
    next();

};