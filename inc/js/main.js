angular.module('githubAuth', ['ngRoute','firebase'])
.config(['$routeProvider',function(r){

	// Routes
	r
	.when('/',{
		templateUrl : 'views/dashboard.tpl',
		controller 	: 'Dashboard',
	})

	.when('/dashboard',{
		templateUrl : 'views/dashboard.tpl',
		controller 	: 'Dashboard',
	})

}])

.factory('locService', ['$q', '$rootScope', function($q, $rootScope) {
    return function() {
        var d = $q.defer();
        setTimeout(function () {
            try {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            $rootScope.$apply(function () {
                                console.log('Updating Loc', position);
                                $rootScope.Data = position;
                                d.resolve({
                                    data: position
                                });
                            });
                        },
                        function (error) {
                            d.reject(error);
                        }
                    );
                }
                else {
                    d.reject('location services not allowed');
                }
            }
            catch (err) {
                d.reject(err);
            }
        }, 1000);
        return d.promise;
    };}])


// Core Controller
.controller('AuthLogic', ['$scope', 'locService', '$firebase', '$firebaseAuth', '$location', '$rootScope', function(s,locService,$firebase,$firebaseAuth,$location,$rootScope){
	s.title = 'Time to show a detail Page Derp derp';
	s.user;

	var url = 'https://chapman.firebaseio.com/currentLoc';
	var sync = $firebase(new Firebase(url)).$bind($rootScope, 'Data');
	


    s.loc = locService();




}])

// Dashboard Controller
.controller('Dashboard', ['$scope', '$routeParams', '$rootScope', function(s,params,$rootScope){

	// Don't trust current Firebase connection, create new, and apply error to log
	//var fbError = new Firebase('https://chapman.firebaseio.com/errors');
	
	

}])