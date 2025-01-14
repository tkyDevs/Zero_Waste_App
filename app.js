// -------------------------------------------- MONGOOSE
const {User, getIngredientList, handleAddIngredient, deleteAllUsers, connectMongoose, getAllUsers, isUsernameAvailable, doesUserExist, checkCredentials, registerUser} = require('./models/user');
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
app.use(express.json());

// -------------------------------------------- CONNECT-FLASH
const flash = require('connect-flash');
const session = require('express-session');
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(flash());

// -------------------------------------------- AXIOS
const axios = require('axios');
require('dotenv').config();

// -------------------------------------------- ROUTING
app.get('/kitchen', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    const username = req.session.user;
    const ingredientList = await getIngredientList(username);
    const message = req.flash('message');
    req.flash('message', `Welcome, ${username}!`);
    res.render('kitchen.ejs', { username, ingredientList, message});
});

app.post('/addIngredient', async (req, res) => {
    const ingredient = req.body.ingredient;
    
    try {
        if (!ingredient) {
            return res.status(400).json({ success: false, message: "Ingredient is required" });
        }

        const username = req.session.user;
        if (!username) {
            return res.status(400).json({ success: false, message: "User is not logged in" });
        }

        const ingredientsList = await handleAddIngredient(username, ingredient);
        return res.json({ success: true, ingredientsList });
    } catch (error) {
        console.error("Error adding ingredient:", error);
        return res.status(500).json({ success: false, message: "Error adding ingredient" });
    }
});

app.get('/fetchRecipes', async (req, res) => {
    console.log('Fetching recipes...');
    const username = req.session.user;

    if (!username) {
        console.log('User is not logged in, returning to login page.');
        return res.redirect('/');
    }

    const url = 'https://api.spoonacular.com/recipes/findByIngredients';
    const ingredientsList = await getIngredientList(username);

    if (ingredientsList.length === 0) {
        return res.status(400).json({ error: 'No ingredients provided' });
    }

    try {
        const response = await axios.get(url, {
            params: {
                apiKey: process.env.SPOONACULAR_API_KEY,
                ingredients: ingredientsList.join(','),
                number: 12,
                limitLicense: true,
                ranking: 1,
                ignorePantry: false,
            },
        });

        let idList = response.data.map(element => element.id);

        const recipeRequests = idList.map(id => {
            const url2 = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false`;
            return axios.get(url2, {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                    includeNutrition: false
                }
            });
        });

        const recipeResponses = await Promise.all(recipeRequests);
        const recipesDetailed = recipeResponses.map(response => response.data);
        res.json({ recipes: recipesDetailed });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});



app.get('/', (req, res) => {
    const message = req.flash('message');
    res.render('login.ejs', {message});
})
app.post('/', async (req, res) => {
    const { username, password } = req.body;
    const userExists = await doesUserExist(username);
    
    if (userExists) {
        const validCredentials = await checkCredentials(username, password);
        
        if (validCredentials) {
            req.session.user = username;
            res.redirect('/kitchen');
        } else {
            req.flash('message', "Credentials are incorrect! Try Again.");
            res.redirect('/');
        }
    } else {
        req.flash('message', "Username does not exist!");
        res.redirect('/');
    }
});

app.get('/register', (req, res) => {
    let warning = req.flash('warning');
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
        req.flash('message', "User created successfully!");
        res.redirect('/');
    }
})

// //-------------------------------------------- DEBUGGING ROUTES
app.get('/showAll', async (req, res) => {
    const content = await getAllUsers();
    res.send(content);
})

app.get('/deleteAll', async (req, res) => {
    await deleteAllUsers();
    res.send('All users were deleted from database');
})

app.get('*', (req, res) => {
    res.send('Ops! It seems you found my invisible border...');
})

app.listen(PORT, () => {
    console.log(`Zero Waste App listening on port ${PORT}!`);
})