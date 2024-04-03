require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000 || process.env.PORT;

//connect to DB
connectDB();

app.use(express.static('public'));
app.use(expressLayout);
app.use(express.json());
app.use(cookieParser());

app.set('layout', './layouts/main')
app.set('view engine', 'ejs');
app.use('/', require('./server/routes/main'))



// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
