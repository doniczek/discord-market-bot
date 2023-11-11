const {find} = require('node-emoji');
const polls = require("../../models/pollModel.js");
const {
    Client,
    SlashCommandBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonStyle,
    GuildChannel,
    ButtonBuilder,
    ActionRowBuilder,
    SelectMenuBuilder,
    SelectMenuOptionBuilder, PermissionsBitField
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Zarządza ankietami na serwerze.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Tworzy ankietę.")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Wprowadź kanał.")
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("question")
                        .setDescription("Wprowadź pytanie.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("options")
                        .setDescription("Wprowadź opcje wyboru, oddziel je za pomocą |.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("custom-emojis")
                        .setDescription("Wprowadź customowe emotki.")
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("end")
                .setDescription("Kończy ankietę.")
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("Wprowadź ID.")
                        .setRequired(true)
                )),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        await interaction.deferReply();

        let _emoji = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
        let emojis = [];

        let option = interaction.options.getSubcommand();
        let channel = interaction.options.getChannel("channel");
        let question = interaction.options.getString("question");
        let rawOptions = interaction.options.getString("options");
        let cEmojis = interaction.options.getString("custom-emojis") || "";
        let id = interaction.options.getString("id");
        let poll = await polls.findOne({message: id});

        if (option === "create") {
            rawOptions = rawOptions.split("|");
            cEmojis = cEmojis?.trim()?.replace(/ +/g, "")?.split("|");
            if (rawOptions.length < 2 || rawOptions.length > 25) {
                return interaction.editReply({
                    content: "\`[ ❌ ]\` Musisz wprowadzić minimum 2 opcje lub nie może być ich więcej niż 5!",
                    ephemeral: true
                });
            }
            ;

            const rows = [new ActionRowBuilder()];

            for (let i = 0; i < rawOptions.length; i++) {
                let ind = Math.floor(i / 5);

                emojis.push(fixEmoji(client, cEmojis[i]) || _emoji[i]);

                const button = new ButtonBuilder({
                    customId: emojis[i],
                    emoji: emojis[i],
                    label: "0",
                    style: ButtonStyle.Success
                });
                rows[ind] ? rows[ind].addComponents(button) : rows[ind] = new ActionRowBuilder({
                    components: [button]
                });
            }
            ;
            channel.send({
                embeds: [{
                    color: client.mainColor,
                    title: question.slice(0, 256),
                    description: rawOptions.map((v, i) => `${cEmojis[i] || emojis[i]} ${v}`).join("\n"),
                }], components: rows
            }).then(async (v) => {
                await polls.create({
                    question,
                    message: v.id,
                    channel: channel.id,
                    guild: interaction.guildId,
                    votes: {},
                    voters: [],
                    emojis,
                });
                interaction.editReply({
                    content: "\`[ ✔️ ]\` Rozpoczęto ankietę na kanale <#" + channel.id + ">!",
                    ephemeral: true
                });
            }).catch((e) => {
                console.log(e)
            });
        }
        ;

        if (option === "end") {
            if (!poll) return interaction.editReply({
                content: "\`[ ❌ ]\` Nie odnaleziono żadnej ankiety powiązanej z tym ID!",
                ephemeral: true
            });
                if (poll.ended) return interaction.editReply({
                    content: "\`[ ❌ ]\` Wprowadzona ankieta jest zakończona!",
                    ephemeral: true
                });
                const msg = await interaction.guild.channels.cache.get(poll.channel).messages.fetch(id);
                if (!msg) return interaction.editReply({
                    content: "\`[ ❌ ]\` Nie udało się zakończyć ankiety, ponieważ wiadomość została usunięta.",
                    ephemeral: true
                });
                const opt = msg.embeds[0].description?.split("\n");
                if (!opt) return interaction.editReply({
                    content: "`[ ❌ ]` Nie udało się zakończyć ankiety, ponieważ  nie ma żadnych wygranych opcji.",
                    ephermal: true
                });
                const x = poll.votes ? Object.entries(poll.votes).sort((a, b) => b[1] - a[1]) : [];
                 let winner = opt.filter(v => v.includes( x[0][0] ));
                await interaction.editReply({content: "\`[ ✔️ ]\` Pomyślnie zakończono ankietę!", ephemeral: true});
                msg.edit({
                    components: [], embeds: [{
                        color: client.mainColor,
                        title: msg.embeds[0].title,
                        description: `Ta ankieta została zakończona! Najczęściej wybieraną opcją jest ${winner} która posiada **${x[0][1]}** głosów!`,
                    }]
            });

            await polls.findOneAndUpdate({message: id}, {ended: true});
        }
        ;
    },
};

function fixEmoji(client, emj = "") {
    const e = find(emj)?.emoji, e2 = client.emojis.cache.find(v => v.toString() === emj);

    return e2?.id || e;
}  