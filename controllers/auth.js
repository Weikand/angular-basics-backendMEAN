const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const {genJWT} = require("../helpers/jwt");

const createUser = async (req, resp = response) => {
    const {email, name, password} = req.body;

    try{
        // Verify email
        const user = await User.findOne({ email });

        if (user) {
            return resp.status(400).json({
                ok: false,
                msg: 'User already exists'
            });
        }

        // Create user with model
        const dbUser = new User(req.body);

        // Password hash
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        // Generate JWT -> Json Web Token
        const token = await genJWT(dbUser.id, name);

        // Create DB user
        await dbUser.save();

        // Generate response
        return resp.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        })

    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            ok: false,
            msg: 'Contact with administrator'
        });
    }
}

const userLogin = async(req,  resp= response) => {

    const {email, password} = req.body;

    try {
        const dbUser = await User.findOne({email});
        if ( !dbUser ) {
            return resp.status(400).json({
                ok: false,
                msg: 'Mail does not exist'
            });
        }

        // Confirm password
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if( !validPassword ){
            return resp.status(400).json({
                ok: false,
                msg: 'Invalid password'
            });
        }

        // Generate JWT
        const token = await genJWT(dbUser.id, dbUser.name);

        // Service Response
        return resp.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token: token
        })


    } catch (e) {
        console.log(e);
        return resp.status(500).json({
            ok: false,
            msg: 'Contact with administrator'
        })
    }
}

const tokenRenew = async (req, resp = response) => {
    const {uid} = req;
    // Read DB
    const dbUser = await User.findById(uid);

    const token = await genJWT(uid, dbUser.name);

    return resp.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token: token
    });
}


module.exports = { createUser, userLogin, tokenRenew }