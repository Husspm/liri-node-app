//required packages
var request = require("request");
var music = require("spotify");
var Twitter = require("twitter");
var keys = require("./keys.js");

//contols the switch to run the various functions
var commandSelect = process.argv[2];
//creates a string for search purposes if more that 3 arguments are passed
var seachWords;
for (var index = 3; index < process.argv.length; index++) {
    if (index === 3) {
        searchWords = process.argv[index] + "+";
    } else {
        searchWords = searchWords + process.argv[index] + "+";
    }
}
//runs whatever commmand the user selected via argv[2]
switch (commandSelect) {
    case "spotify-this":
        if (process.argv[3]) {
            search = searchWords;
        } else {
            search = "Right Brigade";
        }
        findMusic(search);
        break;
    case "movie-this":
        if (process.argv[3]) {
            search = searchWords;
        } else {
            search = "Chinatown";
        }
        findMovies(search);
        break;
    case "my-tweets":
        findTweets();
        break;
}

function findMusic(keyWord) {
    console.log("LIRI : Let me see if I can find that song for you");
    music.search({ type: 'track', query: keyWord }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("LIRI : Found it, here is all the info and I even found a link for you");
        console.log("Song : ", data.tracks.items[0].name);
        console.log("Album : ", data.tracks.items[0].album.name);
        console.log("Artist : ", data.tracks.items[0].album.artists[0].name);
        console.log("Find it here : ", data.tracks.items[0].album.external_urls.spotify);
    });
}

function findMovies(keyWord) {
    console.log("LIRI : Okay, I'll search for that movie for you");
    request("http://www.omdbapi.com/?t=" + keyWord + "&y=&plot=short&r=json", function(error, response, body) {
        if (error) {
            console.log('error:', error);
        } else {
            console.log("LIRI : All done! Here's what I found for you");
            console.log("Movie : ", JSON.parse(body).Title);
            console.log("Rated : ", JSON.parse(body).Rated);
            console.log("Released : ", JSON.parse(body).Released);
            console.log("Director : ", JSON.parse(body).Director);
            console.log("Plot : ", JSON.parse(body).Plot);
        }
    });
}

function findTweets() {
    console.log("LIRI : Okay, I'll find your latest tweets for you, give me one second");
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = { screen_name: 'RobotsFeelPain' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        console.log("LIRI : Done, here is what I could find!");
        for (var index = 0; index < tweets.length; index++) {
            console.log(tweets[index].text);
        }
    });
}