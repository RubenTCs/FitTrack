const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');

const Auth = require('../models/auth');

async function hashPass(password) {
    const res = await bcryptjs.hash(password, 10);
    return res;
}

async function compare(userPass, hashPass) {
    const res = await bcryptjs.compare(userPass, hashPass);
    return res; 
} 

router.get('/signup', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        res.render('signup', {locals});
    } catch (error){
        console.log(error);
    }    
}); 

router.get("/signup", (req, res) => {
    const locals = {
        title: 'Sign Up',
        description: 'Sign Up page'
    }
    try{
        res.render('signup', {locals});
    } catch (error){
        console.log(error);
    }    
});

router.post("/signup", async (req, res) => {
    try {
        const check = await Auth.findOne({ name: req.body.name });
        if (check) {
            res.send("User already exists");
        } else {
            const token = jwt.sign({ name: req.body.name }, "abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz");
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: await hashPass(req.body.password),
                token: token
            };
            await Auth.insertMany([data]);
            res.render("routine", { name: req.body.name });
        }
    } catch {
        res.send("Wrong details");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.send('<script>alert("Please enter both name and password"); window.location="/"</script>');
        }

        const check = await Auth.findOne({ name });
        if (!check) {
            return res.send('<script>alert("Account not found"); window.location="/"</script>');
        }

        const passCheck = await compare(password, check.password);
        if (passCheck) {
            res.cookie("jwt", check.token, {
                maxAge: 600000,
                httpOnly: true
            });
            res.render("routine", { name: check.name });
        } else {
            res.send('<script>alert("Wrong password"); window.location="/"</script>');
        }
    } catch {
        res.send('<script>alert("Error occurred"); window.location="/"</script>');
    }
});