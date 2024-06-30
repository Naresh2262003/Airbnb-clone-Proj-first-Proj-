const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


const validateReview= (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// post review route
router.post("/",validateReview,wrapAsync(
    async(req,res)=>{
        console.log(req.params);
        let {id}= req.params;
        const currListing= await Listing.findById(id);
        const newReview = new Review(req.body);
        const resR = await newReview.save();
        currListing.reviews.push(resR);
        const resL= await currListing.save();
        req.flash("success","New Review Created");
    
        res.redirect(`/listings/${id}`);
    }
));

// delete review route
router.delete("/:reviewId",wrapAsync(
    async(req,res)=>{
        console.log(req.params);
        let {id,reviewId}= req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted");
        res.redirect(`/listings/${id}`);
    }
));

module.exports = router;