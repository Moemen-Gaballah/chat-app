const router = require("express").Router();

const bodyParser = require("body-parser");

const check = require("express-validator").check

const authGuard = require("./guards/auth.guard")

const authController = require("../controllers/auth.controller")


router.get('/signup', authGuard.notAuth, authController.getSignup);

router.post('/signup',
    authGuard.notAuth,
    bodyParser.urlencoded({ extended: true}),
    check('username').not().isEmpty().withMessage('username is required'),
    check('email')
        .not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('invalid email format'),
    check('password')
        .not().isEmpty().withMessage('password is required')
        .isLength({min: 6}).withMessage('password must be at least 6 characters'),
    check('confirmPassword').custom((value, {req}) => {
        if(value === req.body.password) return true
        else throw 'confirm password no equal password'
    }),
    authController.postSignup

);

router.get('/login', authController.getLogin);
router.post('/login',
    bodyParser.urlencoded({ extended: true}),
    check('email')
        .not().isEmpty().withMessage('email is required')
        .isEmail().withMessage('invalid email format'),
    check('password')
        .not().isEmpty().withMessage('password is required'),

    authController.postLogin);

router.all('/logout', authGuard.isAuth, authController.logout)

module.exports = router;