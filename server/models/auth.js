const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    token: {
        type:String,
        required:true
    }
})

const Auth = new mongoose.model("Auth", AuthSchema)

module.exports = Auth