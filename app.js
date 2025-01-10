// -------------------------------------------- MONGOOSE
const {User, connectMongoose, isUsernameAvailable, isregisterUser} = require('./models/user');
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

app.get('/', (req, res) => {
    let message = null;
    res.render('login.ejs', {message});
})

app.get('/register', (req, res) => {
    let warning = null;
    res.render('register.ejs', {warning});
})
app.post('/register', (req, res) => {
    const {username, password, passwordCheck} = req.body;
    if (password !== passwordCheck) {
        res.render('register.ejs', {warning: "Passwords don't match! Please try again."});
    } else if (!isUsernameAvailable) {
        res.render('register.ejs', {warning: `Username ${username} is already taken!`});
    } else {
        res.render('login.ejs', {message: "User created successfully!"});
    }
})

app.get('*', (req, res) => {
    res.send('Ops! It seems you found my invisible border...');
})

app.listen(PORT, () => {
    console.log(`Zero Waste App listening on port ${PORT}!`);
})