angular.module('starter.controllers', [])

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

.controller('playCodeCtrl', function($scope, $state, $stateParams, $ionicLoading) {
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

  $scope.message = $stateParams.message;
  /*-- Sample message to be removed after parameters issue --*/
  $scope.message = "sample input message";

  // Take a character, returns its morse code in strings of 1s and 3s
  $scope.charToMorse= function(a) {
    var index = $scope.charDict.indexOf(a);
    return $scope.morseDict[index];
  };

  // Take a morse code in form of a 1s 3s string, utilize the flash light to play it
  $scope.playMorseFL= function(a){
  };

  // Take a morse code in form of a 1s 3s string, utilize the speaker to play it

  $scope.onFlashLight = function(){

    $ionicLoading.show({ template: "Implementing Flashlight", noBackdrop: true, duration: 1000 });

    for (var i = 0; i < $scope.message.length; i++){

      console.log($scope.charToMorse($scope.message[i]));

      var morse = $scope.charToMorse($scope.message[i]);
      $scope.playMorseFL(morse);
    }
  };

  $scope.onSoundBeep = function(){
    $ionicLoading.show({ template: "Implementing Soundbeep", noBackdrop: true, duration: 1000 });

    for (var i = 0; i<$scope.message; i++){

    }
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
