const express = require("express");
const path = require('path');

const session = require('express-session')

const SessionStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash')

const authRouter = require('./routes/auth.route')
const profileRouter = require('./routes/profile.route')
const friendRouter = require('./routes/friend.route')

const getFriendRequests = require("./models/user.model").getFriendRequests;



const app = express();
const server = require("http").createServer(app);
const socketIo = require("socket.io")
const io = socketIo(server);


app.use(express.static(path.join(__dirname, 'public','assets')));
app.use(express.static(path.join(__dirname, 'public','images')));
app.use(flash());

require("./sockets/friend.socket")(io);

io.on("connection", socket => {
    require("./sockets/init.socket")(socket);
});



const STORE = new SessionStore({
    uri: 'mongodb://localhost:27017/chat-app',
    connection: 'sessions'
})


app.use(session({
    secret: 'this is my secret to hash express sessions ...',
    saveUninitialized: false,
    store: STORE
}))


app.set('view engine', 'ejs');
app.set('views', 'views') // default

app.use((req,res, next) => {
    if(req.session.userId) {
        getFriendRequests(req.session.userId).then(requests => {
            req.friendRequests = requests
            next()
        }).catch(err => {
            res.redirect('/error')
        })
    }else {
        next()
    }
})


app.use("/", authRouter);
app.use("/profile", profileRouter)
app.use("/friend", friendRouter)




const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log('Server listen on port 3000');
// });

server.listen(3000, () => console.log("server listen on port 3000"));

