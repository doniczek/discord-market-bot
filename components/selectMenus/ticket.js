const {
    StringSelectMenuInteraction, EmbedBuilder, embedLength, ButtonBuilder, ButtonStyle,
    ChannelType,
    PermissionFlagsBits, ActionRowBuilder
} = require('discord.js')
const fs = require("fs");
const config = require("../../ticketConfig.json")
const Client = require("../../bot.js")
const logsmodels = require("../../models/logsmodels");

module.exports = {
    data: {
        name: 'ticket'
    },
    /**
     * @param { StringSelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const {member, guild} = interaction;
        const selection = interaction.values[0];
        const embed = new EmbedBuilder()
            .setTitle("Ticket")
            .addFields(
                {value: `<@${member.user.id}> (${member.user.id})`, name: `użytkownik`, inline: true},
                {value: `<t:${parseInt(interaction.createdTimestamp / 1000, 10)}>`, name: `data`, inline: true}
            )
            .setColor(client.mainColor)
        const confirm = new ButtonBuilder()
            .setCustomId('delticket')
            .setLabel('Usuń ticket')
            .setStyle(ButtonStyle.Danger);
        const logsDb = await logsmodels.findOne({guildId: interaction.guildId});
        const row = new ActionRowBuilder()
            .addComponents(confirm);
        switch (selection) {

            case "1": {
                embed.setDescription("Zamówienie grafika")
                const ticketChannels = guild.channels.cache.filter(channel =>
                    channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
                );
                let ticketNumber = ticketChannels.size + 1;
                const channelName = `ticket_${ticketNumber}`;
                interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: config.grafikaTicketId,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {
                    interaction.reply({ content: `Stworzono ticket na kanale <#${channel.id}>`, ephemeral: true });
                    channel.send({content: `<@&${config.adminranga}>, <@${interaction.user.id}>`, embeds: [embed], components: [row]});
                });
                
                if (logsDb) {

                    const kanal = logsDb.channelId;
                    if (logsDb.ticketLogs === true) {
                        if (kanal) {
                            const channel = guild.channels.cache.get(kanal);
                            const logsEmbed = new EmbedBuilder()
                                .setColor(client.mainColor)
                                .setTitle("Logi")
                                .setDescription(`${interaction.user.username}(${interaction.user.id}) - stworzył ticket.`)
                            channel.send({embeds: [logsEmbed]});
                        }
                    }

                }
            }
                break;
            case "2": {
                embed.setDescription("Zamówienie montaż")
                const ticketChannels = guild.channels.cache.filter(channel =>
                    channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
                );
                let ticketNumber = ticketChannels.size + 1;
                const channelName = `ticket_${ticketNumber}`;
                interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: config.montazTicketId,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {

                    interaction.reply({ content: `Stworzono ticket na kanale <#${channel.id}>`, ephemeral: true });
                    channel.send({content: `<@&${config.adminranga}> , <@${interaction.user.id}>`, embeds: [embed], components: [row]});
                });
                const logsDb = logsmodels.findOne({guildId: interaction.guildId});

                if (logsDb) {
                    const kanal = logsDb.channelId;
                    if (logsDb.ticketLogs === true) {
                        if (kanal) {
                            const channel = guild.channels.cache.get(kanal);
                            const logsEmbed = new EmbedBuilder()
                                .setColor(client.mainColor)
                                .setTitle("Logi")
                                .setDescription(`${interaction.user.username} (${interaction.user.id}) - stworzył ticket.`)
                            channel.send({embeds: [logsEmbed]});
                        }
                    }
                }
            }
                break;
            case "3": {
                embed.setDescription("Pomoc")
                const ticketChannels = guild.channels.cache.filter(channel =>
                    channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
                );
                let ticketNumber = ticketChannels.size + 1;
                const channelName = `ticket_${ticketNumber}`;
                interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: config.pomocTicketId,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {

                    interaction.reply({ content: `Stworzono ticket na kanale <#${channel.id}>`, ephemeral: true });
                    channel.send({content: `<@&${config.adminranga}>, <@${interaction.user.id}>`, embeds: [embed], components: [row]});
                });
                if (logsDb) {
                    const kanal = logsDb.channelId;
                    if (logsDb.ticketLogs === true) {
                        if (kanal) {
                            const channel = guild.channels.cache.get(kanal);
                            const logsEmbed = new EmbedBuilder()
                                .setColor(client.mainColor)
                                .setTitle("Logi")
                                .setDescription(`${interaction.user.username} (${interaction.user.id}) - stworzył ticket.`)
                            channel.send({embeds: [logsEmbed]});
                        }
                    }
                }
            }
                break;

            case "4": {
                embed.setDescription("Współpraca")
                const ticketChannels = guild.channels.cache.filter(channel =>
                    channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
                );
                let ticketNumber = ticketChannels.size + 1;
                const channelName = `ticket_${ticketNumber}`;
                interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: config.collabTicketId,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {

                    interaction.reply({ content: `Stworzono ticket na kanale <#${channel.id}>`, ephemeral: true });
                    channel.send({content: `<@&${config.adminranga}>, <@${interaction.user.id}>`, embeds: [embed], components: [row]});
                });
                if (logsDb) {
                    const kanal = logsDb.channelId;
                    if (logsDb.ticketLogs === true) {
                        if (kanal) {
                            const channel = guild.channels.cache.get(kanal);
                            const logsEmbed = new EmbedBuilder()
                                .setColor(client.mainColor)
                                .setTitle("Logi")
                                .setDescription(`${interaction.user.username} (${interaction.user.id}) - stworzył ticket.`)
                            
                            channel.send({embeds: [logsEmbed]});
                        }
                    }
                }
            }
                break;

            case "5": {
                embed.setDescription("Partnerstwo")
                const ticketChannels = guild.channels.cache.filter(channel =>
                    channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
                );
                let ticketNumber = ticketChannels.size + 1;
                const channelName = `ticket_${ticketNumber}`;
                interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: config.partnerstwoTicketId,
                    permissionOverwrites: [
                        {
                            id: member.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                    ],
                }).then(channel => {

                    interaction.reply({ content: `Stworzono ticket na kanale <#${channel.id}>`, ephemeral: true });
                    channel.send({content: `<@&${config.adminranga}>, <@${interaction.user.id}>`, embeds: [embed], components: [row]});
                });
                if (logsDb) {
                    const kanal = logsDb.channelId;
                    if (logsDb.ticketLogs === true) {
                        if (kanal) {
                            const channel = guild.channels.cache.get(kanal);
                            const logsEmbed = new EmbedBuilder()
                                .setColor(client.mainColor)
                                .setTitle("Logi")
                                .setDescription(`${interaction.user.username} (${interaction.user.id}) - stworzył ticket.`)
                            channel.send({embeds: [logsEmbed]});
                        }
                    }
                }
            }
                break;
        }
    }
}