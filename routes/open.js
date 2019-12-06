const document = require('../models/document');
const authDocument = require('../models/auth-document');
const createError = require('http-errors');
const auth = require('../utils/auth').auth;
const user = require('../models/user');
const succeed = require('../utils/constant').succeed;

exports.form = (req,res,next)=>{
    if(auth(req)){
        user.find_by_email_documents(req.cookies.uid,(err,data)=>{
            if(err) return next(createError(500,'load fail',{text:'Unknown error'}));
            const cursor = document.find_by_ids(data.documents);
            cursor.toArray().then((data)=>{
                const auth_cursor = authDocument.find_all();
                auth_cursor.toArray().then((auth_data)=>{
                    succeed(res,'ok',{articles:data,authArticles:auth_data,authorized:true})
                }).catch(err=>{
                    return next(createError(500,'load fail',{text:'Unknown error'}))
                });
            }).catch(err=>{
                return next(createError(500,'load fail',{text:'Unknown error'}))
            });
        });
    }else{
        const cursor = authDocument.find_all();
        cursor.toArray().then((data)=>{
            succeed(res,'ok',{articles:[],authArticles:data,authorized:false})
        }).catch(err=>{
            return next(createError(500,'load fail',{text:'Unknown error'}))
        });
    }
};
