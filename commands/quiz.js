const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
require('dotenv').config();

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
    run: ({ interaction }) => {
        let accessToken = "";
        //interaction.reply('Pong');
        const link = interaction.options.get('playlist-link').value; //stores user input into link
        //console.log(link);
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

        /* original working with 100 songs
        getToken().then(response => {
            getPlaylistInfo(response.access_token).then(resp => {

                //console.log(resp.items);
                
                let array_songs = []; //each element is a string that has song title + all artists
                let playlist_size = resp.items.length;
                console.log(playlist_size)
                for(let i = 0; i < playlist_size; i++){
                    let artist_names = "";
                    let artist_size = resp.items[i].track.artists.length;
                    for(let j = 0; j < artist_size; j++){
                        artist_names += resp.items[i].track.artists[j].name + " ";
                    }
                    array_songs[i] = resp.items[i].track.name + " " + artist_names;
                }
                //console.log(array_songs);
            });
            
        });*/
        
        function populateSongs(accessToken){

        }
        //if a playlist > 100 songs then next !null
        //if next ! null we need to loop get rest of songs and store them into song array
        //maybe its better to start backwards from the end of playlist so we have a definite number
        //maybe theres a way to execute all api calls at once and wait for promise all? if we need 6 iterations, we can call all 6 at once 
        getToken().then(response => {
            let accessToken = response.access_token;
            getPlaylistInfo(accessToken).then(resp => {
                let array_songs = [];
                //console.log(resp.total);
                const total_songs = resp.total; //total number of songs in playlist
                const iterations = Math.ceil(total_songs/100); //this will be the number of iterations needed to get all songs

                let promises = []; //holds the amount of api calls we need to execute to gather all songs from a playlist
                for (let i = 0; i < iterations; i++){
                    promises.push(getRestOfSongs(accessToken, i*100));
                }

                //playlist_objs is the obj returned from spotify api call 
                //playlist_objs is an array of objs
                Promise.all(promises).then(playlist_objs => {
                    //console.log(r)
                    for(let k = 0; k < playlist_objs.length; k++) {
                        let iteration_size = playlist_objs[k].items.length; //holds the number of songs for the k iteration (1-100)
                        //console.log(k, playlist_objs[k].items)
                        for(let p = 0; p < iteration_size; p++){
                            let artist_names = "";
                            let artist_size = playlist_objs[k].items[p].track.artists.length;
                            //console.log(artist_size);
                            for(let m = 0; m < artist_size; m++){
                                artist_names += playlist_objs[k].items[p].track.artists[m].name + " ";
                                //console.log(artist_names);
                            }
                            array_songs.push(playlist_objs[k].items[p].track.name + "-" + artist_names);
                        }
                    }
                    console.log(array_songs);
                });
                
            });
            
        });
 

    },
};