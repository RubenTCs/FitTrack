const express = require('express');
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const router = express.Router();

const Auth = require('../models/auth');
const Routine = require('../models/routine');
const Exercise = require('../models/exercise');

router.use(express.urlencoded({ extended: false }));

async function hashPass(password) {
    const res = await bcryptjs.hash(password, 10);
    return res;
}

async function compare(userPass, hashPass) {
    const res = await bcryptjs.compare(userPass, hashPass);
    return res; 
} 



// Middleware to check if the user is authenticated
function requireAuth(req, res, next) {
    // Check if the user is logged in (by checking the presence of the JWT token)
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz', (err, decodedToken) => {
            if (err) {
                console.error(err.message);
                res.redirect('/login');
            } else {
                // User is authenticated, proceed to the next middleware/route handler
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

// Middleware to check if the logged-in user matches the requested username
function requireCorrectUser(req, res, next) {
    const token = req.cookies.jwt;
    jwt.verify(token, 'abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz', async (err, decodedToken) => {
        if (err) {
            console.error(err.message);
            res.redirect('/login');
        } else {
            const loggedinUsername = decodedToken.username;
            const requestedUsername = req.params.username; // Assuming username is part of the URL path

            console.log(loggedinUsername, requestedUsername);

            if (loggedinUsername === requestedUsername) {
                // User is authorized to access the resource, proceed to the next middleware/route handler
                next();
            } else {
                res.status(403).send('You are not authorized to access this resource');
            }
        }
    });
}

//default Route
router.get('/',  (req, res) => {

    try{
        res.render('login', {title: 'Login', showHeader: false});
    } catch (error){
        console.log(error);
    }
}); 
//default Route
router.get('',  (req, res) => {

    try{
        res.render('login', {title: 'Login', showHeader: false});
    } catch (error){
        console.log(error);
    }
}); 

//SignUp
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
            return res.send('<script>alert("User Created"); window.location="/login"</script>');
        }
    } catch (error){
        console.error("Error during signup:", error);
        return res.status(500).send("An error occurred during signup"); 
    } 
}); 

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Register", showHeader: false});
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

        const userId = check._id;

        const passCheck = await compare(password, check.password);
        if (passCheck) {
            res.cookie("jwt", check.token, {
                maxAge: 600000,
                httpOnly: true
            });
            res.redirect("/user/"+userId+"/routine");
        } else {
            res.send('<script>alert("Wrong password"); window.location="/"</script>');
        }
    } catch (error){
        console.error("Error during login:", error);
        return res.status(500).send("An error occurred during signup"); 
    }
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", showHeader: false });
});

//Routine
router.get('/user/:userId/routine', requireAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Find the user
        const user = await Auth.findById(userId);


        // If user not found, handle appropriately
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find routines for the user
        const routines = await Routine.find({ user: userId });

        // Render the view with routines data
        res.render('index', { title: 'Routines', user: user, routines: routines });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Routine (after clicking on a routine)
router.get('/user/:userId/routine/:routineId', requireAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const routineId = req.params.routineId;

        // Find the user
        const user = await Auth.findById(userId);

        // If user not found, handle appropriately
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the routine for the user
        const selectedRoutine = await Routine.findById(routineId);
        const routines = await Routine.find({ user: userId });
        // If routine not found, handle appropriately
        if (!selectedRoutine || selectedRoutine.user.toString() !== userId) {
            return res.status(404).send('Routine not found');
        }

        // Render the view with routine data
        res.render('index', { title: 'Routine Detail', user: user, selectedRoutine: selectedRoutine, routines: routines });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


//Profile
router.get('/:username/profile', requireAuth, requireCorrectUser, async (req, res) => {
    try {

        const userName = req.params.username;
        const user = await Auth.findOne({ username: userName });

        res.render('profile', {title: 'Profile', user: user});
    }
    catch (error){
        console.log(error);
    }
});

//About
router.get('/:username/about', async (req, res) => {
    try {
        const userName = req.params.username;
        const user = await Auth.findOne({ username: userName });

        res.render('about', {title: 'About', user: user});
    }
    catch (error){
        console.log(error);
    }
});

//Add Routine
router.post('/addRoutine', async (req, res) => {
    try{
        const routineData = {
            routinename: req.body.routinename,
            description: req.body.description,
            user: req.body.userId,
        }

        const username = req.body.username;

        await Routine.insertMany(routineData);

        res.redirect(`/${username}/routine`);
    }
    catch (error){
        console.log(error);
    }
    
})

router.get('/:userId/routine/:routineId', async (req, res) => {
    try {
        
        const selectedRoutine = await Routine.findOne({ _id: req.params.routineId, user: req.params.userId }).populate('exercises');
        const user = await Auth.findOne({ _id: req.params.userId });
        const routines = await Routine.find({ user: user._id });
        console.log(req.params.routineId, req.params.userId)  
        
        if (!selectedRoutine) {
            return res.status(404).send('Routine not found');
        }
        res.render('index', { selectedRoutine, user, routines });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});
module.exports = router;