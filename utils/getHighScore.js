const { Client , Message } = require('discord.js');
const Score = require('../models/Score');

const getHighScore = async () => {
    const top_player = await Score.findOne().sort({score:-1});
    return top_player.score;
}

module.exports = { getHighScore };