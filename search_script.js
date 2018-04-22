var app = angular.module('Search',[]); 

app.controller('SearchController', function($scope, $http) {
        $scope.Search = function() {
        var request = $http.get('/search_script/' + $scope.city + $scope.feature);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});



