exports.auth = (req)=>{
    return !!(req.session &&
        req.session.user &&
        req.cookies.uid &&
        req.session.user.email === req.cookies.uid);
};
