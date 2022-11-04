const express = require("express");
const path = require('path');

const session = require('express-session')

const SessionStore = require("connect-mongodb-session")(session);

const authRouter = require('./routes/auth.route')
const profileRouter = require('./routes/profile.route')

const app = express();

app.use(express.static(path.join(__dirname, 'public','assets')));
app.use(express.static(path.join(__dirname, 'public','images')));
app.use(flash())
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

app.use("/", authRouter);
app.use("/profile", profileRouter)




const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server listen on port 3000');
});