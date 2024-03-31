require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require('./server/config/db');
const app = express();
const port = 3000 || process.env.PORT;

//connect to DB
connectDB();

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/fitness_tracking', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//     console.log("Connected to MongoDB");
// })
// .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
// });

app.use('/', require('./server/routes/main'))

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
