const { StringSelectMenuInteraction, EmbedBuilder, embedLength} = require('discord.js')
const fs = require("fs");
const Client = require("../../bot.js")
module.exports = {
    data: {
        name: 'cennikMenu'
    },
    /**
     * @param { StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const selection = interaction.values[0];
        console.log(selection)
        switch (selection) {
            case "cennik_grafiki": {

                const cennikgrafikiembed = new EmbedBuilder()
                    .setTitle("Grafiki - cennik")
                    .setDescription("Miniaturka - 1zł\n" +
                        "Banner - 1zł\n" +
                        "Avatar - 1zł\n" +
                        "Logo - 1zł\n" +
                        "Render - 1zł\n" +
                        "Overlay - 1zł")
                    .setColor(client.mainColor)

                interaction.reply({embeds: [cennikgrafikiembed], ephemeral: true})
            }
                break;
            case "cennik_montaz": {
                const cennikmontazembed = new EmbedBuilder()
                    .setTitle("Montaż - Cennik")
                    .setDescription("Film 5 minut - 1zł\n" +
                        "Film 10 min - 1zł\n" +
                        "Film 15 min - 1zł\n" +
                        "Film 20 min - 1zł\n" +
                        "Film 20+ min - 1zł")
                    .setColor(client.mainColor)
                interaction.reply({embeds: [cennikmontazembed], ephemeral: true})
            }
                break;
            case "cennik_gildia": {
                const cennikgildiaembed = new EmbedBuilder()
                    .setTitle("Gildia - Cennik")
                    .setDescription("Baner Rekrutacji - 1zł")
                    .setColor(client.mainColor)
                interaction.reply({embeds: [cennikgildiaembed], ephemeral: true})
            }
                break;
            case "cennik_pakiety": {
                const cennikpakietyembed = new EmbedBuilder()
                    .setTitle("Pakiety - Cennik")
                    .addFields({name: "Youtube", value: "banner \n avatar\n overlay\n 2x miniaturka\n "})
                    .setColor(client.mainColor)
                interaction.reply({embeds: [cennikpakietyembed], ephemeral: true})
            }
                break;

        }

    }
}