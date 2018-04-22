var app = angular.module('Search',[]); 

app.controller('SearchController', function($scope, $http) {
        $scope.SearchF = function() {
        var request = $http.get("/search_feature/" + $scope.city + "/" + $scope.feature);
        console.log($scope.city + " " + $scope.feature)
        request.success(function(data) {
            $scope.data = data;
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        });
        request.error(function(data){
            console.log('err');
        });
    
    }; 
});