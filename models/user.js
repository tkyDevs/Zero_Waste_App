const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 16
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 4
    },
    ingredients: {
        type: [String],
    },
    favorites: {
        type: [Number]
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function connectMongoose() {
    await mongoose.connect('mongodb://127.0.0.1:27017/zeroWaste');
    console.log('Server connected to Mongoose!');
}

async function getAllUsers() {
    const users = await User.find();
    console.log(users);
}

async function isUsernameAvailable(username) {
    const check = User.findOne({name: username});
    if (Object.is(check, null)) {
        return true;
    } else {
        return false;
    }
}

async function doesUserExist(username) {
    const check = User.findOne({name: username});
    if (check) {
        return true;
    } else {
        return false;
    }
}

async function checkCredentials(username, password) {
    const user = User.findOne({name: username});
    if (user.name === username & user.password === password) {
        return true;
    } else {
        return false;
    }
}

async function registerUser(username, password) {
    if (isUsernameAvailable(username)) {
        await User.create({name: username, password: password});
        return `New User created! Username: ${username}`;
    } else {
        return `Username ${username} is taken!`
    }
}

module.exports = {User, getAllUsers, connectMongoose, isUsernameAvailable, doesUserExist, checkCredentials, registerUser};