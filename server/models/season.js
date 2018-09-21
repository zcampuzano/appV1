/* ===================
Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

const seasonSchema = new Schema({
    year: {type: String, require: true},
    stat: { type: mongoose.Schema.Types.ObjectId, ref: 'Basketball' },
    athletes: { type: mongoose.Schema.Types.ObjectId, ref: 'Athlete' }, // roster
    games:  { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }, // need to decide how we want to create these arrays


});

module.exports = mongoose.model('Season', seasonSchema);

module.exports.createSeason = function(newSeasonSchema, callback) {
    newSeasonSchema.save(callback);
}