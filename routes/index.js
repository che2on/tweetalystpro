/*
 * GET home page.
 */
var twitter = require('ntwitter');
var io = require('socket.io').listen(3001, {log: false});
exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
    if (req.session.oauth) {
        var twit = new twitter({
            consumer_key: "A6x1nzmmmerCCmVN8zTgew",
            consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });


        twit
            .verifyCredentials(function (err, data) {
                console.log(err, data);
            });
            
        


        twit.stream(
            'statuses/filter',
            {track: ['amor', 'odio', 'love', 'hate']},
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
            consumer_key: "A6x1nzmmmerCCmVN8zTgew",
            consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
            access_token_key: req.session.oauth.access_token,
            access_token_secret: req.session.oauth.access_token_secret
        });


        twit.stream(
            'statuses/filter',
            {track: ['vodafoneIN', 'vodafone india', 'vodafone karnataka', 'vodafone', ]},
            function (stream)
             {
                console.log("stream is"+stream);

                stream.on('data', function (data) {
                    //console.log(data);
                    //console.log(data.user.screen_name + " : " + data.text);
                    io.sockets.emit('newTwitt', data);
                    // throw  new Exception('end');
                });
            }
        );
    }

}

exports.mentionmanagement = function ( req, res) {
    res.render('mentionmanagement' , {});
    if(req.session.oauth) {
            var twit = new twitter({
            consumer_key: "A6x1nzmmmerCCmVN8zTgew",
            consumer_secret: "oOMuBkeqXLqoJkSklhpTrsvuZXo9VowyABS8EkAUw",
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


