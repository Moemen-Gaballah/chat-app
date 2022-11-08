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
                myId: req.session.userId,
                friendRequests: req.friendRequests,
                myName: req.session.name,
                myImage: req.session.image,
                friendId: data._id,
                username: data.username,
                userImage: data.image,
                isOwner: id === String(req.session.userId),
                isFriends: data.friends.find(friend => friend.id === req.session.userId),
                isRequestSent: data.friendRequests.find(friend => friend.id === req.session.userId),
                isRequestRecieved: data.sendRequests.find(friend => friend.id === req.session.userId),
            });
        }).catch(err => {
            res.redirect("/error");
    })
}