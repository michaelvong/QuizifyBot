const { Client , Message } = require('discord.js');
const Score = require('../models/Score');

/**
 * @param {Client} client
 * @param {Message} message
 * 
 */

//had an error where in the params i had client, message which would reverse the objects in the variables
//maybe its the way the DJS commander was written?

//lets pass sol string and game on to this since this is ran everyttime a msg appears
//only give point if message = solution?

const givePoint =  async (message, client) => {
  
    //return if message isnt from server or if msg is from bot
    if(!message.inGuild() || message.author.bot){
        return false;
    }

    const query = {
        userId : message.author.id,
        guildId : message.guild.id,
    }

    try {
        const player_score = await Score.findOne(query);

        if(player_score){
            player_score.score += 1;
            //console.log(player_score);
            await player_score.save().catch((e) => {
                console.log(`Error adding score: ${e}`);
            })
        }
        else {
            const newScore = new Score({
                userId : message.author.id,
                guildId : message.guild.id,
                score : 1,
            })
            await newScore.save();
        }
        
        
    } catch (e){
        console.log(`Error in give user point ${e}`)
    }
    return true;
};

module.exports = { givePoint };