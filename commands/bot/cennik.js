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
    SelectMenuOptionBuilder, StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cennik")
        .setDescription("Sprawdź cennik"),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {options, guild} = interaction;

        
        const cennikEmbed = new EmbedBuilder()
            .setTitle("Cennik")
            .setDescription("Wybierz który cennik chcesz zobaczyć poniżej")
            .setColor(client.mainColor)
            
        const cennikSelectMenu = new StringSelectMenuBuilder()
            .setCustomId("cennikMenu")
            .addOptions({ label: "Grafiki", value: "cennik_grafiki", description:"cennik grafik" }, { label: "Montaż", value: "cennik_montaz", description:"cennik montażu" }, { label: "Gildia", value: "cennik_gildia", description:"cennik grafik dla gildi" }, { label: "Pakiety", value: "cennik_pakiety", description:"cennik pakietów" })
        
       const row = new ActionRowBuilder()
           .addComponents(cennikSelectMenu) 
     interaction.reply({ embeds: [cennikEmbed], components: [row]})  
    }
};
