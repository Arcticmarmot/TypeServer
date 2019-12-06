const auth = require('../utils/auth').auth;
const succeed = require('../utils/constant').succeed;
exports.authorize = (req,res,next)=>{
    succeed(res,'succeed',{authorize:auth(req)})
};
