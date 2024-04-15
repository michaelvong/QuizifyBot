require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');
const { Player } = require('discord-player');
const mongoose = require('mongoose');

const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ]
});

const player = new Player(client);
player.extractors.loadDefault(); //important line for player to work

new CommandHandler({
    client, // this simplifies writing "client : client" since they have same name
    commandsPath : path.join(__dirname, '..', 'commands'),
    eventsPath : path.join(__dirname, '..', 'events'),
    //testServer : '1226291241906343936'
})


(async () => {
    try {
        await mongoose.connect(process.env.mongoURL);
        console.log('conncted to db');
        client.login(
            process.env.TOKEN
        );
    } catch (error) {
        console.log(error);
    }
})();


player.events.on('playerError', (event) => {
    console.log('PLAYER ERROR', event);
})

player.events.on('error', (event) => {
    console.log('ERROR', event);
})


player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor' && ext !== 'SpotifyExtractor');