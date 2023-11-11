const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true }
});

module.exports = mongoose.model('Welcome', welcomeSchema, 'welcomeschemas');
