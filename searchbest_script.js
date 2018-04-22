var app = angular.module('SearchBest',[]); 

app.controller('SearchBestController', function($scope, $http) {
        $scope.Search = function() {
        var request = $http.get('/searchbest_script/' + $scope.city);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});



