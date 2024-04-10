const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const { QueryType, useMainPlayer , useQueue} = require('discord-player');
require('dotenv').config();
const mongoose = require('mongoose');
const { givePoint } = require('../utils/givePoint');
const { getHighScore } = require('../utils/getHighScore');
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
    
    data: new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Starts a quiz game using a given spotify playlist link'),
    options: [
        {
            name : 'playlist-link',
            description : 'link to the spotify playlist',
            type : ApplicationCommandOptionType.String,
            required : true,
        }
    ],
    run: async ({ client, interaction }) => {
        
        const link = interaction.options.get('playlist-link').value; //stores user input into link
        const startEmbed = new EmbedBuilder().setTitle('Starting game!')
        interaction.reply({embeds: [startEmbed]});
        
        //example playlist link : https://open.spotify.com/playlist/04ETACGQVjIH92ITiwC596?si=64ce9ea3ce834156
        //we need the part that is after playlist/ and before ? (04ETACGQVjIH92ITiwC596)
        
        let playlist_id = link.split('playlist/')[1];
        playlist_id = playlist_id.split('?')[0];
        //console.log(temp);

        //gets access token from spotify api using client credential auth flow
        async function getToken() {
            const response = await fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              body: new URLSearchParams({
                'grant_type': 'client_credentials',
              }),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
              },
            });
          
            return await response.json();
        }

        //gets playlist info from user input
        async function getPlaylistInfo(access_token) {
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            })
        
            return await response.json();
        };
        

        //function to get rest of songs if the playlist > 100 songs
        //did not know how to add the limit and offset as params/options so i hard coded into the api call
        async function getRestOfSongs(access_token, currOffset){
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=100&offset=${currOffset}`, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + access_token },
            })

            return await response.json();
        }

    

        
        //receives an array and shuffles the elements using Fisher Yates algorithm
        function shuffleSongs(song_array){
            for (let i = song_array.length-1; i > 0; i--){
                let random_index = Math.floor(Math.random() * (i+1));
                [song_array[i], song_array[random_index]] = [song_array[random_index], song_array[i]];
            }
            return song_array;
        }

        //if a playlist > 100 songs then next !null
        //if next ! null we need to loop get rest of songs and store them into song array
        //maybe its better to start backwards from the end of playlist so we have a definite number
        //maybe theres a way to execute all api calls at once and wait for promise all? if we need 6 iterations, we can call all 6 at once 

        //use await over then? maybe thatll allow loop

        const accessToken_obj = await getToken(); //returns json obj with access token
        const accessToken = accessToken_obj.access_token; 
        const playlist_info = await getPlaylistInfo(accessToken) 

        //console.log(accessToken.access_token);
        //console.log(playlist_info);

        let array_songs = [];

        const total_songs = playlist_info.total;
        const iterations = Math.ceil(total_songs/100);

        let promises = []; //holds the amount of api calls we need to execute to gather all songs from a playlist
        for (let i = 0; i < iterations; i++){
            promises.push(getRestOfSongs(accessToken, i*100));
        }

        const playlist_objs = await Promise.all(promises);

        for(let k = 0; k < playlist_objs.length; k++) {
            let iteration_size = playlist_objs[k].items.length; //holds the number of songs for the k iteration (1-100)
            for(let p = 0; p < iteration_size; p++){
                let artist_names = "";
                let artist_size = playlist_objs[k].items[p].track.artists.length;
                for(let m = 0; m < artist_size; m++){
                    artist_names += playlist_objs[k].items[p].track.artists[m].name + ", ";
                }
                array_songs.push(playlist_objs[k].items[p].track.name + "--" + artist_names);
            }
        }
        const shuffled_songs_array = shuffleSongs(array_songs);
        //console.log(shuffled_songs_array) 

        const player = useMainPlayer();
        const voice_channel = interaction.member.voice.channel;
        
        let game_active = true; //game active flag
        let current_index = 0; //index of song
        

        while(game_active){
            let query = shuffled_songs_array[current_index];
            let song_info = ""; //holds the track info returned from the player
            let song_title = query.split('--')[0]; //sets song answer to just the title without the artists
            let song_title_filtered = song_title.split('(')[0]; //removes the (feat. ) from titles if exists
            console.log(song_title_filtered);

            try {
                if(useQueue(interaction.guildId)){
                    let temp = useQueue(interaction.guildId);
                    await temp.node.skip();
                }
                const { track } = await player.play(voice_channel, query, {
                    nodeOptions: {
                        // nodeOptions are the options for guild node (aka your queue in simple word)
                        metadata: interaction // we can access this metadata object using queue.metadata later on
                        
                    },
                });
                
                song_info = '"' + track.title + '"' + ' by ' + track.author;
                //return interaction.channel.send("Playing song...");
            } catch (e) {
                // let's return error if something failed
                return interaction.followUp(`Something went wrong: ${e}`);
            }
            
            let answered_flag = false; //flag to check if correct song has been typed

            const fil = msg => {
                return msg.content.toUpperCase().trim() === song_title_filtered.toUpperCase().trim()
            }
            
            let collected_answer = await interaction.channel.awaitMessages ({ filter : fil, max : 1});
            let msg_info = collected_answer.first();
            await givePoint(msg_info, client, true);
            answered_flag = true;
            const queue = useQueue(interaction.guildId);
            //queue.node.skip();
            queue.node.setPaused(!queue.node.isPaused()); //pauses the queue
            collected_answer.first().reply('Correct! The song was : ' + song_info);
            //let current_high_score = await getHighScore();
            //console.log(await getHighScore()); //gives correct updated high score
            let current_high_score = await getHighScore();
            if (current_high_score >= 3){
                game_active = false;
            } 
            current_index += 1;
        }
    },
};