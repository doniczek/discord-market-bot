const { GiveawaysManager } = require('discord-giveaways');
const giveawayModel = require('./models/giveawaysSchema');

class MyGiveawaysManager extends GiveawaysManager {
    async getAllGiveaways() {
        return await giveawayModel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
        return await giveawayModel.create(giveawayData);
    }

    async editGiveaway(messageId, giveawayData) {
        return await giveawayModel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
    }

    async deleteGiveaway(messageId) {
        return await giveawayModel.deleteOne({ messageId }).exec();
    }
}

module.exports = MyGiveawaysManager;
