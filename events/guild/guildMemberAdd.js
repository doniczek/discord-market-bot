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

const welcomeSchema = require("../../models/WelcomeSchema")
const serverStatsSchema = require("../../models/StatystykiSchema")

module.exports = {
    name: "guildMemberAdd",
    rest: false,
    once: false,
    /**
     * @param {GuildMember} member
     * @param {Client} client
     */
    async execute(member) {
        const {user, guild} = member;
        try {
            const dataStats = serverStatsSchema.findOne({guildId: guild.id})

            const data = await welcomeSchema.findOne({ guildId: guild.id });
            const kanal = data.channelId;
            
            if (user.bot) return;
            let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
            const statsData = await dataStats.findOne({ guildId: guild.id });
            
            
            
            if (!kanal) return console.log("brak channelid w guildmembreadd.js");
            const mainColor = parseInt(config.botMainColor);
            const powitanieEmbed = new EmbedBuilder()
                .setDescription(`Witaj <@${user.id}> na serwerze ${guild.name} - 👋`)
                .setColor(mainColor)
                .setImage(avatar)
            const welcomeChannel = guild.channels.cache.get(kanal);

            if (kanal) {
                welcomeChannel.send({embeds: [powitanieEmbed]})
            }
    if(statsData.MembersChannelId) { 
        const kanalid1 =statsData.MembersChannelId
        const kanal1 = guild.channels.cache.get(kanalid1)
        if (kanal1) {
            kanal1.edit({ name: `${guild.memberCount}` })
        }
    }
    
    if(statsData.newMemberChannelId) {
        const kanalid2 = statsData.newMemberChannelId;
        const kanal2 = guild.channels.cache.get(kanalid2);
        if (kanal2) { 
            kanal2.edit({ name: `👋 ${user.username}`})            
        }
        
    }
           
        } catch (e) {
            console.error(e)
            console.log("error w guilderMemberAdd.js")
        }
       

    }
};
