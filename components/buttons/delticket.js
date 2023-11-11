const { ButtonInteraction, Client, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder } = require('discord.js')
const logsmodels = require("../../models/logsmodels");

module.exports = {
    data: {
        name: "delticket"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;
        const logsDb = await logsmodels.findOne({guildId: interaction.guildId});


        const currentTime = Math.floor(Date.now() / 1000);
        const timestamp = currentTime + 10;



        interaction.reply({
            content: `Ticket zostanie zamknięty za <t:${timestamp}:R>`,
            ephemeral: true
        })
        setTimeout(() => {
            interaction.channel.delete();
            }, 10000);
        if (logsDb) { 
            const kanal = logsDb.channelId;
            const channel = guild.channels.cache.get(kanal);
            const logsembed = new EmbedBuilder()
                .setTitle("Logi")
                .setDescription(`${interaction.user.username} (${interaction.user.id}) - usunął ticket`)
                .setColor(client.mainColor)
            channel.send({ embeds: [logsembed]})
        }
    }  
};
