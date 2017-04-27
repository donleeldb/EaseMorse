angular.module('starter.controllers', ['ngCordova'])

.controller('encodeCtrl', function($scope, $state, $ionicViewSwitcher,$ionicLoading) {
  $scope.message = "";

  $scope.onEncode = function(){

    $ionicLoading.show({ template: $scope.message, noBackdrop: true, duration: 1000 });

    $ionicViewSwitcher.nextDirection('forward')
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
  $scope.message = "321"; //sample message\

  // Take a character, returns its morse code in strings of 1s and 3s
  $scope.charToMorse= function(a) {
    var index = $scope.charDict.indexOf(a);
    return $scope.morseDict[index];
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
    for (var i = 0; i<morse.length; i++){
      if (morse[i] == "1"){
        $cordovaFlashlight.switchOn();
        wait(500);
        $cordovaFlashlight.switchOff();
      }else if (morse[i] == "3"){
        $cordovaFlashlight.switchOn();
        wait(1500);
        $cordovaFlashlight.switchOff();
      }else {
        wait(500);
      }
    }
  };

  // Take a morse code in form of a 1s 3s string, utilize the speaker to play it
  $scope.playMorseSB= function(morse){

  };

  $scope.onFlashLight = function(){
    for (var i = 0; i < $scope.message.length; i++){
      console.log($scope.message[i]);
      var morse = $scope.charToMorse($scope.message[i]);
      console.log(morse);
      $scope.playMorseFL(morse);
      wait(1500);
    }
    $ionicLoading.show({ template: "flash done", noBackdrop: true, duration: 1000 });
  };

  $scope.onSoundBeep = function(){

  };

  $scope.turnOn = function () {
    $cordovaFlashlight.switchOn();
    $ionicLoading.show({ template: 'On!', noBackdrop: true, duration: 1000 });
  };

  $scope.turnOff = function() {
    $cordovaFlashlight.switchOff();
    $ionicLoading.show({ template: 'Off!', noBackdrop: true, duration: 1000 });
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('decodeCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
