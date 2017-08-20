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
var fs = require("fs")

function movieThis(){
  //console.log("user input: " + arg2);
  var movieName = ""
    if (arg2 === ""){
      movieName = "Mr.+Nobody"
    } else {
      var arg2Array = arg2.split(" ")
      arg2Array.splice(0, 1)
      //console.log(arg2Array)
      movieName = arg2Array[0];
      if (arg2Array.length > 1){
        for (var m = 1; m < arg2Array.length; m++ ){
            movieName = movieName + "+" + arg2Array[m]
        }
      };
      movieName = '"' + movieName.toString() + '"';
      //console.log("Movie Name: " + movieName);
    }
    
    //movieName = "Star+Trek";

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";


    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function(error, response, body) {
        if (error) {
          return console.log('Error occurred: ' + error);
        } 
        //console.log(JSON.parse(body, null, 2))
        var film = JSON.parse(body)
        if (film.Title === undefined){
          var output = "\n==================================================================" +
          "\nAn error occured! Please check the spelling of the film's title." +
          "\n==================================================================";
          console.log(output)
          fs.appendFile('log.txt', output, function(err, data){})
        } else{
            var output = "\n==================================================================" +
            "\nTitle: " + film.Title+ "\nDirector: " + film.Director + "\nGenre(s): " + film.Genre +
            "\nRelease Year: " + film.Year+ "\nIMDb rating: " + film.Ratings[0].Value + 
            "\nRotten Tomatoes Rating: " + film.Ratings[1].Value + 
            "\nCountr(y/ies) of Production: " + film.Country + 
            "\nOriginal Language(s): " + film.Language + "\nPlot: " + film.Plot + 
            "\nCast (top billed): " + film.Actors + 
            "\n==================================================================";
            console.log(output)
            fs.appendFile('log.txt', output, function(err, data){})            
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
        console.log(JSON.stringify(tweets, null, 2));
        for (var i = 0; i < tweets.length; i++){
          var tweet = tweets[i];
          var output = "\n========================================================================"+
          "\nAuthor: " + tweet.user.name +
          "\nPublished on/at: " + tweet.created_at +
          '\n"' + tweet.text + '"'+ "\n========================================================================"
          console.log(output)
          fs.appendFile('log.txt', output, function(err, data){})
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
      //console.log(JSON.stringify(data, null, 2))
      var dataPath = data.tracks.items[0];
      var artists = "";
      if (dataPath.album.artists.length > 1){
        for (var j = 0; j < dataPath.album.artists.length; j++){
          artists = artists + dataPath.album.artists[j].name.toString() + ", ";
        };
      } else {
        artists = dataPath.album.artists[0].name.toString();
      };
      var output = "\n=================================================================="+ 
      "\nArtist(s): " + artists +
      "\nTrack Name: " + dataPath.name+ 
      "\nPreview Link: " + dataPath.external_urls.spotify+ 
      "\nAlbum: " + dataPath.album.name+ 
      "\n==================================================================";

      console.log(output)
      fs.appendFile('log.txt', output, function(err, data){})

      });
};


//===================================================================================================
//                              do-what-it-says Access
//===================================================================================================

// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.

function doWhatItSays(){
      var fs = require("fs")
      var readline = require("readline");

      var myInterface = readline.createInterface({
        input: fs.createReadStream('random.txt')
      });

      var lineNo = 0;
      var dataArr = [];
      
      myInterface.on('line', function(line){
        lineNo++;
        //console.log("Line number " + lineNo +":" + line)
        var propArr = line.split(",");
        //console.log(propArr);
        dataArr.push(propArr);
        //console.log(dataArr);
      })

      function randomizer(){
        var randIndex = Math.floor(Math.random()*dataArr.length)
        //console.log(randIndex);
        //console.log(dataArr[randIndex])

        arg1 = dataArr[randIndex][0]
        //console.log(arg1)
        if (dataArr[randIndex].length > 1){
          arg2 = dataArr[randIndex][1]
          //console.log(arg2)
        
        }
        runLIRI();
      }    
      
      setTimeout(randomizer, 500)

    }


//===================================================================================================
//                              Functions & Variables
//===================================================================================================

var arg1 = process.argv[2];
var arg2 = "";

for (var k = 3; k < process.argv.length; k++ ){
  arg2 = arg2 + " " + process.argv[k];
}

var args = "\n Entered command(s): " + arg1 + ", " + arg2

fs.appendFile('log.txt', args, function(err, data){})

function runLIRI(){

  if (arg1 === undefined){
    var output = "\nError! Could not interpret command. Please check spelling and try again.\n Available commands are: \n" +  
    " 'my-tweets' - displays last 20 tweets; \n 'spotify-this' - gives basic song info; \n 'movie-this'" + 
    "- returns movie information; \n 'do-what-it-says' - a surprise!"
    console.log(output)
    fs.appendFile('log.txt', output, function(err, data){})
  } else if (arg1 !== undefined){
    arg1 = arg1.toLowerCase();
    switch  (arg1){
      case "my-tweets":
        myTweets();
        break;

      case "spotify-this":
        // console.log(arg2)
        arg2 = "'" + arg2 + "'"
        if (arg2 === "''"){
          arg2 = "The Sign Ace of Base"
          // console.log(arg2)
        }
        spotifyThis(arg2);
        break;

      case "movie-this":
        console.log(arg2)
        movieThis();
        break;

      case "do-what-it-says":
        doWhatItSays();
        break;
    
      default:
        var output = "\nWhoops, something went wrong! Check the spelling of your command and please try again." + 
        "Valid commands are \n'my-tweets', \n'spotify-this' <song name here>, \n'movie-this' <movie name here>, " +
        "\n'do-what-it-says'"
        console.log(output)
        fs.appendFile('log.txt', output, function(err, data){})
        break;
    }
  }

};

runLIRI();