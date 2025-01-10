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

module.exports = {User, connectMongoose};