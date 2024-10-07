const Listing = require('../Models/ls.js');

module.exports.index = async (req, res) => {

    const alllisting = await Listing.find({});
    res.render("./listing/index.ejs", { alllisting });
};
module.exports.renderNewform = (req, res) => {

    res.render("./listing/new.ejs");

};
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const indvdetails = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",

        },
    }).populate("owner");
    if (!indvdetails) {
        req.flash("error", " Requested Listing  doed not exit!");
        res.redirect("/listing");
        return;

    }

    res.render("./listing/show.ejs", { indvdetails });
};
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.Listing);
    listing.image = { url, filename };
    listing.owner = req.user._id;


    await listing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

module.exports.renderEditfrom = async (req, res) => {
    const { id } = req.params;
    const indetails = await Listing.findById(id);
    let originalImage = indetails.image.url;
    let originalImage1 = originalImage.replace("/upload","/upload/w_250");
    if (!indetails) {
        req.flash("error", " Requested Listing  doed not exit!");
        res.redirect("/listing");
        return;

    }

    res.render("listing/edit.ejs", { indetails,originalImage1 });
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpreesError(400, "Input Data is required");
    }
    const { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);


};
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");


};