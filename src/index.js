require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js')

const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is ready`);
})

client.on('messageCreate', (message) => {
    //console.log(message.content);
});

client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) { return; }


    if(interaction.commandName === 'test') {
        interaction.reply('the test command is working!');
    }
    if(interaction.commandName === 'ping') {
        interaction.reply('pong!');
    }
    if(interaction.commandName === 'quiz') {
        const link = interaction.options.get('playlist-link')
        interaction.reply(link.value);
    }
});

client.login(
    process.env.TOKEN
);