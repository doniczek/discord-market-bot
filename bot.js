const {Client, Collection, GatewayIntentBits, Partials, EmbedBuilder} = require("discord.js");
const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildVoiceStates,
    DirectMessages,
    GuildPresences,
    GuildMessageReactions,
    GuildEmojisAndStickers,
    GuildWebhooks,
    GuildIntegrations,
    MessageContent
} = GatewayIntentBits;
const {User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction} = Partials;
const { Manager } = require("real-giveaways");
const client = new Client({
    intents: [Guilds, GuildMembers, GuildPresences, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent],
    partials: [User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction]
});


client.config = require('./config.json')
const {botMainColor} = require('./config.json')
module.exports = client;


client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

const {loadEvents} = require('./Handlers/EventHandler')
const {loadCommands} = require('./Handlers/CommandHandler')
const {loadComponents} = require('./Handlers/ComponentsHandler')


client.mainColor = parseInt(botMainColor);

const giveawayManager = new Manager(client, {
    embedColor: botMainColor,
    pingEveryone: false,
    emoji: "🤔",
});

module.exports = giveawayManager;


client.login(client.config.token).then(() => {
    giveawayManager.connect(client.config.database);
    loadEvents(client);
    loadCommands(client);
    loadComponents(client);
})
