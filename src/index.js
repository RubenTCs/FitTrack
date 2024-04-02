const express = require("express");
const Collection = require("./mongo");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

app.set('view engine', 'ejs');
app.set("views", templatePath);
app.use(express.static(publicPath));

async function hashPass(password) {
    const res = await bcryptjs.hash(password, 10);
    return res;
}

async function compare(userPass, hashPass) {
    const res = await bcryptjs.compare(userPass, hashPass);
    return res;
}

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const check = await Collection.findOne({ name: req.body.name });
        if (check) {
            res.send("User already exists");
        } else {
            const token = jwt.sign({ name: req.body.name }, "abcdefghijklmnopqrstuvwxyzabcdeghijklmnopqrstuvwxyz");
            const data = {
                name: req.body.name,
                email: req.body.email,
                password: await hashPass(req.body.password),
                token: token
            };
            await Collection.insertMany([data]);
            res.render("home", { name: req.body.name });
        }
    } catch {
        res.send("Wrong details");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.send('<script>alert("Please enter both name and password"); window.location="/"</script>');
        }

        const check = await Collection.findOne({ name });
        if (!check) {
            return res.send('<script>alert("Account not found"); window.location="/"</script>');
        }

        const passCheck = await compare(password, check.password);
        if (passCheck) {
            res.cookie("jwt", check.token, {
                maxAge: 600000,
                httpOnly: true
            });
            res.render("home", { name: check.name });
        } else {
            res.send('<script>alert("Wrong password"); window.location="/"</script>');
        }
    } catch {
        res.send('<script>alert("Error occurred"); window.location="/"</script>');
    }
});

app.listen(3000, () => {
    console.log("Port 3000 connected");
});
