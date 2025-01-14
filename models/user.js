const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

async function deleteAllUsers() {
    await User.deleteMany();
    console.log("All users were removed from database!");
}

async function isUsernameAvailable(username) {
    const check = await User.findOne({name: username});
    if (Object.is(check, null)) {
        return true;
    } else {
        return false;
    }
}

async function doesUserExist(username) {
    const check = await User.findOne({name: username});
    if (check) {
        return true;
    } else {
        return false;
    }
}

async function checkCredentials(username, password) {
    const user = await User.findOne({name: username});
    if (!user) {
        return false;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (user.name === username && passwordMatch) {
        return true;
    } else {
        return false;
    }
}

async function registerUser(username, password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        
        if (await isUsernameAvailable(username)) {
            await User.create({ name: username, password: hash });
            await getAllUsers();
            return `New User created! Username: ${username}`;
        } else {
            return `Username ${username} is taken!`;
        }
    } catch (err) {
        console.log("Error:", err);
        throw new Error("Registration failed");
    }
}

module.exports = {User, deleteAllUsers, getAllUsers, connectMongoose, isUsernameAvailable, doesUserExist, checkCredentials, registerUser};