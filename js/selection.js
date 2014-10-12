angular.module('app', [])
  .controller('SelectionController', function($scope) {

    if (~location.href.indexOf('#')) location.href = location.href.replace(location.hash, '');

    $scope.places = Places;

    $scope.select = function(placeId) {
      location.href = location.origin + location.pathname.split('/').slice(0, -1).join('/') + '/#/' + placeId;
    };

  });
