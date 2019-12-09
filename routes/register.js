const user = require('../models/user');
const pin = require('../models/pin');
const crypt = require('crypto');
const createError = require('http-errors');
const {MAX_AGE} = require("../utils/constant");
const checkRegister = require("../utils/constant").checkRegister;
const succeed = require('../utils/constant').succeed;

exports.register = (req,res,next)=>{
    const userInfo = req.body;
    if(!checkRegister(userInfo)) return next(createError(403,'fail',{text:''}));
    user.find_by_email_existence(userInfo.email,(err,data)=>{
        if(err) return next(createError(500,'register fail',{text:'Unknown error'}));
        if(data) return next(createError(403,'this email has already registered.'));
        pin.get_pin_by_email(userInfo.email,(err,data)=>{
            if(err) return next(createError(500,'register fail',{text:'Unknown error'}));
            if(data){
                if(data.pin === userInfo.pin){
                    const hash = crypt.createHash('md5');
                    hash.update(new Date().getTime().toString());
                    const username = hash.digest('hex');
                    new user({email:userInfo.email,password:userInfo.password,
                        username:username.toString(),records:[],documents:[],typingTime:0,isLogin:true}).insert((err,data)=>{
                        if(err) return next(createError(500,'register fail',{text:'Unknown error'}));
                        req.session.user = {email:userInfo.email};
                        res.cookie('uid',userInfo.email,{path:'/',maxAge:MAX_AGE, httpOnly:false});
                        succeed(res,'reset succeed',{text: 'register succeed'});
                    })
                }else{
                    return next(createError(403,'register fail',{text:'Wrong pin'}));
                }
            }else{
                return next(createError(403,'register fail',{text:'Wrong pin'}));
            }
        });
    });
};
