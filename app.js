if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const open = require('open');
const express = require('express');
const app = express();
const session = require('express-session');
app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.get('/', function (req, res) {
    res.render('pages/auth');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules
// the default is 'buffer'
// console.log('Output was:\n', output);
// console.log(execSync);

app.get('/success', (req, res) => res.render('success', { userProfile }));
app.get('/error', (req, res) => res.send("error logging in"));
app.get('/jupyterlab', async (req, res) => {
    open(`http://localhost:8888/lab?token=${userProfile.id}`);
    setTimeout(function () {
        execSync('jupyter lab', { encoding: 'utf-8' });
    }, 500);

    res.redirect(`/success`);
})

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.APEX_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.APEX_GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log('------------------')
        console.log(accessToken)
        console.log('------------------')
        console.log(refreshToken)
        console.log('------------------')
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication, redirect success.
        console.log(userProfile)
        console.log(req.user)
        res.redirect('/success');
    });

open(`http://localhost:3000`);