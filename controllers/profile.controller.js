const userModel = require("../models/user.model");

/**
 * user
 */

exports.redirect = (req, res, next) => {
    res.redirect("/profile/" + req.session.userId);
};

exports.getProfile = (req, res, next) => {
    let id = req.params.id;
    if(!id) return res.redirect("/profile/"+ req.session.userId);
    userModel.getUserData(id)
        .then(data => {
            res.render("profile", {
                pageTitle: data.username,
                isUser: true,
                username: data.username,
                userImage: data.image,
                isOwner: id === req.session.userId
            });
        }).catch(err => {
            res.redirect("/error");
    })
}