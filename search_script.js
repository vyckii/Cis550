var app = angular.module('Search', [])
app.controller('SearchController', function($scope, $http) {
    $scope.SearchF = function() {
        var request = $http.get("/search_feature/" + $scope.city + "/" + $scope.feature + "/" + $scope.time)
        console.log($scope.city + " " + $scope.feature)
        request.success(function(data) {
            $scope.data = data
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        })
        request.error(function(data) {
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
        request.error(function(data) {
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
        request.error(function(data) {
            console.log('err')
        })
    }
})
app.controller('ReviewController', function($scope, $http) {
    $scope.Review = function() {
        var request = $http.get("/search_review/" + $scope.name)
        console.log($scope.name)
        request.success(function(data) {
            $scope.data = data
            console.log("get data " + data)
            console.log("scope data" + $scope.data)
        })
        request.error(function(data) {
            console.log('err');
        })
    }
})
app.controller('CommentController', function($scope, $http) {
    $scope.Comment = function() {
        if ($scope.user_id === undefined || $scope.bname === undefined || $scope.subject === undefined || $scope.star === undefined) {
            alert('Missing input!')
            return
        }
        if ($scope.star > 5 || $scope.star < 0) {
            alert('Invalid star!')
            return
        }
        var request = $http.get("/signup_check/" + $scope.user_id)
        request.success(function(data) {
            if (data.length == 0) {
                alert('User not exist!')
                return
            } else {
                var request = $http.get("/business_check/" + $scope.bname)
                request.success(function(data) {
                    if (data.length == 0) {
                        alert('Business not exist!')
                        return
                    } else {
                        var request = $http.get("/review_check/" + $scope.subject)
                        request.success(function(data) {
                            if (data.length != 0) {
                                alert('Subject already exist!')
                                return
                            } else {
                                var request = $http.get("/add_comment/" + $scope.user_id + "/" + $scope.bname + "/" + $scope.subject + "/" + $scope.star + "/" + $scope.ctext)
                                console.log($scope.user_id, $scope.bname, $scope.subject, $scope.star, $scope.ctext)
                                request.success(function(data) {
                                    alert('Comment success!')
                                    location.href='/review'
                                })
                                request.error(function(data) {
                                    console.log('err');
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})