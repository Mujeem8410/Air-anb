if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const Listing = require("./Models/ls.js");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const URL = process.env.ATLASDB_URL;
const path = require("path");

const ExpressError = require("./util/ExpressError.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);

const session = require("express-session");
const Mongostore = require("connect-mongo");
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require("./Models/user.js");
const store = Mongostore.create({
    mongoUrl: URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);  
});

const sessionOptions = { 
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

const listingrouter = require('./routes/listing.js');
const reviewsrouter = require('./routes/review.js');
const userrouter = require('./routes/user.js');

async function main() {
    await mongoose.connect(URL);
}

main().then(() => {
    console.log("Connect to the  DataBase");
}).catch((err) => {
    console.log(err);
});

app.use(session(sessionOptions));  
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});

app.use('/listing', listingrouter);
app.get('/search', async (req, res) => {
    const { title } = req.query;
    const listings = await Listing.find({ title: { $regex: title, $options: 'i' } }); 
    res.render('listing/index.ejs', { alllisting: listings });
});
app.use("/listing/:id/reviews", reviewsrouter);
app.use("/", userrouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = 'Something went Wrong' } = err;
    res.status(statuscode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("App is listening on 8080");
});
