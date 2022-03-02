const sessionAuth = (req, res, next) =>{
    if(req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).send("Session not valid");
    }
}

module.exports = sessionAuth;