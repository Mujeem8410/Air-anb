const express = require('express');
const router = express.Router();
const User = require('../Models/user.js');
const wrapAsync = require('../util/wrapAsync');
const { route } = require('./listing');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const usercontroller = require('../controllers/user.js');

router.route("/sinup")
.get( usercontroller.rendersinupform)
.post( wrapAsync(usercontroller.sinup));

 router.route("/login")
 .get(async (req, res) => {
    res.render('user/login.ejs');
})
.post(saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), usercontroller.login);

router.get('/logout', usercontroller.logout);

module.exports = router;