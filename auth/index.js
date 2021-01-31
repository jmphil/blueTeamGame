
let authReq = (req, res, next)=>{
    //isAuthenticated() from passport , true, false

    if(req.isAuthenticated()){
        next()
    }
    else{
        res.send('error authen');
    }

}

module.exports = authReq;