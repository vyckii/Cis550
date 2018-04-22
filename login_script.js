var app = angular.module('Login', [])
app.controller('logController', function($scope, $http) {
            $scope.Verify = function() {
                if($scope.user_id === undefined || $scope.user_pass === undefined){
                	alert('Invalid user id or password!')
                	return
                }
                var request = $http.get("/login_info/" + $scope.user_id + "/" + $scope.user_pass)
                request.success(function(data) {
                    if (data.length != 0) {
                        console.log(data)
                        location.href='/search'
                    } else {
                        alert('User not exist or wrong info!')
                    }
                })
                request.error(function(data) {
                    console.log('err')
                })
            }
            $scope.Create = function() {
            	if($scope.user_id === undefined || $scope.user_pass === undefined){
                	alert('Invalid user id or password!')
                	return
                }
                var request = $http.get("/signup_check/" + $scope.user_id)
                request.success(function(data) {
                    if (data.length != 0) {
                        alert('User already exist!')
                        console.log(data)
                    } else {
                        request = $http.get("/signup_info/" + $scope.user_id + "/" + $scope.user_pass)
                        request.success(function(data) {
                            alert('Register success!')
                            location.href='/search'
                        })
                        request.error(function(data) {
                            console.log('err')
                        })
                    }
                })
            }
        })