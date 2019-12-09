const auth = require('../utils/auth').auth;
const ObjectId = require('mongodb').ObjectId;
const succeed = require('../utils/constant').succeed;
const document = require('../models/document');
exports.deleteArticle = (req,res,next)=>{
    let id = req.query.id;
    if(auth(req)){
        try{
            id = ObjectId(id);
        }catch (err) {
            return next(createError(404,'delete fail',{text:'Error id'}));
        }
        document.delete(id,(err,data)=>{
            if(err) return next(createError(500,'delete fail',{text:'Unknown error'}));
            succeed(res,'delete success',{text:'delete succeed'})
        })
    }else{
        return next(createError(401,'delete fail',{text:'unauthorized'}));
    }


};
