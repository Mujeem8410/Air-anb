const express = require('express');
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const Listing = require("../Models/ls.js");
const { isLoggedIn, isOwner, validation } = require('../middleware.js');
const listingControllers = require('../controllers/listing.js');
const multer  = require('multer')
const {storage}= require('../cloudConfig.js');
const upload = multer({storage});

router.route("/").get(wrapAsync(listingControllers.index))
    .post(isLoggedIn,upload.single('Listing[image]'), wrapAsync(listingControllers.createListing));
    

router.get('/new', isLoggedIn, listingControllers.renderNewform);

router.route("/:id")
    .get(wrapAsync(listingControllers.showListing))
    .put(isLoggedIn, isOwner, upload.single('Listing[image]'),validation, wrapAsync(listingControllers.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditfrom));
module.exports = router;