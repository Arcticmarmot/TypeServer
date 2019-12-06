const createError = require('http-errors');
const user = require('../models/user');
const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;
exports.getRecord = (req,res,next)=>{
    if(auth(req)){
        user.get_typing_time(req.cookies.uid,(err,data)=>{
            if(err) return next(createError(500,'load fail',{text:'Unknown error'}));
            console.log(data);
            succeed(res,'load succeed',{typingTime:data.typingTime});
        })
    }else{
        return next(createError(401,'load fail,please login first',{text:'unauthorized'}))
    }
};
