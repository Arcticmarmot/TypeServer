const succeed = require('../utils/constant').succeed;

exports.logout = (req,res,next)=>{
    req.session.destroy();
    res.clearCookie('uid');
    succeed(res,'succeed',{text:'logout succeed'});
};
