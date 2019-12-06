const fs = require('fs');
const formidable = require('formidable');
const auth_document = require('../models/auth-document');
const fileType = require('../utils/constant').fileType;
const succeed = require('../utils/constant').succeed;
const jschardet = require('jschardet');
const iconv = require('iconv-lite');
const transFile = require('../utils/transFile').transFile;
const createError = require('http-errors')
const uploadPath = './files';
const maxFileSize = 100000;
let fileEncoding = 'utf-8';

exports.submit = (req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = uploadPath;
    form.parse(req,(err,fields,files)=>{
        if(err) return next(createError(500,'upload fail',{text:'Unknown error'}));
        const file= files['file'];
        console.log(file.type);
        if((file.type.startsWith('text')  || file.type in fileType)
            && (file.size<maxFileSize)){
            fs.readFile(file.path,(err,file) => {
                if (err) return next(createError(403,"can't parse",{text:'encoding error'}));
                fileEncoding = jschardet.detect(file).encoding;
                console.log(fileEncoding);
                try {
                    file = transFile(iconv.decode(file, fileEncoding));
                    new auth_document({title: fields.title, content: file,
                        language: fields.language, public: fields.public === 'true',auth:true,
                        duplicate: 0, createDate: new Date()}).insert((err,result)=>{
                            if(err) return next(createError(500,'upload fail',{text:'Unknown error'}));
                            succeed(res,'succeed',{text:'upload succeed'})
                    });
                } catch (e) {
                    return next(createError(403,"can't parse",{text:'encoding error'}));
                }
            })
        }else{
            return next(createError(403,"it's so big",{text:'file size exceeds'}));
        }
    })

};
