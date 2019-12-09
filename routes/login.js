const user = require('../models/user');
const createError = require('http-errors');
const {MAX_AGE} = require("../utils/constant");
const succeed = require('../utils/constant').succeed;

exports.login = (req,res,next)=>{
    const userInfo = req.body;
    user.find_by_email_login(userInfo.email,(err,data)=>{
        if(err) return next(createError(500,'login fail',{text:'Unknown error'}));
        if(data){
            if(data.isLogin) return next(createError(403,'login fail',{text:'You already login in other device.'}))
            if(data.password === userInfo.password){
                user.setLogin(userInfo.email,true,(err,data)=>{
                    if(err) return next(createError(500,'login fail',{text:'Unknown error'}));
                    req.session.user = {email:userInfo.email};
                    res.cookie('uid',userInfo.email,{path:'/',maxAge:MAX_AGE, httpOnly:false});
                    succeed(res,'login succeed',{text: 'login succeed'})
                })
            }else{
                return next(createError(403,'login fail',{text:'Error account or password.'}));
            }
        }else{
            return next(createError(403,'login fail',{text:'Error account or password.'}));
        }
    })
};

