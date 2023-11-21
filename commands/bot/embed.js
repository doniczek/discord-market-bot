const {
    Client,
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

const Discord = require('discord.js')
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("tworzy embed")
        .addChannelOption(o => 
        o.setName("kanał")
            .setDescription("Ustaw na którym kanale będzie embed")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText))
        .addStringOption(o =>
            o.setName("tytuł")
                .setMaxLength(256)
                .setDescription("Ustaw tytuł ebmeda")
        )
        .addStringOption(o =>
            o.setName("kolor")
                .setDescription("Ustaw kolor dla twojego embeda (hex)")
        )
        .addStringOption(o =>
            o.setName("opis")
                .setMaxLength(4096)
                .setDescription("Ustaw opis dla twojego embeda"))
        .addStringOption(o =>
            o.setName("obraz")
                .setDescription("Ustaw obrazek embeda (Link)"))
    ,
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {options, guild} = interaction;
        const tytul = options.getString("tytuł")
        const kolor = options.getString("kolor")
        const opis = options.getString("opis")
        const obraz = options.getString("obraz")
        const kanal = options.getChannel("kanał")

        var finaldescription = opis;
        finaldescription = finaldescription.replaceAll("{N}", "\n");
        
        const embed = new Discord.EmbedBuilder();
        if (tytul) {
            embed.setTitle(tytul)
        }
        if (kolor) {
            embed.setColor(kolor)
        }   
        if (opis) {
            embed.setDescription(finaldescription)
        }
        if (obraz) {
            embed.setImage(`${obraz}`)
        }
       kanal.send({embeds: [embed]})
        interaction.reply({content: `Poprawnie wysłano embed na kanał: ${kanal.name}`, ephemeral:true})
    }
};
