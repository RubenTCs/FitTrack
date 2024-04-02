const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// GET
// HOME


//Routes
router.get('', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        // const data = await Post.find();
        res.render('index', {locals});
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
        // const data = await Post.find();
        res.render('index', {locals});
    } catch (error){
        console.log(error);
    }
});

router.post('/routine', async (req, res) => {
    
});

router.get('/routine/1', async (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    try{
        // const data = await Post.find();
        res.render('index', {locals});
    } catch (error){
        console.log(error);
    }
});

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


mongoose.connect("mongodb+srv://rubenchaiyadi:zBAw9aF8LipznDpF@cluster0.956ujiw.mongodb.net")
.then(() => {
    
}).catch((err) => {
    
});
module.exports = router;