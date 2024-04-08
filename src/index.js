require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const path = require('path');

const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

new CommandHandler({
    client, // this simplifies writing "client : client" since they have same name
    commandsPath : path.join(__dirname, '..', 'commands'),
    testServer : '1226291241906343936'
})
const exampleEmbed = new EmbedBuilder().setTitle('ExampleEmbed')
.setDescription('Example');

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
    /*if(interaction.commandName === 'quiz') {
        const link = interaction.options.get('playlist-link').value; //stores user input into link
        //interaction.reply(link.value);
        
        const startEmbed = new EmbedBuilder().setTitle('Starting game!')
        interaction.reply({embeds: [startEmbed]});
    }*/
});

  //https://open.spotify.com/playlist/04ETACGQVjIH92ITiwC596?si=6ac7a49f42d54e81

client.login(
    process.env.TOKEN
);