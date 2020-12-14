const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const petSchema = new Schema({
                                 userId: {type: String, required:true},
                                 type: {type: String, required: true},
                                 species: {type: String, required: true},
                                 breeds: {type: JSON, required: true},
                                 age: {type: String, required: true},
                                 size: {type: String, required: true},
                                 gender: {type: String, required: true},
                                 name: {type: String, required: true},
                                 description: {type: String},
                                 adoptable: {type: Boolean, required: true},
                                 photos: {type: Array},
                                 blogpostId: {type: Array},
                                 email: {type: String},
                                 contact: {type: JSON},
                             }, {
                                 timestamps: true,
                             });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
