const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://gavrieljl:ruben123@m0.wxwpgz1.mongodb.net/AuthTut")
.then(() => {
    console.log("mongo connected")
})
.catch(() => {
    console.log("error")
})

const Schema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,  // Tambahkan bidang email
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

const Collection = new mongoose.model("AuthCollection", Schema)

module.exports = Collection
