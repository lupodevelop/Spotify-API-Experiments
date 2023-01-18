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

async function askForTitle() {
    while (true) {
        let songTitle = await new Promise(resolve => rl.question('Enter a song title: ', resolve));
        try {
        // search for track by title
        const tracks = await spotifyApi.searchTracks(songTitle);
        const track = tracks.body.tracks.items[0];
        // get track's title, artist and duration
        const title = track.name;
        const artist = track.artists[0].name;
        const duration = track.duration_ms / 1000;
        console.log(`Title: ${title}`);
        console.log(`Artist: ${artist}`);
        // From ms to sec.
        console.log(`Duration (seconds): ${duration}`);
        } catch (error) {
            console.error(error);
        }
        let answer = '';
        while (answer !== 'y' && answer !== 'n') {
            answer = await new Promise(resolve => rl.question('Do you want to search again? (y/n)', resolve));
            if (answer !== 'y' && answer !== 'n') {
                console.log("Invalid input. Please enter 'y' or 'n'.");
            }
        }
        if (answer === 'n') {
            rl.close();
            break;
        }
    }
}
askForTitle();