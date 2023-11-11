const mongoose = require('mongoose');
const {ButtonInteraction, Client, EmbedBuilder} = require('discord.js');
const config = require('../../config.json');
const WeryfikacjaSchema = require('../../models/weryfikacjaSchema');

module.exports = {
    data: {
        name: 'weryfikacja'
    },

    /**
     *
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {member, guild} = interaction;
        const currentTime = Math.floor(Date.now() / 1000);
        const timestamp = currentTime + 5;
        const guildData = await WeryfikacjaSchema.findOne({guildId: guild.id});
        if (!guildData) return;
        const roleId = guildData.roleId;
        member.roles.add([roleId]).then(() => {
            interaction.reply({content: `Zostałeś zweryfikowany!`, ephemeral: true});
        }).catch(console.error);
    }
};
