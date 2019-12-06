const user = require('../models/user');
const createError = require('http-errors');
const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;

exports.getProfile = (req,res,next)=>{
    succeed(res,'succeed',{email:req.session.user.email,username:req.session.user.username});
};

exports.postProfile = (req,res,next)=>{
    if(auth(req)){
        const username = req.body.username;
        user.update_username(req.cookies.uid,username,(err,data)=> {
            if (err) return next(createError(500,'save fail',{text:'Unknown error'}));
            req.session.user.username = username;
            succeed(res,'succeed',{text:'save succeed'})
        });
    }else{
        return next(createError(401,'save fail,please login first',{text:'unauthorized'}))
    }

};
