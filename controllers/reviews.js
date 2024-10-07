const Listing= require('../Models/ls.js');
const Review= require('../Models/review.js');



module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newreviews = new Review(req.body.review);
    newreviews.author =req.user._id;
    listing.reviews.push(newreviews);
    await listing.save();
    await newreviews.save();
    req.flash("success"," Review Created!");
    res.redirect(`/listing/${listing.id}`);
};
module.exports.destroyreview = async(req,res)=>{
    let { id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," Review Deleted!");
    res.redirect(`/listing/${id}`);


 };