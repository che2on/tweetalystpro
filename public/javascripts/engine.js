/**
 * Created with JetBrains WebStorm.
 * User: SantiagoPC
 * Date: 25/08/13
 * Time: 13:38
 * To change this template use File | Settings | File Templates.
 */


function TestApp($scope) {
    $scope.count = 1;
    $scope.countLove = 0;
    $scope.countHate = 0;
    $scope.countMiddle = 0;
    $scope.twitts = [
        {user: {screen_name: 'Test'}, text: 'Text twitt'}
    ];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('newTwitt', function (item) {
        $scope.twitts.push(item);
        $scope.count++;
        if ((item.text.indexOf('amor') != -1 || item.text.indexOf('love') != -1) &&
            (item.text.indexOf('odio') != -1 || item.text.indexOf('hate') != -1)) {
            $scope.countMiddle++;
        }
        else if (item.text.indexOf('amor') != -1 || item.text.indexOf('love') != -1) {
            $scope.countLove++;
            item.color = 'green';
        }
        else {
            $scope.countHate++;
            item.color = 'red';
        }
        //console.log(item);
        if ($scope.twitts.length > 15)
            $scope.twitts.splice(0, 1);
        $scope.$apply();
        $('#chatAudio')[0].play();

    })

}

function mentionApp($scope) 
{
    $scope.twitts = [
           
    ];

    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('menTwitt', function (item)
    {
      //  item = {user: {screen_name: 'new'}, text: 'new!'};
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing tweets");
        $scope.$apply();
    })  

}

function replyApp($scope)
{
    $scope.twitts = [];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('repTwitt', function(item)
    {
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing rep tweets");
        $scope.$apply();

    })
}

function favApp($scope)
{
    $scope.twitts = [];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('favTwitt', function(item)
    {
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing fav tweets");
        $scope.$apply();

    })
}

function followApp($scope)
{
    $scope.twitts = [];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('followTwitt', function(item)
    {
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing follow tweets");
        $scope.$apply();

    })

}


function directApp($scope)
{
    $scope.twitts = [];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('directTwitt', function(item)
    {
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing direct tweets");
        $scope.$apply();

    })

}

