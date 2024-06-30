//to find the listing which has reviews array not empty=> db.listings.find({reviews:{$not:{$size:0}});
const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require('method-override');
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");

const listingsRouter= require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const port=8080;

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.user= req.user;
//     next();
// });


// ejs-mate
app.engine("ejs",ejsMate);

// method_override
app.use(methodOverride('_method'));
 
// views
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// public
app.use(express.static(path.join(__dirname,"public")));

// post req
app.use(express.urlencoded({extended:true}));

// mongoDB
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
    .then( res => console.log("SUCCESS"))
    .catch( err => console.log("ERROR"));
    
async function main(){
    mongoose.connect(MONGO_URL);
}

// for the session 
const sessionOptions={
    secret:"localforvocal",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
// for flash
app.use(flash());
// to pop up the alert after creating a new listing
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CurrUser= req.user;
    next();
});

// for passport password
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// directing the req to other directary
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// demoUser
app.get("/demoUser",async(req,res)=>{
    const demoUser= new User({
        email:"Naresh2262003@gmail.com",
        username:"nareshsoe"
    });

    const registeredUser= await User.register(demoUser,"helloworld");
    res.send(registeredUser);
});

// Page not Found
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// Middlewares
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error"}=err;
    res.status(status).render("error",{err});
});

// express 
app.listen(port,()=>{
    console.log(`listening to ${port}`);
});