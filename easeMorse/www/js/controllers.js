angular.module('starter.controllers', [])

.controller('homeCtrl', function($scope, $state, $ionicViewSwitcher,$ionicLoading) {
  $scope.message = "";

  $scope.onEncode = function(){

    $ionicLoading.show({ template: $scope.message, noBackdrop: true, duration: 1000 });

    $ionicViewSwitcher.nextDirection('forward')
    $state.go("tab.playCode", {
      'message': $scope.message,
      'message2': '34'
    })
  };
})

.controller('playCodeCtrl', function($scope, $state, $stateParams) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});


  $scope.message = $state.params.message;

  //console.log("omg");
  console.log(""+$scope.message);
  console.log(""+$stateParams.message2);
  console.log($state);

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('detectCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
