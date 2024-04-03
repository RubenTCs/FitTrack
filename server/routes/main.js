const express = require('express');
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const router = express.Router();

const Auth = require('../models/auth');

router.use(express.urlencoded({ extended: false }));

async function hashPass(password) {
    const res = await bcryptjs.hash(password, 10);
    return res;
}

async function compare(userPass, hashPass) {
    const res = await bcryptjs.compare(userPass, hashPass);
    return res; 
} 

//Routes
router.get('',  (req, res) => {

    try{
        res.render('login', {title: 'Login', showHeader: false});
    } catch (error){
        console.log(error);
    }
}); 

router.post("/signup", async (req, res) => {
    try {
        const checkEmail = await Auth.findOne({ email: req.body.email });
        const checkName = await Auth.findOne({ username: req.body.username });
        if (checkEmail) {
            return res.send('<script>alert("Email has been used"); window.location="/signup"</script>');
        } if (checkName){
            return res.send('<script>alert("Username has been used"); window.location="/signup"</script>.');
        }else {
            const token = jwt.sign({ username: req.body.username }, "abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz");
            const data = {
                username: req.body.username,
                email: req.body.email,
                password: await hashPass(req.body.password),
                token: token 
            };
            await Auth.insertMany([data]);
            res.send('<script>alert("User Created"); window.location="/login"</script>');
        }
    } catch (error){
        console.error("Error during signup:", error);
        return res.status(500).send("An error occurred during signup"); 
    } 
}); 

//login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send('<script>alert("Please enter both email and password"); window.location="/login"</script>');
        }

        const check = await Auth.findOne({ email });
        if (!check) {
            return res.send('<script>alert("Account not found"); window.location="/login"</script>');
        }

        const username = check.username;

        const passCheck = await compare(password, check.password);
        if (passCheck) {
            res.cookie("jwt", check.token, {
                maxAge: 600000,
                httpOnly: true
            });
            res.redirect("/"+username+"/routine");
        } else {
            res.send('<script>alert("Wrong password"); window.location="/"</script>');
        }
    } catch {
        res.send('<script>alert("Error occurred"); window.location="/"</script>');
    }
});

router.get('/:username/routine', async (req, res) => {
    try{
        const userName = req.params.username;
        const user = await Auth.findOne({ username: userName });
        res.render('index', {title: 'Routines', user: user});
    } catch (error){
        console.log(error);
    }
});


router.get('/routine/1', async (req, res) => {

    try{
        res.render('index', {title: 'Routines'});
    } catch (error){
        console.log(error);
    }
});

router.get('/profile', (req, res) => {

    res.render('profile', {title: 'Profile'});
});

router.get('/about', (req, res) => {
    const locals = {
        title: 'About',
        description: 'About page'
    } 

    res.render('about', {locals});
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", showHeader: false });
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Register", showHeader: false});
});
module.exports = router;