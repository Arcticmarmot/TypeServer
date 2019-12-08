const fs = require('fs');
const user = require('../models/user')
const formidable = require('formidable');
const document = require('../models/document');
const fileType = require('../utils/constant').fileType;
const succeed = require('../utils/constant').succeed;
const auth = require('../utils/auth').auth;
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const transFile = require('../utils/transFile').transFile;
const createError = require('http-errors');
const checkUpload = require("../utils/constant").checkUpload;
const uploadPath = './files';
const maxFileSize = 100000;
let fileEncoding = 'utf-8';

exports.submit = (req,res,next)=>{
    if(auth(req)){
        const form = new formidable.IncomingForm()
        form.uploadDir = uploadPath;
        form.parse(req,(err,fields,files)=>{
            if(err) return next(createError(500,'upload fail',{text:'Unknown error'}));
            if(!checkUpload(fields,files)) return next(createError(403,'fail',{text:''}))
            const file= files['file'];
            if((file.type in fileType || file.type.startsWith('text'))
                && (file.size<maxFileSize)){
                fs.readFile(file.path,(err,file) => {
                    if (err) return next(createError(403,"can't parse",{text:'encoding error'}));
                    fileEncoding = jschardet.detect(file).encoding;
                    try {
                        file = transFile(iconv.decode(file, fileEncoding));
                        document.no_duplicated_insert_by_uploader(fields.title, fields.language,
                            fields.public === 'true', file,req.cookies.uid,(err,data) => {
                            if (err) return next(createError(500,'upload fail',{text:'Unknown error'}));
                            user.insert_document(req.cookies.uid,data.insertedId,(err,data)=>{
                                if(err) return next(createError(500,'upload fail',{text:'Unknown error'}));
                                succeed(res,'succeed',{text:'upload succeed'})
                            });
                        });
                    } catch (e) {
                        return next(createError(403,"can't parse",{text:'encoding error'}));
                    }
                })
            }else{
                return next(createError(403,"it's so big",{text:'file size exceeds'}));
            }
        })
    }else{
        return next(createError(401,'upload fail,please login first',{text:'unauthorized'}))
    }
};








/*
fs.unlink(file.path,(err)=>{
    if(err) {
        console.log('delete fail');
    }else{
        console.log('delete success')
    }
});*/








