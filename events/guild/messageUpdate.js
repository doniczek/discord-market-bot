const {GuildMember, Integration} = require("discord.js");
const config = require("../../config.json");
const {client} = require('../../bot')
const {
    SlashCommandBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    SelectMenuOptionBuilder, PermissionsBitField
} = require('discord.js');

const logsmodels = require("../../models/logsmodels");

module.exports = {
    name: "messageUpdate",
    rest: false,
    once: false,
    /**
     * @param {oldMessage} oldMessage
     * @param {newMessage} newmessage
     * @param {Client} client
     */
    async execute(oldMessage, newmessage, client) {
        const {user, guild} = newmessage;
        const logsdb = await logsmodels.findOne({guildId: guild.id});

        if (logsdb) {
            const kanal = logsdb.channelId;
            const channel = guild.channels.cache.get(kanal);

            if (channel) {
                const embed = new EmbedBuilder()
                    .setTitle("Logi")
                    .setColor(client.mainColor)
                    .setDescription(`${oldMessage.content} => ${newmessage.content}`)
                channel.send({embeds: [embed]})
            }
        }
    }
};
