const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../Models/ls.js");
const Mongo_Url = "mongodb://127.0.0.1:27017/Wonder";

async function main() {
    await mongoose.connect(Mongo_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

main().then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.log(err);
});

const initdb = async () => {
    await Listing.deleteMany({});
    const initData = initdata.data.map((obj) => ({ ...obj, owner: "66d5f82c7ad65cd1b9ffd2a9" })); 
    await Listing.insertMany(initData); 
    console.log("Data is initialized");
}

initdb();
