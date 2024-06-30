module.exports.isLoggedIn= (req,res,next) =>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req. _parsedOriginalUrl.pathname;
        req.flash("error","Please login first !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRediectUrl=(req,res,next)=>{
    console.log("Im in saverediect");
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}