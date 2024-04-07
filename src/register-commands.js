require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest =  new REST({version: '10'}).setToken(process.env.TOKEN);

const commands = [
    {
        name : 'test',
        description : 'this is a test command',
    },
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