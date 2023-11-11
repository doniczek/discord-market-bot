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

const ByeDb = require("../../models/ByeSchema")
const ServerStats = require("../../models/StatystykiSchema")

module.exports = {
    name: "guildMemberRemove",
    rest: false,
    once: false,
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member) {
        const {user, guild} = member;
        const data = await ByeDb.findOne({guildId: guild.id})
        const kanal = data.channelId;
        const mainColor = parseInt(config.botMainColor);
        try {
            if (kanal) {
                let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
                const embed = new EmbedBuilder()
                    .setColor(mainColor)
                    .setDescription("Żegnamy, mamy nadzieje że wrócisz na serwer")
                    .setImage(avatar)
                const kanal1 = guild.channels.cache.get(kanal)
                kanal1.send({embeds: [embed]})
            }

            const dataStats = await ServerStats.findOne({guildId: guild.id});
            kanal1 = dataStats.MembersChannelId;
            const kanal2 = guild.channels.cache.get(kanal1)
            if (kanal2) {
                kanal2.edit({name: `${guild.memberCount}`})
            }

        } catch (e) {
            console.log(e)
        }


    }
};
