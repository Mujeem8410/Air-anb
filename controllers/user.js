const User = require('../Models/user.js');

module.exports.rendersinupform = async (req, res) => {
    res.render('user/sinup.ejs');
};
module.exports.sinup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeduser = await User.register(newUser, password);
        req.login(registeduser, (err)=> {
            if (err) {
                return next(err);

            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect('/listing');


        });

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('/sinup');

    }
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirect || "/listing";
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect('/listing');
    });
}; 