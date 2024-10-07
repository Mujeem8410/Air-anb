const Listing = require("./Models/ls.js");
const review = require("./Models/review.js");
const { listingschema, reviewSchema } = require('./schema');
const ExpressError = require("./util/ExpressError.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create Listing!");
    return res.redirect('/login');
  }
  next();

};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirect = req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "You don't permission to edit!");
    return res.redirect(`/listing/${id}`);


  }
  next();
};
module.exports.validation = (req, res, next) => {
  const { error } = listingschema.validate(req.body);
  if (error) {
      let errmsg = error.details.map((el) => el.message).join(",")
      throw new ExpreesError(404, errmsg);

  }
  else {
      next();
  }

};
module.exports.validationreview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new ExpreesError(404, errmsg);

    }
    else {
        next();
    }

};
module.exports.isReviewOwner = async (req, res, next) => {
  const { id,reviewId} = req.params;
  const review1 = await review.findById(reviewId);
  if (!review1.author.equals(res.locals.curruser._id)) {
    req.flash("error", "You  are not author of this review!");
    return res.redirect(`/listing/${id}`);


  }
  next();
};
