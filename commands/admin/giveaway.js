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
const ms = require('ms')
const giveawayManager= require("../../bot").giveawayManager;
module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Tworzy giveaway")
        .addSubcommand(c =>
            c.setName("start").setDescription('startuje givevaway')
                .addStringOption(o => o.setName("czas").setDescription("Ustaw czas trwania giveawaya (1m, 1h, 1d) ").setRequired(true))
                .addIntegerOption(o => o.setName("ilosc_wygrywajacych").setDescription("Ustaw ilosc wygranych").setRequired(true))
                .addStringOption(o => o.setName("wygrana").setDescription("Ustaw wygraną").setRequired(true))
                .addChannelOption(o => o.setName("kanał").setDescription("Ustaw kanał na którym ma być giveaway").setRequired(true))
        )
        .addSubcommand(c =>
            c.setName("edit").setDescription("edycja giveaway")
                .addStringOption(o => o.setName("id_wiadomosci").setDescription("Ustaw id wiadomosci aby edytować giveaway").setRequired(true))
                .addStringOption(o => o.setName("czas").setDescription("dodaj czas trwania giveaway").setRequired(true))
                .addIntegerOption(o => o.setName("ilosc_wygrywajacych").setDescription("zmień ilość wygranych").setRequired(true))
                .addStringOption(o => o.setName("wygrana").setDescription("zmień wygraną").setRequired(true))
        )
        .addSubcommand(c => c.setName("end").setDescription("zakończenie giveaway")
            .addStringOption(o => o.setName("id_wiadomosci").setDescription("Podaj id wiadomosci aby zakończyć giveaway").setRequired(true))
        )
        .addSubcommand(c =>
            c.setName("reroll").setDescription("Wybiera od nowa wygrane osoby/osobę giveaway").addStringOption(o => o.setName("id_wiadomosci").setDescription("Podaj id wiadomosci aby ponowic giveaway").setRequired(true))),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {options, guild} = interaction;
        const sub = options.getSubcommand();
        if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            content: "Nie masz uprawnień do tego!",
            ephemeral: true
        });


        switch (sub) {
            case "start": {
                const duration = ms(interaction.options.getString("czas") || "");
                const winnerCount = interaction.options.getInteger('ilosc_wygrywajacych');
                const prize = interaction.options.getString('wygrana');
                const contentmain = interaction.options.getString('content');
                const channel = interaction.options.getChannel('kanał');
                const showchannel = interaction.options.getChannel('channel') || interaction.channel;
                if (!duration || isNaN(duration)) {
                    return interaction.reply({
                        content: "Nieprawidłowa wartość dla czas",
                        ephemeral: true
                    });
                }
                if (!channel && !contentmain) {
                    giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        messages: {
                            giveaway: '🎉🎉 **Konkurs!** 🎉🎉',
                            giveawayEnded: '🎉🎉 **KONKURS ZAKOŃCZONY** 🎉🎉',
                            title: '{this.prize}',
                            drawing: 'Losowanie za: {timestamp}',
                            dropMessage: 'Bądź pierwszy, który zareaguje 🎉 !',
                            inviteToParticipate: 'Zareaguj z 🎉 aby wziąć udział!',
                            winMessage: 'Gratulacje, {winners}! Wygrałeś/wygrałaś **{this.prize}**!\n{this.messageURL}',
                            embedFooter: '{this.winnerCount} zwycięzca(y)',
                            noWinner: 'Konkurs anulowany, Nikt nie wziął udział co za skandal!.',
                            hostedBy: 'Organizowany przez: {this.hostedBy}',
                            winners: 'Zwycięzca(y):',
                            endedAt: 'Zakończono o'
                        },
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: client.mainColor,
               
                        }
                    }).then((data) => {
                        console.log(data)
                    });
                } else if (!channel) {
                    giveawayManager.start(interaction.channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        messages: {
                            giveaway: '🎉🎉 **Konkurs!** 🎉🎉',
                            giveawayEnded: '🎉🎉 **KONKURS ZAKOŃCZONY** 🎉🎉',
                            title: '{this.prize}',
                            drawing: 'Losowanie za: {timestamp}',
                            dropMessage: 'Bądź pierwszy, który zareaguje 🎉 !',
                            inviteToParticipate: 'Zareaguj z 🎉 aby wziąć udział!',
                            winMessage: 'Gratulacje, {winners}! Wygrałeś/wygrałaś **{this.prize}**!\n{this.messageURL}',
                            embedFooter: '{this.winnerCount} zwycięzca(y)',
                            noWinner: 'Konkurs anulowany, Nikt nie wziął udział co za skandal!.',
                            hostedBy: 'Organizowany przez: {this.hostedBy}',
                            winners: 'Zwycięzca(y):',
                            endedAt: 'Zakończono o'
                        },
                        lastChance: {
                            enabled: true,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: client.mainColor,
                
                        }
                    }).then((data) => {
                        console.log(data)
                    });
                } else if (!contentmain) {
                    giveawayManager.start(channel, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        messages: {
                            giveaway: '🎉🎉 **Konkurs!** 🎉🎉',
                            giveawayEnded: '🎉🎉 **KONKURS ZAKOŃCZONY** 🎉🎉',
                            title: '{this.prize}',
                            drawing: 'Losowanie za: {timestamp}',
                            dropMessage: 'Bądź pierwszy, który zareaguje 🎉 !',
                            inviteToParticipate: 'Zareaguj z 🎉 aby wziąć udział!',
                            winMessage: 'Gratulacje, {winners}! Wygrałeś/wygrałaś **{this.prize}**!\n{this.messageURL}',
                            embedFooter: '{this.winnerCount} zwycięzca(y)',
                            noWinner: 'Konkurs anulowany, Nikt nie wziął udział co za skandal!.',
                            hostedBy: 'Organizowany przez: {this.hostedBy}',
                            winners: 'Zwycięzca(y):',
                            endedAt: 'Zakończono o'
                        },
                        lastChance: {
                            enabled: false,
                            content: contentmain,
                            threshold: 60000000000_000,
                            embedColor: client.mainColor,
                           
                        }
                    }).then((data) => {
                        console.log(data)
                    });
                } else {
                    giveawayManager.start(interaction, {
                        prize,
                        winnerCount,
                        duration,
                        hostedBy: interaction.user,
                        messages: {
                            giveaway: '🎉🎉 **Konkurs!** 🎉🎉',
                            giveawayEnded: '🎉🎉 **KONKURS ZAKOŃCZONY** 🎉🎉',
                            title: '{this.prize}',
                            drawing: 'Losowanie za: {timestamp}',
                            dropMessage: 'Bądź pierwszy, który zareaguje 🎉 !',
                            inviteToParticipate: 'Zareaguj z 🎉 aby wziąć udział!',
                            winMessage: 'Gratulacje, {winners}! Wygrałeś/wygrałaś **{this.prize}**!\n{this.messageURL}',
                            embedFooter: '{this.winnerCount} zwycięzca(y)',
                            noWinner: 'Konkurs anulowany, Nikt nie wziął udział co za skandal!.',
                            hostedBy: 'Organizowany przez: {this.hostedBy}',
                            winners: 'Zwycięzca(y):',
                            endedAt: 'Zakończono o'
                        },
                        lastChance: {
                            enabled: true,
                            content: contentmain,
                            treshold: 60000000000_000,
                            embedColor: client.mainColor,
                       
                        }
                    }).then((data) => {
                        console.log(data)
                    });
                }
                interaction.reply({content: `Giveaway został stworzony! na kanale ${showchannel}`, ephermal: true});
            }
                break;
            case 'edit': {
                await interaction.reply({content: ` Edytowanie twojego giveawaya `, ephemeral: true});
                const newprize = interaction.options.getString('wygrana');
                const newduration = interaction.options.getString('czas');
                const newwinnerCount = interaction.options.getInteger('ilosc_wygrywajacych');
                const messageId = interaction.options.getString('id_wiadomosci');
                client.giveawayManager.edit(messageId, {
                    addTime: ms(newduration),
                    newWinnerCount: newwinnerCount,
                    newPrize: newprize,
                }).then((data) => {
                    console.log(data)
                    interaction.editReply({content: `Giveaway został edytowany!`, ephemeral: true});
                }).catch(e => {
                    interaction.editReply({content: `Wystąpił problem podczas edytowania giveaway`, ephemeral: true});
                })
            }
                break;
            case 'end': {
                const messageId = interaction.options.getString('id_wiadomosci');
                await interaction.reply({content: `Zakończanie twojego giveawaya`, ephemeral: true});
                client.giveawayManager.end(messageId).then((data) => {
                    console.log(data)
                    interaction.editReply({content: `Giveaway został zakończony!`, ephemeral: true});
                }).catch(e => {
                    console.log(e)
                    interaction.editReply({content: `Wystąpił problem podczas zakończenia giveaway`, ephemeral: true});
                })

            }
                break;
            case 'reroll' : {
                await interaction.reply({content: `Ponowianie giveaway`, ephemeral: true});
                const query = interaction.options.getString('id_wiadomosci');
                const giveaway = client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) || client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query);

                if (!giveaway) return interaction.editReply({
                    content: `Nie mogę znaleść tego giveawaya`,
                    ephemeral: true
                });
                const messaegeid2 = interaction.options.getString('id_wiadomosci');
                client.giveawayManager.reroll(messaegeid2, {
                    messages: {
                        congrat: ':tada: Nowa(e) osoba(y): {winners}! Gratulacje, wygrałeś **{this.prize}**!\n{this.messageURL}',
                        error: 'Brak osób do wzięcia udziału!',
                    }
                }).then(() => {
                    interaction.editReply({content: `Giveaway został ponowiony!`, ephemeral: true});
                }).catch(e => {
                    interaction.editReply({content: `Wystąpił problem podczas ponowienia giveaway`, ephemeral: true});
                })
            }

        }
    },
};