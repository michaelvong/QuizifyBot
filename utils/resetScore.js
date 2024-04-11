const { Client , Message } = require('discord.js');
const Score = require('../models/Score');

const resetScore = async (guildId) => {
    const query = {
        guildId : guildId.toString(),
    }
    const players = await Score.updateMany(query, {$set: { score : 0}});
}

module.exports = { resetScore };