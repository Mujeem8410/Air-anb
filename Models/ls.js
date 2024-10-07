
const { ref } = require("joi");
const Review = require('./review.js');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        image: {
            url:String,
            filename:String,
        },
        price: Number,
        Location: String,
        Country: String,
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review",
        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",

        },
    }
);
 listingSchema.post("findOneAndDelete",async(listing)=>{
 if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
 }
 });
const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;