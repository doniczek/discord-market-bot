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
const config = require("../../config.json");
const ServerStats = require("../../models/StatystykiSchema")
const WelcomeDb = require("../../models/WelcomeSchema");
const ByeDb = require("../../models/ByeSchema");
const WeryfikacjaDb = require("../../models/weryfikacjaSchema");
const GuildLogs = require("../../models/logsmodels");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ustawienia")
        .setDescription("zmień ustawienia bota")
        .addSubcommand(c =>
            c.setName("logi")
                .setDescription("Ustaw logi")
                .addChannelOption(o =>
                    o.setName("kanał").addChannelTypes(ChannelType.GuildText).setDescription("ustaw na którym kanale będą się wyświetlać logi"))
                .addStringOption(o => o.setName("ticket_logs")
                    .setDescription("Ustaw czy chcesz włączyć tickety").setChoices({
                        name: "włącz",
                        value: "on"
                    }, {name: "wyłącz", value: "off"})
                )
        )
        .addSubcommand(command =>
            command.setName("cennik")
                .setDescription("ustaw cennik")
                .addChannelOption(o =>
                    o.setName("kanał").setDescription("ustaw na którym kanale ma być cennik")))
        .addSubcommand(
            command =>
                command.setName("weryfikacja")
                    .setDescription("ustaw parametry do weryfikacji")
                    .addChannelOption(
                        channel =>
                            channel.setName("kanał")
                                .setDescription("wybierz kanał na który ma być weryfikacja")
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildText)
                    )
                    .addRoleOption(ranga =>
                        ranga.setName("ranga")
                            .setDescription("wybierz range ktora będzie nadawana dla osoby po reakcji")
                            .setRequired(true)
                    ))
        .addSubcommand(command =>
            command.setName("ticket"
            ).setDescription("tworzy ticket")
                .addChannelOption(o =>
                    o.setName("kanał")
                        .setDescription("wybierz na ktorym kanale mają byc tickety")
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)))
        .addSubcommandGroup((g) =>
            g.setName("lobby")
                .setDescription("ustawienia lobby")
                .addSubcommand(c =>
                    c.setName("powitanie")
                        .setDescription("ustawia lobby powitanie")
                        .addChannelOption(o =>
                            o.setName("kanal")
                                .setDescription("ustawia na którym kanale będą pojawiać się powitania")
                                .setRequired(true)
                                .addChannelTypes(ChannelType.GuildText)))
                .addSubcommand(c =>
                    c.setName("pozegnanie")
                        .setDescription("ustawia lobby pozegnanie")
                        .addChannelOption(o =>
                            o.setName("kanal")
                                .setDescription("ustawia na którym kanale będą pojawiać się pożegnania")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)))
        )
        .addSubcommandGroup(g =>
            g.setName("statystyki")
                .setDescription("Ustaw statystyki serwera")
                .addSubcommand(c =>
                    c.setName("nowa_osoba")
                        .setDescription("ustawia kanał na ktorym bedzie pojawiac sie nick")
                        .addChannelOption(o =>
                            o.setName("kanal")
                                .setDescription("Wybierz kanał na którym będzie pojawiać się nick nowej osoby")
                                .addChannelTypes(ChannelType.GuildVoice)
                                .setRequired(true))
                )
                .addSubcommand(c =>
                    c.setName("ilosc_osob")
                        .setDescription("Ustaw kanał na którym będzie wyświetlać się ilość osób")
                        .addChannelOption(o =>
                            o.setName("kanal")
                                .setDescription("Wybierz kanał na którym będzie pojawiać się ilość osób na serwerze")
                                .addChannelTypes(ChannelType.GuildVoice)
                                .setRequired(true)))
        ),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {options, guild} = interaction;

        const sub = options.getSubcommand();

        switch (sub) {
            case "logi": {

                const kanal = options.getChannel("kanał");
                const ticket = options.getString("ticket_logs");
                const existingLogs = await GuildLogs.findOne({guildId: interaction.guildId});


                if (existingLogs) {
                    existingLogs.ticketLogs = true;
                    existingLogs.channelId = kanal.id;
                    await existingLogs.save();
                } else {
                    const newLogs = new GuildLogs({
                        guildId: interaction.guildId,
                        channelId: kanal.id,
                        ticketLogs: true,
                    });
                    await newLogs.save();
                }
                interaction.reply({ content: "Poprawnie zapisano logi", ephemeral: true})

            }
                break;
            case "weryfikacja": {
                const WeryfikacjaDb = require("../../models/weryfikacjaSchema");
                const ranga = options.getRole("ranga");

                const button = new ButtonBuilder()
                    .setCustomId("weryfikacja")
                    .setEmoji("✅")
                    .setLabel("Zweryfikuj")
                    .setStyle(ButtonStyle.Success);
                const captcha_channel = options.getChannel("kanał")
                const captcha_embed = new EmbedBuilder()
                    .setColor(client.mainColor)
                    .setTitle("Weryfikacja")
                    .setDescription("Aby się zweryfikować należy kliknąc przycisk poniżej.")


                const Exisisting = await WeryfikacjaDb.findOne({guildId: interaction.guildId});

                if (Exisisting) {
                    Exisisting.roleId = ranga.id;
                    await Exisisting.save();
                    interaction.reply({content: `Poprawnie zaaktualizowano weryfikację na kanale`, ephemeral: true})
                    captcha_channel.send({
                        embeds: [captcha_embed],
                        components: [new ActionRowBuilder().addComponents(button)]
                    });
                } else {

                    const datatosave = new WeryfikacjaDb({
                        guildId: interaction.guildId,
                        roleId: ranga.id,
                    })

                    datatosave.save();
                    interaction.reply({content: `Poprawnie ustawiono weryfikację na kanale`, ephemeral: true})
                    captcha_channel.send({
                        embeds: [captcha_embed],
                        components: [new ActionRowBuilder().addComponents(button)]
                    });

                }
            }
                break;
            case "powitanie": {
                const kanal = options.getChannel("kanal");
                if (kanal) {
                    try {
                        const idgildi = interaction.guildId;
                        const channelid = kanal.id;

                        const dbdb = await WelcomeDb.findOne({guildId: idgildi});

                        if (dbdb) {
                            dbdb.channelId = channelid;
                            await dbdb.save();

                            const embed = new EmbedBuilder()
                                .setTitle('Poprawnie zaaktualizowano')
                                .setColor(client.mainColor);
                            interaction.reply({embeds: [embed]});
                        } else {
                            const newGuildChannel = new WelcomeDb({
                                guildId: idgildi,
                                channelId: channelid,
                            });

                            await newGuildChannel.save();

                            const embed = new EmbedBuilder()
                                .setTitle('Poprawnie zapisano')
                                .setColor(client.mainColor);
                            interaction.reply({embeds: [embed]});
                        }
                    } catch (e) {
                        const embed = new EmbedBuilder()
                            .setTitle('Wystąpił problem')
                            .setDescription(e)
                            .setColor(client.mainColor);
                        interaction.reply({embeds: [embed]});
                    }
                }
            }
                break;
            case "pozegnanie": {
                const kanal = options.getChannel("kanal")
                if (kanal) {
                    try {

                        const channelid = kanal.id;
                        const idgildi = interaction.guildId;
                        const dbdb = await ByeDb.findOne({guildId: idgildi});

                        if (dbdb) {
                            dbdb.channelId = channelid;
                            await dbdb.save();

                            const embed = new EmbedBuilder()
                                .setTitle('Poprawnie zaaktualizowano')
                                .setColor(client.mainColor);
                            interaction.reply({embeds: [embed]});
                        } else {
                            const newGuildChannel = new ByeDb({
                                guildId: idgildi,
                                channelId: channelid,
                            });
                            newGuildChannel.save();
                            const embed = new EmbedBuilder()
                                .setTitle('Poprawnie zapisano')
                                .setColor(client.mainColor);
                            interaction.reply({embeds: [embed]});
                        }

                    } catch (e) {
                        const embed = new EmbedBuilder()
                            .setTitle("Wystąpił problem")
                            .setDescription(e)
                            .setColor(client.mainColor)
                        interaction.reply({embeds: [embed]})
                    }


                }
            }
                break;
            case "nowa_osoba": {
                const kanal = options.getChannel("kanal");
                if (kanal) {
                    try {
                        const idgildi = interaction.guildId;
                        const channelid = kanal.id;
                        let dbEntry = await ServerStats.findOne({guildId: idgildi});

                        if (!dbEntry) {
                            dbEntry = new ServerStats({
                                guildId: idgildi,
                                channelId: channelid,
                            });
                        }
                        dbEntry.newMemberChannelId = channelid;
                        await dbEntry.save();
                        const embed = new EmbedBuilder()
                            .setTitle('Poprawnie zapisano')
                            .setColor(client.mainColor);
                        interaction.reply({embeds: [embed]});
                    } catch (e) {
                        const embed = new EmbedBuilder()
                            .setTitle('Wystąpił problem')
                            .setDescription(e)
                            .setColor(client.mainColor);
                        interaction.reply({embeds: [embed]});
                    }
                }
            }
                break;

            case "ilosc_osob": {
                const kanal = options.getChannel("kanal");
                if (kanal) {
                    try {
                        const idgildi = interaction.guildId;
                        const channelid = kanal.id;
                        let dbEntry = await ServerStats.findOne({guildId: idgildi});
                        if (!dbEntry) {
                            dbEntry = new ServerStats({
                                guildId: idgildi,
                                channelId: channelid
                            });
                        }
                        dbEntry.MembersChannelId = channelid;
                        await dbEntry.save();
                        const embed = new EmbedBuilder()
                            .setTitle('Poprawnie zapisano')
                            .setColor(client.mainColor);
                        interaction.reply({embeds: [embed]});
                    } catch (e) {
                        const embed = new EmbedBuilder()
                            .setTitle('Wystąpił problem')
                            .setDescription(e)
                            .setColor(client.mainColor);
                        interaction.reply({embeds: [embed]});
                    }
                }
            }
                break;
            case "ticket": {
                const ticketEmbed = new EmbedBuilder()
                    .setTitle("Utwórz ticket")
                    .setDescription("Aby utworzyć ticket kliknij guzik poniżej")
                    .setColor(client.mainColor)

                const selectmenu = new SelectMenuBuilder()
                    .setCustomId("ticket")
                    .setPlaceholder('Wybierz rodzaj ticketa')
                    .addOptions([
                        {
                            label: 'Zamówienie grafika',
                            description: 'ticket aby zamówić grafikę',
                            value: '1',
                        },
                        {
                            label: 'Zamówienie montaż',
                            description: 'ticket do zamówienia montażu',
                            value: '2',
                        },
                        {
                            label: 'Pomoc',
                            description: 'ticket do pomocy',
                            value: '3',
                        },
                        {
                            label: 'Współpraca',
                            description: 'ticket do współpracy',
                            value: '4',
                        },
                        {
                            label: 'Partnerstwo',
                            description: 'ticket do partnstwa',
                            value: '5'
                        },
                    ])
                const row = new ActionRowBuilder()
                    .addComponents(selectmenu);


                const channel = options.getChannel("kanał")
                channel.send({embeds: [ticketEmbed], components: [row]});
                interaction.reply({
                    content: `Poprawnie wysłano wiadomość do pobrania ticketa <#${channel.id}> `,
                    ephemeral: true
                });

            }
                break;
        }
    }

};
