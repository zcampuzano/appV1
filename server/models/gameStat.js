/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const gameStatSchema = new Schema({
    date: {type: String, require: true},
    athlete: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' },
    stats: { }

});


module.exports = mongoose.model('Game', gameStatSchema);

module.exports.createGameStat = function(newGameStatSchema, callback) {
    newGameStatSchema.save(callback);
}