const user = require('../models/user');
const result = require('../models/result');
const createError = require('http-errors');
const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;
exports.recordDetail = (req,res,next)=>{
    if(auth(req)){
        const dateRange = req.body.dateRange;
        user.find_by_email_records(req.cookies.uid,(err,data)=>{
            if(err) return next(createError(500,'query fail',{text:'Unknown error'}));
            result.find_by_ids(data.records).toArray().then(data=>{
                const recordsInRange = data.filter(filterByDateRange(dateRange));
                succeed(res,'query succeed',arrayStatistic(recordsInRange))
            }).catch(err=>{
                return next(createError(500,'query fail',{text:'Unknown error'}))
            })
        })
    }else{
        return next(createError(401,'query fail,please login first',{text:'unauthorized'}))
    }

};
function filterByDateRange(dateRange){
    return (e)=>{
        return e.createDate < dateRange[1] && e.createDate > dateRange[0];
    }
}
function arrayStatistic(arr){
    let meanSpeed = 0;
    let meanRightPercent = 0;
    let sumCountTime = 0;
    arr.forEach(e=>{
        sumCountTime += e.countTime;
        meanSpeed += e.speed;
        meanRightPercent += e.rightPercent;
    });
    meanSpeed /= arr.length;
    meanRightPercent /= arr.length;
    return {
        meanSpeed:meanSpeed,
        meanRightPercent:meanRightPercent,
        sumCountTime: sumCountTime
    }
}
