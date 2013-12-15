angular.module('githubAuth', ['ngRoute','firebase'])
.config(['$routeProvider',function(r){

	// Routes
	r
	.when('/',{
		templateUrl : 'views/home.tpl',
	})

	.when('/dashboard',{
		templateUrl : 'views/status.tpl',
		controller 	: 'Dashboard',
	})
	.when('/loc',{
		templateUrl : 'views/loc.tpl',
	})
	.when('/easy',{
		templateUrl : 'views/easy.tpl',
	})
	.when('/add', {
		templateUrl : 'views/add.tpl',
		controller	: 'AddWaypoint'
	})
	.when('/stepTwo', {
		templateUrl : 'views/home.tpl',
		controller	: 'FireLogic'
	})
	.when('/GHID/:id', {
		templateUrl : 'views/status.tpl',
		controller	: 'Status'
	})
	.when('/added', {
		templateUrl : 'views/added.tpl',
	})
	.when('/error/:msg', {
		templateUrl : 'views/error.tpl',
		controller	: 'ErrorLogic'
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
.controller('AuthLogic', ['$scope', 'locService', '$firebase', '$firebaseAuth', '$location',function(s,locService,$firebase,$firebaseAuth,$location){
	s.title = 'Time to show a detail Page Derp derp';
	s.user;

	var url = 'https://chapman.firebaseio.com';
	var sync = $firebase(new Firebase(url)).$bind(s, 'Data');
	
	var authRef = new Firebase(url);
    s.auth = $firebaseAuth(authRef);



    s.loc = locService();

	//Firebase Simple Login Auth Call
	s.authenticateMe = function(){
		s.auth.$login('github', {
			rememberMe: true,
	  		scope: 'user,repo'
		}).then(function(user){
			s.regUser(user);
		});
	}


	s.regUser = function(user){

		user.progress = 0;

		if(s.Data.activeUsers == undefined){
			s.Data.activeUsers = [];
		}

		//if user is new
		if(s.Data.activeUsers[user.id] == undefined){
			s.Data.activeUsers[user.id] = user;
		}
		$location.path('/add');
	}
}])

// Dashboard Controller
.controller('Dashboard', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	//var fbError = new Firebase('https://chapman.firebaseio.com/errors');
	
	s.waypoints = s.Data.locations[s.user.progress];

}])

// Error Controller
.controller('ErrorLogic', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	//var fbError = new Firebase('https://chapman.firebaseio.com/errors');
	s.Data.errors.push({params:params});
	s.errorMsg = 'An error has occurred. [code: ' + params.msg + ']';
	
}])

// Error Controller
.controller('AddWaypoint', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	s.pushWaypoint = function(){
		if(s.Data.locations == undefined){
			s.Data.locations = [];
		}
		s.Data.locations.push({title: s.TitleInput, clue: s.ClueInput, instruction: s.InstructionInput, lat: s.LatInput,lon: s.LonInput, code: s.CodeInput});
		console.log('added waypoint');
	}

	//s.errorMsg = 'An error has occurred. [code: ' + params.msg + ']';
	
}])


// Status Controller
.controller('Status', ['$scope', '$routeParams', function(s,params){
	fb.on('value', function(data){
		var activeUsers = data.val();
		for(user in activeUsers){
			if(activeUsers[user].GHID == params.id){
				s.user = activeUsers[user];
				s.user.fbid = user;
				break;
			}
		}
		console.log('User Info Modified', s.user);
	});

	s.submitCode = function(subCode){
		//s.FoundCodeInput
		for(waypoint in s.fbWaypoints){

			if(subCode == s.fbWaypoints[waypoint].code){
				var tarURL = 'https://chapman.firebaseio.com/activeUsers/' + s.user.fbid + "/waypoints";
				console.log('Selected to add', s.fbWaypoints[waypoint]);
				var fbUserWaypoints = new Firebase(tarURL);
				fbUserWaypoints.push(s.fbWaypoints[waypoint]);
				s.unlocked = true;
				setTimeout(function(){
					s.unlocked = false;
				},2000);
				return true;
				break;
			}
		}
		
		console.log('match not found');

	}
}])



// Second Step Controller
.controller('FireLogic', ['$scope', function(s){
	
	// Check local Storage, if nothing is there, you shouldn't be on this page... Dump out to Error Screen
	if(!localUser){
		window.location = "#/error/Skipped A Step"
	} else {
		//s.displayName = localUser.displayName;
		//window.location = "#/GHID/" + s.user.GHID;

		s.activeUserLookup();
		// On Email Verification Submit
		
	}
	
	//
}]);

var localUser;

//Generic FB Connection. Could be integrated into Core Controller.
var fb = new Firebase('https://chapman.firebaseio.com/activeUsers');
var fbWaypoints = new Firebase('https://chapman.firebaseio.com/waypoints');
var auth = new FirebaseSimpleLogin(fb, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    window.location = "#/error/Database failure - " + error;
  } else if (user) {
    // user authenticated with Firebase
    localUser = user;
    window.location = '#/stepTwo';
//	fb.push({email:'force', githubUserInfo: user});

  } else {
    // user is logged out
  }
});
