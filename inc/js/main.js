angular.module('githubAuth', [])
.config(['$routeProvider',function(r){

	// Routes
	r
	.when('/',{
		templateUrl : 'views/home.tpl',
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
.controller('AuthLogic', ['$scope', 'locService', function(s,locService){
	s.title = 'Time to show a detail Page Derp derp';
	s.user;
	s.unlocked = false;
	fbWaypoints.on('value', function(data){
		s.fbWaypoints = data.val();
		for(first in s.fbWaypoints){
			var firstKey = first;
			break;
		}
		s.fbFirstWaypoint = s.fbWaypoints[firstKey]
		console.log('xxx', s.fbFirstWaypoint);
	});

    s.loc = locService();

	//Firebase Simple Login Auth Call
	s.authenticateMe = function(){
		auth.login('github', {
			rememberMe: true,
	  		scope: 'user,repo'
		});
	}


	s.activeUserLookup = function(){

			//Fresh Firebase connection, don't trust anything
			var fbVerify = new Firebase('https://chapman.firebaseio.com/activeUsers');

			//When the Data Async loads
			fbVerify.on('value', function(data){
				var bMatchFound = false;
				var activeUsers = data.val();
				
				// Loop thru each entry
				for(user in activeUsers){

					//Check for Duplicate Email, If found, Fail out to error screen
					if( user.GHID == localUser.GHID ){
						s.bMatchFound = true;
						
						//localUser.waypoints = user.waypoints;

						s.user = activeUsers[user];
						console.log('Match Discovered', s.user);


						window.location = '#/GHID/' + localUser.id;
						return false;
						break; // Really dont let anyone pass =P
					}
				}
				// Email Valid? Inject into Firebase
				if(!bMatchFound){
					fb.push( {GHID:localUser.id, data: localUser, waypoints: [s.fbFirstWaypoint] } );
					window.location = '#/GHID/' + localUser.id;
					return false;
				}	
			});
			
			
			
		}
		if(localUser){
			s.activeUserLookup();
		}
}])

// Error Controller
.controller('ErrorLogic', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	var fbError = new Firebase('https://chapman.firebaseio.com/errors');
	fbError.push({params:params});
	s.errorMsg = 'An error has occurred. [code: ' + params.msg + ']';
	
}])

// Error Controller
.controller('AddWaypoint', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	s.pushWaypoint = function(){
		var fbError = new Firebase('https://chapman.firebaseio.com/waypoints');
		fbError.push({title: s.TitleInput, clue: s.ClueInput, instruction: s.InstructionInput, lat: s.LatInput,lon: s.LonInput, code: s.CodeInput});
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
