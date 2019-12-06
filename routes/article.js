const document = require('../models/document');
const authDocument = require('../models/auth-document');
const url = require('url');
const ObjectId = require('mongodb').ObjectId;
const createError = require('http-errors');
const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;
exports.form = (req,res,next)=>{
    const parsed_url = url.parse(req.url);
    let query = parsed_url.query.split('&');
    let id = query[0].slice(3);
    let authParam = query[1].slice(12) === 'true';
    try{
        id = ObjectId(id);
    }catch (err) {
        return next(createError(404,'load fail',{text:'Error id'}));
    }
    if(authParam){
        authDocument.find_by_id(id,find_by_id_callback(res,next));
    }else{
        if(auth(req)) {
            document.find_by_id(id, find_by_id_callback(res,next));
        }else{
            return next(createError(401,'load fail,please login first',{text:'unauthorized'}))
        }
    }
};
function find_by_id_callback(res,next){
    return (err,data)=>{
        if (err) return next(createError(500, 'load fail', {text: 'Unknown error'}));
        if (data) {
            succeed(res,'ok',data)
        } else {
            return next(createError(404, 'load fail', {text: 'Not found'}))
        }
    }
}
