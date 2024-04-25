const express = require('express');
const jwt = require("jsonwebtoken");
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const router = express.Router();
const nodemailer = require('nodemailer');

const Auth = require('../models/auth');
const Routine = require('../models/routine');
const CustomExercise = require('../models/customexercise');
const ExerciseDB = require('../models/exercise');
//const UserProgress = require('../models/userExerciseProgress');
const exercise = require('../models/exercise');

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
                // if User is authenticated, proceed to the next middleware/route handler
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
            // console.log(loggedinUsername, requestedUsername);
            if (loggedinUsername === requestedUsername) {
                //if true, proceed to the next middleware/route handler
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
        const checkName = await Auth.findOne({ username: req.body.name }); // Ubah ke req.body.name
        if (checkEmail) {
            return res.send('<script>alert("Email has been used"); window.location="/signup"</script>');
        } 
        else if (checkName){ // Menggunakan else if
            return res.send('<script>alert("Username has been used"); window.location="/signup"</script>'); // Hapus tanda titik (.) di sini
        }
        else {
            const token = jwt.sign({ username: req.body.name }, "abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz");
            const data = {
                username: req.body.name,
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

        const passCheck = await compare(password, check.password);
        if (passCheck) {
            res.cookie("jwt", check.token, {
                maxAge: 600000, //in 600000 miliseconds = 10 minutes
                httpOnly: true
            });

            res.redirect(`/user/${check.username}/routine?userId=${check._id}`); //better format??? the user_id is kinda exposed tho
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
router.get('/user/:username/routine', requireAuth, requireCorrectUser, async (req, res) => {
    try {
        const userId = req.query.userId;
        
        // Find the user
        const user = await Auth.findById(userId);

        // Find all exercises in db
        // const exerciseDB = await ExerciseDB.find({});

        // If user not found, handle appropriately
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find routines for the user
        const routines = await Routine.find({ user: userId });

        // Render the view with routines data
        res.render('index', { 
            title: 'Routines', 
            user: user, 
            routines: routines , 
            isSelectedRoutine: false, 
            exerciseDB: [], //temporary fix for the error
            customExercise: [],
            selectedRoutine: [],
        });
    } catch (error) { 
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// Routine (after clicking on a routine)
router.get('/user/:username/routine/:routineId', requireAuth, requireCorrectUser, async (req, res) => {
    try {
        const userId = req.query.userId;

        const exerciseDB = await ExerciseDB.find({});
        const customExercise = await CustomExercise.find({ user: userId});

        const routineId = req.params.routineId;
        const user = await Auth.findById(userId);


        if (!user) {
            return res.status(404).send('User not found');
        }
        
        const selectedRoutine = await Routine.findById(routineId)
        .populate({ path: 'exercises._id', model: 'Exercise' })
        .populate({ path: 'customexercises._id', model: 'CustomExercise' });

        // console.log(selectedRoutine);

        const routines = await Routine.find({ user: userId });

        if (!selectedRoutine || selectedRoutine.user.toString() !== userId) {
            return res.status(404).send('Routine not found');
        }

        res.render('index', { 
            title: selectedRoutine.routinename, 
            user: user, 
            selectedRoutine: selectedRoutine, 
            routines: routines, 
            isSelectedRoutine: true, 
            exerciseDB: exerciseDB,
            customExercise: customExercise,
        });
            
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


//Profile (considering removing this)
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
        // console.log('username: ', userName);
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

        // why not use routine/routineId? Because there could be a duplicate if using the routineData
        res.redirect(`/user/${username}/routine?userId=${req.body.userId}`);
    }
    catch (error){
        console.log(error);
    }
    
});

// Add Exercise to Routine
router.post('/addExerciseToRoutine', async (req, res) => {
    try {
        const exerciseId = req.body.exerciseId;
        const customExerciseId = req.body.customExerciseId;
        const userId = req.body.userId;
        const routineId = req.body.routineId;

        const auth = await Auth.findById(userId);
        const username = auth.username;

        if (exerciseId){
            const exercise = await ExerciseDB.findById(exerciseId);

            if (!exercise) {
                return res.status(404).json({ error: 'Exercise not found' });
            }

            const routine = await Routine.findOne({ _id: routineId, user: userId});

            if (!routine) {
                return res.status(404).json({ error: 'Routine not found' });
            }

            const newExercise = {
                _id: exerciseId,
                sets: []
            }

            routine.exercises.push(newExercise);

            await routine.save();

        } else if(customExerciseId){
            const customExercise = await CustomExercise.findById(customExerciseId);

            if (!customExercise) {
                return res.status(404).json({ error: 'Custom Exercise not found' });
            }

            const routine = await Routine.findOne({ _id: routineId, user: userId});

            if (!routine) {
                return res.status(404).json({ error: 'Routine not found' });
            }

            const newExercise = {
                _id: customExerciseId,
                sets: []
            }
            
            routine.customexercises.push(newExercise);
            await routine.save();
        }
        
        
        // Redirect to the selected routine page
        res.redirect(`/user/${username}/routine/${routineId}?userId=${req.body.userId}`);
        // res.status(200).json({ message: 'Exercise added to routine successfully' });
    } catch (error) {
        console.error('Error adding exercise to routine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/addCustomExercise', async (req, res) => {
    try {
        const customExerciseData = {
            exercisename: req.body.exercisename,
            user: req.body.userId,
            equipment: req.body.equipment,
            type: req.body.type,
            muscle: req.body.muscle,
        }
        const username = req.body.username;


        await CustomExercise.insertMany(customExerciseData);

        res.redirect(`back`);
    } catch (error) {
        console.error('Error adding custom exercise:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//forgot password
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gavrielj30@gmail.com',
        pass: 'qacu yffp zggc nykz'
    }
});

// Rute untuk menampilkan halaman forgot password
router.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword', { title: 'Forgot Password', showHeader: false });
});

// Rute untuk menangani permintaan reset password
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;

        // URL halaman reset password di localhost:3000
        const resetPasswordUrl = 'http://localhost:3000/resetpassword';

        // Di sini Anda akan mengirim email reset password ke alamat email yang diberikan
        // Misalnya, Anda dapat menggunakan Nodemailer untuk mengirim email

        const mailOptions = {
            from: 'gavrielj30@gmail.com',
            to: email,
            subject: 'Reset Password Email',
            // Menambahkan URL ke dalam pesan email
            html: `Click <a href="${resetPasswordUrl}">here</a> to reset your password.`,
        };

        // Mengirim email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                return res.status(500).send('Failed to send reset password email');
            } else {
                console.log('Email Terkirim' + info.response);
                res.send('<script>alert("Password reset email sent. Please check your email."); window.location="/forgotpassword"</script>');
            }
        });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).send('An error occurred during forgot password');
    }

});

//reset password
router.get('/resetpassword', (req, res) => {
    res.render('resetpassword', { title: 'Reset Password', showHeader: false });
});

router.post('/resetpassword', async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Periksa apakah newPassword sama dengan confirmPassword
        if (newPassword !== confirmPassword) {
            return res.status(400).send('New password and confirm password do not match');
        }

        // Cari pengguna berdasarkan email
        const user = await Auth.findOne({ email });

        // Periksa apakah pengguna ditemukan
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Enkripsi password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atur password baru untuk pengguna
        user.password = hashedPassword;

        // Simpan perubahan ke dalam database
        await user.save();

        // Kirim respons sukses
        res.send('Password has been reset successfully');
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send(`An error occurred during password reset: ${error.message}`);
    }
});

