var app = angular.module('Search',[]) 

app.controller('SearchController', function($scope, $http) {
        $scope.SearchF = function() {
        var request = $http.get("/search_feature/" + $scope.city + "/" + $scope.feature + "/" + $scope.time)
        console.log($scope.city + " " + $scope.feature)
        request.success(function(data) {
            $scope.data = data
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        })
        request.error(function(data){
            console.log('err')
        })
    
    } 
})

app.controller('NearMeController', function($scope, $http) {
        $scope.Near = function() {
        var request = $http.get("/search_near/" + $scope.addr + "/" + $scope.feature)
        console.log($scope.city + " " + $scope.feature)
        request.success(function(data) {
            $scope.data = data
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        })
        request.error(function(data){
            console.log('err')
        })
    
    } 
})

app.controller('PopController', function($scope, $http) {
        $scope.Pop = function() {
        var request = $http.get("/search_pop/" + $scope.city + "/" + $scope.feature)
        console.log($scope.city + " " + $scope.feature)
        request.success(function(data) {
            $scope.data = data
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        })
        request.error(function(data){
            console.log('err')
        })
    
    } 
})