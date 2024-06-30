const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
// const ExpressError= require("../utils/ExpressError.js");
// const {userSchema}= require("../schema.js");
const User=require("../models/user.js");
const passport= require("passport");
const {saveRediectUrl}=require("../middleware.js");

router.get("/signup",wrapAsync(
    async(req,res)=>{
        res.render("users/signup");
    }
));

router.post("/signup",wrapAsync(
    async(req,res)=>{
        try{
            let {username, email, password}= req.body;
            const newUser= new User({email,username});
            const savedUser= await User.register(newUser,password);
            console.log(savedUser);
            req.login(savedUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome to WanderLust!");
                res.redirect("/listings");
            });
        }catch(err){
            req.flash("error",err.message);
            res.redirect("/signup");
        }
    }
));

router.get("/login",wrapAsync(
    async(req,res)=>{
        res.render("users/login.ejs");
    }
));


router.post("/login",saveRediectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),wrapAsync(
    async(req,res)=>{
        req.flash("success","Welcome back to WanderLust!");
        let redirectUrl= res.locals.redirectUrl === undefined ? "/listings":res.locals.redirectUrl;
        res.redirect(redirectUrl);
    }
));

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        }
    });
});

module.exports = router;