const mongoose = require('mongoose');

const weryfikacjaSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    roleId: { type: String, required: true }
});

module.exports = mongoose.model('weryfikacja', weryfikacjaSchema, 'weryfikacjaSchema');
