const succeed = require('../utils/constant').succeed;
const user = require('../models/user');
const createError = require('http-errors');
const auth = require('../utils/auth').auth;

exports.logout = (req,res,next)=>{
    if(auth(req)){
        user.setLogin(req.cookies.uid,false,(err,data)=>{
            if(err) return next(createError(500,'logout fail',{text:'Unknown error'}));
            req.session.destroy();
            res.clearCookie('uid');
            succeed(res,'succeed',{text:'logout succeed'});
        });
    }else{
        return next(createError(401,'logout fail',{text:'unauthorized'}))
    }

};
