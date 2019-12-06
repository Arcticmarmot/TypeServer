const user = require('../models/user');
const createError = require('http-errors');
const succeed = require('../utils/constant').succeed;

exports.login = (req,res,next)=>{
    const userInfo = req.body;
    user.find_by_email(userInfo.email,(err,data)=>{
        if(err) return next(createError(500,'login fail',{text:'Unknown error'}));
        if(data){
            if(data.password === userInfo.password){
                req.session.user = data;
                res.cookie('uid',data.email,{path:'/',maxAge:1000*60*60*12, httpOnly:false});
                succeed(res,'login succeed',{text: 'login succeed'})
            }else{
                return next(createError(403,'login fail',{text:'Error account or password.'}));
            }
        }else{
            return next(createError(403,'login fail',{text:'Error account or password.'}));
        }
    })
};

