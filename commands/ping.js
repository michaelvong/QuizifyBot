const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder().setName('pingtest2').setDescription('Ping test using DJS commander'),
    run: ({ interaction }) => {
        interaction.reply('Pong');
    },
};