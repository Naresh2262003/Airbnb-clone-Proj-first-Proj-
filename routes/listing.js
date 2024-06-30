const express= require("express");
const router= express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, saveRediectUrl}= require("../middleware.js");

// verify the input
const validateListing= (req,res,next)=>{ 
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/",wrapAsync(
    async (req,res)=>{
        const allListings= await Listing.find();
        res.render("listings/index",{allListings});
    }
));

router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new");
}); 

router.get("/:id",wrapAsync(
    async (req,res)=>{
        let {id}=req.params;
        const currListing= await Listing.findById(id).populate("reviews");
        if(!currListing){
            req.flash("error","Listing you requested for doen't exist");
            res.redirect("/listings");
        }
        res.render("listings/show",{listing:currListing});
    }
));

router.post("/", isLoggedIn,  validateListing, wrapAsync(
    async (req,res)=>{
        const newListing= new Listing(req.body);
        const list= await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    }
));


router.get("/:id/edit", isLoggedIn, wrapAsync(
    async (req,res,next)=>{
        let {id}=req.params;
        const currListing= await Listing.findById(id);
        if(!currListing){
            req.flash("error","Listing you requested for doen't exist");
            res.redirect("/listings");
        }
        res.render("./listings/edit",{listing:currListing});
    }
));

router.put("/:id", isLoggedIn,  validateListing, wrapAsync(
    async (req,res)=>{
        let {id} =req.params;
        const currlisting= await Listing.findByIdAndUpdate(id,req.body,{runValidators:true, new:true});
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
    }
));

router.delete("/:id", isLoggedIn, wrapAsync(
    async(req,res)=>{
        let {id}= req.params;
        const currListing= await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted");
        res.redirect("/listings");
    }
));

module.exports= router;
