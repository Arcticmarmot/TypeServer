const url = require('url');
const succeed = require('../utils/constant').succeed;

exports.auth_admin = (req,res,next)=>{
    const parsed_url = url.parse(req.url);
    const password = parsed_url.query.slice(9);
    if(password === 'd123456'){
        succeed(res,'succeed',{authorize:true})
    }else{
        succeed(res,'succeed',{authorize:false})
    }
};
