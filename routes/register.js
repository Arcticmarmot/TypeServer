const user = require('../models/user')
const pin = require('../models/pin');
const crypt = require('crypto');
const createError = require('http-errors');
const succeed = require('../utils/constant').succeed;

exports.register = (req,res,next)=>{
    const userInfo = req.body;
    user.find_by_email(userInfo.email,(err,data)=>{
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
                        username:username.toString(),records:[],documents:[],typingTime:0}).insert((err,data)=>{
                        if(err) return next(createError(500,'register fail',{text:'Unknown error'}));
                        user.find_by_email(userInfo.email,(err,data)=>{
                            if(err) {
                                console.log(err)
                                return next(createError(500,'register fail',{text:'Unknown error'}));
                            }
                            req.session.user = data;
                            res.cookie('uid',userInfo.email,{path:'/',maxAge:1000*60*60*12, httpOnly:false});
                            succeed(res,'reset succeed',{text: 'register succeed'});
                        });
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
