const user = require('../models/user')
const pin = require('../models/pin');
const createError = require('http-errors');
const succeed = require('../utils/constant').succeed;

exports.reset = (req,res,next)=>{
    const userInfo = req.body;
    user.find_by_email(userInfo.email,(err,userData)=>{
        if(err) return next(createError(500,'reset fail',{text:'Unknown error'}));
        if(!userData) return next(createError(403,'this email has not registered.'));
        pin.get_pin_by_email(userInfo.email,(err,data)=>{
            if(err) return next(createError(500,'reset fail',{text:'Unknown error'}));
            if(data){
                if(data.pin === userInfo.pin){
                    user.update_password(userInfo.email,userInfo.password,(err,data)=>{
                        if(err) return next(createError(500,'reset fail',{text:'Unknown error'}));
                        user.find_by_email(userInfo.email,(err,data)=>{
                            if(err) return next(createError(500,'reset fail',{text:'Unknown error'}));
                            req.session.user = data;
                            res.cookie('uid',userInfo.email,{path:'/',maxAge:1000*60*60*12, httpOnly:false});
                            succeed(res,'reset succeed',{text: 'reset succeed'});
                        });
                    })
                }else{
                    return next(createError(403,'reset fail',{text:'Wrong pin'}));
                }
            }else{
                return next(createError(403,'reset fail',{text:'Wrong pin'}));
            }
        });
    });
};
