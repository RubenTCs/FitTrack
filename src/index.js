const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //cek biar nama ga sama
    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    }else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

app.post("/login", async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            res.send("username cannot be found");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("home");
        }else{
            req.send("Wrong Password");
        }
    }catch{
        res.send("Wrong Details");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})