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

.controller('encodeCtrl', function($scope, $state, $ionicViewSwitcher,$ionicLoading, $rootScope) {
  $scope.message = "";
//////////////////////////////////////////////////
  var vm = this;

  vm.displayTranscript = displayTranscript;
  vm.transcript = '';

  /**
   * Handle the received transcript here.
   * The result from the Web Speech Recognition will
   * be set inside a $rootScope variable. You can use it
   * as you want.
   */
  function displayTranscript() {
    vm.transcript = $rootScope.transcript;

    //This is just to refresh the content in the view.
    if (!$scope.$$phase) {
      $scope.$digest();
    }
  }

  // Button to transfer to playCode state and passes the message
  $scope.onEncode = function(){

    $ionicLoading.show({ template: $scope.message, noBackdrop: true, duration: 1000 });

    $ionicViewSwitcher.nextDirection('forward');
    $state.go("tab.playCode", {
      ///'message': $scope.message
      'message': $rootScope.transcript + $scope.message
    });
    $rootScope.transcript = "";
  };
})

.controller('playCodeCtrl', function($scope, $state, $stateParams, $ionicLoading, $cordovaFlashlight, $cordovaVibration, $timeout) {
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
  $scope.morseDict = ["130","3110","31310","3110","10",
    "11310","3310","11110","110","13330",
    "3130","13110","330","310","3330",
    "13310","33130","1310","1110","30",
    "1130","11130","1330","31130","31330",
    "33110","333330","133330","113330","111330",
    "111130","111110","311110","331110","333110",
    "333310", "000"];

  // Aquire to-be-encoded message from stateParams,
  // If undefined, set to empty string
  $scope.message = "";
  if ($stateParams.message != "undefined")
  $scope.message = $stateParams.message;

  // Set up sound beep files
  var beepSrc1 = "/www/audio/censor-beep-01.mp3";
  var beepSrc2 = "/www/audio/censor-beep-3.mp3";
  var



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
          wait(1000);
          return $cordovaFlashlight.available();
        });
      }
    }
    return p;
  };

  // Take a morse code in form of a 1s 3s string, utilize the speaker to play it
  $scope.playMorseSB= function(morse){

  };

  // Take a morse code in form of a 1s 3s string, utilize cordova vibrate to play it
  $scope.playMorseV = function(morse){
    var p = $cordovaFlashlight.available();
    for (var i = 0; i<morse.length; i++){
      if (morse[i] == "1"){
        p = p.then(function (){
          console.log('on for 1');
          $cordovaVibration.vibrate(500);
          return $cordovaFlashlight.available();
        }).then( function (){
          wait(500);
          return $cordovaFlashlight.available();
        });
      } else if (morse[i] == "3"){
        p = p.then(function () {
          console.log('on for 3');
          $cordovaVibration.vibrate(1500);
          return $cordovaFlashlight.available();
        }).then( function (){
          wait(500);
          return $cordovaFlashlight.available();
        });
      } else {
          p=p.then( function (){
            wait(1000);
            return $cordovaFlashlight.available();
          });
        }
      }
      return p;
  };

  // Button function to play morse code with flashlight
  $scope.onFlashLight = function(){
    var morse = $scope.stringToMorse($scope.message);
    $scope.playMorseFL(morse).then(function (){
      $ionicLoading.show({ template: "flash done", noBackdrop: true, duration: 1000 });
    });
  };

  // Button function to play morse code with speaker
  $scope.onSoundBeep = function(){
    var morse = $scope.stringToMorse($scope.message);
    $scope.playMorseSB(morse).then(function (){
      $ionicLoading.show({ template: "beep done", noBackdrop: true, duration: 1000 });
    })
  };

  // Button function to play morse code with vibrate
  $scope.onVibrate = function(){
    var morse = $scope.stringToMorse($scope.message);
    $scope.playMorseV(morse).then( function () {
      $ionicLoading.show({ template: "vibrate done", noBackdrop: true, duration: 1000 });
    })
  };

  /*

  // Test button function to turn on vibrate
  $scope.vibrate1 = function(){
    $cordovaVibration.vibrate(500);
  }
  $scope.vibrate2 = function(){
    $cordovaVibration.vibrate(1500);
  }
  $scope.onClear = function() {
    $scope.message = "";
    console.log('Refreshing');
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, 1250);
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
  */
})



.controller('decodeCtrl', function($scope, $timeout) {
  $scope.settings = {
    enableFriends: true
  };

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
  $scope.morseDict = ["130","3110","31310","3110","10",
    "11310","3310","11110","110","13330",
    "3130","13110","330","310","3330",
    "13310","33130","1310","1110","30",
    "1130","11130","1330","31130","31330",
    "33110","333330","133330","113330","111330",
    "111130","111110","311110","331110","333110",
    "333310", "000"];

  $scope.message = "";
  $scope.currMorse = "";
  $scope.currMorseDashDot = "";

  $scope.morseToChar = function(morse) {
    var index = $scope.morseDict.indexOf(morse);
    return $scope.charDict[index];
  };


  // Button dot
  $scope.onDot = function(){
    $scope.currMorse += "1";
    $scope.currMorseDashDot += "•";
  };

  // Button dash
  $scope.onDash = function(){
    $scope.currMorse += "3";
    $scope.currMorseDashDot += "-";
  };

  $scope.onSpace = function(){
    $scope.currMorse = "000";
    var char = $scope.morseToChar($scope.currMorse);
    $scope.message += char;
    $scope.currMorse="";
  };

  $scope.onAdd = function(){
    if($scope.currMorse == "")
    {
      $ionicPopup.alert({
        title: 'Introduction',
        template: 'Hello! Our EaseMorse app offers a simple way to convert text into morse code, flashlights and beeps. Thanks for using!',
        cssClass: 'animated shake'
      });
    }
    else {
      $scope.currMorse += "0";
      var char = $scope.morseToChar($scope.currMorse);
      console.log(char);
      $scope.message += char;
      $scope.currMorse = "";
      $scope.currMorseDashDot = "";
    }
  };

  $scope.onClear = function() {
    $scope.message = "";
    $scope.currMorseDashDot = "";
    $scope.currMorse = "";
    console.log('Refreshing');
    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.refreshComplete');
    }, 1250);
  };



});
