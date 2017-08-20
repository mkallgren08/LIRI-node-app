//===================================================================================================
//                              OMDb Access
//===================================================================================================

// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
// It's on Netflix!
var request = require("request")

function movieThis(){

    var movieName = "";

    for (var i = 3; i < process.argv.length; i++ ){
        movieName = movieName + "+" + process.argv[i]
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=61a72983";


    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

    // If the request was successful...
    if (!error && response.statusCode === 200) {

        // Then log the Release Year for the movie
        console.log("Release Year: " + JSON.parse(body).Year);
    }
    });
};

//===================================================================================================
//                              Twitter Access
//===================================================================================================

// node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window.

var Twitter = require('twitter');
var keys = require("./keys.js")


function myTweets(){
    var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = {screen_name: 'michaelatcode1'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        //console.log(JSON.stringify(tweets, null, 2));
        for (var i = 0; i < tweets.length; i++){
          var tweet = tweets[i];
          console.log("Author: " + tweet.user.name)
          console.log('"' + tweet.text + '"');
          console.log("========================================================================")
        }
    }
    });
};


//===================================================================================================
//                              Spotify Access
//===================================================================================================

// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.\

var Spotify = require('node-spotify-api');

function spotifyThis(songname){
    // var querySongName = "the+sign";
    // if (songname === undefined){
      
    //   querySongName = "the+sign"
    // }

    var spotifyRequestURL = "https://api.spotify.com/v1/search&q=the%20sign"
    var spotify = new Spotify({
    id: "95de656343084d8f8bc0ecd55c2d028f",
    secret: "24181f3eb6c2484fb892671c30d5a53e",
    });

    spotify
    .search(
      {
        type: 'track',
        query: songname,
        limit: 1,
      },
      function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      console.log(JSON.stringify(data, null, 2))
      var dataPath = data.tracks.items[0];
      var artists = "";
      if (dataPath.album.artists.length > 1){
        for (var j = 0; j < dataPath.album.artists.length; j++){
          artists = artists + dataPath.album.artists[j].name.toString() + ", ";
        }
      } else {
        artists = dataPath.album.artists[0].name.toString();
      }
     
      console.log("Artist(s): " + artists) 
      });
    // )
    // .then(function(data) {
    // console.log(data); 
    // })
    // .catch(function(err) {
    // console.error('Error occurred: ' + err); 
    // });
};


//===================================================================================================
//                              do-what-it-says Access
//===================================================================================================

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.





//===================================================================================================
//                              Functions & Variables
//===================================================================================================

var arg1 = process.argv[2];
var arg2 = process.argv[3];


// switch (new Date().getDay()) {
//   case 0:
//       day = "Sunday";
//       break;

if (arg1 === undefined){
  console.log("Error! Could not interpret command. Please check spelling and try again.\n Available commands are: \n" +  
  " 'my-tweets' - displays last 20 tweets; \n 'spotify-this' - gives basic song info; \n 'movie-this'" + 
  "- returns movie information; \n 'do-what-it-says' - a surprise!")
} else if (arg1 !== undefined){
  arg1 = arg1.toLowerCase();
  switch  (arg1){
    case "my-tweets":
      myTweets();
      break;

    case "spotify-this":
      spotifyThis(arg2);
      break;

    case "movie-this":

      break;
  
    default:
      console.log("Whoops, something went wrong! Please try again.")
      break;
  }
}

