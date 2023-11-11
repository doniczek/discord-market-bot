const mongoose = require('mongoose');

const GuildLogsSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    ticketLogs: {
        type: Boolean,
        default: false,
    },
    moderationLogs: {
        type: Boolean,
        default: false,
    },
});

const GuildLogs = mongoose.model('guildLog', GuildLogsSchema);

module.exports = GuildLogs;
