// -------------------------------------------- MONGOOSE
const {User, deleteAllUsers, connectMongoose, getAllUsers, isUsernameAvailable, doesUserExist, checkCredentials, registerUser} = require('./models/user');
connectMongoose().catch(err => {
    console.log(`Error connecting to Mongoose: ${err}`);
})

// -------------------------------------------- EXPRESS
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//-------------------------------------------- CONNECT-FLASH
const flash = require('connect-flash');
const session = require('express-session');
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(flash());

//-------------------------------------------- ROUTING

app.get('/', (req, res) => {
    const message = req.flash('message');
    res.render('login.ejs', {message});
})
app.post('/', async (req, res) => {
    const {username, password} = req.body;
    const userExists = await doesUserExist(username);
    console.log(`User exists: ${userExists}`);
    if (userExists) {
        const validCredentials = await checkCredentials(username, password);
        if (validCredentials) {
            res.render('kitchen.ejs');
        } else {
            req.flash('message', "Credentials are incorrect! Try Again.")
            res.redirect('/');
        }
    } else {
        req.flash('message', "Username does not exist!");
        res.redirect('/');
    }
})

app.get('/register', (req, res) => {
    let warning = req.flash('warning');
    getAllUsers();
    res.render('register.ejs', {warning});
})
app.post('/register', async (req, res) => {
    const {username, password, passwordCheck} = req.body;
    if (password !== passwordCheck) {
        req.flash('warning', "Passwords don't match! Please try again.");
        res.redirect('/register');
    } else if (password.length < 4 || password.length > 16) {
        req.flash('warning', "Passwords must be of length 4-16 characters.");
        res.redirect('/register');
    } else if (await !isUsernameAvailable) {
        req.flash('warning', `Username ${username} is already taken!`);
        res.redirect('/register');
    } else {
        await registerUser(username, password);
        await getAllUsers();
        req.flash('message', "User created successfully!");
        res.redirect('/');
    }
})

app.get('*', (req, res) => {
    res.send('Ops! It seems you found my invisible border...');
})

app.listen(PORT, () => {
    console.log(`Zero Waste App listening on port ${PORT}!`);
})