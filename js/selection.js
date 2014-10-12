angular.module('app', [])
  .controller('SelectionController', function($scope) {

    history.pushState(null, document.title, window.location.pathname);

    $scope.places = Places;

    $scope.select = function(placeId) {
      history.pushState(null, document.title, location.pathname.split('/').slice(0, -1).join('/') + '/#/' + placeId);
      location.reload();
    };

  });