// addset
router.post('/user/:username/routine/:routineId/addSet', async (req, res) => {
    try {
        const { exerciseId, weight, reps, distance, duration, exerciseIndex } = req.body;
        const { routineId } = req.params;
        
        const setData = {
            kg: weight,
            reps: reps,
            distance: distance,
            duration: duration,
        }
        // console.log(duration)
        const routine = await Routine.findById(routineId);

        if (!routine) {
            return res.status(404).json({ error: 'Routine not found' });
        }

        const exercise = routine.exercises.find(ex => ex._id.toString() === exerciseId);

        let exerciseInstance;
        if(!exercise){
            exerciseInstance = routine.customexercises[exerciseIndex];
            // console.log(exerciseInstance)
            
        } else {
            exerciseInstance = routine.exercises[exerciseIndex];
        }
        
        // console.log(exerciseInstance)
        exerciseInstance.sets.push(setData);

        await routine.save();
        res.redirect('back')
    } catch (error) {
        console.error('Error adding progress:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete routine
router.delete('/deleteRoutine/:routineId', async (req, res) => {
    try {
        const routineId = req.params.routineId;
        const routine = await Routine.findByIdAndDelete(routineId);

        if (!routine) {
            return res.status(404).json({ error: 'Routine not found' });
        }

        res.status(200).json({ message: 'Routine deleted successfully' });
    } catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//delete exercise from routine
router.delete('/deleteExerciseFromRoutine/:routineId/:exerciseIndex', async (req, res) => {
    try {
        const { routineId, exerciseIndex } = req.params;

            const routine = await Routine.findById(routineId);

            if (!routine) {
                return res.status(404).json({ error: 'Routine not found' });
            }
            let exercise = routine.exercises[exerciseIndex];

            // If the exercise does not exist in the exercises array, try to find it in the customexercises array
            if (!exercise && routine.customexercises.length > exerciseIndex) {
                exercise = routine.customexercises[exerciseIndex];
            }
    
            if (!exercise) {
                return res.status(404).json({ message: 'Exercise not found in the routine' });
            }
    
            // Remove the exercise at the specified index
            if (exerciseIndex < routine.exercises.length) {
                routine.exercises.splice(exerciseIndex, 1);
            } else {
                routine.customexercises.splice(exerciseIndex - routine.exercises.length, 1);
            }

            await routine.save();
        

        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete custom exercise
router.delete('/deleteCustomExercise/:customExerciseId', async (req, res) => {
    try {
        const customExerciseId = req.params.customExerciseId;
        const customExercise = await CustomExercise.findByIdAndDelete(customExerciseId);

        if (!customExercise) {
            return res.status(404).json({ error: 'Custom Exercise not found' });
        }

        res.status(200).json({ message: 'Custom Exercise deleted successfully' });
    } catch (error) {
        console.error('Error deleting custom exercise:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteCustomExercise/:routineId/:customExerciseId', async (req, res) => {
    const { routineId, customExerciseId } = req.params;
    
    const result = await Routine.updateMany(
        { _id: routineId },
        { $pull: { customexercises: { _id: customExerciseId } } }
    );

    // Check if any documents were modified
    if (result.nModified > 0) {
        res.status(200).json({ message: 'Custom exercises deleted from routine successfully' });
    } else {
        res.status(404).json({ message: 'Custom exercises not found in the routine' });
    }
});

router.delete('/deleteSet/:routineId/:exerciseId/:exerciseIndex/:setIndex', async (req, res) => {
    try {
        const { routineId, exerciseId, exerciseIndex, setIndex } = req.params;
        console.log(routineId, exerciseId, exerciseIndex, setIndex);
        const routine = await Routine.findById(routineId);
        
        if (!routine) {
            return res.status(404).json({ error: 'Routine not found' });
        }

        const exercise = routine.exercises.find(ex => ex._id.toString() === exerciseId);
        
        let exerciseInstance;
        if (!exercise && routine.customexercises.length > exerciseIndex) {
            exerciseInstance = routine.customexercises[exerciseIndex];
        
            // for some reason, it have to put inside this if statement to work
            exerciseInstance.sets.splice(setIndex, 1);
        
            await routine.save();
        }else {
            exerciseInstance = routine.exercises[exerciseIndex];
            exerciseInstance.sets.splice(setIndex, 1);
        
            await routine.save();
        }

        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found in the routine' });
        }
        
        res.status(200).json({ message: 'Set deleted successfully' });
    } catch (error) {
        console.error('Error deleting set:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

//logout
router.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/");
});
module.exports = router;