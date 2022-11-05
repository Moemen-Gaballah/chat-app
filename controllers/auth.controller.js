const authModel = require("../models/auth.model");
const {validationResult} = require("express-validator");

exports.getSignup = (req, res, next) => {
    res.render("signup", {
        authError: req.flash("authError")[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: 'Signup'
    });
};

exports.postSignup = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel
            .createNewUser(req.body.username, req.body.email, req.body.password)
            .then(() => res.redirect('/login'))
            .catch(err => {
                console.log(err);
                res.redirect('/signup');
            })
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect('/signup')
    }
};

exports.getLogin = (req, res, next) => {
    res.render('login', {
        authError: req.flash("authError")[0],
        validationErrors: req.flash('validationErrors'),
        isUser: false,
        isAdmin: false,
        pageTitle: 'login'
    });
};

exports.postLogin = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        authModel
            .login(req.body.email, req.body.password)
            .then(result => {
                req.session.userId = String(result.id);
                req.session.name = result.username;
                req.session.image = result.image;
                res.redirect('/');
            }).catch(err => {
            req.flash('authError', err)
            // req.flash('validationErrors', validationResult(req).array())
            res.redirect("/login");
        });
    } else {
        req.flash('validationErrors', validationResult(req).array())
        res.redirect("/login");
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(() => {

        res.redirect('/');
    });
}
