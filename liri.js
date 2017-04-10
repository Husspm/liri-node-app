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
        searchWords = process.argv[index].toLowerCase() + "+";
    } else {
        searchWords = searchWords + process.argv[index].toLowerCase() + "+";
    }
}
//runs whatever commmand the user selected via argv[2]
switch (commandSelect) {
    case "spotify-this":
        if (process.argv[3]) {
            search = searchWords;
        } else {
            search = "right+brigade+";
        }
        findMusic(search);
        break;
    case "movie-this":
        if (process.argv[3]) {
            search = searchWords;
        } else {
            search = "chinatown+";
        }
        findMovies(search);
        break;
    case "my-tweets":
        findTweets();
        break;
}

function findMusic(keyWord) {
    if (keyWord === "right+brigade+") {
        console.log("LIRI : Ummm....okay...I don't want to tell you what to do, but Bad Brains...again...");
    } else {
        console.log("LIRI : Oh good, you figured out there is more than one song in existence. Be right back!");
    }
    music.search({ type: 'track', query: keyWord }, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("LIRI : Found it, here is all the info on " + data.tracks.items[0].name + " and I even found a link for you");
        console.log("Song : ", data.tracks.items[0].name);
        console.log("Album : ", data.tracks.items[0].album.name);
        console.log("Artist : ", data.tracks.items[0].album.artists[0].name);
        console.log("Find it here : ", data.tracks.items[0].album.external_urls.spotify);
    });
}

function findMovies(keyWord) {
    if (keyWord === "chinatown+") {
        console.log("LIRI : Wow...again with the Chinatown...you know other movies exist right?");
    } else
        console.log("LIRI : Finally deciding to branch out some huh, cool I'll go find that for you");
    request("http://www.omdbapi.com/?t=" + keyWord + "&y=&plot=short&r=json", function(error, response, body) {
        if (error) {
            console.log('error:', error);
        } else if (!error && response.statusCode === 200) {
            console.log("LIRI : All done! Here's what I found about " + JSON.parse(body).Title);
            console.log("Movie : ", JSON.parse(body).Title);
            console.log("Rated : ", JSON.parse(body).Rated);
            console.log("Released : ", JSON.parse(body).Released);
            console.log("Director : ", JSON.parse(body).Director);
            console.log("Plot : ", JSON.parse(body).Plot);
        }
    });
}

function findTweets() {
    console.log("LIRI : Vain much?!? Okay fine, I guess I'll find your latest tweets for you, give me one second");
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = { screen_name: 'RobotsFeelPain' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        console.log("LIRI : Done, here is what you have been tweeting @" + params.screen_name);
        for (var index = 0; index < tweets.length; index++) {
            console.log(tweets[index].text);
        }
    });
}