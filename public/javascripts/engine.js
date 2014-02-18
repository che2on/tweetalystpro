/**
 * Created with JetBrains WebStorm.
 * User: SantiagoPC
 * Date: 25/08/13
 * Time: 13:38
 * To change this template use File | Settings | File Templates.
 */


var proApp = angular.module('proApp', []);
var SCREEN_NAME= "";

proApp.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
});


proApp.service('selectionService', function($rootScope) {
  var selected_template = "empty";
  var selected_tweet = "empty";

  this.addTemplate = function(newObj) {
      console.log("newOj is "+newObj.template_text)
      selected_template = newObj;
      $rootScope.$broadcast('someEvent'); 
  };
  this.getTemplate = function(){
      return selected_template;
  };

  this.addTweet = function(newObj) {
      selected_tweet = newObj;
      $rootScope.$broadcast('someotherEvent');
  }

  this.getTweet = function() {
      return selected_tweet;
  }

});

proApp.controller('ClickToEditCtrl' , function ClickToEditCtrl($scope)
{
    $scope.t.template_text = "Welcome to this demo!";
});


proApp.controller('TweetFeed', function ($scope, $http, selectionService) 
{
  $http.get('/mentionmanagement').success(function(data) {
  $scope.twitts = data;
 });


    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('newTwitt', function (item) 
    {
        console.log("pushing .. "+item);
        $scope.twitts.push(item);
        $scope.$apply();
        $('#chatAudio')[0].play();

    })

    $scope.setMaster = function(section)
    {
    selectionService.addTweet(section);
    }

     $scope.delete = function(tmp)
     {
        alert(tmp.text);
        console.log("attempting to delete.. "+tmp.text);
        console.log($scope.twitts);
        $scope.twitts.pop(tmp);
        //return $scope.twitts;
      //  $scope.$apply();
     }

   

   // $scope.$apply();
});

proApp.controller('Templates', function($rootScope, $scope, $http, selectionService)
{
    // $scope.templates = [ 
    // {template_name:"Template 1", template_text:"We apologize for the interruption."} ,
    // {template_name:"Template 2", template_text:"Thank you for contacting us."} ,
    // {template_name:"Template 3", template_text:"We will get back to you shortly."} ,
    // {template_name:"Template 4", template_text:"Please DM your phone number."} ,
    // {template_name:"Template 5", template_text:"Welcome. Have a good day!"} ,
    // {template_name:"Template 6", template_text:"Kindly be patient we are looking into your issue."} ,
    // ];

        $http.get('/verify').success(function(data) 
        {

            console.log("data screen name "+data.screen_name);
            SCREEN_NAME = data.screen_name;
            $http.get('/downloadtemplates?screen_name='+SCREEN_NAME).success(function(data) {
            $scope.templates = data;
            });

        });


   

      $scope.$on('saveEvent', function()
       {
          console.log("Refreshing with new data!");
          $http.get('/downloadtemplates?screen_name='+SCREEN_NAME).success(function(data) {
          $scope.templates = data;
          $('#myModal').modal('hide');
        });
      });



    $scope.openModal = function(tmp)
    {
        console.log("tmp is"+tmp.template_text);
        $rootScope.$broadcast('openmodal',tmp);
    }

    $scope.setTemplate = function(tmp)
    {

        console.log("selected template is "+tmp.template_text);
        selectionService.addTemplate(tmp);
        
    }



    $scope.isSelected = function(tmp)
    {
         return selectionService.addTemplate(tmp);
       // return $scope.selectedtemplate = tmp.template_text;
    }

});

 


proApp.controller('ReplyController', function($scope,$http,selectionService) 
{
    console.log("got this  "+selectionService.getTemplate());
    $scope.$on('someEvent', function(event, e)
    {
    console.log("does it work? "+selectionService.getTemplate().template_text);
    $scope.template = selectionService.getTemplate();
    });

    $scope.$on('someotherEvent', function(event, e)
    {
    console.log("does it work? "+selectionService.getTweet());
    $scope.tweet = selectionService.getTweet();
    });


    // $scope.postReply = function(tmp)
    // {
    //     $http({
    //     url: 'http://samedomain.com/GetPersons',
    //     method: "POST",
    //     data: postData,
    //     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    //     })
    //  .then(function(response) {
    //         // success
    //     }, 
    //     function(response) { // optional
    //         // failed
    //     }
    // );


    // }


});


proApp.controller('ModalController', function($rootScope, $scope, $http)
{

    $scope.$on('openmodal', function(event, tmp)
    {
        var templateobject = {"Modal_title":tmp.template_name, "Modal_content":tmp.template_text};
        console.log("rec..");
        $scope.data = templateobject;
        console.log("received data from broadcast"+tmp.template_text);
    }
    );


    $scope.saveChanges =  function()
    {
       
        $http.get('/updatetemplate?template_name='+$scope.data.Modal_title+'&template_text='+$scope.data.Modal_content).success(function(data) {
       // $scope.templates = data; 
         console.log("success");
          $rootScope.$broadcast('saveEvent');

        });
    }

});

 

function mentionApp($scope) 
{
    $scope.twitts = [
           
    ];

    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('menTwitt', function (item)
    {
        item = {user: {screen_name: 'new'}, text: 'new!'};
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

function retweetedApp($scope)
{
    $scope.twitts = [];
    var socket = io.connect('http://localhost:3001');
    window.socket = socket;
    socket.on('rtTwitt' , function(item)
    {
        console.log("item is "+item);
        $scope.twitts.push(item);
        console.log("pushing retweeted tweets");
        $scope.$apply();

    })
}

