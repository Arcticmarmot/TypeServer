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

