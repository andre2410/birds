const mongoose = require("mongoose");

// create a schema
const birdSchema = new mongoose.Schema({
    primary_name: { type: String, required: true },
    english_name: { type: String, required: true },
    scientific_name: { type: String, required: true },
    order: { type: String, required: true },
    family: { type: String, required: true },
    other_names: [String],
    status: { type: String, required: true },
    photo: {
        credit: {type: String, required: true},
        source: {type: String, required: true},
    },
    size: {
        length: {
            value: {type: Number, required: true},
            units: {type: String, required: true}
        },
        weight: {
            value: {type: Number, required: true},
            units: {type: String, required: true}
        }
    }
})

// compile the schema into a model
const bird = mongoose.model('bird', birdSchema);

// export the model
module.exports = bird;

