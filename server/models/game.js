/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const gameSchema = new Schema({
    date: {type: String, require: true},
    athletes: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' }, // roster
    // home/away teams?

});

module.exports = mongoose.model('Game', gameSchema);

module.exports.createGame = function(newGameSchema, callback) {
    newGameSchema.save(callback);
}