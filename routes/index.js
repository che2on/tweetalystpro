/*
 * GET home page.
 */

var CONSUMER_KEY = "sEORAkR5366d5o9wTfMtmQ";
var CONSUMER_SECRET = "xwlDEXXpim7yEK69KtRo0C4zh5TR3sQCjBOaCEfwpcQ";

var twitter = require('ntwitter');
var io = require('socket.io').listen(3001, {log: false});
exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
    if (req.session.oauth) {
        var twit = new twitter({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });


        twit
            .verifyCredentials(function (err, data) {
                console.log(err, data);
            });
            
        


        // twit.stream(
        //     'statuses/filter',
        //     {track: ['amor', 'odio', 'love', 'hate']},
        //     function (stream) {
        //         stream.on('data', function (data) {
        //             //console.log(data);
        //             //console.log(data.user.screen_name + " : " + data.text);
        //             io.sockets.emit('newTwitt', data);
        //             // throw  new Exception('end');
        //         });
        //     }
        // );

        
            twit.stream('user',{}, 
            function (stream) {
                stream.on('data', function (data) {
                    //console.log(data);
                    //console.log(data.user.screen_name + " : " + data.text);
                    io.sockets.emit('newTwitt', data);
                    // throw  new Exception('end');
                });
            }
            );
    }
};


exports.dashboard = function ( req, res) {
    res.render('dashboard' , {});
    if (req.session.oauth) {
        var twit = new twitter({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });


        // twit.stream(
        //     'statuses/filter',
        //     {track: ['vodafoneIN', 'vodafone india', 'vodafone karnataka', 'vodafone', ]},
        //     function (stream)
        //      {
        //         console.log("stream is"+stream);

        //         stream.on('data', function (data) {
        //             //console.log(data);
        //             //console.log(data.user.screen_name + " : " + data.text);
        //             io.sockets.emit('newTwitt', data);
        //             // throw  new Exception('end');
        //         });
        //     }
        // );

        
        twit.stream('user',{}, 
            function (stream) {
                stream.on('data', function (data) {
                    console.log(data);
                    //console.log(data.user.screen_name + " : " + data.text);
                    io.sockets.emit('newTwitt', data);
                    // throw  new Exception('end');
                });
            }
            );
    }

}


exports.realtime = function ( req, res) {
    res.render('realtime' , {});
     if(req.session.oauth)
     {
            var twit = new twitter({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
     });


     twit.stream('user', {},
         function(stream) {
            stream.on('data', function(data) {
                console.log(data);

                io.sockets.emit('repTwitt', data);
                if(data.event == "follow")
                {
                io.sockets.emit('followTwitt', data);
                console.log("someone is following you")
                }
                if(data.event == "favorite")
                {
                io.sockets.emit('favTwitt', data);
                console.log("favorite tweet!")
                }

                if(data.hasOwnProperty("direct_message"))
                {
                io.sockets.emit('directTwitt' , data)
                console.log("dm");

                }

              //  io.sockets.emit('favTwitt', data);
              //  io.sockets.emit('directTwitt', data);
                // if data contains event for favorite

                // if data contains event for direct message

                // if data contains event for someone following account

                // if data contains event for someone unfollowing an account
            })
         })
    }

}

exports.mentionmanagement = function ( req, res) {
    res.render('mentionmanagement' , {});
    if(req.session.oauth) {
            var twit = new twitter({
            consumer_key: CONSUMER_KEY,
            consumer_secret: CONSUMER_SECRET,
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });

    twit.getMentions('', function(err,data)
     {

         // data.on('data', function(d)
         //                        {
         //                             io.sockets.emit('menTwitt', d);
         //                        }
         //                        );

      // console.log(data);
        for(var key in data)
        {
                                var attrName = key;
                                var attrValue = data[key];
                                console.log(attrValue.user.screen_name);

                                // var scope = angular.element($("#mentionApp")).scope();
                                // scope.$apply(function(){
                                // scope.twitts = [{user: {screen_name: 'new'}, text: 'update'}];
                                // })
                                info = { "text":attrValue.text , user:{"screen_name":attrValue.user.screen_name} };

                                io.sockets.emit('menTwitt', info);

                               
        }

    });

    }
}


exports.splash = function (req , res)
{
    {
        res.render('splash' , {});
    }
};


