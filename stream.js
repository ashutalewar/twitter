var Twitter = require('twitter');
var key = require("./key.json");

var client = new Twitter(key);


/*

client.get('friends/list', function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }else{
    console.log(error)
  }
});

*/

client.stream('statuses/filter', {follow: '37034483'},  function(stream) {
  stream.on('data', function(tweet) {
    // console.log(tweet);
    if(isReply(tweet)){
      console.log('ignoring retweet')
    }else{
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

