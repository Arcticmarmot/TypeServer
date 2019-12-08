const user = require('../models/user');
const createError = require('http-errors');
const checkProfile = require("../utils/constant").checkProfile;
const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;

exports.getProfile = (req,res,next)=>{
    user.find_by_email_profile(req.cookies.uid,(err,data)=>{
        if(err) return next(createError(500,'load fail',{text:'Unknown error'}));
        succeed(res,'load succeed',{email:req.cookies.uid,username:data.username});
    })
};

exports.postProfile = (req,res,next)=>{
    if(auth(req)){
        const username = req.body.username;
        if(!checkProfile(username)) return next(createError(403,'fail',{text:''}));
        user.update_username(req.cookies.uid,username,(err,data)=> {
            if (err) return next(createError(500,'save fail',{text:'Unknown error'}));
            succeed(res,'succeed',{text:'save succeed'})
        });
    }else{
        return next(createError(401,'save fail,please login first',{text:'unauthorized'}))
    }

};
