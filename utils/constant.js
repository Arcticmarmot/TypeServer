const languages = ['C/C++' ,'java','python' ,'javascript','default'];
const PASSWORDPATTERN = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,20}$/;
exports.MAX_AGE = 1000*60*60*24*365*10;
exports.fileType = {
    'application/xml':'',
    'application/json':'',
    'application/ld+json':'',
    'application/xhtml+xml':'',
    'application/octet-stream':'',
};
exports.succeed = (res,statusText,data)=>{
    res.writeHead(200, statusText, {
        'Content-Type': 'application/json;charset=utf8'
    });
    res.end(JSON.stringify(data));
};
exports.checkUpload = (data,files)=>{
    return (data.title.length>=2&&checkInArray(languages,data.language)
        &&checkInArray(['true','false'],data.public))
        &&checkFile(files)
};
exports.checkRegister = (data)=>{
    return PASSWORDPATTERN.test(data.password)
};
exports.checkProfile = (username)=>{
    return username.length>=2;
};
function checkInArray(arr,element){
    let isIn = false;
    arr.forEach(e=>{
        if(e === element){
            isIn = true;
        }
    });
    return isIn;
}
function checkFile(files){
    const file= files['file'];
    return file.path&&file.type&&file.size;
}
