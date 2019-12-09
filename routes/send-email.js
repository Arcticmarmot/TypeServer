const nodemailer = require('nodemailer');
const pin = require('../models/pin');
const createError = require('http-errors');
const succeed = require('../utils/constant').succeed;

const mailTransport = nodemailer.createTransport({
    host : 'smtp.qq.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : '1048000853@qq.com',
        pass : 'fqjxrhdciwdrbegb'
        /*
        user : 'typewrite_club@163.com',
        pass : 'typewrite2019'*/
    },
});
exports.send = (req,res,next)=>{
    const mailAddress = req.body.email;
    const PIN = [Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10),Math.floor(Math.random()*10)].join('');
    const options = {
        from        : 'Typewrite <1048000853@qq.com>',
        to          : `${mailAddress}`,
        subject        : '请验证您的邮箱',
        html           : '<h3><strong>以下是您的验证码</strong></h3>'+
                        `<p style="font-family: 'Microsoft YaHei UI'"><strong>${PIN}</strong>，请输入后验证您的邮箱</p>` +
                        '<p>       —— Arcticmarmot</p>'
    };
    mailTransport.sendMail(options, function(err, msg){
        if(err) return next(createError(500,'send fail',{text: 'Unknown error'}));
        pin.get_pin_by_email(mailAddress,(err,data)=>{
            if(err) return next(createError(500,'send fail',{text: 'Unknown error'}));
            if(data){
                pin.update(mailAddress,PIN,(err,data)=>{
                    if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
                    console.log('send succeed --updated');
                    succeed(res,'ok',{text:'send succeed'})
                })
            }else{
                new pin({createdAt:new Date(),email:mailAddress,pin:PIN}).insert((err,data)=>{
                    if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
                    console.log('send succeed');
                    succeed(res,'ok',{text:'send succeed'})
                });
            }
        })
    });
};

/*
        pin.get_pin_by_email(mailAddress,(err,data)=>{
            if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
            if(data){
                mailTransport.sendMail(options, function(err, msg){
                    if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
                    pin.update(mailAddress,PIN,(err,data)=>{
                        if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
                        console.log('send succeed --updated');
                        res.writeHead('200','ok',{
                            'Content-Type': 'application/json;charset=utf8'
                        });
                        res.end();
                    })
                });
            }else{
                mailTransport.sendMail(options, function(err, msg){
                    if(err) return next(createError(500,'send fail',{text: 'Unknown error'}))
                    new pin({email:mailAddress,pin:PIN}).insert((err,data)=>{
                        if(err){
                            res.writeHead('404','Send fail',{
                                'Content-Type': 'application/json;charset=utf8'
                            });
                            res.end();
                        }else{
                            console.log('send succeed');
                            res.writeHead('200','ok',{
                                'Content-Type': 'application/json;charset=utf8'
                            });
                            res.end();
                        }
                    });


                });

            }
        });*/
