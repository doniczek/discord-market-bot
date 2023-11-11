const mongoose = require('mongoose');

const serverStatsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    newMemberChannelId: {
        type: String,
        required: false, 
    },
    MembersChannelId: {
        type: String,
        required: false, 
    },
});

module.exports = mongoose.model('ServerStats', serverStatsSchema);
