var Twitter = require('twitter');
var key = require("./key.json");
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/twitter');
var client = new Twitter(key);


const Schema = mongoose.Schema
 
const model_definition = new Schema({}, { strict: false });

const Tweet = mongoose.model('Tweet', model_definition);


client.get('friends/list', function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }else{
    console.log(error)
  }
});



client.stream('statuses/filter', {follow: '37034483,284920800,14293310,140798905,116112129,194443378,134758540,1697903767'},  function(stream) {
  stream.on('data', function(tweet) {
    // console.log(tweet);
    if(isReply(tweet)){
      console.log('ignoring retweet')
    }else{
      tweet.timestamp = Date.now()
      Tweet.create(tweet, function(err, res){
        if(!err)
          console.log('tweet saved')
        else
          console.log(err)
      })
      console.log(tweet)
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});


function isReply(tweet) {
  if ( tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name )
    return true
}

