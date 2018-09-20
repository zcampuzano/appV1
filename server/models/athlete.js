/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

//todo add position

// Validate Function to check username length
let usernameLengthChecker = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Check length of username string
        if (username.length < 3 || username.length > 15) {
            return false; // Return error if does not meet length requirement
        } else {
            return true; // Return as valid username
        }
    }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
    // Check if username exists
    if (!username) {
        return false; // Return error
    } else {
        // Regular expression to test if username format is valid
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username); // Return regular expression test result (true or false)
    }
};

// Array of Username validators
const usernameValidators = [
    // First Username validator
    {
        validator: usernameLengthChecker,
        message: 'Username must be at least 3 characters but no more than 15'
    },
    // Second username validator
    {
        validator: validUsername,
        message: 'Username must not have any special characters'
    }
];

const athleteSchema = new Schema({
    firstname: { type: String, required: true, validate: usernameValidators },
    lastname: { type: String, required: true, validate: usernameValidators },
    number: { type: Number, required: true},
    basketballStat : { type : mongoose.Schema.Types.ObjectId, ref: 'Basketball' , sparse : true},
    // baseballStat : { type : mongoose.Schema.Types.ObjectId, ref: 'Baseball' , sparse : true},
    // footballStat : { type : mongoose.Schema.Types.ObjectId, ref: 'Football', sparse : true},
    organization : { type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}
});

module.exports = mongoose.model('Athlete', athleteSchema);

module.exports.createAthlete = function(newAthlete, callback){
    newAthlete.save(callback);
}