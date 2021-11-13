const {response} = require("express");
const jwt = require('jsonwebtoken');


const validateJwt = (req, resp = response, next) => {
    const token = req.header('x-token');

    if( !token ){
        return resp.status(401).json({
            ok: false,
            msg: 'Token error'
        })
    }

    try {

        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;

    } catch (e) {
        return resp.status(401).json({
            ok: false,
            msg: 'Invalid token'
        })
    }


    next();
}

module.exports = {
    validateJwt
}