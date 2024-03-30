const express = require('express');
const router = express.Router();

//Routes
router.get('', (req, res) => {
    const locals = {
        title: 'Routines',
        description: 'Routines page'
    }

    res.render('index', {locals});
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
module.exports = router;