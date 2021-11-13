const { Router } = require('express');
const {createUser, userLogin, tokenRenew} = require("../controllers/auth");
const {check} = require("express-validator");
const {validateFields} = require("../middlewares/validate-fields");
const {validateJwt} = require("../middlewares/validate-jwt");

const router = Router();

// Create new user
router.post( '/new', [
    check('name', 'Name is mandatory').not().isEmpty(),
    check('email', 'Email is mandatory and must be an email correct format').isEmail(),
    check('password', 'Password is mandatory and must be 6 digits long').isLength({min: 6}),
    validateFields
] , createUser);

// User login
router.post( '/', [
    check('email', 'Email is mandatory and must be an email correct format').isEmail(),
    check('password', 'Password is mandatory and must be 6 digits long').isLength({min: 6}),
    validateFields
] , userLogin);

// Validate and renew token
router.get( '/renew',[validateJwt] ,tokenRenew);


module.exports = router;