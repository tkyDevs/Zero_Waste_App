// -------------------------------------------- MONGOOSE
const {User, connectMongoose} = require('./models/user');
connectMongoose().catch(err => {
    console.log(`Error connecting to Mongoose: ${err}`);
})

// -------------------------------------------- EXPRESS
const express = require('express');
const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

app.get('*', (req, res) => {
    res.send('Ops! It seems you found my invisible border...');
})

app.listen(PORT, () => {
    console.log(`Zero Waste App listening on port ${PORT}!`);
})