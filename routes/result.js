const createError = require('http-errors');
const auth = require('../utils/auth').auth;
const result = require('../models/result');
const user = require('../models/user');
const succeed = require('../utils/constant').succeed;

exports.postResult = (req,res,next)=>{
    if(auth(req)){
        const resultInfo = req.body;
        new result({
            speed: resultInfo.speed,
            countTime: resultInfo.countTime,
            rightPercent: resultInfo.rightPercent,
            createDate: new Date().getTime()
        }).insert((err,data)=>{
            if(err) return next(createError(500,'record save fail',{text:'Unknown error'}));
            user.insert_record(req.cookies.uid,data.insertedId,(err,data)=>{
                if(err) return next(createError(500,'record save fail',{text:'Unknown error'}));
                req.session.user.typingTime += resultInfo.countTime;
                user.countTypingTime(req.cookies.uid,req.session.user.typingTime,(err,data)=>{
                    if(err) return next(createError(500,'record save fail',{text:'Unknown error'}));
                    succeed(res,'record save succeed',{text: 'record save succeed'})
                })
            });
        })
    }else{
        succeed(res,'ok',{text:'unauthorized'})
    }
};
exports.getResult = (req,res,next)=>{
    if(auth(req)){
        user.find_by_email_records(req.cookies.uid,(err,data)=>{
            if(err) return next(createError(500,'load fail',{text:'Unknown error'}));
            const cursor = result.find_by_ids_twenty(data.records);
            cursor.toArray().then((data)=>{
                succeed(res,'load succeed',data)
            }).catch(err=>{
                return next(createError(500,'load fail',{text:'Unknown error'}))
            });
        })
    }else{
        succeed(res,'ok',{text:'unauthorized'})
    }
};
