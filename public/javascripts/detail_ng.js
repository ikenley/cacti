/******************************************************************************
 detail.js: Client side logic for Detail page
 *****************************************************************************/

var app = angular.module('detailApp', []);

app.service('detailService', ['$http','$q', function($http, $q) {

    /* Fetches comments for a given emoji */
    this.getComments = function(emoji) {
        var deferred = $q.defer();
        $http.get('/comment/get/' + emoji._id)
            .success(function(comments) {
                deferred.resolve(comments);
            }).error(function(msg, code) {
                deferred.reject(msg);
            });
        return deferred.promise;
    }

    /* Creates a new comment for a given emoji */
    this.addComment = function(emoji, desc) {
        var deferred = $q.defer();
        $http.post('/comment/add/' + emoji._id,
            {
                desc: desc
            })
            .success(function(comment) {
                deferred.resolve(comment);
            }).error(function(msg, code) {
                deferred.reject(msg);
            });
        return deferred.promise;
    }

    this.vote = function(emoji) {
        return null; //TODO
    }
}]);

app.controller('DetailController', ['$scope','detailService', function($scope, detailService) {
    //Initialize emoji, comments
    $scope.emoji = pageConfig.emoji;
    detailService.getComments(($scope.emoji)).then(function (comments) {
        $scope.comments = comments;
    })

    $scope.addComment = function() {
        if ($scope.formComment.txtComment.$valid) {
            detailService.addComment($scope.emoji, $scope.desc).then(function(comment) {
                $scope.comments.unshift(comment);
            })
        }
    }

    $scope.vote = function(comment) {
        ;   //TODO
    }
}]);


