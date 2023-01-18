require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const readline = require('readline');

// Get client ID and secret from .env
// .env file
// SPOTIFY_CLIENT_ID=key
// SPOTIFY_CLIENT_SECRET=key
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
});

// Retrieve an access token from spotify
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        // ONLY FOR DEBUG
        // console.log('Access token:', data.body['access_token']);
    }, err => {
        console.log('Something went wrong when retrieving an access token', err.message);
    });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a song title: ', async function(songTitle) {
    try {
        // Search for track by title
        const tracks = await spotifyApi.searchTracks(songTitle);
        const track = tracks.body.tracks.items[0];
        // Get track's title, artist and duration in ms
        const title = track.name;
        const artist = track.artists[0].name;
        // From ms to sec.
        const duration = track.duration_ms / 1000;
        console.log(`Title: ${title}`);
        console.log(`Artist: ${artist}`);
        console.log(`Duration (seconds): ${duration}`);
        rl.close();
    } catch (error) {
        console.error(error);
    }
});