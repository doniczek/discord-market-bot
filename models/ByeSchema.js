// models/ByeSchema.js
const mongoose = require('mongoose');

const byeSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
});

const Bye = mongoose.model('Bye', byeSchema);

module.exports = Bye;
