const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/ls.js");
const {validationreview, isLoggedIn, isReviewOwner} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


router.post("/",isLoggedIn, validationreview, wrapAsync(reviewController.createReview));


router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyreview));

module.exports = router;