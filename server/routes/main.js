const express = require('express');
const router = express.Router();


router.use(express.urlencoded({ extended: false }));


//Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'Login',
        description: 'Routines page'
    }

    try{
        res.render('login', {locals});
    } catch (error){
        console.log(error);
    }
}); 


router.get('/routine', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        res.render('index', {locals});
    } catch (error){
        console.log(error);
    }
}); 

router.get('/routine/1', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        res.render('index', {locals});
    } catch (error){
        console.log(error);
    }
}); 

// 
router.get('/profile', (req, res) => {
    const locals = {
        title: 'Profile',
        description: 'Profile page'
    }

    res.render('profile', {locals});
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