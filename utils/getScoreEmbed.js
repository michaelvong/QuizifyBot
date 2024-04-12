const Score = require('../models/Score');
const { EmbedBuilder } = require('discord.js')
//returns the top 5 scores from the guild
const getScoreEmbed = async (guildId, client) => {
    const query = {
        guildId: guildId.toString(),
        score : { $gt : 0 }
    }

    const score_objs = await Score.find(query).sort({ score : -1}).limit(5); //sorts the score by descending order
    let users = [];

    for(let i = 0; i < score_objs.length; i++) {
        const user = await client.users.fetch(`${score_objs[i].userId}`);
        if(user){

            users.push(`${i+1}. ${user.username} (${score_objs[i].score} points)`);
        }
    }
    scoreEmbed = new EmbedBuilder().setTitle('Scoreboard')
    .addFields({name : 'Top 5', value : users.join('\n'), inline : true }); //users.join creates a join string separated by \n
    return scoreEmbed;
}

module.exports = { getScoreEmbed };