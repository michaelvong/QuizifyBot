const { Schema, model } = require('mongoose');

const scoreSchema = new Schema({
    userId : {
        type: String,
        required: true,
    },
    guildId : {
        type: String,
        required: true,
    },
    score : {
        type : Number,
        default : 0,
    }
});

module.exports = model('Score', scoreSchema);