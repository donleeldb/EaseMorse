angular.module('starter.controllers', ['ngCordova'])
  //controller for welcome page
  .controller('welcomeCtrl', function($scope, $state, $ionicPopup, $cordovaMedia) {
    //Show a brief introduction of our app
    $scope.intro = function(){
      $ionicPopup.alert({
        title: 'Introduction',
        template: 'Hello! Our EaseMorse app offers a simple way to convert text into morse code, flashlights and beeps. Thanks for using!',
        cssClass: 'animated shake'
      });
    };
    $scope.onEnter = function(){
      $state.go('introduction',{});
    }
  })
  .controller('introCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

    // Called to navigate to the main app
    $scope.startApp = function() {
      $state.go('tab.encode',{});
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  })

.controller('encodeCtrl', function($scope, $state, $ionicViewSwitcher,$ionicLoading) {
  $scope.message = "";

  $scope.onEncode = function(){

    $ionicLoading.show({ template: $scope.message, noBackdrop: true, duration: 1000 });

    $ionicViewSwitcher.nextDirection('forward');
    $state.go("tab.playCode", {
      'message': $scope.message
    })
  };
})

.controller('playCodeCtrl', function($scope, $state, $stateParams, $ionicLoading, $cordovaFlashlight, $timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Iterator i for plugin callbacks
  // var i = 0;

  // All allowed characters placed in a dictionary
  $scope.charDict = ["a","b","c","d","e",
    "f","g","h","i","j",
    "k","l","m","n","o",
    "p","q","r","s","t",
    "u","v","w","x","y",
    "z","0","1","2","3",
    "4","5","6","7","8",
    "9"," "];

  // Morse code for each character in charDict in order
  $scope.morseDict = ["13","311","3131","311","1",
    "1131","331","1111","11","1333",
    "313","1311","33","31","333",
    "1331","3313","131","111","3",
    "113","1113","133","3113","3133",
    "3311","33333","13333","11333","11133",
    "11113","11111","31111","33111","33311",
    "33331", "0"];

  //$scope.message = $stateParams.message;
  /*-- Sample message to be removed after parameters issue --*/
  $scope.message = "2 1"; //sample message\

  // Take a character, returns its morse code in strings of 1s and 3s
  $scope.stringToMorse= function(message) {
    var morse = "";
    var index = 0;
    for (var i = 0; i<message.length; i++){
      index = $scope.charDict.indexOf(message[i]);
      morse += $scope.morseDict[index];
    }
    return morse;
  };

  // Wait x milliseconds
  function wait(ms){
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > ms){
        break;
      }
    }
  }

  // Take a morse code in form of a 1s 3s string, utilize the flash light to play it
  $scope.playMorseFL= function(morse){
    var p = $cordovaFlashlight.available();
    for (var i=0; i < morse.length; i++) {
      if (morse[i] == "1"){
        p=p.then(function (){
          console.log('on for 1');
          return $cordovaFlashlight.switchOn();
        }).then( function (){
          wait(500);
          return $cordovaFlashlight.switchOff();
        }).then( function (){
          wait(500);
          return $cordovaFlashlight.available();
        });
      }else if (morse[i] == "3"){
        p=p.then(function (){
          console.log('on for 3');
          return $cordovaFlashlight.switchOn();
        }).then( function (){
          wait(1500);
          return $cordovaFlashlight.switchOff();
        }).then( function (){
          wait(500);
          return $cordovaFlashlight.available();
        });
      }else {
        p=p.then( function (){
          wait(3500);
          return $cordovaFlashlight.available();
        });
      }
    }
    return p;
  };

  $scope.flash500ms = function() {
    return $cordovaFlashlight.switchOn().then(function () {
      wait(500);
      return $cordovaFlashlight.toggle();
    });
  };

  // Take a morse code in form of a 1s 3s string, utilize the speaker to play it
  $scope.playMorseSB= function(morse){

  };

  // Button function to play morse code with flashlight
  $scope.onFlashLight = function(){
    /*
    var p = $cordovaFlashlight.available();

    for (var i = 0; i < $scope.message.length; i++){
      console.log($scope.message[i]);
      var morse = $scope.charToMorse($scope.message[i]);
      console.log(morse);
      p = p.then (function () {
        return $scope.playMorseFL(morse, p);
      });
      //$scope.playMorseFL(morse, p);
    }
    p = p.then(function (){
      $ionicLoading.show({ template: "flash done", noBackdrop: true, duration: 1000 });
    });
    */
    var morse = $scope.stringToMorse($scope.message);
    //console.log(morse);
    $scope.playMorseFL(morse).then(function (){
      $ionicLoading.show({ template: "flash done", noBackdrop: true, duration: 1000 });
    });
  };

  // Button function to play morse code with speaker
  $scope.onSoundBeep = function(){

    var p = $cordovaFlashlight.available();
    p = p.then( function() {
      wait(1000);
      return $cordovaFlashlight.available();
    });
    p = p.then( function() {
      return $cordovaFlashlight.switchOn();
    });
    p = p.then( function() {
      wait(1000);
      return $cordovaFlashlight.available();
    });
    p = p.then( function() {
      return $cordovaFlashlight.switchOff();
    });
    p = p.then( function() {
      wait(1000);
      return $cordovaFlashlight.available();
    });
    p = p.then( function() {
      return $cordovaFlashlight.switchOn();
    });
    p = p.then( function() {
      wait(1000);
      return $cordovaFlashlight.available();
    });
    p = p.then( function() {
      return $cordovaFlashlight.switchOff();
    });
    /*
    for (var i = 0; i < 4; i++) {
      p = p.then(function () {
        wait(500);
        return $cordovaFlashlight.toggle();
      }).then(function() {
        wait(1000);
        return $cordovaFlashlight.toggle();
      });
    }
    p.then(function() {
      wait(500);
      $cordovaFlashlight.switchOff();
    })*/
  };

  // Test button function to turn on flashlight
  $scope.turnOn = function () {
    $cordovaFlashlight.switchOn();
    $ionicLoading.show({ template: 'On!', noBackdrop: true, duration: 1000 });
  };

  // Test button function to turn off flashlight
  $scope.turnOff = function() {
    $cordovaFlashlight.switchOff();
    $ionicLoading.show({ template: 'Off!', noBackdrop: true, duration: 1000 });
  };
})



.controller('decodeCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
