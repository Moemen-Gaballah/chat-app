const mongoose = require("mongoose");

const DB_URL = 'mongodb://localhost:27017/chat-app';

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: { type: String, default: "default-user-image.png" },
    isOnline: { type: Boolean, default: false },
    friends: {
        type: [{ name: String, image: String, id: String }],
        default: []
    },
    friendRequests: {
      type: [{ name: String, id: String }],
      default: []
    },
    sendRequests: {
        type: [{name: String, id: String }],
        default: []
    }
});

const User = mongoose.model("user", userSchema);
exports.User = User;

exports.getUserData = id => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DB_URL)
            .then(() => {
                return User.findById(id);
            })
            .then(data => {
                mongoose.disconnect();
                resolve(data);
            }).catch(err => {
                mongoose.disconnect();
                reject(err);
        });
    });
}

exports.sendFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            { $push: {friendRequests: {name: data.myName, id: data.myId}}})

        await User.updateOne({_id: data.myId},
            { $push: {sendRequests: {name: data.friendName, id: data.friendId}}})

        mongoose.disconnect();
        return;
    }catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.cancelFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            {
                $push: {friendRequests: { id: data.myId }
                }
            })

        await User.updateOne({_id: data.myId},
            {
                $push: {sendRequests: { id: data.friendId }
               }
            })

        mongoose.disconnect();
        return;
    }catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.acceptFriendRequest = async (data) => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            {
                $pull: {friends: { id: data.myId }
                }
            })

        await User.updateOne({_id: data.myId},
            {
                $pull: {friends: { id: data.friendId }
                }
            })

        mongoose.disconnect();

        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            {
                $push: {friendRequests: { id: data.myId }
                }
            })

        await User.updateOne({_id: data.myId},
            {
                $push: {sendRequests: { id: data.friendId }
                }
            })

        mongoose.disconnect();
        return;

    }catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.rejectFriendRequest = async () => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            {
                $pull: {sendRequests: { id: data.myId }
                }
            })

        await User.updateOne({_id: data.myId},
            {
                $pull: {friendRequests: { id: data.friendId }
                }
            })

        mongoose.disconnect();
        return;
    }catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

exports.deleteFriendRequest = async () => {
    try {
        await mongoose.connect(DB_URL);
        await User.updateOne({_id: data.friendId},
            {
                $pull: {friends: { id: data.myId }
                }
            })

        await User.updateOne({_id: data.myId},
            {
                $pull: {friends: { id: data.friendId }
                }
            })

        mongoose.disconnect();

        return;
    }catch (error) {
        mongoose.disconnect();
        throw new Error(error);
    }
};

