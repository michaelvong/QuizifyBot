//returns an array of strings, where each element is the song title and artists
//the playlist_objs param is the array of playlist objects returned from the concurrent spotify api call to fetch playlist details
const getSongArray = (playlist_objs) => {
    const array_songs = [];
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
    return array_songs;
};

module.exports = { getSongArray };