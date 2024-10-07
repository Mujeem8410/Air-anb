const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLOcalmongoose  = require('passport-local-mongoose');

const  userSchema =  new Schema({
    email:{
        type:String,
        required: true,
    },

});

userSchema.plugin(passportLOcalmongoose);


 module.exports = mongoose.model("User",userSchema);