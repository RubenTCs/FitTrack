const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();


router.use(express.urlencoded({ extended: false }));


//Routes
router.get('/',  (req, res) => {

    try{
        res.render('login', {title: 'Login', showHeader: false});
    } catch (error){
        console.log(error);
    }
}); 

router.get('/routine', async (req, res) => {
    

    try{
        res.render('index', {title: 'Routines'});
    } catch (error){
        console.log(error);
    }
});

router.post('/routine', async (req, res) => {
    
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