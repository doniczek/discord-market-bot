const {Client} = require("discord.js");
const {status, database} = require("../../config.json");
const mongoose = require('mongoose');
const chalk = require('chalk');


module.exports = {
    name: "ready",
    rest: false,
    once: false,
    /**
     * @param {Client} client
     */
    async execute(client) {

        if (!database) return;
        mongoose
            .connect(database)
            .then(() => console.log(chalk.green("db connected")))
            .catch((err) => console.error(err));
        client.user.setActivity(status)


    },
};

