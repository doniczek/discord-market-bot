const {
    Client,
    CommandInteraction,
    InteractionType,
    Collection,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonComponent
} = require("discord.js");
const polls = require('../../models/pollModel.js');
module.exports = {
    name: "interactionCreate",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);
                await interaction.reply({
                    content: `Coś poszło nie tak używając tej funkcji.`,
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            
            const m = interaction.message.id;
            const pol = await polls.findOne({ message: m });
            if (pol) {
                await interaction.deferReply({
                    ephemeral: true
                });
                if (pol.voters.includes(interaction.user.id)) return interaction.editReply({ content: "\`[ ❌ ]\` Już oddałeś głos w tej ankiecie!", ephemeral: true });
                pol.votes = pol.votes || {};
                if (pol.votes[interaction.customId]) pol.votes[interaction.customId] += 1;
                else pol.votes[interaction.customId] = 1;
                pol.voters.push(interaction.user.id);
                await polls.findOneAndUpdate({ message: pol.message }, pol);
                await interaction.editReply({ content: "`[ ✔️ ]` Pomyślnie oddano głos w ankiecie!", ephemeral: true });
                const m2 = interaction.channel.messages.cache.get(m);

              
                const newRow = new ActionRowBuilder();

             
                m2.components[0].components.forEach(v => {
                    v.data.label = `${pol.votes[v.customId] || 0}`;
                    newRow.addComponents(v);
                });

      



                await m2.edit({
                    components: [
                        newRow
                    ]
                });
            }


            else {
                const {buttons} = client;
                const button = buttons.get(interaction.customId);
                if (button) {
                    try {
                        await button.execute(interaction, client);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        } else if (interaction.isStringSelectMenu()) {
            const {selectMenus} = client;
            const selectMenu = selectMenus.get(interaction.customId)
            if (selectMenu) {
                try {
                    await selectMenu.execute(interaction, client);
                } catch (e) {

                    console.log(e)
                }
            }
        } else if (interaction.isContextMenuCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const contextCommand = commands.get(commandName);
            if (!contextCommand) return;

            try {
                await contextCommand.execute(interaction.client);
            } catch (error) {
                console.error(error);
            }
        }
    },
};
