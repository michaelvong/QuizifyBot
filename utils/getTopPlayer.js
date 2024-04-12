const { Client , Message } = require('discord.js');
const Score = require('../models/Score');

const getTopPlayer = async (guildId) => {
    const query = {
        guildId : guildId.toString(),
    }
    const top_player = await Score.findOne(query).sort({score:-1}); //sorts the orders in descending order
    return top_player;
}

module.exports = { getTopPlayer };