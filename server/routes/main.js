const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET
// HOME


//Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        const data = await Post.find();
        res.render('index', {locals, data});
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
        const data = await Post.find();
        res.render('index', {locals, data});
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
        const data = await Post.find();
        res.render('index', {locals, data});
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


// function insertPostData(){
//     Post.insertMany([
//         {
//             title: 'Building on fire',
//             body: 'This is body text',
//         }
//     ])
// }
// insertPostData();


module.exports = router;