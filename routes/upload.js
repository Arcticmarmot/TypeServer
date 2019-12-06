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
const createError = require('http-errors')
const uploadPath = './files';
const maxFileSize = 100000;
let fileEncoding = 'utf-8';

exports.submit = (req,res,next)=>{
    if(auth(req)){
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








/*
exports.submit = (req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = uploadPath;
    form.parse(req,(err,fields,files)=>{
        if(err) next(err);
        const file= files['file'];
        console.log(file.type);
        if((file.type.startsWith('text')  || file.type in fileType)
            && (file.size<maxFileSize)){
            fs.readFile(file.path,(err,data) => {
                if (err) next(err);
                fileEncoding = jschardet.detect(data).encoding;
                console.log(fileEncoding);
                try {
                    data = iconv.decode(data, fileEncoding);
                    data = deleteSpace(data);
                    document.no_duplicated_insert(fields.title, fields.language,
                        fields.public === 'true', data, (err) => {
                            if (err) next(err);
                        });
                    res.writeHead(200, 'ok', {
                        'Content-Type': 'application/json'
                    });
                    res.end();
                    deleteFile(file.path);
                } catch (e) {
                    console.log(e)
                    res.writeHead(404, 'upload fail, error in decoding', {
                        'Content-Type': 'application/json'
                    });
                    res.end();
                    deleteFile(file.path);
                }
            })
        }else{
            res.writeHead(404,"upload fail, it's so big",{
                'Content-Type': 'application/json'
            });
            res.end();
            deleteFile(file.path);
        }

    })
};
function deleteFile(path){
    if(fs.existsSync(path)){
        fs.unlink(path,()=>{
            console.log('delete success')
        });
    }
}

 */
/*
*application/x-msdownload
*image/png
application/octet-stream

*
* exports.submit = (req,res,next)=>{
    const form = new formidable.IncomingForm()
    form.uploadDir = uploadPath;
    form.parse(req,(err,fields,files)=>{
        if(err) next(err);
        const file= files['file'];
        console.log(file.type)
        if((file.type.startsWith('text') || file.type in fileType)
            && (file.size<maxFileSize)){
            fs.readFile(file.path,(err,data) => {
                if (err) next(err);
                fileEncoding = jschardet.detect(data).encoding;
                console.log(fileEncoding);
                try {
                    data = iconv.decode(data, 'window-1251');
                    document.no_duplicated_insert(fields.title, fields.language,
                        fields.public === 'true', data, (err) => {
                            if (err) next(err);
                        });
                    res.writeHead(200, 'ok', {
                        'Content-Type': 'application/json'
                    });
                    res.end();
                } catch (e) {
                    res.writeHead(404, 'upload fail', {
                        'Content-Type': 'application/json'
                    });
                    res.end();
                }
            })
        }else{
            res.writeHead(404,'upload fail',{
                'Content-Type': 'application/json'
            });
            res.end();
        }
        if(fs.existsSync(file.path)){
            fs.unlink(file.path,()=>{
                console.log('delete success')
            });
        }

    })


};
* */
