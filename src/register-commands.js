require('dotenv').config();

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const rest =  new REST({version: '10'}).setToken(process.env.TOKEN);

const commands = [
    {
        name : 'test',
        description : 'this is a test command',
    },
    {
        name : 'ping',
        description : 'pong',
    },
    {
        name : 'quiz',
        description : 'start a spotify quiz',
        options: [
            {
                name : 'playlist-link',
                description : 'link to the spotify playlist',
                type : ApplicationCommandOptionType.String,
                required : true,
            }
        ]
    }
];

(async () => {
    try {
        console.log('Registering slash commands');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body : commands }
        )

        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }

})();